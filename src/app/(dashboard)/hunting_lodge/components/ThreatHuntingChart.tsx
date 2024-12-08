'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import type { EventTableElement } from '@/features/dashboard_v2/types';
import { RuleMitreTactic, RuleMitreID } from '@/features/dashboard_v2/types/event_table';

interface Props {
    data: EventTableElement[];
}

interface AgentNode extends d3.SimulationNodeDatum {
    id: string;
    type: 'agent';
    label: string;
    events: EventTableElement[];
    tactics: Set<RuleMitreTactic>;
    techniques: Set<RuleMitreID>;
    maxSeverity: number;
}

interface AgentLink extends d3.SimulationLinkDatum<AgentNode> {
    source: AgentNode;
    target: AgentNode;
    type: 'lateral_movement' | 'similar_pattern';
    events: EventTableElement[];
}

const COLORS = {
    critical: 'hsl(var(--destructive))',
    high: 'hsl(var(--chart-3))',
    medium: 'hsl(var(--chart-4))',
    low: 'hsl(var(--chart-2))',
};

export default function ThreatHuntingChart({ data }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

    // Process data to show agent relationships
    const processedData = useMemo(() => {
        const nodes: AgentNode[] = [];
        const links: AgentLink[] = [];
        const agentMap = new Map<string, AgentNode>();

        // Group events by agent
        data.forEach(event => {
            if (!agentMap.has(event.agent_name)) {
                agentMap.set(event.agent_name, {
                    id: event.agent_name,
                    type: 'agent',
                    label: event.agent_name,
                    events: [],
                    tactics: new Set(),
                    techniques: new Set(),
                    maxSeverity: 0
                });
            }
            const agentNode = agentMap.get(event.agent_name)!;
            agentNode.events.push(event);
            if (event.rule_mitre_tactic !== RuleMitreTactic.Empty) {
                agentNode.tactics.add(event.rule_mitre_tactic);
            }
            if (event.rule_mitre_id !== RuleMitreID.Empty) {
                agentNode.techniques.add(event.rule_mitre_id);
            }
            agentNode.maxSeverity = Math.max(agentNode.maxSeverity, event.rule_level);
        });

        // @ts-ignore
        nodes.push(...agentMap.values());

        // Find relationships between agents
        const agents = Array.from(agentMap.values());
        for (let i = 0; i < agents.length; i++) {
            for (let j = i + 1; j < agents.length; j++) {
                const agent1 = agents[i];
                const agent2 = agents[j];

                // Check for lateral movement
                const hasLateralMovement = agent1.events.some(e1 =>
                    e1.rule_mitre_tactic === RuleMitreTactic.LateralMovement &&
                    agent2.events.some(e2 =>
                        Math.abs(new Date(e2.timestamp).getTime() - new Date(e1.timestamp).getTime()) < 300000 // 5 minutes
                    )
                );

                // Check for similar attack patterns
                // @ts-ignore
                const sharedTactics = new Set([...agent1.tactics].filter(x => agent2.tactics.has(x)));
                // @ts-ignore
                const sharedTechniques = new Set([...agent1.techniques].filter(x => agent2.techniques.has(x)));
                const hasSimilarPatterns = sharedTactics.size > 0 || sharedTechniques.size > 0;

                if (hasLateralMovement || hasSimilarPatterns) {
                    const relatedEvents = agent1.events.filter(e1 =>
                        agent2.events.some(e2 =>
                            e1.rule_mitre_tactic === e2.rule_mitre_tactic ||
                            e1.rule_mitre_id === e2.rule_mitre_id
                        )
                    );

                    links.push({
                        source: agent1,
                        target: agent2,
                        type: hasLateralMovement ? 'lateral_movement' : 'similar_pattern',
                        events: relatedEvents
                    });
                }
            }
        }

        return { nodes, links };
    }, [data]);

    const getNodeColor = (node: AgentNode): string => {
        if (node.maxSeverity >= 10) return COLORS.critical;
        if (node.maxSeverity >= 7) return COLORS.high;
        if (node.maxSeverity >= 4) return COLORS.medium;
        return COLORS.low;
    };

    const getNodeSize = (node: AgentNode): number => {
        return Math.max(40, Math.min(80, 40 + node.events.length * 2));
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height: Math.max(height, 600) });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        // Filter nodes based on selected severity
        const filteredNodes = selectedSeverity === 'all'
            ? processedData.nodes
            : processedData.nodes.filter(node => {
                switch (selectedSeverity) {
                    case 'critical': return node.maxSeverity >= 10;
                    case 'high': return node.maxSeverity >= 7 && node.maxSeverity < 10;
                    default: return true;
                }
            });

        const nodeIds = new Set(filteredNodes.map(n => n.id));
        const filteredLinks = processedData.links.filter(link =>
            nodeIds.has(link.source.id) && nodeIds.has(link.target.id)
        );

        // Create main group for zoom
        const g = svg.append('g');

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create simulation
        const simulation = d3.forceSimulation<AgentNode>()
            .nodes(filteredNodes)
            .force('link', d3.forceLink<AgentNode, AgentLink>(filteredLinks)
                .id(d => d.id)
                .distance(150))
            .force('charge', d3.forceManyBody<AgentNode>().strength(-1000))
            .force('center', d3.forceCenter<AgentNode>(dimensions.width / 2, dimensions.height / 2))
            .force('collision', d3.forceCollide<AgentNode>().radius(d => getNodeSize(d) + 10));

        // Create links
        const link = g.append('g')
            .selectAll('line')
            .data(filteredLinks)
            .enter().append('line')
            .attr('stroke', d => d.type === 'lateral_movement' ? 'hsl(var(--destructive))' : 'hsl(var(--accent))')
            .attr('stroke-width', d => Math.sqrt(d.events.length))
            .attr('stroke-dasharray', d => d.type === 'lateral_movement' ? 'none' : '5,5')
            .attr('opacity', 0.6);

        // Create nodes
        const node = g.append('g')
            .selectAll('g')
            .data(filteredNodes)
            .enter().append('g')
            .attr('class', 'node')
            .call(d3.drag<SVGGElement, AgentNode>()
                .on('start', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('drag', (event, d) => {
                    d.fx = event.x;
                    d.fy = event.y;
                })
                .on('end', (event, d) => {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }));

        // Add circles for nodes
        node.append('circle')
            .attr('r', d => getNodeSize(d))
            .attr('fill', d => getNodeColor(d))
            .attr('stroke', 'hsl(var(--background))')
            .attr('stroke-width', 2);

        // Add labels
        node.append('text')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .attr('fill', 'hsl(var(--background))')
            .attr('font-size', '12px')
            .text(d => d.label);

        // Add tooltips
        node.append('title')
            .text(d => {
                const tactics = Array.from(d.tactics).join(', ');
                const techniques = Array.from(d.techniques).join(', ');
                return `Agent: ${d.label}\n` +
                    `Events: ${d.events.length}\n` +
                    `Max Severity: ${d.maxSeverity}\n` +
                    `Tactics: ${tactics || 'None'}\n` +
                    `Techniques: ${techniques || 'None'}`;
            });

        // Update positions
        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x || 0)
                .attr('y1', d => d.source.y || 0)
                .attr('x2', d => d.target.x || 0)
                .attr('y2', d => d.target.y || 0);

            node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
        });

        return () => {
            simulation.stop();
        };
    }, [dimensions, processedData, selectedSeverity]);

    return (
        <div className="w-full h-full bg-card rounded-lg shadow-sm p-6" ref={containerRef}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-card-foreground">Agent Relationship Analysis</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSelectedSeverity('all')}
                        className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === 'all'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setSelectedSeverity('critical')}
                        className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === 'critical'
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        Critical
                    </button>
                    <button
                        onClick={() => setSelectedSeverity('high')}
                        className={`px-3 py-1 rounded-full text-sm ${selectedSeverity === 'high'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        High
                    </button>
                </div>
            </div>
            <div className="relative">
                <svg ref={svgRef} className="w-full h-[600px] bg-card" />
                <div className="absolute top-4 right-4 bg-card/80 p-3 rounded-lg shadow-sm border border-border">
                    <div className="text-sm font-medium mb-2 text-card-foreground">Legend</div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.critical }} />
                            <span className="text-sm text-muted-foreground">Critical Severity Agent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.high }} />
                            <span className="text-sm text-muted-foreground">High Severity Agent</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-0.5" style={{ backgroundColor: 'hsl(var(--destructive))' }} />
                            <span className="text-sm text-muted-foreground">Lateral Movement</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-0.5" style={{ backgroundColor: 'hsl(var(--accent))', strokeDasharray: '5,5' }} />
                            <span className="text-sm text-muted-foreground">Similar Attack Pattern</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
                * Node size indicates number of events. Solid lines show lateral movement between agents,
                dashed lines show similar attack patterns. Hover for details.
            </div>
        </div>
    );
}

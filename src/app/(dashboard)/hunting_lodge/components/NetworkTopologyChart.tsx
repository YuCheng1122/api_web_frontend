'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import type { EventTableElement } from '@/features/dashboard_v2/types';

interface Props {
    data: EventTableElement[];
}

interface Node extends d3.SimulationNodeDatum {
    id: string;
    group: number;
    radius: number;
    status: 'normal' | 'attacked' | 'source';
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

interface Link extends d3.SimulationLinkDatum<Node> {
    source: string | Node;
    target: string | Node;
    value: number;
    type: 'attack' | 'communication';
}

interface Graph {
    nodes: Node[];
    links: Link[];
}

const NODE_COLORS = {
    normal: 'hsl(var(--chart-2))',   // emerald
    attacked: 'hsl(var(--destructive))', // red
    source: 'hsl(var(--chart-3))'    // amber
};

export default function NetworkTopologyChart({ data }: Props) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Process data to create network graph
    const processData = (): Graph => {
        const nodes = new Map<string, Node>();
        const links = new Map<string, Link>();

        // Add all agents as nodes
        data.forEach(event => {
            if (!nodes.has(event.agent_name)) {
                nodes.set(event.agent_name, {
                    id: event.agent_name,
                    group: 1,
                    radius: 30, // Increased radius for better visibility
                    status: 'normal'
                });
            }
        });

        // Process events to create links and update node statuses
        data.forEach(event => {
            if (event.rule_level >= 7) { // High severity events
                const sourceNode = nodes.get(event.agent_name);
                if (sourceNode) {
                    sourceNode.status = 'attacked';
                }

                // Create links based on related events
                data.forEach(relatedEvent => {
                    if (relatedEvent.timestamp > event.timestamp &&
                        relatedEvent.agent_name !== event.agent_name &&
                        Math.abs(new Date(relatedEvent.timestamp).getTime() -
                            new Date(event.timestamp).getTime()) < 300000) { // Within 5 minutes

                        const linkKey = `${event.agent_name}-${relatedEvent.agent_name}`;
                        if (!links.has(linkKey)) {
                            links.set(linkKey, {
                                source: event.agent_name,
                                target: relatedEvent.agent_name,
                                value: 1,
                                type: 'attack'
                            });
                        } else {
                            const link = links.get(linkKey)!;
                            link.value++;
                        }
                    }
                });
            }
        });

        return {
            nodes: Array.from(nodes.values()),
            links: Array.from(links.values())
        };
    };

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!svgRef.current || dimensions.width === 0) return;

        // Clear previous visualization
        d3.select(svgRef.current).selectAll('*').remove();

        const graph = processData();

        // Create SVG
        const svg = d3.select(svgRef.current)
            .attr('width', dimensions.width)
            .attr('height', dimensions.height);

        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                g.attr('transform', event.transform);
            });

        svg.call(zoom);

        // Create main group for zoom
        const g = svg.append('g');

        // Create simulation
        const simulation = d3.forceSimulation<Node>(graph.nodes)
            .force('link', d3.forceLink<Node, Link>(graph.links)
                .id(d => d.id)
                .distance(150)) // Increased distance
            .force('charge', d3.forceManyBody<Node>().strength(-500)) // Increased repulsion
            .force('center', d3.forceCenter<Node>(dimensions.width / 2, dimensions.height / 2))
            .force('collision', d3.forceCollide<Node>().radius(d => d.radius + 20)); // Increased collision radius

        // Create arrow marker
        g.append('defs').selectAll('marker')
            .data(['attack', 'communication'])
            .enter().append('marker')
            .attr('id', d => `arrow-${d}`)
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 35) // Adjusted for larger nodes
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('fill', d => d === 'attack' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))')
            .attr('d', 'M0,-5L10,0L0,5');

        // Create links
        const links = g.append('g')
            .selectAll('line')
            .data(graph.links)
            .enter().append('line')
            .attr('stroke-width', d => Math.sqrt(d.value) * 2) // Increased width
            .attr('stroke', d => d.type === 'attack' ? 'hsl(var(--destructive))' : 'hsl(var(--muted-foreground))')
            .attr('marker-end', d => `url(#arrow-${d.type})`);

        // Create nodes
        const nodes = g.append('g')
            .selectAll('g')
            .data(graph.nodes)
            .enter().append('g')
            .call(d3.drag<SVGGElement, Node>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended));

        // Add circles to nodes
        nodes.append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d => NODE_COLORS[d.status])
            .attr('stroke', 'hsl(var(--background))')
            .attr('stroke-width', 2);

        // Add labels to nodes
        nodes.append('text')
            .text(d => d.id)
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .attr('fill', 'hsl(var(--foreground))')
            .attr('font-size', '14px'); // Increased font size

        // Add title for hover effect
        nodes.append('title')
            .text(d => `Agent: ${d.id}\nStatus: ${d.status}`);

        // Update positions on simulation tick
        simulation.on('tick', () => {
            links
                .attr('x1', d => (d.source as Node).x!)
                .attr('y1', d => (d.source as Node).y!)
                .attr('x2', d => (d.target as Node).x!)
                .attr('y2', d => (d.target as Node).y!);

            nodes.attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // Drag functions
        function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [dimensions, data]);

    return (
        <div className="w-full h-full" ref={containerRef}>
            <svg ref={svgRef} className="w-full h-full bg-card" />
            <div className="absolute top-4 right-4 bg-card/80 p-3 rounded-lg shadow-sm border border-border">
                <div className="text-sm font-medium mb-2 text-card-foreground">Legend</div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.normal }} />
                        <span className="text-sm text-muted-foreground">Normal Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.attacked }} />
                        <span className="text-sm text-muted-foreground">Attacked Agent</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NODE_COLORS.source }} />
                        <span className="text-sm text-muted-foreground">Attack Source</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

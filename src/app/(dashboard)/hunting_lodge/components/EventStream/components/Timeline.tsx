'use client';

import { FC, useEffect } from 'react';
import * as d3 from 'd3';
import type { TimelineProps } from '../types';
import { groupEventsBySeverity } from '../utils';
import { SEVERITY_COLORS } from '../constants';

export const Timeline: FC<TimelineProps> = ({ timelineRef, events, isMobile }) => {
    useEffect(() => {
        if (!timelineRef.current) return;

        const width = timelineRef.current.clientWidth;
        const height = isMobile ? 40 : 50;
        const margin = { top: 8, right: 8, bottom: 8, left: 8 };

        const svg = d3.select(timelineRef.current);
        svg.selectAll('*').remove();

        const grouped = groupEventsBySeverity(events);
        const total = grouped.reduce((sum, g) => sum + g.count, 0);

        if (total === 0) {
            svg.append('rect')
                .attr('x', margin.left)
                .attr('y', margin.top)
                .attr('width', width - margin.left - margin.right)
                .attr('height', height - margin.top - margin.bottom)
                .attr('fill', '#E5E7EB')
                .attr('opacity', 0.5)
                .attr('rx', 3);
            return;
        }

        let x = margin.left;
        grouped.forEach(group => {
            if (group.count === 0) return;

            const barWidth = (group.count / total) * (width - margin.left - margin.right);

            if (!isNaN(barWidth) && barWidth > 0) {
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', margin.top)
                    .attr('width', barWidth)
                    .attr('height', height - margin.top - margin.bottom)
                    .attr('fill', SEVERITY_COLORS[group.severity].fill)
                    .attr('opacity', 0.7)
                    .attr('rx', 3);

                if (barWidth > 30) {
                    svg.append('text')
                        .attr('x', x + barWidth / 2)
                        .attr('y', height / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', 'white')
                        .attr('font-size', isMobile ? '8px' : '10px')
                        .text(`${group.count}`);
                }

                x += barWidth;
            }
        });
    }, [events, isMobile, timelineRef]);

    return (
        <svg ref={timelineRef} className="w-full" height={isMobile ? "40" : "50"} />
    );
};

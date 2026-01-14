"use client";

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Story } from '@/types';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

interface StoryVisualizerProps {
  story: Story;
  onNodeClick: (nodeId: string) => void;
}

interface NodePosition {
  x: number;
  y: number;
  id: string;
}

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;
const H_GAP = 60;
const V_GAP = 60;

export function StoryVisualizer({ story, onNodeClick }: StoryVisualizerProps) {
  const { positions, edges, width, height } = useMemo(() => {
    if (!story || !story.nodes || !story.rootNodeId) return { positions: new Map(), edges: [], width: 0, height: 0 };

    const positions = new Map<string, NodePosition>();
    const edges: { from: NodePosition; to: NodePosition }[] = [];
    const childrenMap = new Map<string, string[]>();
    const depthMap = new Map<string, number>();
    const levelMap = new Map<number, string[]>();

    Object.values(story.nodes).forEach(node => {
        if(node.parentId) {
            if(!childrenMap.has(node.parentId)) childrenMap.set(node.parentId, []);
            childrenMap.get(node.parentId)!.push(node.id);
        }
    });

    const traverse = (nodeId: string, depth: number) => {
        depthMap.set(nodeId, depth);
        if(!levelMap.has(depth)) levelMap.set(depth, []);
        levelMap.get(depth)!.push(nodeId);

        const children = childrenMap.get(nodeId) || [];
        children.forEach(childId => traverse(childId, depth + 1));
    }
    
    traverse(story.rootNodeId, 0);
    
    let maxWidth = 0;
    let maxHeight = 0;

    levelMap.forEach((nodesAtLevel, depth) => {
        const levelWidth = nodesAtLevel.length * (NODE_WIDTH + H_GAP) - H_GAP;
        nodesAtLevel.forEach((nodeId, index) => {
            const x = (index * (NODE_WIDTH + H_GAP)) - levelWidth / 2;
            const y = depth * (NODE_HEIGHT + V_GAP);
            positions.set(nodeId, { id: nodeId, x, y });
            maxWidth = Math.max(maxWidth, Math.abs(x) * 2 + NODE_WIDTH);
            maxHeight = Math.max(maxHeight, y + NODE_HEIGHT);
        });
    });

    Object.values(story.nodes).forEach(node => {
        if (node.parentId && positions.has(node.id) && positions.has(node.parentId)) {
            edges.push({
                from: positions.get(node.parentId)!,
                to: positions.get(node.id)!,
            });
        }
    });

    return { positions, edges, width: maxWidth, height: maxHeight };
  }, [story]);

  if (!story) return null;

  return (
    <ScrollArea className="w-full h-full bg-secondary/30 rounded-lg border">
        <div className="p-4" style={{ width: Math.max(width, 600), height: Math.max(height, 400) }}>
            <svg width={width} height={height} className="absolute top-0 left-0">
                <defs>
                    <marker
                        id="arrow"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="hsl(var(--border))" />
                    </marker>
                </defs>
                <g transform={`translate(${width / 2}, ${V_GAP})`}>
                {edges.map(({ from, to }, i) => (
                    <motion.path
                        key={i}
                        d={`M ${from.x + NODE_WIDTH / 2} ${from.y + NODE_HEIGHT} C ${from.x + NODE_WIDTH / 2} ${from.y + NODE_HEIGHT + V_GAP/2}, ${to.x + NODE_WIDTH / 2} ${to.y - V_GAP/2}, ${to.x + NODE_WIDTH / 2} ${to.y}`}
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="2"
                        markerEnd="url(#arrow)"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                    />
                ))}
                </g>
            </svg>
             <div className="relative" style={{ width, height }}>
                <div style={{ transform: `translate(${width / 2}px, ${V_GAP}px)` }}>
                    <AnimatePresence>
                        {Array.from(positions.values()).map((pos, i) => (
                        <motion.div
                            key={pos.id}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px hsla(var(--foreground) / 0.1)" }}
                            whileTap={{ scale: 0.98 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                width: NODE_WIDTH,
                                height: NODE_HEIGHT,
                            }}
                        >
                            <button
                                onClick={() => onNodeClick(pos.id)}
                                className={cn(
                                    "w-full h-full p-2 rounded-lg border-2 text-xs transition-all flex items-center justify-center text-center overflow-hidden",
                                    pos.id === story.currentNodeId
                                    ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                                    : "bg-card border-border hover:border-primary"
                                )}
                            >
                                <p className="truncate-3-lines">{story.nodes[pos.id]?.choice || "The Beginning"}</p>
                            </button>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
      <ScrollBar orientation="horizontal" />
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

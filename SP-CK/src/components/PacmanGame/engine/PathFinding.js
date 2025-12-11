// src/games/PacMan/engine/PathFinding.js

import { TILE_SIZE } from '../utils/constants';

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0; // Cost from start
        this.h = 0; // Heuristic cost to end
        this.f = 0; // Total cost
        this.parent = null;
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

export class PathFinding {
    constructor(walls) {
        this.walls = walls;
        this.gridWidth = 19;
        this.gridHeight = 21;
    }

    isWalkable(x, y) {
        return !this.walls.some(wall => 
            Math.abs(wall.x - x) < TILE_SIZE - 2 &&
            Math.abs(wall.y - y) < TILE_SIZE - 2
        );
    }

    getNeighbors(node) {
        const neighbors = [];
        const directions = [
            { x: 0, y: -TILE_SIZE },  // Up
            { x: 0, y: TILE_SIZE },   // Down
            { x: -TILE_SIZE, y: 0 },  // Left
            { x: TILE_SIZE, y: 0 }    // Right
        ];

        for (const dir of directions) {
            const newX = node.x + dir.x;
            const newY = node.y + dir.y;

            if (this.isWalkable(newX, newY)) {
                neighbors.push(new Node(newX, newY));
            }
        }

        return neighbors;
    }

    heuristic(a, b) {
        // Manhattan distance
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    findPath(start, end, maxIterations = 500) {
        const startNode = new Node(
            Math.round(start.x / TILE_SIZE) * TILE_SIZE,
            Math.round(start.y / TILE_SIZE) * TILE_SIZE
        );
        
        const endNode = new Node(
            Math.round(end.x / TILE_SIZE) * TILE_SIZE,
            Math.round(end.y / TILE_SIZE) * TILE_SIZE
        );

        const openList = [startNode];
        const closedList = [];
        let iterations = 0;

        while (openList.length > 0 && iterations < maxIterations) {
            iterations++;

            // Find node with lowest f cost
            let currentNode = openList[0];
            let currentIndex = 0;

            for (let i = 1; i < openList.length; i++) {
                if (openList[i].f < currentNode.f) {
                    currentNode = openList[i];
                    currentIndex = i;
                }
            }

            // Move current node from open to closed
            openList.splice(currentIndex, 1);
            closedList.push(currentNode);

            // Check if we reached the goal
            if (currentNode.equals(endNode)) {
                const path = [];
                let current = currentNode;
                while (current) {
                    path.unshift({ x: current.x, y: current.y });
                    current = current.parent;
                }
                return path;
            }

            // Check neighbors
            const neighbors = this.getNeighbors(currentNode);

            for (const neighbor of neighbors) {
                // Skip if in closed list
                if (closedList.some(node => node.equals(neighbor))) {
                    continue;
                }

                // Calculate costs
                neighbor.g = currentNode.g + TILE_SIZE;
                neighbor.h = this.heuristic(neighbor, endNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentNode;

                // Check if neighbor is already in open list with better path
                const existingNode = openList.find(node => node.equals(neighbor));
                if (existingNode && neighbor.g >= existingNode.g) {
                    continue;
                }

                // Add to open list
                if (!existingNode) {
                    openList.push(neighbor);
                }
            }
        }

        // No path found, return direct direction
        return [
            { x: start.x, y: start.y },
            { x: end.x, y: end.y }
        ];
    }

    getNextDirection(start, end) {
        const path = this.findPath(start, end);
        
        if (path.length < 2) {
            // Direct direction
            const dx = end.x - start.x;
            const dy = end.y - start.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance === 0 ? { x: 0, y: 0 } : { x: dx / distance, y: dy / distance };
        }

        // Direction to next node in path
        const next = path[1];
        const dx = next.x - start.x;
        const dy = next.y - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        return distance === 0 ? { x: 0, y: 0 } : { x: dx / distance, y: dy / distance };
    }
}

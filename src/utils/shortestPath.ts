import Vector2 from "./Vector2.ts";
import { Heap } from 'heap-js';

export const shortestPath = (grid: number[][], start: Vector2, end: Vector2): Vector2[] => {
    return aStar(grid, start, end);
}

const getNeighbors = (grid: number[][], currentPosition: Vector2): Vector2[] => {
    const neighbors: Vector2[] = [];

    if (currentPosition.x > 0 && grid[currentPosition.x - 1][currentPosition.y] === 1) {
        neighbors.push(new Vector2(currentPosition.x - 1, currentPosition.y));
    }
    if (currentPosition.x < (grid.length - 1) && grid[currentPosition.x + 1][currentPosition.y] === 1) {
        neighbors.push(new Vector2(currentPosition.x + 1, currentPosition.y));
    }
    if (currentPosition.y > 0 && grid[currentPosition.x][currentPosition.y - 1] === 1) {
        neighbors.push(new Vector2(currentPosition.x, currentPosition.y - 1));
    }
    if (currentPosition.y < (grid[0].length - 1) && grid[currentPosition.x][currentPosition.y + 1] === 1) {
        neighbors.push(new Vector2(currentPosition.x, currentPosition.y + 1));
    }

    return neighbors;
}

const aStar = (grid: number[][], start: Vector2, end: Vector2): Vector2[] => {
    type Node = {position: Vector2, gScore: number, hScore: number};
    let visited: boolean[][] = [];
    let distance: number[][] = [];
    let previous: Vector2[][] = [];

    // initialize arrays
    for (let i: number = 0; i < grid.length; i++) {
        visited.push([]);
        distance.push([]);
        previous.push([]);
        for (let j: number = 0; j < grid[0].length; j++) {
            visited[i].push(false);
            distance[i].push(Number.MAX_VALUE);
            previous[i].push(new Vector2(-1, -1));
        }
    }

    const comparator = (a: Node, b: Node) => {
        return (a.gScore + a.hScore) - (b.gScore + b.hScore);
    };

    // initialize queue
    let priorityQueue: Heap<Node> = new Heap(comparator);
    priorityQueue.push({
        position: start,
        gScore: 0,
        hScore: manhattanDistance(start, end)}
    );
    distance[start.x][start.y] = 0;

    while (!priorityQueue.isEmpty()) {
        const current: Node = priorityQueue.pop() as Node;
        const currentPosition: Vector2 = current.position;
        visited[currentPosition.x][currentPosition.y] = true;

        // if arrived at end
        if (currentPosition.equals(end)) {
            break;
        }

        const neighbors: Vector2[] = getNeighbors(grid, currentPosition);


        neighbors.forEach((neighbor: Vector2): void => {
            if (visited[neighbor.x][neighbor.y]) {
                return;
            }

            // update scores
            const newGScore: number = current.gScore + 1;
            if (newGScore < distance[neighbor.x][neighbor.y]) {
                distance[neighbor.x][neighbor.y] = newGScore;
                previous[neighbor.x][neighbor.y] = currentPosition;

                const hScore: number = manhattanDistance(neighbor, end);

                priorityQueue.push({
                    position: neighbor,
                    gScore: newGScore,
                    hScore: hScore
                });
            }
        });
    }
    
    // reconstruct path
    const path: Vector2[] = [];
    let current: Vector2 = end;
    while (current.y !== start.y || current.x !== start.x) {
        path.push(current);
        current = previous[current.x][current.y];
    }
    path.push(start);
    path.reverse();

    return path;
}

const manhattanDistance = (position1: Vector2, position2: Vector2): number => {
    return Math.abs(position1.x - position2.x) + Math.abs(position1.y - position2.y);
}
// Path: src/2024/day23
import { openInput } from '../openInput.ts';

const file = openInput(2024, 23);

const connections = parseData(file);
const lanParty = getLargestGroup(connections);
const res = lanParty.join(',');
console.log(res);

function parseData(file: string): Connections {
  const lines = file.trim().split('\n');
  const pairConnections = lines.map((line) => line.split('-'));
  const connections: Connections = new Map();
  for (const [a, b] of pairConnections) {
    connections.set(a, connections.get(a) ?? new Set());
    connections.set(b, connections.get(b) ?? new Set());
    connections.get(a)?.add(b);
    connections.get(b)?.add(a);
  }
  return connections;
}

function getLargestGroup(connections: Connections): string[] {
  const visited = new Set<string>();
  let largestGroup: string[] = [];
  const searchGroups = (
    currentGroup: Set<string>,
    neighbors: string[],
  ): void => {
    const sortedGroup = Array.from(currentGroup).sort();
    const key = sortedGroup.join(',');
    if (visited.has(key)) return;
    visited.add(key);

    if (sortedGroup.length > largestGroup.length) {
      largestGroup = sortedGroup;
    }

    for (const neighbor of neighbors) {
      if (currentGroup.has(neighbor)) continue;

      const isAllConnected = sortedGroup.every(
        (computer) => connections.get(neighbor)?.has(computer) ?? false,
      );
      if (isAllConnected) {
        currentGroup.add(neighbor);
        searchGroups(currentGroup, Array.from(connections.get(neighbor) ?? []));
        currentGroup.delete(neighbor);
      }
    }
  };

  for (const [node, neighbors] of connections) {
    const initialGroup = new Set<string>([node]);
    searchGroups(initialGroup, Array.from(neighbors));
  }

  return largestGroup;
}

type Connections = Map<string, Set<string>>;

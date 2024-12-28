// Path: src/2024/day23
import { openInput } from '../openInput.ts';

const file = openInput(2024, 23);

const connections = parseData(file);
const groups = getConnectionsGroups(connections);
const res = groups.filter((group) =>
  group.some((connection) => connection.startsWith('t')),
).length;
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

function getConnectionsGroups(connections: Connections): string[][] {
  const groups = new Set<string>();
  for (const [node, neighbors] of connections) {
    const sortedNeighbors = Array.from(neighbors).sort();

    for (let i = 0; i < sortedNeighbors.length; i++) {
      const neighborA = sortedNeighbors[i];

      for (let j = i + 1; j < sortedNeighbors.length; j++) {
        const neighborB = sortedNeighbors[j];

        const neighborAConnections = connections.get(neighborA);
        if (neighborAConnections?.has(neighborB) ?? false) {
          const group = [node, neighborA, neighborB].sort().join(',');
          groups.add(group);
        }
      }
    }
  }
  const result = Array.from(groups).map((group) => group.split(','));
  return result;
}

type Connections = Map<string, Set<string>>;

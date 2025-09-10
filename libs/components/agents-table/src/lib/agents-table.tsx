import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableContainer } from '@chakra-ui/react';

export interface AgentRow {
  id: string;
  symbol: string;
  faction?: string | null;
}

export interface AgentsTableProps {
  agents: AgentRow[];
  loading?: boolean;
}

export function AgentsTable({ agents, loading = false }: AgentsTableProps) {
  return (
    <TableContainer>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Symbol</Th>
            <Th>Faction</Th>
          </Tr>
        </Thead>
        <Tbody>
          {agents.map((a) => (
            <Tr key={a.id}>
              <Td>{a.symbol}</Td>
              <Td>{a.faction ?? '-'}</Td>
            </Tr>
          ))}
          {!loading && agents.length === 0 && (
            <Tr>
              <Td colSpan={2}>No agents yet.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default AgentsTable;



import React from 'react';
import { Box, Button, Divider, Skeleton, Stack, Text } from '@chakra-ui/react';

export interface Contract {
  id: string;
  type?: string;
  accepted?: boolean;
  factionSymbol?: string;
  onAccepted?: { message?: string } | null;
  terms?: { deadline?: string; deliver?: Array<{ unitsRequired: number; tradeSymbol: string; destinationSymbol: string; unitsFulfilled?: number }> };
}

export interface ContractsListProps {
  loading: boolean;
  contracts: Contract[];
  expanded: Record<string, boolean>;
  accepting: Record<string, boolean>;
  onToggleExpand: (contractId: string) => void;
  onAccept: (contractId: string) => void;
}

export function ContractsList({ loading, contracts, expanded, accepting, onToggleExpand, onAccept }: ContractsListProps) {
  if (loading) {
    return (
      <>
        <Skeleton height="18px" width="70%" />
        <Skeleton height="18px" width="70%" />
        <Skeleton height="18px" width="50%" />
      </>
    );
  }
  if (!Array.isArray(contracts) || contracts.length === 0) {
    return <Text>No contracts found.</Text>;
  }
  return (
    <Stack spacing={3}>
      {contracts.map((c) => {
        const isOpen = !!expanded[c.id];
        return (
          <Box key={c.id} borderWidth="1px" borderRadius="md" p={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" onClick={() => onToggleExpand(c.id)} cursor="pointer">
              <Box>
                <Text fontWeight="semibold">{c.type}</Text>
                <Text fontSize="sm" color="gray.600">Deadline: {c.terms?.deadline ?? '-'}</Text>
              </Box>
              <Box>
                <Button
                  size="sm"
                  colorScheme="teal"
                  isDisabled={!!c.accepted}
                  isLoading={!!accepting[c.id]}
                  onClick={(e) => { e.stopPropagation(); onAccept(c.id); }}
                >
                  {c.accepted ? 'Accepted' : 'Accept'}
                </Button>
              </Box>
            </Box>
            {isOpen && (
              <Box mt={3}>
                <Divider mb={3} />
                <Text><b>Accepted:</b> {String(!!c.accepted)}</Text>
                <Text><b>Faction:</b> {c.factionSymbol ?? '-'}</Text>
                <Text><b>On Accepted:</b> {c.onAccepted?.message ?? '-'}</Text>
                <Text><b>Terms:</b> {c.terms?.deadline ?? '-'}</Text>
                {c.terms?.deliver && Array.isArray(c.terms.deliver) && (
                  <Box mt={2}>
                    <Text fontWeight="semibold">Deliveries:</Text>
                    <Stack spacing={1} mt={1}>
                      {c.terms.deliver.map((d, idx) => (
                        <Text key={idx} fontSize="sm">
                          {d.unitsRequired}x {d.tradeSymbol} to {d.destinationSymbol} (accepted: {d.unitsFulfilled ?? 0})
                        </Text>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

export default ContractsList;

'use client';

import React, { useEffect, useState, use as usePromise } from 'react';
import { Box, Heading, Stack, Text, Divider, Skeleton, Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';

interface AgentDto { id: string; symbol: string; faction?: string | null }

export default function AgentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(props.params);
  const [agent, setAgent] = useState<AgentDto | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [section, setSection] = useState<'summary' | 'contracts'>('summary');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [accepting, setAccepting] = useState<Record<string, boolean>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [agentRes, summaryRes] = await Promise.all([
        fetch(`/api/agents/${id}`, { cache: 'no-store' }),
        fetch(`/api/agents/${id}/summary`, { cache: 'no-store' }),
      ]);
      const agentJson = await agentRes.json();
      const summaryJson = await summaryRes.json();
      if (!agentRes.ok) throw new Error(agentJson?.error ?? 'Failed to load agent');
      if (!summaryRes.ok) throw new Error(summaryJson?.error ?? 'Failed to load summary');
      setAgent(agentJson);
      setSummary(summaryJson);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  const myAgent = summary?.myAgent?.data ?? summary?.myAgent ?? null;
  const contracts = summary?.myContracts?.data ?? [];

  const onToggleExpand = (contractId: string) => {
    setExpanded((prev) => ({ ...prev, [contractId]: !prev[contractId] }));
  };

  const acceptContract = async (contractId: string) => {
    try {
      setAccepting((prev) => ({ ...prev, [contractId]: true }));
      const res = await fetch(`/api/agents/${id}/contracts/${contractId}/accept`, { method: 'POST' });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Failed to accept contract ${contractId}`);
      }
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to accept contract');
    } finally {
      setAccepting((prev) => ({ ...prev, [contractId]: false }));
    }
  };

  return (
    <Flex maxW="1100px" mx="auto" py={6} gap={6}>
      <Box as="nav" w="220px" flexShrink={0}>
        <Stack spacing={2}>
          <Button variant={section === 'summary' ? 'solid' : 'outline'} onClick={() => setSection('summary')} size="sm">Summary</Button>
          <Button variant={section === 'contracts' ? 'solid' : 'outline'} onClick={() => setSection('contracts')} size="sm">Contracts</Button>
          <Button as={Link} href="/" variant="ghost" size="sm">Back to Agents</Button>
        </Stack>
      </Box>
      <Box flex="1">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="lg">Agent</Heading>
          <Button onClick={load} variant="outline" size="sm">Refresh</Button>
        </Box>

        {error && (
          <Box bg="red.50" borderWidth="1px" borderColor="red.200" p={3} mb={4} borderRadius="md">
            <Text color="red.600">{error}</Text>
            <Button mt={2} size="sm" onClick={load}>Retry</Button>
          </Box>
        )}

        {section === 'summary' && (
          <>
            <Stack spacing={2} mb={6}>
              {loading ? (
                <>
                  <Skeleton height="18px" width="60%" />
                  <Skeleton height="18px" width="40%" />
                  <Skeleton height="18px" width="30%" />
                </>
              ) : (
                <>
                  <Text><b>ID:</b> {agent?.id ?? id}</Text>
                  <Text><b>Symbol:</b> {agent?.symbol ?? '-'}</Text>
                  <Text><b>Faction:</b> {agent?.faction ?? '-'}</Text>
                </>
              )}
            </Stack>

            <Divider mb={4} />
            <Heading size="md" mb={2}>My Agent (API)</Heading>
            {loading ? (
              <>
                <Skeleton height="18px" width="50%" />
                <Skeleton height="18px" width="50%" />
                <Skeleton height="18px" width="30%" />
              </>
            ) : myAgent ? (
              <Stack spacing={2}>
                <Text><b>Name:</b> {myAgent?.symbol}</Text>
                <Text><b>Headquarters:</b> {myAgent?.headquarters}</Text>
                <Text><b>Credits:</b> {myAgent?.credits}</Text>
              </Stack>
            ) : (
              <Text>Unable to load /my/agent.</Text>
            )}

            <Divider my={4} />
            <Heading size="md" mb={2}>Contracts</Heading>
            {loading ? (
              <>
                <Skeleton height="18px" width="70%" />
                <Skeleton height="18px" width="70%" />
              </>
            ) : Array.isArray(contracts) && contracts.length > 0 ? (
              <Stack spacing={2}>
                {contracts.map((c: any) => (
                  <Box key={c.id} borderWidth="1px" borderRadius="md" p={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box>
                        <Text><b>Type:</b> {c.type}</Text>
                        <Text><b>Deadline:</b> {c.terms?.deadline ?? '-'}</Text>
                      </Box>
                      <Box>
                        <Button
                          size="sm"
                          colorScheme="teal"
                          isDisabled={c.accepted}
                          isLoading={!!accepting[c.id]}
                          onClick={() => acceptContract(c.id)}
                        >
                          {c.accepted ? 'Accepted' : 'Accept'}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Text>No contracts found.</Text>
            )}
          </>
        )}

        {section === 'contracts' && (
          <>
            <Heading size="md" mb={3}>Contracts</Heading>
            {loading ? (
              <>
                <Skeleton height="18px" width="70%" />
                <Skeleton height="18px" width="70%" />
                <Skeleton height="18px" width="50%" />
              </>
            ) : Array.isArray(contracts) && contracts.length > 0 ? (
              <Stack spacing={3}>
                {contracts.map((c: any) => {
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
                            isDisabled={c.accepted}
                            isLoading={!!accepting[c.id]}
                            onClick={(e) => { e.stopPropagation(); void acceptContract(c.id); }}
                          >
                            {c.accepted ? 'Accepted' : 'Accept'}
                          </Button>
                        </Box>
                      </Box>
                      {isOpen && (
                        <Box mt={3}>
                          <Divider mb={3} />
                          <Text><b>Accepted:</b> {String(c.accepted)}</Text>
                          <Text><b>Faction:</b> {c.factionSymbol ?? '-'}</Text>
                          <Text><b>On Accepted:</b> {c.onAccepted?.message ?? '-'}</Text>
                          <Text><b>Terms:</b> {c.terms?.deadline ?? '-'}</Text>
                          {c.terms?.deliver && Array.isArray(c.terms.deliver) && (
                            <Box mt={2}>
                              <Text fontWeight="semibold">Deliveries:</Text>
                              <Stack spacing={1} mt={1}>
                                {c.terms.deliver.map((d: any, idx: number) => (
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
            ) : (
              <Text>No contracts found.</Text>
            )}
          </>
        )}
      </Box>
    </Flex>
  );
}

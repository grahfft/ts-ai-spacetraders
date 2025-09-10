'use client';

import React, { useEffect, useState, use as usePromise } from 'react';
import { Box, Heading, Stack, Text, Divider, Skeleton, Button } from '@chakra-ui/react';

interface AgentDto { id: string; symbol: string; faction?: string | null }

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [agent, setAgent] = useState<AgentDto | null>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box maxW="900px" mx="auto" py={6}>
      <Heading size="lg" mb={4}>Agent Summary</Heading>

      {error && (
        <Box bg="red.50" borderWidth="1px" borderColor="red.200" p={3} mb={4} borderRadius="md">
          <Text color="red.600">{error}</Text>
          <Button mt={2} size="sm" onClick={load}>Retry</Button>
        </Box>
      )}

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
              <Text><b>Type:</b> {c.type}</Text>
              <Text><b>Accepted:</b> {String(c.accepted)}</Text>
              <Text><b>Deadline:</b> {c.terms?.deadline ?? '-'}</Text>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text>No contracts found.</Text>
      )}
    </Box>
  );
}

'use client';

import React, { useEffect, useState, use as usePromise } from 'react';
import { Box, Heading, Stack, Text, Divider, Skeleton, Button, Flex } from '@chakra-ui/react';
import { SidebarNav, ContractsList, ShipsQuickCards, ShipsList, AgentDetailsProvider, useAgentDetails } from '@spacetraders/agent-ui';
import { useSearchParams } from 'next/navigation';
import { useGetAgentQuery, useGetAgentShipsQuery, useGetAgentSummaryQuery, useAcceptContractMutation } from '../../store';

interface AgentDto { id: string; symbol: string; faction?: string | null }

function AgentPageInner({ id }: { id: string }) {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { section, setSection, openShipSymbol, requestOpenShip, consumeOpenShip } = useAgentDetails();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [accepting, setAccepting] = useState<Record<string, boolean>>({});
  const { data: agent, isFetching: loadingAgent } = useGetAgentQuery(id);
  const { data: summary, isFetching: loadingSummary } = useGetAgentSummaryQuery(id);
  const { data: shipsData, isFetching: loadingShips, refetch: refetchShips } = useGetAgentShipsQuery(id);
  const ships = shipsData?.ships ?? [];
  const loading = loadingAgent || loadingSummary || loadingShips;
  const [acceptContractApi, acceptState] = useAcceptContractMutation();

  const load = async () => {
    setError(null);
    try {
      await Promise.all([refetchShips()]);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    }
  };

  // URL query param trigger: ?ship=SYMBOL or ?openShip=SYMBOL
  useEffect(() => {
    const qp = searchParams?.get('ship') || searchParams?.get('openShip');
    if (qp) {
      requestOpenShip(qp);
    }
  }, [searchParams, requestOpenShip]);

  // When Ships tab is active and data loaded, expand/highlight pending ship
  useEffect(() => {
    if (section === 'ships' && !loading && openShipSymbol) {
      // ships list will react to openShipSymbol prop
      // consume after render cycle
      const t = setTimeout(() => consumeOpenShip(), 0);
      return () => clearTimeout(t);
    }
  }, [section, loading, openShipSymbol, consumeOpenShip]);

  const myAgent = summary?.myAgent?.data ?? summary?.myAgent ?? null;
  const contracts = summary?.myContracts?.data ?? [];

  const onToggleExpand = (contractId: string) => {
    setExpanded((prev) => ({ ...prev, [contractId]: !prev[contractId] }));
  };

  const acceptContract = async (contractId: string) => {
    try {
      setAccepting((prev) => ({ ...prev, [contractId]: true }));
      await acceptContractApi({ id, contractId }).unwrap();
      await load();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to accept contract');
    } finally {
      setAccepting((prev) => ({ ...prev, [contractId]: false }));
    }
  };

  return (
    <Flex maxW="1100px" mx="auto" py={6} gap={6}>
      <SidebarNav active={section} onChange={setSection} />
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
            <Heading size="md" mb={2}>Ships</Heading>
            {loading ? (
              <>
                <Skeleton height="18px" width="50%" />
                <Skeleton height="18px" width="40%" />
              </>
            ) : (
              <ShipsQuickCards ships={ships} onSelectShip={(symbol) => { requestOpenShip(symbol); }} />
            )}

            <Divider my={4} />
            <Heading size="md" mb={2}>Contracts</Heading>
            <ContractsList
              loading={loading}
              contracts={contracts}
              expanded={expanded}
              accepting={accepting}
              onToggleExpand={onToggleExpand}
              onAccept={(cid) => { void acceptContract(cid); }}
            />
          </>
        )}

        {section === 'contracts' && (
          <>
            <Heading size="md" mb={3}>Contracts</Heading>
            <ContractsList
              loading={loading}
              contracts={contracts}
              expanded={expanded}
              accepting={accepting}
              onToggleExpand={onToggleExpand}
              onAccept={(cid) => { void acceptContract(cid); }}
            />
          </>
        )}

        {section === 'ships' && (
          <>
            <Heading size="md" mb={3}>Ships</Heading>
            {loading ? (
              <>
                <Skeleton height="18px" width="50%" />
                <Skeleton height="18px" width="40%" />
                <Skeleton height="18px" width="30%" />
              </>
            ) : (
              <ShipsList ships={ships} openSymbol={openShipSymbol} />
            )}
          </>
        )}
      </Box>
    </Flex>
  );
}

export default function AgentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(props.params);
  return (
    <AgentDetailsProvider>
      <AgentPageInner id={id} />
    </AgentDetailsProvider>
  );
}

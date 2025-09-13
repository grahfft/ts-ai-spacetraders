import React, { useEffect, useRef, useState } from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';

export interface Ship {
  symbol: string;
  role?: string;
  nav?: { status?: string; systemSymbol?: string; waypointSymbol?: string };
  crew?: { capacity?: number };
  frame?: { name?: string };
  reactor?: { name?: string };
  engine?: { name?: string };
  cargo?: { units?: number; capacity?: number };
}

type OpenShipEvent = CustomEvent<{ symbol: string }>;
interface GlobalWithEvents {
  addEventListener?: (type: string, listener: (e: Event) => void) => void;
  removeEventListener?: (type: string, listener: (e: Event) => void) => void;
}

export function ShipsList({ ships }: { ships: Ship[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const shipElementBySymbolRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const g = globalThis as unknown as GlobalWithEvents;
    if (typeof globalThis === 'undefined' || !g.addEventListener) return;
    const onOpen = (e: Event) => {
      const ce = e as OpenShipEvent;
      const symbol = ce?.detail?.symbol;
      if (symbol) {
        setOpen((prev) => ({ ...prev, [symbol]: true }));
        const el = shipElementBySymbolRef.current?.[symbol];
        try {
          el?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
        } catch (err) {
          // ignore: smooth scroll not supported in this environment
        }
        setHighlighted((prev) => ({ ...prev, [symbol]: true }));
        setTimeout(() => {
          setHighlighted((prev) => ({ ...prev, [symbol]: false }));
        }, 1200);
      }
    };
    g.addEventListener('open-ship', onOpen);
    return () => g.removeEventListener?.('open-ship', onOpen);
  }, []);
  if (!Array.isArray(ships) || ships.length === 0) {
    return <Text>No ships found.</Text>;
  }
  return (
    <Stack spacing={3}>
      {ships.map((s) => {
        const isOpen = !!open[s.symbol];
        return (
          <Box
            key={s.symbol}
            borderWidth="1px"
            borderRadius="md"
            p={3}
            ref={(el: HTMLDivElement | null) => { shipElementBySymbolRef.current[s.symbol] = el; }}
            bg={highlighted[s.symbol] ? 'yellow.50' : undefined}
            borderColor={highlighted[s.symbol] ? 'yellow.400' : undefined}
            transition="background-color 0.6s ease, border-color 0.6s ease"
          >
            <Box onClick={() => setOpen((prev) => ({ ...prev, [s.symbol]: !prev[s.symbol] }))} cursor="pointer">
              <Text fontWeight="semibold">{s.symbol}</Text>
              <Text fontSize="sm" color="gray.600">{s.role ?? '-'}</Text>
            </Box>
            {isOpen && (
              <Box mt={3}>
                <Text>status: {String(s.nav?.status ?? '-').toLowerCase()}</Text>
                {typeof s.cargo?.units !== 'undefined' && typeof s.cargo?.capacity !== 'undefined' && (
                  <Text>cargo: {s.cargo.units}/{s.cargo.capacity}</Text>
                )}
                {s.nav?.systemSymbol && s.nav?.waypointSymbol && (
                  <Text>location: {s.nav.systemSymbol}/{s.nav.waypointSymbol}</Text>
                )}
              </Box>
            )}
          </Box>
        );
      })}
    </Stack>
  );
}

export default ShipsList;



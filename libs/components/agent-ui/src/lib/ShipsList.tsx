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

export function ShipsList({ ships, openSymbol }: { ships: Ship[]; openSymbol?: string | null }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [highlighted, setHighlighted] = useState<Record<string, boolean>>({});
  const shipElementBySymbolRef = useRef<Record<string, HTMLDivElement | null>>({});
  useEffect(() => {
    const symbol = openSymbol;
    if (!symbol) return;
    setOpen((prev) => ({ ...prev, [symbol]: true }));
    const el = shipElementBySymbolRef.current?.[symbol];
    if (el && typeof (el as any).scrollIntoView === 'function') {
      try {
        (el as any).scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (e) {
        // no-op
      }
    }
    setHighlighted((prev) => ({ ...prev, [symbol]: true }));
    const t = setTimeout(() => {
      setHighlighted((prev) => ({ ...prev, [symbol]: false }));
    }, 1200);
    return () => clearTimeout(t);
  }, [openSymbol]);
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



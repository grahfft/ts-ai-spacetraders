import React from 'react';
import { Box, Stack, Text } from '@chakra-ui/react';

export interface ShipSummary { symbol: string; role?: string | null }
export function ShipsQuickCards({ ships, onSelectShip }: { ships: ShipSummary[]; onSelectShip?: (symbol: string) => void }) {
  return (
    <Box>
      <Stack direction="row" spacing={3} flexWrap="wrap">
        {ships.map((s) => (
          <Box
            key={s.symbol}
            borderWidth="1px"
            borderRadius="md"
            p={2}
            minW="160px"
            cursor={onSelectShip ? 'pointer' : 'default'}
            onClick={() => onSelectShip?.(s.symbol)}
            data-testid={`ship-card-${s.symbol}`}
            data-symbol={s.symbol}
          >
            <Text fontWeight="semibold">{s.symbol}</Text>
            <Text fontSize="sm" color="gray.600">{s.role ?? '-'}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default ShipsQuickCards;



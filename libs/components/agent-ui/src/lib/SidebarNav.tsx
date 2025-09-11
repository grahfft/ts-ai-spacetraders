import React from 'react';
import { Box, Button, Stack } from '@chakra-ui/react';
import Link from 'next/link';

export interface SidebarNavProps {
  active: 'summary' | 'contracts';
  onChange: (section: 'summary' | 'contracts') => void;
}

export function SidebarNav({ active, onChange }: SidebarNavProps) {
  return (
    <Box as="nav" w="220px" flexShrink={0}>
      <Stack spacing={2}>
        <Button variant={active === 'summary' ? 'solid' : 'outline'} onClick={() => onChange('summary')} size="sm">Summary</Button>
        <Button variant={active === 'contracts' ? 'solid' : 'outline'} onClick={() => onChange('contracts')} size="sm">Contracts</Button>
        <Button as={Link} href="/" variant="ghost" size="sm">Back to Agents</Button>
      </Stack>
    </Box>
  );
}

export default SidebarNav;

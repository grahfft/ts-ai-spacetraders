import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

export interface AppChakraProviderProps {
  children: React.ReactNode;
}

export function AppChakraProvider({ children }: AppChakraProviderProps) {
  return <ChakraProvider>{children}</ChakraProvider>;
}

export default AppChakraProvider;

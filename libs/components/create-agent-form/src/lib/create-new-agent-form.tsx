import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from '@chakra-ui/react';
import axios from 'axios';

export interface CreateNewAgentFormProps {
  defaultSymbol?: string;
  defaultFaction?: string;
  showTokenFields?: boolean;
  onSuccess?: (args: { symbol: string; faction: string }) => void;
}

export function CreateNewAgentForm({
  defaultSymbol = 'TSAI',
  defaultFaction = 'COSMIC',
  showTokenFields = false,
  onSuccess,
}: CreateNewAgentFormProps) {
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [faction, setFaction] = useState(defaultFaction);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [accountToken, setAccountToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('SPACE_TRADERS_ACCOUNT_TOKEN');
    if (stored) setAccountToken(stored);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const base = (process.env.NEXT_PUBLIC_SERVICE_URL || process.env.SERVICE_URL)?.replace(/\/$/, '');
      const url = base ? `${base}/agents/register` : '/api/create-new-agent';
      const { data } = await axios.post(url, {
        symbol,
        faction,
        email,
      });
      const tokenValue = data?.data?.token ?? data?.token ?? null;
      setToken(tokenValue);
      if (tokenValue) localStorage.setItem('SPACE_TRADERS_TOKEN', tokenValue);
      // If backend returns the created agent record or id, navigate after success
      const createdId = data?.id ?? data?.agent?.id ?? null;
      if (onSuccess) onSuccess({ symbol, faction });
      if (createdId && typeof window !== 'undefined') {
        // best-effort navigation to details page
        try { window.location.assign(`/agent/${createdId}`); } catch (err) { console.warn('Navigation failed', err); }
      }
    } catch (err) {
      const unknownError = err as { response?: { data?: { error?: { message?: string } } }; message?: string };
      setError(
        unknownError?.response?.data?.error?.message ||
          unknownError?.message ||
          'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10}>
      <Heading size="md" mb={4}>
        Create New Agent
      </Heading>
      {showTokenFields && (
        <>
          <Text mb={4}>
            Use an account token to authorize registering new agents. Token is
            stored locally only.
          </Text>
          <FormControl mb={4}>
            <FormLabel>Account Token (not stored in repo)</FormLabel>
            <Textarea
              rows={2}
              value={accountToken}
              onChange={(e) => setAccountToken(e.target.value)}
              placeholder="Paste your account token"
            />
            <Button
              mt={2}
              onClick={() =>
                localStorage.setItem('SPACE_TRADERS_ACCOUNT_TOKEN', accountToken)
              }
            >
              Save Account Token
            </Button>
          </FormControl>
        </>
      )}

      <Box as="form" onSubmit={onSubmit}>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Agent Symbol</FormLabel>
            <Input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g. TSAI"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Faction</FormLabel>
            <Input
              value={faction}
              onChange={(e) => setFaction(e.target.value)}
              placeholder="e.g. COSMIC"
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email (optional)</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </FormControl>
          <Button type="submit" isLoading={loading} colorScheme="teal">
            Register
          </Button>
        </Stack>
      </Box>

      {showTokenFields && (
        <Box mt={6}>
          <FormControl>
            <FormLabel>Paste Existing Token</FormLabel>
            <Textarea
              rows={3}
              value={token ?? ''}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your token here"
            />
          </FormControl>
          <Button
            mt={2}
            onClick={() => token && localStorage.setItem('SPACE_TRADERS_TOKEN', token)}
          >
            Save Token
          </Button>
        </Box>
      )}

      {error && (
        <Text color="red.500" mt={4}>
          Error: {error}
        </Text>
      )}
    </Box>
  );
}

export default CreateNewAgentForm;


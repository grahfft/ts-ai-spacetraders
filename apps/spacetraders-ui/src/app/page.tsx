'use client';

import styles from './page.module.css';
import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Heading, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { AgentsTable } from '@spacetraders/agents-table';
import { CreateNewAgentForm } from '@spacetraders/create-agent';

interface AgentDto {
  id: string;
  symbol: string;
  faction?: string | null;
}

export default function Page() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/agents`);
      setAgents(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSuccess = () => {
    onClose();
    fetchAgents();
  };

  return (
    <main className={styles.main}>
      <Box w="100%" maxW="900px" mx="auto">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Heading size="md">Agents</Heading>
          <Button colorScheme="teal" onClick={onOpen}>
            Add New Agent
          </Button>
        </Box>

        <AgentsTable agents={agents} loading={loading} />

        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent p={2}>
            <ModalHeader>Create New Agent</ModalHeader>
            <ModalBody>
              <CreateNewAgentForm showTokenFields={false} onSuccess={handleSuccess} />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </main>
  );
}

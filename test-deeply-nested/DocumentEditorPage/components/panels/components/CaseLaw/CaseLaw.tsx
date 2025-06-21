import React from 'react';
import {
  Box,
  Stack,
  Group,
  Button,
  Text,
  ScrollArea,
  Badge,
  Card,
  TextInput,
  Select,
  Loader,
  Center,
  ActionIcon,
  Menu
} from '@mantine/core';
import {
  IconPlus,
  IconSearch,
  IconCheck,
  IconX,
  IconClock,
  IconExternalLink,
  IconDots,
  IconEdit,
  IconTrash
} from '@tabler/icons-react';
import { useState } from 'react';
import { 
  Container, 
  Header, 
  StatsContainer, 
  ContentContainer,
  SearchContainer,
  EmptyStateContainer
} from './CaseLaw.styles';
import { CaseLawProps, SimpleCitation } from './CaseLaw.types';
import { getStatusColor, getStatusIcon } from './CaseLaw.logic';

const mockCitations: SimpleCitation[] = [
  {
    id: '1',
    citation: 'Brown v. Board of Education, 347 U.S. 483 (1954)',
    title: 'Brown v. Board of Education',
    court: 'Supreme Court',
    year: 1954,
    isVerified: true,
    status: 'verified'
  },
  {
    id: '2', 
    citation: 'Miranda v. Arizona, 384 U.S. 436 (1966)',
    title: 'Miranda v. Arizona',
    court: 'Supreme Court',
    year: 1966,
    isVerified: false,
    status: 'pending'
  }
];

export const CaseLaw: React.FC<CaseLawProps> = () => {
  const [citations, setCitations] = useState<SimpleCitation[]>(mockCitations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const filteredCitations = citations.filter(citation =>
    citation.citation.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
    citation.title.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
  );

  const handleVerify = async (id: string) => {
    setIsVerifying(true);
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCitations(prev => prev.map(citation => 
      citation.id === id 
        ? { ...citation, status: 'verified', isVerified: true }
        : citation
    ));
    setIsVerifying(false);
  };

  const handleDelete = (id: string) => {
    setCitations(prev => prev.filter(citation => citation.id !== id));
  };

  return (
    <Container>
      {/* Header */}
      <Header>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={600} size="lg">Case Law Citations</Text>
          <Button
            size="sm"
            leftSection={<IconPlus size={16} />}
            onClick={() => console.log('Add citation')}
          >
            Add Citation
          </Button>
        </Group>

        {/* Stats */}
        <StatsContainer>
          <Text size="sm" c="dimmed">
            Total: <strong>{citations.length}</strong>
          </Text>
          <Text size="sm" c="dimmed">
            Verified: <strong>{citations.filter(c => c.isVerified).length}</strong>
          </Text>
          <Text size="sm" c="dimmed">
            Pending: <strong>{citations.filter(c => c.status === 'pending').length}</strong>
          </Text>
        </StatsContainer>

        {/* Search */}
        <SearchContainer>
          <TextInput
            placeholder="Search citations..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
          />
        </SearchContainer>
      </Header>

      {/* Content */}
      <ContentContainer>
        <ScrollArea h="100%" p="md">
          {isLoading ? (
            <Center h={200}>
              <Loader />
            </Center>
          ) : filteredCitations.length === 0 ? (
            <EmptyStateContainer>
              <Stack align="center" gap="md">
                <Text c="dimmed" ta="center">
                  {citations.length === 0 ? 'No citations yet' : 'No citations match your search'}
                </Text>
              </Stack>
            </EmptyStateContainer>
          ) : (
            <Stack gap="md">
              {filteredCitations.map((citation) => {
                const StatusIcon = getStatusIcon(citation.status);
                
                return (
                  <Card key={citation.id} padding="md" radius="md" withBorder>
                    <Stack gap="sm">
                      {/* Header */}
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm" align="center">
                          <Badge
                            color={getStatusColor(citation.status)}
                            variant="light"
                            leftSection={<StatusIcon size={12} />}
                            size="sm"
                          >
                            {citation.status}
                          </Badge>
                          <Text size="xs" c="dimmed">
                            {citation.year} • {citation.court}
                          </Text>
                        </Group>

                        <Menu shadow="md" width={180}>
                          <Menu.Target>
                            <ActionIcon variant="light" color="gray" size="sm">
                              <IconDots size={16} />
                            </ActionIcon>
                          </Menu.Target>
                          <Menu.Dropdown>
                            <Menu.Item
                              leftSection={<IconCheck size={16} />}
                              onClick={() => handleVerify(citation.id)}
                              disabled={citation.isVerified || isVerifying}
                            >
                              {isVerifying ? 'Verifying...' : 'Verify Citation'}
                            </Menu.Item>
                            <Menu.Item
                              leftSection={<IconExternalLink size={16} />}
                              onClick={() => window.open(`https://scholar.google.com/scholar?q=${encodeURIComponent(citation.citation)}`, '_blank')}
                            >
                              Search Online
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                              leftSection={<IconTrash size={16} />}
                              color="red"
                              onClick={() => handleDelete(citation.id)}
                            >
                              Delete
                            </Menu.Item>
                          </Menu.Dropdown>
                        </Menu>
                      </Group>

                      {/* Content */}
                      <Box>
                        <Text fw={600} size="sm" mb={4}>
                          {citation.title}
                        </Text>
                        <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace' }}>
                          {citation.citation}
                        </Text>
                      </Box>

                      {/* Verification status */}
                      {citation.isVerified && (
                        <Group gap="xs" align="center">
                          <IconCheck size={14} style={{ color: 'var(--mantine-color-green-6)' }} />
                          <Text size="xs" c="green">
                            Citation verified
                          </Text>
                        </Group>
                      )}
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          )}
        </ScrollArea>
      </ContentContainer>
    </Container>
  );
}; 
import React, { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Select,
  Badge,
  Card,
  ScrollArea,
  ActionIcon,
  Tooltip,
  Tabs,
  Collapse,
  MultiSelect,
  Grid,
  Paper,
  Loader,
  Alert,
  Switch,
  NumberInput,
  Divider,
} from '@mantine/core';
import {
  IconSearch,
  IconHistory,
  IconBookmark,
  IconRefresh,
  IconCopy,
  IconFileText,
  IconChevronDown,
  IconChevronUp,
  IconBrain,
  IconFilter,
  IconSettings,
  IconList,
  IconLayoutGrid,
  IconTable,
  IconStar,
  IconPlus,
} from '@tabler/icons-react';
import { useResearchPanelLogic } from './ResearchPanel.logic';
import type { DesktopResearchPanelProps } from './ResearchPanel.types';

/**
 * Desktop Research Panel Implementation
 * 
 * Features:
 * - Multi-column layout with sidebar search and main results
 * - Advanced filtering sidebar
 * - Multiple view modes (list, cards, table)
 * - Session management
 * - Citation management
 */
export const DesktopResearchPanel: React.FC<DesktopResearchPanelProps> = ({
  className,
  style,
  sidebarWidth = 300,
  onSidebarResize,
  showSidebar = true,
  onToggleSidebar,
  splitRatio = 0.3,
  onSplitRatioChange,
}) => {
  const {
    // State
    researchState,
    queryForm,
    hasResults,
    selectedCases,
    hasSelection,
    isSearching,
    searchHistory,
    citations,
    bookmarkedCases,
    
    // Filter options
    availableJurisdictions,
    availableCourts,
    availableCategories,
    
    // Handlers
    handleQueryFormChange,
    handleSearch,
    handleQuickSearch,
    handleToggleCaseSelection,
    handleBookmarkCase,
    handleAddCitation,
    handleSetViewMode,
    handleCreateSession,
    handleClearFilters,
    
    // Utilities
    formatRelevanceScore,
    formatCaseDate,
    getCaseRelevanceColor,
  } = useResearchPanelLogic();

  const [activeTab, setActiveTab] = useState<'search' | 'results' | 'history' | 'citations'>('search');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Box className={className} style={style} h="100%" display="flex">
      {/* Left Sidebar - Search & Filters */}
      {showSidebar && (
        <Paper 
          w={sidebarWidth} 
          style={{ 
            borderRight: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
          }}
          p="sm"
        >
          {/* Header */}
          <Group justify="space-between" mb="md">
            <Group gap="xs">
              <IconBrain size={20} />
              <Text fw={600} size="sm">Research</Text>
            </Group>
            <ActionIcon
              variant="light"
              size="sm"
              onClick={() => handleCreateSession('New Session')}
            >
              <IconPlus size={14} />
            </ActionIcon>
          </Group>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit}>
            <Stack gap="sm" mb="md">
              <TextInput
                placeholder="Enter legal query..."
                value={queryForm.query}
                onChange={(e) => handleQueryFormChange('query', e.target.value)}
                leftSection={<IconSearch size={16} />}
                size="sm"
              />

              <Group gap="xs">
                <Button 
                  size="sm"
                  type="submit"
                  loading={isSearching}
                  disabled={!queryForm.query.trim()}
                  flex={1}
                >
                  Search
                </Button>
                <ActionIcon
                  variant="light"
                  size="sm"
                  onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                >
                  <IconSettings size={14} />
                </ActionIcon>
              </Group>

              <Collapse in={showAdvancedSearch}>
                <Stack gap="xs">
                  <MultiSelect
                    label="Jurisdiction"
                    placeholder="Select jurisdictions"
                    data={availableJurisdictions}
                    value={queryForm.jurisdiction}
                    onChange={(value) => handleQueryFormChange('jurisdiction', value)}
                    size="xs"
                    clearable
                  />
                  <MultiSelect
                    label="Court"
                    placeholder="Select courts"
                    data={availableCourts}
                    value={queryForm.court}
                    onChange={(value) => handleQueryFormChange('court', value)}
                    size="xs"
                    clearable
                  />
                  <MultiSelect
                    label="Categories"
                    placeholder="Select categories"
                    data={availableCategories}
                    value={queryForm.categories}
                    onChange={(value) => handleQueryFormChange('categories', value)}
                    size="xs"
                    clearable
                  />
                </Stack>
              </Collapse>
            </Stack>
          </form>

          <Divider mb="sm" />

          {/* Quick Actions */}
          <Stack gap="xs" mb="md">
            <Group justify="space-between">
              <Text size="xs" fw={500} c="dimmed">Quick Actions</Text>
              <ActionIcon
                variant="subtle"
                size="xs"
                onClick={() => setShowFilters(!showFilters)}
              >
                <IconFilter size={12} />
              </ActionIcon>
            </Group>
            
            {hasSelection && (
              <Button variant="light" size="xs" onClick={() => console.log('Export selected')}>
                Export {selectedCases.length} cases
              </Button>
            )}
            
            <Button 
              variant="subtle" 
              size="xs" 
              onClick={handleClearFilters}
              disabled={!queryForm.jurisdiction.length && !queryForm.court.length && !queryForm.categories.length}
            >
              Clear Filters
            </Button>
          </Stack>

          {/* Quick Stats */}
          <Stack gap="xs">
            <Text size="xs" fw={500} c="dimmed">Session Stats</Text>
            <Group gap="lg">
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Results</Text>
                <Text size="sm" fw={500}>{researchState.searchResults.length}</Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Selected</Text>
                <Text size="sm" fw={500}>{selectedCases.length}</Text>
              </Stack>
              <Stack gap={2}>
                <Text size="xs" c="dimmed">Citations</Text>
                <Text size="sm" fw={500}>{citations.length}</Text>
              </Stack>
            </Group>
          </Stack>
        </Paper>
      )}

      {/* Main Content Area */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Content Header */}
        <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="search" leftSection={<IconSearch size={14} />}>
                Results
              </Tabs.Tab>
              <Tabs.Tab value="history" leftSection={<IconHistory size={14} />}>
                History
              </Tabs.Tab>
              <Tabs.Tab value="citations" leftSection={<IconBookmark size={14} />}>
                Citations ({citations.length})
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <Group gap="xs">
            <ActionIcon
              variant={researchState.viewMode === 'list' ? 'filled' : 'light'}
              size="sm"
              onClick={() => handleSetViewMode('list')}
            >
              <IconList size={14} />
            </ActionIcon>
            <ActionIcon
              variant={researchState.viewMode === 'cards' ? 'filled' : 'light'}
              size="sm"
              onClick={() => handleSetViewMode('cards')}
            >
              <IconLayoutGrid size={14} />
            </ActionIcon>
            <ActionIcon
              variant={researchState.viewMode === 'table' ? 'filled' : 'light'}
              size="sm"
              onClick={() => handleSetViewMode('table')}
            >
              <IconTable size={14} />
            </ActionIcon>
          </Group>
        </Group>

        {/* Content Panels */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <Tabs.Panel value="search" style={{ height: '100%' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="sm">
                {isSearching ? (
                  <Group justify="center" py="xl">
                    <Loader size="sm" />
                    <Text size="sm">Searching legal databases...</Text>
                  </Group>
                ) : hasResults ? (
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        {researchState.searchResults.length} cases found
                      </Text>
                      {hasSelection && (
                        <Text size="sm" c="blue">
                          {selectedCases.length} selected
                        </Text>
                      )}
                    </Group>

                    {researchState.viewMode === 'cards' ? (
                      <Grid>
                        {researchState.searchResults.map((case_) => (
                          <Grid.Col key={case_.id} span={6}>
                            <Card
                              withBorder
                              style={{
                                cursor: 'pointer',
                                borderColor: selectedCases.includes(case_.id) ? '#1971c2' : undefined
                              }}
                              onClick={() => handleToggleCaseSelection(case_.id)}
                            >
                              <Stack gap="xs">
                                <Group justify="space-between" align="flex-start">
                                  <Text size="sm" fw={500} lineClamp={2}>
                                    {case_.title}
                                  </Text>
                                  <Badge 
                                    size="xs" 
                                    color={getCaseRelevanceColor(case_.relevance)}
                                  >
                                    {formatRelevanceScore(case_.relevance)}
                                  </Badge>
                                </Group>
                                
                                <Text size="xs" c="dimmed" lineClamp={3}>
                                  {case_.summary}
                                </Text>
                                
                                <Group justify="space-between">
                                  <Text size="xs" c="dimmed">
                                    {case_.court} • {formatCaseDate(case_.date)}
                                  </Text>
                                  <Group gap="xs">
                                    <Tooltip label="Add Citation">
                                      <ActionIcon
                                        size="xs"
                                        variant="subtle"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddCitation(case_);
                                        }}
                                      >
                                        <IconFileText size={12} />
                                      </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Bookmark">
                                      <ActionIcon
                                        size="xs"
                                        variant="subtle"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleBookmarkCase(case_.id);
                                        }}
                                      >
                                        <IconStar size={12} />
                                      </ActionIcon>
                                    </Tooltip>
                                  </Group>
                                </Group>
                              </Stack>
                            </Card>
                          </Grid.Col>
                        ))}
                      </Grid>
                    ) : (
                      <Stack gap="xs">
                        {researchState.searchResults.map((case_) => (
                          <Card
                            key={case_.id}
                            withBorder
                            padding="sm"
                            style={{
                              cursor: 'pointer',
                              borderColor: selectedCases.includes(case_.id) ? '#1971c2' : undefined
                            }}
                            onClick={() => handleToggleCaseSelection(case_.id)}
                          >
                            <Group justify="space-between" align="flex-start">
                              <Stack gap="xs" style={{ flex: 1 }}>
                                <Group justify="space-between">
                                  <Text size="sm" fw={500} lineClamp={1}>
                                    {case_.title}
                                  </Text>
                                  <Badge 
                                    size="xs" 
                                    color={getCaseRelevanceColor(case_.relevance)}
                                  >
                                    {formatRelevanceScore(case_.relevance)}
                                  </Badge>
                                </Group>
                                
                                <Text size="xs" c="dimmed" lineClamp={2}>
                                  {case_.summary}
                                </Text>
                                
                                <Group justify="space-between">
                                  <Text size="xs" c="dimmed">
                                    {case_.court} • {formatCaseDate(case_.date)} • {case_.citation}
                                  </Text>
                                  <Group gap="xs">
                                    <Tooltip label="Add Citation">
                                      <ActionIcon
                                        size="xs"
                                        variant="subtle"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAddCitation(case_);
                                        }}
                                      >
                                        <IconFileText size={12} />
                                      </ActionIcon>
                                    </Tooltip>
                                    <Tooltip label="Bookmark">
                                      <ActionIcon
                                        size="xs"
                                        variant="subtle"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleBookmarkCase(case_.id);
                                        }}
                                      >
                                        <IconStar size={12} />
                                      </ActionIcon>
                                    </Tooltip>
                                  </Group>
                                </Group>
                              </Stack>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                ) : queryForm.query ? (
                  <Group justify="center" py="xl">
                    <Text size="sm" c="dimmed">No results found</Text>
                  </Group>
                ) : (
                  <Group justify="center" py="xl">
                    <Text size="sm" c="dimmed">Enter a search query to begin</Text>
                  </Group>
                )}
              </Box>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="history" style={{ height: '100%' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="sm">
                <Stack gap="sm">
                  {searchHistory.map((query, index) => (
                    <Card key={index} withBorder padding="sm">
                      <Group justify="space-between">
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Text size="sm" fw={500} lineClamp={1}>
                            "{query.query}"
                          </Text>
                          <Text size="xs" c="dimmed">
                            {query.resultCount} results • {formatCaseDate(query.executedAt)}
                          </Text>
                        </Stack>
                        <Button 
                          size="xs" 
                          variant="light"
                          onClick={() => handleQuickSearch(query.query)}
                        >
                          Rerun
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="citations" style={{ height: '100%' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="sm">
                <Stack gap="sm">
                  {citations.map((citation) => (
                    <Card key={citation.id} withBorder padding="sm">
                      <Stack gap="xs">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>
                            {citation.text}
                          </Text>
                          <ActionIcon size="xs" variant="subtle" color="red">
                            <IconBrain size={12} />
                          </ActionIcon>
                        </Group>
                        {citation.notes && (
                          <Text size="xs" c="dimmed">{citation.notes}</Text>
                        )}
                        <Text size="xs" c="dimmed">
                          Added {formatCaseDate(citation.addedAt)}
                        </Text>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Box>
            </ScrollArea>
          </Tabs.Panel>
        </Box>
      </Box>
    </Box>
  );
}; 
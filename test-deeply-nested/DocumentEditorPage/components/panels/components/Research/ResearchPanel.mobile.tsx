import React, { useState } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Badge,
  Card,
  ScrollArea,
  ActionIcon,
  Tabs,
  Drawer,
  MultiSelect,
  Overlay,
  Modal,
  Loader,
  Alert,
  Divider,
  Affix,
  Transition,
  FloatingIndicator,
} from '@mantine/core';
import {
  IconSearch,
  IconHistory,
  IconBookmark,
  IconFilter,
  IconSettings,
  IconRefresh,
  IconFileText,
  IconStar,
  IconChevronDown,
  IconChevronUp,
  IconBrain,
  IconX,
  IconArrowUp,
  IconMenu2,
} from '@tabler/icons-react';
import { useDisclosure, useScrollIntoView } from '@mantine/hooks';
import { useResearchPanelLogic } from './ResearchPanel.logic';
import type { MobileResearchPanelProps } from './ResearchPanel.types';

/**
 * Mobile Research Panel Implementation
 * 
 * Features:
 * - Single column tabbed interface
 * - Touch-optimized case cards
 * - Filter drawer
 * - Fullscreen case detail modal
 * - Bottom action bar
 */
export const MobileResearchPanel: React.FC<MobileResearchPanelProps> = ({
  className,
  style,
  isFullscreen = false,
  onToggleFullscreen,
  showFilterDrawer = false,
  onToggleFilterDrawer,
  activeTab = 'search',
  onTabChange,
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
    handleCreateSession,
    handleClearFilters,
    
    // Utilities
    formatRelevanceScore,
    formatCaseDate,
    getCaseRelevanceColor,
  } = useResearchPanelLogic();

  const [currentTab, setCurrentTab] = useState(activeTab);
  const [filterDrawerOpened, { open: openFilterDrawer, close: closeFilterDrawer }] = useDisclosure(showFilterDrawer);
  const [caseDetailModalOpened, { open: openCaseDetailModal, close: closeCaseDetailModal }] = useDisclosure(false);
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as typeof activeTab);
    onTabChange?.(tab as typeof activeTab);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleCaseCardPress = (caseId: string) => {
    setSelectedCaseForDetail(caseId);
    openCaseDetailModal();
  };

  const selectedCaseData = selectedCaseForDetail 
    ? researchState.searchResults.find(c => c.id === selectedCaseForDetail)
    : null;

  return (
    <Box className={className} style={style} h="100%" display="flex" style={{ flexDirection: 'column' }}>
      <div ref={targetRef} />
      
      {/* Header */}
      <Group justify="space-between" p="md" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <Group gap="xs">
          <IconBrain size={24} />
          <Text fw={600} size="lg">Research</Text>
          {hasResults && (
            <Badge size="sm" variant="light">
              {researchState.searchResults.length}
            </Badge>
          )}
        </Group>
        <Group gap="xs">
          <ActionIcon
            variant="light"
            size="lg"
            onClick={openFilterDrawer}
          >
            <IconFilter size={20} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            size="lg"
            onClick={() => handleCreateSession('Mobile Session')}
          >
            <IconBrain size={20} />
          </ActionIcon>
        </Group>
      </Group>

      {/* Search Form */}
      <Box p="md" style={{ borderBottom: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSearchSubmit}>
          <Stack gap="md">
            <TextInput
              placeholder="Enter legal research query..."
              value={queryForm.query}
              onChange={(e) => handleQueryFormChange('query', e.target.value)}
              leftSection={<IconSearch size={20} />}
              size="md"
            />
            <Group>
              <Button 
                size="md"
                type="submit"
                loading={isSearching}
                disabled={!queryForm.query.trim()}
                flex={1}
              >
                Search
              </Button>
              {(queryForm.jurisdiction.length > 0 || queryForm.court.length > 0 || queryForm.categories.length > 0) && (
                <Button 
                  variant="subtle" 
                  size="md"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              )}
            </Group>
          </Stack>
        </form>
      </Box>

      {/* Tabs */}
      <Tabs value={currentTab} onChange={handleTabChange} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Tabs.List grow>
          <Tabs.Tab value="search" leftSection={<IconSearch size={16} />}>
            Results {hasResults && `(${researchState.searchResults.length})`}
          </Tabs.Tab>
          <Tabs.Tab value="history" leftSection={<IconHistory size={16} />}>
            History
          </Tabs.Tab>
          <Tabs.Tab value="citations" leftSection={<IconBookmark size={16} />}>
            Citations {citations.length > 0 && `(${citations.length})`}
          </Tabs.Tab>
        </Tabs.List>

        {/* Tab Content */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <Tabs.Panel value="search" style={{ height: '100%' }}>
            <ScrollArea 
              style={{ height: '100%' }}
              onScrollPositionChange={({ y }) => setShowScrollTop(y > 200)}
            >
              <Box p="md">
                {isSearching ? (
                  <Group justify="center" py="xl">
                    <Loader size="md" />
                    <Text size="md">Searching databases...</Text>
                  </Group>
                ) : hasResults ? (
                  <Stack gap="md">
                    {hasSelection && (
                      <Card withBorder p="md" bg="blue.0">
                        <Group justify="space-between">
                          <Text size="sm" fw={500}>
                            {selectedCases.length} cases selected
                          </Text>
                          <Button size="xs" variant="light">
                            Export
                          </Button>
                        </Group>
                      </Card>
                    )}

                    {researchState.searchResults.map((case_) => (
                      <Card
                        key={case_.id}
                        withBorder
                        padding="md"
                        style={{
                          cursor: 'pointer',
                          borderColor: selectedCases.includes(case_.id) ? '#1971c2' : undefined,
                          borderWidth: selectedCases.includes(case_.id) ? 2 : 1,
                        }}
                        onClick={() => handleCaseCardPress(case_.id)}
                      >
                        <Stack gap="sm">
                          <Group justify="space-between" align="flex-start">
                            <Text size="md" fw={500} lineClamp={2} style={{ flex: 1 }}>
                              {case_.title}
                            </Text>
                            <Badge 
                              size="sm" 
                              color={getCaseRelevanceColor(case_.relevance)}
                            >
                              {formatRelevanceScore(case_.relevance)}
                            </Badge>
                          </Group>
                          
                          <Text size="sm" c="dimmed" lineClamp={3}>
                            {case_.summary}
                          </Text>
                          
                          <Group justify="space-between">
                            <Stack gap={4}>
                              <Text size="xs" c="dimmed">
                                {case_.court}
                              </Text>
                              <Text size="xs" c="dimmed">
                                {formatCaseDate(case_.date)} • {case_.citation}
                              </Text>
                            </Stack>
                            
                            <Group gap="xs">
                              <ActionIcon
                                size="lg"
                                variant="subtle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleCaseSelection(case_.id);
                                }}
                                color={selectedCases.includes(case_.id) ? 'blue' : 'gray'}
                              >
                                <IconSearch size={18} />
                              </ActionIcon>
                              
                              <ActionIcon
                                size="lg"
                                variant="subtle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddCitation(case_);
                                }}
                              >
                                <IconFileText size={18} />
                              </ActionIcon>
                              
                              <ActionIcon
                                size="lg"
                                variant="subtle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleBookmarkCase(case_.id);
                                }}
                              >
                                <IconStar size={18} />
                              </ActionIcon>
                            </Group>
                          </Group>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                ) : queryForm.query ? (
                  <Group justify="center" py="xl">
                    <Stack align="center" gap="md">
                      <IconSearch size={48} color="#adb5bd" />
                      <Text size="md" c="dimmed" ta="center">
                        No results found for "{queryForm.query}"
                      </Text>
                      <Button variant="light" onClick={handleClearFilters}>
                        Try clearing filters
                      </Button>
                    </Stack>
                  </Group>
                ) : (
                  <Group justify="center" py="xl">
                    <Stack align="center" gap="md">
                      <IconBrain size={48} color="#adb5bd" />
                      <Text size="md" c="dimmed" ta="center">
                        Enter a search query to find legal cases
                      </Text>
                    </Stack>
                  </Group>
                )}
              </Box>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="history" style={{ height: '100%' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="md">
                <Stack gap="md">
                  {searchHistory.map((query, index) => (
                    <Card key={index} withBorder padding="md">
                      <Stack gap="sm">
                        <Text size="md" fw={500} lineClamp={2}>
                          "{query.query}"
                        </Text>
                        <Group justify="space-between">
                          <Text size="sm" c="dimmed">
                            {query.resultCount} results
                          </Text>
                          <Text size="sm" c="dimmed">
                            {formatCaseDate(query.executedAt)}
                          </Text>
                        </Group>
                        <Button 
                          size="sm" 
                          variant="light"
                          onClick={() => handleQuickSearch(query.query)}
                          fullWidth
                        >
                          Search Again
                        </Button>
                      </Stack>
                    </Card>
                  ))}
                  
                  {searchHistory.length === 0 && (
                    <Group justify="center" py="xl">
                      <Stack align="center" gap="md">
                        <IconHistory size={48} color="#adb5bd" />
                        <Text size="md" c="dimmed" ta="center">
                          No search history yet
                        </Text>
                      </Stack>
                    </Group>
                  )}
                </Stack>
              </Box>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="citations" style={{ height: '100%' }}>
            <ScrollArea style={{ height: '100%' }}>
              <Box p="md">
                <Stack gap="md">
                  {citations.map((citation) => (
                    <Card key={citation.id} withBorder padding="md">
                      <Stack gap="sm">
                        <Text size="md" fw={500}>
                          {citation.text}
                        </Text>
                        {citation.notes && (
                          <Text size="sm" c="dimmed">
                            {citation.notes}
                          </Text>
                        )}
                        <Group justify="space-between">
                          <Text size="xs" c="dimmed">
                            Added {formatCaseDate(citation.addedAt)}
                          </Text>
                          <ActionIcon size="sm" variant="subtle" color="red">
                            <IconX size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                  
                  {citations.length === 0 && (
                    <Group justify="center" py="xl">
                      <Stack align="center" gap="md">
                        <IconBookmark size={48} color="#adb5bd" />
                        <Text size="md" c="dimmed" ta="center">
                          No citations saved yet
                        </Text>
                      </Stack>
                    </Group>
                  )}
                </Stack>
              </Box>
            </ScrollArea>
          </Tabs.Panel>
        </Box>
      </Tabs>

      {/* Filter Drawer */}
      <Drawer
        opened={filterDrawerOpened}
        onClose={closeFilterDrawer}
        title="Search Filters"
        position="bottom"
        size="70%"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <Stack gap="md">
          <MultiSelect
            label="Jurisdiction"
            placeholder="Select jurisdictions"
            data={availableJurisdictions}
            value={queryForm.jurisdiction}
            onChange={(value) => handleQueryFormChange('jurisdiction', value)}
            size="md"
            clearable
          />
          
          <MultiSelect
            label="Court"
            placeholder="Select courts"
            data={availableCourts}
            value={queryForm.court}
            onChange={(value) => handleQueryFormChange('court', value)}
            size="md"
            clearable
          />
          
          <MultiSelect
            label="Categories"
            placeholder="Select legal categories"
            data={availableCategories}
            value={queryForm.categories}
            onChange={(value) => handleQueryFormChange('categories', value)}
            size="md"
            clearable
          />
          
          <Group>
            <Button 
              onClick={closeFilterDrawer}
              flex={1}
            >
              Apply Filters
            </Button>
            <Button 
              variant="subtle"
              onClick={() => {
                handleClearFilters();
                closeFilterDrawer();
              }}
            >
              Clear
            </Button>
          </Group>
        </Stack>
      </Drawer>

      {/* Case Detail Modal */}
      <Modal
        opened={caseDetailModalOpened}
        onClose={closeCaseDetailModal}
        title={selectedCaseData?.title}
        size="100%"
        padding="lg"
        fullScreen
      >
        {selectedCaseData && (
          <Stack gap="md">
            <Group justify="space-between">
              <Badge color={getCaseRelevanceColor(selectedCaseData.relevance)}>
                {formatRelevanceScore(selectedCaseData.relevance)} relevance
              </Badge>
              <Group gap="xs">
                <ActionIcon
                  size="lg"
                  variant="light"
                  onClick={() => handleAddCitation(selectedCaseData)}
                >
                  <IconFileText size={20} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="light"
                  onClick={() => handleBookmarkCase(selectedCaseData.id)}
                >
                  <IconStar size={20} />
                </ActionIcon>
              </Group>
            </Group>
            
            <Divider />
            
            <Stack gap="sm">
              <Text size="sm" c="dimmed">Court</Text>
              <Text size="md">{selectedCaseData.court}</Text>
            </Stack>
            
            <Stack gap="sm">
              <Text size="sm" c="dimmed">Date</Text>
              <Text size="md">{formatCaseDate(selectedCaseData.date)}</Text>
            </Stack>
            
            <Stack gap="sm">
              <Text size="sm" c="dimmed">Citation</Text>
              <Text size="md" ff="monospace">{selectedCaseData.citation}</Text>
            </Stack>
            
            <Stack gap="sm">
              <Text size="sm" c="dimmed">Summary</Text>
              <Text size="md">{selectedCaseData.summary}</Text>
            </Stack>
            
            {selectedCaseData.categories.length > 0 && (
              <Stack gap="sm">
                <Text size="sm" c="dimmed">Categories</Text>
                <Group gap="xs">
                  {selectedCaseData.categories.map((category) => (
                    <Badge key={category} variant="light" size="sm">
                      {category}
                    </Badge>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>
        )}
      </Modal>

      {/* Scroll to Top Button */}
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={showScrollTop}>
          {(transitionStyles) => (
            <ActionIcon
              size="xl"
              radius="xl"
              variant="filled"
              style={transitionStyles}
              onClick={() => scrollIntoView({ alignment: 'start' })}
            >
              <IconArrowUp size={20} />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </Box>
  );
}; 
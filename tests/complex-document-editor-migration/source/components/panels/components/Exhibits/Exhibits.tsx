import React, { useMemo } from 'react';
import {
  Box,
  Stack,
  Group,
  Button,
  Text,
  ScrollArea,
  Paper,
  Modal,
  TextInput,
  Textarea,
  MultiSelect,
  Select,
  Alert,
  Loader,
  Center
} from '@mantine/core';
import {
  IconPlus,
  IconTags,
  IconSortAscending,
  IconSortDescending,
  IconAlertCircle,
  IconFileText
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useExhibits } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/Exhibits.hook';
import { ExhibitFilters } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitFilters';
import { ExhibitItem } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem';
import {
  ExhibitItem as ExhibitItemType,
  ExhibitFormData,
  ExhibitSortField,
  ExhibitSortDirection
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/Exhibits.types';

const sortOptions = [
  { value: 'label', label: 'Label (A-Z)' },
  { value: 'title', label: 'Title' },
  { value: 'createdAt', label: 'Date Created' },
  { value: 'status', label: 'Status' },
  { value: 'relevance', label: 'Relevance' }
];

export const Panel: React.FC = () => {
  const {
    exhibits,
    filteredExhibits,
    filters,
    sortField,
    sortDirection,
    selectedExhibit,
    isLoading,
    isCreating,
    nextLabel,
    createExhibit,
    updateExhibit,
    deleteExhibit,
    addCitation,
    applyFilters,
    setSorting,
    selectExhibit,
    relabelExhibits
  } = useExhibits();

  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [currentExhibit, setCurrentExhibit] = React.useState<ExhibitItemType | null>(null);

  // Form state
  const [formData, setFormData] = React.useState<ExhibitFormData>({
    title: '',
    description: '',
    fileId: '',
    tags: [],
    metadata: {
      relevance: 'medium',
      keywords: []
    }
  });

  // Derived values
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    exhibits.forEach(exhibit => {
      exhibit.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [exhibits]);

  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));

  // Handlers
  const handleCreateExhibit = () => {
    setFormData({
      title: '',
      description: '',
      fileId: '',
      tags: [],
      metadata: {
        relevance: 'medium',
        keywords: []
      }
    });
    setCurrentExhibit(null);
    openCreateModal();
  };

  const handleEditExhibit = (exhibit: ExhibitItemType) => {
    setFormData({
      title: exhibit.title,
      description: exhibit.description || '',
      fileId: exhibit.fileId || '',
      tags: exhibit.tags,
      metadata: exhibit.metadata
    });
    setCurrentExhibit(exhibit);
    openEditModal();
  };

  const handleViewExhibit = (exhibit: ExhibitItemType) => {
    selectExhibit(exhibit);
  };

  const handleAddCitation = (exhibit: ExhibitItemType) => {
    // TODO: Open citation modal
    console.log('Add citation for exhibit:', exhibit.label);
  };

  const handleSubmitForm = async () => {
    try {
      if (currentExhibit) {
        await updateExhibit(currentExhibit.id, formData);
        closeEditModal();
      } else {
        await createExhibit(formData);
        closeCreateModal();
      }
    } catch (error) {
      console.error('Error saving exhibit:', error);
    }
  };

  const handleDeleteExhibit = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this exhibit?')) {
      await deleteExhibit(id);
    }
  };

  const handleSortChange = (field: string | null) => {
    if (!field) return;
    const newField = field as ExhibitSortField;
    const newDirection: ExhibitSortDirection = 
      field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSorting(newField, newDirection);
  };

  const relevanceOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  return (
    <Box h="100%" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box p="md" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group justify="space-between" align="center" mb="md">
          <Text fw={600} size="lg">Exhibits</Text>
          <Group gap="xs">
            <Button
              size="sm"
              variant="light"
              onClick={relabelExhibits}
              loading={isLoading}
            >
              Re-label
            </Button>
            <Button
              size="sm"
              leftSection={<IconPlus size={16} />}
              onClick={handleCreateExhibit}
              loading={isCreating}
            >
              Add Exhibit
            </Button>
          </Group>
        </Group>

        {/* Quick stats */}
        <Group gap="md" mb="md">
          <Text size="sm" c="dimmed">
            Next: <strong>{nextLabel}</strong>
          </Text>
          <Text size="sm" c="dimmed">
            Total: <strong>{exhibits.length}</strong>
          </Text>
          <Text size="sm" c="dimmed">
            Filtered: <strong>{filteredExhibits.length}</strong>
          </Text>
        </Group>

        {/* Sorting */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text size="sm" c="dimmed">Sort by:</Text>
            <Select
              size="xs"
              value={sortField}
              onChange={handleSortChange}
              data={sortOptions}
              style={{ width: 140 }}
            />
            <Button
              size="xs"
              variant="subtle"
              onClick={() => setSorting(sortField, sortDirection === 'asc' ? 'desc' : 'asc')}
              leftSection={
                sortDirection === 'asc' ? 
                  <IconSortAscending size={14} /> : 
                  <IconSortDescending size={14} />
              }
            >
              {sortDirection.toUpperCase()}
            </Button>
          </Group>
        </Group>
      </Box>

      {/* Filters */}
      <Box p="md">
        <ExhibitFilters
          filters={filters}
          onFiltersChange={applyFilters}
          availableTags={availableTags}
          totalCount={exhibits.length}
          filteredCount={filteredExhibits.length}
        />
      </Box>

      {/* Content */}
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <ScrollArea h="100%" p="md">
          {isLoading ? (
            <Center h={200}>
              <Loader />
            </Center>
          ) : filteredExhibits.length === 0 ? (
            <Center h={200}>
              <Stack align="center" gap="md">
                <IconFileText size={48} stroke={1} style={{ color: 'var(--mantine-color-gray-5)' }} />
                <Text c="dimmed" ta="center">
                  {exhibits.length === 0 ? 'No exhibits yet' : 'No exhibits match your filters'}
                </Text>
                {exhibits.length === 0 && (
                  <Button onClick={handleCreateExhibit}>
                    Create your first exhibit
                  </Button>
                )}
              </Stack>
            </Center>
          ) : (
            <Stack gap="md">
              {filteredExhibits.map((exhibit) => (
                <ExhibitItem
                  key={exhibit.id}
                  exhibit={exhibit}
                  onEdit={handleEditExhibit}
                  onDelete={handleDeleteExhibit}
                  onView={handleViewExhibit}
                  onAddCitation={handleAddCitation}
                  isSelected={selectedExhibit?.id === exhibit.id}
                  onSelect={selectExhibit}
                />
              ))}
            </Stack>
          )}
        </ScrollArea>
      </Box>

      {/* Create/Edit Modal */}
      <Modal
        opened={createModalOpened || editModalOpened}
        onClose={() => {
          closeCreateModal();
          closeEditModal();
        }}
        title={currentExhibit ? 'Edit Exhibit' : 'Create New Exhibit'}
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter exhibit title..."
            value={formData.title}
            onChange={(event) => setFormData(prev => ({
              ...prev,
              title: event.currentTarget.value
            }))}
            required
          />

          <Textarea
            label="Description"
            placeholder="Enter exhibit description..."
            value={formData.description}
            onChange={(event) => setFormData(prev => ({
              ...prev,
              description: event.currentTarget.value
            }))}
            minRows={3}
          />

          <TextInput
            label="File ID"
            placeholder="Associated file ID..."
            value={formData.fileId}
            onChange={(event) => setFormData(prev => ({
              ...prev,
              fileId: event.currentTarget.value
            }))}
          />

          <MultiSelect
            label="Tags"
            placeholder="Select or create tags..."
            data={tagOptions}
            value={formData.tags}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              tags: value
            }))}
            searchable
          />

          <Select
            label="Relevance"
            value={formData.metadata.relevance}
            onChange={(value) => setFormData(prev => ({
              ...prev,
              metadata: {
                ...prev.metadata,
                relevance: value as 'high' | 'medium' | 'low'
              }
            }))}
            data={relevanceOptions}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="light"
              onClick={() => {
                closeCreateModal();
                closeEditModal();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitForm}
              loading={isCreating || isLoading}
            >
              {currentExhibit ? 'Update' : 'Create'} Exhibit
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}; 
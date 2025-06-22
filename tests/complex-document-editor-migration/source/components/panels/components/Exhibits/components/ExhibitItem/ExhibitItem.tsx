import React from 'react';
import {
  Text,
  Badge,
  Group,
  ActionIcon,
  Stack,
  Menu,
  Box
} from '@mantine/core';
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconLink,
  IconDots,
  IconFile
} from '@tabler/icons-react';

import { ExhibitItemProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem/ExhibitItem.types';
import { StyledCard, ExhibitLabel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem/ExhibitItem.styles';
import { 
  getStatusColor, 
  getStatusIcon, 
  getRelevanceColor,
  formatCitationsText,
  formatTagsDisplay
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem/ExhibitItem.logic';
import { useExhibitItemHandlers } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem/ExhibitItem.hook';

export const ExhibitItem: React.FC<ExhibitItemProps> = (props) => {
  const {
    exhibit,
    isSelected = false,
    onSelect
  } = props;

  const handlers = useExhibitItemHandlers(props);
  const StatusIcon = getStatusIcon(exhibit.status);
  const { visibleTags, remainingCount, hasMoreTags } = formatTagsDisplay(exhibit.tags);

  return (
    <StyledCard
      padding="md"
      radius="md"
      withBorder
      isSelected={isSelected}
      isClickable={!!onSelect}
      onClick={handlers.handleCardClick}
    >
      <Stack gap="sm">
        {/* Header row */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm" align="center">
            {/* Exhibit label */}
            <ExhibitLabel>
              {exhibit.label}
            </ExhibitLabel>
            
            {/* Status badge */}
            <Badge
              color={getStatusColor(exhibit.status)}
              variant="light"
              leftSection={<StatusIcon size={12} />}
              size="sm"
            >
              {exhibit.status}
            </Badge>
          </Group>

          {/* Actions menu */}
          <Menu shadow="md" width={180}>
            <Menu.Target>
              <ActionIcon
                variant="light"
                color="gray"
                size="sm"
                onClick={handlers.handleMenuClick}
              >
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconEye size={16} />}
                onClick={handlers.handleView}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={handlers.handleEdit}
              >
                Edit
              </Menu.Item>
              <Menu.Item
                leftSection={<IconLink size={16} />}
                onClick={handlers.handleAddCitation}
              >
                Add Citation
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconTrash size={16} />}
                color="red"
                onClick={handlers.handleDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        {/* Title and description */}
        <Box>
          <Text fw={600} size="sm" mb={4}>
            {exhibit.title}
          </Text>
          {exhibit.description && (
            <Text size="xs" c="dimmed" lineClamp={2}>
              {exhibit.description}
            </Text>
          )}
        </Box>

        {/* File info */}
        {exhibit.fileName && (
          <Group gap="xs" align="center">
            <IconFile size={14} />
            <Text size="xs" c="dimmed">
              {exhibit.fileName}
              {exhibit.pageNumber && ` (Page ${exhibit.pageNumber})`}
            </Text>
          </Group>
        )}

        {/* Metadata row */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            {/* Relevance badge */}
            {exhibit.metadata.relevance && (
              <Badge
                color={getRelevanceColor(exhibit.metadata.relevance)}
                variant="outline"
                size="xs"
              >
                {exhibit.metadata.relevance}
              </Badge>
            )}
            
            {/* Category badge */}
            {exhibit.metadata.category && (
              <Badge variant="outline" size="xs" color="gray">
                {exhibit.metadata.category}
              </Badge>
            )}
          </Group>

          {/* Citations count */}
          {exhibit.citations.length > 0 && (
            <Group gap={4} align="center">
              <IconLink size={12} />
              <Text size="xs" c="dimmed">
                {formatCitationsText(exhibit.citations.length)}
              </Text>
            </Group>
          )}
        </Group>

        {/* Tags */}
        {exhibit.tags.length > 0 && (
          <Group gap={4}>
            {visibleTags.map((tag, index) => (
              <Badge
                key={index}
                variant="dot"
                size="xs"
                color="blue"
              >
                {tag}
              </Badge>
            ))}
            {hasMoreTags && (
              <Text size="xs" c="dimmed">
                +{remainingCount} more
              </Text>
            )}
          </Group>
        )}

        {/* Footer info */}
        <Group justify="space-between" align="center" mt="xs">
          <Text size="xs" c="dimmed">
            Created {exhibit.createdAt.toLocaleDateString()}
          </Text>
          
          {exhibit.metadata.source && (
            <Text size="xs" c="dimmed">
              {exhibit.metadata.source}
            </Text>
          )}
        </Group>
      </Stack>
    </StyledCard>
  );
}; 
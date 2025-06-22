/**
 * Research Panel Component
 * @module ResearchPanel
 */

import React, { useState, useCallback } from 'react';
import {
  Box,
  Stack,
  Group,
  Text,
  Button,
  TextInput,
  Select,
  NumberInput,
  Badge,
  Card,
  ScrollArea,
  Loader,
  Alert,
  ActionIcon,
  Tooltip,
  Tabs,
  Collapse
} from '@mantine/core';
import {
  IconSearch,
  IconUpload,
  IconHistory,
  IconRefresh,
  IconTrash,
  IconCopy,
  IconFileText,
  IconChevronDown,
  IconChevronUp,
  IconBrain
} from '@tabler/icons-react';
import { useMediaQuery } from '@mantine/hooks';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useDocumentResearch } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.hook';
import type { 
  ResearchQuery, 
  DocumentPassage,
  BaseResearchPanelProps
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.types';
import { DesktopResearchPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.web';
import { MobileResearchPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.mobile';

/**
 * Research Panel - Level 3 Platform Separation
 * 
 * Entry point that routes to platform-specific implementations:
 * - Desktop: Multi-column layout with sidebar search and results
 * - Mobile: Single column with tabbed interface
 * 
 * @param props - Base research panel configuration
 */
export const ResearchPanel: React.FC<BaseResearchPanelProps> = (props) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return isMobile ? (
    <MobileResearchPanel {...props} />
  ) : (
    <DesktopResearchPanel {...props} />
  );
};

export default ResearchPanel; 
/**
 * Research Panel Module - Level 3 Platform Separation
 * @module panels/research
 */

// Main component (platform router)
export { ResearchPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel';

// Platform-specific implementations
export { DesktopResearchPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.web';
export { MobileResearchPanel } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.mobile';

// Shared logic hook
export { useResearchPanelLogic } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.logic';

// Legacy hook (for backward compatibility)
export { useDocumentResearch } from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.hook';

// Type exports - New Level 3 types
export type {
  SearchFormProps,
  SearchFiltersProps,
  SearchResultsProps,
  CaseCardProps,
  SearchHistoryProps,
  CitationManagerProps,
  SessionManagerProps,
  QuickActionsProps,
  BaseResearchPanelProps,
  DesktopResearchPanelProps,
  MobileResearchPanelProps,
  ResearchPanelLayout,
  ResearchPanelState,
  ResearchPanelContextValue,
  PlatformProps,
  ResearchPanelBreakpoints,
  ComponentSize,
  ComponentVariant,
  AnimationConfig,
  AccessibilityConfig,
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.types';

// Type exports - Legacy types (for backward compatibility)
export type {
  ResearchQuery,
  ResearchResults,
  ResearchDocument,
  DocumentPassage,
  VectorStoreConfig,
  ResearchState,
  ResearchActions
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.types';

// Re-export Redux slice types
export type {
  LegalCase,
  Citation,
  SearchQuery,
  ResearchSession,
} from '@/tests/complex-document-editor-migration/source/components/panels/components/Research/ResearchPanel.types'; 
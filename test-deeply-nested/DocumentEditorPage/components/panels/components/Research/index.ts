/**
 * Research Panel Module - Level 3 Platform Separation
 * @module panels/research
 */

// Main component (platform router)
export { ResearchPanel } from './ResearchPanel';

// Platform-specific implementations
export { DesktopResearchPanel } from './ResearchPanel.web';
export { MobileResearchPanel } from './ResearchPanel.mobile';

// Shared logic hook
export { useResearchPanelLogic } from './ResearchPanel.logic';

// Legacy hook (for backward compatibility)
export { useDocumentResearch } from './ResearchPanel.hook';

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
} from './ResearchPanel.types';

// Type exports - Legacy types (for backward compatibility)
export type {
  ResearchQuery,
  ResearchResults,
  ResearchDocument,
  DocumentPassage,
  VectorStoreConfig,
  ResearchState,
  ResearchActions
} from './ResearchPanel.types';

// Re-export Redux slice types
export type {
  LegalCase,
  Citation,
  SearchQuery,
  ResearchSession,
} from './ResearchPanel.types'; 
/**
 * DocumentEditorPage Types
 * @module DocumentEditorPage.types
 */

import { ReactNode } from 'react';
import type { 
  LegalDocument, 
  Node
} from '../../types/legal-document-ast';
import type { 
  DocumentPoolItem,
  ExhibitAssignmentData
} from '../../shared-components/molecules/DocumentPool/DocumentPool.types';

export interface DocumentEditorPageProps {
  /** Initial document to load */
  initialDocument?: LegalDocument | null;
  /** Callback when document changes */
  onDocumentChange?: (document: LegalDocument | null) => void;
  /** Read-only mode */
  readOnly?: boolean;
}

export interface PanelState {
  /** Whether the left panel is expanded */
  leftPanelExpanded: boolean;
  /** Whether the right panel is expanded */
  rightPanelExpanded: boolean;
  /** Active tab in left panel */
  activeLeftTab: 'palette' | 'assets' | 'history';
  /** Active tab in right panel */
  activeRightTab: 'agent' | 'properties' | 'chat';
}

export interface ResizablePanelState extends PanelState {
  /** Left panel width in pixels */
  leftPanelWidth: number;
  /** Right panel width in pixels */
  rightPanelWidth: number;
  /** Whether left panel is collapsed to rail */
  isLeftCollapsed: boolean;
  /** Whether right panel is collapsed to rail */
  isRightCollapsed: boolean;
  /** Current viewport mode */
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  /** Panel drag state */
  isDragging: boolean;
}

export interface TouchTargetConfig {
  /** Minimum touch target size in pixels */
  minSize: number;
  /** Minimum spacing between targets in pixels */
  spacing: number;
  /** Primary action bar height in pixels */
  primaryActionHeight: number;
}

export interface DocumentState {
  /** Current document being edited */
  document: LegalDocument | null;
  /** Currently selected node */
  selectedNode: Node | null;
  /** Whether AI is currently generating content */
  isGenerating: boolean;
  /** Current document type selection */
  documentType: string;
}

export interface AIAgentState {
  /** Current AI prompt input */
  agentPrompt: string;
  /** Available AI actions */
  agentActions: AIAgentAction[];
}

export interface AIAgentAction {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ComponentType<any>;
  /** Description text */
  description: string;
}

export interface DocumentStats {
  /** Word count */
  words: number;
  /** Page count */
  pages: number;
  /** Character count */
  characters: number;
  /** Last modified timestamp */
  lastModified: string;
}

export interface QuickAction {
  /** Action identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon: React.ComponentType<any>;
  /** Click handler */
  onClick: () => void;
  /** Disabled state */
  disabled?: boolean;
}

export interface DocumentPoolEntry {
  /** Document ID */
  id: string;
  /** Document title */
  title: string;
  /** Document type */
  type: string;
  /** Current status */
  status: 'Draft' | 'Review' | 'Final';
}

export interface RecentDocument {
  /** Document ID */
  id: string;
  /** Document title */
  title: string;
  /** Last accessed timestamp */
  accessed: string;
}

export type CanvasVariant = 'expanded' | 'leftOnly' | 'rightOnly' | 'minimal';

export interface DocumentPage {
  /** Page unique identifier */
  id: string;
  /** Page content */
  content: React.ReactNode;
  /** Page number (1-indexed) */
  pageNumber: number;
  /** Page dimensions */
  dimensions: {
    width: number;
    height: number;
  };
}

export interface MultiPageDocument {
  /** Array of document pages */
  pages: DocumentPage[];
  /** Currently active page index */
  currentPageIndex: number;
  /** View mode for pages */
  viewMode: 'single' | 'infinite' | 'thumbnail';
  /** Total page count */
  totalPages: number;
}

export interface PanelResizeHandlers {
  /** Handle left panel resize */
  onLeftPanelResize: (width: number) => void;
  /** Handle right panel resize */
  onRightPanelResize: (width: number) => void;
  /** Toggle left panel collapse */
  onLeftPanelToggle: () => void;
  /** Toggle right panel collapse */
  onRightPanelToggle: () => void;
}

export interface PanelSlot {
  /** Panel location */
  location: 'left' | 'right' | 'center';
  /** Panel slot position */
  slot: 'top' | 'bottom';
  /** Panel title */
  title: string;
  /** Panel content */
  content: React.ReactNode;
  /** Whether panel is collapsed */
  collapsed?: boolean;
  /** Whether panel is visible */
  visible?: boolean;
  /** Minimum height/width in pixels */
  minSize?: number;
  /** Maximum height/width in pixels */
  maxSize?: number;
  /** Default size in pixels or percentage */
  defaultSize?: number | string;
}

export interface PanelLayout {
  /** Left column width percentage (0-40) */
  leftWidth: number;
  /** Right column width percentage (0-40) */
  rightWidth: number;
  /** Left column split ratio (0-1, top vs bottom) */
  leftSplit: number;
  /** Right column split ratio (0-1, top vs bottom) */
  rightSplit: number;
  /** Center bottom panel height in pixels */
  centerBottomHeight: number;
  /** Whether center bottom is expanded */
  centerBottomExpanded: boolean;
}

export interface PanelResizeConfig {
  /** Resize direction */
  direction: 'horizontal' | 'vertical';
  /** Panel position for resize direction calculation */
  panelPosition?: 'left' | 'right' | 'center';
  /** Minimum size in pixels */
  minSize: number;
  /** Maximum size in pixels or percentage */
  maxSize: number | string;
  /** Current size */
  currentSize: number;
  /** Size constraints */
  constraints: {
    minPercent: number;
    maxPercent: number;
  };
  /** Container dimensions for reactive calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
}

export interface EditorLayoutState {
  /** Panel layout configuration */
  layout: PanelLayout;
  /** Individual panel states */
  panels: Record<string, {
    collapsed: boolean;
    visible: boolean;
    size: number;
  }>;
  /** Viewport mode */
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  /** Last modified timestamp */
  lastModified: number;
}

export interface SafeAreaInsets {
  /** Top safe area (status bar) */
  top: number;
  /** Bottom safe area (home indicator) */
  bottom: number;
  /** Left safe area (notch) */
  left: number;
  /** Right safe area (notch) */
  right: number;
} 
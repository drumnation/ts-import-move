import type { PanelSlot } from '../../DocumentEditorPage.types';

export const PANEL_SIZES = {
  LEFT_TOP_MIN: 240,
  LEFT_TOP_DEFAULT: 300,
  LEFT_BOTTOM_MIN: 200,
  LEFT_BOTTOM_DEFAULT: 250,
  RIGHT_TOP_MIN: 280,
  RIGHT_TOP_DEFAULT: 350,
  RIGHT_BOTTOM_MIN: 200,
  RIGHT_BOTTOM_DEFAULT: 220,
} as const;

export const PANEL_DATA = {
  DOCUMENT_OUTLINE: {
    title: 'Document Outline',
    description: 'Document structure and navigation',
    items: ['Introduction', 'Legal Framework', 'Analysis', 'Conclusion']
  },
  ASSETS_RESOURCES: {
    title: 'Assets & Resources',
    description: 'Document assets and references',
    items: ['Case citations', 'Legal precedents', 'Supporting documents']
  },
  AI_ASSISTANT: {
    title: 'AI Legal Assistant'
  },
  PROPERTIES_METADATA: {
    title: 'Properties & Metadata'
  }
} as const;

export const createPanelSlotConfig = (
  location: 'left' | 'right',
  slot: 'top' | 'bottom',
  title: string,
  content: React.ReactNode,
  minSize: number,
  defaultSize: number
): PanelSlot => ({
  location,
  slot,
  title,
  content,
  collapsed: false,
  visible: true,
  minSize,
  defaultSize
}); 
import type { MultiPageDocument, PanelSlot } from '../../../../DocumentEditorPage.types';
import type { PanelCalculations, PanelHandlers } from '../../EditorCanvas.types';

export interface MobileCanvasLayoutProps {
  /** Document to display */
  document?: MultiPageDocument;
  /** Panel slots configuration */
  panelSlots: PanelSlot[];
  /** Panel calculations */
  panelCalculations: PanelCalculations;
  /** Panel handlers */
  panelHandlers: PanelHandlers;
  /** Layout state */
  layoutState: any;
  /** Panel close handler */
  onPanelClose?: (location: string, slot: string) => void;
  /** Panel split handler */
  onPanelSplit?: (location: string, slot: string) => void;
  /** Container dimensions for reactive calculations */
  containerDimensions?: {
    width: number;
    height: number;
  };
  /** Node insertion handler */
  onInsertNode?: (nodeType: string) => void;
} 
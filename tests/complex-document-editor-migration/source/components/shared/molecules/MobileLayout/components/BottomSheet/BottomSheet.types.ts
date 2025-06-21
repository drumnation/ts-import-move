import { TouchTargetConfig as MobileLayoutTouchTargetConfig, SheetType as MobileLayoutSheetType } from '../../MobileLayout.types';

// Re-export types for component use
export type TouchTargetConfig = MobileLayoutTouchTargetConfig;
export type SheetType = MobileLayoutSheetType;

export interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  /** Current sheet type */
  sheetType: SheetType;
  /** Sheet title */
  title: string;
  /** Sheet content */
  children: React.ReactNode;
  /** Touch target configuration */
  touchConfig: TouchTargetConfig;
  /** Callback when sheet should close */
  onClose: () => void;
} 
/**
 * Desktop Layout Components
 * 
 * Barrel exports for desktop-specific layout components
 * Provides clean imports for desktop layout system
 * 
 * @module desktop/index
 */

export { ThreeColumnLayout, useThreeColumnLayout } from './ThreeColumnLayout';
export type {
  ThreeColumnLayoutProps,
  ThreeColumnLayoutLogic,
  ThreeColumnState,
  ColumnConfiguration,
  ColumnConstraints,
  ResizeOperation,
} from './ThreeColumnLayout'; 
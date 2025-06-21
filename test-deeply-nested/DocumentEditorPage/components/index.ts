/**
 * DocumentEditorPage Components Index
 * 
 * Centralized exports for all components
 * Organized by architectural concerns
 * 
 * @module components
 */

// Layout Components (Architectural)
export * from './layout';

// Panel System (Feature-specific)
export * from './panels';

// Shared Components (Atomic Design System)
// Note: Import directly from shared/atoms, shared/molecules, etc. to avoid conflicts
// Example: import { PanelContent } from './components/shared/atoms'; 
/**
 * Visual-to-Code Navigation Map for AI Agents
 * 
 * This file provides instant navigation for AI agents working on DocumentEditorPage.
 * Instead of browsing through complex directory structures, agents can look up
 * functionality by what the user sees or what task they need to accomplish.
 * 
 * @module NAVIGATION_MAP
 */

/**
 * Map visual elements to their code locations
 * Use this when user reports issues with specific UI elements
 */
export const VISUAL_TO_CODE_MAP = {
  // Left sidebar
  'left sidebar': 'components/layout/desktop/ThreeColumnLayout/',
  'left panel': 'components/containers/LeftPanel/',
  'left navigation': 'components/containers/LeftPanel/',
  'document outline': 'components/containers/LeftPanel/',
  'file tree': 'components/containers/LeftPanel/',
  
  // Right sidebar  
  'right sidebar': 'components/layout/desktop/ThreeColumnLayout/',
  'right panel': 'components/containers/RightPanel/',
  'AI assistant': 'components/panels/components/AiAssistant/',
  'AI chat': 'components/panels/components/AiAssistant/',
  'properties panel': 'components/containers/RightPanel/',
  'metadata panel': 'components/containers/RightPanel/',
  
  // Center area
  'document editor': 'components/containers/CenterPanel/',
  'main editor': 'components/containers/CenterPanel/',
  'center panel': 'components/containers/CenterPanel/',
  'text editor': 'components/shared/molecules/LexicalEditor/',
  'rich text editor': 'components/shared/molecules/LexicalEditor/',
  'document canvas': 'components/shared/molecules/DocumentEditorLayout/',
  'editor canvas': 'components/shared/molecules/DocumentEditorLayout/',
  'main layout': 'components/shared/molecules/DocumentEditorLayout/',
  
  // Resize handles - Updated for new components
  'column resize handles': 'components/shared/molecules/ColumnResizer/',
  'panel split handles': 'components/shared/molecules/PanelSplitter/',
  'vertical resize': 'components/shared/molecules/PanelSplitter/',
  'horizontal resize': 'components/shared/molecules/ColumnResizer/',
  'resize bars': 'components/shared/molecules/ColumnResizer/ + PanelSplitter/',
  'split dividers': 'components/shared/molecules/PanelSplitter/',
  'column dividers': 'components/shared/molecules/ColumnResizer/',
  
  // Panel management - Updated for new components
  'panel slots': 'components/shared/molecules/ConfigurablePanel/',
  'slot panels': 'components/shared/molecules/ConfigurablePanel/',
  'panel configuration': 'components/shared/molecules/PanelManager/',
  'panel management': 'components/shared/molecules/PanelManager/',
  'panel coordination': 'components/shared/molecules/PanelManager/',
  
  // Specific panels
  'file browser panel': 'components/panels/components/Assets/',
  'asset panel': 'components/panels/components/Assets/',
  'file manager': 'components/panels/components/Assets/',
  'legal research panel': 'components/panels/components/CaseLaw/',
  'case law panel': 'components/panels/components/CaseLaw/',
  'research panel': 'components/panels/components/Research/',
  'document exhibits': 'components/panels/components/Exhibits/',
  'exhibits panel': 'components/panels/components/Exhibits/',
  'agent controls': 'components/panels/components/AgentControls/',
  'AI controls': 'components/panels/components/AgentControls/',
  'sessions panel': 'components/panels/components/Sessions/',
  
  // Mobile elements
  'mobile drawer': 'components/shared/molecules/MobileLayout/',
  'mobile layout': 'components/shared/molecules/MobileLayout/',
  'bottom sheet': 'components/shared/molecules/MobileLayout/components/BottomSheet/',
  'mobile panels': 'components/shared/molecules/MobileLayout/',
  
  // Top area
  'top toolbar': 'components/shared/molecules/TopBar/',
  'top bar': 'components/shared/molecules/TopBar/',
  'header': 'components/shared/molecules/TopBar/',
  'toolbar': 'components/shared/molecules/TopBar/',
} as const;

/**
 * Map development tasks to their primary code locations
 * Use this when you need to implement specific functionality
 */
export const TASK_TO_LOCATION_MAP = {
  // Layout and resizing - Updated for new components
  'fix resizing bugs': 'components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook.ts',
  'fix panel resizing': 'components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook.ts',
  'fix column resizing': 'components/shared/molecules/ColumnResizer/ColumnResizer.hook.ts',
  'fix vertical splitting': 'components/shared/molecules/PanelSplitter/PanelSplitter.hook.ts',
  'layout issues': 'components/shared/molecules/DocumentEditorLayout/',
  'modify layout': 'components/shared/molecules/DocumentEditorLayout/',
  'column resize': 'components/shared/molecules/ColumnResizer/',
  'panel split': 'components/shared/molecules/PanelSplitter/',
  
  // Panel management - Updated for new components
  'add new panel': 'components/panels/ (create new folder)',
  'create panel': 'components/panels/ (create new folder)',
  'panel functionality': 'components/panels/ (find specific panel)',
  'panel configuration': 'components/shared/molecules/PanelManager/',
  'panel management': 'components/shared/molecules/PanelManager/',
  'panel coordination': 'components/shared/molecules/PanelManager/',
  'configure panels': 'components/shared/molecules/PanelManager/',
  'panel slots': 'components/shared/molecules/ConfigurablePanel/',
  'slot configuration': 'components/shared/molecules/ConfigurablePanel/',
  
  // Mobile responsiveness
  'mobile responsive issues': 'components/shared/molecules/MobileLayout/',
  'mobile layout': 'components/shared/molecules/MobileLayout/',
  'touch interactions': 'components/shared/molecules/MobileLayout/',
  'mobile panels': 'components/shared/molecules/MobileLayout/',
  
  // Document editing
  'document editing features': 'components/shared/molecules/LexicalEditor/',
  'text editing': 'components/shared/molecules/LexicalEditor/',
  'rich text': 'components/shared/molecules/LexicalEditor/',
  'editor functionality': 'components/shared/molecules/LexicalEditor/',
  
  // State management - Updated for new components
  'state management': 'stores/ + DocumentEditorLayout.hook.ts',
  'redux issues': 'stores/ + DocumentEditorLayout.hook.ts',
  'state synchronization': 'components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook.ts',
  'resize state': 'components/shared/molecules/ColumnResizer/ColumnResizer.hook.ts + PanelSplitter.hook.ts',
  
  // Platform detection
  'platform detection': 'components/layout/components/PlatformDetection/',
  'responsive behavior': 'components/layout/components/PlatformDetection/',
  'device detection': 'components/layout/components/PlatformDetection/',
  
  // Performance - Updated for new components
  'performance issues': 'components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts',
  'slow rendering': 'components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts',
  'optimization': 'components/shared/molecules/DocumentEditorLayout/DocumentEditorLayout.hook.ts',
  'resize performance': 'components/shared/molecules/ColumnResizer/ + PanelSplitter/',
} as const;

/**
 * Map common bugs to their fix locations with specific line numbers
 * Use this for quick bug fixes
 */
export const BUG_FIX_LOCATIONS = {
  'panels not resizing': [
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (lines 80-122)',
    'components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx (lines 130-197)'
  ],
  'column resizing broken': [
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (lines 80-122)',
    'components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx (lines 130-197)'
  ],
  'resize handles not working': [
    'components/shared/molecules/BidirectionalResizer/BidirectionalResizer.tsx',
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (lines 80-122)'
  ],
  'mobile layout broken': [
    'components/shared/molecules/MobileLayout/MobileLayout.tsx',
    'components/shared/molecules/MobileLayout/components/BottomSheet/'
  ],
  'mobile panels not showing': [
    'components/shared/molecules/MobileLayout/MobileLayout.tsx',
    'components/shared/molecules/MobileLayout/components/BottomSheet/'
  ],
  'performance issues': [
    'components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts (lines 124-269)',
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (throttling)'
  ],
  'slow text editing': [
    'components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts (lines 124-269)',
    'components/shared/molecules/LexicalEditor/LexicalEditor.tsx'
  ],
  'panel content not loading': [
    'components/panels/components/LazyPanelLoader/',
    'components/shared/molecules/PanelConfiguration/PanelConfiguration.tsx'
  ],
  'state synchronization issues': [
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts',
    'stores/ (Redux slices)'
  ],
} as const;

/**
 * Directory structure meanings for AI agents
 * Use this to understand the organization philosophy
 */
export const DIRECTORY_MEANINGS = {
  'components/shared/molecules/': 'Reusable layout and UI components',
  'components/panels/': 'Feature-specific panel content and functionality',
  'components/layout/': 'Platform-specific layout logic and responsive behavior',
  'hooks/': 'Custom React hooks for state management and side effects',
  'stores/': 'Redux store configuration and slices',
  'types/': 'TypeScript type definitions and interfaces',
  'utils/': 'Utility functions and helpers',
} as const;

/**
 * File naming patterns for AI agents
 * Use this to predict file locations based on naming conventions
 */
export const FILE_PATTERNS = {
  'Component logic': 'ComponentName.tsx (main component)',
  'Component state': 'ComponentName.hook.ts (React hooks)',
  'Component types': 'ComponentName.types.ts (TypeScript definitions)',
  'Component styles': 'ComponentName.styles.ts (styled-components)',
  'Component exports': 'index.ts (public API)',
  'Component tests': '__tests__/ComponentName.test.tsx',
  'Redux logic': 'ComponentName.redux.ts (Redux integration)',
} as const;

/**
 * Quick lookup function for AI agents
 * Usage: findLocation('fix resizing bugs') or findLocation('left sidebar')
 */
export const findLocation = (query: string): string[] => {
  const lowercaseQuery = query.toLowerCase();
  
  // Check visual elements first
  const visualMatch = Object.entries(VISUAL_TO_CODE_MAP).find(([key]) => 
    key.toLowerCase().includes(lowercaseQuery) || lowercaseQuery.includes(key.toLowerCase())
  );
  
  if (visualMatch) {
    return [visualMatch[1]];
  }
  
  // Check tasks
  const taskMatch = Object.entries(TASK_TO_LOCATION_MAP).find(([key]) => 
    key.toLowerCase().includes(lowercaseQuery) || lowercaseQuery.includes(key.toLowerCase())
  );
  
  if (taskMatch) {
    return [taskMatch[1]];
  }
  
  // Check bug fixes
  const bugMatch = Object.entries(BUG_FIX_LOCATIONS).find(([key]) => 
    key.toLowerCase().includes(lowercaseQuery) || lowercaseQuery.includes(key.toLowerCase())
  );
  
  if (bugMatch) {
    return [...bugMatch[1]]; // Spread to convert readonly array to mutable
  }
  
  return ['Location not found. Check NAVIGATION_MAP.ts for available options.'];
};

/**
 * Type definitions for TypeScript support
 */
export type VisualElement = keyof typeof VISUAL_TO_CODE_MAP;
export type TaskType = keyof typeof TASK_TO_LOCATION_MAP;
export type BugType = keyof typeof BUG_FIX_LOCATIONS;
export type DirectoryType = keyof typeof DIRECTORY_MEANINGS;
export type FilePattern = keyof typeof FILE_PATTERNS; 
/**
 * Panel Components - All panel content components
 * @module panels/components
 */

// Main panel components (using actual export names)
export { AgentControls } from './AgentControls';
export { AiAssistant } from './AiAssistant';
export { Assets, AssetPanel } from './Assets';
export { CaseLaw } from './CaseLaw';
export { Panel as ExhibitsPanel } from './Exhibits';
export { ResearchPanel } from './Research';
export { Sessions } from './Sessions';

// Utility components
export { LazyPanelLoader } from './LazyPanelLoader';

// Note: For component-specific types and utilities, 
// import directly from the specific component folder to avoid conflicts 
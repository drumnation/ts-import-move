# DocumentEditorPage Refactoring Plan

## 🚨 URGENT UPDATE: Recent Progress & Next Steps (June 11, 2024)

### ✅ COMPLETED: Panel System Reorganization
**Status**: DONE ✅ (Panel containers now properly separated from panel content)

**What Changed:**
- **Panel containers** (LeftPanel, RightPanel, CenterPanel) now have their own folders
- **Panel content** (AgentControls, Assets, Research, etc.) moved to `components/panels/components/`
- **Level 3 platform separation** implemented for all main panels
- **Barrel exports** updated throughout the panel system

### 🎯 NEXT IMMEDIATE TASK: Shared Components Organization
**Priority**: HIGH - Prevent other agents from recreating components in wrong locations

**Plan**: Move all reusable components to `shared/` following atomic design:
```
Current State → Target State:
components/
├── layout/                   ✅ (architectural - stays)
├── panels/                   ✅ (architectural - stays)  
├── atoms/                    → shared/atoms/
├── BidirectionalResizer/     → shared/molecules/BidirectionalResizer/
├── DocumentProvider/         → shared/molecules/DocumentProvider/
├── DocumentViewport/         → shared/molecules/DocumentViewport/
├── EditorCanvas/             → shared/molecules/EditorCanvas/
├── LexicalEditor/            → shared/molecules/LexicalEditor/
├── MobileLayout/             → shared/molecules/MobileLayout/
├── PanelConfiguration/       → shared/molecules/PanelConfiguration/
├── PreviewIframe/            → shared/molecules/PreviewIframe/
├── ResizablePanel/           → shared/molecules/ResizablePanel/
├── SampleDocumentContent/    → shared/molecules/SampleDocumentContent/
├── SlashCommandMenu/         → shared/molecules/SlashCommandMenu/
├── SlotPanel/                → shared/molecules/SlotPanel/
└── TopBar/                   → shared/molecules/TopBar/
```

**Rationale**: 
- Keep `components/` for architectural concerns (layout, panels)
- Move reusable components to `shared/` following atomic design
- Prevent confusion between architectural and reusable components

---

## 🎯 Immediate Fixes (High Priority)

### 1. Fix Column Resizing Bug
**Issue**: Dragging left/right column boundary doesn't resize both top/bottom panels in that column.

**Root Cause**: Panel resizers are individual, but column resizing should affect the entire column width which propagates to all panels in that column.

**Solution**: Add column-level resizers that are separate from panel-level resizers.

#### Implementation Steps:
1. Add column resizers to `DesktopCanvasLayout`
2. Modify resize handler to distinguish between column and panel resizing
3. Ensure column width changes propagate to all panels in that column

### 2. Move Core Components to Shared Library

#### Components to Move:
```
src/shared-components/layout/
├── BidirectionalResizer/    # From DocumentEditorPage/components/
├── ResizablePanel/         # From DocumentEditorPage/components/
└── SplitPanelLayout/       # New: extract column layout logic

src/shared-components/mobile/
├── BottomSheet/           # From MobileLayout/components/
└── MobileDrawer/          # From MobileLayout/components/

src/shared-components/feedback/
└── ProgressOverlay/       # From MobileLayout/components/
```

### 3. Simplify Component Hierarchy

#### Current Deep Nesting Issues:
```
❌ components/panels/Assets/components/AssetFilterBar/AssetFilterBar.tsx
❌ components/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx
❌ components/MobileLayout/components/BottomSheet/BottomSheet.tsx
```

#### Proposed Flattened Structure:
```
✅ components/layout/DesktopLayout/DesktopLayout.tsx
✅ components/layout/MobileLayout/MobileLayout.tsx  
✅ components/panels/AssetPanel/AssetPanel.tsx
✅ components/panels/AssetPanel/components/FilterBar.tsx
```

## 🔧 Medium Priority Refactoring

### 1. Create Dedicated Layout Hooks

#### New Hook Files:
```typescript
// hooks/useLayoutState.ts
export const useLayoutState = () => {
  // Centralized layout state management
  // Handles: leftWidth, rightWidth, leftSplit, rightSplit, etc.
}

// hooks/useColumnResizing.ts  
export const useColumnResizing = (layoutState, updateLayout) => {
  // Column-level resize coordination
  // Handles: left/right column width changes
}

// hooks/usePanelResizing.ts
export const usePanelResizing = (panelState, updatePanelState) => {
  // Panel-level resize handling
  // Handles: individual panel size changes within columns
}
```

### 2. Extract Layout Components

#### Create Specialized Layout Components:
```typescript
// components/layout/ThreeColumnLayout/
// - Handles the basic 3-column structure
// - Manages column widths and resizing
// - Platform-agnostic layout logic

// components/layout/SplitColumn/  
// - Handles top/bottom panel splitting within a column
// - Manages split ratios and vertical resizing
// - Reusable for left/right columns

// components/layout/PanelContainer/
// - Generic panel wrapper with resize, collapse, close
// - Replaces current SlotPanel complexity
// - Handles panel-level interactions
```

### 3. Simplify Panel Structure

#### Before (Current):
```
components/panels/Assets/
├── Assets.tsx
├── Assets.types.ts  
├── Assets.hook.ts
└── components/
    ├── AssetFilterBar/
    │   ├── AssetFilterBar.tsx
    │   ├── AssetFilterBar.types.ts
    │   ├── AssetFilterBar.hook.ts
    │   └── AssetFilterBar.styles.ts
    ├── AssetPreview/
    └── AssetUploadDropzone/
```

#### After (Proposed):
```
components/panels/AssetPanel/
├── AssetPanel.tsx
├── AssetPanel.types.ts
├── AssetPanel.hook.ts
├── AssetPanel.styles.ts
└── components/
    ├── FilterBar.tsx      # Simplified naming
    ├── PreviewArea.tsx    # Simplified naming  
    └── UploadZone.tsx     # Simplified naming
```

## 🏗️ Long-term Structural Improvements

### 1. Create Layout System Architecture

```typescript
// New architecture with clear separation of concerns:

DocumentEditorPage
├── useDocumentEditor()        # Main page logic
├── LayoutProvider             # Layout state context
└── ResponsiveLayout           # Platform detection & rendering
    ├── Desktop: ThreeColumnLayout
    │   ├── LeftColumn: SplitColumn
    │   ├── CenterColumn: DocumentArea + BottomPanel  
    │   └── RightColumn: SplitColumn
    └── Mobile: MobileLayout
        ├── MainArea: DocumentArea
        └── PanelDrawer: BottomSheet
```

### 2. Implement Layout State Management

```typescript
// Centralized layout state with clear APIs:

interface LayoutState {
  columns: {
    left: { width: number; visible: boolean; }
    right: { width: number; visible: boolean; }
  }
  splits: {
    left: number;  // 0-1 ratio for top/bottom split
    right: number; // 0-1 ratio for top/bottom split  
  }
  panels: {
    [panelId]: { size: number; collapsed: boolean; }
  }
}

interface LayoutActions {
  // Column-level actions
  resizeColumn: (column: 'left' | 'right', width: number) => void
  toggleColumn: (column: 'left' | 'right') => void
  
  // Split-level actions  
  adjustSplit: (column: 'left' | 'right', ratio: number) => void
  
  // Panel-level actions
  resizePanel: (panelId: string, size: number) => void
  togglePanel: (panelId: string) => void
  closePanel: (panelId: string) => void
}
```

### 3. Create Reusable Panel System

```typescript
// Generic panel system that can be reused across the app:

interface PanelDefinition {
  id: string
  title: string
  component: React.ComponentType
  location: 'left' | 'right' | 'center'
  slot: 'top' | 'bottom'
  defaultSize: number
  minSize: number
  maxSize: number
  resizable: boolean
  closable: boolean
}

// Panel registry for dynamic panel management
const PANEL_REGISTRY: Record<string, PanelDefinition> = {
  'assets': { /* ... */ },
  'research': { /* ... */ },
  'ai-assistant': { /* ... */ },
  // etc.
}
```

## 🚀 Implementation Phases

### Phase 1: Critical Bug Fixes (Week 1)
- [ ] Fix column resizing coordination bug
- [ ] Add column-level resizers to DesktopCanvasLayout
- [ ] Update resize handlers to properly propagate column width changes
- [ ] Test resizing behavior across all panel configurations

### Phase 2: Component Organization (Week 2)
- [ ] Move BidirectionalResizer to shared-components
- [ ] Move ResizablePanel to shared-components  
- [ ] Move mobile components to shared-components
- [ ] Update all imports and references
- [ ] Test component functionality after moves

### Phase 3: Layout System Refactor (Week 3-4)
- [ ] Create new layout hooks (useLayoutState, useColumnResizing, etc.)
- [ ] Extract ThreeColumnLayout component
- [ ] Extract SplitColumn component
- [ ] Refactor DesktopCanvasLayout to use new components
- [ ] Test layout behavior with new architecture

### Phase 4: Panel System Simplification (Week 5-6)
- [ ] Flatten panel directory structure
- [ ] Simplify panel component naming
- [ ] Create generic PanelContainer component
- [ ] Update panel implementations to use new patterns
- [ ] Test all panel functionality

### Phase 5: Long-term Architecture (Future)
- [ ] Implement centralized layout state management
- [ ] Create dynamic panel registry system
- [ ] Add layout presets and persistence
- [ ] Implement advanced layout features (drag-and-drop, etc.)

## 📋 Testing Strategy

### Unit Tests
- Layout state management hooks
- Resize calculation logic
- Panel registration system
- Component rendering

### Integration Tests  
- Column resizing coordination
- Panel split behavior
- Mobile layout switching
- Layout persistence

### Visual Regression Tests
- Layout appearance across breakpoints
- Resize handle positioning
- Panel transition animations
- Mobile drawer behavior

## 🎯 Success Metrics

### Code Quality
- Reduce component nesting levels from 6-7 to 3-4 maximum
- Decrease file path complexity by 50%
- Improve component reusability across the application
- Achieve 90%+ test coverage for layout components

### Developer Experience
- AI can navigate to correct files for bug fixes in <30 seconds
- New panel creation takes <10 minutes with clear templates
- Layout modifications require changes to 1-2 files maximum
- Component relationships are clear from file structure

### User Experience
- Column resizing works smoothly and intuitively
- Panel operations feel responsive and predictable
- Mobile layout provides equivalent functionality to desktop
- Layout state persists correctly across sessions

This refactoring plan provides a clear roadmap for improving the DocumentEditorPage architecture while maintaining functionality and addressing the immediate resizing issues. 
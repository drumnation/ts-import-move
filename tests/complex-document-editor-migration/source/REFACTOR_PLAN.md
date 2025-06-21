# DocumentEditorPage Refactor Plan

## 🎯 Objective
Transform the DocumentEditorPage from a 4/10 AI-navigable codebase to an 8/10 by implementing:
- Clear visual-to-code mapping
- Predictable navigation patterns  
- Consolidated state management
- Descriptive naming conventions

## 📋 Implementation Phases

### Phase 1: Navigation Aids (IMMEDIATE - 30 min)
**Goal**: Enable AI agents to find functionality instantly

#### Step 1.1: Create Navigation Map
Create `frontend/src/pages/DocumentEditorPage/NAVIGATION_MAP.ts`:
```typescript
/**
 * Visual-to-Code Navigation Map for AI Agents
 * Use this to instantly locate functionality by visual description
 */
export const VISUAL_TO_CODE_MAP = {
  // What user sees -> Where to find the code
  'left sidebar': 'components/panels/containers/LeftPanel/',
  'right sidebar': 'components/panels/containers/RightPanel/',
  'main document area': 'components/shared/molecules/DocumentViewport/',
  'column resize handles': 'components/shared/molecules/BidirectionalResizer/',
  'panel split handles': 'components/shared/molecules/BidirectionalResizer/',
  'AI chat panel': 'components/panels/components/AiAssistant/',
  'file browser panel': 'components/panels/components/Assets/',
  'legal research panel': 'components/panels/components/CaseLaw/',
  'document exhibits': 'components/panels/components/Exhibits/',
  'mobile drawer': 'components/shared/molecules/MobileLayout/',
  'top toolbar': 'components/shared/molecules/TopBar/',
} as const;

export const TASK_TO_LOCATION_MAP = {
  // What you need to do -> Where to do it
  'fix resizing bugs': 'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts',
  'add new panel': 'components/panels/ (create new folder)',
  'modify layout': 'components/shared/molecules/EditorCanvas/',
  'mobile responsive issues': 'components/shared/molecules/MobileLayout/',
  'document editing features': 'components/shared/molecules/LexicalEditor/',
  'state management': 'stores/ + EditorCanvas.hook.ts',
  'platform detection': 'components/layout/components/PlatformDetection/',
} as const;

export const BUG_FIX_LOCATIONS = {
  'panels not resizing': [
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (lines 80-122)',
    'components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx (lines 130-197)'
  ],
  'mobile layout broken': [
    'components/shared/molecules/MobileLayout/MobileLayout.tsx',
    'components/shared/molecules/MobileLayout/components/BottomSheet/'
  ],
  'performance issues': [
    'components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts (lines 124-269)',
    'components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts (throttling)'
  ],
} as const;
```

#### Step 1.2: Create Quick Reference Guide  
Create `frontend/src/pages/DocumentEditorPage/QUICK_REFERENCE.md`:
```markdown
# DocumentEditorPage Quick Reference

## 🚀 Common Tasks (Copy-Paste Ready)

### Adding a New Panel
1. Create: `components/panels/YourPanelName/`
2. Files needed:
   - `YourPanelName.tsx` (main component)
   - `YourPanelName.types.ts` 
   - `YourPanelName.hook.ts`
   - `index.ts`
3. Register in: `components/shared/molecules/PanelConfiguration/PanelConfiguration.tsx`

### Fixing Resize Issues
1. Check: `EditorCanvas.hook.ts` handlePanelResize function
2. Verify: Redux state updates in layout slice
3. Test: Column coordination in DesktopCanvasLayout

### Mobile Responsiveness
1. Platform detection: `components/layout/components/PlatformDetection/`
2. Mobile layout: `components/shared/molecules/MobileLayout/`  
3. Touch interactions: Check for proper touch event handling

## 📁 Directory Meanings
- `components/shared/molecules/` = Reusable layout components
- `components/panels/` = Feature-specific panel content
- `components/layout/` = Platform-specific layout logic
- `hooks/` = Custom React hooks for state management
```

#### Step 1.3: Update Index Files
Add clear exports with descriptions to key index files.

### Phase 2: Strategic Renaming (HIGH IMPACT - 2 hours)
**Goal**: Replace generic names with descriptive, visual names

#### Step 2.1: Rename Core Components
```bash
# Planned renames (do in this order to avoid import conflicts):
SlotPanel → DynamicPanel
BidirectionalResizer → ColumnResizer + PanelSplitter (split into two)
EditorCanvas → DocumentEditorLayout
PanelConfiguration → PanelManager
```

#### Step 2.2: Create Transition Script
Create `scripts/rename-components.sh`:
```bash
#!/bin/bash
# Safe component renaming script
# Run from project root

echo "🔄 Renaming components for better AI navigation..."

# 1. SlotPanel → DynamicPanel
find frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/SlotPanel/DynamicPanel/g'
find frontend/src -type d -name "*SlotPanel*" | while read dir; do
  mv "$dir" "${dir/SlotPanel/DynamicPanel}"
done

# 2. EditorCanvas → DocumentEditorLayout  
find frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/EditorCanvas/DocumentEditorLayout/g'
find frontend/src -type d -name "*EditorCanvas*" | while read dir; do
  mv "$dir" "${dir/EditorCanvas/DocumentEditorLayout}"
done

# 3. PanelConfiguration → PanelManager
find frontend/src -name "*.ts" -o -name "*.tsx" | xargs sed -i '' 's/PanelConfiguration/PanelManager/g'
find frontend/src -type d -name "*PanelConfiguration*" | while read dir; do
  mv "$dir" "${dir/PanelConfiguration/PanelManager}"
done

echo "✅ Component renaming complete. Run tests to verify."
```

### Phase 3: Structure Flattening (MEDIUM IMPACT - 4 hours)  
**Goal**: Reduce navigation complexity from 6+ levels to 3 levels max

#### Step 3.1: Move Shared Components
Move truly reusable components to `src/shared-components/`:
```
src/shared-components/
├── layout/
│   ├── ColumnResizer/      # was BidirectionalResizer
│   ├── PanelSplitter/      # split from BidirectionalResizer  
│   ├── ResizablePanel/
│   └── DynamicPanel/       # was SlotPanel
├── mobile/
│   ├── BottomSheet/
│   └── DrawerLayout/
└── feedback/
    └── ProgressOverlay/
```

#### Step 3.2: Flatten Panel Structure
Restructure to maximum 3 levels deep:
```
components/
├── document-editor/        # Core editing functionality
│   ├── DocumentEditorLayout/  # was EditorCanvas
│   ├── DocumentViewport/
│   ├── LexicalEditor/
│   └── TopBar/
├── editor-panels/          # All panels in flat structure
│   ├── AiChatPanel/        # was AiAssistant
│   ├── FileManagerPanel/   # was Assets
│   ├── LegalResearchPanel/ # was CaseLaw
│   ├── ExhibitsPanel/      # was Exhibits
│   ├── AgentControlPanel/  # was AgentControls
│   └── SessionsPanel/      # was Sessions
└── layout-system/          # Platform-specific layouts
    ├── DesktopLayout/
    ├── MobileLayout/
    └── PlatformDetection/
```

### Phase 4: Logic Consolidation (HIGH IMPACT - 6 hours)
**Goal**: Single source of truth for related functionality

#### Step 4.1: Consolidate Resize Logic
Create `hooks/useLayoutCoordination.ts`:
```typescript
/**
 * Unified layout coordination hook
 * Handles all resize operations, state management, and conflict prevention
 */
export const useLayoutCoordination = () => {
  // All column resizing logic
  // All panel splitting logic  
  // All state synchronization
  // All constraint enforcement
  // All performance optimization
};
```

#### Step 4.2: Create Unified State Manager
Create `state/DocumentEditorState.ts`:
```typescript
/**
 * Single state manager for entire DocumentEditorPage
 * Replaces scattered Redux + hooks + local state
 */
export class DocumentEditorState {
  layout: LayoutState;
  panels: PanelState; 
  document: DocumentState;
  platform: PlatformState;
  
  // Coordinated actions that update multiple state areas
  resizeColumn(column: string, size: number): void;
  togglePanel(panel: string): void;
  switchPlatform(platform: Platform): void;
}
```

## 🔄 Implementation Order

### Week 1: Navigation & Naming
- [ ] Day 1: Create navigation maps and quick reference
- [ ] Day 2: Implement strategic renaming
- [ ] Day 3: Update all imports and exports
- [ ] Day 4: Test and fix any breaking changes
- [ ] Day 5: Validate improved AI navigation

### Week 2: Structure & Consolidation  
- [ ] Day 1: Move shared components
- [ ] Day 2: Flatten panel structure
- [ ] Day 3: Create unified state management
- [ ] Day 4: Consolidate resize logic
- [ ] Day 5: Integration testing and performance validation

## 🧪 Testing Strategy

### Before Each Phase
1. Run full test suite
2. Take screenshot of working layout
3. Document current performance metrics

### After Each Phase  
1. Verify all tests still pass
2. Compare layout screenshot (should be identical)  
3. Measure performance impact
4. Test AI agent navigation (manual verification)

### Success Criteria
- [ ] AI agent finds functionality in ≤3 navigation steps
- [ ] Component names clearly describe visual/functional purpose
- [ ] No logic duplication across files  
- [ ] Maximum 3 directory levels deep
- [ ] All tests pass
- [ ] No performance regression

## 🚨 Risk Mitigation

### High Risk: Breaking Changes
- **Mitigation**: Implement renaming script with rollback capability
- **Backup**: Git branch for each phase
- **Testing**: Comprehensive test coverage before changes

### Medium Risk: Performance Regression
- **Mitigation**: Performance monitoring at each step
- **Rollback**: Keep performance benchmarks 
- **Testing**: Load testing with realistic data

### Low Risk: Import Confusion
- **Mitigation**: Update all index files immediately after moves
- **Prevention**: Use TypeScript compiler to catch import errors
- **Fix**: IDE find-and-replace for remaining issues

## 📈 Success Metrics

### Quantitative Goals
- Navigation steps: 6+ → ≤3
- File location time: 30+ seconds → <10 seconds  
- Bug fix attempts: 3+ → 1
- Directory depth: 7 levels → 3 levels max

### Qualitative Goals
- AI agents stop asking "where is X?"
- Component names immediately convey purpose
- Related functionality grouped together
- Clear separation of concerns
- Predictable file organization

---

**Next Steps**: Begin with Phase 1 (Navigation Aids) as it provides immediate value with minimal risk. 
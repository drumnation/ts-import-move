# DocumentEditorPage - AI Agent Navigation Guide

## 🎯 Quick Navigation for AI Agents

### When You Need To...

| **Task** | **Go To** | **Key Files** |
|----------|-----------|---------------|
| Fix layout/resizing bugs | `components/shared/molecules/EditorCanvas/` | `EditorCanvas.hook.ts`, `DesktopCanvasLayout.tsx` |
| Add/modify panels | `components/panels/` | Create new folder following pattern |
| Mobile layout issues | `components/shared/molecules/MobileLayout/` | `MobileLayout.tsx`, `BottomSheet/` |
| Document editing | `components/shared/molecules/LexicalEditor/` | `LexicalEditor.tsx`, `LexicalEditor.hook.ts` |
| Platform detection | `components/layout/components/PlatformDetection/` | `PlatformDetection.tsx` |
| State management | Redux store + hooks | `EditorCanvas.hook.ts`, Redux slices |

### Visual-to-Code Mapping

| **What User Sees** | **Component Location** | **State Location** |
|-------------------|------------------------|-------------------|
| Left sidebar panels | `components/panels/containers/LeftPanel/` | `layoutState.left` |
| Right sidebar panels | `components/panels/containers/RightPanel/` | `layoutState.right` |
| Main document area | `components/shared/molecules/DocumentViewport/` | `documentState` |
| Resize handles (vertical) | `components/shared/molecules/BidirectionalResizer/` | `layoutState.splitRatios` |
| Resize handles (columns) | `components/layout/resize/` | `layoutState.columnSizes` |
| AI chat panel | `components/panels/components/AiAssistant/` | `panelState.aiAssistant` |
| File browser | `components/panels/components/Assets/` | `panelState.assets` |

## 🚨 Current Structural Problems

### Problem 1: Excessive Nesting Anti-Pattern
**Issue**: Paths like `components/shared/molecules/DocumentViewport/components/DocumentPage/`
**Impact**: Agent navigation takes 6+ steps to find related functionality
**Priority**: HIGH

### Problem 2: Generic Naming Anti-Pattern  
**Issue**: Components named `SlotPanel`, `BidirectionalResizer`, `EditorCanvas`
**Impact**: No visual mapping, agents can't locate functionality
**Priority**: HIGH

### Problem 3: Scattered Logic Syndrome
**Issue**: Layout logic spread across 4+ files, resize handlers in 3+ places
**Impact**: Agents repeat same fixes, create duplicate solutions
**Priority**: MEDIUM

### Problem 4: Mixed Organization Patterns
**Issue**: Some directories by feature, others by component type, others by platform
**Impact**: Agents can't predict where to find things
**Priority**: MEDIUM

## 🔧 Immediate Fix Locations

### Known Bug: Disconnected Panel Resizing
**Symptom**: Dragging column boundary only resizes one panel instead of entire column
**Root Cause**: Panel-level resize handlers don't coordinate with column-level state
**Primary Fix**: `components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts` lines 80-122
**Secondary Fix**: `components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx` lines 130-197

### Performance Issues
**Symptom**: Sluggish resize operations, excessive re-renders
**Root Cause**: Unthrottled Redux updates, missing memoization
**Fix Location**: `components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts` lines 124-269

## 📋 Refactoring Roadmap

### Phase 1: Navigation Aids (Immediate - 30 minutes)
- [ ] Create `NAVIGATION_MAP.ts` with visual-to-code mapping
- [ ] Add component index files with clear exports
- [ ] Create quick-reference guide for common tasks

### Phase 2: Strategic Renaming (High Impact - 2 hours)
- [ ] `SlotPanel` → `EditablePanel` or `DynamicPanel`
- [ ] `BidirectionalResizer` → `ColumnResizer` and `PanelSplitter`
- [ ] `EditorCanvas` → `DocumentEditorLayout`
- [ ] `PanelConfiguration` → `PanelManager`

### Phase 3: Structure Flattening (Medium Impact - 4 hours)
- [ ] Move shared components to `src/shared-components/`
- [ ] Flatten panel directory structure
- [ ] Create logical groupings by domain/feature

### Phase 4: Logic Consolidation (High Impact - 6 hours)  
- [ ] Consolidate resize logic into single coordinated system
- [ ] Create unified state management for layout
- [ ] Extract common patterns into reusable hooks

## 🎯 Success Metrics

**Before Refactor:**
- Agent takes 6+ navigation steps to find functionality
- Spends 30+ seconds locating related files
- Makes 3+ attempts to fix layout bugs
- Creates duplicate solutions for same problems

**After Refactor:**
- Agent finds functionality in 2-3 navigation steps
- Locates files in under 10 seconds
- Fixes layout bugs on first attempt
- Reuses existing solutions and patterns

## 🚀 Implementation Priority

### Quick Wins (Do First):
1. Add navigation mapping files
2. Rename most problematic components
3. Create visual-to-code reference

### Foundation Work (Do Second):
4. Flatten directory structure
5. Consolidate state management
6. Extract shared components

### Polish (Do Last):
7. Optimize performance patterns
8. Add comprehensive testing
9. Create development tooling

---

**For AI Agents**: This guide prioritizes structural clarity over comprehensive documentation. Focus on navigation aids and clear naming before diving into complex implementation details. 
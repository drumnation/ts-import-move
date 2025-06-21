# DocumentEditorPage Refactoring Agent Instructions

## 🚨 URGENT: CURRENT STATE AS OF JUNE 11, 2024 - 8:40 PM

### ⚠️ CRITICAL: AGENT DUPLICATION DETECTED & RESOLVED
**AGENTS: We just cleaned up duplication from other agents working on outdated info!**

#### 🚫 STOP CREATING THESE PATTERNS (JUST CLEANED UP):
- ❌ `components/atoms/` folder (REMOVED - atoms belong in `shared/atoms/`)
- ❌ `LazyPanelLoader.tsx` in root (COMPLETED - now in `components/LazyPanelLoader/`)
- ❌ Duplicate `PanelContent.tsx` files (MERGED enhanced version to correct location)

#### ✅ COMPLETED WORK - DO NOT REDO:
**Panel System Reorganization is DONE**
**LazyPanelLoader Refactoring is DONE**
**Atoms Duplication Cleanup is DONE**

#### Current Panel Structure (COMPLETED):
```
✅ components/panels/
├── ✅ containers/         # Panel containers with platform routing  
│   ├── LeftPanel/         # Level 3 platform separation complete
│   ├── RightPanel/        # Level 3 platform separation complete  
│   └── CenterPanel/       # Level 3 platform separation complete
├── ✅ components/         # Panel content components
│   ├── AgentControls/
│   ├── AiAssistant/
│   ├── Assets/
│   ├── CaseLaw/
│   ├── Exhibits/
│   ├── Research/
│   └── Sessions/
└── ✅ index.ts            # Barrel exports updated
```

#### 🚫 DO NOT CREATE THESE PATTERNS:
- `components/panels/AgentControlsPanel.tsx` ❌
- `components/panels/AssetsPanel.tsx` ❌  
- `components/panels/ResearchPanel.tsx` ❌
- Any panel files directly in the root of `components/panels/`

#### ✅ CURRENT CORRECT PATTERN:
- **Panel containers**: Use `components/panels/containers/LeftPanel/`, `RightPanel/`, `CenterPanel/`
- **Panel content**: Use `components/panels/components/[ComponentName]/`
- **All imports work**: Barrel exports handle the routing

### 🎯 IMMEDIATE NEXT TASK: 
**Move components to `shared/molecules/` following atomic design principles**

**Status**: READY TO START (other agents should coordinate on this)

---

## 🎯 **Mission Overview**

You are tasked with implementing a comprehensive refactoring of the DocumentEditorPage to transform it from an AI-confusing nested structure into an AI-friendly, predictable architecture. This refactoring is critical because the current structure causes AI development velocity to slow dramatically due to navigation complexity and unclear visual-to-code mapping.

## 📚 **Required Reading (Process These Documents First)**

### **Core Strategy Documents:**
1. **[AI_FRIENDLY_REFACTORING_STRATEGY.md](./AI_FRIENDLY_REFACTORING_STRATEGY.md)** - The comprehensive refactoring strategy and architectural principles
2. **[IMMEDIATE_REFACTORING_CHECKLIST.md](./IMMEDIATE_REFACTORING_CHECKLIST.md)** - Step-by-step implementation checklist (8-day plan)
3. **[STRUCTURAL_ANALYSIS.md](./STRUCTURAL_ANALYSIS.md)** - Deep analysis of current issues and proposed solutions

### **Navigation & Context Documents:**
4. **[COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)** - Current component structure and navigation guide
5. **[REFACTORING_PLAN.md](./REFACTORING_PLAN.md)** - Original refactoring plan and bug fixes

### **AI Improvement Documents:**
6. **[AI_STRUGGLE_DETECTION_RULE.md](./AI_STRUGGLE_DETECTION_RULE.md)** - Patterns for detecting structural complexity
7. **[CURSOR_RULE_STRUCTURAL_AWARENESS.md](./CURSOR_RULE_STRUCTURAL_AWARENESS.md)** - Cursor rule for ongoing AI awareness

## 🚨 **Critical Success Principles**

### **Before You Begin:**
- **STUDY ALL DOCUMENTS**: Don't start coding until you understand the full strategy
- **FOLLOW THE CHECKLIST**: Use IMMEDIATE_REFACTORING_CHECKLIST.md as your roadmap
- **ONE PHASE AT A TIME**: Complete each phase 100% before moving to the next
- **TEST AFTER EACH PHASE**: Ensure functionality isn't broken before proceeding

### **Core Architectural Principles:**
1. **Visual Element = Direct File Mapping**: Every UI element maps to a predictable file location
2. **Flat Structure Preference**: Avoid nesting beyond 2 levels unless absolutely necessary
3. **Self-Documenting Names**: File names describe what users see, not technical abstractions
4. **Single Source of Truth**: One file handles one visual responsibility
5. **Predictable Location Patterns**: AI should guess file locations based on visual hierarchy

## 📋 **Implementation Roadmap**

### **Phase 1: Layout Foundation (Days 1-2)**
**Objective**: Establish clear visual-to-code mapping for layout elements

**Key Actions:**
- Create `components/layout/` directory structure
- Extract and rename layout components with visual names:
  - `LeftColumn.tsx`, `RightColumn.tsx`, `CenterColumn.tsx`
  - `LeftColumnResizer.tsx`, `RightColumnResizer.tsx`, `VerticalSplitter.tsx`
- Centralize layout state in `state/layout.state.ts`
- **Current Problem**: `BidirectionalResizer` is generic - make it specific to visual purpose

### **Phase 2: Panel Simplification (Days 3-4)**
**Objective**: One panel = one file with clear naming

**Key Actions:**
- Flatten panel directory structure
- Rename all panels with `*Panel.tsx` suffix for clarity
- Merge small sub-components (<100 lines) into main panel files
- Create `state/panels.state.ts` for centralized panel state

### **Phase 3: Document Area Extraction (Day 5)**
**Objective**: Document viewing components clearly separated

**Key Actions:**
- Create `components/document/` directory
- Rename `DocumentViewport` → `DocumentCanvas` (matches visual purpose)
- Rename `ViewportControls` → `ZoomControls` (matches what user sees)
- Create `state/document.state.ts`

### **Phase 4: Mobile Simplification (Day 6)**
**Objective**: Clear mobile implementation separate from desktop

**Key Actions:**
- Create `components/mobile/` directory
- Implement single mobile/desktop decision point
- Remove complex responsive logic from individual components

### **Phase 5: Controls Extraction (Day 7)**
**Objective**: Interactive controls clearly organized

**Key Actions:**
- Create `components/controls/` directory
- Rename `SlotPanel` → `PanelHeader` (matches visual function)
- Extract common control patterns

### **Phase 6: Cleanup & Validation (Day 8)**
**Objective**: Remove old structure and validate new architecture

**Key Actions:**
- Delete old directory structures
- Update ALL import statements (critical!)
- Create visual-to-code mapping guide
- Run comprehensive tests

## 🔧 **Implementation Commands & Workflow**

### **Before Starting Each Phase:**
```bash
# 1. Ensure clean working state
git status
git add . && git commit -m "Phase [N] preparation"

# 2. Run validation
pnpm run typecheck
pnpm test DocumentEditor

# 3. Create phase branch (optional but recommended)
git checkout -b "refactor-phase-[N]-[description]"
```

### **After Completing Each Phase:**
```bash
# 1. Update all imports (CRITICAL - search for old patterns)
# Use your editor's global search to find old import patterns

# 2. Run validation
pnpm run typecheck
pnpm test DocumentEditor

# 3. Commit phase completion
git add .
git commit -m "Phase [N] complete: [description]"
```

## 📝 **Detailed Phase Instructions**

### **Phase 1 Specifics: Layout Structure**

**File Movements Required:**
```
# Current → New
components/EditorCanvas/components/DesktopCanvasLayout/ → components/layout/DesktopLayout.tsx
components/BidirectionalResizer/ → components/layout/LeftColumnResizer.tsx (and RightColumnResizer.tsx, VerticalSplitter.tsx)
```

**State Centralization:**
```typescript
// Create state/layout.state.ts with:
export const useLayoutState = () => {
  // Move all width/split logic from EditorCanvas.hook.ts
  // Provide: leftWidth, rightWidth, leftSplit, rightSplit
  // Provide: handleLeftResize, handleRightResize, handleSplitResize
}
```

**Critical Success Criteria:**
- ✅ Layout resizing works exactly as before
- ✅ File names clearly indicate what they control visually
- ✅ All layout state centralized in one location
- ✅ No references to old `BidirectionalResizer` remain

### **Phase 2 Specifics: Panel Simplification**

**Key File Movements:**
```
# Flatten all panel structures
components/panels/Assets/Assets.tsx → components/panels/AssetPanel.tsx
components/panels/AiAssistant/AiAssistant.tsx → components/panels/AiAssistantPanel.tsx
# etc. for all panels
```

**Sub-Component Decision Matrix:**
- **If sub-component < 100 lines**: Merge into main panel
- **If sub-component > 100 lines**: Keep as `PanelName/ComponentName.tsx`
- **If multiple complex sub-components**: Create `PanelName/` folder with clear names

## ⚠️ **Critical Failure Points to Avoid**

### **Import Hell Prevention:**
1. **SEARCH BEFORE DELETING**: Before deleting any file, search entire codebase for imports
2. **UPDATE TEST FILES**: Tests often have stale imports that aren't caught until later
3. **CHECK BARREL EXPORTS**: Update index.ts files when moving components

### **Functionality Preservation:**
1. **Test After Every File Move**: Don't batch multiple moves without testing
2. **Preserve State Logic**: When moving state, ensure all handlers are moved too
3. **Maintain Prop Interfaces**: Keep component APIs stable during moves

### **Common Mistakes:**
- Moving files without updating imports (breaks app silently)
- Changing component APIs during refactoring (introduces bugs)
- Skipping phases (creates incomplete refactoring)
- Not testing after each phase (compounds issues)

## 🎯 **Success Validation**

### **After Each Phase, Verify:**
```bash
# 1. TypeScript validation
pnpm run typecheck  # Should pass with no errors

# 2. Test validation  
pnpm test DocumentEditor  # Should pass with no failures

# 3. App functionality
# Start dev server and manually test:
# - Layout resizing works
# - Panels open and display content
# - Mobile layout functions
# - No console errors
```

### **Final Success Criteria:**
After completing all phases, a fresh AI should be able to:
1. **From screenshot**: Identify responsible file in <10 seconds
2. **From bug description**: Go directly to correct component
3. **Predict file locations** based on visual element names
4. **Make targeted changes** without affecting unrelated functionality

## 🤝 **Communication Protocol**

### **Report Progress:**
After each phase, provide update using this template:
```
✅ PHASE [N] COMPLETE: [Phase Name]

**Completed Actions:**
- [List specific actions taken]

**Files Moved/Created:**
- [List file movements and new files]

**Issues Encountered:**
- [Any problems and how resolved]

**Validation Results:**
- TypeScript: ✅/❌
- Tests: ✅/❌  
- Manual testing: ✅/❌

**Ready for Phase [N+1]**: ✅/❌
```

### **If You Encounter Issues:**
If any phase becomes unclear or you encounter the structural complexity patterns mentioned in AI_STRUGGLE_DETECTION_RULE.md, immediately:

1. **PAUSE** implementation
2. **DOCUMENT** the specific issue encountered
3. **REFERENCE** which document contains guidance for the issue
4. **ASK** for clarification before proceeding

## 🚀 **Getting Started**

### **Step 1: Environment Setup**
```bash
cd /Users/dmieloch/Dev/legalDocumentsAI/case-law-hero/frontend/src/pages/DocumentEditorPage
```

### **Step 2: Read All Documents**
- Read each document in the order listed above
- Take notes on key architectural principles
- Understand the current vs. target structure

### **Step 3: Begin Phase 1**
- Open IMMEDIATE_REFACTORING_CHECKLIST.md
- Start with Phase 1: Layout Structure Clarification
- Follow each checklist item methodically

### **Step 4: Maintain Communication**
- Report progress after each phase
- Ask questions when uncertain
- Document any deviations from the plan

## 📖 **Reference Quick Links**

- **Strategy**: [AI_FRIENDLY_REFACTORING_STRATEGY.md](./AI_FRIENDLY_REFACTORING_STRATEGY.md)
- **Checklist**: [IMMEDIATE_REFACTORING_CHECKLIST.md](./IMMEDIATE_REFACTORING_CHECKLIST.md)
- **Current Guide**: [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md)
- **Analysis**: [STRUCTURAL_ANALYSIS.md](./STRUCTURAL_ANALYSIS.md)

Remember: This refactoring is designed to make future AI development dramatically faster and more predictable. Take time to understand the principles, follow the process methodically, and the result will be a codebase that AI can navigate intuitively. 
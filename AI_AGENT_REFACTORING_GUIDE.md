# AI Agent Refactoring Guide: ts-import-move with Absolute Imports

## 🎯 **Quick Start for AI Agents**

This is your **essential copy-paste guide** for using `ts-import-move` to perform reliable, large-scale TypeScript refactoring with absolute imports. Perfect for ARC-7 architectural patterns and modern TypeScript best practices.

### **Installation & Setup**

```bash
# Install globally for immediate use
npm install -g @drumnation/ts-import-move@1.0.5

# Verify installation
ts-import-move --version  # Should show 1.0.5
```

---

## 🚀 **Core Commands for AI Refactoring**

### **1. Basic File Move with Absolute Imports**

```bash
# Convert relative imports to absolute imports during move
ts-import-move move src/components/Button.tsx src/ui/components/ --absolute-imports --verbose

# Result: All relative imports become @/path/to/module
```

### **2. Directory Move with Custom Alias**

```bash
# Use custom alias prefix (e.g., @app instead of @)
ts-import-move move src/features/user/ src/shared/features/ --absolute-imports --alias-prefix "@app" --verbose
```

### **3. Multiple Files with Absolute Imports**

```bash
# Move multiple files and convert all imports
ts-import-move move src/utils/helper.ts src/types/user.ts src/shared/ --absolute-imports --verbose
```

### **4. Dry Run for Planning**

```bash
# Preview changes before applying
ts-import-move move src/components/ src/ui/ --absolute-imports --dry-run --verbose
```

---

## 🎯 **ARC-7 Architectural Refactoring Patterns**

### **Feature Module Migration**

```bash
# Move feature from components to features with absolute imports
ts-import-move move src/components/UserManagement/ src/features/user/ --absolute-imports --recursive --verbose

# Result: 
# Before: import { UserService } from '../../../services/user'
# After:  import { UserService } from '@/services/user'
```

### **Component Library Reorganization**

```bash
# Reorganize components into atomic design structure
ts-import-move move src/components/Button/ src/ui/atoms/ --absolute-imports --verbose
ts-import-move move src/components/Card/ src/ui/molecules/ --absolute-imports --verbose
ts-import-move move src/components/Header/ src/ui/organisms/ --absolute-imports --verbose
```

### **Shared Module Extraction**

```bash
# Extract utilities to shared modules
ts-import-move move src/utils/ src/shared/utils/ --absolute-imports --recursive --verbose
ts-import-move move src/types/ src/shared/types/ --absolute-imports --recursive --verbose
```

---

## ⚙️ **Configuration: tsconfig.json Setup**

Ensure your `tsconfig.json` has proper path aliases:

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

---

## 🔧 **Command Reference**

### **Essential Flags for AI Agents**

| Flag | Purpose | Usage |
|------|---------|-------|
| `--absolute-imports` | Convert relative to absolute imports | **ALWAYS USE for refactoring** |
| `--alias-prefix "@app"` | Custom alias prefix | For non-standard projects |
| `--verbose` | Detailed output | **ALWAYS USE for transparency** |
| `--dry-run` | Preview changes | Use for planning large refactors |
| `--recursive` | Process directories | For moving entire feature modules |
| `--force` | Overwrite without prompt | For automated workflows |

### **Complete Command Template**

```bash
ts-import-move move \
  <source-path> \
  <destination-path> \
  --absolute-imports \
  --verbose \
  [--alias-prefix "@custom"] \
  [--dry-run] \
  [--recursive] \
  [--force]
```

---

## 🎨 **Real-World Refactoring Examples**

### **Example 1: Component to Feature Migration**

```bash
# Scenario: Moving user components to feature-based structure
ts-import-move move src/components/user/ src/features/user/components/ --absolute-imports --recursive --verbose

# What happens:
# ✅ Files moved: src/components/user/* → src/features/user/components/*
# ✅ All imports updated: '../../../utils/api' → '@/utils/api'
# ✅ Maintains internal relative imports within moved directory
```

### **Example 2: Shared Library Extraction**

```bash
# Scenario: Extract common utilities to shared library
ts-import-move move src/utils/validation.ts src/shared/validation/ --absolute-imports --verbose
ts-import-move move src/utils/formatting.ts src/shared/formatting/ --absolute-imports --verbose

# Result: Clean absolute imports throughout codebase
```

### **Example 3: Atomic Design Refactor**

```bash
# Scenario: Reorganize components into atomic design
ts-import-move move src/components/Button.tsx src/ui/atoms/ --absolute-imports --verbose
ts-import-move move src/components/Input.tsx src/ui/atoms/ --absolute-imports --verbose
ts-import-move move src/components/SearchForm.tsx src/ui/molecules/ --absolute-imports --verbose
```

---

## 🚨 **Critical Success Patterns**

### **✅ DO: Always Use These Flags Together**

```bash
ts-import-move move <source> <destination> --absolute-imports --verbose
```

### **✅ DO: Test with Dry Run First**

```bash
# 1. Preview the changes
ts-import-move move src/components/ src/ui/ --absolute-imports --dry-run --verbose

# 2. Apply if satisfied
ts-import-move move src/components/ src/ui/ --absolute-imports --verbose
```

### **✅ DO: Use Recursive for Directories**

```bash
ts-import-move move src/features/auth/ src/modules/auth/ --absolute-imports --recursive --verbose
```

### **❌ DON'T: Forget --absolute-imports Flag**

```bash
# This will leave fragile relative imports
ts-import-move move src/components/ src/ui/ --verbose  # ❌ Missing --absolute-imports
```

---

## 🔍 **Troubleshooting Guide**

### **Issue: "Cannot find module" errors**

```bash
# Solution: Ensure tsconfig.json has correct path aliases
# Check that baseUrl and paths are properly configured
```

### **Issue: Some imports not converted**

```bash
# Solution: Verify the import is within the project scope
# External npm packages won't be converted (this is correct behavior)
```

### **Issue: Command not found**

```bash
# Solution: Reinstall globally
npm install -g @drumnation/ts-import-move@1.0.5
```

---

## 📊 **Performance Guidelines**

### **File Count Recommendations**

- **1-10 files**: Instant processing
- **10-50 files**: ~2-5 seconds
- **50+ files**: ~10-15 seconds (enterprise-ready)
- **200+ files**: Consider batching into smaller operations

### **Memory Usage**

- **Small projects**: ~50MB
- **Medium projects**: ~200MB  
- **Large projects**: ~500MB (automatically optimized)

---

## 🎯 **Integration with AI Workflows**

### **Workflow 1: Feature Extraction**

```bash
# Step 1: Identify feature components
# Step 2: Create feature directory structure
mkdir -p src/features/user/{components,services,types}

# Step 3: Move with absolute imports
ts-import-move move src/components/user/ src/features/user/components/ --absolute-imports --recursive --verbose
ts-import-move move src/services/userService.ts src/features/user/services/ --absolute-imports --verbose
```

### **Workflow 2: Shared Module Creation**

```bash
# Step 1: Extract utilities
ts-import-move move src/utils/ src/shared/utils/ --absolute-imports --recursive --verbose

# Step 2: Extract types
ts-import-move move src/types/ src/shared/types/ --absolute-imports --recursive --verbose

# Step 3: Update barrel exports
# (Manual step to update index.ts files)
```

---

## 🏆 **Best Practices Summary**

1. **Always use `--absolute-imports --verbose`** for AI refactoring
2. **Test with `--dry-run`** before large operations
3. **Use `--recursive`** for directory moves
4. **Configure tsconfig.json paths** before starting
5. **Batch large operations** into smaller chunks if needed
6. **Verify imports** after each major refactor

---

## 📋 **Quick Copy-Paste Commands**

```bash
# Most common AI refactoring command
ts-import-move move <source> <destination> --absolute-imports --verbose

# Safe exploration mode
ts-import-move move <source> <destination> --absolute-imports --dry-run --verbose

# Directory migration
ts-import-move move <source-dir> <dest-dir> --absolute-imports --recursive --verbose

# Custom alias project
ts-import-move move <source> <destination> --absolute-imports --alias-prefix "@app" --verbose
```

---

**🎉 You're ready to perform reliable, large-scale TypeScript refactoring with absolute imports!**

**Package Version**: `@drumnation/ts-import-move@1.0.5`  
**Last Updated**: 2025-01-15  
**Status**: Production Ready ✅

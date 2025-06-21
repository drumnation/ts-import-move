# DocumentEditorPage Quick Reference

## 🚀 Common Tasks (Copy-Paste Ready)

### Adding a New Panel
1. **Create the panel directory**:
   ```bash
   mkdir -p components/panels/YourPanelName
   cd components/panels/YourPanelName
   ```

2. **Create required files**:
   ```bash
   touch YourPanelName.tsx
   touch YourPanelName.types.ts
   touch YourPanelName.hook.ts
   touch YourPanelName.styles.ts
   touch index.ts
   ```

3. **Basic component template**:
   ```typescript
   // YourPanelName.tsx
   import React from 'react';
   import { useYourPanelName } from './YourPanelName.hook';
   import { YourPanelNameContainer } from './YourPanelName.styles';
   import type { YourPanelNameProps } from './YourPanelName.types';

   export const YourPanelName: React.FC<YourPanelNameProps> = (props) => {
     const logic = useYourPanelName(props);
     
     return (
       <YourPanelNameContainer>
         <h3>Your Panel Name</h3>
         {/* Your panel content */}
       </YourPanelNameContainer>
     );
   };
   ```

4. **Register the panel**:
   - Add to: `components/shared/molecules/PanelConfiguration/PanelConfiguration.tsx`
   - Import your component and add to the panel slots configuration

### Fixing Resize Issues

1. **Check the primary resize handler**:
   ```bash
   # Open the main hook file
   code components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts
   # Look at lines 80-122 for handlePanelResize function
   ```

2. **Verify Redux state updates**:
   ```bash
   # Check layout slice
   code stores/layoutSlice.ts
   # Verify resize actions are dispatched correctly
   ```

3. **Test column coordination**:
   ```bash
   # Check desktop layout rendering
   code components/shared/molecules/EditorCanvas/components/DesktopCanvasLayout/DesktopCanvasLayout.tsx
   # Look at lines 130-197 for column rendering logic
   ```

4. **Common resize bug fixes**:
   ```typescript
   // Ensure constraints are enforced
   const newSize = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, proposedSize));
   
   // Coordinate column resizing
   const totalWidth = leftWidth + rightWidth;
   if (totalWidth > MAX_TOTAL_WIDTH) {
     // Adjust both columns proportionally
   }
   
   // Throttle resize updates
   const throttledResize = useCallback(
     throttle((delta: number) => handleResize(delta), 16),
     [handleResize]
   );
   ```

### Mobile Responsiveness

1. **Platform detection**:
   ```bash
   code components/layout/components/PlatformDetection/PlatformDetection.tsx
   ```

2. **Mobile layout components**:
   ```bash
   code components/shared/molecules/MobileLayout/MobileLayout.tsx
   ```

3. **Touch interactions checklist**:
   - [ ] Touch event handlers (touchstart, touchmove, touchend)
   - [ ] Appropriate touch targets (min 44px)
   - [ ] Gesture recognition for swipes
   - [ ] Mobile-specific panel behavior

4. **Responsive testing**:
   ```bash
   # Test on different screen sizes
   npm run dev
   # Open browser dev tools
   # Toggle device simulation
   # Test touch interactions
   ```

### Performance Optimization

1. **Check for excessive re-renders**:
   ```bash
   code components/shared/molecules/LexicalEditor/LexicalEditor.redux.ts
   # Look at lines 124-269 for performance optimizations
   ```

2. **Common performance fixes**:
   ```typescript
   // Memoize expensive calculations
   const expensiveValue = useMemo(() => calculateSomething(data), [data]);
   
   // Throttle frequent updates
   const throttledUpdate = useCallback(
     throttle(update, 16), // 60fps
     [update]
   );
   
   // Use proper dependencies in useEffect
   useEffect(() => {
     // effect logic
   }, [specificDependency]); // Don't use empty array unless truly no deps
   ```

### State Management

1. **Redux store structure**:
   ```bash
   code stores/
   # Check individual slices for domain-specific state
   ```

2. **Hook-based state**:
   ```bash
   code components/shared/molecules/EditorCanvas/EditorCanvas.hook.ts
   # Main layout state management
   ```

3. **State synchronization issues**:
   ```typescript
   // Ensure state updates are coordinated
   dispatch(updateLayout({ column: 'left', size: newSize }));
   dispatch(updatePanel({ panelId: 'somePanel', size: newSize }));
   
   // Use proper selectors
   const layoutState = useSelector(selectLayoutState);
   ```

## 📁 Directory Meanings

| Directory | Purpose | When to Use |
|-----------|---------|-------------|
| `components/shared/molecules/` | Reusable layout and UI components | Creating components used across multiple panels |
| `components/panels/` | Feature-specific panel content | Adding new panel functionality |
| `components/layout/` | Platform-specific layout logic | Modifying responsive behavior |
| `hooks/` | Custom React hooks | Creating reusable state logic |
| `stores/` | Redux store and slices | Managing global state |
| `types/` | TypeScript definitions | Adding new type interfaces |

## 🐛 Quick Bug Fixes

### Panel Not Resizing
```typescript
// Check handlePanelResize in EditorCanvas.hook.ts
const handlePanelResize = useCallback((location: string, slot: string, newSize: number) => {
  // Ensure both panel AND column sizes are updated
  dispatch(updatePanelSize({ location, slot, size: newSize }));
  dispatch(updateColumnSize({ column: location, size: calculateColumnSize(location) }));
}, [dispatch]);
```

### Mobile Layout Broken
```typescript
// Check platform detection in MobileLayout.tsx
const isMobile = useMediaQuery('(max-width: 768px)');
const isTouchDevice = 'ontouchstart' in window;

if (isMobile) {
  return <MobileDrawerLayout {...props} />;
}
```

### Performance Issues
```typescript
// Add throttling to expensive operations
const throttledUpdate = useCallback(
  throttle((value) => {
    // expensive operation
  }, 100), // Throttle to 10fps for heavy operations
  []
);
```

## 🔍 Debugging Tips

### Using Browser Dev Tools
1. **React DevTools**: Check component state and props
2. **Redux DevTools**: Monitor state changes
3. **Performance tab**: Identify rendering bottlenecks
4. **Console**: Check for React warnings

### Common Debug Locations
```bash
# Layout issues
console.log('Layout state:', layoutState);

# Panel issues  
console.log('Panel configuration:', panelSlots);

# Mobile issues
console.log('Platform detection:', { isMobile, isTouchDevice });

# Performance issues
console.time('expensiveOperation');
// ... operation
console.timeEnd('expensiveOperation');
```

## 🎯 Development Workflow

### Before Making Changes
1. **Understand the current state**:
   ```bash
   npm run dev
   # Test current functionality
   # Note any existing issues
   ```

2. **Check existing tests**:
   ```bash
   npm test
   # Ensure all tests pass before changes
   ```

3. **Review related components**:
   - Use NAVIGATION_MAP.ts to find related files
   - Check for similar implementations
   - Look for existing patterns to follow

### After Making Changes
1. **Test thoroughly**:
   - Desktop layout
   - Mobile layout  
   - Resize operations
   - Panel interactions

2. **Run tests**:
   ```bash
   npm test
   npm run typecheck
   npm run lint
   ```

3. **Performance check**:
   - Monitor for excessive re-renders
   - Check resize operation smoothness
   - Verify no memory leaks

---

**For AI Agents**: This reference prioritizes actionable steps over comprehensive documentation. Use the NAVIGATION_MAP.ts file to quickly locate code, then refer to this guide for implementation patterns. 
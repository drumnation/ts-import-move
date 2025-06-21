/**
 * LazyPanelLoader Custom Hook
 * Stateful logic for lazy panel loading
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import type { LazyPanelLoaderProps, LazyPanelState } from './LazyPanelLoader.types';
import {
  shouldLoadPanel,
  createIntersectionObserverOptions,
  createErrorHandler,
  updateIntersectionState,
  updateLoadedState,
  resetErrorState,
  createInitialPanelState,
  validatePanelLoaderProps
} from './LazyPanelLoader.logic';

export const useLazyPanelLoader = (props: LazyPanelLoaderProps) => {
  const {
    panelId,
    isVisible,
    threshold = 0.1,
    useIntersectionObserver = true
  } = props;

  // Validate props
  const isValidProps = validatePanelLoaderProps(panelId, threshold);
  
  // Mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Component state
  const [state, setState] = useState<LazyPanelState>(() => 
    createInitialPanelState(isMobile)
  );
  
  // Intersection observer ref
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  // Error handler
  const handleError = useCallback(
    createErrorHandler(panelId, setState),
    [panelId]
  );

  // Retry function
  const handleRetry = useCallback(() => {
    setState(resetErrorState());
  }, []);

  // Intersection observer setup
  useEffect(() => {
    if (!useIntersectionObserver || !isMobile || !elementRef.current) {
      return;
    }

    const options = createIntersectionObserverOptions(threshold);
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setState(updateIntersectionState(entry.isIntersecting));
      },
      options
    );

    observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [useIntersectionObserver, isMobile, threshold]);

  // Loading decision logic
  useEffect(() => {
    if (!isValidProps) return;

    const shouldLoad = shouldLoadPanel(
      isMobile,
      isVisible,
      state.isIntersecting,
      state.isLoaded,
      state.hasError
    );

    if (shouldLoad && !state.isLoaded && !state.hasError) {
      setState(updateLoadedState(true));
    }
  }, [
    isMobile,
    isVisible,
    state.isIntersecting,
    state.isLoaded,
    state.hasError,
    isValidProps
  ]);

  // Error boundary setup
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.filename?.includes(panelId)) {
        handleError(event);
      }
    };

    window.addEventListener('error', handleGlobalError);
    return () => window.removeEventListener('error', handleGlobalError);
  }, [panelId, handleError]);

  return {
    // State
    isLoaded: state.isLoaded,
    isIntersecting: state.isIntersecting,
    hasError: state.hasError,
    isMobile,
    isValidProps,
    
    // Refs
    elementRef,
    
    // Handlers
    handleRetry,
    
    // Computed
    shouldRenderContent: state.isLoaded && !state.hasError,
    shouldShowLoading: !state.isLoaded && !state.hasError,
    shouldShowError: state.hasError
  };
}; 
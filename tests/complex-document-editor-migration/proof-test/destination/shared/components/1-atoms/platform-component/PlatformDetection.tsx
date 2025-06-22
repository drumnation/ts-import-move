/**
 * Platform Detection Components
 * 
 * Provider and router components for platform-aware rendering
 * Handles platform detection and component routing
 * 
 * @module PlatformDetection
 */

import React, { createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { usePlatformDetection } from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection.logic';
import type {
  PlatformProviderProps,
  PlatformRouterProps,
  PlatformContextType,
} from '@/tests/complex-document-editor-migration/proof-test/destination/shared/components/1-atoms/platform-component/PlatformDetection.types';

/**
 * Platform context
 */
const PlatformContext = createContext<PlatformContextType | null>(null);

/**
 * Loading component for platform detection
 */
const LoadingContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #f9fafb;
`;

const LoadingSpinner = styled(motion.div)`
  width: 32px;
  height: 32px;
  border: 3px solid #e5e7eb;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
`;

const DefaultLoading: React.FC = () => (
  <LoadingContainer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <LoadingSpinner
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  </LoadingContainer>
);

/**
 * Fallback component for platform detection failure
 */
const FallbackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  text-align: center;
  background: #fef2f2;
  color: #dc2626;
`;

const DefaultFallback: React.FC = () => (
  <FallbackContainer>
    <h2>Platform Detection Failed</h2>
    <p>Unable to determine device platform. Please refresh the page.</p>
    <button 
      onClick={() => window.location.reload()}
      style={{
        marginTop: '1rem',
        padding: '0.5rem 1rem',
        background: '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
      }}
    >
      Refresh Page
    </button>
  </FallbackContainer>
);

/**
 * Platform Provider Component
 * Provides platform detection context to child components
 */
export const PlatformProvider: React.FC<PlatformProviderProps> = ({
  children,
  breakpoints,
  forcePlatform,
  debug = false,
}) => {
  const platformDetection = usePlatformDetection(breakpoints, forcePlatform, debug);

  const contextValue: PlatformContextType = {
    ...platformDetection,
    updatePlatform: () => {
      // Platform updates are handled automatically by the hook
      // This could be extended for manual updates if needed
    },
  };

  return (
    <PlatformContext.Provider value={contextValue}>
      {children}
    </PlatformContext.Provider>
  );
};

/**
 * Platform Router Component
 * Renders platform-specific components based on detection
 */
export const PlatformRouter: React.FC<PlatformRouterProps> = ({
  desktop: DesktopComponent,
  mobile: MobileComponent,
  tablet: TabletComponent,
  componentProps = {},
  loading: LoadingComponent = DefaultLoading,
  fallback: FallbackComponent = DefaultFallback,
}) => {
  const context = useContext(PlatformContext);

  if (!context) {
    throw new Error('PlatformRouter must be used within a PlatformProvider');
  }

  const { platform, isReady, capabilities, viewport } = context;

  // Show loading while platform detection is in progress
  if (!isReady) {
    return <LoadingComponent />;
  }

  // Determine which component to render
  let ComponentToRender: React.ComponentType<any>;
  
  switch (platform) {
  case 'mobile':
    ComponentToRender = MobileComponent;
    break;
  case 'tablet':
    ComponentToRender = TabletComponent || MobileComponent;
    break;
  case 'desktop':
    ComponentToRender = DesktopComponent;
    break;
  default:
    return <FallbackComponent />;
  }

  const platformProps = {
    platform,
    capabilities,
    viewport,
    ...componentProps,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={platform}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ComponentToRender {...platformProps} />
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Hook to use platform context
 */
export const usePlatformContext = (): PlatformContextType => {
  const context = useContext(PlatformContext);
  
  if (!context) {
    throw new Error('usePlatformContext must be used within a PlatformProvider');
  }
  
  return context;
};

/**
 * Platform Debug Component
 * Shows current platform detection state (development only)
 */
const DebugContainer = styled(motion.div)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  font-family: monospace;
  font-size: 0.75rem;
  z-index: 9999;
  max-width: 300px;
`;

export const PlatformDebug: React.FC = () => {
  const { platform, capabilities, viewport, isReady } = usePlatformContext();

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <DebugContainer
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div><strong>Platform Debug</strong></div>
      <div>Platform: {platform}</div>
      <div>Ready: {isReady ? '✅' : '⏳'}</div>
      <div>Viewport: {viewport.width}×{viewport.height}</div>
      <div>Touch: {capabilities.hasTouch ? '✅' : '❌'}</div>
      <div>Hover: {capabilities.hasHover ? '✅' : '❌'}</div>
      <div>Keyboard: {capabilities.hasKeyboard ? '✅' : '❌'}</div>
      <div>Pointer: {capabilities.hasPointer ? '✅' : '❌'}</div>
      <div>Pixel Ratio: {capabilities.pixelRatio}</div>
    </DebugContainer>
  );
};

/**
 * Platform-aware conditional rendering component
 */
interface PlatformShowProps {
  on: 'mobile' | 'tablet' | 'desktop' | 'touch' | 'hover';
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PlatformShow: React.FC<PlatformShowProps> = ({
  on,
  children,
  fallback = null,
}) => {
  const { is } = usePlatformContext();

  const shouldShow = is[on as keyof typeof is];

  return shouldShow ? <>{children}</> : <>{fallback}</>;
};

/**
 * Platform-aware hide component
 */
interface PlatformHideProps {
  on: 'mobile' | 'tablet' | 'desktop' | 'touch' | 'hover';
  children: React.ReactNode;
}

export const PlatformHide: React.FC<PlatformHideProps> = ({
  on,
  children,
}) => {
  const { is } = usePlatformContext();

  const shouldHide = is[on as keyof typeof is];

  return shouldHide ? null : <>{children}</>;
}; 
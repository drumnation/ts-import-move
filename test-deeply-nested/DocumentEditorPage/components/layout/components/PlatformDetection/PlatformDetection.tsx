/**
 * Platform Detection Hook and Component
 * 
 * Provides SSR-safe platform detection for Level 3 component separation
 * @module PlatformDetection
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface PlatformConfig {
  isMobile: boolean;
  isDesktop: boolean;
  touchTargetConfig: {
    minSize: number;
    spacing: number;
  };
}

const DEFAULT_CONFIG: PlatformConfig = {
  isMobile: false,
  isDesktop: true,
  touchTargetConfig: {
    minSize: 44,
    spacing: 8,
  },
};

const PlatformContext = createContext<PlatformConfig>(DEFAULT_CONFIG);

/**
 * Platform Detection Provider
 * Provides platform context throughout the component tree
 */
export const PlatformProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const updatePlatform = () => {
      const isMobile = window.innerWidth < 768;
      const isDesktop = !isMobile;
      
      setConfig({
        isMobile,
        isDesktop,
        touchTargetConfig: {
          minSize: isMobile ? 44 : 24,
          spacing: isMobile ? 12 : 8,
        },
      });
    };

    // Initial detection
    updatePlatform();

    // Listen for resize changes
    window.addEventListener('resize', updatePlatform);
    return () => window.removeEventListener('resize', updatePlatform);
  }, []);

  return (
    <PlatformContext.Provider value={config}>
      {children}
    </PlatformContext.Provider>
  );
};

/**
 * Hook to access platform configuration
 */
export const usePlatformDetection = (): PlatformConfig => {
  return useContext(PlatformContext);
};

/**
 * Platform Router Component
 * Routes to appropriate platform-specific components
 */
interface PlatformRouterProps {
  mobile: React.ComponentType<any>;
  desktop: React.ComponentType<any>;
  props?: any;
}

export const PlatformRouter: React.FC<PlatformRouterProps> = ({ 
  mobile: MobileComponent, 
  desktop: DesktopComponent, 
  props = {} 
}) => {
  const { isMobile } = usePlatformDetection();
  
  return isMobile ? <MobileComponent {...props} /> : <DesktopComponent {...props} />;
}; 
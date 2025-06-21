/**
 * PanelManager Component Logic
 * 
 * Pure functions for panel management, slot creation, and coordination
 * Renamed from PanelConfiguration for better AI agent discoverability
 * 
 * @module PanelManager.logic
 */

import type { PanelSlot } from '@/pages/DocumentEditorPage/DocumentEditorPage.types';
import type { PanelSlotCreationConfig } from './PanelManager.types';

/**
 * Panel size configuration constants
 * Defines consistent sizing across all managed panels
 */
export const PANEL_SIZES = {
  // Left column panel sizes
  LEFT_TOP_MIN: 240,
  LEFT_TOP_DEFAULT: 300,
  LEFT_BOTTOM_MIN: 200,
  LEFT_BOTTOM_DEFAULT: 250,
  
  // Right column panel sizes
  RIGHT_TOP_MIN: 280,
  RIGHT_TOP_DEFAULT: 350,
  RIGHT_BOTTOM_MIN: 200,
  RIGHT_BOTTOM_DEFAULT: 220,
  
  // Center panel sizes (when applicable)
  CENTER_BOTTOM_MIN: 150,
  CENTER_BOTTOM_DEFAULT: 200,
} as const;

/**
 * Panel content and metadata definitions
 * Centralized data for consistent panel management
 */
export const PANEL_DATA = {
  DOCUMENT_OUTLINE: {
    title: 'Document Outline',
    description: 'Document structure and navigation',
    items: ['Introduction', 'Legal Framework', 'Analysis', 'Conclusion'],
    category: 'navigation'
  },
  ASSETS_RESOURCES: {
    title: 'Assets & Resources',
    description: 'Document assets and references',
    items: ['Case citations', 'Legal precedents', 'Supporting documents'],
    category: 'resources'
  },
  AI_ASSISTANT: {
    title: 'AI Legal Assistant',
    description: 'AI-powered legal document assistance',
    category: 'ai'
  },
  PROPERTIES_METADATA: {
    title: 'Properties & Metadata',
    description: 'Document properties and metadata management',
    category: 'metadata'
  }
} as const;

/**
 * Creates a configured panel slot for the layout system
 * 
 * Factory function that standardizes panel slot creation with
 * proper defaults and validation
 * 
 * @param location - Panel column location
 * @param slot - Panel vertical position
 * @param title - Panel display title
 * @param content - React content for the panel
 * @param minSize - Minimum panel size in pixels
 * @param defaultSize - Default panel size in pixels
 * @param maxSize - Optional maximum panel size in pixels (content-aware)
 * @param metadata - Optional panel metadata
 * @returns Complete PanelSlot configuration
 */
export const createPanelSlotConfig = (
  location: 'left' | 'right' | 'center',
  slot: 'top' | 'bottom',
  title: string,
  content: React.ReactNode,
  minSize: number,
  defaultSize: number,
  maxSize?: number
): PanelSlot => ({
  location,
  slot,
  title,
  content,
  collapsed: false,
  visible: true,
  minSize: Math.max(minSize, 100), // Ensure minimum usable size
  defaultSize: Math.max(defaultSize, minSize), // Ensure default >= minimum
  maxSize: maxSize ? Math.max(maxSize, defaultSize) : undefined // Ensure max >= default if provided
});

/**
 * Validates panel slot configuration
 * 
 * Ensures panel slots meet minimum requirements and
 * have consistent configuration
 * 
 * @param config - Panel slot creation configuration
 * @returns Validation result with any issues
 */
export const validatePanelSlotConfig = (
  config: PanelSlotCreationConfig
): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  // Validate required fields
  if (!config.title?.trim()) {
    issues.push('Panel title is required');
  }
  
  if (!config.content) {
    issues.push('Panel content is required');
  }
  
  // Validate sizes
  if (config.minSize <= 0) {
    issues.push('Minimum size must be positive');
  }
  
  if (config.defaultSize < config.minSize) {
    issues.push('Default size must be >= minimum size');
  }
  
  // Validate location and slot
  const validLocations = ['left', 'right', 'center'];
  const validSlots = ['top', 'bottom'];
  
  if (!validLocations.includes(config.location)) {
    issues.push(`Invalid location: ${config.location}`);
  }
  
  if (!validSlots.includes(config.slot)) {
    issues.push(`Invalid slot: ${config.slot}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Generates panel unique identifier
 * 
 * Creates consistent IDs for panel tracking and management
 * 
 * @param location - Panel location
 * @param slot - Panel slot
 * @param title - Panel title (optional for fallback)
 * @returns Unique panel identifier
 */
export const generatePanelId = (
  location: string,
  slot: string,
  title?: string
): string => {
  const base = `${location}-${slot}`;
  if (title) {
    const sanitized = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
    return `${base}-${sanitized}`;
  }
  return base;
};

/**
 * Gets recommended panel sizes for location and content type
 * 
 * Provides intelligent sizing recommendations based on
 * panel location and expected content
 * 
 * @param location - Panel location
 * @param slot - Panel slot
 * @param contentType - Type of content (optional)
 * @returns Recommended sizing configuration
 */
export const getRecommendedPanelSizes = (
  location: 'left' | 'right' | 'center',
  slot: 'top' | 'bottom',
  contentType?: 'navigation' | 'resources' | 'ai' | 'metadata'
): { minSize: number; defaultSize: number; maxSize?: number } => {
  // Base sizes by location and slot
  const baseKey = `${location.toUpperCase()}_${slot.toUpperCase()}` as keyof typeof PANEL_SIZES;
  const minKey = `${baseKey}_MIN` as keyof typeof PANEL_SIZES;
  const defaultKey = `${baseKey}_DEFAULT` as keyof typeof PANEL_SIZES;
  
  let minSize: number = PANEL_SIZES[minKey] || 200;
  let defaultSize: number = PANEL_SIZES[defaultKey] || 250;
  let maxSize: number | undefined;
  
  // Content-aware sizing adjustments
  if (contentType === 'ai') {
    // AI assistant has optimal form width - prevent excessive dead space
    minSize = Math.max(minSize, 300);
    defaultSize = Math.max(defaultSize, 350);
    maxSize = 420; // Optimal for form inputs, dropdowns, and text areas
  } else if (contentType === 'navigation') {
    // Navigation can be more compact but needs room for text
    minSize = Math.max(minSize, 200);
    defaultSize = Math.max(defaultSize, 250);
    maxSize = 320; // Tree views and lists don't need excessive width
  } else if (contentType === 'metadata') {
    // Metadata panels with key-value pairs
    minSize = Math.max(minSize, 240);
    defaultSize = Math.max(defaultSize, 280);
    maxSize = 380; // Property lists and form fields
  } else if (contentType === 'resources') {
    // Resource lists, file browsers
    minSize = Math.max(minSize, 220);
    defaultSize = Math.max(defaultSize, 260);
    maxSize = 350; // File names and descriptions
  }
  
  return { minSize, defaultSize, maxSize };
};

/**
 * Manages panel lifecycle events
 * 
 * Utility functions for tracking panel state changes
 * and coordinating panel interactions
 */
export const PanelLifecycleManager = {
  /**
   * Handler for when a panel is mounted
   */
  onPanelMount: (panelId: string, config: PanelSlot) => {
    console.log(`Panel mounted: ${panelId}`, config);
  },
  
  /**
   * Handler for when a panel is unmounted
   */
  onPanelUnmount: (panelId: string) => {
    console.log(`Panel unmounted: ${panelId}`);
  },
  
  /**
   * Handler for panel visibility changes
   */
  onPanelVisibilityChange: (panelId: string, visible: boolean) => {
    console.log(`Panel visibility changed: ${panelId} -> ${visible}`);
  },
  
  /**
   * Handler for panel resize events
   */
  onPanelResize: (panelId: string, newSize: number) => {
    console.log(`Panel resized: ${panelId} -> ${newSize}px`);
  }
}; 
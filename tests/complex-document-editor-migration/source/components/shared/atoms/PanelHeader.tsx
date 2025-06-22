/**
 * PanelHeader Atom
 * 
 * Base header component for all panels
 * Provides consistent styling and platform-adaptive behavior
 * 
 * @module atoms/PanelHeader
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { usePlatformDetection } from '@/tests/complex-document-editor-migration/source/components/layout/platform';

const HeaderContainer = styled(motion.div)<{ 
  platform: 'desktop' | 'mobile' | 'tablet';
  variant?: 'primary' | 'secondary';
  isCollapsible?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.platform === 'mobile' ? '12px 16px' : '16px 20px'};
  background: ${props => props.variant === 'secondary' ? '#f8fafc' : '#ffffff'};
  border-bottom: 1px solid #e2e8f0;
  min-height: ${props => props.platform === 'mobile' ? '48px' : '56px'};
  position: relative;
  z-index: 10;
  
  ${props => props.isCollapsible && `
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: ${props.variant === 'secondary' ? '#f1f5f9' : '#f8fafc'};
    }
  `}
`;

const HeaderTitle = styled.h3<{ platform: 'desktop' | 'mobile' | 'tablet' }>`
  margin: 0;
  font-size: ${props => props.platform === 'mobile' ? '16px' : '18px'};
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
  flex: 1;
  min-width: 0; /* Allow text truncation */
`;

const HeaderSubtitle = styled.p<{ platform: 'desktop' | 'mobile' | 'tablet' }>`
  margin: 0;
  font-size: ${props => props.platform === 'mobile' ? '12px' : '14px'};
  color: #64748b;
  line-height: 1.3;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

const HeaderActions = styled.div<{ platform: 'desktop' | 'mobile' | 'tablet' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.platform === 'mobile' ? '8px' : '12px'};
  margin-left: 16px;
`;

const CollapseIcon = styled(motion.div)<{ isCollapsed: boolean }>`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;
  
  &:hover {
    color: #334155;
  }
  
  svg {
    width: 16px;
    height: 16px;
    transform: ${props => props.isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease;
  }
`;

const Badge = styled.span<{ variant?: 'info' | 'warning' | 'success' | 'error' }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  
  ${props => {
    switch (props.variant) {
    case 'info':
      return 'background: #dbeafe; color: #1e40af;';
    case 'warning':
      return 'background: #fef3c7; color: #92400e;';
    case 'success':
      return 'background: #d1fae5; color: #065f46;';
    case 'error':
      return 'background: #fee2e2; color: #dc2626;';
    default:
      return 'background: #f1f5f9; color: #475569;';
    }
  }}
`;

export interface PanelHeaderProps {
  /** Header title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Header variant */
  variant?: 'primary' | 'secondary';
  /** Whether panel is collapsible */
  isCollapsible?: boolean;
  /** Whether panel is currently collapsed */
  isCollapsed?: boolean;
  /** Collapse toggle handler */
  onToggleCollapse?: () => void;
  /** Action buttons or elements */
  actions?: React.ReactNode;
  /** Optional badge */
  badge?: {
    text: string;
    variant?: 'info' | 'warning' | 'success' | 'error';
  };
  /** Custom icon */
  icon?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Click handler for entire header */
  onClick?: () => void;
}

/**
 * PanelHeader component
 * Consistent header for all panel types with platform adaptation
 */
export const PanelHeader: React.FC<PanelHeaderProps> = ({
  title,
  subtitle,
  variant = 'primary',
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse,
  actions,
  badge,
  icon,
  className,
  onClick,
}) => {
  const { platform } = usePlatformDetection();

  const handleClick = () => {
    if (isCollapsible && onToggleCollapse) {
      onToggleCollapse();
    }
    onClick?.();
  };

  return (
    <HeaderContainer
      platform={platform}
      variant={variant}
      isCollapsible={isCollapsible}
      onClick={isCollapsible ? handleClick : onClick}
      className={className}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      {icon && (
        <div style={{ marginRight: platform === 'mobile' ? '8px' : '12px' }}>
          {icon}
        </div>
      )}

      {/* Content */}
      <HeaderContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HeaderTitle platform={platform}>
            {title}
          </HeaderTitle>
          {badge && (
            <Badge variant={badge.variant}>
              {badge.text}
            </Badge>
          )}
        </div>
        {subtitle && (
          <HeaderSubtitle platform={platform}>
            {subtitle}
          </HeaderSubtitle>
        )}
      </HeaderContent>

      {/* Actions */}
      {actions && (
        <HeaderActions platform={platform}>
          {actions}
        </HeaderActions>
      )}

      {/* Collapse Icon */}
      {isCollapsible && (
        <CollapseIcon
          isCollapsed={isCollapsed}
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
          </svg>
        </CollapseIcon>
      )}
    </HeaderContainer>
  );
}; 
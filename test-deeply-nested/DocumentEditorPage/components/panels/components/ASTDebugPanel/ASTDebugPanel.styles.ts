/**
 * AST Debug Panel Styles
 * @module ASTDebugPanel.styles
 */

import styled from '@emotion/styled';

export const DebugPanelContainer = styled.div<{ expanded: boolean; maxHeight?: number }>`
  display: flex;
  flex-direction: column;
  height: ${props => props.expanded ? (props.maxHeight ? `${props.maxHeight}px` : '100%') : 'auto'};
  min-height: ${props => props.expanded ? '200px' : '40px'};
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const DebugPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
  min-height: 48px;
`;

export const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: #374151;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ViewModeToggle = styled.div`
  display: flex;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  overflow: hidden;
`;

export const ViewModeButton = styled.button<{ active: boolean }>`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  background: ${props => props.active ? '#3b82f6' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#6b7280'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#2563eb' : '#f9fafb'};
  }

  &:not(:last-child) {
    border-right: 1px solid #d1d5db;
  }
`;

export const ActionButton = styled.button`
  padding: 6px 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DebugPanelContent = styled.div<{ expanded: boolean }>`
  flex: 1;
  display: ${props => props.expanded ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
`;

export const JSONContainer = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: #ffffff;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
`;

export const JSONCode = styled.pre`
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
  color: #374151;
`;

export const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #6b7280;
  font-size: 14px;
`;

export const ErrorContainer = styled.div`
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  margin: 16px;
  color: #dc2626;
  font-size: 13px;
`;

export const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  color: #6b7280;
  text-align: center;
`;

export const EmptyStateIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
`;

export const EmptyStateText = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
`;

export const EmptyStateSubtext = styled.div`
  font-size: 12px;
  opacity: 0.7;
`;

export const MetadataContainer = styled.div`
  padding: 8px 16px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  font-size: 11px;
  color: #6b7280;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NodeCount = styled.span`
  font-weight: 500;
`;

export const LastUpdated = styled.span`
  opacity: 0.8;
`; 
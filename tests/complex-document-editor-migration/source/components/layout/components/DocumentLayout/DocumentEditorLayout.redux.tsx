/**
 * DocumentEditorLayout Redux Integration
 * 
 * Redux-connected layout component demonstrating complete panel system
 * Follows Redux Toolkit patterns and functional isolated concerns
 * Integrates platform detection with Redux state management
 * 
 * @module DocumentEditorLayout.redux
 */

import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { PlatformProvider } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/PlatformDetection';
import { LeftPanel, RightPanel, useLeftPanelRedux, useRightPanelRedux } from '@/tests/complex-document-editor-migration/source/components/layout/components/panels';

const EditorContainer = styled(motion.div)`
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #f8f9fa;
  overflow: hidden;
`;

const CenterArea = styled.div<{ leftWidth: number; rightWidth: number }>`
  flex: 1;
  margin-left: ${props => props.leftWidth}px;
  margin-right: ${props => props.rightWidth}px;
  background: white;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #6b7280;
  transition: margin 0.3s ease;
`;

const PanelDebugInfo = styled.div`
  position: fixed;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  font-family: monospace;
`;

/**
 * Redux-connected DocumentEditorLayout component
 * Demonstrates complete integration of panel system with Redux state
 */
export const DocumentEditorLayoutRedux: React.FC = () => {
  // Redux-connected panel hooks
  const leftPanelProps = useLeftPanelRedux();
  const rightPanelProps = useRightPanelRedux();

  // Calculate layout dimensions
  const leftWidth = leftPanelProps.visible ? (leftPanelProps.width / 100) * window.innerWidth : 0;
  const rightWidth = rightPanelProps.visible ? (rightPanelProps.width / 100) * window.innerWidth : 0;

  return (
    <PlatformProvider>
      <EditorContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Debug Info */}
        <PanelDebugInfo>
          Left: {leftPanelProps.visible ? `${leftPanelProps.width}%` : 'Hidden'} | 
          Right: {rightPanelProps.visible ? `${rightPanelProps.width}%` : 'Hidden'} | 
          Split L: {leftPanelProps.splitRatio.toFixed(2)} | 
          Split R: {rightPanelProps.splitRatio.toFixed(2)}
        </PanelDebugInfo>

        {/* Left Panel */}
        <LeftPanel {...leftPanelProps} />

        {/* Center Document Area */}
        <CenterArea leftWidth={leftWidth} rightWidth={rightWidth}>
          <div>
            <h2>Document Editor Canvas</h2>
            <p>Redux-connected panel system active</p>
            <p>Left panels: {leftPanelProps.visible ? 'Open' : 'Closed'}</p>
            <p>Right panels: {rightPanelProps.visible ? 'Open' : 'Closed'}</p>
          </div>
        </CenterArea>

        {/* Right Panel */}
        <RightPanel {...rightPanelProps} />
      </EditorContainer>
    </PlatformProvider>
  );
}; 
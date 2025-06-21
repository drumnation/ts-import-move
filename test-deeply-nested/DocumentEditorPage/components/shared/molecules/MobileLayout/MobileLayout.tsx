/**
 * MobileLayout Component
 * 
 * Enhanced mobile-first layout with legal-as-code features:
 * - Button labels and tooltips for clarity
 * - Selection context display with node paths
 * - Quick-action shortcuts
 * - Visual feedback on execution
 * - Improved touch targets (56px)
 * - Recent instructions history
 * - Lightweight focus mode
 * 
 * @module MobileLayout
 */

import React from 'react';
import { Box, Button, ActionIcon, Text, Textarea } from '@mantine/core';
import { 
  IconMenu2, 
  IconSettings, 
  IconRobot, 
  IconX,
  IconMaximize,
  IconBookmark,
  IconLayoutGrid,
  IconArrowLeft,
  IconArrowRight,
  IconAlertTriangle,
  IconHistory,
  IconFocus2
} from '@tabler/icons-react';
import { usePlatformDetection } from '../../DocumentEditorPage.hook';
import { useMobileLayout } from './MobileLayout.hook';
import { MobileLayoutProps } from './MobileLayout.types';
import { cleanActionLabel } from './MobileLayout.logic';
import { BottomSheet, ProgressOverlay } from './components';
import {
  MobileContainer,
  TopToolbar,
  ToolbarButton,
  DocumentViewport,
  BottomActionBar,
  SwipeUpArea,
  SwipeIndicator,
  SelectionContext,
  QuickActionsGrid,
  WarningBox,
  TargetBox
} from './MobileLayout.styles';

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  documentContent,
  leftPanelContent,
  rightPanelContent,
  agentContent,
  selectedNode,
  onExecuteAgent,
  onNodeSelect
}) => {
  const { touchTargetConfig } = usePlatformDetection();
  
  const {
    activeSheet,
    isLightweightMode,
    agentInstruction,
    executionState,
    showLinkedNodesWarning,
    availableQuickActions,
    textareaRef,
    openSheet,
    closeSheet,
    handleQuickAction,
    handleExecuteAgent,
    toggleFocusMode,
    handleNodeDeselect,
    setAgentInstruction
  } = useMobileLayout({
    selectedNode,
    onExecuteAgent,
    onNodeSelect
  });

  const getSheetContent = () => {
    switch (activeSheet) {
      case 'tools':
        return {
          title: 'Document Tools',
          content: (
            <Box>
              {leftPanelContent}
              <Box mt="xl">
                {rightPanelContent}
              </Box>
            </Box>
          )
        };
      case 'ai':
        return {
          title: 'Legal AI Agent',
          content: (
            <Box>
              {/* Selection Context */}
              {selectedNode && (
                <SelectionContext>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <TargetBox>
                      Target: {selectedNode.path}
                    </TargetBox>
                    <ActionIcon size="sm" variant="subtle" onClick={handleNodeDeselect}>
                      <IconX size={12} />
                    </ActionIcon>
                  </Box>
                  <Text size="sm" c="dimmed">
                    {selectedNode.title}
                  </Text>
                </SelectionContext>
              )}

              {/* Linked Nodes Warning */}
              {showLinkedNodesWarning && (
                <WarningBox>
                  <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <IconAlertTriangle size={16} color="#f39c12" />
                    <Text size="sm" fw={500}>Linked References Detected</Text>
                  </Box>
                  <Text size="sm" c="dimmed">
                    This section references {selectedNode?.linkedNodes?.length} linked exhibit(s). 
                    Agent will update both sections.
                  </Text>
                </WarningBox>
              )}

              {/* Quick Actions */}
              {availableQuickActions.length > 0 && (
                <Box>
                  <Text size="sm" fw={500} mb="xs">Quick Actions</Text>
                  <QuickActionsGrid>
                    {availableQuickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant="light"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        style={{
                          height: 48,
                          fontSize: 12,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 4
                        }}
                      >
                        {action.icon}
                        <Text size="xs">{cleanActionLabel(action.label)}</Text>
                      </Button>
                    ))}
                  </QuickActionsGrid>
                </Box>
              )}

              {/* Instruction Input */}
              <Box>
                <Box style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Text size="sm" fw={500}>Instruction</Text>
                  <ActionIcon size="sm" variant="subtle">
                    <IconHistory size={14} />
                  </ActionIcon>
                </Box>
                <Textarea
                  ref={textareaRef}
                  value={agentInstruction}
                  onChange={(e) => setAgentInstruction(e.target.value)}
                  placeholder="Describe what you want the AI agent to do..."
                  rows={4}
                  style={{ marginBottom: 16 }}
                />
                <Button
                  fullWidth
                  size="lg"
                  leftSection={<IconRobot size={20} />}
                  onClick={handleExecuteAgent}
                  disabled={!agentInstruction.trim() || executionState.isExecuting}
                  style={{ minHeight: 56 }}
                >
                  {executionState.isExecuting ? 'Running Agent...' : 'Run Agent'}
                </Button>
              </Box>

              {/* Original Agent Content */}
              <Box mt="xl">
                {agentContent}
              </Box>
            </Box>
          )
        };
      case 'settings':
        return {
          title: 'Settings',
          content: (
            <Box>
              <Button
                variant={isLightweightMode ? "filled" : "light"}
                leftSection={<IconFocus2 size={16} />}
                onClick={toggleFocusMode}
                mb="sm"
              >
                {isLightweightMode ? 'Exit Focus Mode' : 'Enable Focus Mode'}
              </Button>
              <Text size="sm" c="dimmed">
                Focus mode hides AI controls for distraction-free editing.
              </Text>
            </Box>
          )
        };
      default:
        return { title: '', content: null };
    }
  };

  const { title, content } = getSheetContent();

  return (
    <MobileContainer>
      {/* Top Toolbar */}
      <TopToolbar>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <ToolbarButton onClick={() => {}}>
            <div className="icon-container">
              <IconMaximize size={20} />
            </div>
            <div className="label">Fullscreen</div>
          </ToolbarButton>
          
          <ToolbarButton onClick={() => {}}>
            <div className="icon-container">
              <IconBookmark size={20} />
            </div>
            <div className="label">Anchor</div>
          </ToolbarButton>
          
          <ToolbarButton onClick={() => {}}>
            <div className="icon-container">
              <IconLayoutGrid size={20} />
            </div>
            <div className="label">Thumbnails</div>
          </ToolbarButton>
        </Box>

        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <ToolbarButton onClick={() => {}}>
            <div className="icon-container">
              <IconArrowLeft size={20} />
            </div>
            <div className="label">Prev</div>
          </ToolbarButton>
          
          <ToolbarButton onClick={() => {}}>
            <div className="icon-container">
              <IconArrowRight size={20} />
            </div>
            <div className="label">Next</div>
          </ToolbarButton>
        </Box>
      </TopToolbar>

      {/* Document Viewport */}
      <DocumentViewport>
        {documentContent}
      </DocumentViewport>

      {/* Execution Progress Overlay */}
      <ProgressOverlay executionState={executionState} />

      {/* Bottom Action Bar */}
      {!isLightweightMode && (
        <BottomActionBar height={touchTargetConfig.primaryActionHeight} isHidden={false}>
          <Button
            variant="light"
            leftSection={<IconMenu2 size={20} />}
            onClick={() => openSheet('tools')}
            style={{
              minHeight: 56,
              minWidth: 56,
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Tools
          </Button>

          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            leftSection={<IconRobot size={20} />}
            onClick={() => openSheet('ai')}
            style={{
              minHeight: 56,
              minWidth: 56,
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Run Agent
          </Button>

          <ActionIcon
            size={56}
            variant="light"
            onClick={() => openSheet('settings')}
          >
            <IconSettings size={20} />
          </ActionIcon>
        </BottomActionBar>
      )}

      {/* Lightweight Mode Swipe-Up Area */}
      {isLightweightMode && (
        <SwipeUpArea
          onTap={() => openSheet('ai')}
          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
        >
          <SwipeIndicator />
        </SwipeUpArea>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        isOpen={Boolean(activeSheet)}
        sheetType={activeSheet}
        title={title}
        touchConfig={touchTargetConfig}
        onClose={closeSheet}
      >
        {content}
      </BottomSheet>
    </MobileContainer>
  );
}; 
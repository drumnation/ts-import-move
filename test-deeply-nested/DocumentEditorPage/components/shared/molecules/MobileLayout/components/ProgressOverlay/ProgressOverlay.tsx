import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Text } from '@mantine/core';
import { IconLoader } from '@tabler/icons-react';
import { ProgressOverlayProps } from './ProgressOverlay.types';
import { progressOverlayVariants, validateProgress, formatProgressMessage } from './ProgressOverlay.logic';
import { 
  StyledProgressOverlay, 
  ProgressContent, 
  ProgressInfo,
  ProgressBar, 
  ProgressFill,
  LoadingIcon 
} from './ProgressOverlay.styles';

export const ProgressOverlay: React.FC<ProgressOverlayProps> = ({
  executionState
}) => {
  const validatedProgress = validateProgress(executionState.progress);
  const formattedMessage = formatProgressMessage(executionState.message);

  return (
    <AnimatePresence>
      {executionState.isExecuting && (
        <StyledProgressOverlay
          variants={progressOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <ProgressContent>
            <LoadingIcon>
              <IconLoader size={20} />
            </LoadingIcon>
            <ProgressInfo>
              <Text size="sm" fw={500}>
                {formattedMessage}
              </Text>
              <ProgressBar>
                <ProgressFill progress={validatedProgress} />
              </ProgressBar>
            </ProgressInfo>
          </ProgressContent>
        </StyledProgressOverlay>
      )}
    </AnimatePresence>
  );
}; 
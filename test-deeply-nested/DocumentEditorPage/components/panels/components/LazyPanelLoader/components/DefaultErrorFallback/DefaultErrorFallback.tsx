/**
 * Default Error Fallback Component for LazyPanelLoader
 */
import type { DefaultErrorFallbackProps } from '../LazyPanelLoader.types';
import { ErrorContainer, ErrorText, RetryButton } from '../LazyPanelLoader.styles';

export const DefaultErrorFallback = ({ panelId, retry }: DefaultErrorFallbackProps) => (
  <ErrorContainer>
    <ErrorText>Failed to load {panelId} panel</ErrorText>
    <RetryButton onClick={retry}>
      Retry
    </RetryButton>
  </ErrorContainer>
); 
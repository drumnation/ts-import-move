/**
 * Default Error Fallback Component for LazyPanelLoader
 */
import type { DefaultErrorFallbackProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components/LazyPanelLoader.types';
import { ErrorContainer, ErrorText, RetryButton } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components/LazyPanelLoader.styles';

export const DefaultErrorFallback = ({ panelId, retry }: DefaultErrorFallbackProps) => (
  <ErrorContainer>
    <ErrorText>Failed to load {panelId} panel</ErrorText>
    <RetryButton onClick={retry}>
      Retry
    </RetryButton>
  </ErrorContainer>
); 
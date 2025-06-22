/**
 * Default Loading Component for LazyPanelLoader
 */
import type { DefaultLoadingComponentProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components/LazyPanelLoader.types';
import { LoadingContainer, LoadingText } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components/LazyPanelLoader.styles';

export const DefaultLoadingComponent = ({ panelId }: DefaultLoadingComponentProps) => (
  <LoadingContainer>
    <LoadingText>Loading {panelId} panel...</LoadingText>
  </LoadingContainer>
); 
/**
 * Default Loading Component for LazyPanelLoader
 */
import type { DefaultLoadingComponentProps } from '../LazyPanelLoader.types';
import { LoadingContainer, LoadingText } from '../LazyPanelLoader.styles';

export const DefaultLoadingComponent = ({ panelId }: DefaultLoadingComponentProps) => (
  <LoadingContainer>
    <LoadingText>Loading {panelId} panel...</LoadingText>
  </LoadingContainer>
); 
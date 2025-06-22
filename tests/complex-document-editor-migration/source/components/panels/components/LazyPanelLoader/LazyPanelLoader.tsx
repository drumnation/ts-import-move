/**
 * LazyPanelLoader Component
 * Handles lazy loading of panel content with mobile-first approach
 */
import type { LazyPanelLoaderProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.types';
import { LazyPanelContainer } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.styles';
import { useLazyPanelLoader } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/LazyPanelLoader.hook';
import { DefaultLoadingComponent, DefaultErrorFallback } from '@/tests/complex-document-editor-migration/source/components/panels/components/LazyPanelLoader/components';

export const LazyPanelLoader = (props: LazyPanelLoaderProps) => {
  const {
    children,
    panelId,
    fallback,
    loadingComponent,
    errorFallback
  } = props;

  const {
    elementRef,
    handleRetry,
    shouldRenderContent,
    shouldShowLoading,
    shouldShowError,
    isValidProps
  } = useLazyPanelLoader(props);

  // Early return for invalid props
  if (!isValidProps) {
    return (
      <LazyPanelContainer>
        <DefaultErrorFallback 
          panelId={panelId} 
          retry={() => window.location.reload()} 
        />
      </LazyPanelContainer>
    );
  }

  return (
    <LazyPanelContainer ref={elementRef}>
      {shouldRenderContent && children}
      
      {shouldShowLoading && (
        loadingComponent || 
        fallback || 
        <DefaultLoadingComponent panelId={panelId} />
      )}
      
      {shouldShowError && (
        errorFallback || 
        <DefaultErrorFallback panelId={panelId} retry={handleRetry} />
      )}
    </LazyPanelContainer>
  );
}; 
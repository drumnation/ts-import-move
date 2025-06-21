import React, { useCallback, useMemo } from 'react';
import { PageWrapper, PageContent, PageNumber } from './DocumentPage.styles';
import { getHoverScale, getTapScale, isPageActive } from './DocumentPage.logic';
import type { DocumentPageProps } from './DocumentPage.types';

/**
 * DocumentPage component displays a single page of a document with responsive styling
 * and interactive behaviors based on view mode.
 */
export const DocumentPage: React.FC<DocumentPageProps> = ({
  page,
  index,
  currentPageIndex,
  viewMode,
  isMobile,
  zoom,
  onPageClick
}) => {
  const isActive = useMemo(
    () => isPageActive(index, currentPageIndex),
    [index, currentPageIndex]
  );
  
  const handleClick = useCallback(() => {
    onPageClick(index);
  }, [index, onPageClick]);

  const hoverScale = useMemo(() => getHoverScale(viewMode), [viewMode]);
  const tapScale = useMemo(() => getTapScale(viewMode), [viewMode]);
  
  const zoomStyle = useMemo(() => ({ transform: `scale(${zoom})` }), [zoom]);

  return (
    <PageWrapper
      isActive={isActive}
      viewMode={viewMode}
      isMobile={isMobile}
      onClick={handleClick}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: tapScale }}
      style={zoomStyle}
    >
      <PageContent viewMode={viewMode} isMobile={isMobile}>
        {page.content}
      </PageContent>
      <PageNumber isMobile={isMobile}>
        {page.pageNumber}
      </PageNumber>
    </PageWrapper>
  );
}; 
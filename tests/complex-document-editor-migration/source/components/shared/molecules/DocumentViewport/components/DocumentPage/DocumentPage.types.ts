import type { DocumentPage as DocumentPageData } from '@/tests/complex-document-editor-migration/source/components/shared/DocumentEditorPage.types';
import type { ViewMode } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.types';

export interface DocumentPageProps {
  /** Page data */
  page: DocumentPageData;
  /** Page index */
  index: number;
  /** Current page index */
  currentPageIndex: number;
  /** View mode */
  viewMode: ViewMode;
  /** Whether device is mobile */
  isMobile: boolean;
  /** Current zoom level */
  zoom: number;
  /** Page click handler */
  onPageClick: (index: number) => void;
}

export interface PageWrapperStyledProps {
  isActive: boolean;
  viewMode: ViewMode;
  isMobile: boolean;
}

export interface PageContentStyledProps {
  viewMode: ViewMode;
  isMobile: boolean;
}

export interface PageNumberStyledProps {
  isMobile: boolean;
} 
/**
 * DocumentLayout Module
 * @module layout/components/DocumentLayout
 */

// Main components
export { DocumentLayout } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout';
export { DocumentLayoutDesktop } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.desktop';
export { DocumentLayoutMobile } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.mobile';

// Redux integration
export { DocumentEditorLayoutRedux } from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentEditorLayout.redux';

// Shared logic
export * from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.logic';

// Type exports
export type * from '@/tests/complex-document-editor-migration/source/components/layout/components/DocumentLayout/DocumentLayout.types'; 
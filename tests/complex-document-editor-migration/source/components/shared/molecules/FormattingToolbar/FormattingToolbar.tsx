/**
 * FormattingToolbar Component - Level 3 Platform Router
 * 
 * Platform-adaptive text formatting toolbar with complete component separation
 * Routes to mobile/desktop variants with shared business logic
 * 
 * @module FormattingToolbar
 */

import React from 'react';
import { PlatformRouter } from '@/pages/DocumentEditorPage/components/layout/components/PlatformDetection';
import { FormattingToolbarMobile } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/FormattingToolbar/FormattingToolbar.mobile';
import { FormattingToolbarDesktop } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/FormattingToolbar/FormattingToolbar.desktop';
import type { FormattingToolbarProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/FormattingToolbar/FormattingToolbar.types';

/**
 * FormattingToolbar - Platform Router Component
 * 
 * Automatically routes to appropriate platform implementation
 * Maintains consistent API across all platforms
 */
export const FormattingToolbar: React.FC<FormattingToolbarProps> = (props) => {
  return (
    <PlatformRouter
      mobile={FormattingToolbarMobile}
      desktop={FormattingToolbarDesktop}
      props={props}
    />
  );
};

FormattingToolbar.displayName = 'FormattingToolbar'; 
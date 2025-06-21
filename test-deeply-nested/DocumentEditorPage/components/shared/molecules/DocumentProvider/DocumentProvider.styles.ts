/**
 * Document Provider Styles
 * 
 * Styled components for document container and page layout
 * 
 * @module DocumentProvider.styles
 */

import styled from '@emotion/styled';

/**
 * Container for document page content
 * Provides proper padding and height management for the editor
 */
export const DocumentPageContainer = styled.div`
  padding: 2rem;
  height: 100%;
  min-height: 100vh;
  background: #ffffff;
  
  /* Ensure proper document styling */
  & > * {
    max-width: 100%;
  }
  
  /* Handle print layout */
  @media print {
    padding: 1in;
    background: white;
  }
`; 
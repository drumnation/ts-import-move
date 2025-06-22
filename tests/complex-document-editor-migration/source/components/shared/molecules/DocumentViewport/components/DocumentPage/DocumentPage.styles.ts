import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type {
  PageWrapperStyledProps,
  PageContentStyledProps,
  PageNumberStyledProps
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/components/DocumentPage/DocumentPage.types';

export const PageWrapper = styled(motion.div)<PageWrapperStyledProps>`
  background: white;
  border-radius: 8px;
  box-shadow: 
    ${props => props.isActive ? '0 8px 32px rgba(0, 0, 0, 0.15)' : '0 4px 16px rgba(0, 0, 0, 0.1)'};
  transition: box-shadow 0.2s ease;
  min-height: ${props => props.viewMode === 'thumbnail' ? (props.isMobile ? '200px' : '300px') : '800px'};
  width: ${props => {
    if (props.viewMode === 'thumbnail') return props.isMobile ? '150px' : '200px';
    if (props.isMobile) return '100%';
    return '8.5in';
  }};
  max-width: ${props => props.isMobile ? '100%' : '8.5in'};
  position: relative;
  cursor: ${props => props.viewMode === 'thumbnail' ? 'pointer' : 'default'};
  
  &:hover {
    box-shadow: ${props => props.viewMode === 'thumbnail' ? '0 6px 24px rgba(0, 0, 0, 0.15)' : 'inherit'};
  }
`;

export const PageContent = styled.div<PageContentStyledProps>`
  padding: ${props => {
    if (props.viewMode === 'thumbnail') return props.isMobile ? '8px' : '12px';
    return props.isMobile ? '16px' : '1in';
  }};
  font-family: 'Times New Roman', serif;
  font-size: ${props => {
    if (props.viewMode === 'thumbnail') return props.isMobile ? '8px' : '10px';
    return props.isMobile ? '14px' : '12pt';
  }};
  line-height: 1.6;
  overflow: hidden;
`;

export const PageNumber = styled.div<PageNumberStyledProps>`
  position: absolute;
  bottom: ${props => props.isMobile ? '8px' : '12px'};
  right: ${props => props.isMobile ? '8px' : '12px'};
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: ${props => props.isMobile ? '4px 8px' : '6px 10px'};
  border-radius: 4px;
  font-size: ${props => props.isMobile ? '10px' : '12px'};
  font-weight: 500;
`; 
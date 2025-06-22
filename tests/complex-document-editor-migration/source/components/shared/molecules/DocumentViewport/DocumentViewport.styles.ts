import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import type {
  ViewportHeaderProps,
  PageWrapperProps,
  PageContentProps,
  PageNumberProps,
  NavigationControlsProps,
  ThumbnailGridProps
} from '@/tests/complex-document-editor-migration/source/components/shared/molecules/DocumentViewport/DocumentViewport.types';

export const ViewportContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  position: relative;
`;

export const ViewportHeader = styled.div<ViewportHeaderProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.isMobile ? '12px 16px' : '8px 16px'};
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid #e5e7eb;
  min-height: ${props => props.isMobile ? '56px' : '48px'};
`;

export const PageContainer = styled(motion.div)<{ viewMode: string; isMobile: boolean }>`
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: ${props => props.viewMode === 'infinite' ? 'column' : 'row'};
  align-items: center;
  justify-content: ${props => props.viewMode === 'single' ? 'center' : 'flex-start'};
  padding: ${props => props.isMobile ? '16px' : '20px'};
  gap: ${props => props.isMobile ? '16px' : '20px'};
`;

export const PageWrapper = styled(motion.div)<PageWrapperProps>`
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

export const PageContent = styled.div<PageContentProps>`
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

export const PageNumber = styled.div<PageNumberProps>`
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

export const NavigationControls = styled.div<NavigationControlsProps>`
  display: flex;
  align-items: center;
  gap: ${props => props.isMobile ? '12px' : '8px'};
`;

export const ThumbnailGrid = styled.div<ThumbnailGridProps>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${props => props.isMobile ? '150px' : '200px'}, 1fr));
  gap: ${props => props.isMobile ? '12px' : '16px'};
  width: 100%;
  justify-items: center;
`; 
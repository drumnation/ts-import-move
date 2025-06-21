/**
 * DesktopCanvasLayout Component Styles
 * @module DesktopCanvasLayout.styles
 */

import styled from '@emotion/styled';
import type { DesktopLayoutProps, PanelSlotContainerProps } from './DesktopCanvasLayout.types';

export const DesktopLayout = styled.div<DesktopLayoutProps>`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  
  .left-column {
    width: ${props => props.leftWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #e5e7eb;
    position: relative;
  }
  
  .center-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; /* Allow flex shrinking */
  }
  
  .right-column {
    width: ${props => props.rightWidth}%;
    min-width: 240px;
    max-width: 40%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #e5e7eb;
    position: relative;
  }
`;

export const PanelSlotContainer = styled.div<PanelSlotContainerProps>`
  ${props => props.isTop ? `
    flex: ${props.splitRatio};
    border-bottom: 1px solid #e5e7eb;
  ` : `
    flex: ${1 - props.splitRatio};
  `}
  
  display: flex;
  flex-direction: column;
  min-height: 120px;
`;

export const CenterContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  margin: 0 1px;
`; 
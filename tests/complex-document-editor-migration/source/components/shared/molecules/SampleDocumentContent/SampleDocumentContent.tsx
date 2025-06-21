/**
 * Sample Document Content Component
 * 
 * Renders formatted sample legal document for demonstration purposes
 * Separated from main component to improve organization and reusability
 * 
 * @module SampleDocumentContent
 */

import React from 'react';
import { getSampleDocumentText } from '@/pages/DocumentEditorPage/DocumentEditorPage.logic';
import { SampleDocumentContentProps } from './SampleDocumentContent.types';
import {
  DocumentContainer,
  DocumentTitle,
  CaseNumber,
  ContentSection,
  IntroductionParagraph,
  BodyParagraph,
  SignatureSection,
  SignatureLine,
  SignatureUnderline,
} from './SampleDocumentContent.styles';

/**
 * Renders the sample document content with proper legal formatting
 */
export const SampleDocumentContent: React.FC<SampleDocumentContentProps> = ({ 
  style = {} 
}) => {
  const documentData = getSampleDocumentText();

  return (
    <DocumentContainer style={style}>
      <DocumentTitle>
        {documentData.title}
      </DocumentTitle>
      <CaseNumber>{documentData.caseNumber}</CaseNumber>
      
      <ContentSection>
        <IntroductionParagraph>
          {documentData.content.introduction}
        </IntroductionParagraph>
        
        {documentData.content.paragraphs.map((paragraph, index) => (
          <BodyParagraph key={index}>
            {paragraph}
          </BodyParagraph>
        ))}
      </ContentSection>
      
      <SignatureSection>
        <SignatureLine>{documentData.content.signature.closing}</SignatureLine>
        <br />
        <SignatureUnderline>_________________________</SignatureUnderline>
        <SignatureLine>{documentData.content.signature.attorney}</SignatureLine>
        <SignatureLine>{documentData.content.signature.barNumber}</SignatureLine>
        <SignatureLine>{documentData.content.signature.firm}</SignatureLine>
        <SignatureLine>{documentData.content.signature.address}</SignatureLine>
        <SignatureLine>{documentData.content.signature.phone}</SignatureLine>
        <SignatureLine>{documentData.content.signature.email}</SignatureLine>
      </SignatureSection>
    </DocumentContainer>
  );
}; 
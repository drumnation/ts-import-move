import React from 'react';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { DocumentInfoPanel } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/components/DocumentInfoPanel/DocumentInfoPanel';
import type { DocumentInfoPanelProps } from '@/tests/complex-document-editor-migration/source/components/shared/molecules/PanelManager/components/DocumentInfoPanel/DocumentInfoPanel.types';

const defaultProps: DocumentInfoPanelProps = {
  createdDate: 'Today',
  modifiedDate: '5 minutes ago',
  status: 'Draft',
  documentType: 'Legal Brief'
};

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MantineProvider>
      {component}
    </MantineProvider>
  );
};

describe('DocumentInfoPanel', () => {
  it('renders component successfully', () => {
    renderWithProviders(<DocumentInfoPanel {...defaultProps} />);
    
    expect(screen.getByText('Document properties and metadata')).toBeInTheDocument();
    expect(screen.getByText('Document Info:')).toBeInTheDocument();
  });

  it('displays document information correctly', () => {
    renderWithProviders(<DocumentInfoPanel {...defaultProps} />);
    
    expect(screen.getByText('• Created: Today')).toBeInTheDocument();
    expect(screen.getByText('• Modified: 5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('• Status: Draft')).toBeInTheDocument();
    expect(screen.getByText('• Type: Legal Brief')).toBeInTheDocument();
  });

  it('uses default values when props are not provided', () => {
    renderWithProviders(<DocumentInfoPanel />);
    
    expect(screen.getByText('• Created: Today')).toBeInTheDocument();
    expect(screen.getByText('• Modified: 5 minutes ago')).toBeInTheDocument();
    expect(screen.getByText('• Status: Draft')).toBeInTheDocument();
    expect(screen.getByText('• Type: Legal Brief')).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const customProps: DocumentInfoPanelProps = {
      createdDate: 'Yesterday',
      modifiedDate: '1 hour ago',
      status: 'Published',
      documentType: 'Contract'
    };

    renderWithProviders(<DocumentInfoPanel {...customProps} />);
    
    expect(screen.getByText('• Created: Yesterday')).toBeInTheDocument();
    expect(screen.getByText('• Modified: 1 hour ago')).toBeInTheDocument();
    expect(screen.getByText('• Status: Published')).toBeInTheDocument();
    expect(screen.getByText('• Type: Contract')).toBeInTheDocument();
  });
}); 
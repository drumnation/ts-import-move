import { useCallback } from 'react';
import { ExhibitItemProps } from '@/tests/complex-document-editor-migration/source/components/panels/components/Exhibits/components/ExhibitItem/ExhibitItem.types';

export const useExhibitItemHandlers = ({
  exhibit,
  onEdit,
  onDelete,
  onView,
  onAddCitation,
  onSelect
}: ExhibitItemProps) => {
  const handleCardClick = useCallback(() => {
    if (onSelect) {
      onSelect(exhibit);
    }
  }, [onSelect, exhibit]);

  const handleEdit = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(exhibit);
  }, [onEdit, exhibit]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(exhibit.id);
  }, [onDelete, exhibit.id]);

  const handleView = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onView(exhibit);
  }, [onView, exhibit]);

  const handleAddCitation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onAddCitation(exhibit);
  }, [onAddCitation, exhibit]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return {
    handleCardClick,
    handleEdit,
    handleDelete,
    handleView,
    handleAddCitation,
    handleMenuClick
  };
}; 
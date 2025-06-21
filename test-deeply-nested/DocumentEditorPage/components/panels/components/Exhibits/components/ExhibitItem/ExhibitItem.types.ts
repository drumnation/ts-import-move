import { ExhibitItem as ExhibitItemType } from '../../Exhibits.types';

export interface ExhibitItemProps {
  exhibit: ExhibitItemType;
  onEdit: (exhibit: ExhibitItemType) => void;
  onDelete: (id: string) => void;
  onView: (exhibit: ExhibitItemType) => void;
  onAddCitation: (exhibit: ExhibitItemType) => void;
  isSelected?: boolean;
  onSelect?: (exhibit: ExhibitItemType) => void;
}

export type ExhibitStatus = ExhibitItemType['status'];
export type ExhibitRelevance = 'high' | 'medium' | 'low'; 
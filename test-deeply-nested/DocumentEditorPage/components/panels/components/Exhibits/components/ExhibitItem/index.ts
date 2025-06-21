export { ExhibitItem } from './ExhibitItem';
export type { ExhibitItemProps, ExhibitStatus, ExhibitRelevance } from './ExhibitItem.types';
export { 
  getStatusColor, 
  getStatusIcon, 
  getRelevanceColor,
  formatCitationsText,
  formatTagsDisplay
} from './ExhibitItem.logic';
export { useExhibitItemHandlers } from './ExhibitItem.hook';
export { StyledCard, ExhibitLabel } from './ExhibitItem.styles'; 
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconLink,
  IconCheck,
  IconClock,
  IconX,
  IconFile
} from '@tabler/icons-react';
import { ExhibitStatus, ExhibitRelevance } from './ExhibitItem.types';

export const getStatusColor = (status: ExhibitStatus): string => {
  switch (status) {
    case 'approved': 
      return 'green';
    case 'pending': 
      return 'yellow';
    case 'rejected': 
      return 'red';
    case 'draft': 
      return 'gray';
    default: 
      return 'gray';
  }
};

export const getStatusIcon = (status: ExhibitStatus) => {
  switch (status) {
    case 'approved': 
      return IconCheck;
    case 'pending': 
      return IconClock;
    case 'rejected': 
      return IconX;
    case 'draft': 
      return IconEdit;
    default: 
      return IconFile;
  }
};

export const getRelevanceColor = (relevance?: ExhibitRelevance): string => {
  switch (relevance) {
    case 'high': 
      return 'red';
    case 'medium': 
      return 'yellow';
    case 'low': 
      return 'blue';
    default: 
      return 'gray';
  }
};

export const formatCitationsText = (count: number): string => {
  return `${count} citation${count !== 1 ? 's' : ''}`;
};

export const formatTagsDisplay = (tags: string[], maxVisible: number = 3) => {
  const visibleTags = tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;
  
  return {
    visibleTags,
    remainingCount: remainingCount > 0 ? remainingCount : 0,
    hasMoreTags: remainingCount > 0
  };
}; 
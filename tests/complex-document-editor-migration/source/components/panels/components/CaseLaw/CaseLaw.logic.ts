import {
  IconCheck,
  IconX,
  IconClock,
  IconEdit,
} from '@tabler/icons-react';
import { SimpleCitationStatus } from '@/tests/complex-document-editor-migration/source/components/panels/components/CaseLaw/CaseLaw.types';

export const getStatusColor = (status: SimpleCitationStatus): string => {
  switch (status) {
  case 'verified': return 'green';
  case 'pending': return 'yellow';
  case 'failed': return 'red';
  case 'draft': return 'gray';
  default: return 'gray';
  }
};

export const getStatusIcon = (status: SimpleCitationStatus) => {
  switch (status) {
  case 'verified': return IconCheck;
  case 'pending': return IconClock;
  case 'failed': return IconX;
  case 'draft': return IconEdit;
  default: return IconClock;
  }
}; 
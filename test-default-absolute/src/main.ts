import { formatString, validateInput } from '@/shared/helper';

export const processData = (data: string) => {
  if (validateInput(data)) {
    return formatString(data);
  }
  return '';
};

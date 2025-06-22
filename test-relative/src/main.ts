import { formatString, validateInput } from './utils/helper';

export const processData = (data: string) => {
  if (validateInput(data)) {
    return formatString(data);
  }
  return '';
};

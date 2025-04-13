import { toTitleCase, generateId } from '../utils/helpers';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export function Button({ label, onClick }: ButtonProps) {
  const buttonId = generateId();
  
  return {
    id: buttonId,
    label: toTitleCase(label),
    handleClick: onClick
  };
} 
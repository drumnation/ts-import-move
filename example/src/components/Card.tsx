import { formatCurrency, formatDate } from '../utils/formatter';

interface CardProps {
  title: string;
  price: number;
  date: Date;
}

export function Card({ title, price, date }: CardProps) {
  return {
    title,
    formattedPrice: formatCurrency(price),
    formattedDate: formatDate(date)
  };
} 
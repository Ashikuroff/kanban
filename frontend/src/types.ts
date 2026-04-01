export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface Card {
  id: string;
  title: string;
  details: string;
  columnId: string;
  order: number;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
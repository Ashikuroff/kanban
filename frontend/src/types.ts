export interface Card {
  id: string;
  title: string;
  details: string;
  completed?: boolean;
}

export interface Column {
  id: string;
  name: string;
  cards: Card[];
}
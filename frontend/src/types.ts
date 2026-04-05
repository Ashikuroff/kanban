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

export type BoardAction =
  | {
      type: 'ADD_CARD';
      payload: {
        columnId: string;
        title: string;
        details: string;
      };
    }
  | {
      type: 'DELETE_CARD';
      payload: {
        cardId: string;
      };
    }
  | {
      type: 'MOVE_CARD';
      payload: {
        cardId: string;
        targetColumnId: string;
        targetIndex: number;
      };
    }
  | {
      type: 'RENAME_COLUMN';
      payload: {
        columnId: string;
        title: string;
      };
    }
  | {
      type: 'EDIT_CARD';
      payload: {
        cardId: string;
        title: string;
        details: string;
      };
    }
  | {
      type: 'DELETE_COLUMN';
      payload: {
        columnId: string;
      };
    };

export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

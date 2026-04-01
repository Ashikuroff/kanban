import { createContext, useContext, useReducer } from 'react';
import type { BoardState, Column, Card } from '../types';

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

export const initialState: BoardState = {
  columns: [
    { id: '1', title: 'To Do', order: 0 },
    { id: '2', title: 'In Progress', order: 1 },
    { id: '3', title: 'Review', order: 2 },
    { id: '4', title: 'Done', order: 3 },
    { id: '5', title: 'Archived', order: 4 }
  ],
  cards: [
    { id: '1-1', title: 'Design UI', details: 'Create wireframes for the new feature', columnId: '1', order: 0 },
    { id: '1-2', title: 'Write tests', details: 'Unit tests for the API endpoints', columnId: '1', order: 1 },
    { id: '2-1', title: 'Implement login', details: 'Add authentication to the app', columnId: '2', order: 0 }
  ]
};

export function boardReducer(state: BoardState, action: any): BoardState {
  switch (action.type) {
    case 'ADD_CARD':
      const newCard = {
        id: `${action.payload.columnId}-${Date.now()}`, // Simple ID generation for MVP
        title: action.payload.title,
        details: action.payload.details,
        columnId: action.payload.columnId,
        order: state.cards
          .filter(card => card.columnId === action.payload.columnId)
          .length
      };
      return {
        ...state,
        cards: [...state.cards, newCard]
      };

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload)
      };

    default:
      return state;
  }
}

const BoardContext = createContext<{ state: BoardState; dispatch: React.Dispatch<any> } | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  return (
    <BoardContext.Provider value={{ state: state, dispatch: dispatch }}>
      {children}
    </BoardContext.Provider>
  );
}

export function useBoard() {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
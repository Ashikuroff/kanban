'use client';

import React, { createContext, useContext, useReducer } from 'react';
import type { BoardState, Column, Card } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

    case 'MOVE_CARD':
      const { cardId, newColumnId, newIndex } = action.payload;
      const cardToMove = state.cards.find(card => card.id === cardId);
      if (!cardToMove) return state;

      // Remove card from current position
      const filteredCards = state.cards.filter(card => card.id !== cardId);

      // Update card's column and order
      const updatedCard = { ...cardToMove, columnId: newColumnId, order: newIndex };

      // Insert card at new position
      const cardsInNewColumn = filteredCards.filter(card => card.columnId === newColumnId);
      const updatedCardsInNewColumn = [
        ...cardsInNewColumn.slice(0, newIndex),
        updatedCard,
        ...cardsInNewColumn.slice(newIndex)
      ];

      // Update order for all cards in the new column
      const finalCardsInNewColumn = updatedCardsInNewColumn.map((card, index) => ({
        ...card,
        order: index
      }));

      // Combine with cards from other columns
      const otherCards = filteredCards.filter(card => card.columnId !== newColumnId);

      return {
        ...state,
        cards: [...otherCards, ...finalCardsInNewColumn]
      };

    default:
      return state;
  }
}

const BoardContext = createContext<{ state: BoardState; dispatch: React.Dispatch<any> } | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useLocalStorage<BoardState>('kanban-board', initialState);

  const dispatch = (action: any) => {
    setState(currentState => boardReducer(currentState, action));
  };

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
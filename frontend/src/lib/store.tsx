'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { BoardAction, BoardState, Card } from '../types';
import { generateId } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './auth';
import { useActiveBoard } from '../hooks/useActiveBoard';

export const initialState: BoardState = {
  columns: [
    { id: 'column-1', title: 'Ideas', order: 0 },
    { id: 'column-2', title: 'Planned', order: 1 },
    { id: 'column-3', title: 'In Progress', order: 2 },
    { id: 'column-4', title: 'Review', order: 3 },
    { id: 'column-5', title: 'Complete', order: 4 },
  ],
  cards: [
    {
      id: 'card-1',
      title: 'Refine onboarding visuals',
      details: 'Tighten the hero copy, refine button hierarchy, and align the empty states.',
      columnId: 'column-1',
      order: 0,
    },
    {
      id: 'card-2',
      title: 'Map launch checklist',
      details: 'Capture the MVP release steps, owners, and acceptance criteria for handoff.',
      columnId: 'column-2',
      order: 0,
    },
    {
      id: 'card-3',
      title: 'Build drag interactions',
      details: 'Polish card motion and drop feedback so moving work feels deliberate and fast.',
      columnId: 'column-3',
      order: 0,
    },
    {
      id: 'card-4',
      title: 'Review copy tone',
      details: 'Check labels and helper text so the board stays concise and consistent.',
      columnId: 'column-4',
      order: 0,
    },
    {
      id: 'card-5',
      title: 'Prepare stakeholder demo',
      details: 'Seed the board with realistic sample work for the initial walkthrough.',
      columnId: 'column-5',
      order: 0,
    },
  ],
};

function normalizeColumnCards(cards: Card[], columnId: string): Card[] {
  return cards
    .filter((card) => card.columnId === columnId)
    .sort((left, right) => left.order - right.order)
    .map((card, index) => ({ ...card, order: index }));
}

function mergeColumns(baseCards: Card[], updates: Card[][]): Card[] {
  const updatedColumnIds = new Set(updates.flat().map((card) => card.columnId));
  const untouched = baseCards.filter((card) => !updatedColumnIds.has(card.columnId));

  return [...untouched, ...updates.flat()].sort((left, right) => {
    if (left.columnId === right.columnId) {
      return left.order - right.order;
    }

    return left.columnId.localeCompare(right.columnId);
  });
}

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case 'ADD_CARD': {
      const cardsInColumn = normalizeColumnCards(state.cards, action.payload.columnId);
      const newCard: Card = {
        id: generateId('card'),
        title: action.payload.title.trim(),
        details: action.payload.details.trim(),
        columnId: action.payload.columnId,
        order: cardsInColumn.length,
      };

      return {
        ...state,
        cards: [...state.cards, newCard],
      };
    }

    case 'DELETE_CARD': {
      const cardToDelete = state.cards.find((card) => card.id === action.payload.cardId);
      if (!cardToDelete) {
        return state;
      }

      const remainingCards = state.cards.filter((card) => card.id !== action.payload.cardId);

      return {
        ...state,
        cards: mergeColumns(remainingCards, [normalizeColumnCards(remainingCards, cardToDelete.columnId)]),
      };
    }

    case 'MOVE_CARD': {
      const cardToMove = state.cards.find((card) => card.id === action.payload.cardId);
      if (!cardToMove) {
        return state;
      }

      const targetColumnId = action.payload.targetColumnId;
      const sourceColumnId = cardToMove.columnId;
      const remainingCards = state.cards.filter((card) => card.id !== action.payload.cardId);
      const sourceCards = normalizeColumnCards(remainingCards, sourceColumnId);
      const targetCardsBase =
        sourceColumnId === targetColumnId
          ? sourceCards
          : normalizeColumnCards(remainingCards, targetColumnId);

      const boundedIndex = Math.max(0, Math.min(action.payload.targetIndex, targetCardsBase.length));
      const movedCard: Card = {
        ...cardToMove,
        columnId: targetColumnId,
        order: boundedIndex,
      };
      const targetCards = [
        ...targetCardsBase.slice(0, boundedIndex),
        movedCard,
        ...targetCardsBase.slice(boundedIndex),
      ].map((card, index) => ({
        ...card,
        order: index,
      }));

      const columnsToUpdate =
        sourceColumnId === targetColumnId ? [targetCards] : [sourceCards, targetCards];

      return {
        ...state,
        cards: mergeColumns(remainingCards, columnsToUpdate),
      };
    }

    case 'RENAME_COLUMN': {
      return {
        ...state,
        columns: state.columns.map((column) =>
          column.id === action.payload.columnId
            ? { ...column, title: action.payload.title.trim() || column.title }
            : column
        ),
      };
    }

    case 'EDIT_CARD': {
      return {
        ...state,
        cards: state.cards.map((card) =>
          card.id === action.payload.cardId
            ? { ...card, title: action.payload.title.trim(), details: action.payload.details.trim() }
            : card
        ),
      };
    }

    case 'DELETE_COLUMN': {
      const { columnId } = action.payload;
      return {
        ...state,
        columns: state.columns.filter((column) => column.id !== columnId),
        cards: state.cards.filter((card) => card.columnId !== columnId),
      };
    }

    default: {
      return state;
    }
  }
}

const BoardContext = createContext<{
  state: BoardState;
  dispatch: React.Dispatch<BoardAction>;
} | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { state: authState } = useAuth();
  const { activeOwner } = useActiveBoard();

  // Determine which board owner to use: active (shared) if set, otherwise own user
  const boardOwner = activeOwner || authState.user?.username || null;
  const storageKey = useMemo(() => {
    if (boardOwner) {
      return `kanban-board-${boardOwner}`;
    }
    return 'kanban-board';
  }, [boardOwner]);

  const [state, setState] = useLocalStorage<BoardState>(storageKey, initialState);

  const dispatch = React.useCallback(
    (action: BoardAction) => {
      setState((currentState) => boardReducer(currentState, action));
    },
    [setState]
  );

  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>;
}

export function useBoard() {
  const context = useContext(BoardContext);

  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }

  return context;
}

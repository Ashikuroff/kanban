'use client';

import { useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';
import { useBoard } from '../lib/store';
import { UserMenu } from './UserMenu';

export function KanbanBoard() {
  const { state, dispatch } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const sortedColumns = [...state.columns].sort((left, right) => left.order - right.order);
  const activeCard = activeCardId
    ? state.cards.find((card) => card.id === activeCardId) ?? null
    : null;

  const getColumnCards = (columnId: string) =>
    state.cards
      .filter((card) => card.columnId === columnId)
      .sort((left, right) => left.order - right.order);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveCardId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveCardId(null);

    const { active, over } = event;
    if (!over) {
      return;
    }

    const activeCardId = String(active.id);
    const activeCard = state.cards.find((card) => card.id === activeCardId);
    if (!activeCard) {
      return;
    }

    const overData = over.data.current as
      | { type: 'card'; cardId: string; columnId: string }
      | { type: 'column'; columnId: string }
      | undefined;

    if (!overData) {
      return;
    }

    if (overData.type === 'column') {
      dispatch({
        type: 'MOVE_CARD',
        payload: {
          cardId: activeCardId,
          targetColumnId: overData.columnId,
          targetIndex: getColumnCards(overData.columnId).length,
        },
      });
      return;
    }

    const targetColumnCards = getColumnCards(overData.columnId);
    const overIndex = targetColumnCards.findIndex((card) => card.id === overData.cardId);
    if (overIndex === -1) {
      return;
    }

    const sameCard = activeCardId === overData.cardId;
    if (sameCard) {
      return;
    }

    dispatch({
      type: 'MOVE_CARD',
      payload: {
        cardId: activeCardId,
        targetColumnId: overData.columnId,
        targetIndex: overIndex,
      },
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="mx-auto max-w-[1680px] px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-white/60 bg-[linear-gradient(135deg,rgba(3,33,71,0.96),rgba(32,157,215,0.88))] p-6 text-white shadow-[0_30px_80px_rgba(3,33,71,0.28)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#ecad0a]">Single Board MVP</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-5xl">
                A focused Kanban board with no extra workflow noise.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                Rename columns, add cards, remove what no longer matters, and move work across a clean
                five-stage flow.
              </p>
            </div>
            <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-end sm:gap-6">
              <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3 sm:gap-3">
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-2xl font-semibold">{state.columns.length}</div>
                  <div className="text-white/70">Fixed lanes</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3">
                  <div className="text-2xl font-semibold">{state.cards.length}</div>
                  <div className="text-white/70">Open cards</div>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-semibold">Live</div>
                  <div className="text-white/70">Client-side only</div>
                </div>
              </div>
              <div className="text-sm">
                <UserMenu />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-5">
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              cards={getColumnCards(column.id)}
              onAddCard={(title, details) =>
                dispatch({
                  type: 'ADD_CARD',
                  payload: {
                    columnId: column.id,
                    title,
                    details,
                  },
                })
              }
              onDeleteCard={(cardId) =>
                dispatch({
                  type: 'DELETE_CARD',
                  payload: {
                    cardId,
                  },
                })
              }
              onEditCard={(cardId, title, details) =>
                dispatch({
                  type: 'EDIT_CARD',
                  payload: {
                    cardId,
                    title,
                    details,
                  },
                })
              }
              onDeleteColumn={(columnId) =>
                dispatch({
                  type: 'DELETE_COLUMN',
                  payload: {
                    columnId,
                  },
                })
              }
              onRenameColumn={(title) =>
                dispatch({
                  type: 'RENAME_COLUMN',
                  payload: {
                    columnId: column.id,
                    title,
                  },
                })
              }
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeCard ? <Card card={activeCard} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

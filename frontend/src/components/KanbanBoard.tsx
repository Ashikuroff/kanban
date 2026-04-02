'use client';

import { useBoard } from '../lib/store.tsx';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Column } from './Column';
import { Card } from './Card';

export default function KanbanBoard() {
  const { state, dispatch } = useBoard();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    // For now, we don't need to track active card during drag
    // This will be enhanced in Phase 2 with drag and drop
  };

  const handleDragOver = (event: DragOverEvent) => {
    // handleDragOver can be used for visual feedback during drag
    // but the actual move logic will be in handleDragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if we're dropping on a column
    const isOverColumn = state.columns.some(col => col.id === overId);
    const isOverCard = state.cards.some(card => card.id === overId);

    if (isOverColumn) {
      // Dropping on a column - move to the end of that column
      const targetColumnId = overId;
      const cardsInTargetColumn = state.cards.filter(card => card.columnId === targetColumnId);
      const newIndex = cardsInTargetColumn.length;

      dispatch({
        type: 'MOVE_CARD',
        payload: { cardId: activeId, newColumnId: targetColumnId, newIndex }
      });
    } else if (isOverCard) {
      // Dropping on a card - insert at that position
      const overCard = state.cards.find(card => card.id === overId);
      if (!overCard) return;

      const targetColumnId = overCard.columnId;
      const cardsInTargetColumn = state.cards.filter(card => card.columnId === targetColumnId);
      const overIndex = cardsInTargetColumn.findIndex(card => card.id === overId);

      dispatch({
        type: 'MOVE_CARD',
        payload: { cardId: activeId, newColumnId: targetColumnId, newIndex: overIndex }
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        <h1 className="text-2xl font-bold text-dark-navy mb-4">Kanban Board</h1>
        <div className="grid gap-4 md:grid-cols-5">
          {state.columns.map(column => (
            <Column
              key={column.id}
              column={column}
              cards={state.cards.filter(card => card.columnId === column.id)}
              onAddCard={(title, details) => dispatch({ type: 'ADD_CARD', payload: { title, details, columnId: column.id } })}
              onDeleteCard={(cardId) => dispatch({ type: 'DELETE_CARD', payload: cardId })}
            />
          ))}
        </div>
      </div>
    </DndContext>
  );
}
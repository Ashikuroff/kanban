'use client';

import { useBoard } from '../lib/store';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { Column } from './Column';
import { Card } from './Card';

export default function KanbanBoard() {
  const { state, dispatch } = useBoard();

  const handleDragStart = (event: DragStartEvent) => {
    // For now, we don't need to track active card during drag
    // This will be enhanced in Phase 2 with drag and drop
  };

  const handleDragOver = (event: DragOverEvent) => {
    // handleDragOver can be used for visual feedback during drag
    // but the actual move logic will be in handleDragEnd
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // For now, we don't implement drag and drop functionality
    // This will be implemented in Phase 2
  };

  return (
    <DndContext
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
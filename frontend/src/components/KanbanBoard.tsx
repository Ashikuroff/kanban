'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Modal } from './Modal';
import { Column } from './Column';
import { Card } from './Card';
import { Column as ColumnType, Card as CardType } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

const initialColumns: ColumnType[] = [
  {
    id: '1',
    name: 'To Do',
    cards: [
      { id: '1-1', title: 'Design UI', details: 'Create wireframes for the new feature' },
      { id: '1-2', title: 'Write tests', details: 'Unit tests for the API endpoints' },
    ],
  },
  {
    id: '2',
    name: 'In Progress',
    cards: [
      { id: '2-1', title: 'Implement login', details: 'Add authentication to the app' },
    ],
  },
  {
    id: '3',
    name: 'Review',
    cards: [
      { id: '3-1', title: 'Code review', details: 'Review pull request #42' },
    ],
  },
  {
    id: '4',
    name: 'Testing',
    cards: [],
  },
  {
    id: '5',
    name: 'Done',
    cards: [
      { id: '5-1', title: 'Setup project', details: 'Initialize the repository and CI/CD', completed: true },
    ],
  },
];

export default function KanbanBoard() {
  const [columns, setColumns] = useLocalStorage<ColumnType[]>('kanban-columns', initialColumns);
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDetails, setNewCardDetails] = useState('');
  const [renamingColumn, setRenamingColumn] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = findCard(active.id as string);
    setActiveCard(card ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveACard = findCard(activeId);
    const isOverACard = findCard(overId);

    if (!isActiveACard) return;

    // Dropping a card over another card
    if (isActiveACard && isOverACard) {
      setColumns((columns) => {
        const activeColumn = findColumn(isActiveACard);
        const overColumn = findColumn(isOverACard);

        if (!activeColumn || !overColumn) return columns;

        if (activeColumn.id !== overColumn.id) {
          // Move card to different column
          const activeCards = activeColumn.cards.filter((card) => card.id !== activeId);
          const overCards = overColumn.cards.filter((card) => card.id !== overId);

          const overIndex = overCards.findIndex((card) => card.id === overId);
          overCards.splice(overIndex, 0, isActiveACard);

          return columns.map((column) => {
            if (column.id === activeColumn.id) {
              return { ...column, cards: activeCards };
            }
            if (column.id === overColumn.id) {
              return { ...column, cards: overCards };
            }
            return column;
          });
        } else {
          // Reorder within same column
          const cards = activeColumn.cards;
          const oldIndex = cards.findIndex((card) => card.id === activeId);
          const newIndex = cards.findIndex((card) => card.id === overId);

          const newCards = [...cards];
          newCards.splice(oldIndex, 1);
          newCards.splice(newIndex, 0, isActiveACard);

          return columns.map((column) =>
            column.id === activeColumn.id ? { ...column, cards: newCards } : column
          );
        }
      });
    }

    // Dropping a card over a column
    const isOverAColumn = findColumnById(overId);
    if (isActiveACard && isOverAColumn) {
      setColumns((columns) => {
        const activeColumn = findColumn(isActiveACard);
        if (!activeColumn) return columns;

        if (activeColumn.id === isOverAColumn.id) return columns;

        const activeCards = activeColumn.cards.filter((card) => card.id !== activeId);
        const overCards = [...isOverAColumn.cards, isActiveACard];

        return columns.map((column) => {
          if (column.id === activeColumn.id) {
            return { ...column, cards: activeCards };
          }
          if (column.id === isOverAColumn.id) {
            return { ...column, cards: overCards };
          }
          return column;
        });
      });
    }
  };

  const handleDragEnd = () => {
    setActiveCard(null);
  };

  const findCard = (id: string): CardType | undefined => {
    for (const column of columns) {
      const card = column.cards.find((card) => card.id === id);
      if (card) return card;
    }
  };

  const findColumn = (card: CardType): ColumnType | undefined => {
    return columns.find((column) => column.cards.some((c) => c.id === card.id));
  };

  const findColumnById = (id: string): ColumnType | undefined => {
    return columns.find((column) => column.id === id);
  };

  const addCard = (columnId: string) => {
    setAddingToColumn(columnId);
    setNewCardTitle('');
    setNewCardDetails('');
  };

  const deleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      setColumns((columns) =>
        columns.map((column) => ({
          ...column,
          cards: column.cards.filter((card) => card.id !== cardId),
        }))
      );
    }
  };

  const renameColumn = (columnId: string) => {
    const column = columns.find(c => c.id === columnId);
    if (column) {
      setRenamingColumn(columnId);
      setNewColumnName(column.name);
    }
  };

  const startEditCard = (card: CardType) => {
    setEditingCard(card);
    setEditTitle(card.title);
    setEditDetails(card.details);
  };

  const saveEditCard = () => {
    if (!editingCard) return;
    setColumns((columns) =>
      columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === editingCard.id
            ? { ...card, title: editTitle, details: editDetails }
            : card
        ),
      }))
    );
    setEditingCard(null);
  };

  const cancelEditCard = () => {
    setEditingCard(null);
  };

  const saveNewCard = () => {
    if (!addingToColumn || !newCardTitle.trim()) return;
    const newCard: CardType = {
      id: `${addingToColumn}-${Date.now()}`,
      title: newCardTitle.trim(),
      details: newCardDetails.trim(),
    };
    setColumns((columns) =>
      columns.map((column) =>
        column.id === addingToColumn
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      )
    );
    setAddingToColumn(null);
  };

  const cancelNewCard = () => {
    setAddingToColumn(null);
  };

  const saveRenameColumn = () => {
    if (!renamingColumn || !newColumnName.trim()) return;
    setColumns((columns) =>
      columns.map((column) =>
        column.id === renamingColumn ? { ...column, name: newColumnName.trim() } : column
      )
    );
    setRenamingColumn(null);
  };

  const cancelRenameColumn = () => {
    setRenamingColumn(null);
  };

  const toggleCardCompleted = (cardId: string) => {
    setColumns((columns) =>
      columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId ? { ...card, completed: !card.completed } : card
        ),
      }))
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 bg-gray-100 min-h-screen">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onRenameColumn={renameColumn}
            onEditCard={startEditCard}
            onToggleCompleted={toggleCardCompleted}
          />
        ))}
      </div>
      <DragOverlay>
        {activeCard ? <Card card={activeCard} /> : null}
      </DragOverlay>
      <Modal isOpen={!!editingCard} onClose={cancelEditCard}>
        <h2 className="text-lg font-semibold mb-4">Edit Card</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            value={editDetails}
            onChange={(e) => setEditDetails(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={cancelEditCard}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveEditCard}
            className="px-4 py-2 bg-purple-secondary text-white rounded hover:bg-opacity-80"
          >
            Save
          </button>
        </div>
      </Modal>
      <Modal isOpen={!!addingToColumn} onClose={cancelNewCard}>
        <h2 className="text-lg font-semibold mb-4">Add New Card</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter card title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Details</label>
          <textarea
            value={newCardDetails}
            onChange={(e) => setNewCardDetails(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24"
            placeholder="Enter card details"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={cancelNewCard}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveNewCard}
            className="px-4 py-2 bg-purple-secondary text-white rounded hover:bg-opacity-80"
          >
            Add Card
          </button>
        </div>
      </Modal>
      <Modal isOpen={!!renamingColumn} onClose={cancelRenameColumn}>
        <h2 className="text-lg font-semibold mb-4">Rename Column</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Column Name</label>
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter column name"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={cancelRenameColumn}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={saveRenameColumn}
            className="px-4 py-2 bg-purple-secondary text-white rounded hover:bg-opacity-80"
          >
            Rename
          </button>
        </div>
      </Modal>
    </DndContext>
  );
}
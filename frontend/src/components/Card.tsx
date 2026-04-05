'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../types';
import { Modal } from './Modal';

interface CardProps {
  card: CardType;
  onDeleteCard?: (cardId: string) => void;
  onEditCard?: (cardId: string, title: string, details: string) => void;
  isOverlay?: boolean;
}

export function Card({ card, onDeleteCard, onEditCard, isOverlay = false }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId: card.columnId,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <article
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={`rounded-3xl border border-white/70 bg-white px-4 py-4 shadow-[0_18px_45px_rgba(3,33,71,0.12)] transition ${
        isDragging ? 'opacity-40' : 'opacity-100'
      } ${isOverlay ? 'rotate-1 shadow-[0_28px_60px_rgba(3,33,71,0.22)]' : ''}`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border border-[#d7dfeb] bg-[#f4f7fb] text-lg text-[#032147] transition hover:border-[#209dd7] hover:bg-white"
          aria-label={`Drag card ${card.title}`}
          {...attributes}
          {...listeners}
        >
          <span aria-hidden="true">⋮⋮</span>
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold tracking-[0.01em] text-[#032147]">{card.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#5b6881]">{card.details}</p>
        </div>
        {onEditCard ? (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#888888] transition hover:bg-[#f4f7fb] hover:text-[#032147]"
            aria-label={`Edit card ${card.title}`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        ) : null}
        {onDeleteCard ? (
          <button
            type="button"
            onClick={() => onDeleteCard(card.id)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#888888] transition hover:bg-[#fff5d8] hover:text-[#032147]"
            aria-label={`Delete card ${card.title}`}
          >
            <span aria-hidden="true">×</span>
          </button>
        ) : null}
      </div>
    </article>

      {isEditing && (
        <EditCardModal
        card={card}
        onClose={() => setIsEditing(false)}
        onSave={(title, details) => {
          onEditCard?.(card.id, title, details);
          setIsEditing(false);
        }}
      />
      )}
    </>
  );
}

function EditCardModal({
  card,
  onClose,
  onSave,
}: {
  card: CardType;
  onClose: () => void;
  onSave: (title: string, details: string) => void;
}) {
  const [title, setTitle] = useState(card.title);
  const [details, setDetails] = useState(card.details);

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), details.trim());
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Card">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="edit-card-title" className="mb-1 block text-sm font-medium text-[#032147]">
            Title
          </label>
          <input
            id="edit-card-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-[#d7dfeb] bg-white px-3 py-2 text-sm text-[#032147] outline-none focus:border-[#209dd7]"
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="edit-card-details" className="mb-1 block text-sm font-medium text-[#032147]">
            Details
          </label>
          <textarea
            id="edit-card-details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-[#d7dfeb] bg-white px-3 py-2 text-sm text-[#032147] outline-none focus:border-[#209dd7]"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d7dfeb] px-4 py-2 text-sm text-[#032147]/70 hover:bg-[#d7dfeb]/20"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-xl bg-[#209dd7] px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}

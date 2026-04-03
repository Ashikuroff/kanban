'use client';

import { useState } from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Card as CardType, Column as ColumnType } from '../types';
import { Card } from './Card';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (title: string, details: string) => void;
  onDeleteCard: (cardId: string) => void;
  onRenameColumn: (title: string) => void;
}

export function Column({
  column,
  cards,
  onAddCard,
  onDeleteCard,
  onRenameColumn,
}: ColumnProps) {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTitle = title.trim();
    const nextDetails = details.trim();
    if (!nextTitle || !nextDetails) {
      return;
    }

    onAddCard(nextTitle, nextDetails);
    setTitle('');
    setDetails('');
    setIsComposerOpen(false);
  };

  const commitColumnTitle = (rawTitle: string, reset: () => void) => {
    const nextTitle = rawTitle.trim();
    if (!nextTitle) {
      reset();
      return;
    }

    if (nextTitle !== column.title) {
      onRenameColumn(nextTitle);
    }
  };

  return (
    <section className="flex min-h-[620px] flex-col rounded-[2rem] border border-white/70 bg-white/78 p-4 shadow-[0_22px_55px_rgba(3,33,71,0.14)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <label htmlFor={`column-title-${column.id}`} className="sr-only">
            Column title
          </label>
          <input
            key={column.title}
            id={`column-title-${column.id}`}
            defaultValue={column.title}
            onBlur={(event) =>
              commitColumnTitle(event.currentTarget.value, () => {
                event.currentTarget.value = column.title;
              })
            }
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commitColumnTitle(event.currentTarget.value, () => {
                  event.currentTarget.value = column.title;
                });
                event.currentTarget.blur();
              }
            }}
            className="w-full rounded-2xl border border-transparent bg-transparent px-2 py-1 text-base font-semibold tracking-[0.01em] text-[#032147] outline-none transition focus:border-[#209dd7] focus:bg-white"
            aria-label={`${column.title} column title`}
          />
          <p className="px-2 pt-1 text-xs uppercase tracking-[0.22em] text-[#888888]">
            {cards.length} {cards.length === 1 ? 'card' : 'cards'}
          </p>
        </div>
        <div className="h-10 w-2 rounded-full bg-[#ecad0a]" aria-hidden="true" />
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-[1.5rem] border border-dashed p-3 transition ${
          isOver
            ? 'border-[#209dd7] bg-[#eef8ff]'
            : 'border-[#d7dfeb] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,247,251,0.95))]'
        }`}
      >
        <SortableContext items={cards.map((card) => card.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {cards.map((card) => (
              <Card key={card.id} card={card} onDeleteCard={onDeleteCard} />
            ))}
          </div>
        </SortableContext>

        {!cards.length ? (
          <div className="flex min-h-32 items-center justify-center rounded-[1.25rem] border border-dashed border-[#d7dfeb] bg-white/80 px-4 text-center text-sm leading-6 text-[#888888]">
            Drop a card here or add one below.
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        {isComposerOpen ? (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-[1.5rem] bg-[#f4f7fb] p-3">
            <div>
              <label htmlFor={`card-title-${column.id}`} className="sr-only">
                Card title
              </label>
              <input
                id={`card-title-${column.id}`}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Card title"
                className="w-full rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm text-[#032147] outline-none transition focus:border-[#209dd7]"
              />
            </div>
            <div>
              <label htmlFor={`card-details-${column.id}`} className="sr-only">
                Card details
              </label>
              <textarea
                id={`card-details-${column.id}`}
                value={details}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="Details"
                rows={4}
                className="w-full resize-none rounded-2xl border border-[#d7dfeb] bg-white px-4 py-3 text-sm leading-6 text-[#032147] outline-none transition focus:border-[#209dd7]"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-[#753991] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Save card
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsComposerOpen(false);
                  setTitle('');
                  setDetails('');
                }}
                className="rounded-2xl border border-[#d7dfeb] px-4 py-3 text-sm font-medium text-[#032147] transition hover:border-[#209dd7] hover:bg-white"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setIsComposerOpen(true)}
            className="w-full rounded-[1.5rem] border border-[#d7dfeb] bg-white px-4 py-3 text-sm font-medium text-[#032147] transition hover:border-[#209dd7] hover:bg-[#eef8ff]"
          >
            Add card
          </button>
        )}
      </div>
    </section>
  );
}

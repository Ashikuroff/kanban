'use client';

import { useState } from 'react';

interface AddCardFormProps {
  onAddCard: (title: string, details: string) => void;
}

export function AddCardForm({ onAddCard }: AddCardFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() !== '' && details.trim() !== '') {
      onAddCard(title.trim(), details.trim());
      setTitle('');
      setDetails('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:border-purple-secondary focus:outline-none"
          placeholder="Enter card title"
        />
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Details</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 focus:border-purple-secondary focus:outline-none"
          placeholder="Enter card details"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-purple-secondary text-white px-4 py-2 rounded text-sm hover:bg-opacity-80"
      >
        Add Card
      </button>
    </form>
  );
}

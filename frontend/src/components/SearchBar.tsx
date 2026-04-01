'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search cards...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-secondary"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-purple-secondary text-white rounded hover:bg-opacity-80 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
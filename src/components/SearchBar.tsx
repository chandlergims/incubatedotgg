'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchQuery: string;
  placeholder?: string;
}

export default function SearchBar({ onSearch, searchQuery, placeholder = "search" }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const router = useRouter();

  // Function to check if a string looks like a Solana mint address
  const isMintAddress = (query: string): boolean => {
    // Solana addresses are typically 32-44 characters long and contain only base58 characters
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
    return base58Regex.test(query.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = localQuery.trim();
    
    if (!trimmedQuery) return;
    
    // Always filter the home page first
    onSearch(trimmedQuery);
    
    // If it looks like a mint address, also navigate to the token page
    if (isMintAddress(trimmedQuery)) {
      router.push(`/coin/${trimmedQuery}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    
    // Real-time filtering as user types
    onSearch(value);
  };

  return (
    <div className="flex justify-center mb-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-0 max-w-md w-full">
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-l-full border-0 focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="px-8 py-3 bg-black text-white rounded-r-full hover:bg-gray-800 transition-colors font-medium"
        >
          search
        </button>
      </form>
    </div>
  );
}

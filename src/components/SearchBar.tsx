import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  owner: string;
  repo: string;
  selectedReviewer: string;
  setOwner: (value: string) => void;
  setRepo: (value: string) => void;
  setSelectedReviewer: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const reviewers = [
  'Habeeb', 'Jeff', 'Raghu', 'Praveen', 'Salman', 'Nithish', 
  'Soundarya', 'Vishnu', 'Nafil', 'Nithya', 'Pradha'
];

export function SearchBar({ 
  owner, 
  repo, 
  selectedReviewer,
  setOwner, 
  setRepo, 
  setSelectedReviewer,
  onSearch, 
  isLoading 
}: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex gap-4 p-4 bg-white rounded-lg shadow-lg">
        <div className="flex-1">
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Repository Owner (e.g., facebook)"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="Repository Name (e.g., react)"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            required
          />
        </div>
        <div className="flex-1">
          <select
            value={selectedReviewer}
            onChange={(e) => setSelectedReviewer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">All Reviewers</option>
            {reviewers.map((reviewer) => (
              <option key={reviewer} value={reviewer}>
                {reviewer}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>
    </form>
  );
}
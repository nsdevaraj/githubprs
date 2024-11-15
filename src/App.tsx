import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { PRList } from './components/PRList';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GithubIcon } from 'lucide-react';
import { GitHubService } from './services/github';
import type { PullRequest } from './types';

function App() {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPRs = async () => {
    setIsLoading(true);
    setError('');
    setPRs([]);
    const token: string = process.env.GITHUB_TOKEN as string;
    try {
      const data =await GitHubService.fetchPRs(owner, repo, token); 
      setPRs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <GithubIcon className="w-8 h-8" />
            <h1 className="text-2xl font-bold text-gray-900">GitHub PR Explorer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchBar
          owner={owner}
          repo={repo}
          setOwner={setOwner}
          setRepo={setRepo}
          onSearch={fetchPRs}
          isLoading={isLoading}
        />

        {error && <ErrorMessage message={error} />}
        
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          prs.length > 0 && <PRList pullRequests={prs} />
        )}

        {!isLoading && !error && prs.length === 0 && owner && repo && (
          <div className="text-center mt-8 text-gray-600">
            No open pull requests found
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
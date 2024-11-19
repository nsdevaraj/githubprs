import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { PRList } from './components/PRList';
import { ErrorMessage } from './components/ErrorMessage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { GithubIcon } from 'lucide-react';
import { GitHubService } from './services/github';
import type { PullRequest } from './types';

function App() {
  const [owner, setOwner] = useState('visualbis');
  const [repo, setRepo] = useState('ibcslibrary');
  const [prs, setPRs] = useState<PullRequest[]>([]);
  const [filteredPRs, setFilteredPRs] = useState<PullRequest[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState('');
  const [baseBranch, setBaseBranch] = useState('');
  const [prAuthor, setPrAuthor] = useState('');
  const [reviewerAssignments, setReviewerAssignments] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPRs = async () => {
    setIsLoading(true);
    setError('');
    setPRs([]);
    setFilteredPRs([]);
    const token: string = import.meta.env.VITE_GITHUB_TOKEN as string;
    try {
      const data = await GitHubService.fetchPRs(owner, repo, token);
      setPRs(data);
      setFilteredPRs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewerAssignment = (prNumber: number, reviewer: string) => {
    setReviewerAssignments(prev => ({
      ...prev,
      [prNumber]: reviewer
    }));
  };

  useEffect(() => {
    if (selectedReviewer && prs.length > 0) {
      const filtered = prs.filter(pr => {
        const assignedReviewer = reviewerAssignments[pr.number] || '';
        if (selectedReviewer === 'unassigned') {
          return assignedReviewer === '';
        }
        return assignedReviewer === selectedReviewer;
      });
      setFilteredPRs(filtered);
    } else {
      setFilteredPRs(prs);
    }
  }, [selectedReviewer, prs, reviewerAssignments]);

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
          selectedReviewer={selectedReviewer}
          baseBranch={baseBranch}
          prAuthor={prAuthor}
          setOwner={setOwner}
          setRepo={setRepo}
          setSelectedReviewer={setSelectedReviewer}
          setBaseBranch={setBaseBranch}
          setPrAuthor={setPrAuthor}
          onSearch={fetchPRs}
          isLoading={isLoading}
        />

        {error && <ErrorMessage message={error} />}

        {!isLoading && prs.length > 0 && (
          <div className="mt-4 text-gray-600">
            Found {filteredPRs.length} {selectedReviewer ? `PR${filteredPRs.length !== 1 ? 's' : ''} ${selectedReviewer === 'unassigned' ? 'unassigned' : `assigned to ${selectedReviewer}`}` : `PR${prs.length !== 1 ? 's' : ''} total`}
          </div>
        )}

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          filteredPRs.length > 0 && (
            <PRList 
              pullRequests={filteredPRs}
              reviewerAssignments={reviewerAssignments}
              onReviewerAssignment={handleReviewerAssignment}
            />
          )
        )}

        {!isLoading && !error && filteredPRs.length === 0 && owner && repo && (
          <div className="text-center mt-8 text-gray-600">
            {prs.length > 0 ? 'No pull requests found with selected reviewer' : 'No open pull requests found'}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
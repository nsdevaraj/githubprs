import { ExternalLink, GitPullRequest, Clock, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { PullRequest } from '../types';
import { saveReviewerAssignment, getAllReviewerAssignments } from '../utils/kv-store';

interface PRListProps {
  pullRequests: PullRequest[];
  reviewerAssignments: Record<number, string>;
  onReviewerAssignment: (prNumber: number, reviewer: string) => void;
}

const reviewers = [
  'Habeeb', 'Jeff', 'Raghu', 'Praveen', 'Salman', 'Nithish', 
  'Soundarya', 'Vishnu', 'Nafil', 'Nithya', 'Pradha'
];

export function PRList({ pullRequests, reviewerAssignments, onReviewerAssignment }: PRListProps) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      const loadStoredAssignments = async () => {
        const stored = await getAllReviewerAssignments();
        console.log('Loaded stored assignments:', stored);
        Object.entries(stored).forEach(([prNumber, reviewer]) => {
          onReviewerAssignment(Number(prNumber), reviewer);
        });
      };
      loadStoredAssignments();
      mounted.current = true;
    }
  }, []);

  const handleReviewerChange = async (prNumber: number, reviewer: string) => {
    console.log(`Attempting to save reviewer ${reviewer} for PR ${prNumber}`);
    const saved = await saveReviewerAssignment(prNumber, reviewer);
    if (saved) {
      console.log('Successfully saved, updating UI');
      onReviewerAssignment(prNumber, reviewer);
    } else {
      console.error('Failed to save reviewer assignment');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="mt-8 space-y-4">
      {pullRequests.map((pr) => (
        <div
          key={pr.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={pr.user.avatar_url}
                    alt={pr.user.login}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    <a
                      href={pr.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 flex items-center gap-2"
                    >
                      {pr.title}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <GitPullRequest className="w-4 h-4 mr-1" />
                      #{pr.number}
                    </span>
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {pr.user.login}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Created {formatDate(pr.created_at) + ' Branch ' + pr.base.ref}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                {pr.labels.map((label) => (
                  <span
                    key={label.name}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `#${label.color}`,
                      color: parseInt(label.color, 16) > 0xffffff / 2 ? '#000' : '#fff',
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={reviewerAssignments[pr.number] || ''}
                onChange={(e) => handleReviewerChange(pr.number, e.target.value)}
                className="mt-2 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="">Select Reviewer</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer} value={reviewer}>
                    {reviewer}
                  </option>
                ))}
              </select>
              <div className="flex space-x-2">
                {pr.labels.map((label) => (
                  <span
                    key={label.name}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      backgroundColor: `#${label.color}`,
                      color: parseInt(label.color, 16) > 0xffffff / 2 ? '#000' : '#fff',
                    }}
                  >
                    {label.name}
                  </span>
                ))}
              </div>
            </div>
            {pr.body && (
              <div className="mt-4 text-gray-600 text-sm line-clamp-3">
                {pr.body}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
import { ExternalLink, GitPullRequest, Clock, User, FileDown, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { PullRequest } from '../types';
import { saveReviewerAssignment, getAllReviewerAssignments } from '../utils/kv-store';
import html2pdf from 'html2pdf.js';

interface PRListProps {
  pullRequests: PullRequest[];
  reviewerAssignments: Record<number, string>;
  onReviewerAssignment: (prNumber: number, reviewer: string) => void;
  baseBranch: string;
  prAuthor: string;
}

const reviewers = [
  'Habeeb', 'Jeff', 'Raghu', 'Praveen', 'Salman', 'Nithish',
  'Soundarya', 'Vishnu', 'Nafil', 'Nithya', 'Pradha', 'Amit', 'Aiswarya', 'Shoaib'
];

export function PRList({ pullRequests, reviewerAssignments, onReviewerAssignment, baseBranch, prAuthor }: PRListProps) {
  const mounted = useRef(false);
  const prListRef = useRef<HTMLDivElement>(null);
  const [isLoadingKV, setIsLoadingKV] = useState(true);

  useEffect(() => {
    if (!mounted.current) {
      const loadStoredAssignments = async () => {
        try {
          const stored = await getAllReviewerAssignments();
          console.log('Loaded stored assignments:', stored);
          Object.entries(stored).forEach(([prNumber, reviewer]) => {
            onReviewerAssignment(Number(prNumber), reviewer);
          });
        } catch (error) {
          console.error('Error loading stored assignments:', error);
        } finally {
          setIsLoadingKV(false);
        }
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

  const filteredPullRequests = pullRequests.filter(pr => {
    const matchesBase = !baseBranch || pr.base.ref.toLowerCase().includes(baseBranch.toLowerCase());
    const matchesAuthor = !prAuthor || pr.user.login.toLowerCase().includes(prAuthor.toLowerCase());
    return matchesBase && matchesAuthor;
  });

  const handleExportPDF = async () => {
    if (!prListRef.current) return;

    const element = prListRef.current;
    const opt = {
      margin: 1,
      filename: 'Pending-PRs.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'in', 
        format: 'letter', 
        orientation: 'portrait' 
      }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Pull Requests</h2>
        <button
          onClick={handleExportPDF}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Export PDF
        </button>
      </div>
      {isLoadingKV ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading assignments...</span>
        </div>
      ) : (
        <div ref={prListRef} className="mt-8 space-y-4">
          {filteredPullRequests.map((pr) => (
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
      )}
    </div>
  );
}
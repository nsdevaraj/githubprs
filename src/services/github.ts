import type { PullRequest } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static async fetchFromGitHub<T>(endpoint: string, githubToken: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'Repository not found'
          : `GitHub API error: ${response.statusText}`
      );
    }

    return response.json();
  }

  static async fetchPRs(owner: string, repo: string, githubToken: string): Promise<PullRequest[]> {
    const pullRequests = await this.fetchFromGitHub<PullRequest[]>(`/repos/${owner}/${repo}/pulls?state=open&per_page=100`, githubToken);
    return pullRequests;
  }

  static async removeAssignment(owner: string, repo: string, prNumber: number, assignee: string, githubToken: string): Promise<void> {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${prNumber}/assignees`, {
      method: 'DELETE',
      headers: {
        Authorization: `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignees: [assignee]
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to remove assignment: ${response.statusText}`);
    }
  }
}
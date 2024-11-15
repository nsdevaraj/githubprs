import type { PullRequest } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export class GitHubService {
  private static async fetchFromGitHub<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'Repository not found'
          : `GitHub API error: ${response.statusText}`
      );
    }

    return response.json();
  }

  static async getOpenPullRequests(owner: string, repo: string): Promise<PullRequest[]> {
    return this.fetchFromGitHub<PullRequest[]>(`/repos/${owner}/${repo}/pulls?state=open`);
  }
}
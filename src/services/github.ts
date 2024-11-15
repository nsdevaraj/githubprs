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
    const pullRequests = await this.fetchFromGitHub<PullRequest[]>(`/repos/${owner}/${repo}/pulls`, githubToken);
    return pullRequests//.filter(pr => pr.base.ref === 'enterprise-donut');
  } 
}
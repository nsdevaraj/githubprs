export interface PullRequest {
  base: any;
  id: number;
  number: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  body: string;
  labels: Array<{
    name: string;
    color: string;
  }>;
}
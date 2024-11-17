import { createClient } from '@vercel/kv';
let process ={env: {KV_REST_API_URL: import.meta.env.KV_REST_API_URL!, KV_REST_API_TOKEN: import.meta.env.KV_REST_API_TOKEN!}};
const kv = createClient({
  url: process.env.KV_REST_API_URL || "https://prime-egret-21091.upstash.io",
  token: process.env.KV_REST_API_TOKEN || "AVJjAAIjcDE3NzBjMGI2MTdkNjc0OWQ2OTliZWY3M2VkNjZlNjNkN3AxMA",
});

export async function saveReviewerAssignment(prNumber: number, reviewer: string) {
  try {
    console.log(`Saving reviewer ${reviewer} for PR ${prNumber}`);
    const key = `pr:${prNumber}:reviewer`;
    await kv.set(key, reviewer);
    console.log('Successfully saved reviewer assignment');
    return true;
  } catch (error) {
    console.error('Error saving reviewer assignment:', error);
    return false;
  }
}

export async function getReviewerAssignment(prNumber: number): Promise<string | null> {
  try {
    const key = `pr:${prNumber}:reviewer`;
    const result = await kv.get(key);
    console.log(`Retrieved reviewer for PR ${prNumber}:`, result);
    return result as string | null;
  } catch (error) {
    console.error('Error getting reviewer assignment:', error);
    return null;
  }
}

export async function getAllReviewerAssignments(): Promise<Record<number, string>> {
  try {
    console.log('Fetching all reviewer assignments');
    const pattern = 'pr:*:reviewer';
    const keys = await kv.keys(pattern);
    console.log('Found keys:', keys);
    const assignments: Record<number, string> = {};
    
    for (const key of keys) {
      const prNumber = parseInt(key.split(':')[1]);
      const reviewer = await kv.get(key);
      if (reviewer) {
        assignments[prNumber] = reviewer as string;
      }
    }
    
    console.log('Retrieved assignments:', assignments);
    return assignments;
  } catch (error) {
    console.error('Error getting all reviewer assignments:', error);
    return {};
  }
}

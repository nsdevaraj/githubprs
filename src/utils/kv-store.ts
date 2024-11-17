import { kv } from '@vercel/kv';

export async function saveReviewerAssignment(prNumber: number, reviewer: string) {
  try {
    const key = `pr:${prNumber}:reviewer`;
    await kv.set(key, reviewer);
    return true;
  } catch (error) {
    console.error('Error saving reviewer assignment:', error);
    return false;
  }
}

export async function getReviewerAssignment(prNumber: number): Promise<string | null> {
  try {
    const key = `pr:${prNumber}:reviewer`;
    return await kv.get(key);
  } catch (error) {
    console.error('Error getting reviewer assignment:', error);
    return null;
  }
}

export async function getAllReviewerAssignments(): Promise<Record<number, string>> {
  try {
    const pattern = 'pr:*:reviewer';
    const keys = await kv.keys(pattern);
    const assignments: Record<number, string> = {};
    
    for (const key of keys) {
      const prNumber = parseInt(key.split(':')[1]);
      const reviewer = await kv.get(key);
      if (reviewer) {
        assignments[prNumber] = reviewer as string;
      }
    }
    
    return assignments;
  } catch (error) {
    console.error('Error getting all reviewer assignments:', error);
    return {};
  }
}

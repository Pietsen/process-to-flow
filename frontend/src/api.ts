import type { ProcessResult } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function generateProcess(description: string): Promise<ProcessResult> {
  const response = await fetch(`${API_BASE}/api/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || `Request failed (${response.status})`;
    try {
      const body = JSON.parse(text) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {
      // plain-text or Spring default error body
    }
    throw new Error(message);
  }

  return response.json() as Promise<ProcessResult>;
}

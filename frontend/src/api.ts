import type { ProcessResult } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export class ApiError extends Error {
  readonly code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
  }
}

export async function generateProcess(description: string): Promise<ProcessResult> {
  const response = await fetch(`${API_BASE}/api/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || `Request failed (${response.status})`;
    let code: string | undefined;
    try {
      const body = JSON.parse(text) as { message?: string; code?: string };
      if (body.message) {
        message = body.message;
      }
      code = body.code;
    } catch {
      // plain-text or Spring default error body
    }
    throw new ApiError(message, code);
  }

  return response.json() as Promise<ProcessResult>;
}

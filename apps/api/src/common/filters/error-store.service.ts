import { Injectable, Optional } from '@nestjs/common';

export interface StoredError {
  id: string;
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  message: string;
  stack?: string;
}

/**
 * In-memory circular buffer that stores the most recent N errors.
 * Used by AllExceptionsFilter to persist errors for the monitoring dashboard.
 */
@Injectable()
export class ErrorStoreService {
  private readonly maxErrors = 100;
  private errors: StoredError[] = [];

  push(error: Omit<StoredError, 'id'>): void {
    const entry: StoredError = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      ...error,
    };
    this.errors.unshift(entry);
    if (this.errors.length > this.maxErrors) {
      this.errors.length = this.maxErrors;
    }
  }

  getRecent(limit: number = 20): StoredError[] {
    return this.errors.slice(0, limit);
  }

  getStats(): { total: number; byStatus: Record<string, number> } {
    const byStatus: Record<string, number> = {};
    for (const err of this.errors) {
      const key = String(err.statusCode);
      byStatus[key] = (byStatus[key] || 0) + 1;
    }
    return { total: this.errors.length, byStatus };
  }

  clear(): void {
    this.errors = [];
  }
}

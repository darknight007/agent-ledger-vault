/**
 * Error Handling and Retry Logic
 * Provides robust error handling, retry mechanisms, and logging
 */

import { RetryPolicy } from './types';

/**
 * Custom error class for workflow errors
 */
export class WorkflowError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'WorkflowError';
  }
}

/**
 * Custom error class for agent errors
 */
export class AgentError extends WorkflowError {
  constructor(
    public agentName: string,
    message: string,
    details?: Record<string, any>
  ) {
    super('AGENT_ERROR', `Agent ${agentName} failed: ${message}`, details);
    this.name = 'AgentError';
  }
}

/**
 * Custom error class for validation errors
 */
export class ValidationError extends WorkflowError {
  constructor(message: string, details?: Record<string, any>) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

/**
 * Retry mechanism with exponential backoff
 */
export class RetryMechanism {
  /**
   * Executes a function with retry logic
   */
  static async executeWithRetry<T>(
    fn: () => Promise<T>,
    policy: RetryPolicy,
    context?: { operationName?: string; metadata?: Record<string, any> }
  ): Promise<T> {
    let lastError: Error | null = null;
    let delay = policy.initialDelayMs;

    for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt < policy.maxRetries) {
          // Log retry attempt
          console.warn(
            `Retry attempt ${attempt + 1}/${policy.maxRetries} for ${context?.operationName || 'operation'} after ${delay}ms`,
            { error: lastError.message, metadata: context?.metadata }
          );

          // Wait before retrying
          await this.delay(delay);

          // Calculate next delay with exponential backoff
          delay = Math.min(
            delay * policy.backoffMultiplier,
            policy.maxDelayMs
          );
        }
      }
    }

    throw new WorkflowError(
      'MAX_RETRIES_EXCEEDED',
      `Operation failed after ${policy.maxRetries} retries: ${lastError?.message}`,
      { originalError: lastError, context }
    );
  }

  /**
   * Delays execution for specified milliseconds
   */
  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Executes a function with timeout
   */
  static async executeWithTimeout<T>(
    fn: () => Promise<T>,
    timeoutMs: number,
    operationName?: string
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<T>((_, reject) =>
        setTimeout(
          () =>
            reject(
              new WorkflowError(
                'TIMEOUT',
                `Operation ${operationName || 'unknown'} timed out after ${timeoutMs}ms`
              )
            ),
          timeoutMs
        )
      ),
    ]);
  }

  /**
   * Executes a function with both retry and timeout
   */
  static async executeWithRetryAndTimeout<T>(
    fn: () => Promise<T>,
    policy: RetryPolicy,
    timeoutMs: number,
    context?: { operationName?: string; metadata?: Record<string, any> }
  ): Promise<T> {
    return this.executeWithRetry(
      () => this.executeWithTimeout(fn, timeoutMs, context?.operationName),
      policy,
      context
    );
  }
}

/**
 * Error logger for tracking and reporting errors
 */
export class ErrorLogger {
  private errors: Array<{
    timestamp: Date;
    error: Error;
    context?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> = [];

  /**
   * Logs an error
   */
  log(
    error: Error,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    context?: Record<string, any>
  ): void {
    const entry = {
      timestamp: new Date(),
      error,
      context,
      severity,
    };

    this.errors.push(entry);

    // Also log to console
    const logLevel =
      severity === 'critical'
        ? 'error'
        : severity === 'high'
          ? 'warn'
          : 'info';
    console[logLevel as 'error' | 'warn' | 'info'](
      `[${severity.toUpperCase()}] ${error.message}`,
      context
    );
  }

  /**
   * Gets all logged errors
   */
  getErrors(): Array<{
    timestamp: Date;
    error: Error;
    context?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    return [...this.errors];
  }

  /**
   * Gets errors by severity
   */
  getErrorsBySeverity(
    severity: 'low' | 'medium' | 'high' | 'critical'
  ): Array<{
    timestamp: Date;
    error: Error;
    context?: Record<string, any>;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }> {
    return this.errors.filter((e) => e.severity === severity);
  }

  /**
   * Gets error statistics
   */
  getStatistics(): {
    totalErrors: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    recentErrors: number;
  } {
    const byType: Record<string, number> = {};
    const bySeverity: Record<string, number> = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    let recentErrors = 0;

    for (const entry of this.errors) {
      // Count by type
      const errorType = entry.error.constructor.name;
      byType[errorType] = (byType[errorType] || 0) + 1;

      // Count by severity
      bySeverity[entry.severity]++;

      // Count recent errors
      if (entry.timestamp > fiveMinutesAgo) {
        recentErrors++;
      }
    }

    return {
      totalErrors: this.errors.length,
      byType,
      bySeverity,
      recentErrors,
    };
  }

  /**
   * Clears all logged errors
   */
  clear(): void {
    this.errors = [];
  }

  /**
   * Exports errors as JSON
   */
  toJSON(): string {
    const data = this.errors.map((e) => ({
      timestamp: e.timestamp.toISOString(),
      errorName: e.error.name,
      errorMessage: e.error.message,
      errorStack: e.error.stack,
      context: e.context,
      severity: e.severity,
    }));

    return JSON.stringify(data, null, 2);
  }
}

/**
 * Circuit breaker pattern for handling cascading failures
 */
export class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: Date;
  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly resetTimeout: number;

  constructor(
    failureThreshold: number = 5,
    successThreshold: number = 2,
    resetTimeout: number = 60000
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.resetTimeout = resetTimeout;
  }

  /**
   * Executes a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (
        this.lastFailureTime &&
        Date.now() - this.lastFailureTime.getTime() > this.resetTimeout
      ) {
        this.state = 'half-open';
        this.successCount = 0;
      } else {
        throw new WorkflowError(
          'CIRCUIT_BREAKER_OPEN',
          'Circuit breaker is open. Service is temporarily unavailable.'
        );
      }
    }

    try {
      const result = await fn();

      if (this.state === 'half-open') {
        this.successCount++;
        if (this.successCount >= this.successThreshold) {
          this.state = 'closed';
          this.failureCount = 0;
          this.successCount = 0;
        }
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = new Date();

      if (this.failureCount >= this.failureThreshold) {
        this.state = 'open';
      }

      throw error;
    }
  }

  /**
   * Gets circuit breaker status
   */
  getStatus(): {
    state: 'closed' | 'open' | 'half-open';
    failureCount: number;
    successCount: number;
    lastFailureTime?: Date;
  } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }

  /**
   * Resets the circuit breaker
   */
  reset(): void {
    this.state = 'closed';
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = undefined;
  }
}

/**
 * Fallback handler for graceful degradation
 */
export class FallbackHandler {
  private fallbacks: Map<string, () => Promise<any>> = new Map();

  /**
   * Registers a fallback function
   */
  registerFallback(key: string, fn: () => Promise<any>): void {
    this.fallbacks.set(key, fn);
  }

  /**
   * Executes a function with fallback
   */
  async executeWithFallback<T>(
    key: string,
    fn: () => Promise<T>,
    fallbackFn?: () => Promise<T>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      // Try registered fallback first
      const registeredFallback = this.fallbacks.get(key);
      if (registeredFallback) {
        try {
          return await registeredFallback();
        } catch (fallbackError) {
          console.warn(
            `Registered fallback for ${key} also failed:`,
            fallbackError
          );
        }
      }

      // Try provided fallback
      if (fallbackFn) {
        try {
          return await fallbackFn();
        } catch (fallbackError) {
          console.warn(`Provided fallback for ${key} also failed:`, fallbackError);
        }
      }

      // All fallbacks failed, throw original error
      throw error;
    }
  }

  /**
   * Gets registered fallbacks
   */
  getFallbacks(): string[] {
    return Array.from(this.fallbacks.keys());
  }

  /**
   * Clears all fallbacks
   */
  clear(): void {
    this.fallbacks.clear();
  }
}

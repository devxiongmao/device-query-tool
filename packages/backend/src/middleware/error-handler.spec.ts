import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Hono, Context } from 'hono';

// Mock the env module
vi.mock('../config/env', () => ({
  env: {
    NODE_ENV: 'development', // Default mock value
    DATABASE_URL: 'postgresql://localhost:5432/testdb',
    DB_HOST: 'localhost',
    DB_PORT: 5432,
    DB_NAME: 'test_db',
    DB_USER: 'test_user',
    DB_PASSWORD: 'test_password',
    PORT: 3000,
    CORS_ORIGIN: 'http://localhost:5173',
    LOG_LEVEL: 'info' as const,
  },
}));

describe('errorHandler middleware', () => {
  let app: Hono;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    // Spy on console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Create a fresh app for each test
    app = new Hono();
  });

  afterEach(() => {
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  describe('Development mode', () => {
    beforeEach(async () => {
      // Mock NODE_ENV as development
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'development';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
    });

    it('should return 500 status code', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Test error');
      });

      // Act
      const res = await app.request('/error');

      // Assert
      expect(res.status).toBe(500);
    });

    it('should include error message in response', async () => {
      // Arrange
      const errorMessage = 'Something went wrong in development';
      app.get('/error', () => {
        throw new Error(errorMessage);
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.message).toBe(errorMessage);
    });

    it('should include stack trace in response', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Test error with stack');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.stack).toBeDefined();
      expect(typeof data.error.stack).toBe('string');
      expect(data.error.stack).toContain('Error: Test error with stack');
    });

    it('should log error to console', async () => {
      // Arrange
      const error = new Error('Test error for logging');
      app.get('/error', () => {
        throw error;
      });

      // Act
      await app.request('/error');

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error:', error);
    });

    it('should return JSON response', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('JSON test');
      });

      // Act
      const res = await app.request('/error');

      // Assert
      expect(res.headers.get('content-type')).toContain('application/json');
    });

    it('should handle errors with custom properties', async () => {
      // Arrange
      class CustomError extends Error {
        code: string;
        constructor(message: string, code: string) {
          super(message);
          this.code = code;
          this.name = 'CustomError';
        }
      }

      app.get('/error', () => {
        throw new CustomError('Custom error message', 'CUSTOM_CODE');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.message).toBe('Custom error message');
      expect(data.error.stack).toBeDefined();
    });
  });

  describe('Production mode', () => {
    beforeEach(async () => {
      // Mock NODE_ENV as production
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'production';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
    });

    it('should return 500 status code', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Production error');
      });

      // Act
      const res = await app.request('/error');

      // Assert
      expect(res.status).toBe(500);
    });

    it('should return generic error message', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Sensitive production error details');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.message).toBe('Internal Server Error');
    });

    it('should NOT include original error message', async () => {
      // Arrange
      const sensitiveMessage = 'Database connection failed: password is wrong';
      app.get('/error', () => {
        throw new Error(sensitiveMessage);
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.message).not.toBe(sensitiveMessage);
      expect(data.error.message).toBe('Internal Server Error');
    });

    it('should NOT include stack trace in response', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Error with sensitive stack');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data.error.stack).toBeUndefined();
    });

    it('should still log error to console', async () => {
      // Arrange
      const error = new Error('Production error for logging');
      app.get('/error', () => {
        throw error;
      });

      // Act
      await app.request('/error');

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Error:', error);
    });

    it('should return JSON response', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('JSON test in production');
      });

      // Act
      const res = await app.request('/error');

      // Assert
      expect(res.headers.get('content-type')).toContain('application/json');
    });
  });

  describe('Test mode', () => {
    beforeEach(async () => {
      // Mock NODE_ENV as test
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'test';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
    });

    it('should behave like production (hide error details)', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Test environment error');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Internal Server Error');
      expect(data.error.stack).toBeUndefined();
    });
  });

  describe('Error types', () => {
    beforeEach(async () => {
      // Mock NODE_ENV as development
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'development';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
    });

    it('should handle Error instances', async () => {
      // Arrange
      app.get('/error', () => {
        throw new Error('Standard Error');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Standard Error');
    });

    it('should handle TypeError', async () => {
      // Arrange
      app.get('/error', () => {
        throw new TypeError('Type Error occurred');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Type Error occurred');
    });

    it('should handle ReferenceError', async () => {
      // Arrange
      app.get('/error', () => {
        throw new ReferenceError('Reference Error occurred');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Reference Error occurred');
    });

    it('should handle custom Error subclasses', async () => {
      // Arrange
      class ValidationError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'ValidationError';
        }
      }

      app.get('/error', () => {
        throw new ValidationError('Invalid input data');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Invalid input data');
    });
  });

  describe('Response structure', () => {
    it('should have correct response structure in development', async () => {
      // Mock NODE_ENV as development
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'development';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
      
      // Arrange
      app.get('/error', () => {
        throw new Error('Structure test');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('message');
      expect(data.error).toHaveProperty('stack');
      expect(typeof data.error.message).toBe('string');
      expect(typeof data.error.stack).toBe('string');
    });

    it('should have correct response structure in production', async () => {
      // Mock NODE_ENV as production
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'production';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
      
      // Arrange
      app.get('/error', () => {
        throw new Error('Structure test');
      });

      // Act
      const res = await app.request('/error');
      const data = await res.json();

      // Assert
      expect(data).toHaveProperty('error');
      expect(data.error).toHaveProperty('message');
      expect(data.error).not.toHaveProperty('stack');
      expect(data.error.message).toBe('Internal Server Error');
    });
  });

  describe('Integration with routes', () => {
    beforeEach(async () => {
      // Mock NODE_ENV as development
      const { env } = await vi.importMock<typeof import('../config/env')>('../config/env');
      env.NODE_ENV = 'development';
      
      // Import error handler after mocking
      const { errorHandler } = await import('./error-handler');
      app.onError(errorHandler);
    });

    it('should handle errors from GET routes', async () => {
      // Arrange
      app.get('/users/:id', () => {
        throw new Error('User not found');
      });

      // Act
      const res = await app.request('/users/123');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('User not found');
    });

    it('should handle errors from POST routes', async () => {
      // Arrange
      app.post('/users', () => {
        throw new Error('Validation failed');
      });

      // Act
      const res = await app.request('/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
      });
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Validation failed');
    });

    it('should handle async errors', async () => {
      // Arrange
      app.get('/async-error', async () => {
        await Promise.resolve();
        throw new Error('Async error occurred');
      });

      // Act
      const res = await app.request('/async-error');
      const data = await res.json();

      // Assert
      expect(res.status).toBe(500);
      expect(data.error.message).toBe('Async error occurred');
    });
  });
});
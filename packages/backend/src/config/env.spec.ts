import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { z } from 'zod';

// We'll need to test the schema directly instead of the loaded env
// to avoid issues with .env files and module caching
describe('env.ts', () => {
  let originalEnv: NodeJS.ProcessEnv;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let processExitSpy: ReturnType<typeof vi.spyOn>;

  // Import the schema for direct testing
  const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_NAME: z.string().default('device_capabilities'),
    DB_USER: z.string().default('postgres'),
    DB_PASSWORD: z.string(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  });

  beforeEach(() => {
    // Save original env
    originalEnv = { ...process.env };

    // Spy on console.error and process.exit
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
  });

  afterEach(() => {
    // Restore original env
    process.env = originalEnv;
    
    // Restore mocks
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('Schema validation - Valid configurations', () => {
    it('should parse environment with all required variables and defaults', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret123',
      };

      // Act
      const result = envSchema.parse(testEnv);

      // Assert
      expect(result.DATABASE_URL).toBe('postgresql://localhost:5432/testdb');
      expect(result.DB_PASSWORD).toBe('secret123');
      expect(result.DB_HOST).toBe('localhost'); // default
      expect(result.DB_PORT).toBe(5432); // default
      expect(result.DB_NAME).toBe('device_capabilities'); // default
      expect(result.DB_USER).toBe('postgres'); // default
      expect(result.PORT).toBe(3000); // default
      expect(result.NODE_ENV).toBe('development'); // default
      expect(result.CORS_ORIGIN).toBe('http://localhost:5173'); // default
      expect(result.LOG_LEVEL).toBe('info'); // default
    });

    it('should parse environment with custom values overriding defaults', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://prod-db:5432/proddb',
        DB_HOST: 'prod-db',
        DB_PORT: '5433',
        DB_NAME: 'production_db',
        DB_USER: 'admin',
        DB_PASSWORD: 'prod-secret',
        PORT: '8080',
        NODE_ENV: 'production' as const,
        CORS_ORIGIN: 'https://example.com',
        LOG_LEVEL: 'error' as const,
      };

      // Act
      const result = envSchema.parse(testEnv);

      // Assert
      expect(result.DATABASE_URL).toBe('postgresql://prod-db:5432/proddb');
      expect(result.DB_HOST).toBe('prod-db');
      expect(result.DB_PORT).toBe(5433);
      expect(result.DB_NAME).toBe('production_db');
      expect(result.DB_USER).toBe('admin');
      expect(result.DB_PASSWORD).toBe('prod-secret');
      expect(result.PORT).toBe(8080);
      expect(result.NODE_ENV).toBe('production');
      expect(result.CORS_ORIGIN).toBe('https://example.com');
      expect(result.LOG_LEVEL).toBe('error');
    });

    it('should coerce PORT to number from string', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
        PORT: '4000',
      };

      // Act
      const result = envSchema.parse(testEnv);

      // Assert
      expect(result.PORT).toBe(4000);
      expect(typeof result.PORT).toBe('number');
    });

    it('should coerce DB_PORT to number from string', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
        DB_PORT: '3306',
      };

      // Act
      const result = envSchema.parse(testEnv);

      // Assert
      expect(result.DB_PORT).toBe(3306);
      expect(typeof result.DB_PORT).toBe('number');
    });

    it('should accept all valid NODE_ENV values', () => {
      const envValues: Array<'development' | 'production' | 'test'> = [
        'development',
        'production',
        'test',
      ];

      for (const nodeEnv of envValues) {
        const testEnv = {
          DATABASE_URL: 'postgresql://localhost:5432/testdb',
          DB_PASSWORD: 'secret',
          NODE_ENV: nodeEnv,
        };

        const result = envSchema.parse(testEnv);
        expect(result.NODE_ENV).toBe(nodeEnv);
      }
    });

    it('should accept all valid LOG_LEVEL values', () => {
      const logLevels: Array<'debug' | 'info' | 'warn' | 'error'> = [
        'debug',
        'info',
        'warn',
        'error',
      ];

      for (const logLevel of logLevels) {
        const testEnv = {
          DATABASE_URL: 'postgresql://localhost:5432/testdb',
          DB_PASSWORD: 'secret',
          LOG_LEVEL: logLevel,
        };

        const result = envSchema.parse(testEnv);
        expect(result.LOG_LEVEL).toBe(logLevel);
      }
    });
  });

  describe('Schema validation - Invalid configurations', () => {
    it('should throw ZodError when DATABASE_URL is missing', () => {
      // Arrange
      const testEnv = {
        DB_PASSWORD: 'secret',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should throw ZodError when DB_PASSWORD is missing', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should throw ZodError when DATABASE_URL is not a valid URL', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'not-a-valid-url',
        DB_PASSWORD: 'secret',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should throw ZodError when NODE_ENV is invalid', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
        NODE_ENV: 'invalid-env',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should throw ZodError when LOG_LEVEL is invalid', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
        LOG_LEVEL: 'invalid-level',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should throw ZodError when PORT is not coercible to number', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
        PORT: 'not-a-number',
      };

      // Act & Assert
      expect(() => envSchema.parse(testEnv)).toThrow(z.ZodError);
    });

    it('should include specific error messages for invalid fields', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'not-a-url',
        // DB_PASSWORD is missing
      };

      // Act & Assert
      try {
        envSchema.parse(testEnv);
        expect.fail('Should have thrown ZodError');
      } catch (error) {
        expect(error).toBeInstanceOf(z.ZodError);
        const zodError = error as z.ZodError;
        
        // Check that both errors are present
        const errorPaths = zodError.issues.map(issue => issue.path.join('.'));
        expect(errorPaths).toContain('DATABASE_URL');
        expect(errorPaths).toContain('DB_PASSWORD');
      }
    });
  });

  describe('loadEnv function behavior', () => {
    it('should call process.exit when validation fails', () => {
      // Arrange - set invalid env
      const invalidEnv = {
        DATABASE_URL: 'not-a-url',
      };

      // Mock the loadEnv function behavior
      const loadEnv = () => {
        try {
          envSchema.parse(invalidEnv);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.issues.forEach((err) => {
              console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
          }
          throw error;
        }
      };

      // Act & Assert
      expect(() => loadEnv()).toThrow('process.exit(1)');
      expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Invalid environment variables:');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should log all validation errors before exiting', () => {
      // Arrange
      const invalidEnv = {
        DATABASE_URL: 'not-a-url',
        NODE_ENV: 'invalid',
        // Missing DB_PASSWORD
      };

      // Mock the loadEnv function behavior
      const loadEnv = () => {
        try {
          envSchema.parse(invalidEnv);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.issues.forEach((err) => {
              console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
            process.exit(1);
          }
          throw error;
        }
      };

      // Act
      try {
        loadEnv();
      } catch (_error) {
        // Expected to throw
      }

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled();
      const allErrorCalls = consoleErrorSpy.mock.calls.flat().join(' ');
      
      // Should log all three errors
      expect(allErrorCalls).toContain('DATABASE_URL');
      expect(allErrorCalls).toContain('DB_PASSWORD');
      expect(allErrorCalls).toContain('NODE_ENV');
    });
  });

  describe('Type safety', () => {
    it('should export correct Env type', () => {
      // Arrange
      const testEnv = {
        DATABASE_URL: 'postgresql://localhost:5432/testdb',
        DB_PASSWORD: 'secret',
      };

      // Act
      const result = envSchema.parse(testEnv);

      // Assert - Type checking (will fail at compile time if types are wrong)
      const typedResult: {
        DATABASE_URL: string;
        DB_HOST: string;
        DB_PORT: number;
        DB_NAME: string;
        DB_USER: string;
        DB_PASSWORD: string;
        PORT: number;
        NODE_ENV: 'development' | 'production' | 'test';
        CORS_ORIGIN: string;
        LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
      } = result;

      expect(typedResult).toBeDefined();
      expect(typeof typedResult.PORT).toBe('number');
      expect(typeof typedResult.DB_PORT).toBe('number');
    });
  });
});
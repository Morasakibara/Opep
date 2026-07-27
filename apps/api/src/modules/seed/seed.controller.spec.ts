import { Test } from '@nestjs/testing';
import { SeedController } from './seed.controller';

jest.setTimeout(15000); // SeedController uses promisify which needs more time

// Standard Jest pattern: mock factory returns inline jest.fn()
// jest.mock() is hoisted above ALL imports and module-level code.
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

// Import the mocked module AFTER jest.mock() for type-safe access
import * as childProcess from 'child_process';
const mockExec = childProcess.exec as unknown as jest.Mock<any, any>;

describe('SeedController', () => {
  let controller: SeedController;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(async () => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'development';

    const module = await Test.createTestingModule({
      controllers: [SeedController],
    }).compile();

    controller = module.get(SeedController);
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('POST /seed', () => {
    it('returns seeded: true on success', async () => {
      // util.promisify(exec) calls exec(cmd, opts, callback).
      // The mock must call the callback for promisify to resolve.
      // Do NOT return a Promise — promisify expects callback-based functions.
      mockExec.mockImplementation((_cmd: string, _opts: any, cb: Function) => {
        cb(null, { stdout: '[SEED] ✅ Completed', stderr: '' });
      });

      const result = await controller.runSeed();
      expect(result).toEqual({
        seeded: true,
        summary: expect.stringContaining('[SEED]'),
      });
      // Verify exec was called with the correct command and options
      // promisify adds a callback as the 3rd argument
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('src/seed.ts'),
        expect.objectContaining({ timeout: 120000 }),
        expect.any(Function),
      );
    });

    it('returns seeded: false when exec throws', async () => {
      mockExec.mockImplementation((_cmd: string, _opts: any, cb: Function) => {
        cb(new Error('Script crashed'));
      });

      const result = await controller.runSeed();
      expect(result).toEqual({
        seeded: false,
        error: expect.stringContaining('Script crashed'),
      });
      // exec was still called even though it threw
      // promisify adds a callback as the 3rd argument
      expect(mockExec).toHaveBeenCalledWith(
        expect.stringContaining('src/seed.ts'),
        expect.objectContaining({ timeout: 120000 }),
        expect.any(Function),
      );
    });
  });

  describe('NODE_ENV protection', () => {
    it('throws NotFoundException when NODE_ENV is production', async () => {
      process.env.NODE_ENV = 'production';

      await expect(controller.runSeed()).rejects.toThrow(
        'Seed endpoint is disabled in production',
      );
      // exec should NOT have been called
      expect(mockExec).not.toHaveBeenCalled();
    });
  });
});

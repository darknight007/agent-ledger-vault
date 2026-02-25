import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveRepositoryLink } from './repository-link-service';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('saveRepositoryLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validation', () => {
    it('should reject empty string', async () => {
      await expect(saveRepositoryLink('')).rejects.toThrow(
        'Please enter a repository link'
      );
    });

    it('should reject whitespace-only string', async () => {
      await expect(saveRepositoryLink('   ')).rejects.toThrow(
        'Please enter a repository link'
      );
    });

    it('should reject null-like values', async () => {
      await expect(saveRepositoryLink('')).rejects.toThrow();
    });
  });

  describe('successful submission', () => {
    it('should save valid repository link', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      const link = 'https://github.com/user/repo';
      await saveRepositoryLink(link);

      expect(mockFrom).toHaveBeenCalledWith('repository_submissions');
      expect(mockInsert).toHaveBeenCalledWith({ repo_link: link });
    });

    it('should trim whitespace from link', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      const link = '  https://github.com/user/repo  ';
      await saveRepositoryLink(link);

      expect(mockInsert).toHaveBeenCalledWith({
        repo_link: 'https://github.com/user/repo',
      });
    });

    it('should handle various repository URL formats', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      const urls = [
        'https://github.com/user/repo',
        'https://gitlab.com/user/project',
        'https://bitbucket.org/user/repo',
        'git@github.com:user/repo.git',
      ];

      for (const url of urls) {
        vi.clearAllMocks();
        (supabase.from as any).mockImplementation(mockFrom);
        await saveRepositoryLink(url);
        expect(mockInsert).toHaveBeenCalledWith({ repo_link: url });
      }
    });
  });

  describe('error handling', () => {
    it('should throw descriptive error on database failure', async () => {
      const mockInsert = vi.fn().mockResolvedValue({
        error: { message: 'Unique constraint violation' },
      });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      await expect(saveRepositoryLink('https://github.com/user/repo')).rejects.toThrow(
        'Failed to submit repository link: Unique constraint violation'
      );
    });

    it('should handle network errors', async () => {
      const mockInsert = vi.fn().mockRejectedValue(new Error('Network error'));
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      await expect(saveRepositoryLink('https://github.com/user/repo')).rejects.toThrow(
        'Network error'
      );
    });

    it('should handle unexpected errors gracefully', async () => {
      const mockInsert = vi.fn().mockRejectedValue('Unknown error');
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      await expect(saveRepositoryLink('https://github.com/user/repo')).rejects.toThrow(
        'Failed to submit repository link. Please try again.'
      );
    });
  });

  describe('database interaction', () => {
    it('should only insert repo_link field', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      await saveRepositoryLink('https://github.com/user/repo');

      // Verify that only repo_link is in the insert payload
      const insertCall = mockInsert.mock.calls[0][0];
      expect(Object.keys(insertCall)).toEqual(['repo_link']);
      expect(insertCall).not.toHaveProperty('email');
      expect(insertCall).not.toHaveProperty('name');
    });

    it('should not include placeholder values', async () => {
      const mockInsert = vi.fn().mockResolvedValue({ error: null });
      const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert });
      (supabase.from as any).mockImplementation(mockFrom);

      await saveRepositoryLink('https://github.com/user/repo');

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.repo_link).not.toBe('');
      expect(insertCall.repo_link).not.toBeNull();
      expect(insertCall.repo_link).not.toBeUndefined();
    });
  });
});

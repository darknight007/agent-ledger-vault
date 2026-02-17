import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RepositoryLinkInput } from './RepositoryLinkInput';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RepositoryLinkInput', () => {
  let mockOnSubmit: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render input field with default placeholder', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      );
      expect(input).toBeInTheDocument();
    });

    it('should render input field with custom placeholder', () => {
      const customPlaceholder = 'Enter your repo URL';
      render(
        <RepositoryLinkInput
          onSubmit={mockOnSubmit}
          isSubmitting={false}
          placeholder={customPlaceholder}
        />
      );
      const input = screen.getByPlaceholderText(customPlaceholder);
      expect(input).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('input validation', () => {
    it('should not submit empty input', async () => {
      const { toast } = await import('@/hooks/use-toast').then(m => ({ toast: vi.fn() }));
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should not submit whitespace-only input', async () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '   ' } });
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should submit valid input', async () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('https://github.com/user/repo');
      });
    });
  });

  describe('form submission', () => {
    it('should call onSubmit with trimmed input', async () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '  https://github.com/user/repo  ' } });
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('https://github.com/user/repo');
      });
    });

    it('should clear input after successful submission', async () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe('');
      });
    });

    it('should handle Enter key submission', async () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith('https://github.com/user/repo');
      });
    });
  });

  describe('loading state', () => {
    it('should show loading text when isSubmitting is true', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={true} />);
      const button = screen.getByRole('button', { name: /submitting/i });
      expect(button).toBeInTheDocument();
    });

    it('should disable input when isSubmitting is true', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={true} />);
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should disable button when isSubmitting is true', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={true} />);
      const button = screen.getByRole('button', { name: /submitting/i });
      expect(button).toBeDisabled();
    });

    it('should show submit text when isSubmitting is false', () => {
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      const button = screen.getByRole('button', { name: /^submit$/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('should not clear input on submission error', async () => {
      mockOnSubmit.mockRejectedValueOnce(new Error('Network error'));
      
      render(<RepositoryLinkInput onSubmit={mockOnSubmit} isSubmitting={false} />);
      
      const input = screen.getByPlaceholderText(
        'Share repo link to analyze tech costs and setup optimum pricing model'
      ) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: 'https://github.com/user/repo' } });
      
      const button = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input.value).toBe('https://github.com/user/repo');
      });
    });
  });
});

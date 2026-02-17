import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateHeadingHierarchy,
  validateHeading,
  getHeadingLevel,
  hasSingleH1,
  getH1Text,
  isHeadingHierarchyValid,
  getHeadingOutline,
  validateHeadingContent,
  getHeadingStatistics,
} from './heading-validator';

describe('Heading Validator', () => {
  beforeEach(() => {
    // Clear DOM before each test
    document.body.innerHTML = '';
  });

  describe('validateHeadingHierarchy', () => {
    it('should validate correct heading hierarchy', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h2>Section 2</h2>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(true);
      expect(result.h1Count).toBe(1);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing H1', () => {
      document.body.innerHTML = `
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('H1'))).toBe(true);
    });

    it('should detect multiple H1s', () => {
      document.body.innerHTML = `
        <h1>Title 1</h1>
        <h1>Title 2</h1>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('H1'))).toBe(true);
    });

    it('should detect heading hierarchy skipping', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h3>Subsection (skipped H2)</h3>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('skipped'))).toBe(true);
    });

    it('should detect empty headings', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2></h2>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('empty'))).toBe(true);
    });

    it('should warn about very long headings', () => {
      const longText = 'A'.repeat(150);
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2>${longText}</h2>
      `;

      const result = validateHeadingHierarchy();
      expect(result.warnings.some((w) => w.includes('very long'))).toBe(true);
    });

    it('should detect H1 not at start', () => {
      document.body.innerHTML = `
        <h2>Section 1</h2>
        <h1>Main Title</h1>
      `;

      const result = validateHeadingHierarchy();
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('First heading'))).toBe(true);
    });
  });

  describe('validateHeading', () => {
    it('should validate correct heading', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'Main Title';
      document.body.appendChild(h1);

      const result = validateHeading(h1);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect non-heading element', () => {
      const div = document.createElement('div');
      const result = validateHeading(div);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('not a heading'))).toBe(true);
    });

    it('should detect empty heading', () => {
      const h1 = document.createElement('h1');
      h1.textContent = '';
      document.body.appendChild(h1);

      const result = validateHeading(h1);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('empty'))).toBe(true);
    });

    it('should detect too long heading', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'A'.repeat(150);
      document.body.appendChild(h1);

      const result = validateHeading(h1);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too long'))).toBe(true);
    });
  });

  describe('getHeadingLevel', () => {
    it('should get heading level', () => {
      const h1 = document.createElement('h1');
      expect(getHeadingLevel(h1)).toBe(1);

      const h3 = document.createElement('h3');
      expect(getHeadingLevel(h3)).toBe(3);
    });

    it('should return null for non-heading', () => {
      const div = document.createElement('div');
      expect(getHeadingLevel(div)).toBeNull();
    });
  });

  describe('hasSingleH1', () => {
    it('should detect single H1', () => {
      document.body.innerHTML = '<h1>Title</h1>';
      expect(hasSingleH1()).toBe(true);
    });

    it('should detect no H1', () => {
      document.body.innerHTML = '<h2>Section</h2>';
      expect(hasSingleH1()).toBe(false);
    });

    it('should detect multiple H1s', () => {
      document.body.innerHTML = '<h1>Title 1</h1><h1>Title 2</h1>';
      expect(hasSingleH1()).toBe(false);
    });
  });

  describe('getH1Text', () => {
    it('should get H1 text', () => {
      document.body.innerHTML = '<h1>Main Title</h1>';
      expect(getH1Text()).toBe('Main Title');
    });

    it('should return empty string if no H1', () => {
      document.body.innerHTML = '<h2>Section</h2>';
      expect(getH1Text()).toBe('');
    });
  });

  describe('isHeadingHierarchyValid', () => {
    it('should return true for valid hierarchy', () => {
      document.body.innerHTML = `
        <h1>Title</h1>
        <h2>Section</h2>
      `;
      expect(isHeadingHierarchyValid()).toBe(true);
    });

    it('should return false for invalid hierarchy', () => {
      document.body.innerHTML = `
        <h1>Title</h1>
        <h3>Subsection (skipped H2)</h3>
      `;
      expect(isHeadingHierarchyValid()).toBe(false);
    });
  });

  describe('getHeadingOutline', () => {
    it('should generate heading outline', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h2>Section 2</h2>
      `;

      const outline = getHeadingOutline();
      expect(outline).toContain('H1: Main Title');
      expect(outline).toContain('H2: Section 1');
      expect(outline).toContain('H3: Subsection 1.1');
    });
  });

  describe('validateHeadingContent', () => {
    it('should validate correct heading content', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'Main Title';
      document.body.appendChild(h1);

      const result = validateHeadingContent(h1);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect too short heading', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'AB';
      document.body.appendChild(h1);

      const result = validateHeadingContent(h1);
      expect(result.isValid).toBe(false);
      expect(result.errors.some((e) => e.includes('too short'))).toBe(true);
    });

    it('should warn about all caps', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'MAIN TITLE';
      document.body.appendChild(h1);

      const result = validateHeadingContent(h1);
      expect(result.errors.some((e) => e.includes('all caps'))).toBe(true);
    });

    it('should detect special characters', () => {
      const h1 = document.createElement('h1');
      h1.textContent = 'Main <Title>';
      document.body.appendChild(h1);

      const result = validateHeadingContent(h1);
      expect(result.errors.some((e) => e.includes('special characters'))).toBe(true);
    });
  });

  describe('getHeadingStatistics', () => {
    it('should calculate heading statistics', () => {
      document.body.innerHTML = `
        <h1>Main Title</h1>
        <h2>Section 1</h2>
        <h3>Subsection 1.1</h3>
        <h2>Section 2</h2>
      `;

      const stats = getHeadingStatistics();
      expect(stats.totalHeadings).toBe(4);
      expect(stats.h1Count).toBe(1);
      expect(stats.h2Count).toBe(2);
      expect(stats.h3Count).toBe(1);
      expect(stats.averageLength).toBeGreaterThan(0);
    });

    it('should handle empty page', () => {
      document.body.innerHTML = '';
      const stats = getHeadingStatistics();
      expect(stats.totalHeadings).toBe(0);
      expect(stats.averageLength).toBe(0);
    });
  });
});

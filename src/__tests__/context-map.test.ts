import { describe, it, expect } from 'vitest';
import { resolveZepUserId } from '../../context/context-map.mjs';

describe('resolveZepUserId', () => {
  describe('code context', () => {
    it('maps Code/repos paths to -code', () => {
      expect(resolveZepUserId('/Users/jasonbates/Code/repos/claudia2')).toBe('jason-code');
    });

    it('maps conductor workspace paths to -code', () => {
      expect(resolveZepUserId('/Users/jasonbates/conductor/workspaces/claudia2/riyadh')).toBe('jason-code');
    });
  });

  describe('subjectiv context', () => {
    it('maps Trinity vault paths to -subjectiv', () => {
      expect(resolveZepUserId('/Users/jasonbates/Obsidian/VAULTS/Trinity/080 Projects')).toBe('jason-subjectiv');
    });

    it('maps Trinity root to -subjectiv', () => {
      expect(resolveZepUserId('/Users/jasonbates/Obsidian/VAULTS/Trinity')).toBe('jason-subjectiv');
    });
  });

  describe('personal context', () => {
    it('maps Daily Notes to -personal', () => {
      expect(resolveZepUserId('/Users/jasonbates/Obsidian/VAULTS/Trinity/000 Daily Notes')).toBe('jason-personal');
    });

    it('maps Daily Notes subdirectory to -personal', () => {
      expect(resolveZepUserId('/Users/jasonbates/Obsidian/VAULTS/Trinity/000 Daily Notes/2026-04-11.md')).toBe('jason-personal');
    });

    it('maps home directory to -personal', () => {
      expect(resolveZepUserId('/Users/jasonbates')).toBe('jason-personal');
    });

    it('maps unknown paths to -personal', () => {
      expect(resolveZepUserId('/tmp/random')).toBe('jason-personal');
    });
  });

  describe('custom base user ID', () => {
    it('uses provided base user ID', () => {
      expect(resolveZepUserId('/Users/jasonbates/Code/repos/foo', 'test-user')).toBe('test-user-code');
    });

    it('uses provided base for personal fallback', () => {
      expect(resolveZepUserId('/tmp', 'other')).toBe('other-personal');
    });
  });
});

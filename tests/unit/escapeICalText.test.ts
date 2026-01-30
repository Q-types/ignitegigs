import { describe, it, expect } from 'vitest';

/**
 * Re-implementation of escapeICalText from
 * src/routes/api/calendar/[performerId]/+server.ts
 *
 * The original is a private function inside a route handler and cannot be
 * imported directly. We replicate the exact same logic here so the tests
 * validate the escaping rules used in production.
 */
function escapeICalText(text: string): string {
	return text
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\n/g, '\\n');
}

describe('escapeICalText', () => {
	it('escapes backslashes', () => {
		expect(escapeICalText('path\\to\\file')).toBe('path\\\\to\\\\file');
	});

	it('escapes a single backslash', () => {
		expect(escapeICalText('\\')).toBe('\\\\');
	});

	it('escapes semicolons', () => {
		expect(escapeICalText('one;two;three')).toBe('one\\;two\\;three');
	});

	it('escapes commas', () => {
		expect(escapeICalText('apples, oranges, bananas')).toBe('apples\\, oranges\\, bananas');
	});

	it('escapes newlines', () => {
		expect(escapeICalText('line one\nline two')).toBe('line one\\nline two');
	});

	it('handles empty strings', () => {
		expect(escapeICalText('')).toBe('');
	});

	it('handles strings with no special characters', () => {
		expect(escapeICalText('Hello World')).toBe('Hello World');
	});

	it('handles strings with only whitespace', () => {
		expect(escapeICalText('   ')).toBe('   ');
	});

	it('escapes multiple special characters in one string', () => {
		const input = 'Event: Fire Show; Location: London, UK\nNotes: bring\\gear';
		const expected = 'Event: Fire Show\\; Location: London\\, UK\\nNotes: bring\\\\gear';
		expect(escapeICalText(input)).toBe(expected);
	});

	it('escapes backslashes before other characters (order matters)', () => {
		// A backslash followed by n should become \\n (escaped backslash + n),
		// not be confused with a newline escape.
		// Input: literal backslash + 'n'  =>  '\\n' in source
		// The function first replaces \ -> \\, so \n (as chars) becomes \\n
		// Then semicolons, commas, then \n (actual newlines).
		// Since '\\' + 'n' has no actual newline, the \n replace does not fire.
		const input = '\\n';  // literal backslash followed by n
		expect(escapeICalText(input)).toBe('\\\\n');
	});

	it('handles consecutive special characters', () => {
		expect(escapeICalText(';;,,')).toBe('\\;\\;\\,\\,');
	});

	it('handles multiple consecutive newlines', () => {
		expect(escapeICalText('\n\n\n')).toBe('\\n\\n\\n');
	});
});

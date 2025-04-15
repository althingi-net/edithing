import { GithubFile } from 'client-sdk';
import filterLawEntry from './filterLawEntry';

describe('filterLawEntry', () => {
    const mockFile: GithubFile = {
        name: 'Test Law Document',
        identifier: '2023.123.456',
        date: '2023-12-31',
        path: 'path/to/file'
    };

    test('should match when filter is part of the name', () => {
        const filter = filterLawEntry('Law');
        expect(filter(mockFile)).toBe(true);
    });

    test('should match when filter is part of the identifier', () => {
        const filter = filterLawEntry('123');
        expect(filter(mockFile)).toBe(true);
    });

    test('should match when filter is part of the date', () => {
        const filter = filterLawEntry('2023');
        expect(filter(mockFile)).toBe(true);
    });

    test('should match when filter is part of the reversed identifier', () => {
        const filter = filterLawEntry('456/123');
        expect(filter(mockFile)).toBe(true);
    });

    test('should be case insensitive', () => {
        const filter = filterLawEntry('law');
        expect(filter(mockFile)).toBe(true);
    });

    test('should return false when no matches found', () => {
        const filter = filterLawEntry('nonexistent');
        expect(filter(mockFile)).toBe(false);
    });

    test('should handle empty filter string', () => {
        const filter = filterLawEntry('');
        expect(filter(mockFile)).toBe(true);
    });

    test('should handle special characters in filter', () => {
        const filter = filterLawEntry('2023.123');
        expect(filter(mockFile)).toBe(true);
    });
}); 
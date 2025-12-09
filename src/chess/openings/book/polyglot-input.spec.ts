import { Book } from '../book';
import { Polyglot } from './polyglot';
import * as fs from 'node:fs/promises';

jest.mock('node:fs/promises');

describe('polyglot input methods', () => {
	const mockFileHandle = {
		stat: jest.fn(),
		close: jest.fn(),
	} as unknown as fs.FileHandle;

	beforeEach(() => {
		jest.resetAllMocks();
	});

	test('initialises from filename', async () => {
		(fs.open as jest.Mock).mockResolvedValue(mockFileHandle);
		(mockFileHandle.stat as jest.Mock).mockResolvedValue({ size: 64 });

		const book: Book = new Polyglot('book.bin');
		await book.open();

		expect(fs.open).toHaveBeenCalledWith('book.bin', 'r');
		expect(mockFileHandle.stat).toHaveBeenCalled();
		expect((book as Polyglot)['numEntries']).toBe(4);
	});

	test('throws error if file size is not multiple of 16', async () => {
		(fs.open as jest.Mock).mockResolvedValue(mockFileHandle);
		(mockFileHandle.stat as jest.Mock).mockResolvedValue({ size: 30 });

		const book: Book = new Polyglot('book.bin');

		await expect(book.open()).rejects.toThrow(
			'File size is not a multiple of 16!',
		);
	});

	test('throws error if init called twice', async () => {
		(fs.open as jest.Mock).mockResolvedValue(mockFileHandle);
		(mockFileHandle.stat as jest.Mock).mockResolvedValue({ size: 32 });

		const book: Book = new Polyglot('book.bin');
		await book.open();

		await expect(book.open()).rejects.toThrow('Object is already initialised!');
	});
});

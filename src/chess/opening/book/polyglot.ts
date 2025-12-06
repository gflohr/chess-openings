import * as fs from 'node:fs/promises';
import { Book } from '../book';

/**
 * The `Polyglot` class represents an opening book in Polyglot (.bin) format.
 */
export class Polyglot extends Book {
	private fh: fs.FileHandle;
	private filename: string;
	private numEntries: number;

	/**
	 * Creates the object. Calling init() afterwards is mandatory!
	 *
	 * @param filenameOrFileHandle either a filename or a file handle
	 * @param filename an optional filename if passing a file handle
	 */
	constructor(filenameOrFileHandle: string | fs.FileHandle, filename?: string) {
		super();
		if (typeof filenameOrFileHandle === 'string') {
			this.filename = filenameOrFileHandle;
		} else {
			this.fh = filenameOrFileHandle;
			this.filename = filename ?? '[file handle]';
		}
	}

	/**
	 * Initialises the object.
	 */
	async init() {
		if (typeof this.numEntries !== 'undefined') {
			throw new Error('Object is already initialised!');
		}

		if (!this.fh) {
			this.fh = await fs.open(this.filename, 'r');
		}

		const stat = await this.fh.stat();
		const size = stat.size;
		if (size & 0xf) {
			throw new Error('File size is not a multiple of 16!');
		}

		this.numEntries = size >> 4;
	}
}

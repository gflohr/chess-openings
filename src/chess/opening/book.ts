import { Entry } from './entry';

/**
 * A Book is an object containg chess data indexable by position in
 * Forsyth-Edwards Notation (FEN).
 */
export interface Book {
	/**
	 * Initialise the book.
	 */
	open(): Promise<void>;

	/**
	 * Look-up a position.
	 *
	 * @returns an opening entry or undefined if none found
	 */
	lookupFEN(fen: string): Promise<Entry | undefined>;

	/**
	 * Close the book and free all resources.
	 */
	close(): Promise<void>;
}

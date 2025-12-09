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
	 * Look-up a position by FEN or EPD. An Extended Position Description EPD
	 * in this context is a FEN without move numbers.
	 *
	 * @returns an opening entry or undefined if none found
	 */
	lookupFEN(fen: string): Promise<Entry | undefined>;

	/**
	 * Close the book and free all resources.
	 */
	close(): Promise<void>;
}

import { Entry } from './entry';

/**
 * A Book is an object containg chess data indexable by position in
 * Forsyth-Edwards Notation (FEN).
 */
export abstract class Book {
	abstract init(): Promise<void>;

	/**
	 * Look-up a position.
	 *
	 * @returns an opening entry or undefined if none found
	 */
	abstract lookupFEN(fen: string): Promise<Entry | undefined>;

	/**
	 * Close the book and free all resources.
	 */
	abstract close(): Promise<void>;
}

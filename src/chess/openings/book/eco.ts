import { Book } from '../book';
import { eco } from '../eco';
import { ECOEntry } from './eco/entry';

/**
 * The ECO (Encyclopedia of Chess Openings) data is a classification of
 * chess openings.
 */
export class ECO implements Book {
	/**
	 * A no-op for the ECO book. Can be omitted.
	 */
	public async open(): Promise<void> {}

	/**
	 * A no-op for the ECO book. Can be omitted.
	 */
	public async close(): Promise<void> {}

	/**
	 * Lookup position by FEN.
	 *
	 * @params fen - the position in Forsyth-Edwards Notation FEN
	 * @returns the entry if found, undefined otherwise
	 */
	public async lookup(fen: string): Promise<ECOEntry | undefined> {
		return this.lookupSync(fen);
	}

	/**
	 * Lookup position by FEN (synchronously).
	 *
	 * @params fen - the position in Forsyth-Edwards Notation FEN
	 * @returns the entry if found, undefined otherwise
	 */
	public lookupSync(fen: string): ECOEntry | undefined {
		const epd = this.fen2epd(fen);
		if (!Object.prototype.hasOwnProperty.call(eco, epd)) {
			return undefined;
		}

		const position = eco[epd]!;

		const entry = new ECOEntry(epd, position.eco, position.name);

		for (let i = 0; i < position.moves.length; ++i) {
			entry.addContinuation({ move: position.moves[i] });
		}

		return entry;
	}

	private fen2epd(fen: string): string {
		return fen.split(/\s+/).slice(0, 4).join(' ');
	}
}

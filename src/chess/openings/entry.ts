type ContinuationArguments = {
	move: string;
	weight?: number;
	learn?: number;
};

/**
 * A continuation.
 */
export type Continuation = {
	/**
	 * The move in any notation.
	 */
	move: string;

	/**
	 * The weight (default 1).
	 */
	weight: number;

	/**
	 * An additional number describing the move.
	 */
	learn: number;
};
export class Entry {
	private _epd: string;
	private _continuations: Continuation[] = [];

	constructor(epd: string) {
		this._epd = epd;
	}

	/**
	 * Add a move to the entry.
	 *
	 * @param args An object containing at least the move in any notation.
	 */
	public addContinuation(args: ContinuationArguments) {
		if (!Object.prototype.hasOwnProperty.call(args, 'move')) {
			throw new Error("The parameter 'move' is mandatory!");
		}
		const weight = args.weight ?? 1;
		const learn = args.learn ?? 0;

		this._continuations.push({
			move: args.move,
			weight,
			learn,
		});
	}

	/**
	 * Get the position as an EPD (FEN without move numbers).
	 */
	public get epd(): string {
		return this._epd;
	}

	/**
	 * Get an array of all moves playable from this position, together with
	 * their weight and possible learn value.
	 *
	 * @returns an array of move objects with meta data
	 */
	public continuations(): Continuation[] {
		return structuredClone(this._continuations);
	}

	/**
	 * Get the best moves from this position according to their weight value.
	 *
	 * @returns an array of best moves in the book notation.
	 */
	public getBestMoves(): string[] {
		let maxWeight = -1;
		const best: string[] = [];

		this._continuations.forEach(continuation => {
			const weight = continuation.weight ?? 0;
			if (weight > maxWeight) {
				maxWeight = weight;
				best.length = 0;
				best.push(continuation.move);
			} else if (weight === maxWeight) {
				best.push(continuation.move);
			}
		});

		return best;
	}

	/**
	 * Get the best move from this position according to their weight value.
	 * If there are multiple moves with the same weigth, a random one is
	 * chosen.
	 *
	 * @returns the best move in book notation or undefined if there are no moves
	 */
	public getBestMove(): string | undefined {
		const best = this.getBestMoves();

		if (best.length == 1) {
			return best[0];
		} else if (best.length > 1) {
			const index = Math.floor(Math.random() * best.length);
			return best[index];
		}
	}

	/**
	 * Pick a random move using weighted random selection based on the weight
	 * of each move.
	 *
	 * @returns a random move in book notation or undefined if there are no moves
	 */
	public pickMove(): string | undefined {
		if (this._continuations.length === 0) {
			return undefined;
		}

		// Compute total weight.
		const totalWeight = this._continuations.reduce(
			(sum, m) => sum + (m.weight ?? 0),
			0,
		);
		if (totalWeight === 0) {
			// All weights are zero -> pick randomly.
			const index = Math.floor(Math.random() * this._continuations.length);
			return this._continuations[index].move;
		}

		// Pick a random number between 0 and totalWeight
		const rnd = Math.random() * totalWeight;

		// Walk through the moves until we reach the randomly selected weight
		let accumulated = 0;
		for (const m of this._continuations) {
			accumulated += m.weight ?? 0;
			if (rnd < accumulated) {
				return m.move;
			}
		}

		// Fallback (should not happen)
		return this._continuations[this._continuations.length - 1].move;
	}
}

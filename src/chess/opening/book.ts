import { Entry } from './entry';

type PieceChar =
	| 'p'
	| 'P'
	| 'n'
	| 'N'
	| 'b'
	| 'B'
	| 'r'
	| 'R'
	| 'q'
	| 'Q'
	| 'k'
	| 'K';
type PieceNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type Square =
	| 'a8'
	| 'b8'
	| 'c8'
	| 'd8'
	| 'e8'
	| 'f8'
	| 'g8'
	| 'h8'
	| 'a7'
	| 'b7'
	| 'c7'
	| 'd7'
	| 'e7'
	| 'f7'
	| 'g7'
	| 'h7'
	| 'a6'
	| 'b6'
	| 'c6'
	| 'd6'
	| 'e6'
	| 'f6'
	| 'g6'
	| 'h6'
	| 'a5'
	| 'b5'
	| 'c5'
	| 'd5'
	| 'e5'
	| 'f5'
	| 'g5'
	| 'h5'
	| 'a4'
	| 'b4'
	| 'c4'
	| 'd4'
	| 'e4'
	| 'f4'
	| 'g4'
	| 'h4'
	| 'a3'
	| 'b3'
	| 'c3'
	| 'd3'
	| 'e3'
	| 'f3'
	| 'g3'
	| 'h3'
	| 'a2'
	| 'b2'
	| 'c2'
	| 'd2'
	| 'e2'
	| 'f2'
	| 'g2'
	| 'h2'
	| 'a1'
	| 'b1'
	| 'c1'
	| 'd1'
	| 'e1'
	| 'f1'
	| 'g1'
	| 'h1';

export type EPSquare =
	| '-'
	| 'a3'
	| 'b3'
	| 'c3'
	| 'd3'
	| 'e3'
	| 'f3'
	| 'g3'
	| 'h3'
	| 'a6'
	| 'b6'
	| 'c6'
	| 'd6'
	| 'e6'
	| 'f6'
	| 'g6'
	| 'h6';

type LocatedPiece = {
	piece: PieceChar;
	square: Square;
};

type Castling =
	| ''
	| 'K'
	| 'Q'
	| 'k'
	| 'q'
	| 'KQ'
	| 'Kk'
	| 'kq'
	| 'Qk'
	| 'Qq'
	| 'kq'
	| 'KQk'
	| 'KQq'
	| 'Kkq'
	| 'Qkq'
	| 'KQkq';

type Position = {
	pieces: LocatedPiece[];
	turn: 'w' | 'b';
	castling: Castling;
	epSquare: EPSquare;
	halfmoveClock: number;
	fullmoveNumber: number;
};

const pieces: Record<PieceChar, PieceNumber> = {
	p: 0,
	P: 1,
	n: 2,
	N: 3,
	b: 4,
	B: 5,
	r: 6,
	R: 7,
	q: 8,
	Q: 9,
	k: 10,
	K: 11,
};

/**
 * A Book is an object containg chess data indexable by position in
 * Forsyth-Edwards Notation (FEN).
 */
export abstract class Book {
	abstract init(): Promise<void>;

	/**
	 * Return a mapping from piece characters (p, P, n, N, ...) to their
	 * respective numerical representation.
	 */
	protected pieces(): Record<PieceChar, PieceNumber> {
		return pieces;
	}

	/**
	 * Look-up a position.
	 *
	 * @returns an opening entry or undefined if none found
	 */
	abstract lookupFEN(fen: string): Promise<Entry | undefined>;

	/**
	 * Parse a position given as a FEN string.
	 *
	 * @param fen - the FEN string
	 * @returns a Position object.
	 */
	protected parseFEN(fen: string): Position | undefined {
		const tokens = fen.trim().split(/\s+/);
		if (tokens.length < 2) return;

		tokens[2] ??= '-';
		tokens[3] ??= '-';
		tokens[4] ??= '0';
		tokens[5] ??= '1';

		const result: Position = {} as Position;

		if (tokens[1] === 'w' || tokens[1] === 'b') {
			result.turn = tokens[1];
		} else {
			return;
		}

		if (tokens[3] === '-') {
			result.epSquare = tokens[3];
		} else if (result.turn === 'w' && tokens[3].match(/^[a-h]6$/)) {
			result.epSquare = tokens[3] as EPSquare;
		} else if (result.turn === 'b' && tokens[3].match(/^[a-h]3$/)) {
			result.epSquare = tokens[3] as EPSquare;
		} else {
			return;
		}

		if (tokens[2].match(/^K?Q?k?q?$/)) {
			result.castling = tokens[2] as Castling;
		} else {
			return;
		}

		const hmc = parseInt(tokens[4]);
		if (!isNaN(hmc) && hmc >= 0) {
			result.halfmoveClock = hmc;
		} else {
			return;
		}

		const fmn = parseInt(tokens[5]);
		if (!isNaN(fmn) && fmn > 0) {
			result.fullmoveNumber = fmn;
		} else {
			return;
		}

		const ranks = tokens[0].split('/');
		if (ranks.length != 8) return;

		result.pieces = [];
		let rank = 8;
		const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		for (let i = 0; i < 8; ++i) {
			let file = 0;
			for (let j = 0; j < ranks[i].length; ++j) {
				const piece = ranks[i][j] as PieceChar;
				if (piece > '1' && piece <= '8') {
					file += parseInt(piece);
				} else if (Object.prototype.hasOwnProperty.call(pieces, piece)) {
					if (file > 7) return;
					const square = (files[file] + rank) as Square;
					result.pieces.push({
						piece,
						square,
					});
					++file;
				} else {
					return;
				}
			}
			--rank;
		}

		return result;
	}
}

import { parseFEN } from './fen-parser';

describe('FEN parser', () => {
	it('should parse a position', () => {
		const position = parseFEN('8/8/8/8/8/2k5/1q6/K7 w - - 0 1');
		expect(position).toBeDefined();

		if (position) {
			expect(position.turn).toBe('w');
			expect(position.castling).toBe('');
			expect(position.epSquare).toBe('');
			expect(position.halfmoveClock).toBe(0);
			expect(position.fullmoveNumber).toBe(1);
			expect(position.pieces.length).toBe(3);
		}
	});
});

import { Entry } from './entry';

describe('Entry', () => {
	let entry: Entry;

	beforeEach(() => {
		entry = new Entry();
	});

	describe('addMove', () => {
		it('adds a move with default weight and learn', () => {
			entry.addMove({ move: 'e2e4' });
			expect(entry['_moves']).toEqual([{ move: 'e2e4', weight: 1, learn: 0 }]);
		});

		it('adds a move with custom weight and learn', () => {
			entry.addMove({ move: 'd2d4', weight: 3, learn: 2 });
			expect(entry['_moves']).toEqual([{ move: 'd2d4', weight: 3, learn: 2 }]);
		});

		it('throws if move is missing', () => {
			expect(() => entry.addMove({} as never)).toThrow(
				"The parameter 'move' is mandatory!",
			);
		});
	});

	describe('moves getter', () => {
		it('returns a cloned array of moves', () => {
			entry.addMove({ move: 'e2e4' });
			const moves = entry.moves;
			expect(moves).toEqual([{ move: 'e2e4', weight: 1, learn: 0 }]);
			// Modifying returned array should not affect internal _moves
			moves.push({ move: 'd2d4', weight: 2, learn: 0 });
			expect(entry['_moves']).toHaveLength(1);
		});
	});

	describe('getBestMoves', () => {
		it('returns empty array if no moves', () => {
			expect(entry.getBestMoves()).toEqual([]);
		});

		it('returns move with highest weight', () => {
			entry.addMove({ move: 'e2e4', weight: 1 });
			entry.addMove({ move: 'd2d4', weight: 3 });
			expect(entry.getBestMoves()).toEqual(['d2d4']);
		});

		it('returns multiple moves if tie in weight', () => {
			entry.addMove({ move: 'e2e4', weight: 2 });
			entry.addMove({ move: 'd2d4', weight: 2 });
			expect(entry.getBestMoves()).toEqual(
				expect.arrayContaining(['e2e4', 'd2d4']),
			);
		});
	});

	describe('getBestMove', () => {
		it('returns undefined if no moves', () => {
			expect(entry.getBestMove()).toBeUndefined();
		});

		it('returns the only move if single best', () => {
			entry.addMove({ move: 'e2e4', weight: 1 });
			expect(entry.getBestMove()).toBe('e2e4');
		});

		it('returns one of the best moves randomly if tie', () => {
			entry.addMove({ move: 'e2e4', weight: 2 });
			entry.addMove({ move: 'd2d4', weight: 2 });

			// Spy on Math.random to return 0 => first move
			jest.spyOn(global.Math, 'random').mockReturnValue(0);
			expect(entry.getBestMove()).toBe('e2e4');

			// Return 0.999 => second move
			(global.Math.random as jest.Mock).mockReturnValue(0.999);
			expect(entry.getBestMove()).toBe('d2d4');

			jest.restoreAllMocks();
		});
	});

	describe('pickMove', () => {
		it('returns undefined if no moves', () => {
			expect(entry.pickMove()).toBeUndefined();
		});

		it('returns the only move if one move', () => {
			entry.addMove({ move: 'e2e4', weight: 5 });
			expect(entry.pickMove()).toBe('e2e4');
		});

		it('returns move proportionally to weight', () => {
			entry.addMove({ move: 'e2e4', weight: 1 });
			entry.addMove({ move: 'd2d4', weight: 3 });

			// Mock Math.random to select a weighted move
			// total weight = 4; rnd = 0.2 * 4 = 0.8 < 1? picks e2e4
			jest.spyOn(global.Math, 'random').mockReturnValue(0.2);
			expect(entry.pickMove()).toBe('e2e4');

			// rnd = 0.5 * 4 = 2 => picks d2d4
			(global.Math.random as jest.Mock).mockReturnValue(0.5);
			expect(entry.pickMove()).toBe('d2d4');

			jest.restoreAllMocks();
		});

		it('picks randomly if all weights are zero', () => {
			entry.addMove({ move: 'e2e4', weight: 0 });
			entry.addMove({ move: 'd2d4', weight: 0 });

			jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
			expect(entry.pickMove()).toBe('e2e4');

			(global.Math.random as jest.Mock).mockReturnValue(0.9);
			expect(entry.pickMove()).toBe('d2d4');

			jest.restoreAllMocks();
		});
	});
});

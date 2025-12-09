import { Book } from '../book';
import { Entry } from '../entry';
import { Polyglot } from './polyglot';

describe('Polyglot lookup', () => {
	let book: Book;

	beforeAll(async () => {
		book = new Polyglot('./books/flohr.bin');
		await book.init();
	});

	afterAll(async () => {
		await book.close();
	});

	const tests = [
		[
			'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			[
				{
					move: 'd2d4',
					weight: 612,
				},
				{
					move: 'e2e4',
					weight: 185,
				},
				{
					move: 'g1f3',
					weight: 167,
				},
				{
					move: 'c2c4',
					weight: 103,
				},
			],
		],
		[
			'rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR b KQkq d3 0 1',
			[
				{
					move: 'g8f6',
					weight: 232,
				},
				{
					move: 'd7d5',
					weight: 198,
				},
				{
					move: 'e7e6',
					weight: 29,
				},
				{
					move: 'f7f5',
					weight: 11,
				},
				{
					move: 'd7d6',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
			[
				{
					move: 'c7c6',
					weight: 146,
				},
				{
					move: 'e7e5',
					weight: 34,
				},
				{
					move: 'c7c5',
					weight: 32,
				},
				{
					move: 'g8f6',
					weight: 19,
				},
				{
					move: 'e7e6',
					weight: 16,
				},
				{
					move: 'b8c6',
					weight: 5,
				},
			],
		],
		[
			'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1',
			[
				{
					move: 'g8f6',
					weight: 50,
				},
				{
					move: 'd7d5',
					weight: 47,
				},
				{
					move: 'e7e6',
					weight: 5,
				},
				{
					move: 'c7c5',
					weight: 4,
				},
				{
					move: 'g7g6',
					weight: 4,
				},
				{
					move: 'd7d6',
					weight: 1,
				},
			],
		],
		[
			'rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR b KQkq c3 0 1',
			[
				{
					move: 'e7e5',
					weight: 28,
				},
				{
					move: 'g8f6',
					weight: 19,
				},
				{
					move: 'c7c5',
					weight: 4,
				},
				{
					move: 'e7e6',
					weight: 2,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 1 2',
			[
				{
					move: 'c2c4',
					weight: 269,
				},
				{
					move: 'g1f3',
					weight: 48,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR w KQkq d6 0 2',
			[
				{
					move: 'c2c4',
					weight: 192,
				},
				{
					move: 'g1f3',
					weight: 61,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPP1PPPP/RNBQKBNR w KQkq - 0 2',
			[
				{
					move: 'c2c4',
					weight: 17,
				},
				{
					move: 'e2e4',
					weight: 3,
				},
				{
					move: 'b1d2',
					weight: 3,
				},
				{
					move: 'g1f3',
					weight: 2,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/2p5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
			[
				{
					move: 'd2d4',
					weight: 61,
				},
				{
					move: 'b1c3',
					weight: 26,
				},
				{
					move: 'g1f3',
					weight: 10,
				},
				{
					move: 'c2c4',
					weight: 6,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
			[
				{
					move: 'g1f3',
					weight: 28,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2',
			[
				{
					move: 'g1f3',
					weight: 12,
				},
				{
					move: 'b1c3',
					weight: 4,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2',
			[
				{
					move: 'e4e5',
					weight: 7,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
			[
				{
					move: 'd2d4',
					weight: 24,
				},
			],
		],
		[
			'r1bqkbnr/pppppppp/2n5/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1 2',
			[
				{
					move: 'd2d4',
					weight: 5,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 2 2',
			[
				{
					move: 'c2c4',
					weight: 73,
				},
				{
					move: 'g2g3',
					weight: 1,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq d6 0 2',
			[
				{
					move: 'd2d4',
					weight: 21,
				},
				{
					move: 'e2e3',
					weight: 17,
				},
				{
					move: 'c2c4',
					weight: 11,
				},
				{
					move: 'g2g3',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2',
			[
				{
					move: 'c2c4',
					weight: 4,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPPPPPP/RNBQKB1R w KQkq c6 0 2',
			[
				{
					move: 'c2c4',
					weight: 6,
				},
			],
		],
		[
			'rnbqkbnr/pppppp1p/6p1/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2',
			[
				{
					move: 'd2d4',
					weight: 6,
				},
				{
					move: 'c2c4',
					weight: 6,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/3p4/8/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2',
			[
				{
					move: 'd2d4',
					weight: 5,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/8/4p3/2P5/8/PP1PPPPP/RNBQKBNR w KQkq e6 0 2',
			[
				{
					move: 'b1c3',
					weight: 25,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 1 2',
			[
				{
					move: 'b1c3',
					weight: 30,
				},
				{
					move: 'g1f3',
					weight: 8,
				},
				{
					move: 'd2d4',
					weight: 4,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/2P5/8/PP1PPPPP/RNBQKBNR w KQkq c6 0 2',
			[
				{
					move: 'g1f3',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',
			[
				{
					move: 'b1c3',
					weight: 12,
				},
				{
					move: 'g1f3',
					weight: 5,
				},
				{
					move: 'd2d4',
					weight: 5,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
			[
				{
					move: 'e7e6',
					weight: 97,
				},
				{
					move: 'g7g6',
					weight: 79,
				},
				{
					move: 'd7d6',
					weight: 15,
				},
				{
					move: 'c7c6',
					weight: 8,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 2 2',
			[
				{
					move: 'e7e6',
					weight: 11,
				},
				{
					move: 'd7d5',
					weight: 8,
				},
				{
					move: 'c7c5',
					weight: 6,
				},
				{
					move: 'g7g6',
					weight: 2,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
			[
				{
					move: 'c7c6',
					weight: 55,
				},
				{
					move: 'd5c4',
					weight: 50,
				},
				{
					move: 'e7e6',
					weight: 34,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'g8f6',
					weight: 56,
				},
				{
					move: 'e7e6',
					weight: 8,
				},
				{
					move: 'c7c6',
					weight: 6,
				},
				{
					move: 'c7c5',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq c3 0 2',
			[
				{
					move: 'f7f5',
					weight: 14,
				},
				{
					move: 'g8f6',
					weight: 4,
				},
				{
					move: 'f8b4',
					weight: 2,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq e3 0 2',
			[
				{
					move: 'd7d5',
					weight: 17,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/3P4/8/PPPNPPPP/R1BQKBNR b KQkq - 1 2',
			[
				{
					move: 'd7d5',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'f7f5',
					weight: 6,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/2p5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2',
			[
				{
					move: 'd7d5',
					weight: 93,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/2p5/8/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2',
			[
				{
					move: 'd7d5',
					weight: 32,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/2p5/8/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'd7d5',
					weight: 6,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/2p5/8/2P1P3/8/PP1P1PPP/RNBQKBNR b KQkq c3 0 2',
			[
				{
					move: 'e7e6',
					weight: 5,
				},
				{
					move: 'd7d5',
					weight: 4,
				},
				{
					move: 'e7e5',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'b8c6',
					weight: 32,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'b8c6',
					weight: 17,
				},
				{
					move: 'e7e6',
					weight: 4,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 1 2',
			[
				{
					move: 'b8c6',
					weight: 6,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/4P3/8/8/PPPP1PPP/RNBQKBNR b KQkq - 0 2',
			[
				{
					move: 'f6d5',
					weight: 12,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2',
			[
				{
					move: 'd7d5',
					weight: 17,
				},
			],
		],
		[
			'r1bqkbnr/pppppppp/2n5/8/3PP3/8/PPP2PPP/RNBQKBNR b KQkq d3 0 2',
			[
				{
					move: 'd7d5',
					weight: 5,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq c3 0 2',
			[
				{
					move: 'e7e6',
					weight: 18,
				},
				{
					move: 'g7g6',
					weight: 13,
				},
				{
					move: 'c7c6',
					weight: 7,
				},
				{
					move: 'b7b6',
					weight: 3,
				},
				{
					move: 'd7d6',
					weight: 2,
				},
				{
					move: 'c7c5',
					weight: 2,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/3P4/5N2/PPP1PPPP/RNBQKB1R b KQkq d3 0 2',
			[
				{
					move: 'g8f6',
					weight: 56,
				},
				{
					move: 'e7e6',
					weight: 8,
				},
				{
					move: 'c7c6',
					weight: 6,
				},
				{
					move: 'c7c5',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/8/4PN2/PPPP1PPP/RNBQKB1R b KQkq - 0 2',
			[
				{
					move: 'g8f6',
					weight: 7,
				},
			],
		],
		[
			'rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq c3 0 2',
			[
				{
					move: 'd5d4',
					weight: 14,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq c3 0 2',
			[
				{
					move: 'f7f5',
					weight: 2,
				},
				{
					move: 'g8f6',
					weight: 1,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq c3 0 2',
			[
				{
					move: 'b8c6',
					weight: 3,
				},
				{
					move: 'g8f6',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppppp1p/6p1/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq c3 0 2',
			[
				{
					move: 'f8g7',
					weight: 2,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/8/4p3/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 1 2',
			[
				{
					move: 'g8f6',
					weight: 21,
				},
				{
					move: 'b8c6',
					weight: 4,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2P5/2N5/PP1PPPPP/R1BQKBNR b KQkq - 2 2',
			[
				{
					move: 'e7e5',
					weight: 6,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 2 2',
			[
				{
					move: 'e7e6',
					weight: 18,
				},
				{
					move: 'g7g6',
					weight: 13,
				},
				{
					move: 'c7c6',
					weight: 7,
				},
				{
					move: 'b7b6',
					weight: 3,
				},
				{
					move: 'd7d6',
					weight: 2,
				},
				{
					move: 'c7c5',
					weight: 2,
				},
			],
		],
		[
			'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq d3 0 2',
			[
				{
					move: 'e7e6',
					weight: 97,
				},
				{
					move: 'g7g6',
					weight: 79,
				},
				{
					move: 'd7d6',
					weight: 15,
				},
				{
					move: 'c7c6',
					weight: 8,
				},
			],
		],
		[
			'rnbqkbnr/pp1ppppp/8/2p5/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'b8c6',
					weight: 3,
				},
				{
					move: 'g8f6',
					weight: 3,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/2P5/5N2/PP1PPPPP/RNBQKB1R b KQkq - 1 2',
			[
				{
					move: 'f7f5',
					weight: 2,
				},
				{
					move: 'g8f6',
					weight: 1,
				},
			],
		],
		[
			'rnbqkbnr/pppp1ppp/4p3/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq d3 0 2',
			[
				{
					move: 'f7f5',
					weight: 14,
				},
				{
					move: 'g8f6',
					weight: 4,
				},
				{
					move: 'f8b4',
					weight: 2,
				},
			],
		],
	];

	it.each(tests)('%s', async (fen, moves) => {
		const wantedEntry = new Entry();

		(moves as { move: string; weight: number }[]).forEach(moveSpec => {
			wantedEntry.addMove(moveSpec);
		});

		const gotEntry = await book.lookupFEN(fen as string);
		expect(gotEntry).toBeDefined();
	});
});

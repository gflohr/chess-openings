import { Book } from '../book';
import { Continuation, Entry } from '../entry';
import { Polyglot } from './polyglot';

describe('Polyglot lookup', () => {
	let book: Book;

	beforeAll(async () => {
		book = new Polyglot('./books/testbook.bin');
		await book.open();
	});

	afterAll(async () => {
		await book.close();
	});

	const tests = [
		[
			'start position',
			'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
			[
				{
					move: 'd2d4',
					weight: 2,
					learn: 0,
				},
				{
					move: 'e2e4',
					weight: 3,
					learn: 0,
				},
			],
		],
		[
			// The erroneous en-passant square should be automatically repaired.
			'erroneous en-passant square',
			'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
			[
				{
					move: 'e7e5',
					weight: 2,
					learn: 0,
				},
				{
					move: 'e7e6',
					weight: 1,
					learn: 0,
				},
			],
		],
		[
			'en-passant possible',
			'rnbqkbnr/ppp2ppp/4p3/3pP3/8/8/PPPP1PPP/RNBQKBNR w KQkq d6 0 3',
			[
				{
					move: 'e5d6',
					weight: 1,
					learn: 0,
				},
			],
		],
		[
			// Polyglot stores castling as king moves that capture their own
			// rook. Check that the code that corrects this, works.
			'white king-side castling',
			'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
			[
				{
					move: 'e1g1',
					weight: 1,
					learn: 0,
				},
			],
		],
		[
			'white queen-side castling',
			'rnbqkb1r/pp3ppp/2p1pn2/3p4/3P1B2/2NQ4/PPP1PPPP/R3KBNR w KQkq - 0 5',
			[
				{
					move: 'e1c1',
					weight: 1,
					learn: 0,
				},
			],
		],
		[
			'black king-side castling',
			'rnbqk2r/pppp1ppp/5n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R b KQkq - 5 4',
			[
				{
					move: 'e8g8',
					weight: 1,
					learn: 0,
				},
			],
		],
		[
			'black queen-side castling',
			'r3kbnr/pppqpppp/2n1b3/3p4/2PPPB2/2N5/PP3PPP/R2QKBNR b KQkq - 0 5',
			[
				{
					move: 'e8c8',
					weight: 1,
					learn: 0,
				},
			],
		],
	];

	it.each(tests)('%s', async (description, fen, continuations) => {
		const wantedEntry = new Entry(fen as string);

		(continuations as Continuation[]).forEach(moveSpec => {
			wantedEntry.addContinuation(moveSpec);
		});

		const gotEntry = await book.lookup(fen as string);
		expect(gotEntry).toBeDefined();

		const gotContinuations = gotEntry?.continuations();
		expect(gotContinuations).toBeDefined();

		const sortByMove = (a: Continuation, b: Continuation) =>
			a.move.localeCompare(b.move);

		const expected = (continuations as Continuation[]).slice().sort(sortByMove);
		const actual = gotContinuations!.slice().sort(sortByMove);

		expect(actual.length).toBe(expected.length);

		for (let i = 0; i < expected.length; i++) {
			expect(actual[i].move).toBe(expected[i].move);
			expect(actual[i].weight).toBe(expected[i].weight);
			expect(actual[i].learn).toBe(expected[i].learn);
		}
	});
});

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

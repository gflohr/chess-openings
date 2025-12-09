import { Book } from '..';
import { ECO } from './eco';

describe('ECO', () => {
	let book: Book;

	beforeAll(async () => {
		book = new ECO();
		await book.open();
	});

	afterAll(async () => {
		await book.close();
	});

	it('should find Ruy Lopez synchronously by FEN', () => {});
});

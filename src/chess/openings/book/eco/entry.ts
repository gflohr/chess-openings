import { Entry } from '../../entry';

/**
 * An ECO entry constains additional information about an opening.
 */
export class ECOEntry extends Entry {
	private _code: string;
	private _name: string;

	constructor(fen: string, code: string, name: string) {
		super(fen);
		this._code = code;
		this._name = name;
	}

	/**
	 * Get the ECO code of the position.
	 *
	 * @returns the ECO code
	 */
	public get code(): string {
		return this._code;
	}

	/**
	 * Get the name of the opening.
	 *
	 * @returns the opening name
	 */
	public get name(): string {
		return this._name;
	}
}

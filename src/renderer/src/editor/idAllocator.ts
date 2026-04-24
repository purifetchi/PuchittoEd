export class IdAllocator {
  /**
   * The last id.
   */
  private _lastId: number = 0

  /**
   * How much to skip by?
   */
  private _skipBy: number = 1

  /**
   * The released IDs.
   */
  private _released: number[] = []

  constructor(opts?: { last?: number; skip?: number }) {
    this._lastId = opts?.last ?? 0
    this._skipBy = opts?.skip ?? 1
  }

  /**
   * Gets a new ID.
   * @returns The new ID.
   */
  get(): number {
    if (this._released.length > 0) {
      return this._released.pop()
    }

    this._lastId += this._skipBy
    return this._lastId
  }

  /**
   * Releases an ID into the allocator.
   * @param id The id.
   */
  release(id: number): void {
    this._released.push(id)
  }
}

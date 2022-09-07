/**
 * Dedekind Completion, implments a set with a Dedekind cut
 * Used as an efficient way to split an edge into a directed edge.
 *
 * Doesn't have any of the fun properties a real Dedekind completion
 * would have, since we're building this over a integer set that's
 * completely ordered. The least upper bound is the cut. The base set
 * is Dedekind complete.
 *
 * For clarity, the completion isn't happening on the objects
 * themselves, but rather their index.
 */
export class DedekindCompletion<T> {
  public S: T[];
  public cut: number = 0;

  constructor() {
    this.S = new Array<T>();
  }

  /**
   * Returns the lower cut
   */
  get L(): T[] {
    return this.S.slice(0,this.cut);
  }

  /**
   * Conveniently sets the lower cut
   */
  set L(L: T[]) {
    this.S = [...L, ...this.U];
    this.cut = L.length;
  }

  /**
   * Returns the upper cut
   */
  get U(): T[] {
    return this.S.slice(this.cut);
  }

  /**
   * Conveniently sets the upper cut
   */
  set U(U: T[]) {
    this.S.splice(this.cut, this.S.length - this.cut, ...U);
  }

  get cardinality(): number {
    return this.S.length;
  }

  get oneSided(): boolean {
    return this.cut === 0 || this.cut === this.S.length;
  }
}
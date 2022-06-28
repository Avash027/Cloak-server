import pg from "pg";

class Pool {
  _pool = null;

  async connect(options) {
    try {
      this._pool = new pg.Pool(options);

      console.log((await this._pool.query(`SELECT 1 = 1 as CONNECTED;`)).rows);
    } catch (error) {
      console.log(error);
    }
  }

  close() {
    return this._pool.end();
  }

  query(query, params) {
    try {
      return this._pool.query(query, params);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new Pool();

import pool from "../../config/db.js";
import dedent from "dedent";

class AdminRepo {
  static async getAllUsers() {
    let result = { rows: [] };

    result = await pool.query(
      dedent`SELECT UID,VERIFIED,VERIFICATION_TOKEN,BANNED,COLLEGE_NAME,ADMIN FROM USER_AUTH`
    );

    return result.rows;
  }

  static async updateUser(uid, { verified, banned, admin }) {
    let result = { rows: [] };

    result = await pool.query(
      dedent`UPDATE USER_AUTH
            SET VERIFIED = $1,
            BANNED = $2,
            ADMIN = $3
            WHERE UID = $4`,
      [verified, banned, admin, uid]
    );

    return result.rows;
  }

  static async getCollegesInfo() {
    let result = { rows: [] };

    result = await pool.query(
      dedent`SELECT COLLEGE_NAME,DOMAIN_NAME FROM COLLEGE_DOMAIN`
    );

    return result.rows;
  }

  static async addCollegeInfo({ collegeName, domainName }) {
    let result = { rows: [] };

    result = await pool.query(
      dedent`INSERT INTO COLLEGE_DOMAIN(COLLEGE_NAME,DOMAIN_NAME)
            VALUES($1,$2)`,
      [collegeName, domainName]
    );

    return result.rows;
  }
}

export default AdminRepo;

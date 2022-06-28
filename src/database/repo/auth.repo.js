import pool from "../../config/db.js";
import dedent from "dedent";

class AuthRepo {
  static async getCollegeName(collegeDomain) {
    let result = { rows: [] };

    result = await pool.query(
      "SELECT COLLEGE_NAME from COLLEGE_DOMAIN WHERE DOMAIN_NAME = $1",
      [collegeDomain]
    );

    return result.rows;
  }

  static async findUserHash(userHash) {
    let result = { rows: [] };

    result = await pool.query("SELECT * FROM USER_AUTH WHERE UID = $1", [
      userHash,
    ]);

    return result.rows;
  }

  static async registerUser({
    uid,
    verificationToken,
    collegeName,
    password,
    profilePic,
  }) {
    let result = { rows: [] };

    result = await pool.query(
      dedent`INSERT INTO USER_AUTH(UID,VERIFICATION_TOKEN,COLLEGE_NAME,PROFILE_PIC_URL,PASSWORD)
        VALUES($1,$2,$3,$4,$5)`,
      [uid, verificationToken, collegeName, profilePic, password]
    );

    return result.rows;
  }

  static async verifyUser(token) {
    return await pool.query(
      dedent`UPDATE USER_AUTH
      SET VERIFIED = 't'
      WHERE VERIFICATION_TOKEN = $1`,
      [token]
    );
  }

  static async getUser(uid) {
    const { rows } = await pool.query(
      dedent`SELECT UID,PROFILE_PIC_URL,ADMIN FROM USER_AUTH
    WHERE UID=$1`,
      [uid]
    );

    const result = await pool.query(
      dedent`SELECT PID FROM USER_LIKES
      WHERE UID=$1`,
      [uid]
    );

    const bookMarks = await pool.query(
      dedent`SELECT PID FROM USER_BOOKMARKS
      WHERE UID=$1`,
      [uid]
    );

    const user = {
      uid: rows[0].uid,
      profilePicURL: rows[0].profile_pic_url,
      admin: rows[0].admin,
      likedPosts: result.rows.map((obj) => obj.pid),
      bookMarkedPosts: bookMarks.rows.map((obj) => obj.pid),
    };

    return user;
  }
}

export default AuthRepo;

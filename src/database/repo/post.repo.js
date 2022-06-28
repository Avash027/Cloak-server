import pool from "../../config/db.js";
import dedent from "dedent";

class PostRepo {
  static async createPost(title, content, uid, toxicLevel) {
    const id = (await pool.query("SELECT GEN_RANDOM_UUID()")).rows[0]
      .gen_random_uuid;

    const res = await pool.query(
      dedent`INSERT INTO POSTS(PID,UID,CONTENT,TITLE,CONTENT_TOKEN,TOXICITY)
        VALUES($1,$2,$3::text,$4::varchar,TO_TSVECTOR('english' , CONCAT($3,' ',$4)),$5);`,
      [id, uid, content, title, toxicLevel]
    );
    await pool.query(dedent`INSERT INTO LIKES(PID,LIKES) VALUES($1 , $2)`, [
      id,
      0,
    ]);

    return id;
  }

  static async getPosts(offset, limit) {
    let res = [];

    res = await pool.query(
      dedent`SELECT * FROM POSTS
      ORDER BY CREATED_AT DESC
      OFFSET $1
      LIMIT $2
      ;`,
      [offset, limit]
    );

    for (let i = 0; i < res.rows.length; i++) {
      const { rows } = await pool.query(
        `SELECT profile_pic_url,college_name from user_auth where uid = $1;`,
        [res.rows[i].uid]
      );

      res.rows[i].profilePicUrl = rows[0].profile_pic_url;
      res.rows[i].collegeName = rows[0].college_name;

      const likesCount = await pool.query(
        dedent`SELECT LIKES FROM LIKES WHERE PID = $1`,
        [res.rows[i].pid]
      );

      res.rows[i].likesCount = likesCount.rows[0].likes;
    }

    return res.rows;
  }

  static async updateLike(uid, pid, isLike) {
    if (isLike) {
      await pool.query(
        dedent`INSERT INTO USER_LIKES(pid,uid) VALUES ($1,$2);`,
        [pid, uid]
      );

      await pool.query(
        dedent`UPDATE LIKES
      SET LIKES = LIKES+1
      WHERE PID = $1`,
        [pid]
      );
    } else {
      await pool.query(
        dedent`DELETE FROM USER_LIKES
    WHERE UID = $1 AND PID = $2`,
        [uid, pid]
      );

      await pool.query(
        dedent`UPDATE LIKES
      SET LIKES = LIKES-1
      WHERE PID = $1`,
        [pid]
      );
    }
  }

  static async updateBookmarks(uid, pid, isBookmarked) {
    if (!isBookmarked)
      await pool.query(
        dedent`INSERT INTO USER_bookmarks(pid,uid) VALUES ($1,$2);`,
        [pid, uid]
      );
    else
      await pool.query(
        dedent`DELETE FROM USER_bookmarks
    WHERE UID = $1 AND PID = $2`,
        [uid, pid]
      );
  }

  static async getOnePost(pid) {
    let result = {};

    const { rows } = await pool.query(
      dedent`SELECT * FROM POSTS
    WHERE PID = $1;`,
      [pid]
    );

    result = {
      ...rows[0],
      likes: 0,
      profilePicUrl: "",
      collegeName: "",
    };

    const { rows: likes } = await pool.query(
      dedent`SELECT LIKES FROM LIKES WHERE PID = $1`,
      [pid]
    );

    result.likes = likes[0].likes;

    const { rows: user } = await pool.query(
      dedent`SELECT profile_pic_url,college_name from user_auth where uid = $1;`,
      [result.uid]
    );

    result.profilePicUrl = user[0].profile_pic_url;
    result.collegeName = user[0].college_name;

    const { rows: comments } = await pool.query(
      dedent`SELECT * FROM COMMENTS
    WHERE PID = $1;`,
      [pid]
    );

    result.comments = [];
    result.comments = [...comments];

    for (let i = 0; i < result.comments.length; i++) {
      const { rows } = await pool.query(
        dedent`SELECT PROFILE_PIC_URL FROM USER_AUTH 
      WHERE UID = $1;`,
        [result.comments[i].uid]
      );

      console.log(rows[0]);

      result.comments[i].profilePicUrl = rows[0].profile_pic_url;
    }

    return result;
  }

  static async createComment(uid, pid, content) {
    const id = (await pool.query("SELECT GEN_RANDOM_UUID()")).rows[0]
      .gen_random_uuid;

    await pool.query(
      dedent`INSERT INTO COMMENTS (CID,UID,PID,CONTENT) 
      VALUES ($1,$2,$3,$4)`,
      [id, uid, pid, content]
    );

    return id;
  }

  static async getMyPosts(uid, offset, limit) {
    let res = [];

    res = await pool.query(
      dedent`SELECT * FROM POSTS
      WHERE UID = $1
      OFFSET $2
      LIMIT $3;`,
      [uid, offset, limit]
    );

    for (let i = 0; i < res.rows.length; i++) {
      const { rows } = await pool.query(
        `SELECT profile_pic_url,college_name from user_auth where uid = $1;`,
        [res.rows[i].uid]
      );

      res.rows[i].profilePicUrl = rows[0].profile_pic_url;
      res.rows[i].collegeName = rows[0].college_name;

      const likesCount = await pool.query(
        dedent`SELECT LIKES FROM LIKES WHERE PID = $1`,
        [res.rows[i].pid]
      );

      res.rows[i].likesCount = likesCount.rows[0].likes;
    }

    return res.rows;
  }

  static async getMyBookMarkedPosts(uid, offset, limit) {
    let res = [];

    res = await pool.query(
      dedent`SELECT * FROM POSTS
        WHERE PID IN (SELECT PID FROM USER_bookmarks WHERE UID = $1)
        OFFSET $2
        LIMIT $3;`,
      [uid, offset, limit]
    );

    for (let i = 0; i < res.rows.length; i++) {
      const { rows } = await pool.query(
        `SELECT profile_pic_url,college_name from user_auth where uid = $1;`,
        [res.rows[i].uid]
      );

      res.rows[i].profilePicUrl = rows[0].profile_pic_url;
      res.rows[i].collegeName = rows[0].college_name;

      const likesCount = await pool.query(
        dedent`SELECT LIKES FROM LIKES WHERE PID = $1`,
        [res.rows[i].pid]
      );

      res.rows[i].likesCount = likesCount.rows[0].likes;
    }

    return res.rows;
  }

  static async getMyLikedPosts(uid, offset, limit) {
    let res = [];

    res = await pool.query(
      dedent`SELECT * FROM POSTS
          WHERE PID IN (SELECT PID FROM USER_LIKES WHERE UID = $1)
          OFFSET $2
          LIMIT $3;`,
      [uid, offset, limit]
    );

    for (let i = 0; i < res.rows.length; i++) {
      const { rows } = await pool.query(
        `SELECT profile_pic_url,college_name from user_auth where uid = $1;`,
        [res.rows[i].uid]
      );

      res.rows[i].profilePicUrl = rows[0].profile_pic_url;
      res.rows[i].collegeName = rows[0].college_name;

      const likesCount = await pool.query(
        dedent`SELECT LIKES FROM LIKES WHERE PID = $1`,
        [res.rows[i].pid]
      );

      res.rows[i].likesCount = likesCount.rows[0].likes;
    }

    return res.rows;
  }

  static async deletePost(pid) {
    await pool.query(
      dedent`DELETE FROM POSTS
      WHERE PID = $1`,
      [pid]
    );
  }
}

export default PostRepo;

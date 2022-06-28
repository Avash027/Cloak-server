import express from "express";
import morgan from "morgan";
import cors from "cors";
import database from "./config/db.js";
import auth from "./routes/auth.routes.js";
import post from "./routes/post.routes.js";

class App {
  constructor(port = 3030) {
    this.configureServer();
    this.configureMiddleware();
    this.configureRouters();
    this.connectDatabase();
    this.PORT = port;
  }

  configureServer() {
    this.app = express();
  }

  configureMiddleware() {
    this.app.use(express.json({ limit: "50mb" }));
    this.app.use(express.urlencoded({ limit: "50mb", extended: true }));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(morgan("dev"));
  }

  configureRouters() {
    this.app.use("/api", auth);
    this.app.use("/api", post);
  }

  connectDatabase() {
    if (process.env.env.NODE_ENV === "PRODUCTION") {
      database.connect({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      database.connect({
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        max: process.env.DB_MAX,
      });
    }
  }

  start() {
    this.app.listen(this.PORT, () =>
      console.log(`Server running on PORT ${this.PORT}`)
    );
  }
}

export default App;

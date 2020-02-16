import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express, { Express } from "express";
import session from "express-session";
import passport from "passport";
import { buildSchema } from "type-graphql";

// * Resolvers
import { UserResolver } from "resolvers";

// * Routes
import indexRouter from "routes/index";

// * Environment variables
const PORT: number = parseInt(process.env.PORT!, 10);
const SECRET_TOKEN: string = process.env.SECRET_TOKEN!;

// * Initialize API server
const initServer = async () => {
  // * Build Schema
  const schema = await buildSchema({
    resolvers: [UserResolver],
    authChecker: ({ context: { req } }) => {
      return req.headers.authorization === SECRET_TOKEN;
    },
    emitSchemaFile: false
  });

  // * Create App & Server
  const app = express();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req })
  });

  // * Setup app
  await setupServer(app, server);

  // * Finally start the app
  await startApp(app);
};

// * Setup Express app & ApolloServer
const setupServer = (app: Express, server: ApolloServer) => {
  // * Setup middleware
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  server.applyMiddleware({ app, cors: true });

  // * Init session
  app.use(
    session({
      secret: SECRET_TOKEN,
      resave: true,
      saveUninitialized: true
    })
  );

  // * Wire up routes
  app.use("/", indexRouter);
};

// * Start Express app
const startApp = (app: Express) => {
  // * Start listening on port
  app.listen({ port: PORT }, () =>
    console.log(`🚀 Server ready at http://localhost:${PORT}`)
  );
};

export default initServer;

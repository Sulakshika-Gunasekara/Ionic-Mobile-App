const path = require("path");
const {
  create,
  router,
  defaults,
  bodyParser,
  rewriter,
} = require("json-server");
const auth = require("json-server-auth");

const server = create();
const routerInstance = router(path.join(__dirname, "db.json"));
const middlewares = defaults();

// json-server-auth needs access to the DB
server.db = routerInstance.db;

// Add CORS middleware for mobile app requests
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Optional aliases
server.use(
  rewriter({
    "/signup": "/register",
    "/signin": "/login",
  })
);

// Middlewares (logger, CORS, static, etc.)
server.use(middlewares);
server.use(bodyParser);

// Auth routes (/register, /login, /users/* guards)
server.use(auth);

// Your routes (e.g., /vehicles)
server.use(routerInstance);

const PORT = 4000;
// Bind to all interfaces (0.0.0.0) so it's accessible from network
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock API running at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://192.168.1.78:${PORT}`);
});

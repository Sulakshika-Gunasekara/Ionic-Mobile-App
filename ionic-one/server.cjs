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

// Fixed available vehicles endpoint
server.get("/available-vehicles", (req, res) => {
  const { date, type, location } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Missing required query param 'date' (YYYY-MM-DD)" });
  }

  try {
    // 1) Grab raw collections from lowdb (used by json-server)
    const db = routerInstance.db; // Fixed: use routerInstance.db instead of router.db
    const bookings = db.get("bookings").value() || [];
    let vehicles = db.get("vehicles").value() || [];

    console.log(`\n=== AVAILABILITY CHECK FOR ${date} ===`);
    console.log(`Total vehicles in DB: ${vehicles.length}`);
    console.log(`Total bookings in DB: ${bookings.length}`);

    // 2) Collect booked vehicle IDs for that specific date
    const bookedIds = new Set(
      bookings
        .filter((b) => {
          const bookingDate = String(b.date);
          const requestedDate = String(date);
          const isDateMatch = bookingDate === requestedDate;

          console.log(
            `Booking ID: ${b.id}, Vehicle: ${b.vehicleId}, Date: ${bookingDate}, Matches ${requestedDate}: ${isDateMatch}`
          );

          return isDateMatch;
        })
        .map((b) => String(b.vehicleId))
    );

    console.log(`Booked vehicle IDs for ${date}:`, Array.from(bookedIds));

    // 3) Optional filter by type (case-insensitive)
    if (type && String(type).trim()) {
      const originalCount = vehicles.length;
      vehicles = vehicles.filter(
        (v) => String(v.type).toLowerCase() === String(type).toLowerCase()
      );
      console.log(
        `Filtered by type '${type}': ${originalCount} -> ${vehicles.length} vehicles`
      );
    }

    // 4) Optional filter by location (case-insensitive)
    if (location && String(location).trim()) {
      const originalCount = vehicles.length;
      vehicles = vehicles.filter(
        (v) =>
          String(v.location).toLowerCase() === String(location).toLowerCase()
      );
      console.log(
        `Filtered by location '${location}': ${originalCount} -> ${vehicles.length} vehicles`
      );
    }

    // 5) Exclude booked vehicles for this specific date
    const available = vehicles.filter((v) => {
      const isAvailable = !bookedIds.has(String(v.id));
      console.log(
        `Vehicle ${v.id} (${v.brand} ${v.model}): ${
          isAvailable ? "AVAILABLE" : "BOOKED"
        }`
      );
      return isAvailable;
    });

    console.log(`Final available vehicles: ${available.length}`);
    console.log(`=== END AVAILABILITY CHECK ===\n`);

    // 6) Return available vehicles with count
    res.json({
      success: true,
      count: available.length,
      date: date,
      filters: { type, location },
      bookedVehicleIds: Array.from(bookedIds),
      totalMatchingTypeLocation: vehicles.length,
      vehicles: available,
    });
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Alternative endpoint for just checking availability count
server.get("/vehicles/availability", (req, res) => {
  const { date, type, location } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Date parameter is required (YYYY-MM-DD format)" });
  }

  try {
    const db = routerInstance.db;
    const bookings = db.get("bookings").value() || [];
    let vehicles = db.get("vehicles").value() || [];

    // Apply filters
    if (type) {
      vehicles = vehicles.filter(
        (v) => String(v.type).toLowerCase() === String(type).toLowerCase()
      );
    }

    if (location) {
      vehicles = vehicles.filter(
        (v) =>
          String(v.location).toLowerCase() === String(location).toLowerCase()
      );
    }

    // Get booked vehicle IDs for the date
    const bookedIds = new Set(
      bookings
        .filter((b) => String(b.date) === String(date))
        .map((b) => String(b.vehicleId))
    );

    // Calculate availability
    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter(
      (v) => !bookedIds.has(String(v.id))
    );
    const bookedCount = totalVehicles - availableVehicles.length;

    res.json({
      success: true,
      date: date,
      filters: { type, location },
      total: totalVehicles,
      available: availableVehicles.length,
      booked: bookedCount,
      availableVehicles: availableVehicles,
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Use the router for other endpoints
server.use(routerInstance);

const PORT = 4000;
// Bind to all interfaces (0.0.0.0) so it's accessible from network
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Mock API running at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://192.168.1.78:${PORT}`);
  console.log(`\nAvailable endpoints:`);
  console.log(
    `- GET /available-vehicles?date=YYYY-MM-DD&type=van&location=Colombo`
  );
  console.log(
    `- GET /vehicles/availability?date=YYYY-MM-DD&type=van&location=Colombo`
  );
});

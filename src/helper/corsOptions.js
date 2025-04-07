const corsOptions = {
  origin: [
    "http://10.0.60.43:3000",
    "http://10.0.60.43:3001",
    "http://10.0.60.43:3002",
    "http://10.0.60.43:3003",
    "http://10.0.60.43:3004",
    "http://10.0.60.43:3005",
    "http://localhost:3000",
    "http://10.0.60.44:3002",
    "http://localhost:3001",
    "http://10.0.60.44:3003",
    "http://10.0.60.44:8003",
    "http://178.128.174.197:8002",
    "http://178.128.174.197:8003",
    "http://178.128.174.197:4173",
    "http://178.128.174.197:4174",
    "http://172.19.0.1:8003",
    "https://nardo.app",
    "https://admin.nardo.app",
  ],
  credentials: true,
};

module.exports = corsOptions;

const mongoose = require("mongoose");
const dns = require("dns");

// Some routers/ISPs intercept or mishandle DNS SRV record lookups (the query
// type mongodb+srv:// requires), even after the OS's configured DNS server is
// changed — the interception happens before that setting is honored. Setting
// Node's own resolver here bypasses the OS/router resolver entirely for this
// process, querying Google/Cloudflare DNS directly. This fixes
// "querySrv ESERVFAIL" errors that persist even after changing Windows'
// network DNS settings.
dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

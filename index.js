const dotenv = require("dotenv");
dotenv.config();
const http = require("http");
const app = require("./app.js");

const port = process.env.PORT || 8080;
// CREATE SERVER
const server = http.createServer(app);

// LISTENING ON PORT AFTER SETTING IO
server.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


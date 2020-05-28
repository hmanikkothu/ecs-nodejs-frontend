// use the express framework
var express = require("express");
var app = express();
var got = require("got");

var fs = require("fs");
//var code_hash = fs.readFileSync("code_hash.txt", "utf8");
//console.log(code_hash);
console.log("The IPADDRESS is:", process.env.IP);
console.log("The message is:", process.env.AZ);
//console.log('The hash is: %s', code_hash);

var ipaddress = process.env.IP || "no-ip";
var az = process.env.AZ || "none";
var message = process.env.AZ;
var BACKEND_SVC_URL = process.env.BACKEND_SVC_URL;

// morgan: generate apache style logs to the console
var morgan = require("morgan");
app.use(morgan("combined"));

// express-healthcheck: respond on /health route for LB checks
app.use("/health", require("express-healthcheck")());

// main route
app.get("/", function (req, res) {
  sendResponse(res);
});

app.get("/nodejs", function (req, res) {
  sendResponse(res);
});

app.get("/nodejs/api", function (req, res) {
  res.send({
    from: "Node.js frontend",
    message: message,
    commit: code_hash,
  });
});

// health route - variable subst is more pythonic just as an example
var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Backend app listening on port %s!", port);
});

function sendResponse(res) {
  res.set({
    "Content-Type": "text/plain",
  });
  // res.send(`Node.js backend: Hello! from ${message} commit ${code_hash}`);
  var msg =
    `Hello World! from ${ipaddress} in AZ-${az} which has been up for ` +
    process.uptime() +
    "ms";

  (async () => {
    try {
      const response = await got(BACKEND_SVC_URL);
      console.log(response.body);
      res.send(msg + "\n Response from BE: " + response.body);
    } catch (error) {
      console.log(error.response.body);
      //=> 'Internal server error ...'
    }
  })();
}

// export the server to make tests work
module.exports = server;

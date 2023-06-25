const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = 3002;

const app = express();

app.use('/rpc/v0', createProxyMiddleware({
  target: 'http://localhost:1234',
}));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

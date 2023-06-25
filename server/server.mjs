import express from 'express';
import { HttpJsonRpcConnector, LotusClient } from "filecoin.js";
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

const localNodeUrl = "http://localhost:1234/rpc/v0";
const adminAuthToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.HQqs47ezEiD67HbbIy6eVkJpBAqlOogyYvQwL-UKZdI"
const localConnector = new HttpJsonRpcConnector({ url: localNodeUrl, token: adminAuthToken });
const lotusClient = new LotusClient(localConnector);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3002;
const app = express();

app.use('/rpc/v0', createProxyMiddleware({
  target: 'http://localhost:1234',
}));

// Get files to upload to Filecoin
app.post("/license", async (req, res) => {
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    const file = files.data[0];
    console.log(JSON.stringify(file));

    // creates a valid name by removing spaces
    const fileName = encodeURIComponent(file.originalFilename.replace(/\s/g, "-"));
    fs.renameSync(file.filepath, path.join("./data", fileName));

    // fs.writeFile(newPath, rawData, function (err) {
    //     if (err) console.log(err)
    //     return res.send("Successfully uploaded")
    // })

    // // directly upload to filecoin
    // const importResult = await lotusClient.client.import({
    //     Path: files.filepath,
    //     IsCAR: false,
    // });
  
    // console.log(importResult.Root);

    res.json({ fields, files });
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

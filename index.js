import express from "express";
import bodyParser from "body-parser";
import { webhookHandlerEvents, webhookHandlerConfirmation } from "./webhook/handler.js";

const app = express();
app.use(bodyParser.json());

app.post("/webhook", webhookHandlerEvents);
app.get("/webhook", webhookHandlerConfirmation);

app.listen(3000, () => {
  console.log("🚀 Bot running at http://localhost:3000");
});
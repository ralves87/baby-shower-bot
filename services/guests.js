import fs from "fs";
import config from "../config/config.js";

export function loadGuests() {
  return JSON.parse(fs.readFileSync(config.files.guests, "utf8"));
}

export function loadConfirmations() {
  if (!fs.existsSync(config.files.confirmations)) return [];
  return JSON.parse(fs.readFileSync(config.files.confirmations, "utf8"));
}

export function saveConfirmations(data) {
  fs.writeFileSync(config.files.confirmations, JSON.stringify(data, null, 2));
}
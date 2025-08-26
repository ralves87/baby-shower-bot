import config from "../config/config.js";

export function isConfirmationDeadlineOver() {
  const now = new Date();
  const deadline = new Date(config.deadlines.confirmation);
  return now > deadline;
}
import config from "../config/config.js";
import { handleAdminCommand } from "../commands/admin.js";
import { loadConfirmations, saveConfirmations } from "../services/guests.js";
import { sendMessage } from "../services/whatsapp.js";
import { isConfirmationDeadlineOver } from "../utils/deadline.js";

export async function webhookHandlerEvents(req, res) {
  const data = req.body;
  res.sendStatus(200);

  if (!data.entry) return;

  if (data.entry) {
    const changes = data.entry[0].changes[0].value;

    if (changes.statuses) return;

    if (changes.messages) {
      const msg = changes.messages[0];
      const from = msg.from;
      const type = msg.type;

      if (type === "text") {
        const text = msg.text.body.trim().toUpperCase();

        if (config.admins.includes(from) && text.startsWith("/")) { 
          if (Object.values(config.commands.admin).includes(text)) {
            console.log("Command detected:", text);
            await handleAdminCommand(from, text);
          }
        }

        if (text === config.commands.user.confirm) {
          if (isConfirmationDeadlineOver()) {
            let confirmations = loadConfirmations();

            confirmations = confirmations.map((g) => {
              if (g.phone === from) {
                if (!g.closed) {
                  sendMessage(from, { 
                    type: "text", 
                    text: { body: config.messages.confirmation_closed } 
                  });
                }
                return { ...g, closed: true };
              }
              return g;
            });

            saveConfirmations(confirmations);
            return;
          }

          let confirmations = loadConfirmations();
          confirmations = confirmations.map((g) =>
            g.phone === from ? { ...g, status: true } : g
          );
          saveConfirmations(confirmations);

          await sendMessage(from, {
            type: "text",
            text: { body: config.messages.confirmation },
          });
        }
      }

      if (type === "button" && msg.button) {
        const confirm = msg.button.payload === config.buttons.confirm.payload;

        if (isConfirmationDeadlineOver()) {
          let confirmations = loadConfirmations();

          confirmations = confirmations.map((g) => {
            if (g.phone === from) {
              if (!g.closed) {
                sendMessage(from, { 
                  type: "text", 
                  text: { body: config.messages.confirmation_closed } 
                });
              }
              return { ...g, closed: true };
            }
            return g;
          });

          saveConfirmations(confirmations);
          return;
        }

        if (confirm) {
          let confirmations = loadConfirmations();
          confirmations = confirmations.map((g) =>
            g.phone === from ? { ...g, status: true } : g
          );
          saveConfirmations(confirmations);

          await sendMessage(from, {
            type: "text",
            text: { body: config.messages.confirmation },
          });
        }
      }

      if (type === "button" && msg.button) {
        const not_confirm = msg.button.payload === config.buttons.decline.payload;

        if (isConfirmationDeadlineOver()) {
          let confirmations = loadConfirmations();

          confirmations = confirmations.map((g) => {
            if (g.phone === from) {
              if (!g.closed) {
                sendMessage(from, { 
                  type: "text", 
                  text: { body: config.messages.confirmation_closed } 
                });
              }
              return { ...g, closed: true };
            }
            return g;
          });

          saveConfirmations(confirmations);
          return;
        }

        if (not_confirm) {
          let confirmations = loadConfirmations();
          confirmations = confirmations.map((g) =>
            g.phone === from ? { ...g, status: false } : g
          );
          saveConfirmations(confirmations);

          await sendMessage(from, {
            type: "text",
            text: { body: config.messages.decline },
          });
        }
      }
    }
  }

  res.sendStatus(200);
}

export async function webhookHandlerConfirmation(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
      console.log("Webhook was verified successfully!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
}
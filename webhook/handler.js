import config from "../config/config.js";
import { handleAdminCommand } from "../commands/admin.js";
import { loadConfirmations, saveConfirmations } from "../services/guests.js";
import { sendMessage } from "../services/whatsapp.js";
import { isConfirmationDeadlineOver } from "../utils/deadline.js";


function updateConfirmations(from, updateFn) {
  let confirmations = loadConfirmations();
  confirmations = confirmations.map((g) =>
    g.phone === from ? updateFn(g) : g
  );
  saveConfirmations(confirmations);
}

async function handleDeadlineOver(from) {
  updateConfirmations(from, async (g) => {
    if (!g.closed) {
      await sendMessage(from, {
        type: "text",
        text: { body: config.messages.confirmation_closed },
      });
    }
    return { ...g, closed: true };
  });
}

async function handleConfirmation(from, status, message) {
  updateConfirmations(from, (g) => ({ ...g, status }));
  await sendMessage(from, {
    type: "text",
    text: { body: message },
  });
}

export async function webhookHandlerEvents(req, res) {
  const data = req.body;
  res.sendStatus(200);

  if (!data.entry) return;
  const changes = data.entry[0].changes[0].value;

  if (changes.statuses) return;
  if (!changes.messages) return;

  const msg = changes.messages[0];
  const from = msg.from;
  const type = msg.type;

  if (type === "text") {
    const text = msg.text.body.trim().toUpperCase();

    if (config.admins.includes(from) && text.startsWith("/")) {
      if (Object.values(config.commands.admin).includes(text)) {
        console.log("Command detected:", text);
        await handleAdminCommand(from, text);
        return;
      }
    }

    if (text === config.commands.user.confirm) {
      if (isConfirmationDeadlineOver()) {
        return handleDeadlineOver(from);
      }
      return handleConfirmation(from, true, config.messages.confirmation);
    }

    // If the message is not recognized, send a default response
    await sendMessage(from, {
      type: "text",
      text: { body: config.messages.unknown },
    });
  }

  if (type === "button" && msg.button) {
    const payload = msg.button.payload;

    if (isConfirmationDeadlineOver()) {
      return handleDeadlineOver(from);
    }

    if (payload === config.buttons.confirm.payload) {
      return handleConfirmation(from, true, config.messages.confirmation);
    }

    if (payload === config.buttons.decline.payload) {
      return handleConfirmation(from, false, config.messages.decline);
    }
  }
}

export async function webhookHandlerConfirmation(req, res) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === config.whatsapp.verifyToken) {
      console.log("Webhook was verified successfully!");
      return res.status(200).send(challenge);
    }
    return res.sendStatus(403);
  }

  res.sendStatus(400);
}
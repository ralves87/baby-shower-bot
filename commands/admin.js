import { loadGuests, loadConfirmations, saveConfirmations } from "../services/guests.js";
import { distributeDiapers } from "../services/diapers.js";
import { sendMessage, sendInvitation, sendLocation, sendReminder } from "../services/whatsapp.js";
import config from "../config/config.js";

export async function handleAdminCommand(phone, command) {
  if (command === config.commands.admin.send) {
    const guests = loadGuests();
    let confirmations = loadConfirmations();

    if (confirmations.length === 0) {
      confirmations = distributeDiapers(guests, { ...config.diapers });
      saveConfirmations(confirmations);
    }

    let sentCount = 0;

    for (const guest of confirmations) {
      if (!guest.sent) {
        await sendInvitation(guest);
        guest.sent = true;
        sentCount++;
      }
    }

    saveConfirmations(confirmations);

    if (sentCount > 0) {
      await sendMessage(phone, { 
        type: "text", 
        text: { body: `${sentCount} ${config.messages.all_invites_sent}` }
      });
    } else {
      await sendMessage(phone, { 
        type: "text", 
        text: { body: `${config.messages.no_pending_invites}` }
      });
    }
  }

  if (command === config.commands.admin.list) {
    let confirmations = loadConfirmations();

    confirmations.sort((a, b) => {
      const order = { pending: 0, true: 1, false: 2 };
      return order[a.status] - order[b.status];
    });

    let list = `${config.titles.confirmation_list}\n\n`;

    let countPending = 0;
    let countConfirmed = 0;
    let countDeclined = 0;
    let diapersCount = { P: 0, M: 0, G: 0 };

    confirmations.forEach((g) => {
      let statusLabel;
      if (g.status === "pending") {
        statusLabel = config.labels.pending;
        countPending++;
      } else if (g.status === true) {
        statusLabel = config.labels.confirmed;
        countConfirmed++;
        diapersCount[g.diaper]++;
      } else {
        statusLabel = config.labels.declined;
        countDeclined++;
      }
      list += `- ${g.name}: ${statusLabel} *(${g.diaper})*\n`;
    });

    list += `${config.titles.total_guests} ${confirmations.length}\n`;
    list += `${config.labels.confirmed}: ${countConfirmed}\n`;
    list += `${config.labels.declined}: ${countDeclined}\n`;
    list += `${config.labels.pending}: ${countPending}\n`;

    await sendMessage(phone, { type: "text", text: { body: list } });
  }

  if (command === config.commands.admin.missing) {
    const confirmations = loadConfirmations();
    let diapersCount = { P: 0, M: 0, G: 0 };

    confirmations.forEach((g) => {
      if (g.status === true) {
        diapersCount[g.diaper]++;
      }
    });

    const missing = {
      P: Math.max(0, config.diapers.P - diapersCount.P),
      M: Math.max(0, config.diapers.M - diapersCount.M),
      G: Math.max(0, config.diapers.G - diapersCount.G),
    };

    let msg = `${config.titles.diapers_count}\n\n`;

    msg += `*Fralda P*\n`;
    msg += `- ${config.labels.diapers.confirmed} *${diapersCount.P}*\n`;
    msg += `- ${config.labels.diapers.target} *${config.diapers.P}*\n`;
    msg += `- ${config.labels.diapers.missing} *${missing.P}*\n\n`;

    msg += `*Fralda M*\n`;
    msg += `- ${config.labels.diapers.confirmed} *${diapersCount.M}*\n`;
    msg += `- ${config.labels.diapers.target} *${config.diapers.M}*\n`;
    msg += `- ${config.labels.diapers.missing} *${missing.M}*\n\n`;

    msg += `*Fralda G*\n`;
    msg += `- ${config.labels.diapers.confirmed} *${diapersCount.G}*\n`;
    msg += `- ${config.labels.diapers.target} *${config.diapers.G}*\n`;
    msg += `- ${config.labels.diapers.missing} *${missing.G}*`;

    await sendMessage(phone, { type: "text", text: { body: msg } });
  }

  if (command === config.commands.admin.location) {
    const confirmations = loadConfirmations();
    const confirmedGuests = confirmations.filter(g => g.status === true);

    console.log("Sending location to confirmed guests:", confirmedGuests);

    for (const guest of confirmedGuests) {
      await sendLocation(guest);
    }

    await sendMessage(phone, {
      type: "text",
      text: { body: config.messages.location_sent }
    });
  }

  if (command === config.commands.admin.reminder) {
    const confirmations = loadConfirmations();
    const pendingGuests = confirmations.filter(g => g.status === 'pending');

    console.log("Sending reminder to pending guests:", pendingGuests);

    for (const guest of pendingGuests) {
      await sendReminder(guest);
    }

    await sendMessage(phone, {
      type: "text",
      text: { body: config.messages.reminder_sent }
    });
  }
}
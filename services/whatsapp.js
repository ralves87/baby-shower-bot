import axios from "axios";
import config from "../config/config.js";

export async function sendMessage(phone, content) {
  try {
    await axios.post(
      `https://graph.facebook.com/v23.0/${config.whatsapp.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: phone,
        ...content,
      },
      {
        headers: {
          Authorization: `Bearer ${config.whatsapp.token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error sending message:", err.response?.data || err.message);
  }
}

export async function sendInvitation(guest) {
  const content = {
    type: "template",
    template: {
      name: config.templates.invite.name,
      language: { code: config.templates.language },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "image",
              image: {
                id: config.templates.invite.imageId,
              },
            },
          ],
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: guest.name },
            { type: "text", text: guest.diaper },
          ],
        },
      ],
    },
  };

  await sendMessage(guest.phone, content);
  console.log(`Invite sent to ${guest.name}`);
}

export async function sendLocation(guest) {
  const content = {
    type: "template",
    template: {
      name: config.templates.location.name,
      language: { code: config.templates.language },
      components: [
        {
          type: "header",
          parameters: [
            {
              type: "location",
              location: {
                  latitude: config.templates.location.coordinates.latitude,
                  longitude: config.templates.location.coordinates.longitude,
                  name: config.templates.location.coordinates.name,
                  address: config.templates.location.coordinates.address
              }
            }
          ]
        },
        {
          type: "body",
          parameters: [
            { type: "text", text: guest.name },
          ]
        }
      ]
    }
  };

  await sendMessage(guest.phone, content);
  console.log(`Location sent to ${guest.name}`);
}

export async function sendReminder(guest) {
  const content = {
    type: "template",
    template: {
      name: config.templates.reminder.name,
      language: { code: config.templates.language },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: guest.name },
          ]
        }
      ]
    }
  };

  await sendMessage(guest.phone, content);
  console.log(`Reminder sent to ${guest.name}`);
}
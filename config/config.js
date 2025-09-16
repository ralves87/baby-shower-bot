import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  whatsapp: {
    token: process.env.WHATSAPP_TOKEN || "",
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || "",
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || "",
  },
  deadlines: {
    confirmation: "2025-11-01T23:59:59"
  },
  admins: process.env.ADMINS ? process.env.ADMINS.split(",") : [],
  templates: {
    language: "pt_BR",
    invite: {
      name: process.env.TEMPLATE_INVITE_NAME || "",
      imageId: process.env.TEMPLATE_INVITE_IMAGE_ID || "",
    },
    location: {
      name: process.env.TEMPLATE_LOCATION_NAME || "",
      coordinates: {
        latitude: process.env.TEMPLATE_LOCATION_COORDINATES_LATITUDE || "",
        longitude: process.env.TEMPLATE_LOCATION_COORDINATES_LONGITUDE || "",
        name: process.env.TEMPLATE_LOCATION_COORDINATES_NAME || "",
        address: process.env.TEMPLATE_LOCATION_COORDINATES_ADDRESS || ""
      }
    },
    reminder: {
      name: process.env.TEMPLATE_REMINDER_NAME || ""
    }
  },
  commands: {
    admin: {
      send: "/ENVIAR",
      list: "/CONVIDADOS",
      missing: "/FRALDAS",
      location: "/LOCALIZAÇÃO",
      reminder: "/LEMBRETE"
    },
    user: {
      confirm: "CONFIRMAR"
    },
  },
  files: {
    guests: path.join(__dirname, "../data/guests.json"),
    confirmations: path.join(__dirname, "../data/confirmations.json"),
  },
  diapers: { 
    P: 0, 
    M: 1, 
    G: 1 
  },
  messages: {
    confirmation_closed: "🚫 Infelizmente, o prazo para confirmação já terminou.\n\nSe tiver alguma dúvida, envie uma mensagem no privado para os responsáveis.",
    confirmation: "🎉 Obrigado pela confirmação, te esperamos lá!",
    decline: "Que pena, sem problemas! Mas se mudar de ideia, é só mandar a qualquer momento uma mensagem com a palavra: *CONFIRMAR*",
    all_invites_sent: "Convites enviados com sucesso.",
    no_pending_invites: "Nenhum convite pendente para envio.",
    location_sent: "Localização enviada para todos os confirmados!",
    reminder_sent: "Lembrete enviado para todos os convidados pendentes!",
    unknown: "Oi 👋, este número é gerenciado por um BOT, infelizmente não conseguimos ler sua mensagem. Qualquer dúvida entre em contato com os responsáveis no privado."
  },
  titles: {
    confirmation_list: "📋 Lista de confirmações:",
    diapers_count: "🍼 Fraldas confirmadas x faltantes:",
    total_guests: "📊 Total de convidados:"
  },
  labels: {
    pending: "⏳ Pendente",
    confirmed: "✅ Confirmado",
    declined: "❌ Não irá",
    diapers: {
      size: {
        p: "P",
        m: "M",
        g: "G"
      },
      confirmed: "Confirmadas:",
      target: "Meta:",
      missing: "Faltam:"
    }
  },
  buttons: {
    confirm: {
      title: "Contem comigo",
      payload: "Contem comigo"
    },
    decline: {
      title: "Não poderei ir",
      payload: "Não poderei ir"
    }
  }
};
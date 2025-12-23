const amqp = require("amqplib");
require("dotenv").config();

const {
  RABBIT_URL,
  QUEUE_RESULTS = "job_results",
  WHATSAPP_API_URL,
  WHATSAPP_GROUP_ID,
} = process.env;


const { formatJobMessage } = require("./src/utils/formatJobMessage");


function formatMessage(data) {
  const job = data.extracted;
  console.log(job)
  return formatJobMessage(job);
}

async function sendToWhatsapp(message) {
  const res = await fetch(`${WHATSAPP_API_URL}/groups/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      number: WHATSAPP_GROUP_ID,
      message,
    }),
  });

  if (!res.ok) {
    throw new Error(`WhatsApp API error ${res.status}`);
  }
}

async function start() {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE_RESULTS, { durable: true });
  channel.prefetch(1);

  console.log("🟢 Worker WhatsApp aguardando mensagens...");

  channel.consume(QUEUE_RESULTS, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      const message = formatMessage(payload);

      console.log(typeof message)
      await sendToWhatsapp(`${message}`);

      channel.ack(msg);
      console.log("📨 Mensagem enviada para WhatsApp");
    } catch (err) {
      console.error("❌ Erro WhatsApp:", err.message);
      channel.nack(msg, false, true); // requeue
    }
  });
}

start().catch(console.error);

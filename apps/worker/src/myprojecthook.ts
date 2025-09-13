import axios from "axios";

export async function sendWebhook(url: string, cookie: string, body: string) {
  try {
    console.log("IN sendhook")
    const response = await axios.post(url, body, {
      headers: {
        "Cookie": cookie // optional, if needed
      }
    });
    console.log("Webhook sent successfully:", response.status, response.data);
  } catch (error: any) {
    console.error("Error sending webhook:", error.response?.status, error.message);
  }
}

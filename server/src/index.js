import "dotenv/config.js";
import cron from "node-cron";
import twilio from "twilio";
import express from "express";
import { getTomorrowsCatSitters } from "./catSittingService.js";

// Twilio credentials from environment
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const twilioClient = twilio(accountSid, authToken);
// Exactly 10 digits long
// The first digit isn’t 0 or 1 (since valid Canadian area codes start with digits 2–9).
const pattern = /^[2-9]\d{9}$/;

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("Hello from cat-sitter server");
});

cron.schedule(
    "* * * * *",
    async () => {
        console.log("[CRON] 9am job started");

        // 1. Fetch who has to cat-sit tomorrow
        const sitter = await getTomorrowsCatSitters();
        console.log(sitter);
        if (!sitter.phone) {
            return;
        }

        if (!pattern.test(sitter.phone)) {
            console.log(
                `Failed to send ${sitter.name} an SMS. Invalid phone number:` +
                    sitter.phone
            );

            return;
        }

        // 2. Send them an SMS
        try {
            await twilioClient.messages.create({
                body: `Hey ${sitter.name}, just a reminder: you have cat-sitting duty tomorrow! Thank you so much once again.\n- Andriy & Andrea`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: "+1" + sitter.phone,
            });
            await twilioClient.messages.create({
                body: `Successfully sent ${sitter.name} a reminder!`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: "+1" + "6472011757",
            });
            console.log(
                `[SMS] Sent reminder to ${sitter.name} at ${sitter.phone}`
            );
        } catch (err) {
            console.error(`[SMS ERROR] Could not send to ${sitter.phone}`, err);
        }
    },
    {
        timezone: "America/Toronto",
    }
);

// start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schedule = require('node-schedule');
const OneSignal = require('onesignal-node');

const app = express();
const port = process.env.PORT || 3000;

// OneSignal Client initialization
const client = new OneSignal.Client(
    process.env.ONESIGNAL_APP_ID || 'YOUR-ONESIGNAL-APP-ID',
    process.env.ONESIGNAL_API_KEY || 'YOUR-ONESIGNAL-API-KEY'
);

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store reminders in memory (replace with database in production)
const reminders = [];

// API endpoint to create a new reminder
app.post('/api/reminders', async (req, res) => {
    const { medicationName, dosage, time, phoneNumber } = req.body;
    
    try {
        const reminder = {
            id: Date.now().toString(),
            medicationName,
            dosage,
            time,
            phoneNumber
        };
        
        // Schedule the notification
        schedule.scheduleJob(time, async () => {
            try {
                const notification = {
                    contents: {
                        en: `Time to take ${medicationName} - ${dosage}!`
                    },
                    include_phone_numbers: [phoneNumber]
                };
                
                await client.createNotification(notification);
            } catch (error) {
                console.error('Error sending notification:', error);
            }
        });
        
        reminders.push(reminder);
        res.status(201).json(reminder);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create reminder' });
    }
});

// API endpoint to get all reminders
app.get('/api/reminders', (req, res) => {
    res.json(reminders);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

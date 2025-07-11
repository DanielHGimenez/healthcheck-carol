process.env.TZ = 'America/Sao_Paulo';
const { Client, LocalAuth } = require('whatsapp-web.js')
const express = require('express')
const qrcode = require('qrcode-terminal')
const cron = require('node-cron')

if (process.env.PHONE == null) {
    throw new Error("Phone not found!");
}

const contactPhone = process.env.PHONE
const contactSuffix = '@c.us'
const contact = contactPhone + contactSuffix

const client = new Client({ authStrategy: new LocalAuth() })
const app = express()

const nextId = 1
const messages = []
const morningExecution = { lastDayExecuted: 0 }
const afternoonExecution = { lastDayExecuted: 0 }
const nightExecution = { lastDayExecuted: 0 }

app.get('/', (req, res) => {
    res.send('OK')
})

app.post('/messages', (req, res) => {
    messages.push({
        id: nextId,
        text: req.body
    })
    nextId++
})

app.get('/messages', (req, res) => {
    res.json(messages)
})

app.delete('/messages/:id', (req, res) => {
    const messageID = parseInt(req.params.id)
    messages.splice(messages.findIndex(message => message.id == messageID), 1)
})

function randomBetween(min, max) {
    return Math.floor(
        Math.random() * (max - min) + min
    )
}

function sendMessages(lastHourToSend, execution) {
    const now = Date.parse(Date.now().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }))
    if (execution.lastDayExecuted != now.getDay() && (27 === randomBetween(1, 100) ||  lastHourToSend === now.getHours())) {
        client.sendMessage(contact, 'Eae')
        messages.forEach(message => client.sendMessage(contact, message.text))
    }
}

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
})

client.on('ready', () => {
    console.log('Client is ready!');
    app.listen(process.env.PORT || 3000, () => console.log('Express is ready!'))
    cron.schedule('* 11-13 * * *', sendMessages(13, morningExecution))
    cron.schedule('* 15-16 * * *', sendMessages(16, afternoonExecution))
    cron.schedule('* 19-23 * * *', sendMessages(23, nightExecution))
    console.log('Cron is ready!')
})

client.initialize();

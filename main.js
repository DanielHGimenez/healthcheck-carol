const { Client, LocalAuth } = require('whatsapp-web.js')
const express = require('express')
const qrcode = require('qrcode-terminal')
const cron = require('node-cron')

const contactPhone = '554198571813'
const contactSuffix = '@c.us'
const contact = contactPhone + contactSuffix

const client = new Client({ authStrategy: new LocalAuth() })
const app = express()

app.get('/', (req, res) => {
    res.send('OK')
})

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
})

client.on('ready', () => {
    console.log('Client is ready!');
    app.listen(3000, () => console.log('Express is ready!'))
    cron.schedule('0 11-20 * * *', () => {
        function randomBetween(min, max) {
            return Math.floor(
                Math.random() * (max - min) + min
            )
        }

        const phrasesHowUDoing = [
            'Como andas?',
            'Como vc está?',
            'Como cê tá?'
        ]

        client.getChatById(contact)
            .then(chat => chat.fetchMessages({ limit: 1 }))
            .then(message => {
                const dateLastMessage = Date.parse(
                    Date.parse(message[0].timestamp * 1000)
                        .toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
                )
                const now = Date.parse(
                    Date.now()
                        .toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
                )

                if (
                    (
                            dateLastMessage.getYear() < now.getYear()
                        ||  dateLastMessage.getMonth() < now.getMonth()
                        ||  dateLastMessage.getDay() < now.getDay()
                        ||  dateLastMessage.getHours() <= 6
                    ) && (
                            27 === randomBetween(1, 100)
                        ||  20 === now.getHours()
                    )
                ) {
                    client.sendMessage(contact, 'E ae')
                    client.sendMessage(contact, phrasesHowUDoing[randomBetween(0, 2)])
                }
            })
    })
    console.log('Cron is ready!')
})

client.initialize();

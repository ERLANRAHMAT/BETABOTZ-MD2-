const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');

const qrisUrl = 'https://files.catbox.moe/spv9di.jpg'; 

const handler = async (message, { conn }) => {
    const replyMessage = `Metode Pembayaran:\n\nDana: 081289694906\n\nSilakan lakukan pembayaran dan kirim bukti pembayaran dengan caption ID Transaksi.`;
    await message.reply(replyMessage);

    const { imageMessage } = await generateWAMessageContent({
        image: { url: qrisUrl }
    }, {
        upload: conn.waUploadToServer
    });

    const msg = generateWAMessageFromContent(message.chat, {
        imageMessage: {
            ...imageMessage,
            caption: 'Scan QRIS untuk pembayaran'
        }
    }, { quoted: message });

    await conn.relayMessage(message.chat, msg.message, {
        messageId: msg.key.id
    });
};

handler.customPrefix = /^bayar$/i;
handler.command = new RegExp;
module.exports = handler;

// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/sFj3Mh-z1Jk
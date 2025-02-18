const moment = require('moment-timezone');

const handler = async (message, { isOwner }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.store = global.db.data.store || [];
    global.db.data.transactions = global.db.data.transactions || [];

    const storeData = global.db.data.store;
    const transactions = global.db.data.transactions;

    if (!isOwner) throw `Hanya owner yang dapat memproses transaksi.`;
    if (!message.quoted) throw `Harap reply ke pesan yang berisi bukti gambar.`;
    const quotedMessage = message.quoted;
    const transactionId = quotedMessage.text.trim().toUpperCase();
    const transaction = transactions.find(t => t.transactionId === transactionId);

    if (!transaction) throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;

    const now = moment().tz('Asia/Jakarta');
    if (now.isAfter(moment(transaction.expiryTime))) {
        throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;
    }

    const item = storeData.find(item => item.key.toLowerCase() === transaction.itemKey);
    if (item) {
        const replyMessage = `「 PROSES ADMIN AQUA 」\n\n📆 TANGGAL : ${now.format('YYYY-MM-DD')}\n⌚ JAM     : ${now.format('HH:mm')}\n✨ STATUS  : proses\n📝 Catatan : ${item.response}\n\nPesanan @${quotedMessage.sender.split('@')[0]} sedang di proses!\n\nMohon ditunggu ya`;
        return message.reply(replyMessage, null, { mentions: [quotedMessage.sender] });
    } else {
        throw `Item *${transaction.itemKey}* tidak ditemukan.`;
    }
};

handler.customPrefix = /^proses$/i;
handler.command = new RegExp;
handler.tags = ['store'];
module.exports = handler;

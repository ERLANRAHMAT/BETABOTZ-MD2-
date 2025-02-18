const moment = require('moment-timezone');

const handler = async (message, { isOwner }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.store = global.db.data.store || [];
    global.db.data.transactions = global.db.data.transactions || [];

    const storeData = global.db.data.store;
    const transactions = global.db.data.transactions;

    if (!isOwner) throw `Hanya owner yang dapat menyelesaikan transaksi.`;
    if (!message.quoted) throw `Harap reply ke pesan yang berisi bukti gambar dengan caption ID transaksi.`;
    const quotedMessage = message.quoted;
    const transactionId = quotedMessage.text.trim().toUpperCase();
    const transaction = transactions.find(t => t.transactionId === transactionId);

    if (!transaction) throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;

    const now = moment().tz('Asia/Jakarta');
    if (now.isAfter(moment(transaction.expiryTime))) {
        throw `ID Transaksi tidak valid atau sudah kadaluarsa.`;
    }

    const replyMessage = `「 BERHASIL DISELESAIKAN OLEH ADMIN AQUA 」\n\n📆 TANGGAL : ${now.format('YYYY-MM-DD')}\n⌚ JAM     : ${now.format('HH:mm')}\n✨ STATUS  : Berhasil\n\nTerimakasih @${quotedMessage.sender.split('@')[0]}\n\nKami ucapkan terima kasih sudah berbelanja di toko kami, Di tunggu ya pesanan berikut nya :D`;
    message.reply(replyMessage, null, { mentions: [quotedMessage.sender] });

    // Remove the transaction after completion
    const transactionIndex = transactions.findIndex(t => t.transactionId === transactionId);
    if (transactionIndex !== -1) {
        transactions.splice(transactionIndex, 1);
    }
};

handler.customPrefix = /^done$/i;
handler.command = new RegExp;
handler.tags = ['store'];
module.exports = handler;

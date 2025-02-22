//free source code store by betabotz di buat oleh danapura133
//silahkan di ganti ganti sesuka hati kalian

const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-database.json');

const loadStoreDatabase = () => {
    if (fs.existsSync(storeDatabaseFilePath)) {
        const data = fs.readFileSync(storeDatabaseFilePath);
        return JSON.parse(data);
    }
    return { store: {}, transactions: {}, setlist: {}, addlist: {} };
};

const saveStoreDatabase = (data) => {
    fs.writeFileSync(storeDatabaseFilePath, JSON.stringify(data, null, 2));
};

const handler = async (message, { usedPrefix, text, command, isOwner, conn }) => {
    const storeDatabase = loadStoreDatabase();
    storeDatabase.store = storeDatabase.store || {};
    storeDatabase.transactions = storeDatabase.transactions || {};
    storeDatabase.setlist = storeDatabase.setlist || {};
    storeDatabase.addlist = storeDatabase.addlist || {};

    const chatId = message.chat;
    storeDatabase.store[chatId] = storeDatabase.store[chatId] || [];
    storeDatabase.transactions[chatId] = storeDatabase.transactions[chatId] || [];
    storeDatabase.setlist[chatId] = storeDatabase.setlist[chatId] || '';

    const storeData = storeDatabase.store[chatId];
    const transactions = storeDatabase.transactions[chatId];
    const setlist = storeDatabase.setlist[chatId];
    const addListData = storeDatabase.addlist;

    if (command === 'liststore') {
        if (!storeData.length) throw `Belum ada item di store. Gunakan *${usedPrefix}addlist* untuk menambahkan.`;

        if (!setlist) {
            return message.reply(`Setlist belum diatur! Silahkan buat dahulu di *${usedPrefix}setlist*`);
        }

        const greetings = (() => {
            const hours = moment().tz('Asia/Jakarta').hour();
            return hours < 6 ? 'Selamat Malam' : hours < 12 ? 'Selamat Pagi' : hours < 18 ? 'Selamat Siang' : 'Selamat Sore';
        })();

        const userName = message.pushName || message.name || 'Teman';
        const itemList = storeData.map(item => `⇒ ${item.key}`).join('\n');

        const replyMessage = `${greetings}, ${userName}!

${setlist.replace('⇒', itemList)}

*Ketik nama kata kunci untuk menggunakannya!*`;
        return message.reply(replyMessage);
    }

    if (command === 'dellist') {
        if (!isOwner) throw `Hanya owner yang dapat menghapus item dari store.`;
        if (!text) throw `Harap tentukan item yang akan dihapus. Contoh: *${usedPrefix}${command} namaItem*`;

        const itemIndex = storeData.findIndex(item => item.key.toLowerCase() === text.toLowerCase());
        if (itemIndex !== -1) {
            const removedItem = storeData.splice(itemIndex, 1);
            saveStoreDatabase(storeDatabase);
            return message.reply(`Berhasil menghapus *${removedItem[0].key}* dari daftar store!`);
        } else {
            throw `Item *${text}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;
        }
    }

    if (command === 'editlist') {
        if (!isOwner) throw `Hanya owner yang dapat mengedit item di store.`;
        if (!text.includes('|')) throw `Format tidak valid. Contoh: *${usedPrefix}${command} namaItem | responsBaru*`;

        const [key, ...responseParts] = text.split('|').map(part => part.trim());
        const newResponse = responseParts.join('|');

        if (!key || !newResponse) throw `Format tidak valid. Contoh: *${usedPrefix}${command} namaItem | responsBaru*`;

        const item = storeData.find(item => item.key === key);
        if (item) {
            item.response = newResponse;
            saveStoreDatabase(storeDatabase);
            return message.reply(`Berhasil mengedit item *${key}*!`);
        } else {
            throw `Item *${key}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;
        }
    }

    //kalau di grebek jb chat aja erlan

    if (command === 'transaksi') {
        if (!isOwner) throw `Hanya owner yang dapat memproses transaksi.`;
        if (!text.includes('|')) throw `Format tidak valid. Contoh: *${usedPrefix}${command} @user|namaItem*`;

        const [userTag, itemKey] = text.split('|').map(part => part.trim().toLowerCase());
        const item = storeData.find(item => item.key.toLowerCase() === itemKey);
        if (!item) throw `Item *${itemKey}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;

        const transactionId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const now = moment().tz('Asia/Jakarta');
        const expiryTime = now.add(5, 'minutes').toISOString();

        transactions.push({ transactionId, userTag, itemKey, expiryTime });
        saveStoreDatabase(storeDatabase);

        const replyMessage = `Transaksi berhasil dibuat!\n\nID Transaksi: ${transactionId}\nPembeli: ${userTag}\nItem: ${itemKey}\n\nSilakan lakukan pembayaran dalam waktu 5 menit. Metode pembayaran bisa dilihat di *bayar*\n\nSilakan lakukan pembayaran dan kirim bukti pembayaran dengan caption ID Transaksi.`;
        await message.reply(replyMessage);
        return message.reply(`${transactionId}`);
    }

    if (text && !command) {
        const keyword = text.toLowerCase();
        const matchedItem = storeData.find(item => item.key.toLowerCase() === keyword) || addListData[keyword];

        if (matchedItem) {
            if (message.hasMedia) {
                return; 
            } else {
                if (matchedItem.isImage) {
                    return await this.sendMedia(message.chat, matchedItem.imageUrl, message, { caption: matchedItem.response });
                } else {
                    return message.reply(matchedItem.response);
                }
            }
        }
    }
};

handler.help = ['liststore', 'dellist', 'editlist', 'transaksi'];
handler.tags = ['store'];
handler.command = /^liststore|dellist|editlist|transaksi$/i;
handler.owner = false; 

module.exports = handler;

module.exports.all = async (message) => {
    const storeDatabase = loadStoreDatabase();
    storeDatabase.store = storeDatabase.store || {};
    storeDatabase.transactions = storeDatabase.transactions || {};
    storeDatabase.setlist = storeDatabase.setlist || {};
    storeDatabase.addlist = storeDatabase.addlist || {};

    const chatId = message.chat;
    storeDatabase.store[chatId] = storeDatabase.store[chatId] || [];
    storeDatabase.transactions[chatId] = storeDatabase.transactions[chatId] || [];
    storeDatabase.setlist[chatId] = storeDatabase.setlist[chatId] || '';

    const storeData = storeDatabase.store[chatId];
    const addListData = storeDatabase.addlist;
    const text = message.text.toLowerCase();
    const matchedItem = storeData.find(item => item.key.toLowerCase() === text) || addListData[text];

    if (matchedItem) {
        if (matchedItem.isImage) {
            return await this.sendMedia(message.chat, matchedItem.imageUrl, message, { caption: matchedItem.response });
        } else {
            return message.reply(matchedItem.response);
        }
    }
};


// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/sFj3Mh-z1Jk
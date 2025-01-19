//free source code store by betabotz di buat oleh danapura133
//silahkan di ganti ganti sesuka hati kalian

const moment = require('moment-timezone');

const handler = async (message, { usedPrefix, text, command, isOwner }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.store = global.db.data.store || [];

    const storeData = global.db.data.store;

    if (command === 'liststore') {
        if (!storeData.length) throw `Belum ada item di store. Gunakan *${usedPrefix}addlist* untuk menambahkan.`;

        const greetings = (() => {
            const hours = moment().tz('Asia/Jakarta').hour();
            return hours < 6 ? 'Selamat Malam' : hours < 12 ? 'Selamat Pagi' : hours < 18 ? 'Selamat Siang' : 'Selamat Sore';
        })();

        const userName = message.pushName || message.name || 'Teman';
        const itemList = storeData.map(item => `⇒ ${item.key}`).join('\n');

        const replyMessage = `${greetings}, ${userName}!

Berikut adalah daftar item di store:
${itemList}

*Ketik nama kata kunci untuk menggunakannya!*`;
        return message.reply(replyMessage);
    }

    if (command === 'store' || text) {
        const keyword = text ? text.toLowerCase() : command.toLowerCase();
        const matchedItem = storeData.find(item => item.key.toLowerCase() === keyword);

        if (matchedItem) {
            if (matchedItem.isImage) {
                return await this.sendMedia(message.chat, matchedItem.imageUrl, message, { caption: matchedItem.response });
            } else {
                return message.reply(matchedItem.response);
            }
        } else if (command === 'store') {
            throw `Item dengan kata kunci *${keyword}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;
        }
    }

    if (command === 'dellist') {
        if (!isOwner) throw `Hanya owner yang dapat menghapus item dari store.`;
        if (!text) throw `Harap tentukan item yang akan dihapus. Contoh: *${usedPrefix}${command} namaItem*`;

        const itemIndex = storeData.findIndex(item => item.key === text);
        if (itemIndex !== -1) {
            const removedItem = storeData.splice(itemIndex, 1);
            return message.reply(`Berhasil menghapus *${removedItem[0].key}* dari daftar store!`);
        } else {
            throw `Item *${text}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;
        }
    }

    if (command === 'addlist') {
        if (!isOwner) throw `Hanya owner yang dapat menambahkan item ke store.`;
        if (!text.includes('|')) throw `Format tidak valid. Contoh: *${usedPrefix}${command} vpsapi | betabotz aja sikat... https://api.betabotz.eu.org/*`;

        const [key, ...responseParts] = text.split('|').map(part => part.trim());
        const response = responseParts.join('|');

        if (!key || !response) throw `Format tidak valid. Contoh: *${usedPrefix}${command} api | betabotz aja sikat... https://api.betabotz.eu.org/*`;

        storeData.push({ key, response, isImage: false });
        return message.reply(`Berhasil menambahkan *${key}* ke daftar store!`);
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
            return message.reply(`Berhasil mengedit item *${key}*!`);
        } else {
            throw `Item *${key}* tidak ditemukan. Gunakan *${usedPrefix}liststore* untuk melihat daftar item.`;
        }
    }

    throw `Perintah tidak dikenali. Silakan coba lagi.`;
};

handler.help = ['liststore', 'dellist', 'store', 'addlist', 'editlist'];
handler.tags = ['main'];
handler.command = /^liststore|dellist|store|addlist|editlist$/i;
handler.owner = false; 

module.exports = handler;

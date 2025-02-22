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

const handler = async (message, { text, isOwner, usedPrefix }) => {
    if (!isOwner) throw `Hanya owner yang dapat menambahkan item ke store.`;
    if (!text.includes('|')) throw `Format tidak valid. Contoh: *${usedPrefix}addlist Starter 1 | RAM 1GB, DISK 1.5GB, CPU 50% — Rp7.000*`;

    const [key, ...responseParts] = text.split('|').map(part => part.trim());
    const response = responseParts.join('|');

    if (!key || !response) throw `Format tidak valid. Contoh: *${usedPrefix}addlist Starter 1 | RAM 1GB, DISK 1.5GB, CPU 50% — Rp7.000*`;

    const storeDatabase = loadStoreDatabase();
    const chatId = message.chat;
    storeDatabase.store = storeDatabase.store || {};
    storeDatabase.store[chatId] = storeDatabase.store[chatId] || [];
    storeDatabase.store[chatId].push({ key, response });
    saveStoreDatabase(storeDatabase);

    return message.reply(`Berhasil menambahkan *${key}* ke daftar store!`);
};

handler.help = ['addlist'];
handler.tags = ['store'];
handler.command = /^addlist$/i;
handler.owner = false;
module.exports = handler;

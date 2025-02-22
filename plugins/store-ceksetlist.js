const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-database.json');

const loadStoreDatabase = () => {
    if (fs.existsSync(storeDatabaseFilePath)) {
        const data = fs.readFileSync(storeDatabaseFilePath);
        return JSON.parse(data);
    }
    return { store: {}, transactions: {}, setlist: {} };
};

const handler = async (message, { usedPrefix }) => {
    const storeDatabase = loadStoreDatabase();
    storeDatabase.setlist = storeDatabase.setlist || {};

    const chatId = message.chat;
    const setlist = storeDatabase.setlist[chatId] || 'Setlist belum diatur.';
    return message.reply(`Setlist untuk grup ini:\n\n${setlist}`);
};

handler.help = ['ceksetlist'];
handler.tags = ['store'];
handler.command = /^ceksetlist$/i;
handler.owner = true;
module.exports = handler;


// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/sFj3Mh-z1Jk
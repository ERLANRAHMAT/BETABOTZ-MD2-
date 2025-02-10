const { proto } = require('@adiwajshing/baileys').default;
function msToDate(ms) {
    let temp = ms;
    let days = Math.floor(temp / (24 * 60 * 60 * 1000));
    let daysms = temp % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = daysms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = hoursms % (60 * 1000);
    let sec = Math.floor((minutesms) / 1000);
    return `${days} hari ${hours} jam ${minutes} menit`;
}

let handler = async (m, { conn, text, command, usedPrefix }) => {
    let who = text
    switch (command) {
        case 'listsewa':
            let sewaList = Object.keys(global.db.data.chats).filter(chatId => global.db.data.chats[chatId].expired);
            if (sewaList.length === 0) {
                conn.reply(m.chat, `Tidak ada grup yang memiliki masa sewa aktif.`, m);
            } else {
                let listText = 'Grup dengan masa sewa aktif:\n\n';
                for (let chatId of sewaList) {
                    let remainingTime = global.db.data.chats[chatId].expired - new Date() * 1;
                    let name = await conn.getName(chatId).catch((_) => "_Not Found_");
                    listText += `Name: ${name} \nID: ${chatId}\nMasa Aktif: ${msToDate(remainingTime)}\n\n`;
                }
                conn.reply(m.chat, listText, m);
            }
            break;

        case 'ceksewa':
            if (!who) throw `Gunakan format yang benar: ${usedPrefix + command} <idgc>`;
            if (!global.db.data.chats[who]) throw `Grup tidak ditemukan di database.`;

            let remainingTime = global.db.data.chats[who].expired - new Date() * 1;
            if (remainingTime > 0) {
                conn.reply(m.chat, `Masa aktif sewa untuk grup ini adalah ${msToDate(remainingTime)}`, m);
            } else {
                conn.reply(m.chat, `Grup ini tidak memiliki masa sewa aktif.`, m);
            }
            break;
    }
}

handler.help = ['listsewa', 'ceksewa <idgc>'];
handler.tags = ['info'];
handler.command = /^(listsewa|csewa)$/i;
handler.group = true

module.exports = handler;
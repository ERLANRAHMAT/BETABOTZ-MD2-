let moment = require('moment-timezone');
let schedule = require('node-schedule');

const timeZone = 'Asia/Jakarta';

let handler = async (m, { conn, command, args, isOwner, isAdmin }) => {
    let chat = global.db.data.chats[m.chat];
    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di grup!';
    if (!(isAdmin || isOwner)) throw 'Perintah ini hanya bisa digunakan oleh admin grup!';

    if (command === 'aktif' && args[0] === 'autogc') {
        if (args.length < 2) throw 'Format salah! Gunakan .aktif autogc jam tutup|jam buka\nContoh: .aktif autogc 21|5';
        let [closeTime, openTime] = args[1].split('|').map(Number);
        if (isNaN(closeTime) || isNaN(openTime)) throw 'Jam tutup dan buka harus berupa angka!';
        chat.autoGc = { closeTime, openTime };
        m.reply(`Auto group close/open diaktifkan. Grup akan tutup pukul ${closeTime}:00 dan buka pukul ${openTime}:00.`);
    } else if (command === 'mati' && args[0] === 'autogc') {
        delete chat.autoGc;
        m.reply('Auto group close/open dinonaktifkan.');
    }
};

handler.command = /^(aktif|mati)$/i;
handler.help = ['aktif autogc jam tutup|jam buka', 'mati autogc'];
handler.tags = ['group'];
handler.admin = true;
handler.group = true;

module.exports = handler;

const checkGroupsStatus = async (conn) => {
    const currentTime = moment().tz(timeZone).format('HH:mm');

    for (const chatId of Object.keys(global.db.data.chats)) {
        const chat = global.db.data.chats[chatId];
        if (!chat.autoGc) continue;

        const { closeTime, openTime } = chat.autoGc;
        const currentHour = moment().tz(timeZone).hour();

        if (currentHour === closeTime && chat.groupStatus !== 'closed') {
            await conn.groupSettingUpdate(chatId, 'announcement');
            await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖢𝖫𝖮𝖲𝖤, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖡𝖴𝖪𝖠 𝖩𝖠𝖬 ${openTime}:00 𝖶𝖨𝖡` });
            chat.groupStatus = 'closed';
        }

        if (currentHour === openTime && chat.groupStatus !== 'opened') {
            await conn.groupSettingUpdate(chatId, 'not_announcement');
            await conn.sendMessage(chatId, { text: `( OTOMATIS ) 𝖦𝖱𝖮𝖴𝖯 𝖮𝖯𝖤𝖭, 𝖣𝖠𝖭 𝖠𝖪𝖠𝖭 𝖣𝖨𝖳𝖴𝖳𝖴𝖯 𝖩𝖠𝖬 ${closeTime}:00 𝖶𝖨𝖡` });
            chat.groupStatus = 'opened';
        }
    }
};

schedule.scheduleJob('* * * * *', () => {
    checkGroupsStatus(conn);
});
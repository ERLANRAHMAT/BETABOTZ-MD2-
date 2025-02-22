let moment = require('moment-timezone');
let schedule = require('node-schedule');

const timeZone = 'Asia/Jakarta';

let handler = async (m, { conn, command, args, isOwner, isAdmin }) => {
    let chat = global.db.data.chats[m.chat];
    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di grup!';
    if (!(isAdmin || isOwner)) throw 'Perintah ini hanya bisa digunakan oleh admin grup!';

    if (command === 'alarmsahur') {
        if (args.length < 3) throw 'Format salah! Gunakan .alarmsahur jam|menit|pesan\nContoh: .alarmsahur 5|12|bangun woy bangun sahur';
        let [time, minute, ...messageParts] = args.join(' ').split('|');
        let message = messageParts.join('|').trim();
        let alarmTime = Number(time);
        let alarmMinute = Number(minute);
        if (isNaN(alarmTime) || isNaN(alarmMinute)) throw 'Waktu harus berupa angka!';
        chat.alarm = { time: `${alarmTime}:${alarmMinute}`, message, lastSent: null };
        m.reply(`Alarm diaktifkan. Grup akan menerima pesan "${message}" pada pukul ${alarmTime}:${alarmMinute} WIB.`);
    } else if (command === 'deletealarmsahur') {
        delete chat.alarm;
        m.reply('Alarm dinonaktifkan.');
    } else if (command === 'editalarmsahur') {
        if (args.length < 3) throw 'Format salah! Gunakan .editalarmsahur jam|menit|pesan\nContoh: .editalarmsahur 5|12|bangun woy bangun sahur';
        let [time, minute, ...messageParts] = args.join(' ').split('|');
        let message = messageParts.join('|').trim();
        let alarmTime = Number(time);
        let alarmMinute = Number(minute);
        if (isNaN(alarmTime) || isNaN(alarmMinute)) throw 'Waktu harus berupa angka!';
        chat.alarm = { time: `${alarmTime}:${alarmMinute}`, message, lastSent: null };
        m.reply(`Alarm diubah. Grup akan menerima pesan "${message}" pada pukul ${alarmTime}:${alarmMinute} WIB.`);
    }
};

handler.command = /^(alarmsahur|deletealarmsahur|editalarmsahur)$/i;
handler.help = ['alarmsahur jam|menit|pesan', 'deletealarmsahur', 'editalarmsahur jam|menit|pesan'];
handler.tags = ['group'];
handler.admin = true;
handler.group = true;

module.exports = handler;

const checkAlarmStatus = async (conn) => {
    const now = moment().tz(timeZone);
    const currentTime = now.format('HH:mm');
    const currentDate = now.format('YYYY-MM-DD');

    for (const chatId of Object.keys(global.db.data.chats)) {
        const chat = global.db.data.chats[chatId];
        if (!chat.alarm) continue;

        const { time, message, lastSent } = chat.alarm;

        if (currentTime === time && lastSent !== currentDate) {
            await sendAlarmHidetag(conn, chatId, message);
            chat.alarm.lastSent = currentDate;
        }
    }
};

const sendAlarmHidetag = async (conn, chatId, text) => {
    const groupMetadata = await conn.groupMetadata(chatId);
    const participants = groupMetadata.participants.map((p) => p.id);

    const fkontak = {
        "key": {
            "participants": "0@s.whatsapp.net",
            "remoteJid": "status@broadcast",
            "fromMe": false,
            "id": "Halo"
        },
        "message": {
            "contactMessage": {
                "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:Bot\nitem1.TEL;waid=0:0\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        },
        "participant": "0@s.whatsapp.net"
    };

    await conn.sendMessage(
        chatId,
        { text, mentions: participants },
        { quoted: fkontak } 
    );
};

schedule.scheduleJob('* * * * *', () => {
    checkAlarmStatus(conn);
});

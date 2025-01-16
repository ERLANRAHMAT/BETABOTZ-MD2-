/*
*<>JADIADMIN & DEMOTE PAKAI WAKTU, JADI JIKA WAKTU HABIS MISAL YANG JADIADMIN, MAKA KALO WAKTU HABIS AKAN TERDEMOTE OTOMATIS, BEGITUPUN YANG DEMOTE, MAKA AKAN KEDEMOTE DAN AKAN MENJADI ADMIN KEMBALI SESUAI WAKTU TERSEBUT!!<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
HAPUS WM=SDM RENDAH 
*KALO LU CONVERT APAPUN FITUR INI,WM JANGAN DIHAPUS!*
"aku janji tidak akan hapus wm ini"
KAMIS, 28 NOVEMBER 2024 09:35
*/
let schedule = require ('node-schedule')
//wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
let handler = async (m, { conn, args, command, participants }) => {
    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di grup!';

    //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    let target = m.mentionedJid ? m.mentionedJid[0] : args[0];
    if (!target) throw 'Tag pengguna atau masukkan nomor target!';
    let time = args[1];
    if (!time) throw 'Masukkan waktu dengan format yang benar! (misal: 10s, 5m, 2h, 1d, atau 2024-12-31 23:59:59)';

    //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    let executeTime;
    if (/^\d+[smhd]$/.test(time)) {
        
        let value = parseInt(time);
        let unit = time.slice(-1);
        let multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        executeTime = new Date(Date.now() + value * multiplier[unit]);
    } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time)) {
        
        executeTime = new Date(time);
        if (isNaN(executeTime)) throw 'Format waktu tidak valid!';
    } else {
        throw 'Format waktu tidak valid! Gunakan format seperti 10s, 5m, 2h, 1d, atau 2024-12-31 23:59:59';
    }
   //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    let targetName = participants.find(p => p.id === target)?.id || target;
    let action;
    let timerName;

    if (command === 'jadiadmin') {
        await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
        action = 'promote';
        timerName = 'unadmin';
    } else if (command === 'unadmin') {
        await conn.groupParticipantsUpdate(m.chat, [target], 'demote');
        action = 'demote';
        timerName = 'jadiadmin';
    } else if (command === 'kick') {
        await conn.groupParticipantsUpdate(m.chat, [target], 'remove');
        action = 'kick';
    } else {
        throw 'Perintah tidak dikenali!';
    }

    m.reply(`Perintah "${command}" berhasil. Target: @${target.split('@')[0]}\nDurasi: ${time}.\nPerintah akan dijalankan pada ${executeTime.toLocaleString()}.`, null, {
        mentions: [target],
    });

    //wm https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
    if (command !== 'kick') {
        schedule.scheduleJob(executeTime, async () => {
            if (timerName === 'unadmin') {
                await conn.groupParticipantsUpdate(m.chat, [target], 'demote');
                m.reply(`Target @${target.split('@')[0]} telah di *demote* karena waktu habis.`, null, { mentions: [target] });
            } else if (timerName === 'jadiadmin') {
                await conn.groupParticipantsUpdate(m.chat, [target], 'promote');
                m.reply(`Target @${target.split('@')[0]} telah di *promote* kembali karena waktu habis.`, null, { mentions: [target] });
            }
        });
    }
};

handler.help = ['jadiadmin @user <waktu>', 'unadmin @user <waktu>', 'kick2 @user <waktu>'];
handler.command = /^(jadiadmin|unadmin|kick2)$/i;
handler.tags = ['group'];
handler.group = true;
handler.admin = true; 
handler.botAdmin = true; 
module.exports = handler;
/*
*<>JADIADMIN & DEMOTE PAKAI WAKTU, JADI JIKA WAKTU HABIS MISAL YANG JADIADMIN, MAKA KALO WAKTU HABIS AKAN TERDEMOTE OTOMATIS, BEGITUPUN YANG DEMOTE, MAKA AKAN KEDEMOTE DAN AKAN MENJADI ADMIN KEMBALI SESUAI WAKTU TERSEBUT!!<>*
SOURCE: https://whatsapp.com/channel/0029VaJYWMb7oQhareT7F40V
DON'T DELETE THIS WM!
HAPUS WM MANDUL 7 TURUNAN 
HAPUS WM=SDM RENDAH 
*KALO LU CONVERT APAPUN FITUR INI,WM JANGAN DIHAPUS!*
"aku janji tidak akan hapus wm ini"
KAMIS, 28 NOVEMBER 2024 09:35
*/
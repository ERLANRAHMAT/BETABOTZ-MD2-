function listAfkHandler(m, { conn }) {
    let users = Object.entries(global.db.data.users)
        .filter(([_, user]) => user.afk > -1)
        .map(([jid, user]) => {
            let name = user.registered ? user.name : conn.getName(jid)
            let reason = user.afkReason ? '• *ALASAN* : ' + user.afkReason : '• *TANPA ALASAN*'
            let duration = new Date() - user.afk
            return `${name} (Jangka waktu: ${formatTime(duration)})\n${reason}`
        })

    if (users.length > 0) {
        conn.sendMessage(m.chat, {
            text: `*LIST AFK* :\n\n ${users.join('\n\n')}`,
            contextInfo: {
                externalAdReply: {
                    title: 'list afk user',
                    thumbnailUrl: 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/mzx1qcg.jpg',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        })
    } else {
        conn.reply(m.chat, 'Tidak ada pengguna yang sedang AFK saat ini.', m)
    }
}

listAfkHandler.help = ['listafk']
listAfkHandler.tags = ['group']
listAfkHandler.command = /^listafk$/i

module.exports = listAfkHandler;

function formatTime(ms) {
    let days = Math.floor(ms / (1000 * 60 * 60 * 24))
    let hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    let seconds = Math.floor((ms % (1000 * 60)) / 1000)

    let timeString = ''
    if (days > 0) timeString += `${days} hari `
    if (hours > 0) timeString += `${hours} jam `
    if (minutes > 0) timeString += `${minutes} menit `
    if (seconds > 0) timeString += `${seconds} detik`

    return timeString
}
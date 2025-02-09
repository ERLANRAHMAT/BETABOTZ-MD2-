const similarity = require('similarity')
const threshold = 0.72 // semakin tinggi nilai, semakin mirip
module.exports = {
    async before(m) {
        this.game = this.game ? this.game : {}
        let id = 'family100_' + m.chat
        if (!(id in this.game)) return !0
        let room = this.game[id]
        let text = m.text.toLowerCase().replace(/[^\w\s\-]+/, '')
        if (!room) return !0

        if (text === 'nyerah') {
            let allAnswers = room.jawaban.map((jawaban, index) => `(${index + 1}) ${jawaban}`).join('\n')
            this.reply(m.chat, `Permainan berakhir karena menyerah.\n\nJawaban yang benar:\n${allAnswers}`, room.msg)
            clearTimeout(room.timeout)
            delete this.game[id]
            return !0
        }

        let index = room.jawaban.indexOf(text)
        if (index < 0) {
            if (Math.max(...room.jawaban.filter((_, index) => !room.terjawab[index]).map(jawaban => similarity(jawaban, text))) >= threshold) m.reply('Dikit lagi!')
            return !0
        }
        if (room.terjawab[index]) return !0
        let users = global.db.data.users[m.sender]
        room.terjawab[index] = m.sender
        users.money += room.rewardAmount 

        let isWin = room.terjawab.length === room.terjawab.filter(v => v).length
        let caption = `
*Soal:* ${room.soal}

Terdapat *${room.jawaban.length}* jawaban${room.jawaban.find(v => v.includes(' ')) ? `
(beberapa jawaban terdapat spasi)
`: ''}
${isWin ? `*SEMUA JAWABAN TERJAWAB*\nSelamat, Anda telah menjawab semua jawaban dengan benar!` : ''}
${Array.from(room.jawaban, (jawaban, index) => {
            return room.terjawab[index] ? `(${index + 1}) ${jawaban} ${room.terjawab[index] ? '@' + room.terjawab[index].split('@')[0] : ''}`.trim() : false
        }).filter(v => v).join('\n')}

+${room.rewardAmount} Money tiap jawaban benar
    `.trim()
        m.reply(caption, null, {
            contextInfo: {
                mentionedJid: this.parseMention(caption)
            }
        }).then(msg => {
            return this.game[id].msg = msg
        }).catch(_ => _)
        if (isWin) {
            clearTimeout(room.timeout)
            delete this.game[id]
        }
        return !0
    }
}
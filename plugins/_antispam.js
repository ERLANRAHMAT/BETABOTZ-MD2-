exports.before = async function (m, { isAdmin, isOwner }) {
    let user = db.data.users[m.sender];
    let chat = db.data.chats[m.chat];

    if (isAdmin || isOwner) {
        return; 
    }
    if ((m.chat.endsWith('broadcast') || m.fromMe) && !m.message && !chat.isBanned) return;
    if (!m.text.startsWith('.') && !m.text.startsWith('#') && !m.text.startsWith('!') && !m.text.startsWith('/') && !m.text.startsWith('\\')) return;
    var now = new Date() * 1;
    if (user.banned && now >= user.lastBanned) {
        user.banned = false;
    }
    if (user.banned) return;
    this.spam = this.spam ? this.spam : {};
    if (m.sender in this.spam) {
        this.spam[m.sender].count++;
        if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam >= 4) {
            if (this.spam[m.sender].count >= 2) {
                user.banned = true;
                m.reply('🚫 Whoa! SPAM TERDETEKSI! 🚫\n\nTunggu 5 detik untuk bisa menggunakan kembali! ⏳');

                var detik = 10000 * 1;

                if (now < user.lastBanned) {
                    user.lastBanned += detik;
                } else {
                    user.lastBanned = now + detik;
                }
            }

            this.spam[m.sender].count = 0;
            this.spam[m.sender].lastspam = m.messageTimestamp.toNumber();
        }
    } else {
        this.spam[m.sender] = {
            jid: m.sender,
            count: 0,
            lastspam: 0
        };
    }
};

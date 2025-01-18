let fetch = require('node-fetch')
let handler = async (m, { conn } ) => {   
let res = await fetch(`https://api.betabotz.eu.org/api/webzone/gore?apikey=${lann}`).then(result => result.json())
let anu =`
─────> *GORE* <─────

*JUDUL*:
${res.result.title}\n
*AUTHOR*: ${res.result.author}
*VIEW*: ${res.result.views}
*COMMENT*: ${res.result.comments}
*LINK*: ${res.result.url}\n
\`gunakan vpn jika ingin menonton\`
`
conn.sendMessage(m.chat, {
                    text: anu, 
                    contextInfo: {
                         externalAdReply: {
                            title: "RANDOM GORE",
                            body: '',
                            renderLargerThumbnail: true,
                            thumbnailUrl: 'https://telegra.ph/file/13912a80a67472cad91c3.jpg',
                            sourceUrl: null,
                            mediaType: 1,
                        }
                    }, mentions: [m.sender]
    }, {})
}
handler.help = ['gore']
handler.tags = ['internet', 'downloader'];
handler.command = /^(gore)$/i
handler.owner = false
handler.mods = false
handler.premium = false
handler.group = true
handler.private = false

handler.admin = false
handler.botAdmin = false

handler.fail = null

module.exports = handler


//danapurta133
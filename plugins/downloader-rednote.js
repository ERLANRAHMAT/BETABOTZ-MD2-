const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\nContoh:\n${usedPrefix + command} http://xhslink.com/a/bXa0qop7t853`;
    try {
        if (!text.match(/xhslink|xiaohongshu/gi)) throw `URL Tidak Ditemukan!`;
        m.reply(wait);
        let res = await axios.get(`https://api.betabotz.eu.org/api/download/rednote?url=${text}&apikey=${lann}`);
        let result = res.data.result;
        if (!result || result.err !== 0) throw `Gagal mengambil data!`;
        if (result.video) {
            await conn.sendFile(m.chat, result.video, "video.mp4", `*Title:* ${result.title || "No title"}`, m);
        } else if (result.images && result.images.length > 0) {
            for (let img of result.images) {
                await sleep(3000);
                await conn.sendMessage(m.chat, { image: img, caption: `*Title:* ${result.title || "No title"}` }, { quoted: m })
            }
        } else {
            throw `Konten tidak ditemukan!`;
        }
    } catch (e) {
        console.error(e);
        throw `Terjadi kesalahan saat memproses permintaan!`;
    }
};

handler.help = ['xiaohongshu', 'rednote'];
handler.command = /^(xiaohongshu|xhs|xhsdl|rednote)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.premium = false;

module.exports = handler;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
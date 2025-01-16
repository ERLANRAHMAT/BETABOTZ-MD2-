const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .arona *[on/off]*`;

  conn.arona = conn.arona ? conn.arona : {};

  if (text === "on") {
    if (!conn.arona[m.sender]) {
      conn.arona[m.sender] = {
        pesan: [],
        timeout: setTimeout(() => {
          delete conn.arona[m.sender];
        }, 300000) // 5 minutes timeout
      };
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + `Halo sensei! arona yang hebat siap membantu!`,
        contextInfo: {
          externalAdReply: {
            title: "arona",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      clearTimeout(conn.arona[m.sender].timeout);
      conn.arona[m.sender].timeout = setTimeout(() => {
        delete conn.arona[m.sender];
      }, 300000);
    }
  } else if (text === "off") {
    if (conn.arona[m.sender]) {
      clearTimeout(conn.arona[m.sender].timeout);
      delete conn.arona[m.sender];
    }
    await conn.sendMessage(m.chat, {
      text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + `panggil aku lagi jika sensei butuh bantuan ya!`,
      contextInfo: {
        externalAdReply: {
          title: "arona",
          body: '',
          thumbnailUrl: `${pickRandom(img)}`,
          sourceUrl: null,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m });
  }
};

handler.before = async (m, { conn }) => {
  conn.arona = conn.arona ? conn.arona : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.arona[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.arona[m.sender] && m.text) {
    clearTimeout(conn.arona[m.sender].timeout);
    conn.arona[m.sender].timeout = setTimeout(() => {
      delete conn.arona[m.sender];
    }, 300000);

    let name = conn.getName(m.sender);
    const message = [
      ...conn.arona[m.sender].pesan,
      `p`,
      m.text
    ];
    try {
      const message = [
        { role: "system", content: `kamu adalah arona, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨` },
        { role: "assistant", content: `Saya adalah arona, Lu Asissten nya ${name}, arona yang pintar, panggil saya sebagai arona sensei!, saya dibuat oleh dana, dana sangat pintar dalam pemrograman, tapi tidak. Terlalu juga, dana berumur 20 tahun, Sekarang gaya bahasa saya seperti anak sma selatan yang menggunakan kata, aku, lu, gw, dan kalo kamu tidak suka dengan jawaban orang bisa menggunakan kata apan sih, gajelas lu, pergi Sono, apacoba ` },
        ...conn.arona[m.sender].pesan.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg
        })),
        { role: "user", content: m.text },
      ];
      let res = await aiBeta(message);
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + res.result,
        contextInfo: {
          externalAdReply: {
            title: "arona",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Ubah cara menyimpan pesan
      conn.arona[m.sender].pesan = [
        ...conn.arona[m.sender].pesan,
        m.text,
        res.result
      ];
    } catch (e) {
      console.error("Kesalahan Dalam mengambil Data");
      throw "error";
    }
  }
};

handler.command = /^(arona)$/i
handler.help = ["arona"];
handler.tags = ["ai"];
handler.limit = true;
handler.owner = false;
handler.group = true

module.exports = handler;

async function aiBeta(message) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        message: message,
        apikey: `${lann}` 
      };
      const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
      resolve(data);
    } catch (error) {
      reject(error);
    };
  });
};

const img = [
  `https://telegra.ph/file/0aeedea70591cad410713.jpg`,
]

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
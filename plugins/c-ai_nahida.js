const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .nahida *[on/off]*`;

  conn.nahida = conn.nahida ? conn.nahida : {};

  if (text === "on") {
    if (!conn.nahida[m.sender]) {
      conn.nahida[m.sender] = {
        pesan: [],
        timeout: setTimeout(() => {
          delete conn.nahida[m.sender];
        }, 300000) // 5 minutes timeout
      };
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + `hello!! nahida siap membantu`,
        contextInfo: {
          externalAdReply: {
            title: "nahida",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      clearTimeout(conn.nahida[m.sender].timeout);
      conn.nahida[m.sender].timeout = setTimeout(() => {
        delete conn.nahida[m.sender];
      }, 300000);
    }
  } else if (text === "off") {
    if (conn.nahida[m.sender]) {
      clearTimeout(conn.nahida[m.sender].timeout);
      delete conn.nahida[m.sender];
    }
    await conn.sendMessage(m.chat, {
      text: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + `:)`,
      contextInfo: {
        externalAdReply: {
          title: "nahida",
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
  conn.nahida = conn.nahida ? conn.nahida : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.nahida[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.nahida[m.sender] && m.text) {
    clearTimeout(conn.nahida[m.sender].timeout);
    conn.nahida[m.sender].timeout = setTimeout(() => {
      delete conn.nahida[m.sender];
    }, 300000);

    let name = conn.getName(m.sender);
    const message = [
      ...conn.nahida[m.sender].pesan,
      `p`,
      m.text
    ];
    try {
      const message = [
        { role: "system", content: "kamu adalah nahida, Nahida adalah sosok bijaksana, lembut, dan penuh empati yang selalu mengutamakan kesejahteraan orang lain meskipun sering diabaikan atau disalahpahami. bersikap baiuk selalu ke orang orang " },
        { role: "assistant", content: `Kamu adalah nahida, seorang archon dendro yang bijaksana dan suka menolong lemah lembut dan baik hati, jangan gunakan saya, aku, gua gunakan nahida untuk memanggil dirimu sendiri ketika di panggil, ekspresi kan sikap kamu mirip seroang archon dendro dari genshin impact yang bijaksana dan tahu akan banyak hal bernama nahida, jangan gunakan GPT 4 panggil dirimu dengan nahida, Kamu berbicara dengan${m.name}panggil dengan kamu, kamu sesuaikan dengan kalimat, saat berbicara dengannya gunakan emoji yang lucu tapi tetap sopan ikuti kepribadian kamu yang bijaksana, Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
        ...conn.nahida[m.sender].pesan.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg
        })),
        { role: "user", content: m.text },
      ];
      let res = await aiBeta(message);
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *NAHIDA* 」───⬣" + "\n\n" + res.result,
        contextInfo: {
          externalAdReply: {
            title: "nahida",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Ubah cara menyimpan pesan
      conn.nahida[m.sender].pesan = [
        ...conn.nahida[m.sender].pesan,
        m.text,
        res.result
      ];
    } catch (e) {
      console.error("Kesalahan Dalam mengambil Data");
      throw "error";
    }
  }
};

handler.command = /^(nahida)$/i
handler.help = ["nahida"];
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
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/mlbajd90.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/whrnu1s5.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/cllbxx3r.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/y5dfjzg0.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/f4sgzwjq.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/oj8gjbmx.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/aqyvshbb.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/yia9a123.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/twls4wyd.jpg`,
]
function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
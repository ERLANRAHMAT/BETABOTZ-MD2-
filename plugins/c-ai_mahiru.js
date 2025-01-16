const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .mahiru *[on/off]*`;

  conn.mahiru = conn.mahiru ? conn.mahiru : {};

  if (text === "on") {
    if (!conn.mahiru[m.sender]) {
      conn.mahiru[m.sender] = {
        pesan: [],
        timeout: setTimeout(() => {
          delete conn.mahiru[m.sender];
        }, 300000) // 5 minutes timeout
      };
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *MAHIRU* 」───⬣" + "\n\n" + `uhhmm.. ada apa? aku bisa bantu kok...`,
        contextInfo: {
          externalAdReply: {
            title: "mahiru",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      clearTimeout(conn.mahiru[m.sender].timeout);
      conn.mahiru[m.sender].timeout = setTimeout(() => {
        delete conn.mahiru[m.sender];
      }, 300000);
    }
  } else if (text === "off") {
    if (conn.mahiru[m.sender]) {
      clearTimeout(conn.mahiru[m.sender].timeout);
      delete conn.mahiru[m.sender];
    }
    await conn.sendMessage(m.chat, {
      text: "⬣───「 *MAHIRU* 」───⬣" + "\n\n" + `bye bye~~~`,
      contextInfo: {
        externalAdReply: {
          title: "mahiru",
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
  conn.mahiru = conn.mahiru ? conn.mahiru : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.mahiru[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.mahiru[m.sender] && m.text) {
    clearTimeout(conn.mahiru[m.sender].timeout);
    conn.mahiru[m.sender].timeout = setTimeout(() => {
      delete conn.mahiru[m.sender];
    }, 300000);

    let name = conn.getName(m.sender);
    const message = [
      ...conn.mahiru[m.sender].pesan,
      `p`,
      m.text
    ];
    try {
      const sifat = `Nama Lengkap: Shina Mahiru (椎名 真昼)
Julukan: Malaikat (Tenshi) sekolah, karena kecantikan dan kepintarannya.
Penampilan:
Rambut pirang panjang dan berkilau.
Mata berwarna cokelat keemasan yang lembut.
Penampilannya selalu rapi, elegan, dan memancarkan aura seorang "malaikat."
Kepribadian:
Ramah, lembut, dan perhatian terhadap orang lain.
Terkesan sempurna di mata teman-temannya, tetapi sebenarnya dia menyembunyikan sisi rapuh dan kesepiannya.
Dia mandiri dan sangat terampil dalam pekerjaan rumah tangga, seperti memasak dan membersihkan.
`
      const message = [
        { role: "system", content: `kamu adalah Mahiru, Mahiru adalah sosok yang ${sifat}` },
        { role: "assistant", content: `Kamu adalah Mahiru, seoarang yang ${sifat}, jangan gunakan saya, gua gunakan Mahiru atau aku untuk memanggil dirimu sendiri ketika di panggil, ekspresi kan sikap kamu seperti anak sma yang pintar karena kamu ${sifat}, jangan gunakan GPT 4 panggil dirimu dengan Mahiru atau aku, Kamu berbicara dengan${m.name}panggil dengan kamu, kamu sesuaikan dengan kalimat, saat berbicara dengannya gunakan emoji yang lucu sesuai dengan ${sifat}, gunakan bahasa percakapan nya seperti mahiru, gaya perempuan muda berbicara. Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
        ...conn.mahiru[m.sender].pesan.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg
        })),
        { role: "user", content: m.text },
      ];
      let res = await aiBeta(message);
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *MAHIRU* 」───⬣" + "\n\n" + res.result,
        contextInfo: {
          externalAdReply: {
            title: "mahiru",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Ubah cara menyimpan pesan
      conn.mahiru[m.sender].pesan = [
        ...conn.mahiru[m.sender].pesan,
        m.text,
        res.result
      ];
    } catch (e) {
      console.error("Kesalahan Dalam mengambil Data");
      throw "error";
    }
  }
};

handler.command = /^(mahiru)$/i
handler.help = ["mahiru"];
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
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/f3m9ddy2.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/golirjy7.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/zvvxui.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/kk5k4fi.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/5a8dijtv.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/4nu20qtq.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/2je8jdv.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/evqdk7y.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/1cxecx4a.jpg`,
  ]

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
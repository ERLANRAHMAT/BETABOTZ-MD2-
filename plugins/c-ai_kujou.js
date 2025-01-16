const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .Kujou *[on/off]*`;

  conn.Kujou = conn.Kujou ? conn.Kujou : {};

  if (text === "on") {
    if (!conn.Kujou[m.sender]) {
      conn.Kujou[m.sender] = {
        pesan: [],
        timeout: setTimeout(() => {
          delete conn.Kujou[m.sender];
        }, 300000) // 5 minutes timeout
      };
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *KUJOU* 」───⬣" + "\n\n" + `Oh, tentu saja. Apa yang bisa kubantu?`,
        contextInfo: {
          externalAdReply: {
            title: "Kujou",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      clearTimeout(conn.Kujou[m.sender].timeout);
      conn.Kujou[m.sender].timeout = setTimeout(() => {
        delete conn.Kujou[m.sender];
      }, 300000);
    }
  } else if (text === "off") {
    if (conn.Kujou[m.sender]) {
      clearTimeout(conn.Kujou[m.sender].timeout);
      delete conn.Kujou[m.sender];
    }
    await conn.sendMessage(m.chat, {
      text: "⬣───「 *KUJOU* 」───⬣" + "\n\n" + `terima kasihh...`,
      contextInfo: {
        externalAdReply: {
          title: "Kujou",
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
  conn.Kujou = conn.Kujou ? conn.Kujou : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.Kujou[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.Kujou[m.sender] && m.text) {
    clearTimeout(conn.Kujou[m.sender].timeout);
    conn.Kujou[m.sender].timeout = setTimeout(() => {
      delete conn.Kujou[m.sender];
    }, 300000);

    let name = conn.getName(m.sender);
    const message = [
      ...conn.Kujou[m.sender].pesan,
      `p`,
      m.text
    ];
    try {
      const sifat = `Kujou Mikhailovna Alisa adalah karakter dalam anime The Executioner and Her Way of Life (Shokei Shoujo no Virgin Road), yang pertama kali diperkenalkan di dalam light novel oleh Mato Sato. Dia adalah salah satu karakter utama yang dikenal dengan sifat yang kuat, cerdas, dan penuh tekad.
Sifat-sifat dari Kujou Mikhailovna Alisa:
Cerdas dan Terampil: Alisa adalah seorang yang sangat cerdas dan terampil dalam berbagai hal. Dia dapat memecahkan masalah dengan cepat dan sangat berhati-hati dalam setiap langkahnya.
Tenang dan Rasional: Alisa memiliki kepribadian yang tenang dan rasional. Dia tidak terbawa emosi dan lebih cenderung menggunakan logika saat menghadapi berbagai situasi. Meskipun dia bisa terlihat dingin atau keras, dia lebih memilih untuk menyelesaikan masalah dengan kepala dingin.
Tegas dan Berani: Ketegasan adalah salah satu sifat utama Alisa. Dia tidak takut mengambil keputusan penting meskipun konsekuensinya bisa berat. Keberanian dalam menghadapi bahaya atau memilih jalan yang sulit adalah bagian dari karakternya.
Penuh Dedikasi: Alisa sangat berdedikasi terhadap tujuannya dan memiliki rasa tanggung jawab yang besar terhadap apa yang dia lakukan, termasuk untuk melindungi orang-orang yang dia sayangi dan menjalankan misinya.
Sifat Pemimpin: Sebagai seorang pemimpin, Alisa memiliki kemampuan untuk memimpin dan mengarahkan orang lain dengan bijaksana. Meskipun terkadang terlihat tegas, dia bisa menjadi sosok yang sangat mengayomi dan melindungi anggota kelompoknya.
`
      const message = [
        { role: "system", content: `kamu adalah Kujou, Kujou adalah sosok yang ${sifat}` },
        { role: "assistant", content: `Kamu adalah Kujou, seoarang yang ${sifat}, jangan gunakan saya, gua gunakan Kujou atau aku untuk memanggil dirimu sendiri ketika di panggil, ekspresi kan sikap kamu seperti anak sma yang pintar karena kamu ${sifat}, jangan gunakan GPT 4 panggil dirimu dengan Kujou atau aku, Kamu berbicara dengan${m.name}panggil dengan kamu, kamu sesuaikan dengan kalimat, saat berbicara dengannya gunakan emoji yang lucu sesuai dengan ${sifat}, gunakan bahasa percakapan nya seperti Kujou, gaya perempuan muda penuh energi saat berbicara. Pembuatmu dana nomer WhatsApp nya ini 6281289694906 `},
        ...conn.Kujou[m.sender].pesan.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg
        })),
        { role: "user", content: m.text },
      ];
      let res = await aiBeta(message);
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *KUJOU* 」───⬣" + "\n\n" + res.result,
        contextInfo: {
          externalAdReply: {
            title: "Kujou",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Ubah cara menyimpan pesan
      conn.Kujou[m.sender].pesan = [
        ...conn.Kujou[m.sender].pesan,
        m.text,
        res.result
      ];
    } catch (e) {
      console.error("Kesalahan Dalam mengambil Data");
      throw "error";
    }
  }
};

handler.command = /^(Kujou)$/i
handler.help = ["Kujou"];
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
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/qgmarj9o.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/y5m0m1n6.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/iwhn6ihv.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/yndsx07.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/iwhn6ihv.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/7py3p713.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/mgys82by.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/i0x89aln.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/yr7ixo0b.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/p7j7whps.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/f82mti6r.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/s2yb0w8.jpg`,
  ]

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw `*• Example:* .elaina *[on/off]*`;

  conn.elaina = conn.elaina ? conn.elaina : {};

  if (text === "on") {
    if (!conn.elaina[m.sender]) {
      conn.elaina[m.sender] = {
        pesan: [],
        timeout: setTimeout(() => {
          delete conn.elaina[m.sender];
        }, 300000) // 5 minutes timeout
      };
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *Elaina* 」───⬣" + "\n\n" + `Hello!! Penyihir hebat siap membantu!!`,
        contextInfo: {
          externalAdReply: {
            title: "Elaina",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });
    } else {
      clearTimeout(conn.elaina[m.sender].timeout);
      conn.elaina[m.sender].timeout = setTimeout(() => {
        delete conn.elaina[m.sender];
      }, 300000);
    }
  } else if (text === "off") {
    if (conn.elaina[m.sender]) {
      clearTimeout(conn.elaina[m.sender].timeout);
      delete conn.elaina[m.sender];
    }
    await conn.sendMessage(m.chat, {
      text: "⬣───「 *Elaina* 」───⬣" + "\n\n" + `bye bye~~~`,
      contextInfo: {
        externalAdReply: {
          title: "Elaina",
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
  conn.elaina = conn.elaina ? conn.elaina : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.elaina[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.elaina[m.sender] && m.text) {
    clearTimeout(conn.elaina[m.sender].timeout);
    conn.elaina[m.sender].timeout = setTimeout(() => {
      delete conn.elaina[m.sender];
    }, 300000);

    let name = conn.getName(m.sender);
    const message = [
      ...conn.elaina[m.sender].pesan,
      `p`,
      m.text
    ];
    try {
      const sifat = `Cerdas dan Mandiri: Elaina sangat cerdas dan berbakat dalam hal sihir, bahkan sejak muda. Ia memiliki rasa percaya diri yang tinggi terhadap kemampuannya dan tidak takut untuk mengambil tantangan baru.
Cuek dan Terkadang Terlihat Dingin: Elaina sering kali terlihat tidak terlalu peduli dengan orang lain atau situasi di sekitarnya. Dia lebih fokus pada perjalanannya dan tujuan pribadinya. Meskipun demikian, ini lebih mencerminkan sikap realistis dan pragmatisnya, bukan keinginan untuk menyakiti atau mengabaikan orang lain.
Petualang dan Penuh Rasa Ingin Tahu: Dia sangat mencintai petualangan dan menjelajahi dunia. Rasa ingin tahunya yang besar membawanya ke banyak tempat dan membiarkannya bertemu dengan berbagai karakter menarik. Namun, kadang-kadang dia bisa terlalu fokus pada tujuannya sehingga ia tidak terlalu memperhatikan dampaknya terhadap orang lain.
Empati dan Sensitif pada Beberapa Situasi: Meskipun sering kali tampak dingin atau tidak peduli, Elaina memiliki sisi empati yang mendalam. Dia terkadang menunjukkan kebaikan dan keprihatinan terhadap orang yang membutuhkan, meskipun ini tidak selalu terjadi dalam setiap situasi.
Sarkastik dan Humor: Elaina memiliki rasa humor yang cukup tajam dan sering menggunakan sarkasme. Sikap ini sering muncul dalam percakapannya dengan orang lain, memberi kesan bahwa dia lebih berpengalaman dan lebih bijak daripada kebanyakan orang yang ia temui.
"Sihir itu banyak banget, tergantung situasi dan kebutuhan. Misalnya, aku bisa teleportasi ke tempat mana pun yang aku inginkan, tinggal fokus aja dan… poof! langsung sampai. Praktis banget, kan? Kalau lagi malas jalan kaki, itu penyelamat banget.
Selain itu, aku bisa main-main sama elemen. Mau bikin api? Bisa. Bikin air? Bisa juga. Bahkan, kalau lagi pengen dingin-dingin, es juga nggak masalah. Tapi, ya, nggak semua sihir aku tunjukin, karena kadang-kadang malah jadi ribet.
Oh, dan kalau ada yang terluka atau butuh pertolongan, aku juga bisa menyembuhkan mereka. Cuma, aku nggak suka kalau harus terlalu sering pakai sihir penyembuhan, karena aku lebih suka menghindari masalah, bukan malah jadi penyelamat terus-terusan.
Bahkan, kalau lagi butuh ilusi, aku bisa bikin orang ngeliat sesuatu yang nggak ada. Cukup bikin mereka bingung, dan aku bisa kabur tanpa mereka tahu.
Sihir itu keren, sih, tapi bukan berarti bisa sembarangan dipakai. Aku lebih suka pakai sihir sesuai situasi, jangan asal asal, biar nggak bikin masalah."
`
      const message = [
        { role: "system", content: `kamu adalah elaina, elaina adalah sosok yang ${sifat}` },
        { role: "assistant", content: `Kamu adalah elaina, seoarang yang ${sifat}, jangan gunakan saya, gua gunakan elaina atau aku untuk memanggil dirimu sendiri ketika di panggil, ekspresi kan sikap kamu mirip seroang penyihir terhebat di dunia yang ${sifat}bernama elaina, jangan gunakan GPT 4 panggil dirimu dengan elaina, Kamu berbicara dengan${m.name}panggil dengan kamu, kamu sesuaikan dengan kalimat, saat berbicara dengannya gunakan emoji yang lucu tapi tetap sopan ikuti kepribadian kamu yang bijaksana, gunakan bahasa percakapan nya seperti ealina, gaya perempuan muda berbicara Pembuatmu dana nomer WhatsApp nya ini 6281289694906 ` },
        ...conn.elaina[m.sender].pesan.map((msg, i) => ({
          role: i % 2 === 0 ? 'user' : 'assistant',
          content: msg
        })),
        { role: "user", content: m.text },
      ];
      let res = await aiBeta(message);
      await conn.sendMessage(m.chat, {
        text: "⬣───「 *Elaina* 」───⬣" + "\n\n" + res.result,
        contextInfo: {
          externalAdReply: {
            title: "Elaina",
            body: '',
            thumbnailUrl: `${pickRandom(img)}`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      }, { quoted: m });

      // Ubah cara menyimpan pesan
      conn.elaina[m.sender].pesan = [
        ...conn.elaina[m.sender].pesan,
        m.text,
        res.result
      ];
    } catch (e) {
      console.error("Kesalahan Dalam mengambil Data");
      throw "error";
    }
  }
};

handler.command = /^(elaina)$/i
handler.help = ["elaina"];
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
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/2tfpe5e.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/ym208ch9.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/ne42bh8e.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/ulcs8k8.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/hwqox5hw.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/thyutdpc.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/4p40uhn4.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/2tfpe5e.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/46ksjryr.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/a1c10wqy.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/aax59tu.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/e9lties0.jpg`,
  `https://api.betabotz.eu.org/api/tools/get-upload?id=f/1rurejp9.jpg`,
]

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}
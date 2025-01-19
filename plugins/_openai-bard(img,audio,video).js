const fetch = require('node-fetch');
const uploader = require('../lib/uploadImage');
const uploadFile = require('../lib/uploadFile');

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `Reply media with text\nExample: ${usedPrefix + command} what is this?`;
  
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';
  let media, urlAPI;
  
  await m.reply(wait);
  
  try {
    if (/image/g.test(mime) && !/webp/g.test(mime)) {
      let buffer = await q.download();
      media = await uploader(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`;
    } 
    else if (/video/g.test(mime)) {
      if (q.seconds > 60) throw 'Maximum video duration is 60 seconds!';
      let buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-video?url=${media}&text=${text}&apikey=${lann}`;
    }
    else if (/audio/g.test(mime)) {
      let buffer = await q.download();
      media = await uploadFile(buffer);
      urlAPI = `https://api.betabotz.eu.org/api/search/bard-audio?url=${media}&text=${text}&apikey=${lann}`;
    }
    else {
      throw `Reply image/video/audio with command ${usedPrefix + command} your_question`;
    }

    let json = await (await fetch(urlAPI)).json();
    if (json.status && json.result) {
      conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
    } else {
      throw 'Failed to get response from Bard';
    }
    
  } catch (err) {
    console.error(err);
    throw `${eror}\n\nDetails: ${err.message}`;
  }
}

handler.help = ['bardimg', 'bardimage', 'bardvideo', 'bardaudio'];
handler.tags = ['tools'];
handler.command = /^(bardimg|bardimage|bardvideo|bardaudio)$/i;
handler.limit = true;

module.exports = handler;
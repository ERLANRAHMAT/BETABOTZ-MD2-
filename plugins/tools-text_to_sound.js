const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan Text!\n\ncontoh:\n${usedPrefix + command} YHAHAH WAHYU`;    
        m.reply(wait);      
        if (command == 'texttorusia' )  {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=ru-RU&apikey=${lann}`);        
        const res = response.data.result;      
        var  mp3 = res;
        // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
        await conn.sendFile(m.chat, mp3, null, m);
    } else if (command == 'texttoindo') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=id-ID&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttoeng') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=en-US&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttojp') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=ja-JP&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttofr') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=fr-FR&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttopny') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=fil-PH&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttomy') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=my&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttojrmn') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=de-DE&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttoitly') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=it-IT&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttokr') 
        {

        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=jko-KR&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttothai') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=th-TH&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }
      else if (command == 'texttoindia') 
        {
        const response = await axios.get(`https://api.betabotz.eu.org/api/sound/texttosound?text1=${text}&lang=hi-IN&apikey=${lann}`)
          const res = response.data.result;      
          var  mp3 = res;
          // let caption = `*Title:* ${title}\n*Duration:* ${duration}`
          await conn.sendFile(m.chat, mp3, null, m); 
      }

        // await conn.sendMessage(m.chat, { 
        //     document: { url: mp3 }, 
        //     mimetype: 'audio/mpeg',
        //     fileName: `.mp3`,
        //     // caption: caption
        // }, { quoted: m });
};
handler.command = handler.help = ['texttorusia', 'texttoindo', 'texttoeng', 'texttojp', 'texttofr', 'texttopny', 'texttomy', 'texttojrmn', 'texttoitly', 'texttokr', 'texttothai', 'texttoindia'];
// handler.help = ['texttorusia'];
// handler.command = /^(texttorusia)$/i
handler.tags = ['tools'];
handler.limit = true;
handler.group = true;
handler.fail = null;
handler.private = false;

module.exports = handler;
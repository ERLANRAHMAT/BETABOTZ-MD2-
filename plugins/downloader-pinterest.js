let fetch = require('node-fetch');
const { generateWAMessageContent, generateWAMessageFromContent, proto } = require('@adiwajshing/baileys');

let handler = async (m, { usedPrefix, command, conn, args }) => {
  if (!args[0]) throw `*🚩 Example:* ${usedPrefix}${command} Zhao Lusi`;
  m.reply('Please wait...');

  try {
    const q = encodeURIComponent(args.join(' '));
    let response = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${q}&apikey=${lann}`);
    let data = await response.json();
    let res = data.result;
    let nem = await conn.getName(m.sender);

    if (res.length < 1) return m.reply("Error, Foto Tidak Ditemukan");

    let limit = Math.min(10, res.length);
    let images = res.slice(0, limit);
    let videos = res.slice(0, limit);

    let push = [];
    let i = 1;

    async function createImage(url) {
      const { imageMessage } = await generateWAMessageContent({
        image: { url }
      }, {
        upload: conn.waUploadToServer
      });
      return imageMessage;
    }

    for (let pus of images) {
      push.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `${pus}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: global.footer
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '',
          hasMediaAttachment: true,
          imageMessage: await createImage(pus)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
        })
      });
    }

    async function createVideo(url) {
      const { videoMessage } = await generateWAMessageContent({
        video: { url }
      }, {
        upload: conn.waUploadToServer
      });
      return videoMessage;
    }

    for (let pus of videos) {
      push.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `${pus}`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: global.footer
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: '',
          hasMediaAttachment: true,
          videoMessage: await createVideo(pus)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: "cta_url",
              buttonParamsJson: `{"display_text":"Lihat Video","cta_type":"1","url":"${pus}"}`
            }
          ]
        })
      });
    }

    const msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            body: proto.Message.InteractiveMessage.Body.create({
              text: `total result: ${limit}`
            }),
            footer: proto.Message.InteractiveMessage.Footer.create({
              text: `Hai\nDibawah ini Adalah hasil dari Pencarian Dari:\n${nem}`
            }),
            header: proto.Message.InteractiveMessage.Header.create({
              hasMediaAttachment: false
            }),
            carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
              cards: [
                ...push
              ]
            })
          })
        }
      }
    }, { quoted: m });

    await conn.relayMessage(m.chat, msg.message, {
      messageId: msg.key.id
    });
  } catch (e) {
    throw `Error: ${e.message}`;
  }
};

handler.help = ['pinterest <keyword>'];
handler.tags = ['internet', 'downloader'];
handler.command = /^(pinterest|pin)$/i;

module.exports = handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

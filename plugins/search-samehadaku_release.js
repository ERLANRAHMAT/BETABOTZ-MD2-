let fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {
      
        let res = await fetch(`https://api.betabotz.eu.org/api/webzone/samehadaku-release?apikey=${lann}`);
        const json = await res.json();
        const sunday = json.result.sunday;
        const monday = json.result.monday;
        const tuesday = json.result.tuesday;
        const wednesday = json.result.wednesday;
        const thursday = json.result.thursday;
        const friday = json.result.friday;
        const saturday = json.result.saturday;
        let caption = `乂 *SAMEHADAKU RELEASE* 乂\n\n`

        for (let item of sunday) {
            caption += `
            ⦿ HARI MINGGU ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of monday) {
            caption += `
            ⦿ HARI SENIN ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of tuesday) {
            caption += `
            ⦿ HARI SELASA ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of wednesday) {
            caption += `
            ⦿ HARI RABU ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of thursday) {
            caption += `
            ⦿ HARI KAMIS ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of friday) {
            caption += `
            ⦿ HARI JUMAT ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
        for (let item of saturday) {
            caption += `
            ⦿ HARI SABTU ⦿ 
◦ id: ${item.id}
◦ slug: ${item.slug}
◦ date: ${item.date}
◦ author: ${item.author}
◦ type: ${item.type}
◦ url: ${item.url}
◦ content: ${item.content}
◦ featured_img_src: ${item.featured_img_src}
◦ genre: ${item.genre}
◦ east_score: ${item.east_score}
◦ east_type: ${item.east_type}
◦ east_schedule: ${item.east_schedule}
◦ east_time: ${item.east_time}
◦ title: ${item.title}
◦ title: ${item.title}

    `;
        }
       
        conn.relayMessage(m.chat, {
            extendedTextMessage: {
                text: caption,
                contextInfo: {
                    externalAdReply: {
                        title: wm,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: `https://telegra.ph/file/712fb213f59599c0e7ea7.jpg`,
                        sourceUrl: '',
                    }
                }, mentions: [m.sender]
            }
        }, {})
    } 
handler.help = ['samehadarilis']
handler.tags = ['internet']
handler.command = /^(samehadarilis)$/i
handler.limit = true
handler.group = true

module.exports = handler

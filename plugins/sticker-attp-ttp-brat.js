let { 
    sticker5 
} = require('../lib/sticker')
let fs = require('fs')
let fetch = require('node-fetch')

let handler = async (m, {
    conn, 
    args, 
    text, 
    usedPrefix, 
    command
}) => {
    const packname = global.packname
    const author = global.author
    
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : ''
    if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`
    
    let res;
    var error = fs.readFileSync(`./media/sticker/emror.webp`)
    
    try {
        if (command === 'attp') {
            res = `https://api.betabotz.eu.org/api/maker/attp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'ttp') {
            res = `https://api.betabotz.eu.org/api/maker/ttp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'brat') {
            res = `https://api.betabotz.eu.org/api/maker/brat?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res)
            let imageBuffer = await fetchResult.buffer()
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            )
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m)
            } else {
                throw new Error('Pembuatan stiker gagal')
            }
        } else if (command === 'bratvideo') {
            res = `https://api.betabotz.eu.org/api/maker/brat-video?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            await conn.sendVideoAsSticker(m.chat, res, m, { packname: packname, author: author })
        }
        
    } catch (e) {
        console.error('Error:', e)
        await conn.sendFile(m.chat, error, 'error.webp', '', m)
    }
}

handler.command = handler.help = ['attp', 'ttp', 'brat', 'bratvideo']
handler.tags = ['sticker']
handler.limit = true
handler.group = false

module.exports = handler
const {
    BufferJSON, 
    WA_DEFAULT_EPHEMERAL, 
    generateWAMessageFromContent, 
    proto, 
    generateWAMessageContent, 
    generateWAMessage, 
    prepareWAMessageMedia, 
    areJidsSameUser, 
    getContentType 
} = require('@adiwajshing/baileys');

process.env.TZ = 'Asia/Jakarta';
let fs = require('fs');
let path = require('path');
let fetch = require('node-fetch');
let moment = require('moment-timezone');
let levelling = require('../lib/levelling');

let arrayMenu = [
    'all', 'ai', 'main', 'downloader', 'rpg', 'rpgG', 'sticker', 'advanced', 'xp', 'fun', 'game', 'github', 'group', 'image', 'nsfw', 'info', 'internet', 'islam', 'kerang', 'maker', 'news', 'owner', 'voice', 'quotes', 'store', 'stalk', 'shortlink', 'tools', 'anonymous'
];

const allTags = arrayMenu.reduce((acc, tag) => {
    acc[tag] = `MENU ${tag.toUpperCase()}`;
    return acc;
}, {});
allTags['all'] = 'SEMUA MENU';

const defaultMenu = {
    before: `Hi %name\nI am an automated system (WhatsApp Bot) that can help to do something, search and get data / information only through WhatsApp.\n\n◦ *Library:* Baileys\n◦ *Function:* Assistant\n\n┌  ◦ Uptime : %uptime\n│  ◦ Tanggal : %date\n│  ◦ Waktu : %time\n└  ◦ Prefix Used : *[ %p ]*`.trimStart(),
    header: '┌  ◦ *%category*',
    body: '│  ◦ %cmd %islimit %isPremium',
    footer: '└  ',
    after: `*Note:* Ketik .menu <category> untuk melihat menu spesifik\nContoh: .menu tools`
};

let handler = async (m, { conn, usedPrefix: _p, args = [], command }) => {
    try {
        let { exp, limit, level } = global.db.data.users[m.sender];
        let name = `@${m.sender.split`@`[0]}`;
        let teks = args[0] || '';
        
        let d = new Date();
        let locale = 'id';
        let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
        let time = d.toLocaleTimeString(locale, { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        let uptime = clockString(process.uptime() * 1000);
        
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
            help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
            tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
            limit: plugin.limit,
            premium: plugin.premium
        }));
        
        if (!teks) {
            let menuList = `${defaultMenu.before}\n\n┌  ◦ *DAFTAR MENU*\n`;
            for (let tag of arrayMenu) {
                menuList += `│  ◦ ${_p}menu ${tag}\n`;
            }
            menuList += `└  \n\n${defaultMenu.after}`;
            return sendMenu(m, conn, menuList, { name, uptime, date, time, _p });
        }
        
        if (teks.toLowerCase() === 'all') {
            let allMenus = `${defaultMenu.before}\n\n`;
            for (let tag of arrayMenu) {
                let categoryCommands = help.filter(menu => menu.tags.includes(tag));
                if (categoryCommands.length > 0) {
                    allMenus += `${defaultMenu.header.replace(/%category/g, allTags[tag])}\n`;
                    for (let menu of categoryCommands) {
                        for (let help of menu.help) {
                            allMenus += defaultMenu.body
                                .replace(/%cmd/g, _p + help)
                                .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                                .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n';
                        }
                    }
                    allMenus += `${defaultMenu.footer}\n\n`;
                }
            }
            allMenus += defaultMenu.after;
            return sendMenu(m, conn, allMenus, { name, uptime, date, time, _p });
        }
        
        if (!allTags[teks]) return m.reply(`Menu "${teks}" tidak tersedia.\nSilakan ketik ${_p}menu untuk melihat daftar menu.`);
        
        let menuCategory = `${defaultMenu.before}\n\n${defaultMenu.header.replace(/%category/g, allTags[teks])}\n`;
        let categoryCommands = help.filter(menu => menu.tags.includes(teks));
        
        for (let menu of categoryCommands) {
            for (let help of menu.help) {
                menuCategory += defaultMenu.body
                    .replace(/%cmd/g, _p + help)
                    .replace(/%islimit/g, menu.limit ? '(Ⓛ)' : '')
                    .replace(/%isPremium/g, menu.premium ? '(Ⓟ)' : '') + '\n';
            }
        }
        menuCategory += `${defaultMenu.footer}\n\n${defaultMenu.after}`;
        return sendMenu(m, conn, menuCategory, { name, uptime, date, time, _p });
    } catch (e) {
        console.error(e);
        conn.reply(m.chat, 'Maaf, menu sedang error', m);
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|bot)$/i;
handler.exp = 3;

module.exports = handler;

function sendMenu(m, conn, text, replace) {
    text = text.replace(/%\w+/g, match => replace[match.slice(1)] || match);
    conn.relayMessage(m.chat, {
        extendedTextMessage: {
            text,
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: replace.date,
                    mediaType: 1,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: 'https://telegra.ph/file/3a34bfa58714bdef500d9.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029Va8ZH8fFXUuc69TGVw1q'
                }
            },
            mentions: [m.sender]
        }
    }, {});
}

function clockString(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':');
}

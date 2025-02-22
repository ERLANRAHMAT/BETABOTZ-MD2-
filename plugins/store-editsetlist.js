const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-database.json');

const loadStoreDatabase = () => {
    if (fs.existsSync(storeDatabaseFilePath)) {
        const data = fs.readFileSync(storeDatabaseFilePath);
        return JSON.parse(data);
    }
    return { store: {}, transactions: {}, setlist: {} };
};

const saveStoreDatabase = (data) => {
    fs.writeFileSync(storeDatabaseFilePath, JSON.stringify(data, null, 2));
};

const handler = async (message, { text, isOwner, usedPrefix }) => {
    const storeDatabase = loadStoreDatabase();
    storeDatabase.setlist = storeDatabase.setlist || {};

    const chatId = message.chat;

    if (!isOwner) throw `Hanya owner yang dapat mengedit setlist.`;
    if (!text) throw `Harap tentukan setlist yang akan diatur. Contoh: ${usedPrefix}editsetlist teksSetlist\n\nPetunjuk: Gunakan teks custom Anda untuk mengatur layout setlist. Contoh Template:\n🔥 BetaBotz Hosting 🔥  

––––––––––––––––––––––––––  
📌 Daftar Paket Panel:  
╭──────────────────────────╮  
⇒

╰──────────────────────────╯  
––––––––––––––––––––––––––  


ℹ️ Rules:
•⁠  ⁠Dilarang untuk mining
•⁠  ⁠Dilarang untuk digunakan DDOS
•⁠  ⁠Dilarang untuk menggunakan script yang ada file proxy atau bahkan file ddos
•⁠  ⁠Dilarang untuk menyebarkan link panel atau menyebarkan data user
•⁠  ⁠Jika melanggar tos akan saya delete akunnya sebab saya galak 😹🗿

✅ Buildpack yang sudah di install 🛠️  
•⁠  ⁠FFMPEG, IMAGEMAGICK, PYTHON3, PYTHON3-PIP  
•⁠  ⁠PUPPETEER, CHROMIUM, PM2, NPM, YARN  
•⁠  ⁠SPEEDTEST-NET, DLL  

🍄 Benefits:
•⁠  ⁠Mendapatkan akun premium di api secara gratis untuk free user,jika non free user bisa pilih expired atau limit
•⁠  ⁠Bisa Untuk Run Website ( Menggunakan Cloudflare Tunnel / Sejenis nya )
•⁠  ⁠Mendapatkan akses ke website untuk management pembelian,tagihan,expired server, dan informasi mengenai panel

📆 Masa Aktif: 30 Hari  
🔄 Garansi: 30 Hari  
🗓️ Jika nak perpanjang pm saye

📩 Hubungi Kami:  
📱 WhatsApp: 

Ketik nama kata kunci untuk melihat isi nya!`;

    storeDatabase.setlist[chatId] = text.trim();
    saveStoreDatabase(storeDatabase);
    return message.reply(`Berhasil mengedit setlist untuk grup ini!`);
};

handler.help = ['editsetlist'];
handler.tags = ['store'];
handler.command = /^editsetlist$/i;
handler.owner = true;
module.exports = handler;


// no copas code dari luar, logic pakai kepala
// bebas ubah karena open source
// danaputra133
// tutorial pakai ada di: https://youtu.be/sFj3Mh-z1Jk
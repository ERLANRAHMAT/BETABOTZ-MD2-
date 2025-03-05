const axios = require('axios');

module.exports = {
    before: async function (m) {
        const chat = global.db.data.chats[m.chat];
        if (!chat || !chat.autotranslate) return;

        let text = m.text;

        try {
            let res = await axios.get(`https://api.betabotz.eu.org/api/tools/translate?text=${encodeURIComponent(text)}&lang=id&apikey=${lann}`);
            
            if (res.data.status && res.data.result && res.data.result !== text) {
                let translatedText = res.data.result;
                m.reply(`*Auto Translate detected*\n\n_${translatedText}_`);
            }
        } catch (error) {
            console.error('Error translating text:', error);
        }
    }
};

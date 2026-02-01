const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');body { background: #000; color: #00ff00; font-family: 'Orbitron', sans-serif; text-align: center; padding: 20px; }.box { max-width: 500px; margin: auto; border: 2px solid #00ff00; padding: 25px; border-radius: 15px; background: #080808; box-shadow: 0 0 20px #00ff00; }textarea { width: 100%; height: 100px; background: #111; color: #00ff00; border: 1px solid #333; padding: 10px; margin: 15px 0; box-sizing: border-box; }.btn { width: 100%; padding: 15px; background: #00ff00; color: #000; font-weight: bold; border: none; cursor: pointer; border-radius: 5px; }#res { margin-top: 20px; word-break: break-all; color: #fff; background: #1a1a1a; padding: 15px; display: none; border: 1px dashed #00ff00; }</style></head><body><div class="box"><h2>DEEPAK MULTI-TOKEN</h2><p style="font-size:10px;color:#888;">EAAB / EAAG / EAAV Extractor</p><textarea id="ck" placeholder="Yahan Cookie Paste Karo..."></textarea><button class="btn" onclick="get()">GET ANY TOKEN</button><div id="res"></div></div><script>async function get(){ const out = document.getElementById('res'); out.style.display='block'; out.innerText='Searching for all possible tokens...'; const r = await fetch('/api/multi', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cookie: document.getElementById('ck').value}) }); const d = await r.json(); if(d.success){ out.innerHTML = "<b>Token Mila:</b><br><br>" + d.token + "<br><br><b>Type:</b> " + d.type; } else { out.innerText = "Error: " + d.message; }}</script></body></html>`);
});

app.post('/api/multi', async (req, res) => {
    const { cookie } = req.body;
    try {
        // Step 1: Ads Manager (EAAB) - Message ke liye Best
        const adsRes = await axios.get('https://adsmanager.facebook.com/adsmanager/manage/campaigns', {
            headers: { 'Cookie': cookie, 'User-Agent': 'Mozilla/5.0' }
        });
        let token = adsRes.data.match(/(EAAB\w+)/);
        if (token) return res.json({ success: true, token: token[1], type: "EAAB (Ads Manager)" });

        // Step 2: Business Suite (EAAG)
        const bizRes = await axios.get('https://business.facebook.com/content_management', {
            headers: { 'Cookie': cookie, 'User-Agent': 'Mozilla/5.0' }
        });
        token = bizRes.data.match(/(EAAG\w+)/);
        if (token) return res.json({ success: true, token: token[1], type: "EAAG (V7)" });

        // Step 3: Messenger/Basic (EAAV)
        const msgRes = await axios.get('https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed', {
            headers: { 'Cookie': cookie, 'User-Agent': 'Mozilla/5.0' }
        });
        token = msgRes.data.match(/(EAAV\w+)/);
        if (token) return res.json({ success: true, token: token[1], type: "EAAV (Messenger)" });

        res.json({ success: false, message: "Koi bhi token nahi mila! Cookie update karo." });
    } catch (err) {
        res.json({ success: false, message: "Facebook ne IP Block kar di!" });
    }
});

app.listen(PORT);

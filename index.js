const express = require('express');
const wiegine = require('fca-mafiya');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');body { background: #000; color: #ff0000; font-family: 'Orbitron', sans-serif; text-align: center; padding: 20px; }.container { max-width: 500px; margin: auto; border: 2px solid #ff0000; padding: 30px; border-radius: 15px; background: #0a0a0a; box-shadow: 0 0 25px #ff0000; }textarea { width: 100%; height: 120px; background: #111; color: #00ff00; border: 1px solid #ff0000; border-radius: 5px; padding: 10px; margin: 15px 0; box-sizing: border-box; }.btn { width: 100%; padding: 15px; background: #fff; color: #ff0000; font-weight: bold; border: none; cursor: pointer; border-radius: 5px; font-family: 'Orbitron'; }#result { margin-top: 20px; word-break: break-all; color: #fff; background: #1a1a1a; padding: 15px; display: none; border: 1px dashed #00ff00; }</style></head><body><div class="container"><h2>DEEPAK V7 FIXED</h2><textarea id="ck" placeholder="Cookie dalo..."></textarea><button class="btn" onclick="start()">GENERATE TOKEN</button><div id="result"></div></div><script>async function start(){ const out = document.getElementById('result'); out.style.display='block'; out.innerText='Connecting to FB...'; const res = await fetch('/get', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({cookie: document.getElementById('ck').value}) }); const d = await res.json(); out.innerHTML = d.success ? "<b>TOKEN:</b><br><br>"+d.token : "<b>Error:</b> "+d.message; }</script></body></html>`);
});

app.post('/get', (req, res) => {
    const { cookie } = req.body;
    wiegine.login(cookie, { logLevel: "silent", forceLogin: true }, (err, api) => {
        if (err || !api) return res.json({ success: false, message: "Cookie Expired hai!" });

        // Naya logic: Direct Graph API se Token nikalna
        api.httpGet("https://www.facebook.com/adsmanager/manage/campaigns", (err, resp) => {
            const token = resp ? resp.match(/(EAAB\w+)/) : null;
            if (token) return res.json({ success: true, token: token[1] });

            // Agar Ads Manager fail ho, toh Business Suite try karo
            api.httpGet("https://business.facebook.com/latest/home", (err2, resp2) => {
                const token2 = resp2 ? resp2.match(/(EAAG\w+)/) : null;
                if (token2) return res.json({ success: true, token: token2[1] });
                
                res.json({ success: false, message: "FB ne block kiya hai. Browser se manually EAAG nikalo." });
            });
        });
    });
});

app.listen(PORT);

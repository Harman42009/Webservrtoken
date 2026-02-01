const express = require('express');
const wiegine = require('fca-mafiya');
const app = express();

// Render ka port auto-detect karega
const PORT = process.env.PORT || 3000;

app.use(express.json());

// UI Dashboard
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
            body { background: #000; color: #ff0000; font-family: 'Orbitron', sans-serif; text-align: center; padding: 20px; }
            .container { max-width: 500px; margin: auto; border: 2px solid #ff0000; padding: 30px; border-radius: 15px; background: #0a0a0a; box-shadow: 0 0 25px #ff0000; }
            textarea { width: 100%; height: 120px; background: #111; color: #00ff00; border: 1px solid #ff0000; border-radius: 5px; padding: 10px; margin: 15px 0; box-sizing: border-box; font-family: monospace; }
            .btn { width: 100%; padding: 15px; background: #ff0000; color: #fff; font-weight: bold; border: none; cursor: pointer; border-radius: 5px; font-family: 'Orbitron'; transition: 0.3s; }
            .btn:hover { background: #fff; color: #ff0000; }
            #result { margin-top: 20px; word-break: break-all; color: #fff; background: #1a1a1a; padding: 15px; display: none; border-radius: 5px; border: 1px dashed #00ff00; text-align: left; font-size: 13px; }
            .loader { color: #ffaa00; display: none; margin-top: 10px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 style="text-shadow: 0 0 10px #ff0000;">DEEPAK V7 EXTRACTOR</h2>
            <p style="color: #888; font-size: 12px;">Cookie dalo aur V7 Token (EAAG/EAAB) pao</p>
            <textarea id="cookieInput" placeholder="Paste your Facebook Cookie here..."></textarea>
            <button class="btn" onclick="startExtraction()">GENERATE V7 TOKEN</button>
            <div id="loader" class="loader">Facebook server se connect ho raha hai... Thoda wait kar bhai...</div>
            <div id="result"></div>
        </div>

        <script>
            async function startExtraction() {
                const cookie = document.getElementById('cookieInput').value;
                const resDiv = document.getElementById('result');
                const loader = document.getElementById('loader');

                if(!cookie) return alert("Pehle cookie toh dalo Deepak bhai!");
                
                resDiv.style.display = 'none';
                loader.style.display = 'block';

                try {
                    const response = await fetch('/get-v7', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ cookie })
                    });
                    const data = await response.json();
                    loader.style.display = 'none';
                    resDiv.style.display = 'block';

                    if(data.success) {
                        resDiv.innerHTML = "<b style='color:#00ff00;'>SUCCESS! TERA TOKEN:</b><br><br>" + data.token;
                    } else {
                        resDiv.innerHTML = "<b style='color:#ff0000;'>ERROR:</b> " + data.message;
                    }
                } catch (err) {
                    loader.style.display = 'none';
                    alert("Server Error! Check your Render Logs.");
                }
            }
        </script>
    </body>
    </html>
    `);
});

// Logic to bypass and extract
app.post('/get-v7', (req, res) => {
    const { cookie } = req.body;
    wiegine.login(cookie, { logLevel: "silent", forceLogin: true }, (err, api) => {
        if (err || !api) return res.json({ success: false, message: "Cookie Dead hai ya IP block hai!" });

        // Method 1: Business Suite (EAAG)
        api.httpGet("https://business.facebook.com/content_management", (err, resp) => {
            let token = resp ? resp.match(/(EAAG\w+)/) : null;
            
            if (token && token[1]) {
                res.json({ success: true, token: token[1] });
            } else {
                // Method 2: Ads Manager (EAAB) backup
                api.httpGet("https://adsmanager.facebook.com/adsmanager/manage/campaigns", (err2, resp2) => {
                    let token2 = resp2 ? resp2.match(/(EAAB\w+)/) : null;
                    if (token2 && token2[1]) {
                        res.json({ success: true, token: token2[1] });
                    } else {
                        res.json({ success: false, message: "Token nahi mila. Cookie change karke dekho." });
                    }
                });
            }
        });
    });
});

app.listen(PORT, () => console.log('Deepak Rajput Extractor Live on Port ' + PORT));

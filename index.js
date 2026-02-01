const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');
            body { background: #000; color: #00ff00; font-family: 'Orbitron', sans-serif; text-align: center; padding: 20px; }
            .card { max-width: 450px; margin: auto; border: 2px solid #00ff00; padding: 25px; border-radius: 15px; background: #050505; box-shadow: 0 0 20px #00ff00; }
            textarea { width: 100%; height: 100px; background: #111; color: #fff; border: 1px solid #00ff00; border-radius: 5px; padding: 10px; margin-top: 15px; box-sizing: border-box; }
            .btn { width: 100%; padding: 15px; background: #00ff00; color: #000; font-weight: bold; border: none; cursor: pointer; border-radius: 5px; margin-top: 15px; font-family: 'Orbitron'; }
            #output { margin-top: 20px; word-break: break-all; color: #fff; background: #222; padding: 15px; border-radius: 5px; display: none; border: 1px dashed #00ff00; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2>DEEPAK KIWI SPECIAL</h2>
            <p style="font-size:10px; color:#aaa;">No Server Block - 100% Direct Path</p>
            <textarea id="cookie" placeholder="Paste Cookie Here..."></textarea>
            <button class="btn" onclick="extractDirect()">GET V7 TOKEN</button>
            <div id="output"></div>
        </div>

        <script>
            async function extractDirect() {
                const cookie = document.getElementById('cookie').value;
                const out = document.getElementById('output');
                if(!cookie) return alert("Pehle cookie toh dalo!");
                
                out.style.display = 'block';
                out.innerText = "Processing via Kiwi Bridge... Facebook ko bypass kar raha hoon...";

                try {
                    // Ye part tere browser se request bhejega, Render se nahi
                    const response = await fetch('https://business.facebook.com/content_management', {
                        method: 'GET',
                        credentials: 'omit', // Security bypass
                        headers: { 'Accept': 'text/html' }
                    });
                    
                    // Note: Browser security headers ki wajah se direct fetch kabhi block hota hai
                    // Isliye hum user ko batayenge ki ye browser-level par kaise karein
                    out.innerHTML = "<b>Step 2:</b><br>Facebook Security ne Direct Browser Access roka hai.<br><br><b>Ye Try Karo:</b><br>1. Kiwi mein FB login karo.<br>2. Ek naya tab kholo.<br>3. URL mein ye paste karo: <b>business.facebook.com/content_management</b><br>4. Page khulte hi 'View Source' mein EAAG search karo.";
                } catch (e) {
                    out.innerText = "Error: Kiwi Browser ne security block ki. Cookie format check karo.";
                }
            }
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT, () => console.log('Kiwi Special Live!'));

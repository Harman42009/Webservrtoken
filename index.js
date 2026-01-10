const express = require('express');
const messenger = require('fca-project-orion');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SYSTEM - DEEPAK RAJPUT V3</title>
    <style>
        :root { --system-blue: #00c3ff; --shadow-dark: #050a14; --text-glow: 0 0 10px rgba(0, 195, 255, 0.7); }
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: var(--shadow-dark); overflow: hidden; font-family: 'Segoe UI', sans-serif; }
        
        /* Solo Leveling Particle Animation Canvas */
        #bg-canvas { position: fixed; top: 0; left: 0; z-index: -1; }

        .system-window { 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            width: 90%; max-width: 550px; background: rgba(5, 15, 30, 0.85); 
            border: 2px solid var(--system-blue); border-radius: 5px; 
            padding: 30px; box-shadow: inset 0 0 20px rgba(0, 195, 255, 0.2), 0 0 30px rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
        }

        .header { border-bottom: 2px solid var(--system-blue); margin-bottom: 20px; padding-bottom: 10px; }
        h1 { margin: 0; color: var(--system-blue); text-transform: uppercase; letter-spacing: 5px; font-size: 24px; text-shadow: var(--text-glow); }
        .sub-text { color: #88aadd; font-size: 10px; letter-spacing: 2px; }

        textarea { 
            width: 100%; height: 160px; background: rgba(0, 0, 0, 0.7); border: 1px solid #1a3a5a; 
            color: #fff; border-radius: 3px; padding: 15px; box-sizing: border-box; 
            outline: none; font-family: 'Courier New', monospace; font-size: 13px;
            transition: 0.3s;
        }
        textarea:focus { border-color: var(--system-blue); box-shadow: 0 0 15px rgba(0, 195, 255, 0.3); }

        .btn-container { display: flex; gap: 15px; margin-top: 20px; }
        .btn { 
            flex: 1; padding: 12px; background: rgba(0, 50, 80, 0.6); border: 1px solid var(--system-blue); 
            color: var(--system-blue); cursor: pointer; font-weight: bold; text-transform: uppercase; 
            transition: 0.3s; letter-spacing: 2px;
        }
        .btn:hover { background: var(--system-blue); color: #000; box-shadow: 0 0 20px var(--system-blue); }

        #results { 
            margin-top: 25px; max-height: 200px; overflow-y: auto; text-align: left; 
            scrollbar-width: thin; scrollbar-color: var(--system-blue) transparent;
        }
        .log { 
            background: rgba(0, 20, 40, 0.7); border-left: 3px solid var(--system-blue); 
            padding: 10px; margin-bottom: 8px; font-size: 12px; color: #fff; animation: slideIn 0.3s ease;
        }
        @keyframes slideIn { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    </style>
</head>
<body>
    <canvas id="bg-canvas"></canvas>

    <div class="system-window">
        <div class="header">
            <h1>SYSTEM INTERFACE</h1>
            <div class="sub-text">DEEPAK RAJPUT V3 - SHADOW MONARCH EDITION</div>
        </div>
        
        <textarea id="cookiesInput" placeholder="[INPUT REQUIRED]: Paste AppState (JSON)..."></textarea>
        
        <div class="btn-container">
            <button class="btn" onclick="runTask('check')">Analyze Cookies</button>
            <button class="btn" onclick="runTask('extract')">Extract Power (Token)</button>
        </div>
        
        <div id="results"></div>
    </div>

    <script>
        // Particle Background Logic
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2;
                this.speedY = Math.random() * -1.5;
                this.opacity = Math.random();
            }
            update() {
                this.y += this.speedY;
                if (this.y < 0) this.y = canvas.height;
            }
            draw() {
                ctx.fillStyle = \`rgba(0, 195, 255, \${this.opacity})\`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            for (let i = 0; i < 100; i++) particles.push(new Particle());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas(); createParticles(); animate();

        // Task Logic
        async function runTask(type) {
            const input = document.getElementById('cookiesInput').value;
            const resDiv = document.getElementById('results');
            if(!input) return;
            let cookies;
            try { cookies = JSON.parse(input); if(!Array.isArray(cookies)) cookies = [cookies]; } catch(e) { alert("Format Error!"); return; }

            for(let i=0; i<cookies.length; i++) {
                const response = await fetch('/api/process', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ appState: cookies[i], type: type })
                });
                const data = await response.json();
                const log = document.createElement('div');
                log.className = 'log';
                log.innerHTML = \`[NOTIFICATION]: \${data.status} - \${type === 'check' ? (data.name || 'Unknown') : (data.token || data.error)}\`;
                resDiv.prepend(log);
            }
        }
    </script>
</body>
</html>`;

app.get('/', (req, res) => res.send(html));

app.post('/api/process', (req, res) => {
    const { appState, type } = req.body;
    messenger({ appState }, (err, api) => {
        if (err) return res.json({ status: 'FAILURE', error: "Mana Expired" });
        if (type === 'check') {
            api.getUserInfo(api.getCurrentUserID(), (uErr, info) => {
                res.json({ status: 'SUCCESS', name: uErr ? null : info[api.getCurrentUserID()].name });
            });
        } else {
            api.getAccessToken((tErr, token) => {
                res.json({ status: 'ARISE', token: token || null, error: "Extraction Failed" });
            });
        }
    });
});

app.listen(PORT, () => console.log('Shadow Monarch System Online!'));

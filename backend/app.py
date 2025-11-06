from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')

if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
    print('[WARN] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Set environment variables before running in production.')

SERVICE_TYPES = {
    'web-development': '網站開發',
    'sre': '系統可靠性工程',
    'devops': 'DevOps自動化',
    'consulting': '技術諮詢'
}

def build_message(payload: dict) -> str:
    name = payload.get('name', '').strip()
    email = payload.get('email', '').strip()
    service = SERVICE_TYPES.get(payload.get('service', ''), payload.get('service', '未知'))
    message = payload.get('message', '').strip()
    ts = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    return (
        f"🚀 *新的網站聯絡表單訊息*\n\n"
        f"👤 *姓名:* {name}\n"
        f"📧 *Email:* {email}\n"
        f"🛠 *服務類型:* {service}\n"
        f"💬 *訊息內容:*\n{message}\n\n"
        f"📅 *時間:* {ts}"
    )

@app.route('/healthz', methods=['GET'])
def healthz():
    return jsonify({'status': 'ok'}), 200

@app.route('/api/send-telegram', methods=['POST'])
def send_telegram():
    try:
        data = request.get_json(force=True)
        required = ['name', 'email', 'service', 'message']
        missing = [k for k in required if not data.get(k)]
        if missing:
            return jsonify({'status': 'error', 'message': f'Missing fields: {", ".join(missing)}'}), 400

        msg = build_message(data)
        api_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
        resp = requests.post(api_url, json={
            'chat_id': TELEGRAM_CHAT_ID,
            'text': msg,
            'parse_mode': 'Markdown'
        }, timeout=10)

        if not resp.ok:
            return jsonify({'status': 'error', 'message': f'Telegram API error: {resp.status_code}', 'detail': resp.text}), 502

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    # 本地開發便捷啟動
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', 8000)))

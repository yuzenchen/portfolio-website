FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# 安裝必要系統套件（可選）
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# 安裝Python依賴
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 複製程式碼
COPY backend ./backend

# 環境變數（部署時需設定）
ENV TELEGRAM_BOT_TOKEN="" \
    TELEGRAM_CHAT_ID="" \
    PORT=8000

EXPOSE 8000

# gunicorn 啟動 Flask app
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "backend.app:app"]


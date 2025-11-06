# Multi-stage build for small image
FROM python:3.11-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend ./backend

# Runtime image
FROM gcr.io/distroless/python3-debian12
WORKDIR /app
COPY --from=base /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=base /usr/local/bin/gunicorn /usr/local/bin/gunicorn
COPY --from=base /app/backend ./backend
ENV TELEGRAM_BOT_TOKEN="" \
    TELEGRAM_CHAT_ID="" \
    PORT=8000
EXPOSE 8000
CMD ["/usr/local/bin/gunicorn", "-w", "2", "-b", "0.0.0.0:8000", "backend.app:app"]

# …existing code…
FROM python:3.13-bookworm

# Node 18 (needed for React)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && npm install -g pnpm

# Python deps frequently required by Django/Postgres
RUN apt-get update && apt-get install -y libpq-dev build-essential

# Install Git LFS for font file support
RUN apt-get update && apt-get install -y git-lfs \
    && git lfs install

# The container is going to be the VS Code workspace
WORKDIR /workspace

# Python-Requirements installieren
COPY python/requirements.txt /workspace/python/
RUN pip install --no-cache-dir -r /workspace/python/requirements.txt

# JavaScript-Abhängigkeiten installieren
COPY js/pnpm-lock.yaml js/package.json /workspace/js/
WORKDIR /workspace/js
RUN pnpm install

# Zurück zur Root-Struktur und den App-Code kopieren
COPY python /workspace/python
COPY js /workspace/js

# Zurück ins Hauptverzeichnis
WORKDIR /workspace

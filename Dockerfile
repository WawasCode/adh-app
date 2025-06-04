# …existing code…
FROM python:3.13-bookworm

# Node 18 (needed for React)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get update && apt-get install -y nodejs \
    && npm install -g pnpm

# Python deps frequently required by Django/Postgres
RUN apt-get update && apt-get install -y \
    binutils \
    gdal-bin \
    libproj-dev \
    libgdal-dev \
    libpq-dev \
    python3-dev

# Install Git LFS for font file support
RUN apt-get update && apt-get install -y git-lfs \
    && git lfs install

# The container is going to be the VS Code workspace
WORKDIR /workspace

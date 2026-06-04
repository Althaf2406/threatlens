# Backend Setup Guide

This document explains how to set up the Python environment for the ThreatLens API on a local Windows machine.

## Prerequisites
- Python 3.11, 3.12, or 3.13 installed.

## Setup Instructions (Windows PowerShell)

Follow these steps exactly to ensure a stable environment without requiring manual C/Rust compilation.

```powershell
# 1. Navigate to the backend directory
cd apps/api

# 2. Create a virtual environment
python -m venv .venv

# 3. Activate the virtual environment
.\.venv\Scripts\Activate.ps1

# 4. VERY IMPORTANT: Upgrade pip, setuptools, and wheel first
# This ensures pip uses the latest pre-compiled binary wheels instead of compiling from source.
python -m pip install --upgrade pip setuptools wheel

# 5. Install requirements using pre-compiled binaries where possible
pip install --prefer-binary -r requirements.txt

# 6. Seed the local SQLite Database
python seed.py

# 7. Start the FastAPI server
uvicorn app.main:app --reload
```

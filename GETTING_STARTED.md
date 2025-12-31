# Hop Hop Bot - Complete Getting Started Guide

## For Complete Beginners

This guide will walk you through **every single step** to get your Hop Hop Instagram Bot working, from zero to live.

---

## 📋 Table of Contents
1. [What You Need Before Starting](#1-what-you-need-before-starting)
2. [Setting Up Your Computer](#2-setting-up-your-computer)
3. [Setting Up the Database (PostgreSQL)](#3-setting-up-the-database-postgresql)
4. [Getting Your OpenAI API Key](#4-getting-your-openai-api-key)
5. [Testing the Bot Locally](#5-testing-the-bot-locally)
6. [Pushing to GitHub](#6-pushing-to-github)
7. [Deploying to the Cloud (Render)](#7-deploying-to-the-cloud-render)
8. [Setting Up ManyChat](#8-setting-up-manychat)
9. [Connecting Everything Together](#9-connecting-everything-together)
10. [Final Testing](#10-final-testing)

---

## 1. What You Need Before Starting

### Accounts to Create (All Free to Start)
| Service | What it does | Link |
|---------|--------------|------|
| **GitHub** | Stores your code | https://github.com |
| **Render** | Hosts your bot online | https://render.com |
| **OpenAI** | Powers the AI responses | https://platform.openai.com |
| **ManyChat** | Connects to Instagram | https://manychat.com |
| **Supabase** (or Railway) | Free PostgreSQL database | https://supabase.com |

### Software to Install on Your Computer
1. **Node.js** (version 18 or higher) - https://nodejs.org
2. **Git** - https://git-scm.com
3. **Docker Desktop** (for local testing) - https://docker.com/products/docker-desktop
4. **VS Code** (code editor) - https://code.visualstudio.com

---

## 2. Setting Up Your Computer

### Step 2.1: Install Node.js
1. Go to https://nodejs.org
2. Download the **LTS version** (the big green button)
3. Run the installer and click Next until it finishes
4. Verify it worked: Open Command Prompt and type:
   ```
   node --version
   ```
   You should see something like `v18.19.0` or higher

### Step 2.2: Install Git
1. Go to https://git-scm.com/downloads
2. Download for Windows
3. Run installer (keep all defaults)
4. Verify: Open Command Prompt and type:
   ```
   git --version
   ```

### Step 2.3: Install Docker Desktop
1. Go to https://docker.com/products/docker-desktop
2. Download for Windows
3. Run installer (may require restart)
4. Open Docker Desktop and let it start

---

## 3. Setting Up the Database (PostgreSQL)

You have **two options**:

### Option A: Use Supabase (Recommended for Beginners - Free)

1. Go to https://supabase.com and sign up
2. Click **New Project**
3. Fill in:
   - Name: `hophop-bot`
   - Database Password: (create a strong password - SAVE THIS!)
   - Region: Choose closest to you
4. Click **Create Project** (wait 2 minutes)
5. Go to **Settings** → **Database**
6. Find **Connection string** → **URI**
7. Copy this string. It looks like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
   ```
8. **Important**: Replace `[YOUR-PASSWORD]` with the password you created

**Enable Vector Extension:**
1. In Supabase, go to **SQL Editor**
2. Run this command:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Click **Run**

### Option B: Use Local Docker (For Testing)

1. Make sure Docker Desktop is running
2. Open Command Prompt in your project folder
3. Run:
   ```
   docker-compose up -d
   ```
4. Your database is now running at:
   ```
   postgresql://hophop:hophop_password@localhost:5432/hophop_db
   ```

---

## 4. Getting Your OpenAI API Key

1. Go to https://platform.openai.com
2. Sign up or log in
3. Click your profile icon → **View API Keys**
4. Click **Create new secret key**
5. Name it: `hophop-bot`
6. **COPY THE KEY IMMEDIATELY** - you cannot see it again!
7. It looks like: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**Important**: You need to add credits to your OpenAI account:
1. Go to **Settings** → **Billing**
2. Add a payment method
3. Add at least $5 credits to start

---

## 5. Testing the Bot Locally (Detailed)

This step ensures your bot works on your computer BEFORE you upload it.

### Step 5.1: Set Up Your Environment File
1. In your project folder, find `.env.example`
2. Make a copy and rename it to `.env`
3. Open `.env` in a text editor like VS Code.
4. Fill in the values:

```env
PORT=3000
NODE_ENV=development

# Create ANY random string here. It acts like a password for ManyChat.
# Example: "purple-monkey-dishwasher-2025" or "secret123"
WEBHOOK_SECRET=my-random-secret-key-123

# Database (Use Option A or Option B string from above)
DATABASE_URL="postgresql://hophop:hophop_password@localhost:5432/hophop_db"

# Redis (If using Docker, leave as is)
REDIS_URL="redis://localhost:6379"

# Your OpenAI Key
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL=gpt-4o
```
**About WEBHOOK_SECRET**: This is NOT from ManyChat. You invent it. You will tell Render this secret later, but for now, just put any random string.

### Step 5.2: Install Dependencies
Open Command Prompt in your project folder and run:
```bash
npm install
```

### Step 5.3: Set Up the Database Schema
This creates the tables in your database.
```bash
npx prisma generate
npx prisma db push
```

### Step 5.4: Start the Backend
```bash
npm run dev
```
You should see: `Server running on port 3000`

### Step 5.5: Verify It's Working
1. **Health Check**:
   - Open browser: http://localhost:3000/health
   - Result: `{"status":"ok","env":"development"}`

2. **Simulate a User Message (Advanced)**:
   - Open a NEW terminal window (keep the server running).
   - Run this simulation script included in the repo:
   ```bash
   npx ts-node scripts/simulate_flow.ts
   ```
   - If it says "✅ Bot Reply: ...", your bot is 100% working! 

---

## 6. Pushing to GitHub

### Step 6.1: Create a GitHub Repository
1. Go to https://github.com
2. Click the **+** icon → **New repository**
3. Name: `hophop-bot`
4. Make it **Private** (your code has sensitive logic)
5. Don't add README (we already have one)
6. Click **Create repository**

### Step 6.2: Push Your Code
Run these commands in your project folder:
```bash
git init
git add .
git commit -m "Initial commit - Hop Hop Bot MVP"
# Replace YOUR-USERNAME below
git remote add origin https://github.com/YOUR-USERNAME/hophop-bot.git
git branch -M main
git push -u origin main
```

---

## 7. Deploying to the Cloud (Render)

### Step 7.1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (easiest)

### Step 7.2: Create a Redis Instance
1. Click **New** → **Redis**
2. Name: `hophop-redis`
3. Plan: **Free**
4. Click **Create Redis**
5. Copy the **Internal URL** (looks like `redis://red-xxxxx:6379`)

### Step 7.3: Deploy the Backend
1. Click **New** → **Web Service**
2. Connect your GitHub repo `hophop-bot`
3. Configure:
   - Name: `hophop-bot`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: **Free**
4. Add **Environment Variables** (click "Add Environment Variable"):
   - `NODE_ENV` = `production`
   - `DATABASE_URL` = (your Supabase connection string)
   - `REDIS_URL` = (the Redis URL you copied)
   - `OPENAI_API_KEY` = (your OpenAI key)
   - `MODEL` = `gpt-4o`
   - `WEBHOOK_SECRET` = (Same random string you put in .env)
5. Click **Create Web Service**
6. Wait 5-10 minutes for deployment

### Step 7.4: Verify Deployment
1. Render gives you a URL like `https://hophop-bot.onrender.com`
2. Visit `https://hophop-bot.onrender.com/health`
3. You should see: `{"status":"ok","env":"production"}`

---

## 8. Setting Up ManyChat

### Step 8.1: Create ManyChat Account
1. Go to https://manychat.com
2. Sign up and connect your **Instagram Business Account**

### Step 8.2: Create a New Flow
1. Go to **Automation** → **Flows**
2. Click **+ New Flow**
3. Select "Start from Scratch"
4. Name it: `Hop Hop Super-Resolution Bot`

### Step 8.3: Add a Trigger
1. Click **Add Trigger**
2. Choose **Instagram** → **User comments on your Post or Reel**
3. Select specific posts or "Any Post" (up to you)

### Step 8.4: Add External Request Action
1. Click the **+** (Add content)
2. Choose **Action** → **External Request**
3. Configure:
   - **Request Type**: POST
   - **Request URL**: `https://hophop-bot.onrender.com/api/webhook/manychat`
   - **Headers**:
     - Key: `Content-Type`, Value: `application/json`
     - Key: `x-hub-signature`, Value: `(your WEBHOOK_SECRET)` (Optional security)
   - **Body**:
   ```json
   {
     "subscriber_id": "{{user_id}}",
     "contact_info": {
       "first_name": "{{first_name}}",
       "ig_handle": "{{username}}"
     },
     "message": "{{last_input_text}}",
     "trigger": "comment"
   }
   ```
   **Note**: `last_input_text` is a custom field you might need to create in ManyChat to capture user input.

### Step 8.5: Handle the Response
1. Following the "External Request" block (Green Dot = Success):
2. Add a **Instagram Message** block.
3. In the text area, insert the variable: `{{external_request.reply}}`
   - **Tip**: You map the response JSON `reply` field to a custom user field or use it directly via "Test Request" mapping.

---

## 9. Connecting Everything Together

### The Full Flow:
1. User comments on your Instagram post.
2. ManyChat detects it -> Sends DM -> Waits for reply.
3. User replies with "I want to save money".
4. ManyChat sends this text to your Bot (via External Request).
5. Bot (OpenAI) generates the roast + resolution.
6. Bot replies to ManyChat.
7. ManyChat shows the reply to the user.

---

## 10. Final Testing

### Test Checklist:
- [ ] Health check works: `https://your-app.onrender.com/health`
- [ ] Comment on IG post → Receive DM
- [ ] DM contains AI-generated Super-Resolution
- [ ] Response ends with "Record it. Post it. Tag 3 people."
- [ ] Test unsafe input (like "I want to hurt") → Bot refuses safely

### Sample Test Messages:
Send these via Instagram DM to test:
1. "I want to get fit" → Should get a fitness-related Super-Resolution
2. "I want to save money" → Should get a money-related Super-Resolution
3. "Tell me something dangerous" → Should get a safe refusal

---

## ❓ Troubleshooting

### "Bot not responding"
1. Check Render logs for errors
2. Verify environment variables are set correctly
3. Make sure OpenAI has credits

### "Database connection failed"
1. Check DATABASE_URL is correct
2. Make sure Supabase/Railway is running
3. Verify the vector extension is enabled

### "ManyChat not sending to bot"
1. Check the webhook URL is correct
2. Test the webhook manually with Postman


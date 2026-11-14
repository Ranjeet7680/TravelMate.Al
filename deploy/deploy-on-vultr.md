# Deploy TravelMate AI on Vultr
### **Team Innovation 27X7 — AI Agents & Intelligent Systems**

This guide puts your **TravelMate AI** platform live on the internet using a **Vultr Cloud Compute** server and Docker. It takes about 10–15 minutes and covers the full stack (React 19 Frontend, FastAPI 13-Agent Backend, and datasets).

**Before you start:** Claim your $200 Vultr credits in the Vultr Console. A standard Cloud Compute plan (1 GB or 2 GB RAM) is sufficient for judging.

---

## 1. Create a Server on Vultr

1. Log in to the [Vultr Console](https://my.vultr.com) and click **Deploy** (or **Deploy +**) ➔ **Deploy New Server**.
2. Choose **Cloud Compute** (Shared CPU).
3. Pick a location close to your region (e.g., Mumbai, Singapore, Frankfurt, or New York).
4. For the Operating System, choose **Ubuntu 24.04 LTS x64**.
5. Pick the plan with at least **1 GB or 2 GB RAM**.
6. Set the server hostname to `travelmate-ai` and click **Deploy Now**.
7. Wait 1–2 minutes until the status shows **Running**. On the server's **Overview** page, copy your:
   - **IP Address** (`YOUR_SERVER_IP`)
   - **Username** (`root`)
   - **Password**

---

## 2. Connect to the Server

Open PowerShell (Windows) or Terminal (Mac/Linux):

```bash
ssh root@YOUR_SERVER_IP
```

Type `yes` when asked, then paste your root password (characters won't appear on screen as you type).

---

## 3. Install Docker and Git

Run this one-line command to install Docker and Git:

```bash
curl -fsSL https://get.docker.com | sh && apt-get install -y git
```

Verify Docker is running:
```bash
docker --version
```

---

## 4. Clone Your TravelMate AI Repository

Clone the official repository onto your Vultr server:

```bash
git clone https://github.com/Ranjeet7680/TravelMate.Al.git
cd TravelMate.Al
```

*(Optional)* If you wish to configure an external OpenAI or Vultr Serverless Inference API key:
```bash
cat << 'EOF' > .env
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=your_key_here
LLM_MODEL=gpt-4o-mini
EOF
```

---

## 5. Build and Run TravelMate AI

Build and launch the complete production multi-stage container:

```bash
docker build -t travelmate .
docker run -d --name travelmate --restart unless-stopped -p 80:8000 travelmate
```

*Or using Docker Compose:*
```bash
docker compose up -d --build
```

---

## 6. Open the Firewall (Port 80)

Allow HTTP web traffic to reach your application:

```bash
ufw allow 80/tcp
```
*(If it outputs `ufw: command not found` or `Firewall not enabled`, you can safely skip this step).*

---

## 7. Verify Your Live Deployment! 🎉

Open your browser and navigate to:

👉 **`http://YOUR_SERVER_IP`**

You should see:
- 🖥️ **Full 18-Screen TravelMate AI Web Application**
- 📱 **Interactive iPhone 16 Pro Simulator**
- ⚡ **FastAPI Multi-Agent API**: `http://YOUR_SERVER_IP/api`
- 📖 **Interactive Swagger Documentation**: `http://YOUR_SERVER_IP/docs`

> 💡 **This `http://YOUR_SERVER_IP` address is your Live Demo URL for the HackGlobal 2026 project submission form!**

---

## 🔄 Updating Your Live App After Pushing to GitHub

Whenever you push updates to GitHub, update your Vultr server with these quick commands:

```bash
cd ~/TravelMate.Al
git pull origin main
docker rm -f travelmate
docker build -t travelmate .
docker run -d --name travelmate --restart unless-stopped -p 80:8000 travelmate
```

---

## ❓ Troubleshooting

| Issue | Resolution |
|:---|:---|
| **Page doesn't load** | Run `docker ps`. If the container isn't running, check logs with `docker logs travelmate`. |
| **Port 80 already in use** | Run `docker rm -f travelmate`, or check if another service is on port 80 with `lsof -i :80` or `netstat -tlpn`. |
| **Need to restart** | Run `docker restart travelmate`. |
| **Container status check** | Run `curl -I http://localhost:8000/api/health`. |

---

## 🎁 Optional: Vultr Serverless Inference Integration

To leverage Vultr's Serverless Inference LLM API with your hackathon credits, set these variables in `.env`:

```bash
LLM_BASE_URL=https://api.vultrinference.com/v1
LLM_API_KEY=your-vultr-inference-api-key
LLM_MODEL=llama2-13b-chat
```
Consult the [Vultr Cloud Inference Documentation](https://docs.vultr.com/how-to-use-vultr-cloud-inference-in-python) for model lists and availability.

---

<div align="center">
  <sub>TravelMate AI • Team Innovation 27X7 • HackGlobal 2026</sub>
</div>

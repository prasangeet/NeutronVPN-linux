# NeutronVPN

**NeutronVPN** is a secure, high-performance VPN solution that allows users to connect to private servers worldwide. It provides encrypted tunnels using WireGuard, dynamically manages clients, and displays real-time connection stats, IP addresses, and speed for seamless, protected internet access.

---

## Features

- WireGuard-based VPN for fast and secure connections.
- Dynamic client management with automatic IP assignment.
- Real-time display of interface and public IP addresses.
- Connection speed monitoring.
- Cross-platform Electron + React client.
- Server management via SSH for adding/removing peers.

---

## Tech Stack

- **Backend:** Django + Django REST Framework
- **Frontend:** React + Electron
- **Database:** PostgreSQL
- **VPN Protocol:** WireGuard
- **Server Management:** SSH + Paramiko (Python)

---

## Folder Structure

```

neutronvpn/
├─ server/             # Server-side scripts
│  ├─ start.sh         # Start WireGuard server
│  ├─ stop.sh          # Stop WireGuard server
├─ keys/               # WireGuard server & client keys
├─ frontend/           # Electron + React frontend
├─ backend/            # Django backend
└─ README.md

````

---

## Installation

### Backend

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd neutronvpn/backend
    ```

2. Install dependencies:

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```
3. Configure `.env` with your database and SSH credentials.
4. Run migrations:

   ```bash
   python manage.py migrate
   ```
5. Start the server:

   ```bash
   python manage.py runserver
   ```

### Frontend (Electron + React)

1. Navigate to frontend folder:

   ```bash
   cd ../frontend
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start development:

   ```bash
   npm run dev
   ```

---

## Server Setup

1. Copy `server` folder to your VPS.
2. Generate server keys in `keys/` folder:

   ```bash
   wg genkey | tee keys/server_private.key | wg pubkey > keys/server_public.key
   ```
3. Start WireGuard server:

   ```bash
   ./server/start.sh
   ```
4. Stop WireGuard server:

   ```bash
   ./server/stop.sh
   ```

---

## Usage

* Users can connect to available VPN servers via the Electron client.

* The client shows:

  * **Interface IP** (VPN)
  * **Public IP**
  * **Connection speed**
  * **Security status**

* Admins can add/remove clients remotely via the Django backend API.

---

## Environment Variables

```env
DB_NAME=neutronvpn
DB_USER=postgres
DB_PASSWORD=ppd12345
DB_HOST=localhost
DB_PORT=5432

SSH_USER=root
SSH_PORT=22
SERVER_INTERFACE_NAME=wg0

SSH_KEY="-----BEGIN OPENSSH PRIVATE KEY----- ... -----END OPENSSH PRIVATE KEY-----"
SSH_KEY_PASSPHRASE=<hidden>
```

---

## License

MIT License

```

I can also generate a **shorter “Quick Start” README** optimized for GitHub if you want.  

Do you want me to do that next?
```

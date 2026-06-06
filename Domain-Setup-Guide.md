# Domain Setup Guide
## Connecting a Domain to VPS (IIS + Next.js + .NET Web API)

---

## Our Setup
| Item | Value |
|------|-------|
| Domain | `idsidentity.com` |
| VPS IP | `5.231.93.226` |
| Frontend | Next.js → `SchoolFrontend` in IIS |
| Backend | .NET Web API → `SchoolAPI` in IIS |
| Server | Windows VPS with IIS |

---

## STEP 1 — Configure DNS in Hostinger

1. Go to **hpanel.hostinger.com**
2. Click **Domains** → click your domain name
3. Click **DNS / Nameservers** from left menu
4. Scroll down to **Manage DNS Records**
5. **Delete** any old A records pointing to old IP
6. **Add** these new records:

| Type | Name | Points To | TTL |
|------|------|-----------|-----|
| A | `@` | `YOUR_VPS_IP` | 3600 |
| A | `api` | `YOUR_VPS_IP` | 3600 |

> `@` means the root domain (yourdomain.com)
> `api` creates subdomain api.yourdomain.com automatically — no extra cost!
> Leave CNAME www record as is.

---

## STEP 2 — Configure IIS Bindings on VPS

1. Open **IIS Manager** on VPS
2. In left panel expand **Sites**

### For SchoolFrontend:
- Right click **SchoolFrontend** → **Edit Bindings**
- Click **Edit** on existing binding
- Set:
  - Type: `http`
  - Port: `80`
  - Host name: `yourdomain.com`
- Click **OK**

### For SchoolAPI:
- Right click **SchoolAPI** → **Edit Bindings**
- Click **Edit** on existing binding
- Set:
  - Type: `http`
  - Port: `80`
  - Host name: `api.yourdomain.com`
- Click **OK**

---

## STEP 3 — Check Windows Firewall

Open CMD as Administrator on VPS and run:
```
netsh advfirewall firewall show rule name=all | findstr "80"
```

You should see port 80 listed. If not, add a rule:
```
netsh advfirewall firewall add rule name="HTTP Port 80" dir=in action=allow protocol=TCP localport=80
```

---

## STEP 4 — Update Next.js Environment Variable

Find your `.env` file in your Next.js source code and update:

```env
# Old (wrong)
NEXT_PUBLIC_API_BASE_URL=http://YOUR_VPS_IP:PORT/api

# New (correct)
NEXT_PUBLIC_API_BASE_URL=http://api.yourdomain.com/api
```

> ⚠️ IMPORTANT: Next.js bakes the API URL at BUILD TIME.
> You MUST rebuild after changing .env!

---

## STEP 5 — Rebuild Next.js and Deploy

On your development machine:
```bash
# Build new version
npm run build
```

Then copy the new build files to VPS and replace old files in:
```
C:\inetpub\wwwroot\SchoolFrontend\
```
or wherever your IIS site physical path points to.

---

## STEP 6 — Restart IIS

On VPS open CMD as Administrator:
```
iisreset
```

Wait 10-15 seconds.

---

## STEP 7 — Test

Open browser and test:
```
http://yourdomain.com/login        ← Frontend
http://api.yourdomain.com/api      ← API
```

---

## Final Result
```
Internet
    ↓
yourdomain.com (DNS → VPS IP)
    ↓
IIS on VPS (Port 80)
    ↙                ↘
SchoolFrontend      SchoolAPI
idsidentity.com     api.idsidentity.com
(Next.js)           (.NET Web API)
```

---

## BONUS — Next Step: Add SSL (HTTPS)

Currently site runs on HTTP (Not Secure warning in browser).
To add free SSL:

1. Download **Win-ACME** on VPS: https://www.win-acme.com
2. Run it and follow prompts
3. It auto-installs free Let's Encrypt SSL certificate
4. Your site will become `https://idsidentity.com` ✅

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Site can't be reached | DNS not propagated yet, wait 30 mins |
| IIS default page shows | Check IIS binding host name is correct |
| 404 on API | Check SchoolAPI binding is port 80 |
| "Failed to fetch" on login | Rebuild Next.js with new API URL in .env |
| 500 error | Check Application Pool is running in IIS |

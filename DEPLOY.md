# Deploying yannicksblog to netcup (Webhosting 4000, Plesk + Node.js)

The blog is an Astro app running as a small Node.js server. Posts, page texts and drawings live in the MySQL database; uploaded image files live in an `uploads/` folder on the server. The admin is at `/admin`.

## Before you start

1. **New database password.** The old one was visible in a screenshot. In Plesk: *Databases → your database → User Management*, generate a new password and keep it only for step 4 below.
2. **Database access.** Do not leave it on *"Remoteverbindungen von beliebigem Host zulassen"*. Try *"Nur lokale Verbindungen zulassen"* first. On netcup the database runs on its own internal server (the `10.35.46.86:3306` address Plesk shows), so if the blog then cannot connect, switch to *"Remoteverbindungen zulassen von"* and enter only your web server's address. Never allow any host.
3. **Node.js version.** In Plesk open *Websites & Domains → your domain → Node.js*. Astro 7 needs **Node 22.23.4 or newer**. Pick the newest version offered; if nothing that new is offered, stop here and tell me.

## 1. Put the code on the server

Choose one:

- **Plesk Git** (recommended): push this project to a private GitHub repository, then in Plesk use *Git → Add Repository* and deploy into a folder such as `/httpdocs/blog` (or the folder of the subdomain you use for the blog).
- **SFTP/SSH**: upload the project folder **without** `node_modules/`, `dist/`, `uploads/` and `.env`.

## 2. Configure the Node.js app in Plesk

In *Node.js* for the domain:

| Setting | Value |
|---|---|
| Node.js version | 22.23.4 or newer |
| Application mode | production |
| Application root | the project folder, e.g. `/httpdocs/blog` |
| Application startup file | `server.cjs` |
| Document root | `<application root>/dist/client` |

## 3. Create the admin password hash (on your own computer)

```bash
npm run admin:password
```

Type the password you want for `/admin` (at least 12 characters). It prints one line starting with `ADMIN_PASSWORD_HASH=`. Only that hash goes to the server; the password itself is stored nowhere.

## 4. Settings (`.env` on the server)

Create a file named `.env` in the application root (next to `server.cjs`) with these lines. Plesk's *Custom environment variables* also work and override the file.

```
SITE_URL=https://your-blog-domain.de
DB_HOST=10.35.46.86
DB_PORT=3306
DB_NAME=k81358_ys
DB_USER=k81358_ys
DB_PASSWORD=<the NEW database password>
ADMIN_USER=<the user name you want for /admin>
ADMIN_PASSWORD_HASH=<the line from step 3, without "ADMIN_PASSWORD_HASH=">
UPLOAD_DIR=./uploads
```

Use the database host, name and user exactly as Plesk shows them. `.env` sits outside the document root (`dist/client`), so the web server never serves it.

## 5. Install, build, create tables

In the Node.js page use *NPM install*, then *Run script* for each of these, in order:

1. `build`
2. `db:migrate` (creates the tables; safe to run again after every update)
3. `db:seed` (optional, once: imports the six placeholder posts as **drafts** and a placeholder About text; nothing goes online)

Then click **Restart App**.

## 6. Check

- `https://your-blog-domain.de/` shows the empty index ("Noch keine Beiträge …").
- `https://your-blog-domain.de/admin` asks you to log in.
- Write a post, upload a drawing, publish it, open it on the site.
- In *SSL/TLS Certificates*, make sure Let's Encrypt is active and HTTP redirects to HTTPS. The admin login cookie only works over HTTPS.

## Updating later

Pull or upload the new code, then *NPM install* → *Run script* `build` → `db:migrate` → *Restart App*. The `uploads/` folder and the database are untouched by updates; back them up together (Plesk *Backup Manager* covers both).

## Local development

```bash
cp .env.example .env    # then fill in a local database and an admin hash
npm install
npm run db:migrate
npm run db:seed
npm run dev             # http://localhost:4321
```

A local MySQL can run in Docker, e.g. `docker run -d --name yannicksblog-mysql -p 127.0.0.1:3307:3306 -e MYSQL_ROOT_PASSWORD=… -e MYSQL_DATABASE=yannicksblog -e MYSQL_USER=yannicksblog -e MYSQL_PASSWORD=… mysql:8.4` (set `DB_PORT=3307`).

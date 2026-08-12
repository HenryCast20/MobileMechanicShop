# MobileMechanicShop

A full-stack, secure automotive repair management web application designed to streamline appointment tracking, vehicle history logs, and customer management.

## 🚀 Key Features & Security Architecture

* **Secure Authentication & Authorization:** Implemented credential-based login using **bcrypt** for salted password hashing alongside **Google OAuth 2.0** integration.
* **HTTP-Only Cookie Sessions:** Replaced vulnerable `localStorage` token storage with server-signed JSON Web Tokens (JWT) transmitted via secure, `httpOnly`, `sameSite: 'strict'` cookies to prevent XSS and token hijacking.
* **Protected Middleware:** Custom Express middleware verifying cookie-based sessions to guard protected API endpoints.
* **Relational Database Integrity:** Built with **MySQL** (`mysql2`), utilizing parameterized queries to prevent SQL injection and strict multi-step database transactions (`beginTransaction`, `commit`, `rollback`) during account registration.
* **Dynamic Search & UI:** Real-time client-side search filtering and responsive dashboard components built with **React** and **Node.js/Express**.
* **Production Deployment:** Configured with **PM2** for process management and automated deployment workflows.

## 🛠️ Tech Stack

* **Frontend:** React, HTML5, CSS3
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT, Google Auth Library, bcryptjs


## 📚 Things I Learned

This was my first application deployed to a live server rather than
running only on localhost, and most of what I learned came from
breaking things in production and fixing them.

**Deploying by pushing to production.** I chose to push every change
straight through the pipeline instead of testing locally first. That
forced me to learn the deployment surface quickly — but it also taught
me why staging environments exist. On a team, I'd want CI tests
gating the deploy step and a rollback path before anything ships.

**Linux server administration.** Configuring Nginx as a reverse proxy
in front of the Node process taught me how port 80 maps to the app
running on 3000. I learned to manage the process with PM2 and to read
production logs to diagnose failures I couldn't reproduce locally. When
the droplet ran out of RAM during builds, I added swap space to keep
it from dying mid-deploy.

**Managing secrets.** Environment variables live on the server and
never in the repository. The committed `.env` file is a reference
listing required keys with no real values, so a new environment can be
configured without exposing credentials.

**Rethinking token storage.** My first authentication implementation
stored JWTs in `localStorage`, which is readable by any script running
on the page and therefore vulnerable to XSS. I refactored to
server-signed tokens in `httpOnly`, `sameSite: 'strict'` cookies so the
browser handles them and client-side JavaScript cannot read them.

**Database integrity.** Registration touches multiple tables, so a
partial failure would leave orphaned records. Wrapping it in a
transaction with `rollback` means a failed signup leaves no trace.
Parameterized queries handle user input safely rather than trusting
string concatenation.

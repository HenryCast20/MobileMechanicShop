# MobileMechanicShop

A full-stack, secure automotive repair management web application built for an
active mobile auto repair business. Customers register vehicles, view service
history, and access itemized invoices; the shop manages repairs and records
from a single dashboard.

## 🚀 Key Features & Security Architecture

* **Secure Authentication & Authorization:** Credential-based login using **bcrypt** for salted password hashing alongside **Google OAuth 2.0**, with account linking when a Google email matches an existing record.
* **HTTP-Only Cookie Sessions:** Server-signed JSON Web Tokens transmitted via `httpOnly`, `sameSite: 'strict'` cookies rather than `localStorage`, preventing client-side scripts from reading the token.
* **Authorization Separate From Authentication:** Middleware verifies *who* the requester is; every query independently scopes results to the session's customer ID, so a valid token cannot reach another customer's records. Requests for records belonging to other users return 404 rather than 403, avoiding disclosure of which IDs exist.
* **Relational Database Integrity:** **MySQL** (`mysql2`) with parameterized queries throughout, foreign key constraints with explicit cascade behavior, and multi-step transactions (`beginTransaction`, `commit`, `rollback`) on registration.
* **Normalized Invoicing:** Repairs carry line items in a separate table with a one-to-many relationship, supporting itemized parts, labor, and fees. Unit price and unit cost are stored per line item as historical snapshots, so past invoices and margin calculations remain accurate when current pricing changes.
* **Printable Invoices:** Browser-rendered invoice sheets with a dedicated print stylesheet, producing clean PDFs without a server-side rendering dependency.
* **Third-Party Integration:** Cached server-side weather forecast (Open-Meteo) surfacing conditions that affect on-site service availability. Responses are cached for one hour so external downtime degrades gracefully rather than breaking the page.
* **Production Deployment:** Nginx reverse proxy, PM2 process management, and automated deployment from GitHub Actions to a DigitalOcean droplet.

## 🛠️ Tech Stack

* **Frontend:** React (Vite), CSS3
* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Authentication:** JWT, Google Auth Library, bcryptjs
* **Infrastructure:** Nginx, PM2, DigitalOcean, GitHub Actions

## 📚 Things I Learned

This was my first application deployed to a live server rather than running
only on localhost, and most of what I learned came from breaking things in
production and fixing them.

**Deploying by pushing to production.** I chose to push every change straight
through the pipeline instead of testing locally first. That forced me to learn
the deployment surface quickly — but it also taught me why staging environments
exist. On a team, I'd want CI tests gating the deploy step and a rollback path
before anything ships.

**Linux server administration.** Configuring Nginx as a reverse proxy in front
of the Node process taught me how port 80 maps to the app running on 3000. I
learned to manage the process with PM2 and to read production logs to diagnose
failures I couldn't reproduce locally. When the droplet ran out of RAM during
builds, I added swap space to keep it from dying mid-deploy.

**Managing secrets.** Environment variables live on the server and never in the
repository. The committed `.env` file is a reference listing required keys with
no real values, so a new environment can be configured without exposing
credentials.

**Rethinking token storage.** My first authentication implementation stored JWTs
in `localStorage`, which is readable by any script running on the page and
therefore vulnerable to XSS. I refactored to server-signed tokens in `httpOnly`,
`sameSite: 'strict'` cookies so the browser handles them and client-side
JavaScript cannot read them.

**Logging out is a server-side operation.** The consequence of `httpOnly` I
missed initially: if JavaScript cannot read the cookie, it also cannot delete
it. My original logout cleared client state and redirected to the login screen
while the session stayed valid on the server — a working-looking logout that
logged nobody out. It required a backend route calling `clearCookie` with
options matching exactly what login had set.

**Authentication is not authorization.** A valid token proves identity and
nothing more. Looking up a record by an ID taken from the request URL, without
also scoping the query to the authenticated user, allows any logged-in customer
to read any other customer's data by changing a number. Every lookup is scoped
in the `WHERE` clause rather than checked afterward, so the wrong data is
unreachable rather than filtered out.

**Schema changes against live data.** Adding invoice line items meant altering a
database that already held records. Additive migrations — new nullable columns
and new tables — apply without disturbing existing rows, and keeping migrations
as versioned files separate from the schema definition means the change history
travels with the code.

**Modeling one-to-many relationships.** A repair can have any number of line
items, which a column cannot hold. The answer is a child table whose rows each
reference the parent — the same shape as customers to vehicles and vehicles to
repairs, applied one level deeper.

**Financial records freeze at the transaction.** Storing an invoice total as a
derived value means correcting a line item silently changes a two-year-old
invoice. Totals and per-item costs are captured at time of service and never
recalculated, so historical records and margin figures stay accurate as prices
move.

**A failed build cannot break production.** When a syntax error stopped Vite
from compiling, the previous bundle stayed in place and the site kept serving
it. Nothing crashed — but nothing updated either, and I spent time debugging
frontend code the browser was never running. The dangerous failure mode isn't a
crash, it's shipping nothing without noticing.

**Duplication compounds.** Three pages each carried their own copy of the header,
profile dropdown, and logout handler. Each new header feature meant three
identical edits and three chances to introduce drift. Extracting it into a
shared component made the next feature a single change.

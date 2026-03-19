# CC Community WebApp

A component-based Google Apps Script WebApp for a community platform. Built with the GAS HTML Templating engine and a clean client/server split architecture — no frontend framework required.

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Platform](https://img.shields.io/badge/Platform-WebApp-blue)

---

## Overview

This WebApp uses GAS native scriplets to render modular UI components server-side, with a clear separation between client (HTML/CSS/JS partials) and server (GAS data access and routing) layers. Data is stored in Google Sheets.

---

## Features

- Component-based UI via GAS HTML scriplets — no frontend framework
- Client/server split: `client/` for UI, `server/` for GAS backend
- Google Sheets as the data store
- Server-side rendered pages served as a Web App

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Platform | Google Apps Script              |
| UI       | HTML5, CSS3, Vanilla JavaScript |
| Pattern  | GAS scriplet component system   |
| Database | Google Sheets                   |
| Deploy   | clasp CLI                       |

---

## Project Structure

```
cc-community-webapp/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  # GAS manifest
    ├── client/          # HTML components, CSS, client-side JS
    └── server/          # doGet(), Sheets data access, routing
```

---

## Getting Started

### Prerequisites

- A Google account with Google Apps Script access
- [clasp](https://github.com/google/clasp) installed globally

```bash
npm install -g @google/clasp
clasp login
```

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mohamedallam13/cc-community-webapp.git
   cd cc-community-webapp
   ```

2. Link to your Apps Script project:
   ```bash
   clasp create --type webapp --title "CC Community WebApp" --rootDir src
   ```

3. Push source files:
   ```bash
   clasp push
   ```

---

## Deployment

1. In the Apps Script editor, go to **Deploy > New deployment**
2. Select type: **Web app**
3. Set access permissions as required
4. Click **Deploy** and copy the Web App URL

---

## Author

**Mohamed Allam** — [GitHub](https://github.com/mohamedallam13) · [Email](mailto:mohamedallam.tu@gmail.com)

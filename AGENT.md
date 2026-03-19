# AGENT.md — cc-community-webapp

## Purpose
A component-based Google Apps Script WebApp built with GAS HTML Templating (scriplets). Serves as a community platform with a client/server split architecture.

## Structure
```
cc-community-webapp/
├── README.md
├── AGENT.md
├── .gitignore
└── src/
    ├── appsscript.json  ← GAS manifest
    ├── client/          ← HTML/CSS/JS frontend partials
    └── server/          ← GAS server-side scripts (doGet, data access)
```

## Key Facts
- **Platform:** Google Apps Script WebApp
- **Pattern:** Component-based via GAS scriplet templating
- **Architecture:** client/ (UI) + server/ (GAS backend)
- **Entry point:** `server/` contains the `doGet()` function

## Development Notes
- All source files live under `src/` — push with clasp from that directory
- No Node/npm at runtime; ES5-compatible GAS code only

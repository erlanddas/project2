# Diegimo gidas

1. Įsidiek Node.js (v16+)
2. Nukopijuok projektą
3. `npm install`
4. Sukurk `.env` pagal `.env.example`
5. `node server.js`
6. Testuok su `curl`:

```bash
curl -X POST http://localhost:3000/speak -H "Content-Type: application/json" -d '{"text":"Labas!"}' --output resp.mp3
```

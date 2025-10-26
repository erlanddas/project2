# AI Asistentas (lietuvių kalba) — Projektas

Šis projektas parodo, kaip sukurti paprastą **AI asistento** backend'ą, kuris:

- gauna tekstinę užklausą,
- sugeneruoja lietuvišką atsakymą per OpenAI,
- konvertuoja tą atsakymą į garsą per ElevenLabs (numatyta),
- grąžina garso failą klientui arba leidžia Twilio jį groti skambučio metu.

## Turinys
- `server.js` — pagrindinis Express serveris (OpenAI -> ElevenLabs)
- `server_twilio.js` — Twilio voice webhook pavyzdys (atskiras modulio failas)
- `package.json` — priklausomybės
- `.env.example` — konfigūracija
- `docs/` — papildomi dokumentai (architektūra, diegimas, TTS palyginimas, GDPR)

Skaityk `docs/setup_guide.md` jei nori greitai paleisti projektą.

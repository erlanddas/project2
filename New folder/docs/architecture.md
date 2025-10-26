# Architektūra

Supaprastinta architektūra:

User -> Frontend (web/phone) -> Backend (Express)
  - Backend kviečia LLM (OpenAI) -> tekstas
  - Backend kviečia TTS (ElevenLabs) -> audio
  - Gali grąžinti audio klientui arba pateikti Twilio per viešą URL

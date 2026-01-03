# Data Model (Planned)

## Tables
- profiles (preferred_language)
- listings (category + optional car fields)
- conversations (translate_enabled)
- messages (body_original + optional lang)
- message_translations (per-user translation storage)

## Notes
Use relational design (Postgres). Avoid duplicating message rows for translations.

# Translation Spec

## UX
- Translation is OFF by default
- Toggle lives inside chat header (??)
- When ON: show translated text by default
- Provide “View original” per message

## Data
- messages: store original content
- message_translations: store translated content per user/language

## Processing (later)
- Edge Function: translate-on-message-insert when conversation.translate_enabled = true

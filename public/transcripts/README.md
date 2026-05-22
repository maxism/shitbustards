# Транскрипты эпизодов

Положите сюда файлы `{slug}.md` — plain text или markdown.

**Slug** совпадает с URL эпизода, например:

- `s1ep12.md` → `/episodes/s1ep12`
- `42.md` → `/episodes/42`

После добавления файла эпизод получит:

- блок «Транскрипт» на странице
- поле `hasTranscript: true` в `/api/episodes`
- ссылку в JSON-LD (`transcript`)
- раздел в `/episodes/{slug}/md`

Файлы доступны статически по `/transcripts/{slug}.md`.

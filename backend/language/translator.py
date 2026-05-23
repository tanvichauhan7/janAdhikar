LANGUAGE_LABELS = {
    "en": "English",
    "hi": "Hindi",
}


def normalize_language(language):
    value = str(language or "en").strip().lower()
    return "hi" if value.startswith("hi") else "en"

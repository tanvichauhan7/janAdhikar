export default function LanguageToggle({ language, onChange }) {
  return (
    <div className="language-toggle" aria-label="Language toggle">
      <button
        type="button"
        className={language === 'en' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => onChange('en')}
      >
        English
      </button>
      <button
        type="button"
        className={language === 'hi' ? 'lang-btn active' : 'lang-btn'}
        onClick={() => onChange('hi')}
      >
        Hindi
      </button>
    </div>
  );
}

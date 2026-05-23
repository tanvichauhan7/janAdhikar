const SCHEME_DETAILS = {
  'PM Kisan Samman Nidhi': {
    emoji: '🌾',
    benefit: 'Rs 6,000 per year in direct income support.',
    documents: 'Aadhaar, bank passbook, and land record details.',
  },
  'PM Awas Yojana (Gramin)': {
    emoji: '🏠',
    benefit: 'Housing support for rural families needing a safer home.',
    documents: 'Aadhaar, address proof, and local housing verification.',
  },
  'Ayushman Bharat PM-JAY': {
    emoji: '🏥',
    benefit: 'Health coverage up to Rs 5 lakh per family.',
    documents: 'Aadhaar, ration card, or eligible family identification.',
  },
  'Sukanya Samriddhi Yojana': {
    emoji: '👧',
    benefit: 'Long-term savings support for a girl child.',
    documents: 'Birth certificate, guardian ID, and bank or post office KYC.',
  },
  MGNREGA: {
    emoji: '🛠️',
    benefit: 'Up to 100 days of wage employment in rural areas.',
    documents: 'Job card, Aadhaar, and local residence details.',
  },
  'Pradhan Mantri Ujjwala Yojana': {
    emoji: '🔥',
    benefit: 'Support for an LPG connection for eligible households.',
    documents: 'Aadhaar, ration card, and bank details.',
  },
  'Beti Bachao Beti Padhao': {
    emoji: '📚',
    benefit: 'Support focused on girls’ welfare and education awareness.',
    documents: 'Child ID records and local beneficiary documentation if requested.',
  },
  'PM MUDRA Yojana': {
    emoji: '💼',
    benefit: 'Small business loan support under multiple loan categories.',
    documents: 'ID proof, business details, and a simple business plan.',
  },
  'National Scholarship Portal (NSP)': {
    emoji: '🎓',
    benefit: 'Scholarship support for eligible students.',
    documents: 'Student ID, academic records, and income proof.',
  },
  'Atal Pension Yojana': {
    emoji: '🧓',
    benefit: 'Future pension support through regular contributions.',
    documents: 'Savings account, Aadhaar, and mobile number.',
  },
  'PM Jan Dhan Yojana': {
    emoji: '🏦',
    benefit: 'Zero-balance bank account with financial inclusion benefits.',
    documents: 'Aadhaar or another valid ID and address proof.',
  },
  'Indira Gandhi National Old Age Pension': {
    emoji: '🤝',
    benefit: 'Monthly pension support for eligible senior citizens.',
    documents: 'Age proof, ID, and local income or pension records.',
  },
};

const SECTION_LABELS = {
  en: {
    matched: 'Likely eligible',
    recommended: 'Recommended for you',
    why: 'Why you qualify',
    benefit: 'Benefit',
    documents: 'Required documents',
    apply: 'Apply online / offline',
  },
  hi: {
    matched: 'मिलने की अच्छी संभावना',
    recommended: 'आपके लिए सुझाया गया',
    why: 'क्यों match हुआ',
    benefit: 'लाभ',
    documents: 'ज़रूरी कागज़',
    apply: 'ऑनलाइन / ऑफलाइन आवेदन',
  },
};

export default function SchemeCard({ scheme, language = 'en', variant = 'secondary' }) {
  const details = SCHEME_DETAILS[scheme.name] || {
    emoji: '📌',
    benefit: scheme.description,
    documents: language === 'hi' ? 'सही कागज़ों की सूची स्थानीय कार्यालय से पूछ लें।' : 'Ask the local office for the exact document list.',
  };
  const labels = SECTION_LABELS[language];

  return (
    <article className={`scheme-card ${variant === 'primary' ? 'primary' : ''}`}>
      <div className="scheme-head">
        <div className="scheme-title">
          <span className="scheme-emoji">{details.emoji}</span>
          <h3>{scheme.name}</h3>
        </div>
        <span className="scheme-badge">{labels.matched}</span>
      </div>
      <div className="scheme-section">
        <span>{labels.recommended}</span>
        <p>{scheme.description}</p>
      </div>
      <div className="scheme-section">
        <span>{labels.why}</span>
        <p>{scheme.reason}</p>
      </div>
      <div className="scheme-section">
        <span>{labels.benefit}</span>
        <p>{details.benefit}</p>
      </div>
      <div className="scheme-section">
        <span>{labels.documents}</span>
        <p>{details.documents}</p>
      </div>
      <div className="scheme-section">
        <span>{labels.apply}</span>
        <p>{scheme.how_to_apply}</p>
      </div>
    </article>
  );
}

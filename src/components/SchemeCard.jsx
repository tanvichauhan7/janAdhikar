const SCHEME_DETAILS = {
  'PM Kisan Samman Nidhi': {
    badge: 'PK',
    benefit: 'Income support of Rs 6,000 per year for eligible farmer families.',
    documents: 'Aadhaar, bank details, and land-related documents.',
    officialWebsite: 'https://www.pmkisan.gov.in/',
    applyLink: 'https://www.pmkisan.gov.in/',
    learnMoreLink: 'https://www.pmkisan.gov.in/',
  },
  'PM Awas Yojana (Gramin)': {
    badge: 'HG',
    benefit: 'Housing support for rural families needing a safer permanent home.',
    documents: 'Aadhaar, address details, and local housing verification records.',
    officialWebsite: 'https://pmayg.dord.gov.in/netiayHome/Home.aspx',
    applyLink: 'https://pmayg.dord.gov.in/netiayHome/Home.aspx',
    learnMoreLink: 'https://pmayg.dord.gov.in/netiayHome/Home.aspx',
  },
  'Ayushman Bharat PM-JAY': {
    badge: 'AB',
    benefit: 'Health cover up to Rs 5 lakh per family for eligible beneficiaries.',
    documents: 'Aadhaar, ration card, or beneficiary identification records.',
    officialWebsite: 'https://nha.gov.in/PM-JAY.php',
    applyLink: 'https://nha.gov.in/PM-JAY.php',
    learnMoreLink: 'https://nha.gov.in/PM-JAY.php',
  },
  'Sukanya Samriddhi Yojana': {
    badge: 'SS',
    benefit: 'Long-term small savings support for a girl child.',
    documents: 'Birth certificate, guardian ID, and KYC at bank or post office.',
    officialWebsite: 'https://www.indiapost.gov.in/VAS/pages/pmodashboard/sukanyasamriddhiaccount.aspx',
    applyLink: 'https://www.indiapost.gov.in/VAS/pages/pmodashboard/sukanyasamriddhiaccount.aspx',
    learnMoreLink: 'https://www.indiapost.gov.in/VAS/pages/pmodashboard/sukanyasamriddhiaccount.aspx',
  },
  MGNREGA: {
    badge: 'MG',
    benefit: 'Up to 100 days of wage employment for rural households.',
    documents: 'Job card request details, Aadhaar, and local residence information.',
    officialWebsite: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
    applyLink: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
    learnMoreLink: 'https://nrega.dord.gov.in/MGNREGA_new/Nrega_home.aspx',
  },
  'Pradhan Mantri Ujjwala Yojana': {
    badge: 'UJ',
    benefit: 'Support for LPG connection for eligible households.',
    documents: 'Aadhaar, ration card, and bank details.',
    officialWebsite: 'https://www.pmuy.gov.in/index.aspx',
    applyLink: 'https://www.pmuy.gov.in/index.aspx',
    learnMoreLink: 'https://www.pmuy.gov.in/index.aspx',
  },
  'Beti Bachao Beti Padhao': {
    badge: 'BB',
    benefit: 'Support and awareness focus for the girl child and her education.',
    documents: 'Child ID records and any local beneficiary documents if asked.',
    officialWebsite: 'https://wcd.nic.in/bbbp-schemes',
    applyLink: 'https://wcd.nic.in/bbbp-schemes',
    learnMoreLink: 'https://wcd.nic.in/bbbp-schemes',
  },
  'PM MUDRA Yojana': {
    badge: 'MU',
    benefit: 'Small business loan support under Shishu, Kishor, and Tarun categories.',
    documents: 'Identity proof, business details, and basic business plan.',
    officialWebsite: 'https://www.mudra.org.in/',
    applyLink: 'https://www.mudra.org.in/',
    learnMoreLink: 'https://www.mudra.org.in/',
  },
  'National Scholarship Portal (NSP)': {
    badge: 'NS',
    benefit: 'Scholarship support for students across school and higher education.',
    documents: 'Student ID, academic records, Aadhaar, and income proof.',
    officialWebsite: 'https://nsp.gov.in/',
    applyLink: 'https://nsp.gov.in/',
    learnMoreLink: 'https://nsp.gov.in/',
  },
  'Atal Pension Yojana': {
    badge: 'AP',
    benefit: 'Government-backed pension support through regular contributions.',
    documents: 'Savings account, Aadhaar, and mobile number.',
    officialWebsite: 'https://financialservices.gov.in/beta/index.php/en/homepagejansuraksha/atal-pension-yojana',
    applyLink: 'https://financialservices.gov.in/beta/index.php/en/homepagejansuraksha/atal-pension-yojana',
    learnMoreLink: 'https://financialservices.gov.in/beta/index.php/en/homepagejansuraksha/atal-pension-yojana',
  },
  'PM Jan Dhan Yojana': {
    badge: 'JD',
    benefit: 'Basic zero-balance bank account with financial inclusion benefits.',
    documents: 'Aadhaar or another valid identity and address proof.',
    officialWebsite: 'https://pmjdy.gov.in/Home.aspx',
    applyLink: 'https://pmjdy.gov.in/Home.aspx',
    learnMoreLink: 'https://pmjdy.gov.in/Home.aspx',
  },
  'Indira Gandhi National Old Age Pension': {
    badge: 'OP',
    benefit: 'Monthly pension support for eligible older persons.',
    documents: 'Age proof, identity proof, and local income or pension records.',
    officialWebsite: 'https://nsap.nic.in/',
    applyLink: 'https://nsap.nic.in/',
    learnMoreLink: 'https://nsap.nic.in/',
  },
};

const LABELS = {
  en: {
    matched: 'Likely eligible',
    recommended: 'Most relevant for you',
    why: 'Why this may fit',
    benefit: 'Benefit',
    documents: 'Documents needed',
    apply: 'How to apply',
    applyNow: 'Apply Now',
    website: 'Official Website',
    learnMore: 'Learn More',
  },
  hi: {
    matched: 'मिलने की अच्छी संभावना',
    recommended: 'अभी के लिए सबसे उपयुक्त',
    why: 'क्यों उपयुक्त लग रही है',
    benefit: 'लाभ',
    documents: 'ज़रूरी कागज़',
    apply: 'आवेदन का तरीका',
    applyNow: 'अभी आवेदन देखें',
    website: 'आधिकारिक वेबसाइट',
    learnMore: 'और जानें',
  },
};

function openExternal(url) {
  if (!url) return;
  globalThis.open(url, '_blank', 'noopener,noreferrer');
}

function ActionButton({ label, url, variant = 'secondary' }) {
  if (!url) {
    return (
      <button type="button" className={`scheme-action ${variant}`} disabled>
        {label}
      </button>
    );
  }

  return (
    <button type="button" className={`scheme-action ${variant}`} onClick={() => openExternal(url)}>
      {label}
    </button>
  );
}

export default function SchemeCard({ scheme, language = 'en', variant = 'secondary' }) {
  const details = SCHEME_DETAILS[scheme.name] || {
    badge: 'SC',
    benefit: scheme.description,
    documents:
      language === 'hi'
        ? 'सही कागज़ों की सूची स्थानीय कार्यालय से पूछ लें।'
        : 'Ask the local office for the exact document list.',
    officialWebsite: null,
    applyLink: null,
    learnMoreLink: null,
  };
  const labels = LABELS[language];

  return (
    <article className={`scheme-card ${variant === 'primary' ? 'primary' : ''}`}>
      <div className="scheme-head">
        <div className="scheme-title">
          <span className="scheme-badge-icon">{details.badge}</span>
          <div>
            <h3>{scheme.name}</h3>
            <span className="scheme-badge">{labels.matched}</span>
          </div>
        </div>
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

      <details className="scheme-details">
        <summary>{labels.apply}</summary>
        <p>{scheme.how_to_apply}</p>
      </details>

      <div className="scheme-actions">
        <ActionButton label={labels.applyNow} url={details.applyLink} variant="primary" />
        <ActionButton label={labels.website} url={details.officialWebsite} />
        <ActionButton label={labels.learnMore} url={details.learnMoreLink} />
      </div>
    </article>
  );
}

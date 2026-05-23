import { useEffect, useRef, useState } from 'react';
import './App.css';
import EligibilityForm from './components/EligibilityForm';
import LanguageToggle from './components/LanguageToggle';
import LegalChat from './components/LegalChat';
import LoadingSpinner from './components/LoadingSpinner';
import SchemeCard from './components/SchemeCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

const OCCUPATIONS = [
  'Farmer',
  'Student',
  'Unemployed',
  'Labour',
  'Unorganised',
  'Self-Employed',
  'Business',
  'Entrepreneur',
  'Homemaker',
  'Private Sector',
  'Government Employee',
];

const COPY = {
  en: {
    heroLabel: 'Offline welfare and legal support',
    heroTitle: 'JanAdhikar helps people find schemes and understand basic legal rights.',
    heroBody:
      'Built for a hackathon demo that must keep working even without internet. Everything below runs on local rules, local search, and a local backend.',
    schemesTab: 'Scheme Check',
    legalTab: 'Legal Help',
    panelTitle: 'Eligibility snapshot',
    panelBody:
      'Fill in a few details and we will match the profile against offline welfare rules. The backend also adds local retrieval context for safer suggestions.',
    emptyState: 'No schemes found yet. Try adjusting age, income, occupation, or state.',
    foundLabel: 'Matched schemes',
    retrievalLabel: 'Local context used',
  },
  hi: {
    heroLabel: 'Offline yojana aur kanooni madad',
    heroTitle: 'JanAdhikar logon ko yojanaen dhoondhne aur buniyadi kanooni adhikar samajhne mein madad karta hai.',
    heroBody:
      'Yeh hackathon demo ke liye bana hai jo internet ke bina bhi kaam kare. Neeche sab kuch local rules, local search aur local backend par chalta hai.',
    schemesTab: 'Yojana Check',
    legalTab: 'Kanooni Madad',
    panelTitle: 'Yogyata snapshot',
    panelBody:
      'Kuch profile details bharie aur hum offline niyamon ke hisaab se yojana match karenge. Backend local retrieval context bhi jodta hai.',
    emptyState: 'Abhi koi yojana match nahi hui. Age, income, occupation ya state badal kar dekhiye.',
    foundLabel: 'Mili hui yojanaen',
    retrievalLabel: 'Istemal hua local context',
  },
};

const INITIAL_FORM = {
  name: '',
  age: '',
  gender: 'female',
  state: 'Bihar',
  occupation: 'Student',
  monthly_income: '',
};

export default function App() {
  const [language, setLanguage] = useState('en');
  const [activeTab, setActiveTab] = useState('schemes');
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [schemeResponse, setSchemeResponse] = useState(null);
  const [schemeError, setSchemeError] = useState('');
  const [isCheckingSchemes, setIsCheckingSchemes] = useState(false);
  const [isLegalLoading, setIsLegalLoading] = useState(false);
  const [legalMessages, setLegalMessages] = useState(() => [
    {
      id: 1,
      role: 'bot',
      text:
        'Hello! Ask me a legal question in simple words and I will explain basic rights in a practical way.',
      reference: null,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const legalEndRef = useRef(null);
  const copy = COPY[language];

  useEffect(() => {
    legalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [legalMessages, isLegalLoading]);

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    setLegalMessages([
      {
        id: 1,
        role: 'bot',
        text:
          nextLanguage === 'hi'
            ? 'Namaste! Apna kanooni sawaal seedhi bhaasha mein puchhiye. Main buniyadi adhikaron ko asaan tareeke se samjhaunga.'
            : 'Hello! Ask me a legal question in simple words and I will explain basic rights in a practical way.',
        reference: null,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }

  async function handleEligibilitySubmit(event) {
    event.preventDefault();
    setIsCheckingSchemes(true);
    setSchemeError('');

    try {
      const response = await fetch(`${API_BASE_URL}/recommend-schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age),
          monthly_income: Number(formData.monthly_income),
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Eligibility request failed');
      }

      const data = await response.json();
      setSchemeResponse(data);
    } catch {
      setSchemeResponse(null);
      setSchemeError(
        language === 'hi'
          ? 'Backend se jawab lene mein dikkat aa rahi hai. Kripya FastAPI server chalu hai ya nahi, check karein.'
          : 'The backend could not be reached. Please make sure the FastAPI server is running.',
      );
    } finally {
      setIsCheckingSchemes(false);
    }
  }

  async function handleLegalSend(question) {
    const trimmed = question.trim();
    if (!trimmed) {
      return;
    }

    const timestamp = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    setLegalMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: 'user', text: trimmed, time: timestamp, reference: null },
    ]);
    setIsLegalLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/legal-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, language }),
      });

      if (!response.ok) {
        throw new Error('Legal request failed');
      }

      const data = await response.json();
      const retrievalText = (data.retrieval_context || [])
        .map((item) => item.text)
        .slice(0, 2)
        .join(' ');

      setLegalMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text: data.answer,
          time: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          reference: data.law_reference,
          context: retrievalText,
        },
      ]);
    } catch {
      setLegalMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'bot',
          text:
            language === 'hi'
              ? 'Server se jawab nahi mil paaya. Kripya backend chalu hone ke baad phir koshish karein.'
              : 'I could not reach the backend just now. Please retry after the backend is running.',
          time: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          reference: null,
        },
      ]);
    } finally {
      setIsLegalLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">{copy.heroLabel}</span>
          <h1>{copy.heroTitle}</h1>
          <p>{copy.heroBody}</p>
        </div>
        <div className="hero-side">
          <LanguageToggle language={language} onChange={handleLanguageChange} />
          <div className="hero-card">
            <div className="hero-card-label">{copy.panelTitle}</div>
            <p>{copy.panelBody}</p>
          </div>
        </div>
      </div>

      <div className="workspace-shell">
        <div className="tab-strip" role="tablist" aria-label="JanAdhikar sections">
          <button
            type="button"
            className={activeTab === 'schemes' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('schemes')}
          >
            {copy.schemesTab}
          </button>
          <button
            type="button"
            className={activeTab === 'legal' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('legal')}
          >
            {copy.legalTab}
          </button>
        </div>

        {activeTab === 'schemes' ? (
          <div className="schemes-layout">
            <EligibilityForm
              formData={formData}
              setFormData={setFormData}
              language={language}
              states={STATES}
              occupations={OCCUPATIONS}
              onSubmit={handleEligibilitySubmit}
            />

            <section className="results-panel">
              <div className="results-header">
                <div>
                  <span className="results-label">{copy.foundLabel}</span>
                  <h2>{schemeResponse?.summary || copy.panelTitle}</h2>
                </div>
                {schemeResponse && <div className="count-pill">{schemeResponse.total_count}</div>}
              </div>

              {isCheckingSchemes ? (
                <LoadingSpinner
                  label={
                    language === 'hi'
                      ? 'Offline yojana matching chal rahi hai'
                      : 'Running offline scheme matching'
                  }
                />
              ) : null}

              {schemeError ? <div className="error-banner">{schemeError}</div> : null}

              {!isCheckingSchemes && schemeResponse?.eligible_schemes?.length > 0 ? (
                <div className="scheme-grid">
                  {schemeResponse.eligible_schemes.map((scheme) => (
                    <SchemeCard key={scheme.name} scheme={scheme} />
                  ))}
                </div>
              ) : null}

              {!isCheckingSchemes && schemeResponse && !schemeResponse.eligible_schemes?.length ? (
                <div className="empty-card">{copy.emptyState}</div>
              ) : null}

              {!isCheckingSchemes && schemeResponse?.retrieval_context?.length ? (
                <div className="context-panel">
                  <div className="context-title">{copy.retrievalLabel}</div>
                  <div className="context-list">
                    {schemeResponse.retrieval_context.map((item, index) => (
                      <div key={`${item.text}-${index}`} className="context-item">
                        <span className="context-score">{item.score}</span>
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </section>
          </div>
        ) : (
          <LegalChat
            language={language}
            messages={legalMessages}
            isLoading={isLegalLoading}
            onSend={handleLegalSend}
            endRef={legalEndRef}
          />
        )}
      </div>
    </div>
  );
}

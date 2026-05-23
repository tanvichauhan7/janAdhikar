import { useEffect, useRef, useState } from 'react';
import './App.css';
import LanguageToggle from './components/LanguageToggle';
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

const QUESTION_FLOW = ['name', 'age', 'gender', 'state', 'occupation', 'monthly_income'];
const WELCOME_INTERESTS = ['Pension', 'Health support', 'Education', 'Farming support', 'Housing', 'Employment'];
const DOCUMENT_TYPES = ['aadhaar', 'ration', 'income', 'disability', 'pension'];
const LEGAL_KEYWORDS = [
  'legal',
  'law',
  'police',
  'fir',
  'dowry',
  'dahej',
  'violence',
  'marta',
  'maar',
  'husband',
  'pati',
  'property',
  'zameen',
  'salary',
  'rent',
  'kiraya',
  'harassment',
  'shikayat',
  'adhikar',
  'rti',
  'domestic',
  'crime',
  'maarpeet',
];
const SENSITIVE_LEGAL_KEYWORDS = [
  'marta',
  'maar',
  'beat',
  'abuse',
  'violence',
  'harassment',
  'dahej',
  'dowry',
  'husband',
  'pati',
];

const OCCUPATION_GROUPS = [
  { canonical: 'Farmer', aliases: ['farmer', 'kisan', 'kisaan', 'agriculture', 'krishi'] },
  { canonical: 'Student', aliases: ['student', 'vidyarthi', 'school', 'college', 'padhai'] },
  { canonical: 'Unemployed', aliases: ['unemployed', 'jobless', 'berozgar', 'job nahi', 'kaam nahi', 'no job'] },
  { canonical: 'Labour', aliases: ['labour', 'labor', 'labourer', 'mazdoor', 'worker', 'construction worker', 'construction', 'daily wage worker', 'rajmistri', 'helper'] },
  { canonical: 'Unorganised', aliases: ['unorganised', 'unorganized', 'daily wage', 'thela', 'rehdi', 'informal worker', 'street vendor'] },
  { canonical: 'Self-Employed', aliases: ['self-employed', 'self employed', 'freelancer', 'electrician', 'plumber', 'tailor', 'mechanic', 'artisan', 'weaver', 'fisherman', 'delivery worker', 'mistri'] },
  { canonical: 'Business', aliases: ['business', 'small business', 'shopkeeper', 'dukandaar', 'vendor', 'store', 'shop'] },
  { canonical: 'Entrepreneur', aliases: ['entrepreneur', 'startup', 'business owner'] },
  { canonical: 'Homemaker', aliases: ['homemaker', 'housewife', 'grihini', 'ghar sambhalti', 'ghar sambhalta', 'widow', 'vidhwa'] },
  { canonical: 'Private Sector', aliases: ['private', 'private employee', 'company', 'teacher', 'driver', 'nurse', 'security guard', 'cleaner', 'factory worker', 'private sector', 'delivery boy', 'guard'] },
  { canonical: 'Government Employee', aliases: ['government', 'govt', 'sarkari', 'anganwadi worker', 'asha worker', 'gov employee'] },
  { canonical: 'Private Sector', aliases: ['retired', 'disabled', 'divyang', 'care worker', 'domestic worker'] },
];

const FIELD_QUICK_REPLIES = {
  name: ['Rahul Kumar', 'Rekha Devi', 'Asha Kumari'],
  age: ['16', '24', '35', '60'],
  gender: ['Female', 'Male', 'Other'],
  state: ['Bihar', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra'],
  occupation: ['Farmer', 'Teacher', 'Driver', 'Shopkeeper', 'Student', 'Homemaker', 'Labourer', 'Government Employee'],
  monthly_income: ['5000', '9000', '15000', '25000'],
};

const COPY = {
  en: {
    appName: 'JanAdhikar Saathi',
    assistantStatus: 'Helping citizens find government support',
    onlineNow: 'Online now',
    trustChips: ['Works offline', 'Private local processing', 'Helpful for rural families'],
    intro:
      'Namaste 👋 I am JanAdhikar Saathi. I can help you check government schemes and simple legal support in a calm, friendly way.',
    warmPrompt:
      'You can tell me what kind of help you need, or I can ask a few easy questions and guide you step by step.',
    askName: 'What should I call you?',
    askAge: 'How old are you?',
    askGender: 'Please tell me your gender.',
    askState: 'Which state do you live in?',
    askOccupation: 'What kind of work do you do? You can say farmer, teacher, driver, shopkeeper, homemaker, labourer, or student.',
    askIncome: 'About how much do you earn in a month? You can just send the amount, like 5000 or 12000.',
    invalidAge: 'Please send your age as a number between 1 and 100, like 16, 24, or 60.',
    invalidGender: 'Please reply with Female, Male, or Other.',
    invalidState: 'Please send a valid Indian state or UT name.',
    invalidOccupation: 'Please tell me your work type, like farmer, teacher, driver, labourer, homemaker, shopkeeper, or student.',
    invalidIncome: 'Please send monthly income in digits, like 5000, 12000, or 25000.',
    inputPlaceholder: 'Type a message',
    send: 'Send',
    listen: 'Speak',
    stopListening: 'Listening',
    attach: 'Upload',
    voiceUnsupported: 'Voice input is not supported in this browser.',
    voiceStarted: 'I am listening. Speak naturally in Hindi, English, or Hinglish.',
    voiceStopped: 'Voice input stopped.',
    languageNotice: 'Language updated. You can reply in English, Hindi, or Hinglish.',
    typing: 'Saathi is typing...',
    activityScheme: 'Checking schemes that may fit you...',
    activityLegal: 'Looking for legal guidance...',
    activityProfile: 'Understanding your situation...',
    legalCare: 'I am sorry you may be dealing with this. Your safety matters, and I will try to guide you gently.',
    legalFallback: 'I could not get legal guidance just now. Please try once more.',
    schemeFallback: 'I could not check schemes just now. Please try again in a moment.',
    askAgain:
      'If you want, you can ask another legal question, send an update like income or work, or upload a helpful document photo.',
    readyForSchemes: 'Great. I have enough details now. Let me check what support may fit you.',
    schemeLead: 'Based on what you shared, this looks most relevant for you.',
    schemeMore: 'You may also benefit from these options.',
    schemeNone:
      'I do not see a strong scheme match yet. If you update your income, work, age, or state, I will check again.',
    profileRefresh: 'Okay, I am checking support options again with that update.',
    legalAfter:
      'I am with you. If you want, I can also help you check government schemes in the same chat.',
    askContinue:
      'You can also say things like “pension chahiye”, “farmer hu”, “no job”, or “mera pati marta hai”.',
    minorNote: 'I will keep child and student-related support in mind too.',
    seniorNote: 'I will keep senior citizen support in mind too.',
    documentPrompt:
      'If it helps, you can also upload a photo or PDF of Aadhaar, ration card, income certificate, disability certificate, or pension paper.',
    documentSaved: 'I received your document.',
    documentAcknowledge:
      'I cannot fully read every document automatically in this demo, but I can remember what you uploaded and guide you better.',
    documentTypes: {
      aadhaar: 'Aadhaar card',
      ration: 'Ration card',
      income: 'Income certificate',
      disability: 'Disability certificate',
      pension: 'Pension document',
      general: 'Document',
    },
    purposeReply: {
      Pension: 'Understood. I will keep pension support in mind.',
      'Health support': 'Okay. I will keep health-related support in mind.',
      Education: 'Got it. I will keep education support in mind.',
      'Farming support': 'Noted. I will look for farming-related support.',
      Housing: 'Okay. I will keep housing support in mind.',
      Employment: 'Understood. I will look for work and livelihood support.',
    },
    shortAcks: [
      'Got it 👍',
      'Understood.',
      'Thanks for sharing that.',
      'Okay, I have noted that.',
      'Thanks, that helps.',
    ],
    suggestionLabel: 'Quick options',
  },
  hi: {
    appName: 'जनअधिकार साथी',
    assistantStatus: 'सरकारी मदद ढूँढने में साथ',
    onlineNow: 'अभी उपलब्ध',
    trustChips: ['ऑफलाइन चलता है', 'जानकारी लोकल रहती है', 'गाँव और कस्बों के लिए उपयोगी'],
    intro:
      'नमस्ते 👋 मैं जनअधिकार साथी हूँ। मैं आपको सरकारी योजनाएँ समझने और आसान भाषा में कानूनी मदद बताने के लिए यहाँ हूँ।',
    warmPrompt:
      'आप चाहें तो सीधे अपनी ज़रूरत लिख सकते हैं, या मैं कुछ आसान सवाल पूछकर आपको धीरे-धीरे गाइड कर दूँगा।',
    askName: 'मैं आपको किस नाम से बुलाऊँ?',
    askAge: 'आपकी उम्र कितनी है?',
    askGender: 'कृपया अपना gender बताइए।',
    askState: 'आप किस राज्य में रहते हैं?',
    askOccupation: 'आप क्या काम करते हैं? जैसे किसान, शिक्षक, ड्राइवर, दुकानदार, गृहिणी, मजदूर, या छात्र।',
    askIncome: 'लगभग महीने में कितनी कमाई हो जाती है? सिर्फ amount लिख दीजिए, जैसे 5000 या 12000।',
    invalidAge: 'कृपया उम्र 1 से 100 के बीच नंबर में भेजें, जैसे 16, 24, या 60।',
    invalidGender: 'कृपया Female, Male, या Other में से जवाब दें।',
    invalidState: 'कृपया सही भारतीय राज्य या UT का नाम भेजें।',
    invalidOccupation: 'कृपया अपना काम बताइए, जैसे किसान, शिक्षक, ड्राइवर, मजदूर, गृहिणी, दुकानदार, या छात्र।',
    invalidIncome: 'कृपया महीने की कमाई digits में भेजें, जैसे 5000, 12000, या 25000।',
    inputPlaceholder: 'संदेश लिखें',
    send: 'भेजें',
    listen: 'बोलें',
    stopListening: 'सुन रहा हूँ',
    attach: 'अपलोड',
    voiceUnsupported: 'इस browser में voice input support नहीं है.',
    voiceStarted: 'मैं सुन रहा हूँ। आप हिंदी, English, या Hinglish में आराम से बोलिए।',
    voiceStopped: 'Voice input बंद हो गया।',
    languageNotice: 'भाषा बदल गई है। आप हिंदी, English, या Hinglish में जवाब दे सकते हैं।',
    typing: 'साथी लिख रहा है...',
    activityScheme: 'आपके लिए योजनाएँ देख रहा हूँ...',
    activityLegal: 'कानूनी मदद ढूँढ रहा हूँ...',
    activityProfile: 'आपकी स्थिति समझ रहा हूँ...',
    legalCare: 'मुझे दुख है कि आपको यह झेलना पड़ रहा है। आपकी सुरक्षा और मदद सबसे ज़रूरी है।',
    legalFallback: 'अभी कानूनी जवाब नहीं मिल पाया। एक बार फिर कोशिश कीजिए।',
    schemeFallback: 'अभी योजनाएँ नहीं देख पाया। कृपया थोड़ी देर में फिर कोशिश करें।',
    askAgain:
      'आप चाहें तो कोई और कानूनी सवाल पूछ सकते हैं, income या काम अपडेट कर सकते हैं, या कोई ज़रूरी document भी भेज सकते हैं।',
    readyForSchemes: 'बहुत बढ़िया। अब मेरे पास इतनी जानकारी है कि मैं आपके लिए मदद देख सकूँ।',
    schemeLead: 'आपकी बातों के हिसाब से यह योजना सबसे ज़्यादा काम की लगती है।',
    schemeMore: 'इसके अलावा ये योजनाएँ भी आपके काम आ सकती हैं।',
    schemeNone:
      'अभी कोई बहुत साफ योजना match नहीं दिख रही। अगर आप income, काम, उम्र, या राज्य थोड़ा और साफ बताएँ, तो मैं फिर देखता हूँ।',
    profileRefresh: 'ठीक है, इस नई जानकारी के साथ मैं फिर से मदद देखता हूँ।',
    legalAfter:
      'मैं आपके साथ हूँ। चाहें तो इसी चैट में मैं सरकारी योजनाएँ भी देख सकता हूँ जो आपके काम आ सकती हैं।',
    askContinue:
      'आप ऐसे भी लिख सकते हैं: “pension chahiye”, “farmer hu”, “no job”, या “mera pati marta hai”.',
    minorNote: 'मैं बच्चों और पढ़ाई से जुड़ी मदद भी ध्यान में रखूँगा।',
    seniorNote: 'मैं बुज़ुर्गों वाली मदद भी ध्यान में रखूँगा।',
    documentPrompt:
      'अगर आपके पास हो, तो आप Aadhaar, ration card, income certificate, disability certificate, या pension paper की photo/PDF भी भेज सकते हैं।',
    documentSaved: 'मुझे आपका document मिल गया।',
    documentAcknowledge:
      'इस demo में मैं हर document को पूरा पढ़ नहीं पाता, लेकिन आपने जो भेजा है उसे याद रखकर बेहतर guidance दे सकता हूँ।',
    documentTypes: {
      aadhaar: 'आधार कार्ड',
      ration: 'राशन कार्ड',
      income: 'आय प्रमाण पत्र',
      disability: 'दिव्यांगता प्रमाण पत्र',
      pension: 'पेंशन दस्तावेज़',
      general: 'दस्तावेज़',
    },
    purposeReply: {
      Pension: 'ठीक है, मैं pension वाली मदद भी ध्यान में रखूँगा।',
      'Health support': 'ठीक है, मैं health support भी देखूँगा।',
      Education: 'समझ गया, मैं पढ़ाई से जुड़ी मदद भी देखूँगा।',
      'Farming support': 'ठीक है, मैं खेती से जुड़ी मदद भी ध्यान में रखूँगा।',
      Housing: 'ठीक है, मैं घर और आवास से जुड़ी योजनाएँ भी देखूँगा।',
      Employment: 'समझ गया, मैं काम और रोज़गार से जुड़ी मदद भी देखूँगा।',
    },
    shortAcks: [
      'ठीक है 👍',
      'समझ गया।',
      'जानकारी देने के लिए धन्यवाद।',
      'अच्छा, मैंने नोट कर लिया।',
      'ठीक है, यह काम आएगा।',
    ],
    suggestionLabel: 'जल्दी विकल्प',
  },
};

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function nowTime() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `msg-${Math.random().toString(36).slice(2)}`;
}

function createTextMessage(sender, text, extra = {}) {
  return {
    id: createId(),
    sender,
    type: 'text',
    text,
    time: nowTime(),
    status: sender === 'user' ? 'read' : null,
    ...extra,
  };
}

function detectDocumentKind(fileName = '') {
  const normalized = fileName.toLowerCase();
  return DOCUMENT_TYPES.find((type) => normalized.includes(type)) || 'general';
}

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function normalizeText(value) {
  return String(value || '').trim();
}

function normalizeSimple(value) {
  return normalizeText(value).toLowerCase();
}

function parseIncome(text) {
  const normalized = normalizeSimple(text).replace(/,/g, ' ');
  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|lakhs|lacs)/);
  if (lakhMatch) {
    return Math.round(Number.parseFloat(lakhMatch[1]) * 100000);
  }
  const plain = normalized.match(/(\d{3,7})/);
  return plain ? Number.parseInt(plain[1], 10) : null;
}

function matchState(text) {
  const normalized = normalizeSimple(text);
  return (
    STATES.find((state) => normalizeSimple(state) === normalized) ||
    STATES.find((state) => normalizeSimple(state).includes(normalized) || normalized.includes(normalizeSimple(state)))
  );
}

function matchOccupation(text) {
  const normalized = normalizeSimple(text)
    .replace(/\bhu\b/g, '')
    .replace(/\bhun\b/g, '')
    .replace(/\bkaam\b/g, '')
    .replace(/\bjob\b/g, '')
    .trim();

  for (const group of OCCUPATION_GROUPS) {
    if (group.aliases.some((alias) => normalized.includes(alias))) {
      return group.canonical;
    }
  }
  return null;
}

function matchGender(text) {
  const normalized = normalizeSimple(text);
  if (['female', 'mahila', 'woman', 'ladki'].some((value) => normalized.includes(value))) return 'female';
  if (['male', 'purush', 'man', 'ladka'].some((value) => normalized.includes(value))) return 'male';
  if (['other', 'trans', 'non-binary'].some((value) => normalized.includes(value))) return 'other';
  return null;
}

function parseField(field, text) {
  const raw = normalizeText(text);
  if (!raw) return null;
  if (field === 'name') return titleCase(raw.replace(/^(my name is|mera naam|main|mai|i am|i'm)\s+/i, ''));
  if (field === 'age') {
    const match = raw.match(/(\d{1,3})/);
    if (!match) return null;
    const age = Number.parseInt(match[1], 10);
    return age >= 1 && age <= 100 ? age : null;
  }
  if (field === 'gender') return matchGender(raw);
  if (field === 'state') return matchState(raw) || null;
  if (field === 'occupation') return matchOccupation(raw);
  if (field === 'monthly_income') return parseIncome(raw);
  return raw;
}

function getNextField(profile) {
  return QUESTION_FLOW.find((field) => !profile[field]);
}

function getQuestion(field, language, profile) {
  const copy = COPY[language];
  if (field === 'age' && profile.name) {
    return language === 'hi' ? `${profile.name} ji, आपकी उम्र कितनी है?` : `${profile.name}, how old are you?`;
  }
  return {
    name: copy.askName,
    age: copy.askAge,
    gender: copy.askGender,
    state: copy.askState,
    occupation: copy.askOccupation,
    monthly_income: copy.askIncome,
  }[field];
}

function isLegalQuery(text) {
  const normalized = normalizeSimple(text);
  return LEGAL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function isSensitiveLegalQuery(text) {
  const normalized = normalizeSimple(text);
  return SENSITIVE_LEGAL_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

function detectProfileUpdate(text) {
  const normalized = normalizeSimple(text);
  if (normalized.includes('income') || normalized.includes('aay') || normalized.includes('kamai')) {
    const income = parseIncome(text);
    return income ? { field: 'monthly_income', value: income } : null;
  }
  if (normalized.includes('age') || normalized.includes('umar')) {
    const age = parseField('age', text);
    return age ? { field: 'age', value: age } : null;
  }
  if (normalized.includes('state') || normalized.includes('rajya') || matchState(text)) {
    const state = matchState(text);
    return state ? { field: 'state', value: state } : null;
  }
  if (
    normalized.includes('occupation') ||
    normalized.includes('work') ||
    normalized.includes('काम') ||
    normalized.includes('hu') ||
    matchOccupation(text)
  ) {
    const occupation = matchOccupation(text);
    return occupation ? { field: 'occupation', value: occupation } : null;
  }
  const gender = matchGender(text);
  if (gender) return { field: 'gender', value: gender };
  return null;
}

function formatUserBubble(field, value) {
  if (field === 'monthly_income') return `₹${Number(value).toLocaleString('en-IN')}`;
  if (field === 'gender') return titleCase(String(value));
  return String(value);
}

function getAssistantInitial() {
  return 'JS';
}

function TypingIndicator({ label }) {
  return (
    <div className="message-row assistant">
      <div className="avatar assistant">{getAssistantInitial()}</div>
      <div className="bubble assistant typing">
        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="message-meta">{label}</div>
      </div>
    </div>
  );
}

function TrustCard({ language }) {
  return (
    <div className="trust-card">
      {COPY[language].trustChips.map((chip) => (
        <span key={chip} className="trust-chip">
          {chip}
        </span>
      ))}
    </div>
  );
}

function UploadBubble({ message }) {
  return (
    <div className="upload-card">
      <div className="upload-icon">📎</div>
      <div className="upload-info">
        <div className="upload-name">{message.fileName}</div>
        <div className="upload-meta">
          {message.fileLabel}
          {message.fileSize ? ` • ${message.fileSize}` : ''}
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, previousSender, profileName }) {
  const isUser = message.sender === 'user';
  const grouped = previousSender === message.sender;
  const userInitial = (profileName || 'U').trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'} ${grouped ? 'grouped' : ''}`}>
      {!grouped ? (
        <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>{isUser ? userInitial : getAssistantInitial()}</div>
      ) : (
        <div className="avatar-spacer" />
      )}

      <div className={`bubble ${isUser ? 'user' : 'assistant'} ${message.type || 'text'}`}>
        {message.type === 'schemes' ? (
          <>
            <p className="message-text">{message.text}</p>
            <div className="scheme-stack">
              {message.schemes.map((scheme, index) => (
                <SchemeCard
                  key={scheme.name}
                  scheme={scheme}
                  language={message.language}
                  variant={index === 0 ? 'primary' : 'secondary'}
                />
              ))}
            </div>
          </>
        ) : message.type === 'legal' ? (
          <>
            <p className="message-text">{message.text}</p>
            {message.reference ? <div className="law-reference">{message.reference}</div> : null}
          </>
        ) : message.type === 'upload' ? (
          <UploadBubble message={message} />
        ) : (
          <p className="message-text">{message.text}</p>
        )}

        <div className="message-footer">
          <span className="message-time">{message.time}</span>
          {isUser ? <span className="message-status">{message.status === 'read' ? '✓✓' : '✓'}</span> : null}
        </div>
      </div>
    </div>
  );
}

function formatFileSize(size) {
  if (!size) return '';
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function App() {
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState(() => [
    createTextMessage('assistant', COPY.en.intro),
    createTextMessage('assistant', COPY.en.warmPrompt),
    createTextMessage('assistant', COPY.en.askName),
    createTextMessage('assistant', COPY.en.documentPrompt),
  ]);
  const [inputText, setInputText] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    age: null,
    gender: '',
    state: '',
    occupation: '',
    monthly_income: null,
  });
  const [pendingField, setPendingField] = useState('name');
  const [quickReplies, setQuickReplies] = useState([...WELCOME_INTERESTS, ...FIELD_QUICK_REPLIES.name]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState(COPY.en.typing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownResults, setHasShownResults] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [listeningSupported] = useState(() =>
    Boolean(globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition),
  );
  const recognitionRef = useRef(null);
  const ackIndexRef = useRef(0);
  const fileInputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, quickReplies, isListening]);

  useEffect(() => {
    const viewport = globalThis.visualViewport;
    if (!viewport) return undefined;
    function syncHeight() {
      document.documentElement.style.setProperty('--visual-height', `${viewport.height}px`);
    }
    syncHeight();
    viewport.addEventListener('resize', syncHeight);
    return () => viewport.removeEventListener('resize', syncHeight);
  }, []);

  function pushMessage(message) {
    setMessages((prev) => [...prev, message]);
  }

  function getAck() {
    const list = COPY[language].shortAcks;
    const value = list[ackIndexRef.current % list.length];
    ackIndexRef.current += 1;
    return value;
  }

  function setRepliesForField(field) {
    setQuickReplies([...(field === 'name' ? WELCOME_INTERESTS : []), ...(FIELD_QUICK_REPLIES[field] || [])]);
  }

  function setActivityLabel(type) {
    const copy = COPY[language];
    if (type === 'scheme') setTypingLabel(copy.activityScheme);
    else if (type === 'legal') setTypingLabel(copy.activityLegal);
    else setTypingLabel(copy.activityProfile);
  }

  async function beginTyping(type, ms = 550) {
    setActivityLabel(type);
    setIsTyping(true);
    await delay(ms);
  }

  function handleLanguageChange(nextLanguage) {
    setLanguage(nextLanguage);
    const nextField = pendingField || getNextField(profile);
    setQuickReplies([...(nextField === 'name' ? WELCOME_INTERESTS : []), ...(FIELD_QUICK_REPLIES[nextField] || [])]);
    setMessages((prev) => [
      ...prev,
      createTextMessage('assistant', COPY[nextLanguage].languageNotice),
      ...(nextField ? [createTextMessage('assistant', getQuestion(nextField, nextLanguage, profile))] : []),
    ]);
  }

  async function requestSchemeResults(nextProfile, nextLanguage, preface) {
    const copy = COPY[nextLanguage];
    setIsSubmitting(true);
    setQuickReplies([]);
    if (preface) {
      pushMessage(createTextMessage('assistant', preface));
    }

    await beginTyping('scheme', 700);

    try {
      const response = await fetch(`${API_BASE_URL}/recommend-schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nextProfile,
          age: Number(nextProfile.age),
          monthly_income: Number(nextProfile.monthly_income),
          language: nextLanguage,
        }),
      });
      if (!response.ok) throw new Error('Scheme request failed');
      const data = await response.json();
      const eligibleSchemes = data.eligible_schemes || [];

      if (!eligibleSchemes.length) {
        pushMessage(createTextMessage('assistant', copy.schemeNone));
      } else {
        pushMessage(
          createTextMessage('assistant', copy.schemeLead, {
            type: 'schemes',
            schemes: [eligibleSchemes[0]],
            language: nextLanguage,
          }),
        );
        if (eligibleSchemes.length > 1) {
          await beginTyping('scheme', 420);
          pushMessage(
            createTextMessage('assistant', copy.schemeMore, {
              type: 'schemes',
              schemes: eligibleSchemes.slice(1),
              language: nextLanguage,
            }),
          );
        }
      }

      await delay(180);
      pushMessage(createTextMessage('assistant', copy.askAgain));
      setHasShownResults(true);
      setQuickReplies(WELCOME_INTERESTS);
    } catch {
      pushMessage(createTextMessage('assistant', copy.schemeFallback));
    } finally {
      setIsTyping(false);
      setTypingLabel(copy.typing);
      setIsSubmitting(false);
    }
  }

  async function requestLegalGuidance(question, nextLanguage) {
    const copy = COPY[nextLanguage];
    setIsSubmitting(true);
    if (isSensitiveLegalQuery(question)) {
      pushMessage(createTextMessage('assistant', copy.legalCare));
    }

    await beginTyping('legal', 760);

    try {
      const response = await fetch(`${API_BASE_URL}/legal-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, language: nextLanguage }),
      });
      if (!response.ok) throw new Error('Legal request failed');
      const data = await response.json();

      pushMessage(
        createTextMessage('assistant', data.answer, {
          type: 'legal',
          reference: data.law_reference,
        }),
      );
      await delay(240);
      pushMessage(createTextMessage('assistant', copy.legalAfter));

      if (pendingField) {
        await delay(180);
        pushMessage(createTextMessage('assistant', getQuestion(pendingField, nextLanguage, profile)));
      } else if (!hasShownResults && !getNextField(profile)) {
        await requestSchemeResults(profile, nextLanguage);
      } else {
        setQuickReplies(WELCOME_INTERESTS);
      }
    } catch {
      pushMessage(createTextMessage('assistant', copy.legalFallback));
    } finally {
      setIsTyping(false);
      setTypingLabel(copy.typing);
      setIsSubmitting(false);
    }
  }

  async function handleProfileReply(text) {
    const copy = COPY[language];
    const parsed = parseField(pendingField, text);

    if (parsed === null || Number.isNaN(parsed)) {
      pushMessage(createTextMessage('assistant', invalidMessage(pendingField, language)));
      setRepliesForField(pendingField);
      return;
    }

    const nextProfile = { ...profile, [pendingField]: parsed };
    setProfile(nextProfile);
    setQuickReplies([]);
    pushMessage(createTextMessage('assistant', getAck()));

    if (pendingField === 'age') {
      await delay(120);
      if (parsed < 18) pushMessage(createTextMessage('assistant', copy.minorNote));
      else if (parsed >= 60) pushMessage(createTextMessage('assistant', copy.seniorNote));
    }

    const nextField = getNextField(nextProfile);
    if (nextField) {
      setPendingField(nextField);
      await delay(200);
      pushMessage(createTextMessage('assistant', getQuestion(nextField, language, nextProfile)));
      setRepliesForField(nextField);
      return;
    }

    setPendingField(null);
    await delay(160);
    pushMessage(createTextMessage('assistant', copy.readyForSchemes));
    await requestSchemeResults(nextProfile, language);
  }

  async function handleFreeformMessage(text) {
    const copy = COPY[language];

    if (WELCOME_INTERESTS.includes(text)) {
      pushMessage(createTextMessage('assistant', copy.purposeReply[text]));
      if (pendingField) {
        await delay(180);
        pushMessage(createTextMessage('assistant', getQuestion(pendingField, language, profile)));
        setRepliesForField(pendingField);
      } else {
        setQuickReplies(WELCOME_INTERESTS);
      }
      return;
    }

    const profileUpdate = detectProfileUpdate(text);
    if (profileUpdate) {
      const nextProfile = { ...profile, [profileUpdate.field]: profileUpdate.value };
      setProfile(nextProfile);
      await requestSchemeResults(nextProfile, language, copy.profileRefresh);
      return;
    }

    if (normalizeSimple(text).includes('scheme') || normalizeSimple(text).includes('yojana')) {
      await requestSchemeResults(profile, language);
      return;
    }

    pushMessage(createTextMessage('assistant', copy.askContinue));
    setQuickReplies(WELCOME_INTERESTS);
  }

  async function handleUpload(file) {
    if (!file) return;
    const kind = detectDocumentKind(file.name);
    const fileLabel = COPY[language].documentTypes[kind] || COPY[language].documentTypes.general;
    const nextDoc = {
      id: createId(),
      kind,
      fileName: file.name,
      fileLabel,
      fileSize: formatFileSize(file.size),
    };

    setUploadedDocs((prev) => [...prev, nextDoc]);
    pushMessage(
      createTextMessage('user', file.name, {
        type: 'upload',
        fileName: file.name,
        fileLabel,
        fileSize: nextDoc.fileSize,
      }),
    );

    await beginTyping('profile', 380);
    pushMessage(createTextMessage('assistant', `${COPY[language].documentSaved} ${fileLabel}.`));
    await delay(180);
    pushMessage(createTextMessage('assistant', COPY[language].documentAcknowledge));
    setIsTyping(false);
    setTypingLabel(COPY[language].typing);
    setQuickReplies(WELCOME_INTERESTS);
  }

  function toggleVoiceInput() {
    const copy = COPY[language];
    const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      pushMessage(createTextMessage('assistant', copy.voiceUnsupported));
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    let interim = '';

    recognition.onstart = () => {
      setIsListening(true);
      pushMessage(createTextMessage('assistant', copy.voiceStarted));
    };

    recognition.onresult = (event) => {
      interim = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ');
      setInputText(interim.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
      pushMessage(createTextMessage('assistant', copy.voiceUnsupported));
    };

    recognition.onend = () => {
      setIsListening(false);
      if (interim.trim()) {
        setInputText(interim.trim());
      } else {
        pushMessage(createTextMessage('assistant', copy.voiceStopped));
      }
    };

    recognition.start();
  }

  async function handleSend(nextText) {
    const text = normalizeText(nextText ?? inputText);
    if (!text || isSubmitting) return;

    const fieldForBubble = pendingField;
    setInputText('');
    pushMessage(
      createTextMessage(
        'user',
        fieldForBubble ? formatUserBubble(fieldForBubble, parseField(fieldForBubble, text) ?? text) : text,
      ),
    );

    if (WELCOME_INTERESTS.includes(text)) {
      await handleFreeformMessage(text);
      return;
    }

    if (isLegalQuery(text)) {
      await requestLegalGuidance(text, language);
      return;
    }

    if (pendingField) {
      await handleProfileReply(text);
      return;
    }

    await handleFreeformMessage(text);
  }

  return (
    <div className="app-shell">
      <header className="chat-header">
        <div className="header-main">
          <div className="header-avatar">{getAssistantInitial()}</div>
          <div className="header-copy">
            <h1>{COPY[language].appName}</h1>
            <div className="status-row">
              <span className="online-dot" />
              <span>{COPY[language].onlineNow}</span>
              <span className="status-divider">•</span>
              <span>{COPY[language].assistantStatus}</span>
            </div>
          </div>
        </div>
        <LanguageToggle language={language} onChange={handleLanguageChange} />
      </header>

      <TrustCard language={language} />

      <main className="chat-screen">
        <section className="chat-thread">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              previousSender={messages[index - 1]?.sender}
              profileName={profile.name}
            />
          ))}
          {isTyping ? <TypingIndicator label={typingLabel} /> : null}
          <div ref={endRef} />
        </section>

        {quickReplies.length > 0 ? (
          <div className="quick-strip">
            <div className="quick-label">{COPY[language].suggestionLabel}</div>
            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button key={reply} type="button" className="quick-reply" onClick={() => handleSend(reply)}>
                  {reply}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {uploadedDocs.length > 0 ? (
          <div className="upload-memory">
            {uploadedDocs.slice(-2).map((doc) => (
              <span key={doc.id} className="upload-memory-chip">
                {doc.fileLabel}
              </span>
            ))}
          </div>
        ) : null}

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            handleSend();
          }}
        >
          <button
            type="button"
            className="icon-btn"
            aria-label={COPY[language].attach}
            onClick={() => fileInputRef.current?.click()}
          >
            +
          </button>

          <textarea
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            placeholder={COPY[language].inputPlaceholder}
            rows={1}
          />

          <button
            type="button"
            className={`icon-btn mic ${isListening ? 'active' : ''}`}
            aria-label={isListening ? COPY[language].stopListening : COPY[language].listen}
            onClick={toggleVoiceInput}
            disabled={!listeningSupported && isListening}
          >
            {isListening ? '◉' : '🎤'}
          </button>

          <button type="submit" disabled={isSubmitting} className="send-btn">
            {COPY[language].send}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            className="hidden-input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              handleUpload(file);
              event.target.value = '';
            }}
          />
        </form>
      </main>
    </div>
  );
}

function invalidMessage(field, language) {
  const copy = COPY[language];
  return {
    age: copy.invalidAge,
    gender: copy.invalidGender,
    state: copy.invalidState,
    occupation: copy.invalidOccupation,
    monthly_income: copy.invalidIncome,
  }[field];
}

import { useEffect, useRef, useState } from 'react';
import './App.css';
import LanguageToggle from './components/LanguageToggle';
import SchemeCard from './components/SchemeCard';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const STATE_OPTIONS = [
  { name: 'Andhra Pradesh', aliases: ['ap', 'andhra', 'आंध्र प्रदेश'] },
  { name: 'Arunachal Pradesh', aliases: ['arunachal', 'अरुणाचल प्रदेश'] },
  { name: 'Assam', aliases: ['asam', 'असम'] },
  { name: 'Bihar', aliases: ['बिहार'] },
  { name: 'Chhattisgarh', aliases: ['chatisgarh', 'छत्तीसगढ़'] },
  { name: 'Goa', aliases: ['गोवा'] },
  { name: 'Gujarat', aliases: ['gujrat', 'गुजरात'] },
  { name: 'Haryana', aliases: ['हरियाणा'] },
  { name: 'Himachal Pradesh', aliases: ['himachal', 'हिमाचल प्रदेश'] },
  { name: 'Jharkhand', aliases: ['jharkand', 'झारखंड'] },
  { name: 'Karnataka', aliases: ['कर्नाटक'] },
  { name: 'Kerala', aliases: ['केरल'] },
  { name: 'Madhya Pradesh', aliases: ['mp', 'm p', 'मध्य प्रदेश'] },
  { name: 'Maharashtra', aliases: ['mh', 'महाराष्ट्र'] },
  { name: 'Manipur', aliases: ['मणिपुर'] },
  { name: 'Meghalaya', aliases: ['मेघालय'] },
  { name: 'Mizoram', aliases: ['मिज़ोरम', 'मिजोरम'] },
  { name: 'Nagaland', aliases: ['नागालैंड'] },
  { name: 'Odisha', aliases: ['orissa', 'ओडिशा', 'उड़ीसा'] },
  { name: 'Punjab', aliases: ['पंजाब'] },
  { name: 'Rajasthan', aliases: ['राजस्थान'] },
  { name: 'Sikkim', aliases: ['सिक्किम'] },
  { name: 'Tamil Nadu', aliases: ['tamilnadu', 'तमिलनाडु'] },
  { name: 'Telangana', aliases: ['तेलंगाना'] },
  { name: 'Tripura', aliases: ['त्रिपुरा'] },
  { name: 'Uttar Pradesh', aliases: ['up', 'u p', 'uttarpradesh', 'उत्तर प्रदेश'] },
  { name: 'Uttarakhand', aliases: ['uttrakhand', 'उत्तराखंड'] },
  { name: 'West Bengal', aliases: ['wb', 'westbengal', 'बंगाल', 'पश्चिम बंगाल'] },
  { name: 'Andaman and Nicobar Islands', aliases: ['andaman', 'nicobar', 'अंडमान'] },
  { name: 'Chandigarh', aliases: ['चंडीगढ़', 'chd'] },
  { name: 'Dadra and Nagar Haveli and Daman and Diu', aliases: ['dadra', 'daman', 'diu', 'नगर हवेली'] },
  { name: 'Delhi', aliases: ['delhi ncr', 'नई दिल्ली', 'दिल्ली', 'ncr'] },
  { name: 'Jammu and Kashmir', aliases: ['j&k', 'jk', 'जम्मू कश्मीर', 'जम्मू और कश्मीर'] },
  { name: 'Ladakh', aliases: ['लद्दाख'] },
  { name: 'Lakshadweep', aliases: ['लक्षद्वीप'] },
  { name: 'Puducherry', aliases: ['pondicherry', 'पुडुचेरी', 'पांडिचेरी'] },
];

const QUESTION_FLOW = ['name', 'age', 'gender', 'state', 'occupation', 'monthly_income'];
const WELCOME_TOPICS = ['Pension', 'Health support', 'Education', 'Farming support', 'Housing', 'Employment'];
const WELCOME_CHIPS = {
  en: ['Pension', 'Health support', 'Education', 'Farming support', 'Housing', 'Employment'],
  hi: ['पेंशन', 'स्वास्थ्य मदद', 'पढ़ाई की मदद', 'खेती की मदद', 'आवास मदद', 'रोज़गार मदद'],
};
const FAQ_QUICK_REPLIES = {
  en: ['How do I apply?', 'Documents needed', 'Offline application', 'How much support?'],
  hi: ['आवेदन कैसे करें?', 'कौन से कागज़ लगेंगे?', 'ऑफलाइन आवेदन होगा?', 'कितनी मदद मिलेगी?'],
};
const SCHEME_FAQ_KEYWORDS = {
  apply: ['apply', 'application', 'kaise apply', 'kaise kare', 'आवेदन', 'apply kaise', 'कैसे apply'],
  documents: ['documents', 'document', 'aadhaar', 'income proof', 'कागज़', 'दस्तावेज़', 'proof'],
  money: ['money', 'kitna', 'amount', 'benefit', 'paisa', 'कितना', 'पैसा', 'रकम'],
  office: ['office', 'where', 'kahan', 'center', 'branch', 'कार्यालय', 'कहाँ'],
  eligibility: ['eligible', 'definitely', 'sure', 'pakka', 'योग्य', 'eligible hu', 'पक्का'],
  offline: ['offline', 'online', 'counter', 'csc', 'bank', 'ऑफलाइन', 'ऑनलाइन'],
};
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
  'पति',
  'मारता',
  'मारपीट',
  'पुलिस',
  'एफआईआर',
  'कानून',
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
  'पति',
  'मारता',
  'मार',
  'हिंसा',
];

const OCCUPATION_GROUPS = [
  { canonical: 'Farmer', aliases: ['farmer', 'kisan', 'kisaan', 'agriculture', 'krishi', 'किसान', 'खेती'] },
  { canonical: 'Student', aliases: ['student', 'vidyarthi', 'school', 'college', 'padhai', 'छात्र', 'विद्यार्थी'] },
  { canonical: 'Unemployed', aliases: ['unemployed', 'jobless', 'berozgar', 'job nahi', 'kaam nahi', 'no job', 'बेरोजगार', 'काम नहीं'] },
  { canonical: 'Labour', aliases: ['labour', 'labor', 'labourer', 'mazdoor', 'worker', 'construction worker', 'construction', 'daily wage worker', 'rajmistri', 'helper', 'मजदूर', 'दिहाड़ी'] },
  { canonical: 'Unorganised', aliases: ['unorganised', 'unorganized', 'daily wage', 'thela', 'rehdi', 'informal worker', 'street vendor', 'ठेला', 'रेहड़ी'] },
  { canonical: 'Self-Employed', aliases: ['self-employed', 'self employed', 'freelancer', 'electrician', 'plumber', 'tailor', 'mechanic', 'artisan', 'weaver', 'fisherman', 'delivery worker', 'mistri', 'बिजली मिस्त्री', 'प्लंबर', 'दर्जी', 'मछुआरा'] },
  { canonical: 'Business', aliases: ['business', 'small business', 'shopkeeper', 'dukandaar', 'vendor', 'store', 'shop', 'व्यापार', 'दुकानदार'] },
  { canonical: 'Entrepreneur', aliases: ['entrepreneur', 'startup', 'business owner'] },
  { canonical: 'Homemaker', aliases: ['homemaker', 'housewife', 'grihini', 'ghar sambhalti', 'ghar sambhalta', 'widow', 'vidhwa', 'गृहिणी', 'विधवा'] },
  { canonical: 'Private Sector', aliases: ['private', 'private employee', 'company', 'teacher', 'driver', 'nurse', 'security guard', 'cleaner', 'factory worker', 'private sector', 'delivery boy', 'guard', 'teacher hu', 'driver hu', 'शिक्षक', 'ड्राइवर', 'नर्स', 'सफाई'] },
  { canonical: 'Government Employee', aliases: ['government', 'govt', 'sarkari', 'anganwadi worker', 'asha worker', 'gov employee', 'सरकारी', 'आंगनवाड़ी', 'आशा worker'] },
  { canonical: 'Private Sector', aliases: ['retired', 'disabled', 'divyang', 'care worker', 'domestic worker', 'रिटायर्ड', 'दिव्यांग', 'घरेलू कामगार'] },
];

const FIELD_QUICK_REPLIES = {
  name: ['Rahul Kumar', 'Rekha Devi', 'Asha Kumari'],
  age: ['16', '24', '35', '60'],
  gender: ['Female', 'Male', 'Other'],
  state: ['Bihar', 'Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Delhi', 'West Bengal'],
  occupation: ['Farmer', 'Teacher', 'Driver', 'Shopkeeper', 'Student', 'Homemaker', 'Labourer', 'Government Employee'],
  monthly_income: ['5000', '9000', '15000', '25000'],
};

const ACK_OPENERS_EN = ['Understood', 'Got it', 'Thanks for sharing', 'I have noted that', 'That helps', 'Okay', 'All right', 'Thanks', 'I understand', 'Noted'];
const ACK_MIDDLES_EN = ['clearly', 'for me', 'for now', 'on my side', 'with your details', 'for this check', 'for your profile', 'for the next step', 'for your support search', 'for this conversation'];
const ACK_CLOSERS_EN = ['let us continue', 'we can move ahead', 'I will use that', 'that is useful', 'I can work with that', 'I will keep that in mind', 'that gives me better context', 'I can guide you better now', 'we are on the right track', 'I will check support accordingly'];

const ACK_OPENERS_HI = ['समझ गया', 'ठीक है', 'जानकारी मिल गई', 'मैंने नोट कर लिया', 'अच्छा', 'ठीक समझा', 'धन्यवाद', 'यह मददगार है', 'बात समझ में आ गई', 'यह काम आएगा'];
const ACK_MIDDLES_HI = ['अभी के लिए', 'आपकी जानकारी के साथ', 'अगले कदम के लिए', 'योजना देखने में', 'आपकी स्थिति समझने में', 'आगे की मदद के लिए', 'इस बातचीत में', 'आपके प्रोफाइल के लिए', 'अभी की जांच में', 'इस मदद के लिए'];
const ACK_CLOSERS_HI = ['अब आगे बढ़ते हैं', 'मैं इसी आधार पर देखता हूँ', 'इससे मदद मिलेगी', 'अब मैं बेहतर तरीके से देख सकता हूँ', 'अब अगला सवाल लेते हैं', 'अब मैं मदद मिलान करूँगा', 'अब बात और साफ हो गई', 'इससे सही दिशा मिलेगी', 'अब आगे आसान रहेगा', 'इससे मैं बेहतर सुझाव दे पाऊँगा'];

const TRANSITION_OPENERS_EN = ['Let me', 'I will', 'I am going to', 'Next I will', 'From here I can', 'Now I will', 'At this point I will', 'For the next step I will', 'With this in mind I will', 'Based on that I will'];
const TRANSITION_MIDDLES_EN = ['look at support options', 'check matching schemes', 'review likely benefits', 'see what may fit you', 'check suitable help', 'review your details', 'look at possible support', 'search for relevant schemes', 'check what stands out', 'review what matters most'];
const TRANSITION_CLOSERS_EN = ['for your situation', 'using these details', 'step by step', 'carefully', 'with your profile', 'for you', 'in a practical way', 'without making it complicated', 'in simple terms', 'based on what you shared'];

const TRANSITION_OPENERS_HI = ['अब मैं', 'चलिये मैं', 'अगले कदम में मैं', 'अब आगे मैं', 'आपकी बातों के आधार पर मैं', 'इस जानकारी के साथ मैं', 'अब मैं ध्यान से', 'अब यहीं से मैं', 'अब मैं धीरे-धीरे', 'ठीक है, अब मैं'];
const TRANSITION_MIDDLES_HI = ['योजनाएँ देखता हूँ', 'मिलती-जुलती मदद देखता हूँ', 'आपके लिए उपयुक्त विकल्प देखता हूँ', 'संभावित सहायता देखता हूँ', 'आपकी जानकारी मिलान करता हूँ', 'कौन-सी योजना काम आएगी यह देखता हूँ', 'सही मदद ढूँढता हूँ', 'आपके लिए विकल्प चुनता हूँ', 'जांच करता हूँ', 'फायदे वाली योजनाएँ देखता हूँ'];
const TRANSITION_CLOSERS_HI = ['आपकी स्थिति के हिसाब से', 'धीरे-धीरे', 'साफ तरीके से', 'बिना उलझन के', 'आपकी दी हुई जानकारी के आधार पर', 'एक-एक करके', 'आसान भाषा में', 'जितना हो सके उतना साफ', 'ध्यान से', 'आपके काम की चीज़ें देखते हुए'];

const COPY = {
  en: {
    appName: 'JanAdhikar Saathi',
    assistantStatus: 'Helping citizens find government support',
    onlineNow: 'Online now',
    trustChips: ['Works offline', 'Private local processing', 'Helpful for rural families'],
    intro:
      'Namaste. I am JanAdhikar Saathi. I can help you check government schemes and simple legal support in a calm, practical way.',
    warmPrompt:
      'You can tell me what kind of help you need, or I can ask a few easy questions and guide you step by step.',
    askName: 'What should I call you?',
    askAge: 'How old are you?',
    askGender: 'Please tell me your gender.',
    askState: 'Which state or union territory do you live in?',
    askOccupation:
      'What kind of work do you do? You can say farmer, teacher, driver, shopkeeper, homemaker, labourer, student, or something close.',
    askIncome: 'About how much do you earn in a month? You can just send the amount, like 5000 or 12000.',
    invalidAge: 'Please send your age as a number between 1 and 100, like 16, 24, or 60.',
    invalidGender: 'Please reply with Female, Male, or Other.',
    invalidState: 'Please send a valid Indian state or union territory name.',
    invalidOccupation:
      'Please tell me your work type, like farmer, teacher, driver, labourer, homemaker, shopkeeper, or student.',
    invalidIncome: 'Please send monthly income in digits, like 5000, 12000, or 25000.',
    inputPlaceholder: 'Type a message',
    send: 'Send',
    listen: 'Speak',
    stopListening: 'Listening',
    attach: 'Upload',
    voiceUnsupported: 'Voice input is not supported in this browser.',
    voiceHeard: 'I heard you say',
    voiceReady: 'Listening now. Speak in Hindi, English, or Hinglish.',
    languageNotice: 'Language updated. You can reply in English, Hindi, or Hinglish.',
    typing: 'Saathi is typing...',
    activityScheme: 'Reviewing possible schemes...',
    activityLegal: 'Looking at legal guidance...',
    activityProfile: 'Understanding your situation...',
    legalCare: 'I am sorry you may be dealing with this. Your safety matters, and I will try to guide you gently.',
    legalFallback: 'I could not get legal guidance just now. Please try once more.',
    schemeFallback: 'I could not check schemes just now. Please try again in a moment.',
    askAgain:
      'You can ask another legal question, update your income or work, or upload a helpful document if you want.',
    readyForSchemes: 'I have enough details now. Let me check what support may fit you.',
    schemeLead: 'This looks most relevant for you right now.',
    schemeMore: 'You may also benefit from these options.',
    schemeNone:
      'I do not see a strong scheme match yet. If you update your income, work, age, or state, I will check again.',
    profileRefresh: 'I am checking again with that update.',
    legalAfter: 'I can also help you check relevant schemes in the same chat if you want.',
    askContinue:
      'You can also say things like “pension chahiye”, “farmer hu”, “no job”, “widow hu”, or “ghar nahi hai”.',
    faqPrompt:
      'If you want, I can also explain how to apply, what documents are needed, whether offline application is possible, or how much support this scheme may offer.',
    stateFollowUp:
      'If typing the full name is easier, that works too. I can understand most common state names and abbreviations.',
    farmerFollowUp:
      'Do you want me to keep farming support in special focus, especially land-linked or crop-related help?',
    seniorFollowUp:
      'Would you like me to focus on pension and older-person support first?',
    housingFollowUp:
      'If housing is a concern, I can keep home and shelter support in mind while checking schemes.',
    faqAnswers: {
      apply: (scheme) =>
        `For ${scheme.name}, the safest next step is to use the official portal or ask at the local office or help center mentioned in the card. If you want, I can guide you scheme by scheme.`,
      documents: (scheme) =>
        `For ${scheme.name}, the usual documents are identity proof plus the scheme-specific papers shown in the card. If income proof is missing, it is still worth asking the local office what alternatives they accept.`,
      money: (scheme, details) =>
        `${scheme.name} mainly helps through this benefit: ${details.benefit}`,
      office: (scheme) =>
        `For ${scheme.name}, the local office depends on the scheme type. It is usually the block office, panchayat office, bank, post office, hospital help desk, or department portal listed on the official link.`,
      eligibility: () =>
        `I can only estimate likely eligibility from the information you shared. Final approval always depends on the official rules and documents checked by the scheme authority.`,
      offline: (scheme) =>
        `For ${scheme.name}, many people still apply through a local office, bank, panchayat, CSC center, school, or help desk even when an official website also exists.`,
    },
    minorNote: 'I will keep child and student-related support in mind too.',
    seniorNote: 'I will keep senior citizen support in mind too.',
    documentPrompt:
      'If it helps, you can upload a photo or PDF of Aadhaar, ration card, income certificate, disability certificate, or pension paper.',
    documentSaved: 'I received your document.',
    documentAcknowledge:
      'I cannot fully read every document automatically in this demo, but I can remember what you uploaded and use it as helpful context.',
    stateHelp: 'You can type your state name, or tap one of these suggestions.',
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
    suggestionLabel: 'Quick options',
  },
  hi: {
    appName: 'जनअधिकार साथी',
    assistantStatus: 'सरकारी मदद ढूँढने में साथ',
    onlineNow: 'अभी उपलब्ध',
    trustChips: ['ऑफलाइन चलता है', 'जानकारी लोकल रहती है', 'गाँव और कस्बों के लिए उपयोगी'],
    intro:
      'नमस्ते। मैं जनअधिकार साथी हूँ। मैं आपको सरकारी योजनाएँ समझने और आसान भाषा में कानूनी मदद बताने के लिए यहाँ हूँ।',
    warmPrompt:
      'आप चाहें तो सीधे अपनी ज़रूरत लिख सकते हैं, या मैं कुछ आसान सवाल पूछकर आपको धीरे-धीरे गाइड कर दूँगा।',
    askName: 'मैं आपको किस नाम से बुलाऊँ?',
    askAge: 'आपकी उम्र कितनी है?',
    askGender: 'कृपया अपना लिंग बताइए।',
    askState: 'आप किस राज्य या केंद्र शासित प्रदेश में रहते हैं?',
    askOccupation:
      'आप क्या काम करते हैं? जैसे किसान, शिक्षक, ड्राइवर, दुकानदार, गृहिणी, मजदूर, छात्र या इससे मिलता-जुलता कुछ।',
    askIncome: 'लगभग महीने में कितनी कमाई हो जाती है? सिर्फ amount लिख दीजिए, जैसे 5000 या 12000।',
    invalidAge: 'कृपया उम्र 1 से 100 के बीच नंबर में भेजें, जैसे 16, 24, या 60।',
    invalidGender: 'कृपया Female, Male, या Other में से जवाब दें।',
    invalidState: 'कृपया सही भारतीय राज्य या केंद्र शासित प्रदेश का नाम भेजें।',
    invalidOccupation:
      'कृपया अपना काम बताइए, जैसे किसान, शिक्षक, ड्राइवर, मजदूर, गृहिणी, दुकानदार, या छात्र।',
    invalidIncome: 'कृपया महीने की कमाई digits में भेजें, जैसे 5000, 12000, या 25000।',
    inputPlaceholder: 'संदेश लिखें',
    send: 'भेजें',
    listen: 'बोलें',
    stopListening: 'सुन रहा हूँ',
    attach: 'अपलोड',
    voiceUnsupported: 'इस browser में voice input support नहीं है.',
    voiceHeard: 'मैंने सुना',
    voiceReady: 'अब मैं सुन रहा हूँ। आप हिंदी, English, या Hinglish में आराम से बोलिए।',
    languageNotice: 'भाषा बदल गई है। आप हिंदी या Hinglish में आराम से जवाब दे सकते हैं।',
    typing: 'साथी लिख रहा है...',
    activityScheme: 'संभावित योजनाएँ देख रहा हूँ...',
    activityLegal: 'कानूनी मदद देख रहा हूँ...',
    activityProfile: 'आपकी स्थिति समझ रहा हूँ...',
    legalCare: 'मुझे दुख है कि आपको यह झेलना पड़ रहा है। आपकी सुरक्षा और मदद सबसे ज़रूरी है।',
    legalFallback: 'अभी कानूनी जवाब नहीं मिल पाया। एक बार फिर कोशिश कीजिए।',
    schemeFallback: 'अभी योजनाएँ नहीं देख पाया। कृपया थोड़ी देर में फिर कोशिश करें।',
    askAgain:
      'आप चाहें तो कोई और कानूनी सवाल पूछ सकते हैं, income या काम अपडेट कर सकते हैं, या कोई ज़रूरी document भी भेज सकते हैं।',
    readyForSchemes: 'अब मेरे पास इतनी जानकारी है कि मैं आपके लिए मदद देख सकूँ।',
    schemeLead: 'अभी के हिसाब से यह योजना सबसे ज़्यादा काम की लगती है।',
    schemeMore: 'इसके अलावा ये विकल्प भी आपके काम आ सकते हैं।',
    schemeNone:
      'अभी कोई बहुत साफ योजना match नहीं दिख रही। अगर आप income, काम, उम्र, या राज्य थोड़ा और साफ बताएँ, तो मैं फिर देखता हूँ।',
    profileRefresh: 'इस नई जानकारी के साथ मैं फिर से देखता हूँ।',
    legalAfter: 'अगर चाहें तो इसी चैट में मैं आपके लिए योजनाएँ भी देख सकता हूँ।',
    askContinue:
      'आप ऐसे भी लिख सकते हैं: “मुझे पेंशन चाहिए”, “मैं किसान हूँ”, “मेरे पास काम नहीं है”, “मैं विधवा हूँ”, या “घर नहीं है”.',
    faqPrompt:
      'अगर चाहें तो मैं यह भी बता सकता हूँ कि आवेदन कैसे करना है, कौन-कौन से कागज़ लग सकते हैं, ऑफलाइन आवेदन हो सकता है या नहीं, और योजना से क्या मदद मिलेगी।',
    stateFollowUp:
      'अगर पूरा नाम लिखना आसान हो, तो वह भी ठीक है। मैं ज़्यादातर आम state names और short forms समझ लेता हूँ।',
    farmerFollowUp:
      'क्या आप चाहते हैं कि मैं खेती से जुड़ी मदद, जैसे जमीन या फसल से जुड़ी योजनाएँ, खास तौर पर ध्यान में रखूँ?',
    seniorFollowUp:
      'क्या मैं pension और बुज़ुर्गों वाली मदद को पहले ध्यान में रखूँ?',
    housingFollowUp:
      'अगर घर की चिंता है, तो मैं आवास और shelter वाली मदद को भी ध्यान में रखूँगा।',
    faqAnswers: {
      apply: (scheme) =>
        `${scheme.name} के लिए सबसे सुरक्षित अगला कदम यही है कि आप official link देखें या card में बताए गए local office या help center से बात करें। चाहें तो मैं एक-एक scheme समझा सकता हूँ।`,
      documents: (scheme) =>
        `${scheme.name} में आम तौर पर पहचान पत्र और card में दिखाए गए scheme-specific कागज़ काम आते हैं। अगर income proof नहीं है, तब भी local office से alternative documents पूछना ठीक रहेगा।`,
      money: (scheme, details) =>
        `${scheme.name} में मुख्य मदद यह है: ${details.benefit}`,
      office: (scheme) =>
        `${scheme.name} के लिए local office scheme पर निर्भर करता है। अक्सर block office, panchayat, bank, post office, hospital help desk, या department portal काम आता है।`,
      eligibility: () =>
        `मैं आपकी दी हुई जानकारी के आधार पर सिर्फ संभावना बता सकता हूँ। अंतिम eligibility official rules और documents देखकर ही तय होती है।`,
      offline: (scheme) =>
        `${scheme.name} में कई जगह online link होने के बाद भी local office, bank, panchayat, CSC center, school, या help desk से काम हो जाता है।`,
    },
    minorNote: 'मैं बच्चों और पढ़ाई से जुड़ी मदद भी ध्यान में रखूँगा।',
    seniorNote: 'मैं बुज़ुर्गों वाली मदद भी ध्यान में रखूँगा।',
    documentPrompt:
      'अगर आपके पास हो, तो आप Aadhaar, ration card, income certificate, disability certificate, या pension paper की photo या PDF भी भेज सकते हैं।',
    documentSaved: 'मुझे आपका document मिल गया।',
    documentAcknowledge:
      'इस demo में मैं हर document को पूरा पढ़ नहीं पाता, लेकिन आपने जो भेजा है उसे याद रखकर बेहतर guidance दे सकता हूँ।',
    stateHelp: 'आप अपना राज्य लिख सकते हैं, या नीचे दिए गए सुझावों में से चुन सकते हैं।',
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
    suggestionLabel: 'जल्दी विकल्प',
  },
};

function buildVariants(openers, middles, closers) {
  const result = [];
  for (const opener of openers) {
    for (const middle of middles) {
      for (const closer of closers) {
        result.push(`${opener} ${middle}, ${closer}.`);
      }
    }
  }
  return result;
}

const ACK_VARIANTS = {
  en: buildVariants(ACK_OPENERS_EN, ACK_MIDDLES_EN, ACK_CLOSERS_EN),
  hi: buildVariants(ACK_OPENERS_HI, ACK_MIDDLES_HI, ACK_CLOSERS_HI),
};

const TRANSITION_VARIANTS = {
  en: buildVariants(TRANSITION_OPENERS_EN, TRANSITION_MIDDLES_EN, TRANSITION_CLOSERS_EN),
  hi: buildVariants(TRANSITION_OPENERS_HI, TRANSITION_MIDDLES_HI, TRANSITION_CLOSERS_HI),
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
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
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

function normalizeForSearch(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectDocumentKind(fileName = '') {
  const normalized = normalizeForSearch(fileName);
  return DOCUMENT_TYPES.find((type) => normalized.includes(type)) || 'general';
}

function parseIncome(text) {
  const normalized = normalizeForSearch(text).replace(/,/g, ' ');
  const lakhMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(lakh|lac|lakhs|lacs)/);
  if (lakhMatch) return Math.round(Number.parseFloat(lakhMatch[1]) * 100000);
  const plain = normalized.match(/(\d{3,7})/);
  return plain ? Number.parseInt(plain[1], 10) : null;
}

function matchState(text) {
  const normalized = normalizeForSearch(text);
  return (
    STATE_OPTIONS.find((state) => normalizeForSearch(state.name) === normalized) ||
    STATE_OPTIONS.find((state) =>
      [state.name, ...state.aliases].some((alias) => {
        const normAlias = normalizeForSearch(alias);
        return normAlias === normalized || normalized.includes(normAlias) || normAlias.includes(normalized);
      }),
    ) ||
    null
  );
}

function findStateSuggestions(text) {
  const normalized = normalizeForSearch(text);
  if (!normalized) return FIELD_QUICK_REPLIES.state;
  return STATE_OPTIONS.filter((state) =>
    [state.name, ...state.aliases].some((alias) => normalizeForSearch(alias).includes(normalized)),
  )
    .slice(0, 6)
    .map((state) => state.name);
}

function matchOccupation(text) {
  const normalized = normalizeForSearch(text)
    .replace(/\bhu\b/g, '')
    .replace(/\bhun\b/g, '')
    .replace(/\bkaam\b/g, '')
    .replace(/\bjob\b/g, '')
    .trim();

  return (
    OCCUPATION_GROUPS.find((group) => group.aliases.some((alias) => normalized.includes(normalizeForSearch(alias)))) ||
    null
  )?.canonical;
}

function matchGender(text) {
  const normalized = normalizeForSearch(text);
  if (['female', 'mahila', 'woman', 'ladki', 'महिला', 'स्त्री'].some((value) => normalized.includes(normalizeForSearch(value)))) return 'female';
  if (['male', 'purush', 'man', 'ladka', 'पुरुष'].some((value) => normalized.includes(normalizeForSearch(value)))) return 'male';
  if (['other', 'trans', 'non binary', 'non-binary', 'अन्य'].some((value) => normalized.includes(normalizeForSearch(value)))) return 'other';
  return null;
}

function parseField(field, text) {
  const raw = String(text || '').trim();
  if (!raw) return null;

  if (field === 'name') {
    const cleaned = raw
      .replace(/^(my name is|mera naam|मेरा नाम|main|mai|मैं|i am|i'm)\s+/i, '')
      .replace(/\b(hai|है|hu|hun|हूं|हूँ)\b/gi, '')
      .trim();
    return cleaned ? titleCase(cleaned) : null;
  }

  if (field === 'age') {
    const match = raw.match(/(\d{1,3})/);
    if (!match) return null;
    const age = Number.parseInt(match[1], 10);
    return age >= 1 && age <= 100 ? age : null;
  }

  if (field === 'gender') return matchGender(raw);
  if (field === 'state') return matchState(raw)?.name || null;
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
  const normalized = normalizeForSearch(text);
  return LEGAL_KEYWORDS.some((keyword) => normalized.includes(normalizeForSearch(keyword)));
}

function isSensitiveLegalQuery(text) {
  const normalized = normalizeForSearch(text);
  return SENSITIVE_LEGAL_KEYWORDS.some((keyword) => normalized.includes(normalizeForSearch(keyword)));
}

function detectProfileUpdate(text) {
  const normalized = normalizeForSearch(text);
  if (['income', 'aay', 'kamai', 'कमाई', 'आय'].some((item) => normalized.includes(normalizeForSearch(item)))) {
    const income = parseIncome(text);
    return income ? { field: 'monthly_income', value: income } : null;
  }
  if (['age', 'umar', 'उम्र'].some((item) => normalized.includes(normalizeForSearch(item)))) {
    const age = parseField('age', text);
    return age ? { field: 'age', value: age } : null;
  }
  if (['state', 'rajya', 'राज्य'].some((item) => normalized.includes(normalizeForSearch(item))) || matchState(text)) {
    const state = matchState(text);
    return state ? { field: 'state', value: state.name } : null;
  }
  if (['occupation', 'work', 'काम', 'hu', 'हूं', 'हूँ'].some((item) => normalized.includes(normalizeForSearch(item))) || matchOccupation(text)) {
    const occupation = matchOccupation(text);
    return occupation ? { field: 'occupation', value: occupation } : null;
  }
  const gender = matchGender(text);
  if (gender) return { field: 'gender', value: gender };
  return null;
}

function titleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function formatUserBubble(field, value) {
  if (field === 'monthly_income') return `₹${Number(value).toLocaleString('en-IN')}`;
  if (field === 'gender') return titleCase(String(value));
  return String(value);
}

function formatFileSize(size) {
  if (!size) return '';
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function TypingIndicator({ label }) {
  return (
    <div className="message-row assistant">
      <div className="avatar assistant">JS</div>
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
      <div className="upload-icon">DOC</div>
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

function AssistantBadge({ large = false }) {
  return (
    <span className={`assistant-badge ${large ? 'large' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="assistant-mark">
        <circle cx="12" cy="9" r="4" />
        <path d="M5 20c1.8-3.7 4.4-5.5 7-5.5s5.2 1.8 7 5.5" />
      </svg>
    </span>
  );
}

function MessageBubble({ message, previousSender, profileName }) {
  const isUser = message.sender === 'user';
  const grouped = previousSender === message.sender;
  const userInitial = (profileName || 'U').trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'} ${grouped ? 'grouped' : ''}`}>
      {!grouped ? (
        <div className={`avatar ${isUser ? 'user' : 'assistant'}`}>
          {isUser ? userInitial : <AssistantBadge />}
        </div>
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
        ) : message.type === 'upload' ? (
          <UploadBubble message={message} />
        ) : message.type === 'legal' ? (
          <>
            <p className="message-text">{message.text}</p>
            {message.reference ? <div className="law-reference">{message.reference}</div> : null}
          </>
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

function getLocalizedQuickReplies(language, type) {
  if (type === 'faq') return FAQ_QUICK_REPLIES[language];
  if (type === 'welcome') return WELCOME_CHIPS[language];
  return [];
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
  const [quickReplies, setQuickReplies] = useState([...WELCOME_CHIPS.en, ...FIELD_QUICK_REPLIES.name]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingLabel, setTypingLabel] = useState(COPY.en.typing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasShownResults, setHasShownResults] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [lastShownSchemes, setLastShownSchemes] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [listeningSupported] = useState(() =>
    Boolean(globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition),
  );
  const [listeningTranscript, setListeningTranscript] = useState('');
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const patternIndexRef = useRef({ ack: 0, transition: 0 });
  const lastAutoVoiceRef = useRef('');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, quickReplies, isListening, listeningTranscript]);

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
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (
        last &&
        last.sender === message.sender &&
        last.type === message.type &&
        last.text === message.text
      ) {
        return prev;
      }
      return [...prev, message];
    });
  }

  function nextPattern(kind) {
    const pool = kind === 'ack' ? ACK_VARIANTS[language] : TRANSITION_VARIANTS[language];
    const index = patternIndexRef.current[kind] % pool.length;
    patternIndexRef.current[kind] += 1;
    return pool[index];
  }

  function setRepliesForField(field, basis = '') {
    if (field === 'state') {
      const suggestions = findStateSuggestions(basis);
      setQuickReplies(suggestions.length ? suggestions : FIELD_QUICK_REPLIES.state);
      return;
    }
    setQuickReplies([...(field === 'name' ? WELCOME_CHIPS[language] : []), ...(FIELD_QUICK_REPLIES[field] || [])]);
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
    setRepliesForField(nextField || 'name');
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

    if (preface) pushMessage(createTextMessage('assistant', preface));
    else pushMessage(createTextMessage('assistant', nextPattern('transition')));

    await beginTyping('scheme', 720);

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
      const schemes = data.eligible_schemes || [];

      if (!schemes.length) {
        pushMessage(createTextMessage('assistant', copy.schemeNone));
      } else {
        setLastShownSchemes(schemes);
        pushMessage(
          createTextMessage('assistant', copy.schemeLead, {
            type: 'schemes',
            schemes: [schemes[0]],
            language: nextLanguage,
          }),
        );
        if (schemes.length > 1) {
          await beginTyping('scheme', 420);
          pushMessage(
            createTextMessage('assistant', copy.schemeMore, {
              type: 'schemes',
              schemes: schemes.slice(1),
              language: nextLanguage,
            }),
          );
        }
      }

      await delay(180);
      pushMessage(createTextMessage('assistant', copy.askAgain));
      if (schemes.length) {
        await delay(150);
        pushMessage(createTextMessage('assistant', copy.faqPrompt));
      }
      setHasShownResults(true);
      setQuickReplies(getLocalizedQuickReplies(nextLanguage, 'faq'));
    } catch {
      pushMessage(createTextMessage('assistant', copy.schemeFallback));
    } finally {
      setIsTyping(false);
      setTypingLabel(copy.typing);
      setIsSubmitting(false);
    }
  }

  async function requestLegalGuidance(question, nextLanguage, options = {}) {
    const copy = COPY[nextLanguage];
    setIsSubmitting(true);

    if (options.source === 'voice') {
      pushMessage(
        createTextMessage(
          'assistant',
          nextLanguage === 'hi'
            ? `${copy.voiceHeard}: “${question}”.`
            : `${copy.voiceHeard}: "${question}".`,
        ),
      );
    }

    if (isSensitiveLegalQuery(question)) {
      pushMessage(createTextMessage('assistant', copy.legalCare));
    }

    await beginTyping('legal', 780);

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
        setRepliesForField(pendingField);
      } else if (!hasShownResults && !getNextField(profile)) {
        await requestSchemeResults(profile, nextLanguage);
      } else {
        setQuickReplies(getLocalizedQuickReplies(nextLanguage, 'welcome'));
      }
    } catch {
      pushMessage(createTextMessage('assistant', copy.legalFallback));
    } finally {
      setIsTyping(false);
      setTypingLabel(copy.typing);
      setIsSubmitting(false);
    }
  }

  async function handleProfileReply(text, options = {}) {
    const copy = COPY[language];
    const parsed = parseField(pendingField, text);

    if (parsed === null || Number.isNaN(parsed)) {
      pushMessage(createTextMessage('assistant', invalidMessage(pendingField, language)));
      if (pendingField === 'state') {
        pushMessage(createTextMessage('assistant', copy.stateHelp));
      }
      setRepliesForField(pendingField, text);
      return;
    }

    const nextProfile = { ...profile, [pendingField]: parsed };
    setProfile(nextProfile);
    setQuickReplies([]);

    if (options.source === 'voice') {
      pushMessage(
        createTextMessage(
          'assistant',
          language === 'hi'
            ? `${copy.voiceHeard}: “${formatUserBubble(pendingField, parsed)}”.`
            : `${copy.voiceHeard}: "${formatUserBubble(pendingField, parsed)}".`,
        ),
      );
    }

    pushMessage(createTextMessage('assistant', nextPattern('ack')));

    if (pendingField === 'age') {
      await delay(120);
      if (parsed < 18) pushMessage(createTextMessage('assistant', copy.minorNote));
      else if (parsed >= 60) {
        pushMessage(createTextMessage('assistant', copy.seniorNote));
        await delay(120);
        pushMessage(createTextMessage('assistant', copy.seniorFollowUp));
      }
    }

    if (pendingField === 'occupation' && parsed === 'Farmer') {
      await delay(120);
      pushMessage(createTextMessage('assistant', copy.farmerFollowUp));
    }

    const nextField = getNextField(nextProfile);
    if (nextField) {
      setPendingField(nextField);
      await delay(220);
      pushMessage(createTextMessage('assistant', getQuestion(nextField, language, nextProfile)));
      if (nextField === 'state') {
        await delay(120);
        pushMessage(createTextMessage('assistant', copy.stateHelp));
      }
      setRepliesForField(nextField);
      return;
    }

    setPendingField(null);
    await delay(160);
    pushMessage(createTextMessage('assistant', copy.readyForSchemes));
    await requestSchemeResults(nextProfile, language);
  }

  async function handleFreeformMessage(text, options = {}) {
    const copy = COPY[language];
    const normalized = normalizeForSearch(text);

    if (lastShownSchemes.length > 0) {
      const primaryScheme = lastShownSchemes[0];
      const details = primaryScheme
        ? {
            benefit:
              primaryScheme.description ||
              (language === 'hi'
                ? 'यह योजना आपकी परिस्थिति के हिसाब से मदद दे सकती है।'
                : 'This scheme may support your current situation.'),
          }
        : null;

      for (const [faqKey, keywords] of Object.entries(SCHEME_FAQ_KEYWORDS)) {
        if (keywords.some((keyword) => normalized.includes(normalizeForSearch(keyword)))) {
          const answer = copy.faqAnswers[faqKey]?.(primaryScheme, details);
          if (answer) {
            pushMessage(createTextMessage('assistant', answer));
            await delay(140);
            pushMessage(createTextMessage('assistant', copy.askAgain));
            setQuickReplies(getLocalizedQuickReplies(language, 'faq'));
            return;
          }
        }
      }
    }

    const topicIndex = WELCOME_CHIPS[language].indexOf(text);
    if (topicIndex >= 0) {
      const canonicalTopic = WELCOME_TOPICS[topicIndex];
      pushMessage(createTextMessage('assistant', copy.purposeReply[canonicalTopic]));
      if (pendingField) {
        await delay(180);
        pushMessage(createTextMessage('assistant', getQuestion(pendingField, language, profile)));
        setRepliesForField(pendingField);
      } else {
        setQuickReplies(getLocalizedQuickReplies(language, 'welcome'));
      }
      return;
    }

    const profileUpdate = detectProfileUpdate(text);
    if (profileUpdate) {
      const nextProfile = { ...profile, [profileUpdate.field]: profileUpdate.value };
      setProfile(nextProfile);
      if (options.source === 'voice') {
        pushMessage(
          createTextMessage(
            'assistant',
            language === 'hi'
              ? `${copy.voiceHeard}: “${text}”.`
              : `${copy.voiceHeard}: "${text}".`,
          ),
        );
      }
      await requestSchemeResults(nextProfile, language, copy.profileRefresh);
      return;
    }

    if (
      ['housing', 'ghar', 'house', 'घर नहीं', 'घर'].some((keyword) =>
        normalized.includes(normalizeForSearch(keyword)),
      )
    ) {
      pushMessage(createTextMessage('assistant', copy.purposeReply.Housing));
      await delay(140);
      pushMessage(createTextMessage('assistant', copy.housingFollowUp));
      await requestSchemeResults(profile, language);
      return;
    }

    if (
      ['pension', 'पेंशन', 'widow', 'vidhwa', 'विधवा'].some((keyword) =>
        normalized.includes(normalizeForSearch(keyword)),
      )
    ) {
      pushMessage(createTextMessage('assistant', copy.purposeReply.Pension));
      await requestSchemeResults(profile, language);
      return;
    }

    if (normalized.includes('scheme') || normalized.includes('yojana')) {
      await requestSchemeResults(profile, language);
      return;
    }

    pushMessage(createTextMessage('assistant', copy.askContinue));
    setQuickReplies(getLocalizedQuickReplies(language, 'welcome'));
  }

  async function handleUpload(file) {
    if (!file) return;
    const kind = detectDocumentKind(file.name);
    const fileLabel = COPY[language].documentTypes[kind] || COPY[language].documentTypes.general;
    const item = {
      id: createId(),
      fileName: file.name,
      fileLabel,
      fileSize: formatFileSize(file.size),
    };

    setUploadedDocs((prev) => [...prev, item]);
    pushMessage(
      createTextMessage('user', file.name, {
        type: 'upload',
        fileName: item.fileName,
        fileLabel: item.fileLabel,
        fileSize: item.fileSize,
      }),
    );

    await beginTyping('profile', 360);
    pushMessage(createTextMessage('assistant', `${COPY[language].documentSaved} ${fileLabel}.`));
    await delay(200);
    pushMessage(createTextMessage('assistant', COPY[language].documentAcknowledge));
    setIsTyping(false);
    setTypingLabel(COPY[language].typing);
    setQuickReplies(getLocalizedQuickReplies(language, 'welcome'));
  }

  function stopVoice() {
    recognitionRef.current?.stop();
  }

  function toggleVoiceInput() {
    const copy = COPY[language];
    const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      pushMessage(createTextMessage('assistant', copy.voiceUnsupported));
      return;
    }

    if (isListening) {
      stopVoice();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    let finalTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      setListeningTranscript('');
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ')
        .trim();
      finalTranscript = transcript;
      setListeningTranscript(transcript);
      setInputText(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setListeningTranscript('');
      pushMessage(createTextMessage('assistant', copy.voiceUnsupported));
    };

    recognition.onend = () => {
      setIsListening(false);
      setListeningTranscript('');
      const transcript = finalTranscript.trim();
      if (!transcript) return;
      if (transcript === lastAutoVoiceRef.current) return;
      lastAutoVoiceRef.current = transcript;
      setInputText('');
      handleSend(transcript, { source: 'voice' });
      setTimeout(() => {
        if (lastAutoVoiceRef.current === transcript) {
          lastAutoVoiceRef.current = '';
        }
      }, 1200);
    };

    recognition.start();
  }

  async function handleSend(nextText, options = {}) {
    const text = String(nextText || inputText).trim();
    if (!text || isSubmitting) return;

    const fieldForBubble = pendingField;
    setInputText('');
    pushMessage(
      createTextMessage(
        'user',
        fieldForBubble ? formatUserBubble(fieldForBubble, parseField(fieldForBubble, text) ?? text) : text,
      ),
    );

    if (WELCOME_CHIPS[language].includes(text)) {
      await handleFreeformMessage(text, options);
      return;
    }

    if (isLegalQuery(text)) {
      await requestLegalGuidance(text, language, options);
      return;
    }

    if (pendingField) {
      await handleProfileReply(text, options);
      return;
    }

    await handleFreeformMessage(text, options);
  }

  return (
    <div className="app-shell">
      <header className="chat-header">
        <div className="header-main">
          <div className="header-avatar">
            <AssistantBadge large />
          </div>
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

        {isListening ? (
          <div className="voice-status">
            <div className="voice-pulse" />
            <div className="voice-copy">
              <strong>{COPY[language].voiceReady}</strong>
              {listeningTranscript ? <span>{listeningTranscript}</span> : null}
            </div>
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
            onChange={(event) => {
              setInputText(event.target.value);
              if (pendingField === 'state') {
                setRepliesForField('state', event.target.value);
              }
            }}
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
            <span className="mic-core" />
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

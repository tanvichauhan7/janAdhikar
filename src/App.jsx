import { useEffect, useRef, useState } from 'react';
import './App.css';
import {
  EMPTY_PROFILE,
  OCCUPATIONS,
  PROFILE_META,
  QUICK_REPLIES,
  SCHEMES,
  STATES,
} from './appData';

function getMissing(profile) {
  return PROFILE_META.map((meta) => meta.key).filter((key) => !profile[key]);
}

function extractProfile(text, profile, nextMissing) {
  const normalized = text.toLowerCase();
  const updated = { ...profile };

  if (nextMissing === 'name') {
    const match = text.match(/([A-Z][a-z]+)/);
    if (match) {
      updated.name = match[1];
    }
  }

  const ageMatch = text.match(/(\d+)\s*(?:years?|yrs?)?/i);
  if (ageMatch && nextMissing === 'age') {
    updated.age = parseInt(ageMatch[1], 10);
  }

  if (/\b(male|man|he|him)\b/i.test(normalized) || text === 'Male') {
    updated.gender = 'Male';
  }

  if (/\b(female|woman|she|her)\b/i.test(normalized) || text === 'Female') {
    updated.gender = 'Female';
  }

  STATES.forEach((state) => {
    if (normalized.includes(state.toLowerCase())) {
      updated.state = state;
    }
  });

  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac|l\b)/i);
  if (lakhMatch) {
    updated.income = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else {
    const incomeMatch = text.match(/₹?\s*(\d{4,})/);
    if (incomeMatch) {
      updated.income = parseInt(incomeMatch[1], 10);
    }
  }

  OCCUPATIONS.forEach((occupation) => {
    if (normalized.includes(occupation.toLowerCase())) {
      updated.occupation = occupation;
    }
  });

  return updated;
}

function getQuestion(field, profile) {
  const questions = {
    name: 'Nice! What should I call you?',
    age: `Good to meet you, ${profile.name}! How old are you?`,
    gender: 'Thanks! Are you male or female?',
    state: 'Which state do you live in?',
    income: 'What is your annual household income? (e.g. ₹1.5 lakh or ₹2,50,000)',
    occupation: 'And your occupation? (Farmer, Private Sector, Govt Employee, Student, etc.)',
  };

  return questions[field] ?? 'Could you tell me more?';
}

function findSchemes(profile) {
  return SCHEMES.filter((scheme) => {
    const incomeOk = profile.income <= scheme.maxIncome;
    const occupationOk = !scheme.occupation || scheme.occupation === profile.occupation;
    const genderOk = !scheme.gender || scheme.gender === profile.gender;
    return incomeOk && occupationOk && genderOk;
  });
}

function fmt(value) {
  return Number(value).toLocaleString('en-IN');
}

function now() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function createMessageId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function TypingIndicator() {
  return (
    <div className="msg-row">
      <div className="msg-avatar bot">🤖</div>
      <div className="typing-bubble">
        {[0, 200, 400].map((delay, index) => (
          <span key={index} className="dot" style={{ animationDelay: `${delay}ms` }} />
        ))}
      </div>
    </div>
  );
}

function Message({ msg, onSchemeClick }) {
  const isUser = msg.sender === 'user';

  return (
    <div className={`msg-row ${isUser ? 'user' : ''}`}>
      <div className={`msg-avatar ${isUser ? 'user' : 'bot'}`}>
        {isUser ? msg.initial || 'U' : '🤖'}
      </div>
      <div className="msg-content">
        <div className={`bubble ${isUser ? 'user' : 'agent'}`}>
          {msg.text}
          {msg.type === 'scheme-list' && msg.schemes?.length > 0 && (
            <div className="chat-scheme-list">
              {msg.schemes.map((scheme) => (
                <button
                  key={scheme.name}
                  type="button"
                  className="chat-scheme-card"
                  onClick={() => onSchemeClick(scheme)}
                >
                  <div className="chat-scheme-name">{scheme.name}</div>
                  <div className="chat-scheme-desc">{scheme.desc}</div>
                  <div className="chat-scheme-action">Tap for more info</div>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={`msg-time ${isUser ? 'user' : ''}`}>{msg.time}</div>
      </div>
    </div>
  );
}

function ProfileField({ meta, value }) {
  const isFilled = Boolean(value);
  const displayValue = meta.key === 'income' && value ? `₹${fmt(value)}` : value;

  return (
    <div className={`profile-field ${isFilled ? 'filled' : ''}`}>
      <div className="field-icon">{meta.icon}</div>
      <div className="field-info">
        <div className="field-name">{meta.label}</div>
        <div className={`field-value ${isFilled ? '' : 'empty'}`}>
          {displayValue || 'Not provided'}
        </div>
      </div>
      <div className={`check-dot ${isFilled ? 'visible' : ''}`} />
    </div>
  );
}

function SchemeCard({ scheme }) {
  return (
    <div className="scheme-card">
      <div className="scheme-name">{scheme.name}</div>
      <div className="scheme-desc">{scheme.desc}</div>
    </div>
  );
}

export default function JanAdhikar() {
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [schemes, setSchemes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const filledCount = PROFILE_META.filter((meta) => profile[meta.key]).length;
  const progressPct = Math.round((filledCount / PROFILE_META.length) * 100);

  useEffect(() => {
    setMessages([
      {
        id: createMessageId(),
        sender: 'agent',
        text:
          "Namaste! 🙏 Welcome to Jan Adhikar.\n\nI'll help you discover government schemes you're eligible for — just answer a few quick questions.\n\nWhat's your name?",
        time: now(),
      },
    ]);
    setQuickReplies(QUICK_REPLIES.name);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addAgentMessage(text) {
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), sender: 'agent', text, time: now() },
    ]);
  }

  function addUserMessage(text, initial) {
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), sender: 'user', text, time: now(), initial },
    ]);
  }

  function addSchemeListMessage(eligibleSchemes, profileName) {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        sender: 'agent',
        type: 'scheme-list',
        text:
          eligibleSchemes.length > 0
            ? `Here are the schemes I found for you, ${profileName}. Tap any one to get more details.`
            : `I could not find a direct match right now, ${profileName}. You can still update your details and try again.`,
        schemes: eligibleSchemes,
        time: now(),
      },
    ]);
  }

  function handleSchemeClick(scheme) {
    addAgentMessage(
      `Here is more information about ${scheme.name}:\n\n${scheme.desc}\n\n${scheme.details}`,
    );
  }

  async function handleSend(text) {
    const message = (text ?? inputText).trim();
    if (!message) {
      return;
    }

    setInputText('');
    setQuickReplies([]);

    const initial = profile.name ? profile.name[0].toUpperCase() : 'U';
    addUserMessage(message, initial);

    const missing = getMissing(profile);
    const updatedProfile = extractProfile(message, profile, missing[0]);
    setProfile(updatedProfile);

    setIsTyping(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsTyping(false);

    const stillMissing = getMissing(updatedProfile);

    if (stillMissing.length > 0) {
      const field = stillMissing[0];
      addAgentMessage(getQuestion(field, updatedProfile));
      setQuickReplies(QUICK_REPLIES[field] ?? []);
      return;
    }

    const eligibleSchemes = findSchemes(updatedProfile);
    setSchemes(eligibleSchemes);
    addAgentMessage(
      `🎉 Thank you, ${updatedProfile.name}! I've completed your profile.\n\nBased on your details — ${updatedProfile.age} years old, ${updatedProfile.gender}, ${updatedProfile.occupation} from ${updatedProfile.state} with an income of ₹${fmt(updatedProfile.income)} — I found ${eligibleSchemes.length} scheme${eligibleSchemes.length !== 1 ? 's' : ''} you may be eligible for.`,
    );
    addSchemeListMessage(eligibleSchemes, updatedProfile.name);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onresult = (event) => {
      setInputText((prev) => prev + event.results[0][0].transcript);
      inputRef.current?.focus();
    };
    recognition.start();
  }

  return (
    <div className="jan-adhikar-app">
      <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-row">
            <div className="brand">
              <div className="brand-icon">🇮🇳</div>
              {!isSidebarCollapsed && <span className="brand-name">Jan Adhikar</span>}
            </div>
            <button
              type="button"
              className="collapse-btn"
              onClick={() => setIsSidebarCollapsed((prev) => !prev)}
              aria-label={isSidebarCollapsed ? 'Expand profile sidebar' : 'Collapse profile sidebar'}
              title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
            >
              {isSidebarCollapsed ? '›' : '‹'}
            </button>
          </div>
          {!isSidebarCollapsed && (
            <div className="brand-tagline">Scheme Eligibility Assistant</div>
          )}
        </div>

        <div className="profile-section">
          {!isSidebarCollapsed && <div className="section-label">Your profile</div>}
          <div className="profile-fields">
            {PROFILE_META.map((meta) => (
              <ProfileField key={meta.key} meta={meta} value={profile[meta.key]} />
            ))}
          </div>
        </div>

        <div className="schemes-section">
          {!isSidebarCollapsed && <div className="section-label">Eligible schemes</div>}
          {isSidebarCollapsed ? (
            <div className="collapsed-summary">
              <div className="collapsed-badge">{filledCount}/6</div>
              <div className="collapsed-badge">{schemes.length} schemes</div>
            </div>
          ) : schemes.length === 0 ? (
            <div className="no-schemes">Complete your profile to see schemes</div>
          ) : (
            schemes.map((scheme) => <SchemeCard key={scheme.name} scheme={scheme} />)
          )}
        </div>
      </aside>

      <main className="chat-area">
        <header className="chat-header">
          <div className="header-avatar">🤖</div>
          <div>
            <div className="header-name">Adhikar Assistant</div>
            <div className="header-status">
              <div className="status-dot" />
              Online · Government Schemes Expert
            </div>
          </div>
          <div className="progress-wrap">
            <div className="progress-label">Profile: {filledCount}/6</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </header>

        <div className="messages">
          <div className="date-divider">Today</div>
          {messages.map((message) => (
            <Message key={message.id} msg={message} onSchemeClick={handleSchemeClick} />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          {quickReplies.length > 0 && (
            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  className="qr-btn"
                  onClick={() => handleSend(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          <div className="input-row">
            <div className="input-wrap">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="textarea"
              />
              <button className="icon-btn" onClick={handleVoice} aria-label="Voice input">
                🎤
              </button>
            </div>
            <button className="send-btn" onClick={() => handleSend()} aria-label="Send">
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

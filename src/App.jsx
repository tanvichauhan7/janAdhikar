import { useEffect, useRef, useState } from 'react';
import './App.css';
import { EMPTY_PROFILE, PROFILE_META, QUICK_REPLIES } from './appData';

const SELECT_EDIT_FIELD = '__select_field__';

function getMissing(profile) {
  return PROFILE_META.map((meta) => meta.key).filter((key) => !profile[key]);
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

function fmt(value) {
  return Number(value).toLocaleString('en-IN');
}

function formatProfileValue(field, value) {
  if (!value) {
    return 'Not provided';
  }

  if (field === 'income') {
    return `₹${fmt(value)}`;
  }

  return value;
}

function getFieldKeyFromInput(text) {
  const normalized = text.trim().toLowerCase();
  const directMatch = PROFILE_META.find(
    (meta) => meta.key.toLowerCase() === normalized || meta.label.toLowerCase() === normalized,
  );

  return directMatch?.key ?? null;
}

function now() {
  return new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fallbackId() {
  if (globalThis.crypto?.getRandomValues) {
    const bytes = new Uint32Array(4);
    globalThis.crypto.getRandomValues(bytes);
    return Array.from(bytes, (value) => value.toString(16).padStart(8, '0')).join('');
  }

  return `msg-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function createMessageId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return fallbackId();
}

async function extractProfileFromApi(text, currentProfile) {
  const response = await fetch('/api/extract-profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, currentProfile }),
  });

  if (!response.ok) {
    throw new Error('Could not extract profile');
  }

  return response.json();
}

async function recommendSchemesFromApi(profile) {
  const response = await fetch('/api/recommend-schemes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ profile }),
  });

  if (!response.ok) {
    throw new Error('Could not fetch recommendations');
  }

  return response.json();
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

function ProfileConfirmCard({ profile, onConfirm, onEdit, disabled, resolved }) {
  return (
    <div className="profile-confirm-card">
      <div className="profile-confirm-grid">
        {PROFILE_META.map((meta) => (
          <div key={meta.key} className="profile-confirm-item">
            <div className="profile-confirm-label">{meta.label}</div>
            <div className="profile-confirm-value">
              {formatProfileValue(meta.key, profile?.[meta.key])}
            </div>
          </div>
        ))}
      </div>
      {resolved ? (
        <div className="profile-confirm-status">This review card is no longer active.</div>
      ) : (
        <div className="profile-confirm-actions">
          <button
            type="button"
            className="profile-confirm-btn secondary"
            onClick={onEdit}
            disabled={disabled}
          >
            Edit
          </button>
          <button
            type="button"
            className="profile-confirm-btn primary"
            onClick={onConfirm}
            disabled={disabled}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}

function Message({ msg, onSchemeClick, onConfirmProfile, onEditProfile, disabled }) {
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
          {msg.type === 'profile-confirm' && msg.profile && (
            <ProfileConfirmCard
              profile={msg.profile}
              onConfirm={onConfirmProfile}
              onEdit={onEditProfile}
              disabled={disabled}
              resolved={msg.resolved}
            />
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
  const [messages, setMessages] = useState(() => [
    {
      id: createMessageId(),
      sender: 'agent',
      text:
        "Namaste! 🙏 Welcome to Jan Adhikar.\n\nI'll help you discover government schemes you're eligible for — just answer a few quick questions.\n\nWhat's your name?",
      time: now(),
    },
  ]);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [schemes, setSchemes] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [quickReplies, setQuickReplies] = useState(QUICK_REPLIES.name);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const filledCount = PROFILE_META.filter((meta) => profile[meta.key]).length;
  const progressPct = Math.round((filledCount / PROFILE_META.length) * 100);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  function addAgentMessage(text, extra = {}) {
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), sender: 'agent', text, time: now(), ...extra },
    ]);
  }

  function addUserMessage(text, initial) {
    setMessages((prev) => [
      ...prev,
      { id: createMessageId(), sender: 'user', text, time: now(), initial },
    ]);
  }

  function addSchemeListMessage(eligibleSchemes, summary, profileName) {
    setMessages((prev) => [
      ...prev,
      {
        id: createMessageId(),
        sender: 'agent',
        type: 'scheme-list',
        text:
          eligibleSchemes.length > 0
            ? `${summary}\n\nHere are the schemes I found for you, ${profileName}. Tap any one to get more details.`
            : `${summary}\n\nI could not find a direct match right now, ${profileName}. You can still update your details and try again.`,
        schemes: eligibleSchemes,
        time: now(),
      },
    ]);
  }

  function addProfileConfirmMessage(nextProfile) {
    setMessages((prev) => [
      ...prev.map((message) =>
        message.type === 'profile-confirm' ? { ...message, resolved: true } : message,
      ),
      {
        id: createMessageId(),
        sender: 'agent',
        type: 'profile-confirm',
        text: 'Please review your profile once before I check matching schemes.',
        profile: nextProfile,
        time: now(),
      },
    ]);
  }

  function handleSchemeClick(scheme) {
    const reasoningText = scheme.reasoning ? `\n\nWhy it matched: ${scheme.reasoning}` : '';
    addAgentMessage(
      `Here is more information about ${scheme.name}:\n\n${scheme.desc}${reasoningText}\n\n${scheme.details}`,
    );
  }

  async function handleConfirmProfile(shouldAddUserReply = true) {
    if (isSubmitting || !isAwaitingConfirmation) {
      return;
    }

    if (shouldAddUserReply) {
      const initial = profile.name ? profile.name[0].toUpperCase() : 'U';
      addUserMessage('Confirm', initial);
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.type === 'profile-confirm' ? { ...message, resolved: true } : message,
      ),
    );
    addAgentMessage('Thanks, confirming your profile now...');
    setIsAwaitingConfirmation(false);
    setQuickReplies([]);
    setIsTyping(true);
    setIsSubmitting(true);

    try {
      const recommendations = await recommendSchemesFromApi(profile);
      const eligibleSchemes = recommendations.eligible ?? [];

      setSchemes(eligibleSchemes);
      addAgentMessage(
        `🎉 Thank you, ${profile.name}! Based on your confirmed details — ${profile.age} years old, ${profile.gender}, ${profile.occupation} from ${profile.state} with an income of ₹${fmt(profile.income)} — ${recommendations.reasoningSummary}`,
      );
      addSchemeListMessage(eligibleSchemes, recommendations.reasoningSummary, profile.name);
    } catch {
      setSchemes([]);
      addAgentMessage(
        'I had trouble fetching recommendations just now. Please try confirming again.',
      );
      setIsAwaitingConfirmation(true);
      addProfileConfirmMessage(profile);
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
    }
  }

  function handleEditProfile(shouldAddUserReply = true) {
    if (isSubmitting || !isAwaitingConfirmation) {
      return;
    }

    if (shouldAddUserReply) {
      const initial = profile.name ? profile.name[0].toUpperCase() : 'U';
      addUserMessage('Edit', initial);
    }

    setMessages((prev) =>
      prev.map((message) =>
        message.type === 'profile-confirm' ? { ...message, resolved: true } : message,
      ),
    );
    addAgentMessage('Which field do you want to change?');
    setIsAwaitingConfirmation(false);
    setEditingField(SELECT_EDIT_FIELD);
    setQuickReplies(PROFILE_META.map((meta) => meta.label));
  }

  function requestProfileConfirmation(nextProfile) {
    setIsAwaitingConfirmation(true);
    setEditingField(null);
    setQuickReplies([]);
    addAgentMessage("I've captured your details. Please review them once.");
    addProfileConfirmMessage(nextProfile);
  }

  async function handleSend(text) {
    const message = (text ?? inputText).trim();
    if (!message || isSubmitting) {
      return;
    }

    setInputText('');
    setQuickReplies([]);

    const initial = profile.name ? profile.name[0].toUpperCase() : 'U';
    addUserMessage(message, initial);
    setIsTyping(true);
    setIsSubmitting(true);

    try {
      if (isAwaitingConfirmation) {
        const normalized = message.toLowerCase();

        if (normalized === 'confirm') {
          setIsTyping(false);
          setIsSubmitting(false);
          await handleConfirmProfile(false);
          return;
        }

        if (normalized === 'edit') {
          setIsTyping(false);
          setIsSubmitting(false);
          handleEditProfile(false);
          return;
        }

        addAgentMessage('Please tap Confirm or Edit so I know whether to proceed or update details.');
        return;
      }

      if (editingField === SELECT_EDIT_FIELD) {
        const nextField = getFieldKeyFromInput(message);

        if (!nextField) {
          addAgentMessage('Please choose one of these fields: Name, Age, Gender, State, Income, Occupation.');
          setQuickReplies(PROFILE_META.map((meta) => meta.label));
          return;
        }

        setEditingField(nextField);
        addAgentMessage(getQuestion(nextField, profile));
        setQuickReplies(QUICK_REPLIES[nextField] ?? []);
        return;
      }

      const profileForExtraction =
        editingField && editingField !== SELECT_EDIT_FIELD
          ? { ...profile, [editingField]: null }
          : profile;

      const extraction = await extractProfileFromApi(message, profileForExtraction);
      const updatedProfile = {
        ...EMPTY_PROFILE,
        ...extraction.updatedProfile,
      };
      const stillMissing = extraction.missingFields ?? getMissing(updatedProfile);

      setProfile(updatedProfile);

      if (stillMissing.length > 0) {
        const nextField = stillMissing[0];
        setIsAwaitingConfirmation(false);
        setEditingField(null);
        setSchemes([]);
        addAgentMessage(getQuestion(nextField, updatedProfile));
        setQuickReplies(QUICK_REPLIES[nextField] ?? []);
        return;
      }

      setSchemes([]);
      requestProfileConfirmation(updatedProfile);
    } catch {
      setSchemes([]);
      addAgentMessage(
        'I had trouble processing that message just now. Please try again or share one detail at a time.',
      );
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
    }
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
            <Message
              key={message.id}
              msg={message}
              onSchemeClick={handleSchemeClick}
              onConfirmProfile={handleConfirmProfile}
              onEditProfile={handleEditProfile}
              disabled={isSubmitting}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          {quickReplies.length > 0 && (
            <div className="quick-replies">
              {quickReplies.map((reply) => (
                <button key={reply} className="qr-btn" onClick={() => handleSend(reply)}>
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
            <button
              className="send-btn"
              onClick={() => handleSend()}
              aria-label="Send"
              disabled={isSubmitting}
            >
              ➤
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

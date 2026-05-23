import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const COPY = {
  en: {
    title: 'Legal guidance chat',
    body: 'Ask in plain English or Hinglish. The assistant uses local keyword matching and local retrieval only.',
    inputPlaceholder: 'Type your legal question here',
    send: 'Send',
    context: 'Local context',
  },
  hi: {
    title: 'Kanooni guidance chat',
    body: 'Seedhi Hindi ya Hinglish mein sawaal puchhiye. Assistant sirf local matching aur local retrieval ka use karta hai.',
    inputPlaceholder: 'Apna kanooni sawaal yahan likhiye',
    send: 'Bhejiye',
    context: 'Local context',
  },
};

export default function LegalChat({ language, messages, isLoading, onSend, endRef }) {
  const [input, setInput] = useState('');
  const copy = COPY[language];

  function handleSubmit(event) {
    event.preventDefault();
    onSend(input);
    setInput('');
  }

  return (
    <section className="legal-panel">
      <div className="panel-intro">
        <span className="eyebrow">{copy.title}</span>
        <h2>{copy.title}</h2>
        <p>{copy.body}</p>
      </div>

      <div className="chat-window">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === 'user' ? 'message-row user' : 'message-row'}
          >
            <div className="avatar">{message.role === 'user' ? 'You' : 'AI'}</div>
            <div className="message-card">
              <p>{message.text}</p>
              {message.reference ? <div className="law-chip">{message.reference}</div> : null}
              {message.context ? (
                <div className="context-inline">
                  <span>{copy.context}</span>
                  <p>{message.context}</p>
                </div>
              ) : null}
              <div className="message-time">{message.time}</div>
            </div>
          </div>
        ))}

        {isLoading ? (
          <div className="chat-loader">
            <LoadingSpinner
              label={language === 'hi' ? 'Jawab taiyar ho raha hai' : 'Preparing the answer'}
            />
          </div>
        ) : null}

        <div ref={endRef} />
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={copy.inputPlaceholder}
          rows={3}
        />
        <button type="submit">{copy.send}</button>
      </form>
    </section>
  );
}

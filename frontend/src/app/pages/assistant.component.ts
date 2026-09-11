import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmService } from '../services/farm.service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  timestamp?: string;
  isSpeaking?: boolean;
}

interface LanguageOption {
  name: string;
  nativeName: string;
  locale: string;
  flag: string;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="assistant-page">
      <!-- AMBIENT GLOWS -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="assistant-container">
        <!-- HERO -->
        <header class="hero">
          <div class="hero-icon-badge">🤖</div>
          <div class="eyebrow">KRISHIAI MULTILINGUAL AGRO-BRAIN • VOICE & CHAT</div>
          <h1>Ask KrishiAI Anything<br><span>in 10 Indian Languages</span></h1>
          <p>
            Your voice-enabled agricultural intelligence co-pilot. Inquire about crop health, fertilizer dosing,
            irrigation schedules, mandi prices, or pest management in your native tongue.
          </p>

          <!-- TOP CONTROLS BAR -->
          <div class="hero-controls">
            <!-- AUTO-SPEAK TOGGLE -->
            <button
              type="button"
              class="auto-speak-btn"
              [class.active]="autoSpeak"
              (click)="toggleAutoSpeak()"
              [title]="autoSpeak ? 'Auto Voice: ON (AI will read replies aloud)' : 'Auto Voice: OFF'"
            >
              <span class="status-indicator"></span>
              {{ autoSpeak ? '🔊 Auto-Voice: ON' : '🔈 Auto-Voice: OFF' }}
            </button>

            <!-- LANGUAGE SELECTOR -->
            <div class="lang-selector-wrap">
              <span class="lang-icon">🌐</span>
              <label for="langSelect" class="lang-label">Language:</label>
              <select
                id="langSelect"
                [(ngModel)]="selectedLanguage"
                (change)="onLanguageChange()"
                class="lang-select"
              >
                <option *ngFor="let lang of supportedLanguages" [value]="lang.name">
                  {{ lang.nativeName }} ({{ lang.name }})
                </option>
              </select>
            </div>
          </div>
        </header>

        <!-- MAIN TERMINAL CARD -->
        <main class="assistant-card">
          <!-- CARD HEADER -->
          <div class="assistant-header">
            <div class="assistant-info">
              <div class="bot-icon">🌱</div>
              <div>
                <h2>KrishiAI Neural Terminal</h2>
                <div class="status">
                  <span class="status-dot"></span>
                  Online • Multilingual Agronomic Model Ready
                </div>
              </div>
            </div>

            <div class="active-lang-badge">
              <span>{{ getCurrentLanguageNativeName() }}</span>
            </div>
          </div>

          <!-- SUGGESTED QUESTION CHIPS -->
          <div class="quick-questions">
            <span class="qq-title">💡 {{ getSuggestedLabel() }}:</span>
            <div class="chips-container">
              <button
                type="button"
                class="chip"
                *ngFor="let q of currentSuggestedQuestions"
                (click)="askQuestion(q)"
              >
                {{ q }}
              </button>
            </div>
          </div>

          <!-- CHAT SCROLL AREA -->
          <div class="chat-area" #scrollContainer>
            <!-- EMPTY WELCOME STATE -->
            <div class="empty-message" *ngIf="messages.length === 0">
              <div class="empty-icon">🎙️</div>
              <h3>{{ getWelcomeTitle() }}</h3>
              <p>{{ getWelcomeSubtitle() }}</p>
              <div class="voice-hint">
                👉 Click the <strong>🎤 Microphone</strong> below or tap any suggested question chip to begin!
              </div>
            </div>

            <!-- MESSAGE BUBBLES -->
            <div
              class="message-row"
              *ngFor="let message of messages; let i = index"
              [class.user-row]="message.role === 'user'"
              [class.ai-row]="message.role === 'ai'"
            >
              <div
                class="message"
                [class.user-message]="message.role === 'user'"
                [class.ai-message]="message.role === 'ai'"
              >
                <!-- MESSAGE TEXT -->
                <div class="message-content">{{ message.text }}</div>

                <div class="message-footer">
                  <span class="message-label">
                    {{ message.role === 'user' ? '🧑‍🌾 You' : '🤖 KrishiAI' }}
                    <span *ngIf="message.timestamp" class="msg-time">• {{ message.timestamp }}</span>
                  </span>

                  <!-- TTS SPEAKER BUTTON FOR AI RESPONSES -->
                  <button
                    *ngIf="message.role === 'ai'"
                    type="button"
                    class="tts-button"
                    [class.speaking]="currentlySpeakingIndex === i"
                    (click)="toggleSpeakMessage(message.text, i)"
                    [title]="currentlySpeakingIndex === i ? 'Stop Speaking' : 'Read Aloud'"
                  >
                    <span *ngIf="currentlySpeakingIndex === i" class="tts-active-wave">⏹ Stop</span>
                    <span *ngIf="currentlySpeakingIndex !== i">🔊 Listen</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- THINKING / LOADING INDICATOR -->
            <div class="typing-indicator" *ngIf="loading">
              <div class="typing-bot">🤖</div>
              <div class="typing-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="typing-text">KrishiAI neural engine is analyzing...</span>
            </div>

            <!-- LIVE SPEECH LISTENING BANNER -->
            <div class="listening-banner" *ngIf="isListening">
              <div class="mic-wave">
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
                <span class="wave-bar"></span>
              </div>
              <span class="listening-text">
                🎙️ Listening in <strong>{{ getCurrentLanguageNativeName() }}</strong>... Speak now!
              </span>
              <button type="button" class="stop-listening-btn" (click)="stopListening()">Done</button>
            </div>
          </div>

          <!-- INPUT & VOICE ACTIONS -->
          <div class="input-area">
            <!-- VOICE MIC BUTTON -->
            <button
              type="button"
              class="mic-btn"
              [class.listening]="isListening"
              (click)="toggleVoiceInput()"
              [title]="isListening ? 'Stop Listening' : 'Start Voice Input'"
              [disabled]="loading"
            >
              <span class="mic-icon">{{ isListening ? '⏹' : '🎤' }}</span>
            </button>

            <!-- TEXT INPUT -->
            <input
              type="text"
              [(ngModel)]="question"
              (keyup.enter)="send()"
              [placeholder]="getInputPlaceholder()"
              [disabled]="loading"
            />

            <!-- SEND BUTTON -->
            <button
              type="button"
              class="send-btn"
              (click)="send()"
              [disabled]="loading || !question.trim()"
            >
              ➤
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100%;
    }

    * {
      box-sizing: border-box;
    }

    .assistant-page {
      min-height: calc(100vh - 70px);
      background: #08120f;
      color: #f3f9f4;
      padding: 40px 20px 80px;
      position: relative;
      overflow: hidden;
      font-family: inherit;
    }

    /* AMBIENT GLOWS */
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      filter: blur(80px);
      z-index: 0;
    }
    .orb-1 {
      width: 450px;
      height: 450px;
      top: -120px;
      right: -80px;
      background: radial-gradient(circle, rgba(0, 255, 148, 0.12), transparent 70%);
    }
    .orb-2 {
      width: 360px;
      height: 360px;
      bottom: 60px;
      left: -100px;
      background: radial-gradient(circle, rgba(125, 255, 111, 0.08), transparent 70%);
    }

    .assistant-container {
      max-width: 1040px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* HERO */
    .hero {
      text-align: center;
      max-width: 780px;
      margin: 0 auto 32px;
    }
    .hero-icon-badge {
      width: 82px;
      height: 82px;
      border-radius: 22px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.28);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      box-shadow: 0 12px 30px rgba(0, 255, 148, 0.18);
      margin-bottom: 18px;
    }
    .eyebrow {
      color: #8cff78;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }
    .hero h1 {
      font-size: clamp(2.2rem, 4.5vw, 3.2rem);
      font-weight: 850;
      line-height: 1.15;
      margin: 0 0 14px;
      letter-spacing: -0.02em;
    }
    .hero h1 span {
      background: linear-gradient(135deg, #7dff6f 0%, #36e89a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero p {
      color: #b7c8bc;
      font-size: 1.05rem;
      line-height: 1.6;
      margin: 0 0 24px;
    }

    /* HERO CONTROLS */
    .hero-controls {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
    }
    .auto-speak-btn {
      background: #0f1612;
      border: 1px solid #28372d;
      padding: 10px 18px;
      border-radius: 30px;
      font-size: 0.82rem;
      font-weight: 750;
      color: #b0c2b5;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .auto-speak-btn .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #475a4e;
    }
    .auto-speak-btn.active {
      background: rgba(125, 255, 111, 0.12);
      border-color: rgba(125, 255, 111, 0.4);
      color: #7dff6f;
    }
    .auto-speak-btn.active .status-indicator {
      background: #7dff6f;
      box-shadow: 0 0 8px #7dff6f;
    }
    .lang-selector-wrap {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #0f1612;
      border: 1px solid #28372d;
      padding: 6px 14px;
      border-radius: 30px;
    }
    .lang-icon {
      font-size: 16px;
    }
    .lang-label {
      font-size: 0.78rem;
      color: #8cff78;
      font-weight: 800;
    }
    .lang-select {
      background: transparent;
      border: none;
      color: #f1f7f2;
      font-size: 0.85rem;
      font-weight: 700;
      outline: none;
      cursor: pointer;
    }
    .lang-select option {
      background: #121815;
      color: #f1f7f2;
    }

    /* ASSISTANT CARD */
    .assistant-card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      height: 720px;
    }

    /* CARD HEADER */
    .assistant-header {
      background: #0c110e;
      border-bottom: 1px solid #212c24;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .assistant-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .bot-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .assistant-header h2 {
      margin: 0 0 2px;
      font-size: 1.15rem;
      color: #ffffff;
      font-weight: 750;
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #8fa395;
    }
    .status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #7dff6f;
      box-shadow: 0 0 8px #7dff6f;
    }
    .active-lang-badge {
      background: rgba(54, 232, 154, 0.1);
      border: 1px solid rgba(54, 232, 154, 0.3);
      color: #36e89a;
      padding: 5px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      font-weight: 800;
    }

    /* QUICK QUESTIONS */
    .quick-questions {
      background: #090e0b;
      border-bottom: 1px solid #1c261f;
      padding: 12px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      overflow-x: auto;
    }
    .qq-title {
      font-size: 0.75rem;
      font-weight: 800;
      color: #8cff78;
      white-space: nowrap;
    }
    .chips-container {
      display: flex;
      gap: 8px;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .chips-container::-webkit-scrollbar {
      display: none;
    }
    .chip {
      background: #111814;
      border: 1px solid #233027;
      color: #c9dbce;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .chip:hover {
      background: rgba(125, 255, 111, 0.1);
      border-color: #7dff6f;
      color: #7dff6f;
    }

    /* CHAT AREA */
    .chat-area {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      background: #080d0a;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* EMPTY STATE */
    .empty-message {
      margin: auto;
      text-align: center;
      max-width: 480px;
      padding: 30px;
    }
    .empty-icon {
      font-size: 50px;
      margin-bottom: 14px;
    }
    .empty-message h3 {
      margin: 0 0 10px;
      font-size: 1.3rem;
      color: #ffffff;
      font-weight: 800;
    }
    .empty-message p {
      color: #92a397;
      font-size: 0.92rem;
      line-height: 1.55;
      margin: 0 0 16px;
    }
    .voice-hint {
      display: inline-block;
      background: #0f1612;
      border: 1px solid #28372d;
      padding: 8px 16px;
      border-radius: 12px;
      font-size: 0.8rem;
      color: #7dff6f;
    }

    /* MESSAGE ROWS */
    .message-row {
      display: flex;
      width: 100%;
    }
    .user-row {
      justify-content: flex-end;
    }
    .ai-row {
      justify-content: flex-start;
    }

    .message {
      max-width: 80%;
      border-radius: 18px;
      padding: 16px 20px;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .user-message {
      background: #19271e;
      border: 1px solid rgba(125, 255, 111, 0.35);
      color: #ffffff;
      border-bottom-right-radius: 4px;
    }
    .ai-message {
      background: #111713;
      border: 1px solid #233027;
      border-left: 3px solid #7dff6f;
      color: #d8e8dd;
      border-bottom-left-radius: 4px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    }
    .message-content {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .message-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      font-size: 0.72rem;
      color: #798f80;
    }
    .msg-time {
      color: #556c5e;
      margin-left: 4px;
    }
    .tts-button {
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      color: #7dff6f;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 750;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tts-button:hover {
      background: rgba(125, 255, 111, 0.2);
    }
    .tts-button.speaking {
      background: #7dff6f;
      color: #07120a;
    }

    /* TYPING INDICATOR */
    .typing-indicator {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: #111713;
      border: 1px solid #233027;
      border-radius: 14px;
      padding: 12px 18px;
      align-self: flex-start;
    }
    .typing-bot {
      font-size: 18px;
    }
    .typing-dots {
      display: flex;
      gap: 4px;
    }
    .typing-dots span {
      width: 6px;
      height: 6px;
      background: #7dff6f;
      border-radius: 50%;
      animation: dotPulse 1.2s infinite ease-in-out both;
    }
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes dotPulse {
      0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
      40% { transform: scale(1); opacity: 1; }
    }
    .typing-text {
      font-size: 0.8rem;
      color: #8fa395;
    }

    /* LISTENING BANNER */
    .listening-banner {
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid #7dff6f;
      border-radius: 14px;
      padding: 12px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      align-self: center;
      width: 100%;
      max-width: 520px;
      animation: glowListen 1.5s infinite alternate;
    }
    @keyframes glowListen {
      from { box-shadow: 0 0 10px rgba(125, 255, 111, 0.2); }
      to { box-shadow: 0 0 20px rgba(125, 255, 111, 0.45); }
    }
    .mic-wave {
      display: flex;
      gap: 3px;
      align-items: center;
      height: 18px;
    }
    .wave-bar {
      width: 3px;
      height: 100%;
      background: #7dff6f;
      border-radius: 2px;
      animation: waveUp 0.6s infinite ease-in-out alternate;
    }
    .wave-bar:nth-child(2) { animation-delay: 0.15s; }
    .wave-bar:nth-child(3) { animation-delay: 0.3s; }
    .wave-bar:nth-child(4) { animation-delay: 0.45s; }
    @keyframes waveUp {
      from { height: 4px; }
      to { height: 18px; }
    }
    .listening-text {
      flex: 1;
      font-size: 0.85rem;
      color: #ffffff;
    }
    .listening-text strong {
      color: #7dff6f;
    }
    .stop-listening-btn {
      background: #7dff6f;
      color: #07120a;
      border: none;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 0.78rem;
      font-weight: 800;
      cursor: pointer;
    }

    /* INPUT AREA */
    .input-area {
      background: #0c110e;
      border-top: 1px solid #212c24;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .mic-btn {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #141c17;
      border: 1px solid #2d3e32;
      color: #ffffff;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .mic-btn:hover:not(:disabled) {
      background: #1b261f;
      border-color: #7dff6f;
      color: #7dff6f;
    }
    .mic-btn.listening {
      background: #ff6b6b;
      border-color: #ff6b6b;
      box-shadow: 0 0 15px rgba(255, 107, 107, 0.6);
      animation: pulseMic 1s infinite;
    }
    @keyframes pulseMic {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }
    .input-area input {
      flex: 1;
      background: #121815;
      border: 1px solid #2d3e32;
      border-radius: 14px;
      padding: 14px 18px;
      color: #f1f7f2;
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .input-area input:focus {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }
    .input-area input::placeholder {
      color: #63776b;
    }
    .send-btn {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #7dff6f;
      color: #07120a;
      border: none;
      font-size: 18px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 8px 20px rgba(125, 255, 111, 0.25);
      transition: all 0.2s;
    }
    .send-btn:hover:not(:disabled) {
      background: #8eff80;
      transform: translateY(-2px);
    }
    .send-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (max-width: 650px) {
      .assistant-card {
        height: calc(100vh - 120px);
      }
      .message {
        max-width: 90%;
      }
    }
  `]
})
export class AssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  private farmService = inject(FarmService);

  question = '';
  selectedLanguage = 'English';
  loading = false;
  autoSpeak = false;
  isListening = false;
  currentlySpeakingIndex: number | null = null;

  messages: ChatMessage[] = [];

  readonly supportedLanguages: LanguageOption[] = [
    { name: 'English', nativeName: 'English', locale: 'en-IN', flag: '🇬🇧' },
    { name: 'Hindi', nativeName: 'हिन्दी', locale: 'hi-IN', flag: '🇮🇳' },
    { name: 'Marathi', nativeName: 'मराठी', locale: 'mr-IN', flag: '🇮🇳' },
    { name: 'Bengali', nativeName: 'বাংলা', locale: 'bn-IN', flag: '🇮🇳' },
    { name: 'Tamil', nativeName: 'தமிழ்', locale: 'ta-IN', flag: '🇮🇳' },
    { name: 'Telugu', nativeName: 'తెలుగు', locale: 'te-IN', flag: '🇮🇳' },
    { name: 'Gujarati', nativeName: 'ગુજરાતી', locale: 'gu-IN', flag: '🇮🇳' },
    { name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', locale: 'pa-IN', flag: '🇮🇳' },
    { name: 'Kannada', nativeName: 'ಕನ್ನಡ', locale: 'kn-IN', flag: '🇮🇳' },
    { name: 'Malayalam', nativeName: 'മലയാളം', locale: 'ml-IN', flag: '🇮🇳' }
  ];

  private readonly suggestedQuestionsDict: Record<string, string[]> = {
    'English': [
      'What fertilizer is best for wheat?',
      'Why are my tomato leaves turning yellow?',
      'What crop should I plant this season?',
      'How to cure powdery mildew on leaves?'
    ],
    'Hindi': [
      'गेहूं की फसल के लिए सबसे अच्छी खाद कौन सी है?',
      'टमाटर की पत्तियां पीली क्यों हो रही हैं?',
      'इस मौसम में कौन सी फसल बोनी चाहिए?',
      'फसल में कीड़ा लगने पर क्या उपाय करें?'
    ],
    'Marathi': [
      'गहू पिकासाठी कोणते खत सर्वात चांगले आहे?',
      'टोमॅटोची पाने पिवळी का पडत आहेत?',
      'या हंगामात कोणती पिके घ्यावीत?',
      'पिकावरील कीड नियंत्रणासाठी काय करावे?'
    ],
    'Bengali': [
      'গমের জন্য কোন সার সবচেয়ে ভালো?',
      'টমেটো পাতা হলুদ হয়ে যাওয়ার কারণ কী?',
      'এই মৌসুমে কোন ফসল চাষ করা উচিত?',
      'ধানের পাতাপোড়া রোগের প্রতিকার কী?'
    ],
    'Tamil': [
      'கோதுமைக்கு எந்த உரம் சிறந்தது?',
      'தக்காளி இலைகள் ஏன் மஞ்சள் நிறமாகின்றன?',
      'இந்த பருவத்தில் என்ன பயிர் நடவு செய்யலாம்?',
      'பூச்சி தாக்குதலை கட்டுப்படுத்துவது எப்படி?'
    ],
    'Telugu': [
      'గోధుమ పంటకు ఏ ఎరువు ఉత్తమం?',
      'టమోటా ఆకులు ఎందుకు పసుపు రంగులోకి మారుతున్నాయి?',
      'ఈ సీజన్‌లో ఏ పంట వేయాలి?',
      'పంటలపై తెగుళ్ల నివారణకు ఏం చేయాలి?'
    ],
    'Gujarati': [
      'ઘઉંના પાક માટે કયું ખાતર શ્રેષ્ઠ છે?',
      'ટામેટાના પાન કેમ પીળા પડી રહ્યા છે?',
      'આ ઋતુમાં કયો પાક વાવવો જોઈએ?',
      'પાકમાં જીવાત નિયંત્રણ માટે શું કરવું?'
    ],
    'Punjabi': [
      'ਕਣਕ ਦੀ ਫ਼ਸਲ ਲਈ ਕਿਹੜੀ ਖਾਦ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ?',
      'ਟਮਾਟਰ ਦੇ ਪੱਤੇ ਪੀਲੇ ਕਿਉਂ ਪੈ ਰਹੇ ਹਨ?',
      'ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਕਿਹੜੀ ਫ਼ਸਲ ਬੀਜਣੀ ਚਾਹੀਦੀ ਹੈ?',
      'ਕੀੜਿਆਂ ਦੀ ਰੋਕਥਾਮ ਲਈ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?'
    ],
    'Kannada': [
      'ಗೋಧಿ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಉತ್ತಮ?',
      'ಟೊಮೆಟೊ ಎಲೆಗಳು ಏಕೆ ಹಳದಿ ಬಣ್ಣಕ್ಕೆ ತಿರುಗುತ್ತಿವೆ?',
      'ಈ ಋತುವಿನಲ್ಲಿ ಯಾವ ಬೆಳೆ ಬೆಳೆಯಬೇಕು?',
      'ಕೀಟ ಬಾಧೆ ನಿಯಂತ್ರಣಕ್ಕೆ ಏನು ಮಾಡಬೇಕು?'
    ],
    'Malayalam': [
      'ഗോതമ്പ് കൃഷിക്ക് ഏറ്റവും അനുയോജ്യമായ വളം ഏതാണ്?',
      'തക്കാളി ഇലകൾ മഞ്ഞനിറമാകുന്നത് എന്തുകൊണ്ട്?',
      'ഈ സീസണിൽ ഏത് വിളയാണ് നടേണ്ടത്?',
      'കീടങ്ങളെ എങ്ങനെ നിയന്ത്രിക്കാം?'
    ]
  };

  currentSuggestedQuestions: string[] = [];

  private recognition: any = null;
  private synth: SpeechSynthesis | null = null;

  ngOnInit(): void {
    this.updateSuggestedQuestions();
    this.initSpeechServices();

    // Auto-fill prompt if user was redirected from Yield Prediction or another page
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const pending = sessionStorage.getItem('pendingAiPrompt');
      if (pending) {
        sessionStorage.removeItem('pendingAiPrompt');
        this.question = pending;
        setTimeout(() => {
          if (this.question.trim() && !this.loading) {
            this.send();
          }
        }, 350);
      }
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    this.stopSpeaking();
    this.stopListening();
  }

  private initSpeechServices(): void {
    if (typeof window !== 'undefined') {
      const windowObj = window as any;
      const SpeechRecognition = windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.onresult = (event: any) => {
          let transcript = '';
          let isFinal = false;
          for (let i = 0; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              isFinal = true;
            }
          }
          this.question = transcript;
          if (isFinal) {
            this.isListening = false;
            setTimeout(() => {
              if (this.question.trim() && !this.loading) {
                this.send();
              }
            }, 400);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition warning/error:', event?.error);
          this.isListening = false;
          if (event?.error === 'not-allowed') {
            alert('Microphone permission was not granted. Please click the camera/mic icon in the browser address bar to allow microphone access.');
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  toggleVoiceInput(): void {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening(): void {
    if (!this.recognition) {
      alert('Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.');
      return;
    }

    this.stopSpeaking();
    const currentOption = this.supportedLanguages.find(l => l.name === this.selectedLanguage);
    this.recognition.lang = currentOption ? currentOption.locale : 'en-IN';
    this.question = '';
    this.isListening = true;

    try {
      this.recognition.abort();
    } catch (e) {}

    try {
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {}
      this.isListening = false;
    }
  }

  toggleAutoSpeak(): void {
    this.autoSpeak = !this.autoSpeak;
    if (!this.autoSpeak) {
      this.stopSpeaking();
    }
  }

  toggleSpeakMessage(text: string, index: number): void {
    if (this.currentlySpeakingIndex === index) {
      this.stopSpeaking();
    } else {
      this.speakText(text, index);
    }
  }

  speakText(text: string, index?: number): void {
    if (!this.synth) return;

    this.stopSpeaking();

    const cleanText = this.cleanForVoice(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const currentOption = this.supportedLanguages.find(l => l.name === this.selectedLanguage);
    const locale = currentOption ? currentOption.locale : 'en-IN';
    utterance.lang = locale;
    utterance.rate = 0.95;

    const voices = this.synth.getVoices();
    const matchedVoice = voices.find(v => v.lang === locale || v.lang.startsWith(locale.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (index !== undefined) {
      this.currentlySpeakingIndex = index;
    }

    utterance.onend = () => {
      this.currentlySpeakingIndex = null;
    };

    utterance.onerror = () => {
      this.currentlySpeakingIndex = null;
    };

    this.synth.speak(utterance);
  }

  stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentlySpeakingIndex = null;
  }

  private cleanForVoice(raw: string): string {
    return raw
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/>\s*⚠️\s*/g, 'Notice: ')
      .replace(/>\s*/g, '')
      .replace(/---/g, '')
      .replace(/₹/g, 'Rupees ')
      .replace(/[%]/g, ' percent ')
      .replace(/[\u{1F300}-\u{1F9FF}]/gu, '')
      .replace(/[-*•]\s+/g, '. ')
      .replace(/\n+/g, '. ')
      .trim();
  }

  send(): void {
    const q = this.question.trim();
    if (!q || this.loading) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    this.messages.push({
      role: 'user',
      text: q,
      timestamp: now
    });

    this.question = '';
    this.loading = true;
    this.stopSpeaking();

    const request = {
      message: q,
      language: this.selectedLanguage,
      history: this.messages.map(m => ({ role: m.role, content: m.text }))
    };

    this.farmService.chat(request).subscribe({
      next: (response: any) => {
        let answer = '';

        if (typeof response === 'string') {
          answer = response;
        } else if (response?.formatted_markdown) {
          answer = response.formatted_markdown;
        } else if (response?.answer) {
          answer = response.answer;
        } else if (response?.message) {
          answer = response.message;
        } else if (response?.response) {
          answer = response.response;
        } else if (response?.structured?.short_answer) {
          answer = response.structured.short_answer;
        }

        if (!answer) {
          answer = 'I have analyzed your farm inquiry. Please follow balanced fertilization and disease inspection guidelines.';
        }

        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiMsgIndex = this.messages.length;

        this.messages.push({
          role: 'ai',
          text: answer,
          timestamp: replyTime
        });

        this.loading = false;

        if (this.autoSpeak) {
          setTimeout(() => this.speakText(answer, aiMsgIndex), 300);
        }
      },
      error: () => {
        this.messages.push({
          role: 'ai',
          text: '❌ Could not connect to the KrishiAI backend. Please ensure the server is running.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.loading = false;
      }
    });
  }

  askQuestion(q: string): void {
    this.question = q;
    this.send();
  }

  onLanguageChange(): void {
    this.updateSuggestedQuestions();
    this.stopSpeaking();
  }

  private updateSuggestedQuestions(): void {
    this.currentSuggestedQuestions = this.suggestedQuestionsDict[this.selectedLanguage] || this.suggestedQuestionsDict['English'];
  }

  getCurrentLanguageNativeName(): string {
    const match = this.supportedLanguages.find(l => l.name === this.selectedLanguage);
    return match ? match.nativeName : this.selectedLanguage;
  }

  getSuggestedLabel(): string {
    const map: Record<string, string> = {
      'English': 'Suggested Questions',
      'Hindi': 'सुझाए गए प्रश्न',
      'Marathi': 'सुचवलेले प्रश्न',
      'Bengali': 'প্রস্তাবিত প্রশ্নাবলী',
      'Tamil': 'பரிந்துரைக்கப்பட்ட கேள்விகள்',
      'Telugu': 'సిఫార్సు చేసిన ప్రశ్నలు',
      'Gujarati': 'સૂચવેલા પ્રશ્નો',
      'Punjabi': 'ਸੁਝਾਏ ਗਏ ਸਵਾਲ',
      'Kannada': 'ಸೂಚಿಸಲಾದ ಪ್ರಶ್ನೆಗಳು',
      'Malayalam': 'നിർദ്ദേശിച്ച ചോദ്യങ്ങൾ'
    };
    return map[this.selectedLanguage] || 'Suggested Questions';
  }

  getWelcomeTitle(): string {
    const map: Record<string, string> = {
      'English': 'How can I assist your farm today?',
      'Hindi': 'नमस्ते! आज मैं आपकी खेती में क्या मदद कर सकता हूँ?',
      'Marathi': 'नमस्कार! आज मी तुमच्या शेतीसाठी काय मदत करू शकतो?',
      'Bengali': 'নমস্কার! আজ আপনার খামারে কীভাবে সাহায্য করতে পারি?',
      'Tamil': 'வணக்கம்! இன்று உங்கள் விவசாயத்திற்கு நான் எவ்வாறு உதவ முடியும்?',
      'Telugu': 'నమస్కారం! ఈరోజు మీ వ్యవసాయంలో నేను ఎలా సహాయపడగలను?',
      'Gujarati': 'નમસ્તે! આજે હું તમારી ખેતીમાં કેવી રીતે મદદ કરી શકું?',
      'Punjabi': 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਖੇਤੀ ਵਿੱਚ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
      'Kannada': 'ನಮಸ್ಕಾರ! ಇಂದು ನಿಮ್ಮ ಕೃಷಿಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?',
      'Malayalam': 'നമസ്കാരം! ഇന്ന് നിങ്ങളുടെ കൃഷിയിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?'
    };
    return map[this.selectedLanguage] || 'How can I assist your farm today?';
  }

  getWelcomeSubtitle(): string {
    const map: Record<string, string> = {
      'English': 'Speak or type questions about crops, soil health, plant diseases, fertilizers, and irrigation.',
      'Hindi': 'फसल, मिट्टी स्वास्थ्य, रोग पहचान, खाद और सिंचाई के बारे में बोलकर या लिखकर पूछें।',
      'Marathi': 'पीक, माती आरोग्य, वनस्पती रोग, खते आणि सिंचनाबद्दल आवाजाने किंवा लिहून विचारा.',
      'Bengali': 'ফসল, মাটি, রোগের লক্ষণ, সার ও সেচ সম্পর্কে মুখে বলে বা লিখে জিজ্ঞাসা করুন।',
      'Tamil': 'பயிர், மண் வளம், நோய், உரம் மற்றும் நீர்ப்பாசனம் பற்றி குரல் மூலமாகவோ தட்டச்சு செய்தோ கேளுங்கள்.',
      'Telugu': 'పంటలు, నేల ఆరోగ్యం, తెగుళ్లు, ఎరువులు మరియు సాగునీటి గురించి మాట్లాడి లేదా టైప్ చేసి అడగండి.',
      'Gujarati': 'પાક, જમીન, રોગ, ખાતર અને પિયત વિશે બોલીને અથવા લખીને પૂછો.',
      'Punjabi': 'ਫ਼ਸਲਾਂ, ਮਿੱਟੀ, ਰੋਗ, ਖਾਦਾਂ ਅਤੇ ਸਿੰਚਾਈ ਬਾਰੇ ਬੋਲ ਕੇ ਜਾਂ ਲਿਖ ਕੇ ਪੁੱਛੋ।',
      'Kannada': 'ಬೆಳೆಗಳು, ಮಣ್ಣಿನ ಆರೋಗ್ಯ, ರೋಗಗಳು, ಗೊಬ್ಬರ ಮತ್ತು ನೀರಾವರಿ ಬಗ್ಗೆ ಮಾತನಾಡಿ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ ಕೇಳಿ.',
      'Malayalam': 'വിളകൾ, മണ്ണ്, രോഗങ്ങൾ, വളം, ജലസേചനം എന്നിവയെക്കുറിച്ച് സംസാരിച്ചോ ടൈപ്പ് ചെയ്തോ ചോദിക്കുക.'
    };
    return map[this.selectedLanguage] || 'Speak or type questions about crops, soil health, plant diseases, fertilizers, and irrigation.';
  }

  getInputPlaceholder(): string {
    const map: Record<string, string> = {
      'English': 'Type or tap 🎤 to ask in English...',
      'Hindi': 'यहाँ लिखें या 🎤 दबाकर हिन्दी में बोलें...',
      'Marathi': 'येथे टाईप करा किंवा 🎤 दाबून मराठीत बोला...',
      'Bengali': 'লিখুন বা 🎤 চাপ দিয়ে বাংলায় বলুন...',
      'Tamil': 'இங்கே தட்டச்சு செய்யவும் அல்லது 🎤 அழுத்தி தமிழில் பேசவும்...',
      'Telugu': 'టైప్ చేయండి లేదా 🎤 నొక్కి తెలుగులో మాట్లాడండి...',
      'Gujarati': 'અહીં લખો અથવા 🎤 દબાવીને ગુજરાતીમાં બોલો...',
      'Punjabi': 'ਇੱਥੇ ਲਿਖੋ ਜਾਂ 🎤 ਦਬਾ ਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ...',
      'Kannada': 'ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ ಅಥವಾ 🎤 ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ...',
      'Malayalam': 'ഇവിടെ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ 🎤 അമർത്തി സംസാരിക്കുക...'
    };
    return map[this.selectedLanguage] || 'Type or tap 🎤 to ask...';
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }
}

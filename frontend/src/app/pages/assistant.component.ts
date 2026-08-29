import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmService } from '../services/farm.service';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="assistant-page">

      <header class="top-bar">
        <div class="brand">
          <div class="logo">🌾</div>

          <div>
            <div class="brand-name">KrishiAI</div>
            <div class="brand-subtitle">SMART FARMING</div>
          </div>
        </div>
      </header>

      <main class="assistant-container">

        <div class="assistant-card">

          <div class="assistant-header">

            <div class="assistant-info">

              <div class="bot-icon">
                🤖
              </div>

              <div>
                <h2>KrishiAI Assistant</h2>

                <div class="status">
                  <span class="status-dot"></span>
                  Ready • Grounded agricultural guidance
                </div>
              </div>

            </div>

            <select [(ngModel)]="language">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>

          </div>

          <div class="chat-area">

            <div
              class="empty-message"
              *ngIf="messages.length === 0"
            >
              <div class="empty-icon">🌱</div>

              <h3>How can I help you?</h3>

              <p>
                Ask me about crops, soil, disease,
                fertilizer, irrigation or farming.
              </p>
            </div>

            <div
              class="message-row"
              *ngFor="let message of messages"
              [class.user-row]="message.role === 'user'"
              [class.ai-row]="message.role === 'ai'"
            >

              <div
                class="message"
                [class.user-message]="message.role === 'user'"
                [class.ai-message]="message.role === 'ai'"
              >
                {{ message.text }}

                <div class="message-label">
                  {{ message.role === 'user' ? 'You' : 'KrishiAI' }}
                </div>
              </div>

            </div>

            <div
              class="typing"
              *ngIf="loading"
            >
              🤖 KrishiAI is thinking...
            </div>

          </div>

          <div class="input-area">

            <input
              type="text"
              [(ngModel)]="question"
              (keyup.enter)="send()"
              placeholder="Ask about crops, soil, disease, fertilizer, irrigation..."
              [disabled]="loading"
            />

            <button
              type="button"
              (click)="send()"
              [disabled]="loading || !question.trim()"
            >
              ➤
            </button>

          </div>

        </div>

      </main>

      <nav class="bottom-nav">

        <button type="button" (click)="goHome()">
          🏠
          <span>Farm</span>
        </button>

        <button type="button" (click)="goCrop()">
          🌱
          <span>Crop</span>
        </button>

        <button type="button" (click)="goSoil()">
          🌿
          <span>Plant</span>
        </button>

        <button type="button" class="active">
          🤖
          <span>Ask AI</span>
        </button>

      </nav>

    </div>
  `,

  styles: [`
    * {
      box-sizing: border-box;
    }

    .assistant-page {
      min-height: 100vh;
      background: #f5f8f5;
      color: #17231d;
      padding-bottom: 70px;
    }

    .top-bar {
      height: 72px;
      background: white;
      border-bottom: 1px solid #e2e8e3;
      display: flex;
      align-items: center;
      padding: 0 28px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .logo {
      font-size: 30px;
    }

    .brand-name {
      font-size: 20px;
      font-weight: 700;
      color: #123d2a;
    }

    .brand-subtitle {
      font-size: 8px;
      letter-spacing: 2px;
      color: #6a8174;
    }

    .assistant-container {
      max-width: 900px;
      margin: 24px auto;
      padding: 0 16px;
    }

    .assistant-card {
      height: calc(100vh - 170px);
      min-height: 500px;
      background: white;
      border: 1px solid #dfe7e1;
      border-radius: 18px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.04);
    }

    .assistant-header {
      min-height: 88px;
      padding: 16px 22px;
      border-bottom: 1px solid #e1e8e3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }

    .assistant-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bot-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #e8f3eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
    }

    .assistant-info h2 {
      margin: 0;
      font-size: 17px;
    }

    .status {
      margin-top: 5px;
      font-size: 11px;
      color: #578066;
    }

    .status-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #16834f;
      margin-right: 4px;
    }

    select {
      border: 1px solid #dce5df;
      background: white;
      border-radius: 10px;
      padding: 11px 15px;
      font-size: 14px;
    }

    .chat-area {
      flex: 1;
      overflow-y: auto;
      padding: 25px;
    }

    .empty-message {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #718178;
    }

    .empty-icon {
      font-size: 45px;
      margin-bottom: 10px;
    }

    .empty-message h3 {
      color: #294335;
      margin: 5px 0;
    }

    .empty-message p {
      max-width: 400px;
      line-height: 1.5;
      font-size: 14px;
    }

    .message-row {
      display: flex;
      margin-bottom: 18px;
    }

    .user-row {
      justify-content: flex-end;
    }

    .ai-row {
      justify-content: flex-start;
    }

    .message {
      max-width: 75%;
      padding: 14px 17px;
      border-radius: 15px;
      font-size: 15px;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .user-message {
      background: #e6f1e9;
      border-top-right-radius: 4px;
    }

    .ai-message {
      background: #f7f9f7;
      border: 1px solid #e3e9e4;
      border-top-left-radius: 4px;
    }

    .message-label {
      font-size: 9px;
      color: #819088;
      margin-top: 7px;
    }

    .user-message .message-label {
      text-align: right;
    }

    .typing {
      color: #688071;
      font-size: 13px;
      padding: 10px;
    }

    .input-area {
      padding: 14px;
      border-top: 1px solid #e1e8e3;
      display: flex;
      gap: 9px;
    }

    .input-area input {
      flex: 1;
      min-width: 0;
      border: 1px solid #dce5df;
      border-radius: 11px;
      padding: 14px;
      font-size: 15px;
      outline: none;
    }

    .input-area input:focus {
      border-color: #16834f;
    }

    .input-area button {
      width: 50px;
      border: none;
      border-radius: 11px;
      background: #087443;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    .input-area button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: white;
      border-top: 1px solid #dfe7e1;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }

    .bottom-nav button {
      border: none;
      background: transparent;
      color: #607168;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      font-size: 18px;
    }

    .bottom-nav span {
      font-size: 10px;
    }

    .bottom-nav .active {
      color: #087443;
    }

    @media (max-width: 600px) {

      .top-bar {
        padding: 0 15px;
      }

      .assistant-container {
        margin: 10px auto;
        padding: 0 8px;
      }

      .assistant-card {
        height: calc(100vh - 145px);
        min-height: 450px;
      }

      .assistant-header {
        padding: 12px;
      }

      .chat-area {
        padding: 15px;
      }

      .message {
        max-width: 88%;
      }

      select {
        padding: 8px;
      }
    }
  `]
})
export class AssistantComponent {

  private farmService = inject(FarmService);

  question = '';

  language = 'English';

  loading = false;

  messages: ChatMessage[] = [];

  send(): void {

    const q = this.question.trim();

    if (!q || this.loading) {
      return;
    }

    this.messages.push({
      role: 'user',
      text: q
    });

    this.question = '';
    this.loading = true;

    const request = {
      message: q,
      language: this.language,
      history: []
    };

    console.log('Sending AI request:', request);

    this.farmService.chat(request).subscribe({

      next: (response: any) => {

        console.log('AI response:', response);

        let answer = '';

        if (typeof response === 'string') {
          answer = response;
        } else if (response?.answer) {
          answer = response.answer;
        } else if (response?.message) {
          answer = response.message;
        } else if (response?.response) {
          answer = response.response;
        }

        if (!answer) {
          answer =
            'The backend responded, but no answer was returned.';
        }

        this.messages.push({
          role: 'ai',
          text: answer
        });

        this.loading = false;
      },

      error: (error: any) => {

        console.error('AI BACKEND ERROR:', error);

        this.messages.push({
          role: 'ai',
          text:
            '❌ I could not connect to the KrishiAI backend. Please make sure the FastAPI server and Ollama are running.'
        });

        this.loading = false;
      }

    });
  }

  goHome(): void {
    window.location.href = '/';
  }

  goCrop(): void {
    window.location.href = '/crop';
  }

  goSoil(): void {
    window.location.href = '/soil';
  }
}
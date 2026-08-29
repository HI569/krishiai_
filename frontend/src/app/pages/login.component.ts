import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="auth-page">

      <!-- LEFT SIDE -->
      <section class="visual-panel">

        <div class="brand">
          <div class="brand-icon">🌾</div>

          <div>
            <strong>Krishi<span>AI</span></strong>
            <small>SMART FARMING</small>
          </div>
        </div>

        <div class="visual-content">

          <div class="tag">
            🌱 AI-powered agriculture
          </div>

          <h1>
            Grow smarter.<br>
            <em>Farm better.</em>
          </h1>

          <p>
            Connect with KrishiAI to save your farm preferences,
            access personalized insights and get smarter farming
            recommendations.
          </p>

          <div class="benefits">

            <div class="benefit">
              <div class="benefit-icon">🌱</div>
              <div>
                <strong>Smart Crop Recommendations</strong>
                <span>Find crops suited to your farm.</span>
              </div>
            </div>

            <div class="benefit">
              <div class="benefit-icon">🧪</div>
              <div>
                <strong>Soil Intelligence</strong>
                <span>Understand your soil and nutrients.</span>
              </div>
            </div>

            <div class="benefit">
              <div class="benefit-icon">🤖</div>
              <div>
                <strong>AI Farmer Assistant</strong>
                <span>Get practical farming guidance.</span>
              </div>
            </div>

          </div>

        </div>

        <div class="visual-footer">
          <span>🌍 Built for modern farmers</span>
          <span>•</span>
          <span>AI • ML • Agriculture</span>
        </div>

      </section>


      <!-- RIGHT SIDE -->
      <section class="form-panel">

        <button class="close-btn" type="button" (click)="goHome()">
          ✕
        </button>

        <div class="auth-container">

          <!-- MOBILE BRAND -->
          <div class="mobile-brand">
            <div class="mobile-brand-icon">🌾</div>
            <strong>Krishi<span>AI</span></strong>
          </div>


          <!-- TITLE -->
          <div class="auth-header">

            <div class="welcome-icon">
              {{ isRegister ? '✨' : '👋' }}
            </div>

            <h2>
              {{ isRegister ? 'Create your account' : 'Welcome back' }}
            </h2>

            <p>
              {{
                isRegister
                  ? 'Join KrishiAI and personalize your farming experience.'
                  : 'Sign in to continue to your KrishiAI account.'
              }}
            </p>

          </div>


          <!-- SUCCESS MESSAGE -->
          <div class="success-message" *ngIf="successMessage">
            <span>✓</span>
            {{ successMessage }}
          </div>


          <!-- ERROR -->
          <div class="error-message" *ngIf="errorMessage">
            <span>!</span>
            {{ errorMessage }}
          </div>


          <!-- LOGIN / REGISTER FORM -->
          <form (ngSubmit)="submitForm()" *ngIf="loginMethod === 'email'">

            <!-- NAME -->
            <div class="input-group" *ngIf="isRegister">

              <label>Full name</label>

              <div class="input-wrapper">
                <span class="input-icon">👤</span>

                <input
                  type="text"
                  name="name"
                  [(ngModel)]="name"
                  placeholder="Enter your name"
                  autocomplete="name"
                />
              </div>

            </div>


            <!-- EMAIL -->
            <div class="input-group">

              <label>Email address</label>

              <div class="input-wrapper">
                <span class="input-icon">✉</span>

                <input
                  type="email"
                  name="email"
                  [(ngModel)]="email"
                  placeholder="you@example.com"
                  autocomplete="email"
                />
              </div>

            </div>


            <!-- PASSWORD -->
            <div class="input-group">

              <div class="label-row">
                <label>Password</label>

                <button
                  type="button"
                  class="forgot-btn"
                  *ngIf="!isRegister"
                  (click)="forgotPassword()"
                >
                  Forgot password?
                </button>
              </div>

              <div class="input-wrapper">
                <span class="input-icon">🔒</span>

                <input
                  [type]="showPassword ? 'text' : 'password'"
                  name="password"
                  [(ngModel)]="password"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                />

                <button
                  type="button"
                  class="eye-btn"
                  (click)="showPassword = !showPassword"
                >
                  {{ showPassword ? '🙈' : '👁' }}
                </button>
              </div>

            </div>


            <!-- REMEMBER -->
            <label class="remember" *ngIf="!isRegister">

              <input
                type="checkbox"
                name="remember"
                [(ngModel)]="rememberMe"
              />

              <span>Remember me</span>

            </label>


            <!-- SUBMIT -->
            <button
              class="primary-btn"
              type="submit"
              [disabled]="loading"
            >

              <span *ngIf="!loading">
                {{ isRegister ? 'Create Account' : 'Sign In' }}
              </span>

              <span *ngIf="loading">
                {{ isRegister ? 'Creating account...' : 'Signing in...' }}
              </span>

              <span *ngIf="!loading">→</span>

            </button>

          </form>


          <!-- PHONE LOGIN -->
          <div *ngIf="loginMethod === 'phone'">

            <div class="input-group">

              <label>Phone number</label>

              <div class="phone-input">

                <select
                  [(ngModel)]="countryCode"
                  name="countryCode"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>

                <input
                  type="tel"
                  name="phone"
                  [(ngModel)]="phone"
                  placeholder="9876543210"
                  maxlength="10"
                />

              </div>

            </div>


            <div class="input-group" *ngIf="otpSent">

              <label>Enter OTP</label>

              <input
                class="otp-input"
                type="text"
                maxlength="6"
                name="otp"
                [(ngModel)]="otp"
                placeholder="• • • • • •"
              />

              <small>
                Demo OTP: <strong>123456</strong>
              </small>

            </div>


            <button
              class="primary-btn"
              type="button"
              (click)="phoneLogin()"
              [disabled]="loading"
            >

              {{
                otpSent
                  ? 'Verify OTP'
                  : 'Send OTP'
              }}

              <span>→</span>

            </button>

          </div>


          <!-- DIVIDER -->
          <div class="divider">
            <span>OR CONTINUE WITH</span>
          </div>


          <!-- GOOGLE -->
          <button
            class="google-btn"
            type="button"
            (click)="googleLogin()"
          >
            <span class="google-logo">G</span>
            Continue with Google
          </button>


          <!-- PHONE -->
          <button
            class="phone-btn"
            type="button"
            (click)="switchToPhone()"
          >
            <span>📱</span>

            {{
              loginMethod === 'phone'
                ? 'Use email instead'
                : 'Continue with phone'
            }}
          </button>


          <!-- GUEST -->
          <button
            class="guest-btn"
            type="button"
            (click)="continueAsGuest()"
          >
            Continue as Guest
          </button>


          <!-- SWITCH -->
          <div class="switch-auth">

            <span>
              {{
                isRegister
                  ? 'Already have an account?'
                  : "Don't have an account?"
              }}
            </span>

            <button
              type="button"
              (click)="toggleMode()"
            >
              {{
                isRegister
                  ? 'Sign in'
                  : 'Create account'
              }}
            </button>

          </div>


          <p class="privacy">
            By continuing, you agree to KrishiAI's
            <a href="javascript:void(0)">Terms</a>
            and
            <a href="javascript:void(0)">Privacy Policy</a>.
          </p>

        </div>

      </section>

    </div>
  `,

  styles: [`

    :host {
      display: block;
      min-height: 100vh;
    }

    * {
      box-sizing: border-box;
    }


    /* PAGE */

    .auth-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 46% 54%;
      background: #ffffff;
    }


    /* LEFT PANEL */

    .visual-panel {
      position: relative;
      overflow: hidden;
      padding: 38px 55px;
      background:
        radial-gradient(
          circle at 75% 15%,
          rgba(105, 190, 132, .35),
          transparent 28%
        ),
        linear-gradient(
          145deg,
          #063d2c 0%,
          #087f4e 55%,
          #0b9b62 100%
        );
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }


    .visual-panel::before {
      content: '';
      position: absolute;
      width: 420px;
      height: 420px;
      border-radius: 50%;
      right: -170px;
      bottom: -170px;
      border: 1px solid rgba(255,255,255,.15);
    }


    .visual-panel::after {
      content: '';
      position: absolute;
      width: 280px;
      height: 280px;
      border-radius: 50%;
      left: -150px;
      bottom: 100px;
      background: rgba(255,255,255,.05);
    }


    /* BRAND */

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 2;
    }

    .brand-icon {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      background: rgba(255,255,255,.16);
      font-size: 25px;
      backdrop-filter: blur(8px);
    }

    .brand strong {
      display: block;
      font-size: 24px;
      letter-spacing: -.5px;
    }

    .brand strong span,
    .mobile-brand strong span {
      color: #b8f1c9;
    }

    .brand small {
      display: block;
      margin-top: 2px;
      font-size: 8px;
      letter-spacing: 2px;
      opacity: .7;
    }


    /* LEFT CONTENT */

    .visual-content {
      max-width: 540px;
      position: relative;
      z-index: 2;
      margin-top: -30px;
    }

    .tag {
      display: inline-flex;
      padding: 8px 13px;
      border-radius: 100px;
      background: rgba(255,255,255,.12);
      border: 1px solid rgba(255,255,255,.18);
      font-size: 12px;
      margin-bottom: 22px;
      backdrop-filter: blur(8px);
    }

    .visual-content h1 {
      margin: 0;
      font-size: clamp(42px, 4vw, 62px);
      line-height: 1.04;
      letter-spacing: -2px;
    }

    .visual-content h1 em {
      font-style: normal;
      color: #b9f3ca;
    }

    .visual-content > p {
      max-width: 490px;
      margin: 24px 0 30px;
      line-height: 1.7;
      font-size: 16px;
      color: rgba(255,255,255,.78);
    }


    /* BENEFITS */

    .benefits {
      display: grid;
      gap: 12px;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 13px;
      border-radius: 14px;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.10);
      backdrop-filter: blur(8px);
    }

    .benefit-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      border-radius: 11px;
      display: grid;
      place-items: center;
      background: rgba(255,255,255,.12);
      font-size: 20px;
    }

    .benefit strong {
      display: block;
      font-size: 13px;
    }

    .benefit span {
      display: block;
      margin-top: 3px;
      font-size: 11px;
      color: rgba(255,255,255,.62);
    }


    .visual-footer {
      position: relative;
      z-index: 2;
      display: flex;
      gap: 10px;
      font-size: 11px;
      color: rgba(255,255,255,.55);
    }


    /* RIGHT */

    .form-panel {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 35px;
      overflow-y: auto;
    }


    .close-btn {
      position: absolute;
      top: 24px;
      right: 28px;
      width: 38px;
      height: 38px;
      border: 1px solid #e4ebe7;
      background: white;
      border-radius: 50%;
      color: #71827b;
      cursor: pointer;
      transition: .2s;
    }

    .close-btn:hover {
      background: #f1f7f3;
      color: #087f4e;
      transform: rotate(90deg);
    }


    .auth-container {
      width: 100%;
      max-width: 440px;
    }


    /* HEADER */

    .auth-header {
      margin-bottom: 27px;
    }

    .welcome-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: #edf8f1;
      display: grid;
      place-items: center;
      font-size: 22px;
      margin-bottom: 15px;
    }

    .auth-header h2 {
      margin: 0;
      color: #123f31;
      font-size: 31px;
      letter-spacing: -.8px;
    }

    .auth-header p {
      margin: 8px 0 0;
      color: #7b8b84;
      font-size: 14px;
      line-height: 1.5;
    }


    /* INPUTS */

    .input-group {
      margin-bottom: 17px;
    }

    .input-group label,
    .label-row label {
      display: block;
      margin-bottom: 7px;
      color: #29483d;
      font-size: 13px;
      font-weight: 700;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .input-wrapper {
      height: 50px;
      display: flex;
      align-items: center;
      border: 1px solid #d9e4de;
      border-radius: 11px;
      background: #fbfdfc;
      transition: .2s;
    }

    .input-wrapper:focus-within {
      border-color: #087f4e;
      background: white;
      box-shadow: 0 0 0 4px rgba(8,127,78,.08);
    }

    .input-icon {
      width: 43px;
      text-align: center;
      opacity: .65;
      font-size: 15px;
    }

    .input-wrapper input {
      min-width: 0;
      flex: 1;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      color: #173d30;
      font-size: 14px;
    }

    .input-wrapper input::placeholder {
      color: #a0aaa5;
    }


    .eye-btn {
      border: none;
      background: transparent;
      cursor: pointer;
      margin-right: 10px;
      opacity: .7;
    }


    .forgot-btn {
      border: none;
      background: transparent;
      color: #087f4e;
      cursor: pointer;
      font-size: 11px;
      font-weight: 600;
    }


    /* REMEMBER */

    .remember {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #687b72;
      font-size: 12px;
      margin: 2px 0 18px;
      cursor: pointer;
    }

    .remember input {
      accent-color: #087f4e;
    }


    /* PRIMARY */

    .primary-btn {
      width: 100%;
      height: 51px;
      border: none;
      border-radius: 11px;
      background: #087f4e;
      color: white;
      font-size: 14px;
      font-weight: 750;
      cursor: pointer;
      box-shadow: 0 7px 18px rgba(8,127,78,.18);
      transition: .2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .primary-btn:hover {
      background: #066b42;
      transform: translateY(-1px);
    }

    .primary-btn:disabled {
      opacity: .6;
      cursor: wait;
      transform: none;
    }


    /* DIVIDER */

    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 22px 0 16px;
    }

    .divider::before,
    .divider::after {
      content: '';
      height: 1px;
      background: #e7ece9;
      flex: 1;
    }

    .divider span {
      color: #9aa6a1;
      font-size: 9px;
      letter-spacing: 1px;
      white-space: nowrap;
    }


    /* SOCIAL BUTTONS */

    .google-btn,
    .phone-btn {
      width: 100%;
      height: 48px;
      border-radius: 11px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 650;
      transition: .2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .google-btn {
      border: 1px solid #dce4e0;
      background: white;
      color: #29483d;
    }

    .google-btn:hover {
      background: #f8faf9;
      border-color: #c5d3cc;
    }

    .google-logo {
      font-weight: 900;
      font-size: 18px;
    }


    .phone-btn {
      margin-top: 10px;
      border: 1px solid #d7e8de;
      background: #f2f9f5;
      color: #087f4e;
    }

    .phone-btn:hover {
      background: #e7f5ed;
    }


    /* GUEST */

    .guest-btn {
      width: 100%;
      margin-top: 15px;
      padding: 10px;
      border: none;
      background: transparent;
      color: #71827b;
      cursor: pointer;
      font-size: 12px;
      font-weight: 650;
    }

    .guest-btn:hover {
      color: #087f4e;
    }


    /* SWITCH */

    .switch-auth {
      text-align: center;
      margin-top: 19px;
      color: #7b8983;
      font-size: 12px;
    }

    .switch-auth button {
      border: none;
      background: transparent;
      color: #087f4e;
      font-weight: 750;
      cursor: pointer;
      margin-left: 4px;
    }


    /* PRIVACY */

    .privacy {
      text-align: center;
      margin: 20px auto 0;
      max-width: 350px;
      color: #a0aaa5;
      font-size: 9px;
      line-height: 1.5;
    }

    .privacy a {
      color: #6f8278;
      text-decoration: none;
    }


    /* PHONE */

    .phone-input {
      display: flex;
      height: 50px;
      border: 1px solid #d9e4de;
      border-radius: 11px;
      overflow: hidden;
      background: #fbfdfc;
    }

    .phone-input:focus-within {
      border-color: #087f4e;
      box-shadow: 0 0 0 4px rgba(8,127,78,.08);
    }

    .phone-input select {
      width: 100px;
      border: none;
      border-right: 1px solid #e2e9e5;
      outline: none;
      background: white;
      padding: 0 10px;
      color: #29483d;
    }

    .phone-input input {
      flex: 1;
      border: none;
      outline: none;
      padding: 0 14px;
      background: transparent;
      font-size: 14px;
    }

    .otp-input {
      width: 100%;
      height: 52px;
      border: 1px solid #d9e4de;
      border-radius: 11px;
      text-align: center;
      letter-spacing: 8px;
      font-size: 20px;
      outline: none;
    }

    .otp-input:focus {
      border-color: #087f4e;
      box-shadow: 0 0 0 4px rgba(8,127,78,.08);
    }

    .input-group small {
      display: block;
      margin-top: 7px;
      color: #87958f;
      font-size: 11px;
    }


    /* MESSAGES */

    .error-message,
    .success-message {
      padding: 11px 13px;
      border-radius: 9px;
      margin-bottom: 16px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .error-message {
      background: #fff3f2;
      color: #a52a21;
      border: 1px solid #ffd9d5;
    }

    .success-message {
      background: #effaf3;
      color: #197040;
      border: 1px solid #ccebd7;
    }


    /* MOBILE BRAND */

    .mobile-brand {
      display: none;
    }


    /* MOBILE */

    @media (max-width: 900px) {

      .auth-page {
        grid-template-columns: 1fr;
      }

      .visual-panel {
        display: none;
      }

      .form-panel {
        min-height: 100vh;
        padding: 75px 22px 35px;
      }

      .mobile-brand {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 38px;
        color: #123f31;
      }

      .mobile-brand-icon {
        width: 40px;
        height: 40px;
        border-radius: 11px;
        display: grid;
        place-items: center;
        background: #edf8f1;
      }

      .mobile-brand strong {
        font-size: 21px;
      }

    }


    @media (max-width: 500px) {

      .form-panel {
        padding-left: 18px;
        padding-right: 18px;
      }

      .auth-header h2 {
        font-size: 27px;
      }

      .close-btn {
        top: 15px;
        right: 15px;
      }

    }

  `]
})
export class LoginComponent {

  private router = inject(Router);

  isRegister = false;

  loginMethod: 'email' | 'phone' = 'email';

  name = '';
  email = '';
  password = '';

  phone = '';
  countryCode = '+91';
  otp = '';
  otpSent = false;

  showPassword = false;
  rememberMe = true;

  loading = false;

  errorMessage = '';
  successMessage = '';


  toggleMode(): void {

    this.isRegister = !this.isRegister;

    this.clearMessages();

    this.password = '';
  }


  switchToPhone(): void {

    this.clearMessages();

    if (this.loginMethod === 'phone') {
      this.loginMethod = 'email';
      this.otpSent = false;
      return;
    }

    this.loginMethod = 'phone';
  }


  submitForm(): void {

    this.clearMessages();

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email address.';
      return;
    }

    if (!this.email.includes('@')) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (!this.password) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage =
        'Password must contain at least 6 characters.';
      return;
    }

    if (this.isRegister && !this.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return;
    }


    this.loading = true;


    /*
     * FRONTEND DEMO AUTHENTICATION
     *
     * This stores the account locally until a real
     * authentication backend/Firebase is connected.
     */

    setTimeout(() => {

      const user = {
        name: this.name || this.email.split('@')[0],
        email: this.email,
        loggedIn: true
      };

      localStorage.setItem(
        'krishiAI_user',
        JSON.stringify(user)
      );

      if (this.rememberMe) {
        localStorage.setItem(
          'krishiAI_loggedIn',
          'true'
        );
      }

      this.loading = false;

      this.successMessage = this.isRegister
        ? 'Account created successfully!'
        : 'Login successful!';


      setTimeout(() => {
        this.router.navigate(['/']);
      }, 700);

    }, 700);
  }


  phoneLogin(): void {

    this.clearMessages();

    if (!this.phone || this.phone.length < 10) {
      this.errorMessage =
        'Please enter a valid 10-digit phone number.';
      return;
    }


    if (!this.otpSent) {

      this.loading = true;

      setTimeout(() => {

        this.loading = false;
        this.otpSent = true;

        this.successMessage =
          'OTP sent successfully.';

      }, 700);

      return;
    }


    if (this.otp !== '123456') {

      this.errorMessage =
        'Incorrect OTP. For this demo, use 123456.';

      return;
    }


    this.loading = true;

    setTimeout(() => {

      localStorage.setItem(
        'krishiAI_user',
        JSON.stringify({
          name: 'KrishiAI Farmer',
          phone: this.countryCode + this.phone,
          loggedIn: true
        })
      );

      localStorage.setItem(
        'krishiAI_loggedIn',
        'true'
      );

      this.loading = false;

      this.successMessage =
        'Phone verification successful!';

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 700);

    }, 700);
  }


  googleLogin(): void {

    this.clearMessages();

    /*
     * Real Google login requires Firebase/Google OAuth.
     * We intentionally don't fake Google authentication.
     */

    this.errorMessage =
      'Google sign-in needs to be connected to Firebase or Google OAuth. Your other login options are ready to use.';

  }


  forgotPassword(): void {

    this.clearMessages();

    if (!this.email) {
      this.errorMessage =
        'Enter your email address first.';
      return;
    }

    this.successMessage =
      'Password reset instructions would be sent to your email once a real authentication service is connected.';
  }


  continueAsGuest(): void {

    localStorage.setItem(
      'krishiAI_guest',
      'true'
    );

    localStorage.removeItem(
      'krishiAI_loggedIn'
    );

    this.router.navigate(['/']);
  }


  goHome(): void {
    this.router.navigate(['/']);
  }


  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

}
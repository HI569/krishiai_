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
    * {
      box-sizing: border-box;
    }

    :host {
      display: block;
      min-height: 100vh;
    }

    .auth-page {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 46% 54%;
      background: #08120f;
      color: #f3f9f4;
      font-family: inherit;
    }

    /* LEFT VISUAL PANEL */
    .visual-panel {
      position: relative;
      overflow: hidden;
      padding: 48px 55px;
      background: radial-gradient(circle at 80% 20%, rgba(0, 255, 148, 0.15), transparent 45%),
                  linear-gradient(165deg, #0a1611 0%, #0d1e16 60%, #07120e 100%);
      border-right: 1px solid #1c2720;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
      z-index: 2;
    }

    .brand-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.28);
      font-size: 26px;
      box-shadow: 0 8px 20px rgba(0, 255, 148, 0.15);
    }

    .brand strong {
      display: block;
      font-size: 24px;
      font-weight: 850;
      letter-spacing: -0.5px;
    }

    .brand strong span {
      color: #7dff6f;
    }

    .brand small {
      display: block;
      font-size: 9px;
      letter-spacing: 2px;
      color: #8cff78;
      font-weight: 800;
    }

    .visual-content {
      position: relative;
      z-index: 2;
      margin: 40px 0;
    }

    .tag {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.25);
      color: #7dff6f;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.5px;
      margin-bottom: 20px;
    }

    .visual-content h1 {
      margin: 0 0 16px;
      font-size: clamp(34px, 3.8vw, 50px);
      line-height: 1.12;
      font-weight: 850;
      letter-spacing: -1px;
    }

    .visual-content h1 em {
      font-style: normal;
      background: linear-gradient(135deg, #7dff6f 0%, #36e89a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .visual-content p {
      color: #b7c8bc;
      font-size: 15px;
      line-height: 1.6;
      max-width: 440px;
      margin: 0 0 32px;
    }

    .benefits {
      display: flex;
      flex-direction: column;
      gap: 14px;
      max-width: 440px;
    }

    .benefit {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(18, 24, 21, 0.75);
      border: 1px solid #233027;
      backdrop-filter: blur(8px);
      border-radius: 16px;
      padding: 12px 16px;
      transition: all 0.2s;
    }

    .benefit:hover {
      border-color: rgba(125, 255, 111, 0.35);
      transform: translateX(4px);
    }

    .benefit-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.2);
      display: grid;
      place-items: center;
      font-size: 20px;
      flex-shrink: 0;
    }

    .benefit strong {
      display: block;
      font-size: 14px;
      color: #ffffff;
      font-weight: 750;
    }

    .benefit span {
      font-size: 12px;
      color: #92a397;
    }

    .visual-footer {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #6a8274;
      font-weight: 600;
    }

    /* RIGHT FORM PANEL */
    .form-panel {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 30px;
      background: #08120f;
    }

    .close-btn {
      position: absolute;
      top: 24px;
      right: 28px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1px solid #233027;
      background: #121815;
      color: #92a397;
      font-size: 16px;
      cursor: pointer;
      display: grid;
      place-items: center;
      transition: all 0.2s;
    }

    .close-btn:hover {
      border-color: #7dff6f;
      color: #7dff6f;
    }

    .auth-container {
      width: 100%;
      max-width: 440px;
    }

    .mobile-brand {
      display: none;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
    }

    .mobile-brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(125, 255, 111, 0.12);
      display: grid;
      place-items: center;
      font-size: 22px;
    }

    .mobile-brand strong {
      font-size: 22px;
      color: #ffffff;
    }
    .mobile-brand strong span {
      color: #7dff6f;
    }

    .auth-header {
      margin-bottom: 28px;
    }

    .welcome-icon {
      font-size: 32px;
      margin-bottom: 10px;
    }

    .auth-header h2 {
      margin: 0 0 6px;
      font-size: 30px;
      font-weight: 850;
      color: #ffffff;
      letter-spacing: -0.5px;
    }

    .auth-header p {
      margin: 0;
      color: #92a397;
      font-size: 14px;
      line-height: 1.5;
    }

    /* ALERTS */
    .success-box {
      background: rgba(54, 232, 154, 0.12);
      border: 1px solid rgba(54, 232, 154, 0.35);
      color: #36e89a;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 18px;
    }

    .error-box {
      background: rgba(255, 107, 107, 0.12);
      border: 1px solid rgba(255, 107, 107, 0.35);
      color: #ff8e8e;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      margin-bottom: 18px;
    }

    /* INPUT GROUPS */
    .input-group {
      margin-bottom: 18px;
    }

    .input-group label {
      display: block;
      font-size: 12px;
      font-weight: 750;
      color: #b7c8bc;
      margin-bottom: 6px;
      letter-spacing: 0.2px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-wrapper input {
      width: 100%;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 14px;
      padding: 13px 16px;
      color: #f1f7f2;
      font-size: 15px;
      outline: none;
      transition: all 0.2s;
    }

    .input-wrapper input:focus {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }

    .input-wrapper input::placeholder {
      color: #556c5f;
    }

    .toggle-pass {
      position: absolute;
      right: 14px;
      background: transparent;
      border: none;
      font-size: 16px;
      cursor: pointer;
      color: #8fa395;
    }

    /* PHONE INPUT */
    .phone-input {
      display: flex;
      gap: 10px;
    }

    .phone-input select {
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 14px;
      color: #f1f7f2;
      padding: 0 12px;
      font-size: 14px;
      font-weight: 700;
      outline: none;
      cursor: pointer;
    }

    .phone-input select option {
      background: #121815;
      color: #f1f7f2;
    }

    .phone-input input {
      flex: 1;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 14px;
      padding: 13px 16px;
      color: #f1f7f2;
      font-size: 15px;
      outline: none;
    }

    .phone-input input:focus {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }

    .otp-input {
      width: 100%;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 14px;
      padding: 13px 16px;
      color: #7dff6f;
      font-size: 18px;
      letter-spacing: 4px;
      text-align: center;
      outline: none;
    }

    .input-group small {
      display: block;
      margin-top: 6px;
      color: #789083;
      font-size: 12px;
    }

    .input-group small strong {
      color: #7dff6f;
    }

    /* REMEMBER ME */
    .remember-me {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #92a397;
      margin-bottom: 22px;
      cursor: pointer;
    }

    .remember-me input {
      accent-color: #7dff6f;
    }

    /* PRIMARY BUTTON */
    .primary-btn {
      width: 100%;
      background: #7dff6f;
      color: #07120a;
      border: none;
      border-radius: 14px;
      padding: 15px;
      font-size: 15px;
      font-weight: 850;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 10px 24px rgba(125, 255, 111, 0.28);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .primary-btn:hover:not(:disabled) {
      background: #8eff80;
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(125, 255, 111, 0.4);
    }

    .primary-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* DIVIDER */
    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 24px 0;
      color: #556c5e;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid #1c2720;
    }

    .divider span {
      padding: 0 12px;
    }

    /* SECONDARY BUTTONS */
    .google-btn,
    .phone-btn,
    .guest-btn {
      width: 100%;
      background: #121815;
      border: 1px solid #28372d;
      border-radius: 14px;
      padding: 13px;
      font-size: 14px;
      font-weight: 750;
      color: #dce7df;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 10px;
      transition: all 0.2s;
    }

    .google-btn:hover,
    .phone-btn:hover,
    .guest-btn:hover {
      background: #18221b;
      border-color: rgba(125, 255, 111, 0.4);
      color: #7dff6f;
    }

    .google-logo {
      font-weight: 900;
      color: #7dff6f;
    }

    /* SWITCH */
    .switch-auth {
      text-align: center;
      margin-top: 24px;
      font-size: 14px;
      color: #8fa395;
    }

    .switch-auth button {
      background: transparent;
      border: none;
      color: #7dff6f;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      margin-left: 6px;
    }

    .switch-auth button:hover {
      text-decoration: underline;
    }

    .privacy {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: #556c5e;
    }

    .privacy a {
      color: #8cff78;
      text-decoration: none;
    }

    /* RESPONSIVE */
    @media (max-width: 900px) {
      .auth-page {
        grid-template-columns: 1fr;
      }
      .visual-panel {
        display: none;
      }
      .mobile-brand {
        display: flex;
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
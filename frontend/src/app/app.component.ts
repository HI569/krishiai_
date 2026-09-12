import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
<header class="topbar">
  <a class="brand" routerLink="/">
    <span class="brandmark">🌾</span>
    <span>Krishi<span>AI</span><small>SMART FARMING</small></span>
  </a>
  <nav>
    <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
    <a routerLink="/dashboard" routerLinkActive="active">My Farm</a>
    <a routerLink="/crop" routerLinkActive="active">Find My Crop</a>
    <a routerLink="/soil" routerLinkActive="active">Soil Health</a>
    <a routerLink="/fertilizer" routerLinkActive="active">Fertilizer</a>
    <a routerLink="/yield" routerLinkActive="active">Yield</a>
    <a routerLink="/disaster" routerLinkActive="active">⚠️ Disaster Alert</a>
    <a routerLink="/weather" routerLinkActive="active">Spray Alert</a>
    <a routerLink="/mandi" routerLinkActive="active">Mandi Rates</a>
    <a routerLink="/health-card" routerLinkActive="active">Health Card</a>
    <a routerLink="/disease" routerLinkActive="active">Check Plant</a>
    <a routerLink="/assistant" routerLinkActive="active">Ask AI</a>
    <a routerLink="/knowledge" routerLinkActive="active">Knowledge</a>
  </nav>
  <a class="profile" routerLink="/login" title="Login / Account">
    👤
  </a>
</header>
<main>
  <router-outlet/>
</main>
<footer>
  <div>
    <b>🌾 KrishiAI</b>
    <p>Intelligent decisions for healthier farms.</p>
  </div>
  <div class="footer-contact">
    <a href="https://github.com/HI569" target="_blank" rel="noopener noreferrer" class="footer-link">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 4px;"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
      GitHub
    </a>
    <span class="footer-dot">•</span>
    <a href="mailto:himanshudas1333@gmail.com" class="footer-link">
      ✉️ himanshudas1333&#64;gmail.com
    </a>
  </div>
</footer>
<div class="mobile-nav">
  <a routerLink="/dashboard">⌂<small>Farm</small></a>
  <a routerLink="/crop">🌱<small>Crop</small></a>
  <a routerLink="/fertilizer">🌿<small>Fertilizer</small></a>
  <a routerLink="/yield">🌾<small>Yield</small></a>
  <a routerLink="/disaster">⚠️<small>Disaster</small></a>
  <a routerLink="/weather">🌦️<small>Weather</small></a>
  <a routerLink="/mandi">💰<small>Mandi</small></a>
  <a routerLink="/disease">🍃<small>Plant</small></a>
  <a routerLink="/assistant">🤖<small>Ask AI</small></a>
</div>
`
})
export class AppComponent {}
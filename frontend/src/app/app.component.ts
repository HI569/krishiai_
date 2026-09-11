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
  <span>AI-assisted • Farmer-first • Demo-ready</span>
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
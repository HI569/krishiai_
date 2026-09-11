import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-page">
      <!-- HERO -->
      <section class="hero">
        <div class="hero-copy">
          <div class="eyebrow">KRISHIAI • INTELLIGENT AGRICULTURE</div>
          <h1>Smart Farming Starts With <em>Better Decisions.</em></h1>
          <p>
            Hyperlocal crop recommendations, disaster early warning, plant disease vision diagnosis, soil telemetry, 
            fertilizer schedules, and an intelligent farming assistant — unified in one high-precision platform.
          </p>

          <div class="actions">
            <a routerLink="/assistant" class="btn primary">🤖 Ask AI Assistant</a>
            <a routerLink="/dashboard" class="btn secondary">📍 Analyze My Farm</a>
          </div>

          <div class="trust">
            <span>✓ Farmer-First Design</span>
            <span>✓ Explainable AI</span>
            <span>✓ Real-time Weather & Soil</span>
          </div>
        </div>

        <div class="hero-art">
          <div class="sun-glow"></div>
          <div class="hud-circle"></div>
          <div class="farmer-avatar">🧑‍🌾</div>
          
          <div class="float-card weather">
            <span class="card-icon">🌤️</span>
            <div>
              <b>28°C · Optimal</b>
              <small>Live Field Conditions</small>
            </div>
          </div>
          
          <div class="float-card ai">
            <span class="card-icon pulse-icon">✦</span>
            <div>
              <b>AI Advisory Active</b>
              <small>Low phosphorus detected</small>
            </div>
          </div>

          <div class="float-card radar">
            <span class="card-icon">📡</span>
            <div>
              <b>Disaster Radar</b>
              <small>Safe Spray Window: 48h</small>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURE GRID -->
      <section class="quick">
        <div class="section-header">
          <span class="eyebrow">INTELLIGENCE SUITE</span>
          <h2>Everything your farm needs to decide smarter.</h2>
          <p>Explore specialized AI modules designed for yield protection, soil rejuvenation, and crop profitability.</p>
        </div>
        
        <div class="feature-grid">
          <!-- 1. MY FARM -->
          <a routerLink="/dashboard" class="feature">
            <div class="feature-icon">📍</div>
            <div class="feature-tag">TELEMETRY</div>
            <h3>My Farm Dashboard</h3>
            <p>Real-time weather, soil moisture at multiple depths, and farm coordinates.</p>
            <span class="feature-link">View Dashboard →</span>
          </a>

          <!-- 2. DISASTER -->
          <a routerLink="/disaster" class="feature highlight-warn">
            <div class="feature-icon">⚠️</div>
            <div class="feature-tag warn">EARLY WARNING</div>
            <h3>Disaster Prediction</h3>
            <p>Early alerts for flood, drought, heatwaves, frost, and high-velocity wind hazards.</p>
            <span class="feature-link">Check Alerts →</span>
          </a>

          <!-- 3. CROP RECOM -->
          <a routerLink="/crop" class="feature">
            <div class="feature-icon">🌱</div>
            <div class="feature-tag">ML ADVISOR</div>
            <h3>Crop Recommendation</h3>
            <p>AI finds the highest yielding crops tailored to your NPK, pH, and climate.</p>
            <span class="feature-link">Find Crops →</span>
          </a>

          <!-- 4. YIELD -->
          <a routerLink="/yield" class="feature">
            <div class="feature-icon">🌾</div>
            <div class="feature-tag">WHAT-IF SIMULATOR</div>
            <h3>Yield Prediction</h3>
            <p>Estimate harvest tonnage & simulate profit gains with drip and soil tuning.</p>
            <span class="feature-link">Predict Yield →</span>
          </a>

          <!-- 5. DISEASE -->
          <a routerLink="/disease" class="feature">
            <div class="feature-icon">🍃</div>
            <div class="feature-tag">VISION LAB</div>
            <h3>Plant Leaf Scanner</h3>
            <p>Upload a leaf image with radar HUD to detect pathology & get organic remedies.</p>
            <span class="feature-link">Scan Plant →</span>
          </a>

          <!-- 6. SOIL -->
          <a routerLink="/soil" class="feature">
            <div class="feature-icon">🧪</div>
            <div class="feature-tag">NUTRIENTS</div>
            <h3>Soil Analysis</h3>
            <p>Deep breakdown of Nitrogen, Phosphorus, Potassium, moisture, and pH balance.</p>
            <span class="feature-link">Analyze Soil →</span>
          </a>

          <!-- 7. FERTILIZER -->
          <a routerLink="/fertilizer" class="feature">
            <div class="feature-icon">🌿</div>
            <div class="feature-tag">BAG CALCULATOR</div>
            <h3>Fertilizer Advisor</h3>
            <p>Connect soil metrics to 50kg bag calculations (Urea, DAP, MOP) and schedules.</p>
            <span class="feature-link">Get Schedules →</span>
          </a>

          <!-- 8. SPRAY WEATHER -->
          <a routerLink="/weather" class="feature">
            <div class="feature-icon">🌦️</div>
            <div class="feature-tag">AGRO-FORECAST</div>
            <h3>Spray Window & Weather</h3>
            <p>7-day spray feasibility ratings, drift speed analysis, and rain wash-off alerts.</p>
            <span class="feature-link">Check Weather →</span>
          </a>

          <!-- 9. MANDI -->
          <a routerLink="/mandi" class="feature">
            <div class="feature-icon">💰</div>
            <div class="feature-tag">MARKET PRICES</div>
            <h3>Live Mandi Rates</h3>
            <p>Real-time district APMC prices, MSP benchmarks, and crop harvest calculator.</p>
            <span class="feature-link">View Mandi →</span>
          </a>

          <!-- 10. HEALTH CARD -->
          <a routerLink="/health-card" class="feature">
            <div class="feature-icon">📄</div>
            <div class="feature-tag">PRESCRIPTION</div>
            <h3>Krishi Health Card</h3>
            <p>Official 1-click printable government-style Soil Health & Crop Prescription card.</p>
            <span class="feature-link">Generate Card →</span>
          </a>

          <!-- 11. ASSISTANT -->
          <a routerLink="/assistant" class="feature highlight-ai">
            <div class="feature-icon">🤖</div>
            <div class="feature-tag ai">VOICE & TEXT</div>
            <h3>AI Farmer Assistant</h3>
            <p>Two-way voice conversation across 10 Indian languages with ICAR agronomy wisdom.</p>
            <span class="feature-link">Talk to AI →</span>
          </a>

          <!-- 12. KNOWLEDGE -->
          <a routerLink="/knowledge" class="feature">
            <div class="feature-icon">📚</div>
            <div class="feature-tag">LIBRARY</div>
            <h3>Knowledge Hub</h3>
            <p>Verified best practices for pest management, drip irrigation, and organic farming.</p>
            <span class="feature-link">Browse Guides →</span>
          </a>
        </div>
      </section>

      <!-- WORKFLOW -->
      <section class="workflow">
        <div>
          <div class="eyebrow">CONNECTED FARM INTELLIGENCE</div>
          <h2>From Raw Sensor Readings to Confident Farm Execution.</h2>
          <p>
            KrishiAI synchronizes your geolocation, soil sensor values, historical climate, disease detection, 
            and mandi rates so you never have to juggle isolated tools again.
          </p>
        </div>

        <div class="steps">
          <div class="step-badge"><span>📍 Location</span></div>
          <b>→</b>
          <div class="step-badge"><span>🧪 Soil NPK</span></div>
          <b>→</b>
          <div class="step-badge"><span>🌱 Crop ML</span></div>
          <b>→</b>
          <div class="step-badge"><span>⚠️ Alert</span></div>
          <b>→</b>
          <div class="step-badge active"><span>🤖 AI Action</span></div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      padding-bottom: 60px;
    }

    .hero {
      min-height: 580px;
      padding: 60px 5vw;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 40px;
      align-items: center;
      max-width: 1350px;
      margin: 0 auto;
    }

    .hero-copy {
      max-width: 650px;
    }

    .hero h1 {
      margin: 12px 0 16px;
      font-size: clamp(34px, 4.5vw, 54px);
      line-height: 1.1;
      color: #f3fff8;
    }

    .hero h1 em {
      color: var(--neon-green);
      font-style: normal;
      text-shadow: 0 0 20px rgba(125, 255, 111, 0.3);
    }

    .hero-copy p {
      font-size: 17px;
      line-height: 1.65;
      color: var(--text-muted);
      margin-bottom: 28px;
    }

    .actions {
      display: flex;
      gap: 14px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .trust {
      display: flex;
      gap: 20px;
      font-size: 12.5px;
      color: #6d8076;
      font-weight: 600;
      flex-wrap: wrap;
    }

    .trust span {
      color: #8fa69a;
    }

    /* HERO ART */
    .hero-art {
      height: 440px;
      border-radius: 28px;
      position: relative;
      background: linear-gradient(135deg, rgba(28, 40, 31, 0.96), rgba(15, 22, 18, 0.98));
      border: 1px solid rgba(125, 255, 111, 0.16);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .sun-glow {
      position: absolute;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(125, 255, 111, 0.18), transparent 70%);
      top: -40px;
      right: -40px;
      pointer-events: none;
    }

    .hud-circle {
      position: absolute;
      width: 320px;
      height: 320px;
      border-radius: 50%;
      border: 1px dashed rgba(125, 255, 111, 0.15);
      animation: rotateHud 30s linear infinite;
    }

    @keyframes rotateHud {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .farmer-avatar {
      font-size: 96px;
      z-index: 2;
      filter: drop-shadow(0 12px 25px rgba(0, 0, 0, 0.5));
      animation: float 4s ease-in-out infinite alternate;
    }

    @keyframes float {
      from { transform: translateY(0); }
      to { transform: translateY(-8px); }
    }

    .float-card {
      position: absolute;
      background: rgba(18, 24, 21, 0.94);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(125, 255, 111, 0.2);
      border-radius: 14px;
      padding: 11px 15px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      z-index: 5;
    }

    .float-card b {
      display: block;
      font-size: 13px;
      color: #f1f7f2;
    }

    .float-card small {
      font-size: 10.5px;
      color: var(--text-muted);
    }

    .float-card .card-icon {
      font-size: 20px;
    }

    .pulse-icon {
      color: var(--neon-green);
      animation: pulse 1.5s infinite;
    }

    .weather { top: 28px; left: 24px; }
    .ai { bottom: 28px; right: 24px; border-color: rgba(54, 232, 154, 0.4); }
    .radar { bottom: 32px; left: 24px; }

    /* FEATURE SECTION */
    .quick {
      padding: 50px 5vw 80px;
      max-width: 1350px;
      margin: 0 auto;
    }

    .section-header {
      margin-bottom: 35px;
    }

    .section-header h2 {
      font-size: clamp(26px, 3.5vw, 36px);
      color: #f3fff8;
      margin: 6px 0 8px;
    }

    .section-header p {
      font-size: 16px;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 18px;
    }

    .feature {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 24px;
      text-decoration: none;
      color: var(--text-main);
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
      position: relative;
    }

    .feature:hover {
      transform: translateY(-4px);
      border-color: rgba(125, 255, 111, 0.4);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(125, 255, 111, 0.08);
    }

    .feature-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }

    .feature-tag {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.2px;
      color: var(--neon-green);
      margin-bottom: 8px;
    }

    .feature-tag.warn {
      color: #ffd166;
    }

    .feature-tag.ai {
      color: #60a5fa;
    }

    .feature h3 {
      font-size: 18px;
      margin: 0 0 8px;
      color: #f3fff8;
    }

    .feature p {
      font-size: 13px;
      line-height: 1.55;
      color: #8fa096;
      margin: 0 0 18px;
      flex: 1;
    }

    .feature-link {
      color: var(--neon-green);
      font-weight: 700;
      font-size: 12.5px;
      display: inline-flex;
      align-items: center;
      transition: gap 0.2s;
    }

    .feature:hover .feature-link {
      text-shadow: 0 0 10px rgba(125, 255, 111, 0.5);
    }

    .highlight-warn {
      border-color: rgba(255, 209, 102, 0.25);
    }

    .highlight-warn:hover {
      border-color: #ffd166;
    }

    /* WORKFLOW */
    .workflow {
      max-width: 1350px;
      margin: 0 auto;
      padding: 40px 5vw;
      background: linear-gradient(135deg, rgba(28, 40, 31, 0.96), rgba(15, 22, 18, 0.96));
      border: 1px solid rgba(125, 255, 111, 0.14);
      border-radius: 24px;
      display: flex;
      justify-content: space-between;
      gap: 30px;
      align-items: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }

    .workflow h2 {
      font-size: 24px;
      color: #f3fff8;
      margin: 6px 0 10px;
    }

    .workflow p {
      color: #92a49b;
      max-width: 600px;
      margin: 0;
      font-size: 14.5px;
    }

    .steps {
      display: flex;
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .step-badge span {
      background: #121815;
      border: 1px solid #253129;
      padding: 10px 14px;
      border-radius: 12px;
      color: #eef5ef;
      font-size: 12.5px;
      font-weight: 700;
      white-space: nowrap;
    }

    .step-badge.active span {
      border-color: var(--neon-green);
      color: var(--neon-green);
      background: rgba(125, 255, 111, 0.1);
      box-shadow: 0 0 15px rgba(125, 255, 111, 0.2);
    }

    .steps b {
      color: #4a6154;
    }

    @media (max-width: 1100px) {
      .feature-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .hero {
        grid-template-columns: 1fr;
      }
      .workflow {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 650px) {
      .feature-grid {
        grid-template-columns: 1fr;
      }
      .hero-art {
        height: 320px;
      }
    }
  `]
})
export class HomeComponent {}
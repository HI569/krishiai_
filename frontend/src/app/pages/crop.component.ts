import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="crop-page">
      <!-- AMBIENT GLOWS -->
      <div class="glow-orb orb-1"></div>
      <div class="glow-orb orb-2"></div>

      <div class="crop-container">
        <!-- HERO -->
        <header class="hero">
          <div class="hero-icon-badge">🌱</div>
          <div class="eyebrow">KRISHIAI INTELLIGENCE • RANDOM FOREST ML</div>
          <h1>Find the Best Crop<br><span>for Your Farm</span></h1>
          <p>
            Enter your real-time soil chemistry and agro-climatic parameters.
            Our neural classification models compute the highest yield affinity for your land.
          </p>
        </header>

        <!-- MAIN GRID: INPUTS & PREDICTIONS -->
        <div class="layout-grid">
          <!-- INPUT FORM CARD -->
          <section class="card input-card">
            <div class="card-header">
              <div class="header-icon">🌾</div>
              <div>
                <h2>Farm Conditions</h2>
                <p>Provide current soil metrics and micro-climate parameters</p>
              </div>
            </div>

            <!-- SECTION 1: SOIL -->
            <div class="section-tag">
              <span class="tag-num">01</span>
              <span>SOIL NUTRIENTS & CHEMISTRY</span>
            </div>

            <div class="input-grid">
              <!-- N -->
              <div class="input-group">
                <label>Nitrogen <span class="unit">N</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="n" min="0" placeholder="90" />
                  <span class="suffix">mg/kg</span>
                </div>
                <small>Topsoil nitrogen ratio</small>
              </div>

              <!-- P -->
              <div class="input-group">
                <label>Phosphorus <span class="unit">P</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="p" min="0" placeholder="42" />
                  <span class="suffix">mg/kg</span>
                </div>
                <small>Available phosphorus</small>
              </div>

              <!-- K -->
              <div class="input-group">
                <label>Potassium <span class="unit">K</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="k" min="0" placeholder="43" />
                  <span class="suffix">mg/kg</span>
                </div>
                <small>Exchangeable potassium</small>
              </div>

              <!-- pH -->
              <div class="input-group">
                <label>Soil pH <span class="unit">pH</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="ph" min="0" max="14" step="0.1" placeholder="6.5" />
                  <span class="suffix">pH</span>
                </div>
                <small>Acidity / Alkalinity balance</small>
              </div>
            </div>

            <!-- SECTION 2: CLIMATE -->
            <div class="section-tag climate-tag">
              <span class="tag-num">02</span>
              <span>CLIMATIC & METEOROLOGICAL PROFILE</span>
            </div>

            <div class="input-grid">
              <!-- Temperature -->
              <div class="input-group">
                <label>Temperature <span class="unit">°C</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="temperature" step="0.1" placeholder="25" />
                  <span class="suffix">°C</span>
                </div>
                <small>Mean ambient temperature</small>
              </div>

              <!-- Humidity -->
              <div class="input-group">
                <label>Humidity <span class="unit">%</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="humidity" min="0" max="100" step="0.1" placeholder="80" />
                  <span class="suffix">% RH</span>
                </div>
                <small>Relative air moisture</small>
              </div>

              <!-- Rainfall -->
              <div class="input-group">
                <label>Rainfall <span class="unit">mm</span></label>
                <div class="input-wrapper">
                  <input type="number" [(ngModel)]="rainfall" min="0" step="1" placeholder="200" />
                  <span class="suffix">mm</span>
                </div>
                <small>Seasonal precipitation</small>
              </div>

              <!-- Season -->
              <div class="input-group">
                <label>Cropping Season <span class="unit">🌤</span></label>
                <div class="input-wrapper">
                  <select [(ngModel)]="season">
                    <option value="Kharif">Kharif (Monsoon)</option>
                    <option value="Rabi">Rabi (Winter)</option>
                    <option value="Zaid">Zaid (Summer)</option>
                  </select>
                </div>
                <small>Agricultural sowing window</small>
              </div>
            </div>

            <!-- Location -->
            <div class="location-box">
              <span class="loc-icon">📍</span>
              <div class="loc-field">
                <label>Farm Geographic Region / State</label>
                <input type="text" [(ngModel)]="location" placeholder="e.g. Punjab, Andhra Pradesh, Maharashtra" />
              </div>
            </div>

            <!-- PREDICT CTA BUTTON -->
            <button class="btn-predict" type="button" (click)="recommend()" [disabled]="loading">
              <span class="btn-spinner" *ngIf="loading"></span>
              <span class="btn-text">
                {{ loading ? 'Running Random Forest Model...' : '✨ Run AI Crop Match' }}
              </span>
              <span class="btn-arrow" *ngIf="!loading">→</span>
            </button>

            <!-- ERROR ALERT -->
            <div class="error-banner" *ngIf="error">
              <span class="err-icon">⚠️</span>
              <div>
                <strong>Recommendation Alert</strong>
                <p>{{ error }}</p>
              </div>
            </div>
          </section>

          <!-- RESULTS / EMPTY STATE COLUMN -->
          <div class="output-column">
            <!-- LOADING STATE -->
            <div class="card loading-card" *ngIf="loading">
              <div class="radar-scan">
                <div class="radar-beam"></div>
              </div>
              <h3>Analyzing Soil & Climate Vectors</h3>
              <p>Evaluating multi-dimensional agronomic compatibility using trained Random Forest decision trees...</p>
            </div>

            <!-- RESULTS PRESENTATION -->
            <div class="results-container" *ngIf="result && !loading">
              <!-- TOP CROP HERO CARD -->
              <div class="card top-crop-card" *ngIf="getTopCrop() as top">
                <div class="top-badge-row">
                  <span class="match-badge">🏆 HIGHEST SUITABILITY</span>
                  <span class="score-pill">{{ getScore(top) }}% Match</span>
                </div>

                <div class="top-crop-body">
                  <div class="crop-avatar">{{ top.icon || '🌾' }}</div>
                  <div class="crop-info">
                    <span class="crop-sub">Recommended Primary Cultivar</span>
                    <h2>{{ formatCropName(top.crop) }}</h2>
                    <p>{{ top.info || 'Optimal soil pH balance, NPK distribution, and thermal conditions for maximum harvest potential.' }}</p>
                  </div>
                </div>

                <!-- PROGRESS METER -->
                <div class="suitability-meter">
                  <div class="meter-head">
                    <span>AGRONOMIC AFFINITY INDEX</span>
                    <strong>{{ getScore(top) }}%</strong>
                  </div>
                  <div class="meter-track">
                    <div class="meter-bar" [style.width.%]="getScore(top)"></div>
                  </div>
                </div>

                <!-- ACTION SHORTCUTS -->
                <div class="action-shortcuts">
                  <a routerLink="/fertilizer" class="shortcut-btn">
                    <span>🌿</span> Fertilizer Plan
                  </a>
                  <a routerLink="/yield" class="shortcut-btn">
                    <span>🌾</span> Estimate Yield
                  </a>
                  <a routerLink="/weather" class="shortcut-btn">
                    <span>🌦️</span> Spray Windows
                  </a>
                </div>
              </div>

              <!-- OTHER RECOMMENDATIONS GRID -->
              <div class="sub-heading" *ngIf="getRecommendations().length > 1">
                <span>ALTERNATIVE SUITABLE CROPS</span>
              </div>

              <div class="crop-grid" *ngIf="getRecommendations().length > 1">
                <div
                  class="card alt-crop-card"
                  *ngFor="let crop of getRecommendations().slice(1)"
                >
                  <div class="alt-top">
                    <span class="alt-icon">{{ crop.icon || '🌱' }}</span>
                    <div>
                      <h4>{{ formatCropName(crop.crop) }}</h4>
                      <small *ngIf="crop.season">{{ crop.season }}</small>
                    </div>
                    <span class="alt-score">{{ getScore(crop) }}%</span>
                  </div>

                  <div class="alt-meter">
                    <div class="alt-bar" [style.width.%]="getScore(crop)"></div>
                  </div>

                  <div class="alt-meta" *ngIf="crop.water">
                    <span>Water: <strong>{{ crop.water }}</strong></span>
                  </div>
                </div>
              </div>

              <!-- FARM TELEMETRY RECAP -->
              <div class="card summary-card">
                <div class="summary-head">
                  <span class="hud-dot"></span>
                  <h4>Computed Parameters Telemetry</h4>
                </div>
                <div class="telemetry-grid">
                  <div class="tel-item"><small>N</small><strong>{{ n }}</strong></div>
                  <div class="tel-item"><small>P</small><strong>{{ p }}</strong></div>
                  <div class="tel-item"><small>K</small><strong>{{ k }}</strong></div>
                  <div class="tel-item"><small>pH</small><strong>{{ ph }}</strong></div>
                  <div class="tel-item"><small>Temp</small><strong>{{ temperature }}°C</strong></div>
                  <div class="tel-item"><small>Humidity</small><strong>{{ humidity }}%</strong></div>
                  <div class="tel-item"><small>Rain</small><strong>{{ rainfall }}mm</strong></div>
                  <div class="tel-item"><small>Season</small><strong>{{ season }}</strong></div>
                </div>
              </div>
            </div>

            <!-- EMPTY STATE -->
            <div class="card empty-card" *ngIf="!result && !loading">
              <div class="empty-icon">🌾</div>
              <h3>Ready to Discover Your Ideal Crop?</h3>
              <p>Configure your soil chemistry (NPK & pH) and weather conditions on the left to activate our machine learning recommendation pipeline.</p>
              <div class="features-row">
                <div class="feature-item">
                  <span>🧪</span>
                  <b>Soil Analysis</b>
                  <small>NPK & pH</small>
                </div>
                <div class="feature-item">
                  <span>🌤️</span>
                  <b>Climate Grid</b>
                  <small>Temp & Moisture</small>
                </div>
                <div class="feature-item">
                  <span>🤖</span>
                  <b>Trained AI</b>
                  <small>Random Forest</small>
                </div>
              </div>
            </div>
          </div>
        </div>
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

    .crop-page {
      min-height: calc(100vh - 70px);
      background: #08120f;
      color: #f3f9f4;
      padding: 40px 24px 80px;
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
      top: -150px;
      right: -100px;
      background: radial-gradient(circle, rgba(0, 255, 148, 0.12), transparent 70%);
    }
    .orb-2 {
      width: 380px;
      height: 380px;
      bottom: 50px;
      left: -120px;
      background: radial-gradient(circle, rgba(125, 255, 111, 0.08), transparent 70%);
    }

    .crop-container {
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    /* HERO */
    .hero {
      text-align: center;
      max-width: 780px;
      margin: 0 auto 36px;
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
      margin: 0;
    }

    /* LAYOUT GRID */
    .layout-grid {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      gap: 28px;
      align-items: start;
    }
    @media (max-width: 950px) {
      .layout-grid {
        grid-template-columns: 1fr;
      }
    }

    /* CARD SHARED */
    .card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
      padding: 28px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.35);
    }

    .card-header {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .card-header h2 {
      margin: 0 0 4px;
      font-size: 1.3rem;
      font-weight: 750;
      color: #ffffff;
    }
    .card-header p {
      margin: 0;
      font-size: 0.85rem;
      color: #92a397;
    }

    /* SECTION TAGS */
    .section-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #7dff6f;
      margin-bottom: 16px;
      background: rgba(125, 255, 111, 0.08);
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid rgba(125, 255, 111, 0.2);
    }
    .climate-tag {
      margin-top: 22px;
      color: #5ce6b0;
      background: rgba(92, 230, 176, 0.08);
      border-color: rgba(92, 230, 176, 0.2);
    }
    .tag-num {
      background: #7dff6f;
      color: #07120a;
      padding: 1px 6px;
      border-radius: 4px;
      font-weight: 900;
    }
    .climate-tag .tag-num {
      background: #5ce6b0;
    }

    /* INPUT GRID */
    .input-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    @media (max-width: 550px) {
      .input-grid {
        grid-template-columns: 1fr;
      }
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .input-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #cfe0d4;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .unit {
      color: #7dff6f;
      font-size: 0.72rem;
      font-weight: 800;
    }
    .input-wrapper {
      display: flex;
      align-items: center;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 12px;
      padding: 0 12px;
      transition: all 0.2s;
    }
    .input-wrapper:focus-within {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }
    .input-wrapper input,
    .input-wrapper select {
      flex: 1;
      min-width: 0;
      background: transparent;
      border: none;
      color: #f1f7f2;
      font-size: 0.95rem;
      font-weight: 600;
      padding: 10px 0;
      outline: none;
    }
    .input-wrapper select {
      cursor: pointer;
    }
    .input-wrapper select option {
      background: #121815;
      color: #f1f7f2;
    }
    .suffix {
      font-size: 0.75rem;
      font-weight: 700;
      color: #758a7d;
      margin-left: 8px;
    }
    .input-group small {
      font-size: 0.7rem;
      color: #788a7e;
    }

    /* LOCATION BOX */
    .location-box {
      margin-top: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 14px;
      padding: 12px 16px;
    }
    .loc-icon {
      font-size: 22px;
    }
    .loc-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .loc-field label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #92a397;
    }
    .loc-field input {
      background: transparent;
      border: none;
      outline: none;
      color: #f1f7f2;
      font-size: 0.9rem;
      font-weight: 600;
    }

    /* CTA BUTTON */
    .btn-predict {
      margin-top: 24px;
      width: 100%;
      background: #7dff6f;
      color: #07120a;
      border: none;
      border-radius: 14px;
      padding: 16px;
      font-size: 1rem;
      font-weight: 850;
      letter-spacing: 0.02em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 10px 24px rgba(125, 255, 111, 0.28);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-predict:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(125, 255, 111, 0.4);
      background: #8eff80;
    }
    .btn-predict:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .btn-spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(7, 18, 10, 0.3);
      border-top-color: #07120a;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* ERROR BANNER */
    .error-banner {
      margin-top: 18px;
      background: rgba(255, 107, 107, 0.12);
      border: 1px solid rgba(255, 107, 107, 0.35);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      gap: 12px;
      align-items: center;
      color: #ffb4b4;
    }
    .error-banner strong {
      display: block;
      color: #ff6b6b;
      font-size: 0.85rem;
    }
    .error-banner p {
      margin: 2px 0 0;
      font-size: 0.8rem;
    }

    /* OUTPUT COLUMN */
    .output-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* LOADING CARD */
    .loading-card {
      text-align: center;
      padding: 50px 30px;
    }
    .radar-scan {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 2px solid rgba(125, 255, 111, 0.4);
      margin: 0 auto 20px;
      position: relative;
      overflow: hidden;
    }
    .radar-beam {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: conic-gradient(from 0deg, rgba(125, 255, 111, 0.5) 0deg, transparent 90deg);
      border-radius: 50%;
      animation: sweepRadar 1.5s linear infinite;
    }
    @keyframes sweepRadar {
      to { transform: rotate(360deg); }
    }
    .loading-card h3 {
      font-size: 1.2rem;
      color: #7dff6f;
      margin: 0 0 8px;
    }
    .loading-card p {
      color: #92a397;
      font-size: 0.88rem;
      line-height: 1.5;
      margin: 0;
    }

    /* TOP CROP CARD */
    .top-crop-card {
      background: linear-gradient(145deg, #152219, #0f1612);
      border: 1px solid rgba(125, 255, 111, 0.4);
      box-shadow: 0 16px 45px rgba(0, 255, 148, 0.15);
      position: relative;
      overflow: hidden;
    }
    .top-badge-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .match-badge {
      font-size: 0.7rem;
      font-weight: 850;
      letter-spacing: 0.12em;
      color: #7dff6f;
      background: rgba(125, 255, 111, 0.12);
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid rgba(125, 255, 111, 0.25);
    }
    .score-pill {
      font-size: 1.1rem;
      font-weight: 900;
      color: #7dff6f;
      background: #08120f;
      border: 1px solid rgba(125, 255, 111, 0.35);
      padding: 4px 14px;
      border-radius: 12px;
    }
    .top-crop-body {
      display: flex;
      gap: 20px;
      align-items: center;
      margin-bottom: 22px;
    }
    .crop-avatar {
      width: 76px;
      height: 76px;
      border-radius: 20px;
      background: rgba(125, 255, 111, 0.12);
      border: 1px solid rgba(125, 255, 111, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      flex-shrink: 0;
    }
    .crop-info {
      flex: 1;
    }
    .crop-sub {
      font-size: 0.72rem;
      color: #8cff78;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      display: block;
    }
    .crop-info h2 {
      margin: 2px 0 6px;
      font-size: 1.8rem;
      color: #ffffff;
      font-weight: 850;
    }
    .crop-info p {
      margin: 0;
      font-size: 0.85rem;
      color: #a6b8ab;
      line-height: 1.45;
    }

    /* METER */
    .suitability-meter {
      background: #0b110e;
      border: 1px solid #233027;
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 20px;
    }
    .meter-head {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      color: #8fa395;
      margin-bottom: 8px;
    }
    .meter-head strong {
      color: #7dff6f;
      font-size: 0.9rem;
    }
    .meter-track {
      height: 10px;
      background: #18221b;
      border-radius: 6px;
      overflow: hidden;
    }
    .meter-bar {
      height: 100%;
      background: linear-gradient(90deg, #1fa864, #7dff6f);
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(125, 255, 111, 0.5);
      transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ACTION SHORTCUTS */
    .action-shortcuts {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    .shortcut-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid #2a382e;
      border-radius: 12px;
      padding: 10px 8px;
      color: #e4eee6;
      text-decoration: none;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .shortcut-btn:hover {
      background: rgba(125, 255, 111, 0.1);
      border-color: rgba(125, 255, 111, 0.35);
      color: #7dff6f;
    }

    /* SUB HEADING */
    .sub-heading {
      margin-top: 10px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      color: #8cff78;
    }

    /* ALTERNATIVE CROP GRID */
    .crop-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    @media (max-width: 550px) {
      .crop-grid {
        grid-template-columns: 1fr;
      }
    }
    .alt-crop-card {
      padding: 16px;
      border-color: #212c24;
    }
    .alt-top {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }
    .alt-icon {
      font-size: 24px;
    }
    .alt-top h4 {
      margin: 0;
      font-size: 0.95rem;
      color: #ffffff;
      font-weight: 750;
    }
    .alt-top small {
      font-size: 0.7rem;
      color: #8fa395;
    }
    .alt-score {
      margin-left: auto;
      font-size: 0.85rem;
      font-weight: 800;
      color: #7dff6f;
    }
    .alt-meter {
      height: 6px;
      background: #0d1410;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 8px;
    }
    .alt-bar {
      height: 100%;
      background: #36e89a;
      border-radius: 4px;
    }
    .alt-meta {
      font-size: 0.7rem;
      color: #92a397;
    }
    .alt-meta strong {
      color: #e4eee6;
    }

    /* SUMMARY CARD */
    .summary-card {
      padding: 18px 22px;
      margin-top: 4px;
    }
    .summary-head {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 14px;
    }
    .hud-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #7dff6f;
      box-shadow: 0 0 8px #7dff6f;
    }
    .summary-head h4 {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #cfe0d4;
    }
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    @media (max-width: 450px) {
      .telemetry-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .tel-item {
      background: #0b110e;
      border: 1px solid #1f2a22;
      border-radius: 10px;
      padding: 8px 10px;
      text-align: center;
    }
    .tel-item small {
      display: block;
      font-size: 0.65rem;
      color: #7dff6f;
      font-weight: 800;
      margin-bottom: 2px;
    }
    .tel-item strong {
      font-size: 0.85rem;
      color: #f1f7f2;
    }

    /* EMPTY CARD */
    .empty-card {
      text-align: center;
      padding: 48px 30px;
    }
    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }
    .empty-card h3 {
      margin: 0 0 10px;
      font-size: 1.3rem;
      color: #ffffff;
      font-weight: 800;
    }
    .empty-card p {
      margin: 0 auto 24px;
      font-size: 0.9rem;
      color: #92a397;
      line-height: 1.5;
      max-width: 400px;
    }
    .features-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }
    .feature-item {
      background: #0b110e;
      border: 1px solid #1f2a22;
      border-radius: 14px;
      padding: 14px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }
    .feature-item span {
      font-size: 24px;
    }
    .feature-item b {
      font-size: 0.8rem;
      color: #f1f7f2;
    }
    .feature-item small {
      font-size: 0.68rem;
      color: #7dff6f;
    }
  `]
})
export class CropComponent {
  private farmService = inject(FarmService);

  n = 90;
  p = 42;
  k = 43;
  ph = 6.5;
  temperature = 25;
  humidity = 80;
  rainfall = 200;
  season = 'Kharif';
  location = 'India';

  loading = false;
  error = '';
  result: any = null;

  recommend(): void {
    this.error = '';
    this.result = null;

    if (
      this.n === null ||
      this.p === null ||
      this.k === null ||
      this.ph === null ||
      this.temperature === null ||
      this.humidity === null ||
      this.rainfall === null
    ) {
      this.error = 'Please enter all soil and climate conditions.';
      return;
    }

    if (this.ph < 0 || this.ph > 14) {
      this.error = 'Soil pH must be between 0 and 14.';
      return;
    }

    if (this.humidity < 0 || this.humidity > 100) {
      this.error = 'Humidity must be between 0% and 100%.';
      return;
    }

    this.loading = true;

    const input = {
      n: Number(this.n),
      p: Number(this.p),
      k: Number(this.k),
      ph: Number(this.ph),
      temperature: Number(this.temperature),
      humidity: Number(this.humidity),
      rainfall: Number(this.rainfall),
      season: this.season,
      location: this.location
    };

    console.log('Sending crop recommendation:', input);

    this.farmService.recommend(input).subscribe({
      next: (response: any) => {
        console.log('Crop API response:', response);
        this.loading = false;

        if (!response) {
          this.error = 'No response received from the backend.';
          return;
        }

        if (response.detail) {
          this.error = typeof response.detail === 'string' ? response.detail : 'The crop API returned an error.';
          return;
        }

        if (
          !response.recommendations ||
          !Array.isArray(response.recommendations) ||
          response.recommendations.length === 0
        ) {
          if (response.crop) {
            this.result = response;
            return;
          }
          this.error = 'The model did not return any crop recommendation.';
          return;
        }

        this.result = response;
      },
      error: (err: any) => {
        console.error('Crop API error:', err);
        this.loading = false;

        if (err.status === 404) {
          this.error = 'Crop API route was not found. Check that the frontend is using /api/crop/recommend.';
        } else if (err.status === 0) {
          this.error = 'Could not connect to the KrishiAI backend. Make sure FastAPI is running on port 8001.';
        } else {
          this.error = 'The crop recommendation service returned an error.';
        }
      }
    });
  }

  getRecommendations(): any[] {
    if (!this.result) {
      return [];
    }
    if (Array.isArray(this.result.recommendations)) {
      return this.result.recommendations;
    }
    if (this.result.crop) {
      return [this.result];
    }
    return [];
  }

  getTopCrop(): any {
    const crops = this.getRecommendations();
    if (!crops.length) {
      return null;
    }
    return crops[0];
  }

  getScore(crop: any): number {
    if (!crop) {
      return 0;
    }
    const value = crop.suitability ?? crop.confidence ?? crop.score ?? 0;
    return Math.round(Number(value));
  }

  formatCropName(name: any): string {
    if (!name) {
      return 'Unknown Crop';
    }
    return String(name)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}

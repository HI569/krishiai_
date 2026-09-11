import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CropYieldProfile {
  name: string;
  hindiName: string;
  emoji: string;
  baseYieldTonnesPerAcre: number;
  optimalTempMin: number;
  optimalTempMax: number;
  optimalRainMin: number;
  optimalRainMax: number;
  marketPricePerTonne: number; // approx INR
}

@Component({
  selector: 'app-yield',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="yield-page">
      
      <!-- HERO -->
      <section class="hero">
        <div>
          <span class="eyebrow">KRISHIAI • AGRO-CLIMATIC MODEL</span>
          <h1>Crop Yield & ROI Prediction</h1>
          <p>Calculate estimated harvest production and simulate "What-If" farm optimization scenarios in real time.</p>
        </div>
        <div class="hero-icon">🌾</div>
      </section>

      <!-- TABS: ESTIMATOR vs WHAT-IF SIMULATOR -->
      <div class="tabs-container">
        <button 
          type="button" 
          class="tab-btn" 
          [class.active]="activeTab === 'estimator'"
          (click)="activeTab = 'estimator'"
        >
          📊 Standard Yield Estimator
        </button>
        <button 
          type="button" 
          class="tab-btn" 
          [class.active]="activeTab === 'simulator'"
          (click)="activeTab = 'simulator'"
        >
          🎛️ "What-If" Profit Simulator <span class="hot-badge">PROFIT BOOST</span>
        </button>
      </div>

      <!-- TAB 1: STANDARD ESTIMATOR -->
      <div class="yield-grid" *ngIf="activeTab === 'estimator'">

        <!-- LEFT: INPUTS FORM -->
        <div class="card input-card">
          <div class="card-title">
            <span class="step-icon">⚙️</span>
            <h3>Farm & Agronomic Inputs</h3>
          </div>

          <div class="form-grid">
            
            <!-- CROP SELECTION -->
            <div class="input-item">
              <label>Crop Selection:</label>
              <select [(ngModel)]="selectedCropKey" (ngModelChange)="calculateYield()">
                <option *ngFor="let c of cropList" [value]="c.key">
                  {{ c.emoji }} {{ c.name }} ({{ c.hindiName }})
                </option>
              </select>
            </div>

            <!-- FARM AREA -->
            <div class="input-item">
              <div class="label-row">
                <label>Farm Area:</label>
                <span class="val-highlight">{{ farmArea }} Acres</span>
              </div>
              <input 
                type="range" 
                min="0.5" 
                max="50" 
                step="0.5" 
                [(ngModel)]="farmArea" 
                (ngModelChange)="calculateYield()" 
              />
            </div>

            <!-- SOIL CONDITION -->
            <div class="input-item">
              <label>Soil Condition / Texture:</label>
              <select [(ngModel)]="soilCondition" (ngModelChange)="calculateYield()">
                <option value="loamy">🌱 Loamy Soil (Rich & Well-drained)</option>
                <option value="black">⬛ Deep Black Soil (High Moisture Retention)</option>
                <option value="alluvial">🌾 Alluvial Soil (Fertile River Basin)</option>
                <option value="red">🧱 Red / Laterite Soil (Moderate Fertility)</option>
                <option value="sandy">🏖️ Sandy / Dry Soil (Low Water Holding)</option>
                <option value="clay">🧱 Heavy Clay Soil (Poor Aeration)</option>
              </select>
            </div>

            <!-- IRRIGATION METHOD -->
            <div class="input-item">
              <label>Irrigation Facility:</label>
              <select [(ngModel)]="irrigationType" (ngModelChange)="calculateYield()">
                <option value="drip">💧 Drip / Micro-fertigation (Optimal Efficiency)</option>
                <option value="tubewell">🚰 Assured Borewell / Canal Irrigation</option>
                <option value="sprinkler">🚿 Sprinkler System</option>
                <option value="limited">⚠️ Limited / Alternate Week Irrigation</option>
                <option value="rainfed">🌧️ Purely Rainfed (No Supplemental Water)</option>
              </select>
            </div>

            <!-- FERTILIZER MANAGEMENT -->
            <div class="input-item">
              <label>Fertilizer & Nutrition Level:</label>
              <select [(ngModel)]="fertilizerLevel" (ngModelChange)="calculateYield()">
                <option value="balanced">🧪 Balanced Soil-Test NPK + Micro-nutrients</option>
                <option value="standard">📦 Standard DAP + Urea Schedule</option>
                <option value="organic">🌿 Organic Bio-fertilizers + Vermicompost</option>
                <option value="low">⚠️ Sub-optimal / Low Fertilizer Dosage</option>
              </select>
            </div>

            <!-- TEMPERATURE SLIDER -->
            <div class="input-item">
              <div class="label-row">
                <label>Avg Temperature (°C):</label>
                <span class="val-pill">{{ temperature }}°C</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="45" 
                step="1" 
                [(ngModel)]="temperature" 
                (ngModelChange)="calculateYield()" 
              />
            </div>

            <!-- RAINFALL SLIDER -->
            <div class="input-item">
              <div class="label-row">
                <label>Seasonal Rainfall (mm):</label>
                <span class="val-pill">{{ rainfall }} mm</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="2500" 
                step="25" 
                [(ngModel)]="rainfall" 
                (ngModelChange)="calculateYield()" 
              />
            </div>

          </div>
        </div>

        <!-- RIGHT: PREDICTION RESULTS -->
        <div class="card result-card">
          <div class="result-header">
            <div class="card-title">
              <span class="step-icon">🌾</span>
              <h3>EXPECTED YIELD</h3>
            </div>
            <button type="button" class="voice-btn" [class.speaking]="isSpeaking" (click)="toggleSpeakYield()">
              {{ isSpeaking ? '⏹ Stop Voice' : '🔊 Listen Yield' }}
            </button>
          </div>

          <!-- YIELD MAIN OUTPUT BOX -->
          <div class="yield-summary-box">
            <div class="crop-badge">{{ selectedCrop.emoji }} {{ selectedCrop.name }}</div>
            
            <div class="metric-row">
              <span class="metric-lbl">Farm Area:</span>
              <strong class="metric-val">{{ farmArea }} acres</strong>
            </div>

            <div class="production-highlight">
              <div class="prod-title">Estimated Production</div>
              <div class="prod-value">
                ≈ {{ estimatedTotalTonnes | number:'1.1-1' }} <span class="unit">tonnes</span>
              </div>
              <div class="prod-sub">(≈ {{ estimatedPerAcreTonnes | number:'1.2-2' }} tonnes / acre)</div>
            </div>

            <div class="confidence-box">
              <span>Confidence:</span>
              <span class="conf-badge conf-{{ confidence.toLowerCase() }}">
                <span class="conf-dot"></span> {{ confidence }}
              </span>
            </div>
          </div>

          <!-- FACTORS CONTRIBUTION -->
          <div class="factors-breakdown">
            <h4>Yield Multiplier Breakdown:</h4>
            <div class="factor-row">
              <span>Soil Fertility Index:</span>
              <strong class="factor-score text-emerald">{{ (soilMultiplier * 100) | number:'1.0-0' }}%</strong>
            </div>
            <div class="factor-row">
              <span>Irrigation Adequacy:</span>
              <strong class="factor-score text-emerald">{{ (irrigationMultiplier * 100) | number:'1.0-0' }}%</strong>
            </div>
            <div class="factor-row">
              <span>Fertilizer Efficiency:</span>
              <strong class="factor-score text-emerald">{{ (fertilizerMultiplier * 100) | number:'1.0-0' }}%</strong>
            </div>
            <div class="factor-row">
              <span>Climate (Temp & Rain):</span>
              <strong class="factor-score" [class.text-emerald]="climateMultiplier >= 0.9" [class.text-rose]="climateMultiplier < 0.9">
                {{ (climateMultiplier * 100) | number:'1.0-0' }}%
              </strong>
            </div>
          </div>

          <!-- ESTIMATED REVENUE -->
          <div class="market-value-card">
            <span>Estimated Market Revenue:</span>
            <strong class="mv-val">≈ ₹{{ estimatedRevenue | number:'1.0-0' }}</strong>
          </div>

          <!-- DISCLAIMER -->
          <div class="disclaimer-alert">
            <span class="disc-icon">⚠️</span>
            <span class="disc-text">
              <strong>Estimate Disclaimer:</strong> Call it an estimate, not a guaranteed prediction. Real yields vary based on microclimate, pest infestation, and harvest timings.
            </span>
          </div>

          <button type="button" class="btn-ask-ai" (click)="askAiAssistant()">
            🤖 Ask AI: How to Increase {{ selectedCrop.name }} Yield by 20% →
          </button>
        </div>

      </div>

      <!-- TAB 2: WHAT-IF SCENARIO SIMULATOR -->
      <div class="what-if-container" *ngIf="activeTab === 'simulator'">
        
        <div class="what-if-hero">
          <div class="hero-left">
            <h2>🎛️ AI What-If Scenario Simulator</h2>
            <p>Toggle smart interventions to simulate potential tonnage boost, cost additions, and net profit gain.</p>
          </div>
          <div class="profit-highlight-badge">
            <span class="ph-label">Simulated Profit Boost:</span>
            <span class="ph-val">+₹{{ (simulatedRevenue - estimatedRevenue - simulatedCost) | number:'1.0-0' }}</span>
          </div>
        </div>

        <!-- TOGGLE SWITCHES -->
        <div class="interventions-grid">
          
          <div class="switch-card" [class.selected]="optDrip" (click)="optDrip = !optDrip; runSimulation()">
            <div class="switch-header">
              <span class="switch-icon">💧</span>
              <span class="switch-title">Precision Drip Irrigation</span>
              <span class="switch-pill">+18% Yield</span>
            </div>
            <p>Saves 40% water, eliminates root stress, and boosts nutrient uptake directly to roots.</p>
            <div class="toggle-state">{{ optDrip ? '✅ ACTIVATED' : '⚪ Click to Activate' }}</div>
          </div>

          <div class="switch-card" [class.selected]="optSoilTest" (click)="optSoilTest = !optSoilTest; runSimulation()">
            <div class="switch-header">
              <span class="switch-icon">🧪</span>
              <span class="switch-title">Soil-Test Fertilizer Tuning</span>
              <span class="switch-pill">+12% Yield</span>
            </div>
            <p>Eliminates nutrient imbalances by split-dosing Urea and adding micronutrients.</p>
            <div class="toggle-state">{{ optSoilTest ? '✅ ACTIVATED' : '⚪ Click to Activate' }}</div>
          </div>

          <div class="switch-card" [class.selected]="optBio" (click)="optBio = !optBio; runSimulation()">
            <div class="switch-header">
              <span class="switch-icon">🌿</span>
              <span class="switch-title">Bio-NPK & Organic Compost</span>
              <span class="switch-pill">+8% Yield</span>
            </div>
            <p>Increases soil organic carbon (SOC) and improves beneficial rhizosphere microbes.</p>
            <div class="toggle-state">{{ optBio ? '✅ ACTIVATED' : '⚪ Click to Activate' }}</div>
          </div>

          <div class="switch-card" [class.selected]="optSeeds" (click)="optSeeds = !optSeeds; runSimulation()">
            <div class="switch-header">
              <span class="switch-icon">🌱</span>
              <span class="switch-title">Certified High-Vigor Seed</span>
              <span class="switch-pill">+10% Yield</span>
            </div>
            <p>Certified disease-treated hybrid seeds for maximum tillering and germination rate.</p>
            <div class="toggle-state">{{ optSeeds ? '✅ ACTIVATED' : '⚪ Click to Activate' }}</div>
          </div>

        </div>

        <!-- SIDE BY SIDE COMPARISON CHART -->
        <div class="comparison-card">
          <h3>📈 Current Practice vs. AI-Optimized Farm</h3>

          <div class="comparison-bars">
            
            <!-- CURRENT -->
            <div class="bar-col">
              <span class="bar-label">Current Farm Practice</span>
              <div class="bar-track">
                <div class="bar-fill current-bar" [style.height.%]="(estimatedTotalTonnes / (simulatedTotalTonnes || 1)) * 75">
                  <span class="bar-val">{{ estimatedTotalTonnes | number:'1.1-1' }} t</span>
                </div>
              </div>
              <div class="bar-finance">
                <strong>₹{{ estimatedRevenue | number:'1.0-0' }}</strong>
                <small>Gross Value</small>
              </div>
            </div>

            <!-- ARROW -->
            <div class="compare-arrow">
              <span class="arrow-diff">+{{ (((simulatedTotalTonnes - estimatedTotalTonnes) / estimatedTotalTonnes) * 100) | number:'1.0-0' }}%</span>
              <span>➔</span>
            </div>

            <!-- SIMULATED -->
            <div class="bar-col">
              <span class="bar-label text-emerald">AI-Optimized Farm</span>
              <div class="bar-track">
                <div class="bar-fill simulated-bar" style="height: 100%">
                  <span class="bar-val">{{ simulatedTotalTonnes | number:'1.1-1' }} t</span>
                </div>
              </div>
              <div class="bar-finance text-emerald">
                <strong>₹{{ simulatedRevenue | number:'1.0-0' }}</strong>
                <small class="text-emerald">+₹{{ (simulatedRevenue - estimatedRevenue) | number:'1.0-0' }} Gain</small>
              </div>
            </div>

          </div>

          <div class="roi-summary">
            <div class="roi-item">
              <span class="roi-title">Estimated Upgrade Cost:</span>
              <span class="roi-val">≈ ₹{{ simulatedCost | number:'1.0-0' }}</span>
            </div>
            <div class="roi-item">
              <span class="roi-title">Net Profit Gain:</span>
              <span class="roi-val text-emerald">≈ ₹{{ (simulatedRevenue - estimatedRevenue - simulatedCost) | number:'1.0-0' }}</span>
            </div>
            <div class="roi-item">
              <span class="roi-title">Estimated Return on Investment (ROI):</span>
              <span class="roi-val text-emerald">{{ ((((simulatedRevenue - estimatedRevenue) - simulatedCost) / (simulatedCost || 1)) * 100) | number:'1.0-0' }}% ROI</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .yield-page {
      max-width: 1250px;
      margin: 0 auto;
      padding: 32px 20px 80px;
      color: #eef5ef;
      font-family: system-ui, -apple-system, sans-serif;
    }

    /* HERO */
    .hero {
      margin: 0 auto 24px;
      padding: 34px;
      border: 1px solid rgba(124, 255, 111, 0.14);
      border-radius: 24px;
      background: linear-gradient(135deg, rgba(28, 40, 31, 0.96), rgba(15, 22, 18, 0.96));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    }
    .eyebrow {
      display: block;
      color: #8cff78;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }
    .hero h1 { margin: 8px 0 10px; font-size: clamp(2rem, 3.8vw, 3rem); color: #f3fff8; }
    .hero p { margin: 0; color: #aeb9b1; font-size: 1rem; max-width: 700px; line-height: 1.6; }
    .hero-icon {
      width: 82px;
      height: 82px;
      flex: 0 0 82px;
      display: grid;
      place-items: center;
      border-radius: 22px;
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.2);
      font-size: 2.3rem;
    }

    .tabs-container {
      display: flex;
      justify-content: center;
      gap: 14px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .tab-btn {
      padding: 12px 22px;
      border-radius: 14px;
      border: 1px solid #253129;
      background: #121815;
      font-size: 14px;
      font-weight: 700;
      color: #8c9e94;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: rgba(125, 255, 111, 0.12);
      border-color: #7dff6f;
      color: #7dff6f;
      box-shadow: 0 0 15px rgba(125, 255, 111, 0.2);
    }

    .hot-badge {
      font-size: 9px;
      background: #ffd166;
      color: #071007;
      padding: 2px 7px;
      border-radius: 6px;
      font-weight: 800;
    }

    .tab-btn.active .hot-badge {
      background: #fef9c3;
      color: #713f12;
    }

    .yield-grid {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 20px;
      align-items: start;
    }

    .card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 22px;
      padding: 26px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .card-title h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 800;
      color: #f3fff8;
    }

    .step-icon { font-size: 20px; }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 16px;
    }

    .input-item {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 14px;
      padding: 13px 15px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .input-item label {
      font-size: 12.5px;
      font-weight: 700;
      color: #c4d7cc;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .val-highlight {
      font-size: 13px;
      font-weight: 800;
      color: #7dff6f;
      background: rgba(125, 255, 111, 0.1);
      padding: 2px 8px;
      border-radius: 8px;
    }

    .val-pill {
      font-size: 11.5px;
      font-weight: 700;
      color: #f1f7f2;
      background: #1e2a22;
      padding: 2px 8px;
      border-radius: 8px;
    }

    select, input[type=range] { width: 100%; }

    select {
      padding: 11px 14px;
      border: 1px solid #303d34;
      border-radius: 10px;
      font-size: 13.5px;
      background: #070c09;
      color: #f1f7f2;
      outline: none;
    }

    input[type=range] { accent-color: #7dff6f; cursor: pointer; }

    .yield-summary-box {
      background: linear-gradient(135deg, rgba(33, 51, 38, 0.96), rgba(15, 23, 18, 0.98));
      border: 1px solid rgba(125, 255, 111, 0.2);
      color: white;
      border-radius: 18px;
      padding: 22px;
      margin-bottom: 18px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .crop-badge {
      display: inline-block;
      background: rgba(125, 255, 111, 0.15);
      border: 1px solid rgba(125, 255, 111, 0.3);
      color: #7dff6f;
      font-size: 13px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 12px;
      margin-bottom: 14px;
    }

    .metric-row {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
      color: #aeb9b1;
      margin-bottom: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .metric-val { font-weight: 800; color: #f3fff8; }

    .production-highlight {
      text-align: center;
      padding: 12px 0;
    }

    .prod-title {
      font-size: 12px;
      color: #8cff78;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
    }

    .prod-value {
      font-size: 42px;
      font-weight: 900;
      color: #7dff6f;
      line-height: 1.1;
      margin: 6px 0;
      text-shadow: 0 0 25px rgba(125, 255, 111, 0.3);
    }

    .prod-value .unit {
      font-size: 22px;
      font-weight: 700;
      color: #a9f7d0;
    }

    .prod-sub { font-size: 12.5px; color: #829087; }

    .confidence-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 13px;
      color: #aeb9b1;
    }

    .conf-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 800;
    }

    .conf-dot { width: 6px; height: 6px; border-radius: 50%; }
    .conf-high { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
    .conf-high .conf-dot { background: #22c55e; }
    .conf-moderate { background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .conf-moderate .conf-dot { background: #f59e0b; }
    .conf-low { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .conf-low .conf-dot { background: #ef4444; }

    .factors-breakdown {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .factors-breakdown h4 {
      margin: 0 0 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #8cff78;
      font-weight: 800;
    }

    .factor-row {
      display: flex;
      justify-content: space-between;
      font-size: 12.5px;
      padding: 6px 0;
      color: #c4d7cc;
      border-bottom: 1px dashed #26332b;
    }

    .factor-row:last-child { border-bottom: none; }
    .factor-score { font-weight: 800; }
    .text-emerald { color: #7dff6f; }
    .text-rose { color: #ff7777; }

    .market-value-card {
      background: rgba(125, 255, 111, 0.08);
      border: 1px solid rgba(125, 255, 111, 0.25);
      border-radius: 14px;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 13px;
      color: #c4d7cc;
    }

    .mv-val { font-size: 16px; font-weight: 800; color: #7dff6f; }

    .disclaimer-alert {
      background: rgba(255, 209, 102, 0.08);
      border: 1px solid rgba(255, 209, 102, 0.25);
      border-radius: 14px;
      padding: 14px 16px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .disc-icon { font-size: 18px; }
    .disc-text { font-size: 11.5px; color: #ffd166; line-height: 1.5; }

    .voice-btn {
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      padding: 6px 14px;
      border-radius: 14px;
      font-size: 12px;
      font-weight: 700;
      color: #7dff6f;
      cursor: pointer;
    }

    .voice-btn.speaking { background: rgba(239, 68, 68, 0.2); border-color: #f87171; color: #fca5a5; }

    .btn-ask-ai {
      width: 100%;
      background: #7dff6f;
      color: #071007;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-ask-ai:hover {
      background: #9aff8f;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(125, 255, 111, 0.25);
    }

    /* WHAT-IF SIMULATOR STYLING */
    .what-if-container {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 24px;
      padding: 30px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .what-if-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #253129;
      padding-bottom: 20px;
    }

    .hero-left h2 {
      margin: 0 0 6px;
      font-size: 22px;
      font-weight: 800;
      color: #f3fff8;
    }

    .hero-left p {
      margin: 0;
      font-size: 13.5px;
      color: #8c9e94;
    }

    .profit-highlight-badge {
      background: linear-gradient(135deg, rgba(33, 51, 38, 0.96), rgba(15, 23, 18, 0.98));
      border: 1px solid rgba(125, 255, 111, 0.3);
      padding: 12px 20px;
      border-radius: 16px;
      text-align: right;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }

    .ph-label { font-size: 11px; color: #8c9e94; display: block; }
    .ph-val { font-size: 24px; font-weight: 900; color: #7dff6f; }

    .interventions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .switch-card {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 18px;
      padding: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .switch-card:hover {
      border-color: rgba(125, 255, 111, 0.4);
      transform: translateY(-2px);
    }

    .switch-card.selected {
      background: rgba(125, 255, 111, 0.08);
      border-color: #7dff6f;
      box-shadow: 0 0 20px rgba(125, 255, 111, 0.15);
    }

    .switch-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .switch-icon { font-size: 22px; }

    .switch-title {
      font-size: 13.5px;
      font-weight: 800;
      color: #f3fff8;
      flex: 1;
    }

    .switch-pill {
      font-size: 10px;
      font-weight: 800;
      background: rgba(125, 255, 111, 0.2);
      color: #7dff6f;
      padding: 2px 7px;
      border-radius: 6px;
    }

    .switch-card p {
      font-size: 11.5px;
      color: #8c9e94;
      line-height: 1.5;
      margin: 0 0 14px;
    }

    .toggle-state {
      font-size: 11.5px;
      font-weight: 800;
      color: #7dff6f;
      padding-top: 8px;
      border-top: 1px solid #26332b;
    }

    .comparison-card {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 20px;
      padding: 24px;
    }

    .comparison-card h3 {
      margin: 0 0 20px;
      font-size: 17px;
      font-weight: 800;
      color: #f3fff8;
      text-align: center;
    }

    .comparison-bars {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 36px;
      padding: 24px 0;
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 150px;
    }

    .bar-label {
      font-size: 12px;
      font-weight: 700;
      color: #8c9e94;
      text-align: center;
    }

    .bar-track {
      width: 76px;
      height: 190px;
      background: #070c09;
      border: 1px solid #26332b;
      border-radius: 14px;
      display: flex;
      align-items: flex-end;
      padding: 4px;
    }

    .bar-fill {
      width: 100%;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: height 0.4s ease;
    }

    .current-bar { background: #475569; }
    .simulated-bar { background: linear-gradient(180deg, #7dff6f, #059669); }

    .bar-val {
      font-size: 13px;
      font-weight: 900;
      color: white;
    }

    .bar-finance {
      text-align: center;
      display: flex;
      flex-direction: column;
    }

    .bar-finance strong { font-size: 16px; color: #f3fff8; }
    .bar-finance small { font-size: 11.5px; color: #8c9e94; }

    .compare-arrow {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      font-size: 28px;
      color: #7dff6f;
      padding-bottom: 50px;
    }

    .arrow-diff {
      font-size: 14px;
      font-weight: 900;
      background: rgba(125, 255, 111, 0.15);
      color: #7dff6f;
      padding: 3px 10px;
      border-radius: 12px;
    }

    .roi-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 20px;
      padding-top: 18px;
      border-top: 1px solid #26332b;
      text-align: center;
    }

    .roi-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .roi-title { font-size: 11.5px; font-weight: 700; color: #8c9e94; }
    .roi-val { font-size: 18px; font-weight: 900; color: #f3fff8; }

    @media (max-width: 800px) {
      .hero { padding: 22px 18px; }
      .hero-icon { display: none; }
      .yield-grid { grid-template-columns: 1fr; }
      .what-if-hero { flex-direction: column; align-items: flex-start; gap: 14px; }
      .roi-summary { grid-template-columns: 1fr; }
    }
  `]
})
export class YieldComponent implements OnInit {

  activeTab: 'estimator' | 'simulator' = 'estimator';

  // Inputs
  selectedCropKey = 'wheat';
  farmArea = 2.5;
  soilCondition = 'loamy';
  irrigationType = 'tubewell';
  fertilizerLevel = 'balanced';
  temperature = 24;
  rainfall = 650;

  // Outputs
  estimatedTotalTonnes = 4.1;
  estimatedPerAcreTonnes = 1.64;
  estimatedRevenue = 93275;
  confidence: 'High' | 'Moderate' | 'Low' = 'Moderate';

  soilMultiplier = 1.05;
  waterMultiplier = 1.05;
  fertMultiplier = 1.08;
  climateMultiplier = 1.02;

  // What-If Simulator Options
  optDrip = true;
  optSoilTest = true;
  optBio = false;
  optSeeds = true;

  simulatedTotalTonnes = 5.6;
  simulatedRevenue = 127400;
  simulatedCost = 8500;

  readonly cropProfiles: Record<string, CropYieldProfile> = {
    wheat: { name: 'Wheat', hindiName: 'गेहूं', emoji: '🌾', baseYieldTonnesPerAcre: 1.60, optimalTempMin: 18, optimalTempMax: 26, optimalRainMin: 450, optimalRainMax: 750, marketPricePerTonne: 22750 },
    rice: { name: 'Rice / Paddy', hindiName: 'धान', emoji: '🌾', baseYieldTonnesPerAcre: 2.20, optimalTempMin: 24, optimalTempMax: 35, optimalRainMin: 1000, optimalRainMax: 1800, marketPricePerTonne: 23000 },
    maize: { name: 'Maize', hindiName: 'मक्का', emoji: '🌽', baseYieldTonnesPerAcre: 2.40, optimalTempMin: 21, optimalTempMax: 30, optimalRainMin: 500, optimalRainMax: 900, marketPricePerTonne: 20900 },
    tomato: { name: 'Tomato', hindiName: 'टमाटर', emoji: '🍅', baseYieldTonnesPerAcre: 12.0, optimalTempMin: 20, optimalTempMax: 29, optimalRainMin: 600, optimalRainMax: 1100, marketPricePerTonne: 15000 },
    cotton: { name: 'Cotton', hindiName: 'कपास', emoji: '🌱', baseYieldTonnesPerAcre: 0.95, optimalTempMin: 25, optimalTempMax: 35, optimalRainMin: 600, optimalRainMax: 1000, marketPricePerTonne: 71200 },
    potato: { name: 'Potato', hindiName: 'आलू', emoji: '🥔', baseYieldTonnesPerAcre: 9.5, optimalTempMin: 15, optimalTempMax: 24, optimalRainMin: 400, optimalRainMax: 700, marketPricePerTonne: 14000 },
    soybean: { name: 'Soybean', hindiName: 'सोयाबीन', emoji: '🌿', baseYieldTonnesPerAcre: 0.90, optimalTempMin: 20, optimalTempMax: 30, optimalRainMin: 600, optimalRainMax: 1000, marketPricePerTonne: 46000 },
    sugarcane: { name: 'Sugarcane', hindiName: 'गन्ना', emoji: '🎋', baseYieldTonnesPerAcre: 35.0, optimalTempMin: 25, optimalTempMax: 36, optimalRainMin: 1200, optimalRainMax: 2000, marketPricePerTonne: 3400 }
  };

  cropList = Object.keys(this.cropProfiles).map(key => ({ key, ...this.cropProfiles[key] }));

  get activeCrop(): CropYieldProfile {
    return this.cropProfiles[this.selectedCropKey] || this.cropProfiles['wheat'];
  }

  get selectedCrop(): CropYieldProfile {
    return this.activeCrop;
  }

  get irrigationMultiplier(): number {
    return this.waterMultiplier;
  }

  get fertilizerMultiplier(): number {
    return this.fertMultiplier;
  }

  toggleSpeakYield(): void {
    this.toggleSpeakResult();
  }

  askAiAssistant(): void {
    this.askAiToOptimize();
  }

  isSpeaking = false;
  private synth: SpeechSynthesis | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    this.calculateYield();
    this.runSimulation();
  }

  calculateYield(): void {
    const crop = this.activeCrop;

    const soilMap: Record<string, number> = { loamy: 1.08, black: 1.06, alluvial: 1.10, red: 0.95, sandy: 0.82, clay: 0.90 };
    this.soilMultiplier = soilMap[this.soilCondition] || 1.0;

    const waterMap: Record<string, number> = { drip: 1.15, tubewell: 1.04, sprinkler: 1.08, limited: 0.88, rainfed: 0.72 };
    this.waterMultiplier = waterMap[this.irrigationType] || 1.0;

    const fertMap: Record<string, number> = { balanced: 1.10, standard: 1.02, organic: 1.04, low: 0.85 };
    this.fertMultiplier = fertMap[this.fertilizerLevel] || 1.0;

    let climScore = 1.0;
    if (this.temperature >= crop.optimalTempMin && this.temperature <= crop.optimalTempMax) {
      climScore += 0.04;
    } else if (Math.abs(this.temperature - crop.optimalTempMin) > 7 || Math.abs(this.temperature - crop.optimalTempMax) > 7) {
      climScore -= 0.12;
    }

    if (this.rainfall >= crop.optimalRainMin && this.rainfall <= crop.optimalRainMax) {
      climScore += 0.04;
    } else if (this.rainfall < crop.optimalRainMin * 0.6) {
      climScore -= 0.15;
    }
    this.climateMultiplier = climScore;

    const netMultiplier = this.soilMultiplier * this.waterMultiplier * this.fertMultiplier * this.climateMultiplier;
    this.estimatedPerAcreTonnes = crop.baseYieldTonnesPerAcre * netMultiplier;
    this.estimatedTotalTonnes = this.estimatedPerAcreTonnes * this.farmArea;
    this.estimatedRevenue = this.estimatedTotalTonnes * crop.marketPricePerTonne;

    if (this.irrigationType === 'rainfed' || this.soilCondition === 'sandy') {
      this.confidence = 'Low';
    } else if (this.irrigationType === 'drip' && this.fertilizerLevel === 'balanced' && climScore >= 1.0) {
      this.confidence = 'High';
    } else {
      this.confidence = 'Moderate';
    }

    this.runSimulation();
  }

  runSimulation(): void {
    const crop = this.activeCrop;
    let boost = 1.0;
    let cost = 0;

    if (this.optDrip) { boost += 0.16; cost += 4500 * this.farmArea; }
    if (this.optSoilTest) { boost += 0.12; cost += 1200 * this.farmArea; }
    if (this.optBio) { boost += 0.08; cost += 1000 * this.farmArea; }
    if (this.optSeeds) { boost += 0.10; cost += 1500 * this.farmArea; }

    this.simulatedTotalTonnes = (this.estimatedTotalTonnes * boost);
    this.simulatedRevenue = this.simulatedTotalTonnes * crop.marketPricePerTonne;
    this.simulatedCost = cost;
  }

  toggleSpeakResult(): void {
    if (this.isSpeaking) {
      if (this.synth) this.synth.cancel();
      this.isSpeaking = false;
    } else if (this.synth) {
      const msg = `Expected Yield for ${this.activeCrop.name}. For your ${this.farmArea} acres farm, the estimated production is approximately ${this.estimatedTotalTonnes.toFixed(1)} tonnes, with ${this.confidence} confidence. Please note, this is an estimate, not a guaranteed prediction.`;
      const utter = new SpeechSynthesisUtterance(msg);
      utter.rate = 0.95;
      this.isSpeaking = true;
      utter.onend = () => { this.isSpeaking = false; };
      this.synth.speak(utter);
    }
  }

  askAiToOptimize(): void {
    const prompt = `My farm has ${this.farmArea} acres of ${this.activeCrop.name} in ${this.soilCondition} soil. The current estimated yield is approx ${this.estimatedTotalTonnes.toFixed(1)} tonnes (${this.confidence} confidence). What specific agronomic interventions, fertigation timing, and foliar sprays should I use to maximize this harvest?`;
    sessionStorage.setItem('pendingAiPrompt', prompt);
    window.location.href = '/assistant';
  }
}

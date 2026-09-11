import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SoilNutrient {
  name: string;
  symbol: string;
  value: number;
  unit: string;
  status: 'LOW' | 'MEDIUM' | 'GOOD' | 'HIGH';
  statusColor: string;
  guidance: string;
}

interface FertilizerDose {
  name: string;
  kgPerAcre: number;
  bags50kg: number;
  stage: string;
  method: string;
  purpose: string;
  isOrganic?: boolean;
}

@Component({
  selector: 'app-fertilizer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="advisor-page">
      
      <!-- HERO -->
      <section class="hero">
        <div>
          <span class="eyebrow">KRISHIAI • PRECISION NUTRIENT LAB</span>
          <h1>Fertilizer Advisor</h1>
          <p>Connect your soil test metrics to actionable, field-ready fertilizer schedules and exact 50kg bag calculations.</p>
        </div>
        <div class="hero-icon">🌿</div>
      </section>

      <div class="advisor-grid">

        <!-- STEP 1: SOIL TEST INPUTS -->
        <div class="card soil-card">
          <div class="card-title">
            <span class="step-num">1</span>
            <h3>Soil Test Analysis</h3>
          </div>

          <div class="inputs-grid">
            <div class="input-group">
              <div class="input-header">
                <label>Nitrogen (N)</label>
                <span class="val-badge badge-{{ nitrogenStatus.status.toLowerCase() }}">{{ nitrogenStatus.status }} ({{ nitrogen }} kg/ha)</span>
              </div>
              <input type="range" min="20" max="250" [(ngModel)]="nitrogen" (ngModelChange)="recalculate()" />
            </div>

            <div class="input-group">
              <div class="input-header">
                <label>Phosphorus (P)</label>
                <span class="val-badge badge-{{ phosphorusStatus.status.toLowerCase() }}">{{ phosphorusStatus.status }} ({{ phosphorus }} kg/ha)</span>
              </div>
              <input type="range" min="10" max="120" [(ngModel)]="phosphorus" (ngModelChange)="recalculate()" />
            </div>

            <div class="input-group">
              <div class="input-header">
                <label>Potassium (K)</label>
                <span class="val-badge badge-{{ potassiumStatus.status.toLowerCase() }}">{{ potassiumStatus.status }} ({{ potassium }} kg/ha)</span>
              </div>
              <input type="range" min="20" max="250" [(ngModel)]="potassium" (ngModelChange)="recalculate()" />
            </div>

            <div class="input-group">
              <div class="input-header">
                <label>Soil pH</label>
                <span class="val-badge badge-{{ phStatus.status.toLowerCase() }}">{{ ph }} pH ({{ phStatus.status }})</span>
              </div>
              <input type="range" min="4.5" max="9.5" step="0.1" [(ngModel)]="ph" (ngModelChange)="recalculate()" />
            </div>

            <div class="selectors-row">
              <div class="select-item">
                <label>Target Crop:</label>
                <select [(ngModel)]="targetCrop" (ngModelChange)="recalculate()">
                  <option value="Wheat">🌾 Wheat (गेहूं)</option>
                  <option value="Rice">🌾 Paddy / Rice (धान)</option>
                  <option value="Tomato">🍅 Tomato (टमाटर)</option>
                  <option value="Cotton">🌱 Cotton (कपास)</option>
                  <option value="Maize">🌽 Maize (मक्का)</option>
                  <option value="Potato">🥔 Potato (आलू)</option>
                  <option value="Soybean">🌿 Soybean (सोयाबीन)</option>
                </select>
              </div>

              <div class="select-item">
                <label>Farm Size (Acres):</label>
                <input type="number" min="0.5" max="100" step="0.5" [(ngModel)]="acres" (ngModelChange)="recalculate()" />
              </div>
            </div>
          </div>

          <!-- SUMMARY STATUS TABLE -->
          <div class="soil-summary-box">
            <div class="summary-row">
              <span class="param-name">NITROGEN</span>
              <span class="param-status status-{{ nitrogenStatus.status.toLowerCase() }}">{{ nitrogenStatus.status }}</span>
            </div>
            <div class="summary-row">
              <span class="param-name">PHOSPHORUS</span>
              <span class="param-status status-{{ phosphorusStatus.status.toLowerCase() }}">{{ phosphorusStatus.status }}</span>
            </div>
            <div class="summary-row">
              <span class="param-name">POTASSIUM</span>
              <span class="param-status status-{{ potassiumStatus.status.toLowerCase() }}">{{ potassiumStatus.status }}</span>
            </div>
            <div class="summary-row">
              <span class="param-name">pH</span>
              <span class="param-status status-{{ phStatus.status.toLowerCase() }}">{{ ph }} ({{ phStatus.status }})</span>
            </div>
          </div>
        </div>

        <!-- FLOW ARROW -->
        <div class="flow-divider">
          <div class="flow-icon">↓</div>
        </div>

        <!-- STEP 2: FERTILIZER PRESCRIPTION -->
        <div class="card advice-card">
          <div class="card-title-row">
            <div class="card-title">
              <span class="step-num">2</span>
              <h3>🌱 Fertilizer Guidance & Prescription</h3>
            </div>
            <button type="button" class="voice-btn" [class.speaking]="isSpeaking" (click)="toggleSpeakAdvice()">
              {{ isSpeaking ? '⏹ Stop Voice' : '🔊 Listen Plan' }}
            </button>
          </div>

          <div class="guidance-banner">
            <div class="banner-icon">💡</div>
            <div>
              <h4>{{ primaryRecommendationTitle }}</h4>
              <p>{{ primaryRecommendationDetails }}</p>
            </div>
          </div>

          <div class="schedule-section">
            <h4>Recommended Application Schedule (For {{ acres }} Acre{{ acres > 1 ? 's' : '' }} of {{ targetCrop }}):</h4>
            <div class="doses-list">
              <div class="dose-item" *ngFor="let dose of fertilizerDoses">
                <div class="dose-header">
                  <div class="fert-name">
                    <span class="fert-badge" [class.organic]="dose.isOrganic">{{ dose.isOrganic ? 'ORGANIC' : 'CHEMICAL' }}</span>
                    <strong>{{ dose.name }}</strong>
                  </div>
                  <div class="fert-qty">
                    <span class="qty-highlight">{{ dose.kgPerAcre * acres | number:'1.0-1' }} kg</span>
                    <span class="qty-sub">({{ (dose.kgPerAcre * acres) / 50 | number:'1.1-1' }} bags of 50kg)</span>
                  </div>
                </div>
                <div class="dose-meta">
                  <span><strong>⏱ Timing:</strong> {{ dose.stage }}</span>
                  <span><strong>🚜 Method:</strong> {{ dose.method }}</span>
                </div>
                <div class="dose-purpose">🎯 {{ dose.purpose }}</div>
              </div>
            </div>
          </div>

          <div class="amendments-box" *ngIf="amendmentNotice">
            <strong>⚠️ Soil Amendment Notice:</strong> {{ amendmentNotice }}
          </div>

          <div class="action-footer">
            <button type="button" class="btn-ask-ai" (click)="askAiAssistant()">
              🤖 Ask AI Assistant to Explain Custom Spray Plan →
            </button>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .advisor-page {
      max-width: 1250px;
      margin: 0 auto;
      padding: 32px 20px 80px;
      color: #eef5ef;
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

    .advisor-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
    .card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 26px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
    }
    .card-title { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .card-title-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #7dff6f;
      color: #071007;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 900;
    }
    .card-title h3 { margin: 0; font-size: 20px; color: #f3fff8; }

    .inputs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 22px; }
    .input-group {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 14px;
      padding: 14px 16px;
    }
    .input-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .input-header label { font-size: 13.5px; font-weight: 700; color: #eef5ef; }
    .val-badge { font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 12px; }
    .badge-low { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }
    .badge-medium { background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .badge-good, .badge-optimal { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
    .badge-high { background: rgba(99, 102, 241, 0.2); color: #c7d2fe; border: 1px solid rgba(99, 102, 241, 0.4); }

    input[type=range] {
      width: 100%;
      accent-color: #7dff6f;
      cursor: pointer;
    }

    .selectors-row {
      grid-column: span 2;
      display: flex;
      gap: 14px;
      background: #0d130f;
      border: 1px solid #26332b;
      padding: 16px;
      border-radius: 14px;
    }
    .select-item { flex: 1; display: flex; flex-direction: column; gap: 6px; }
    .select-item label { font-size: 12px; font-weight: 700; color: #8cff78; }
    .select-item select, .select-item input {
      padding: 11px 14px;
      border: 1px solid #303d34;
      border-radius: 10px;
      font-size: 14px;
      background: #070c09;
      color: #f1f7f2;
    }

    .soil-summary-box {
      background: #0b100d;
      border: 1px solid rgba(125, 255, 111, 0.2);
      border-radius: 16px;
      padding: 18px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      text-align: center;
    }
    .summary-row { display: flex; flex-direction: column; gap: 4px; }
    .param-name { font-size: 11px; letter-spacing: 1.5px; color: #7f8b83; font-weight: 800; }
    .param-status { font-size: 15px; font-weight: 800; }
    .status-low { color: #ff7777; }
    .status-medium { color: #ffd166; }
    .status-good, .status-optimal { color: #7dff6f; }
    .status-high { color: #a5b4fc; }

    .flow-divider { display: flex; align-items: center; justify-content: center; margin: -6px 0; }
    .flow-icon {
      width: 40px;
      height: 40px;
      background: #7dff6f;
      color: #071007;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      box-shadow: 0 0 20px rgba(125, 255, 111, 0.4);
    }

    .guidance-banner {
      background: rgba(125, 255, 111, 0.08);
      border: 1px solid rgba(125, 255, 111, 0.25);
      border-radius: 16px;
      padding: 16px 20px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      margin-bottom: 22px;
    }
    .banner-icon { font-size: 24px; }
    .guidance-banner h4 { margin: 0 0 4px; font-size: 16px; color: #7dff6f; font-weight: 800; }
    .guidance-banner p { margin: 0; font-size: 13.5px; color: #c4d7cc; line-height: 1.6; }

    .voice-btn {
      background: rgba(125, 255, 111, 0.1);
      border: 1px solid rgba(125, 255, 111, 0.3);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      color: #7dff6f;
      cursor: pointer;
      transition: all 0.2s;
    }
    .voice-btn:hover { background: #7dff6f; color: #071007; }
    .voice-btn.speaking { background: rgba(239, 68, 68, 0.2); border-color: #f87171; color: #fca5a5; }

    .schedule-section h4 { margin: 0 0 14px; font-size: 15px; color: #f3fff8; }
    .doses-list { display: flex; flex-direction: column; gap: 12px; }
    .dose-item {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 14px;
      padding: 16px;
    }
    .dose-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .fert-name { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #f3fff8; }
    .fert-badge { font-size: 9px; font-weight: 800; background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.4); padding: 3px 7px; border-radius: 6px; }
    .fert-badge.organic { background: rgba(34, 197, 94, 0.2); color: #86efac; border-color: rgba(34, 197, 94, 0.4); }
    .qty-highlight { font-size: 16px; font-weight: 800; color: #7dff6f; margin-right: 8px; }
    .qty-sub { font-size: 12px; color: #829087; }
    .dose-meta { display: flex; flex-wrap: wrap; gap: 16px; font-size: 12.5px; color: #9bb0a4; margin-bottom: 6px; }
    .dose-purpose { font-size: 12.5px; color: #c2d4c9; }

    .amendments-box {
      margin-top: 18px;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      padding: 14px 16px;
      border-radius: 14px;
      font-size: 13px;
      color: #fde68a;
    }

    .action-footer { margin-top: 22px; }
    .btn-ask-ai {
      width: 100%;
      background: #7dff6f;
      color: #071007;
      border: none;
      padding: 15px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-ask-ai:hover {
      background: #9aff8f;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(125, 255, 111, 0.3);
    }

    @media (max-width: 650px) {
      .hero { padding: 22px 18px; }
      .hero-icon { display: none; }
      .inputs-grid { grid-template-columns: 1fr; }
      .selectors-row { grid-column: span 1; flex-direction: column; }
      .soil-summary-box { grid-template-columns: 1fr 1fr; }
      .dose-header { flex-direction: column; align-items: flex-start; gap: 6px; }
    }
  `]
})
export class FertilizerComponent implements OnInit {
  nitrogen = 65;
  phosphorus = 42;
  potassium = 120;
  ph = 6.7;
  targetCrop = 'Wheat';
  acres = 1;

  nitrogenStatus!: SoilNutrient;
  phosphorusStatus!: SoilNutrient;
  potassiumStatus!: SoilNutrient;
  phStatus!: SoilNutrient;

  primaryRecommendationTitle = '';
  primaryRecommendationDetails = '';
  amendmentNotice = '';
  fertilizerDoses: FertilizerDose[] = [];

  isSpeaking = false;
  private synth: SpeechSynthesis | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
    this.recalculate();
  }

  recalculate(): void {
    // 1. Nitrogen
    if (this.nitrogen < 90) {
      this.nitrogenStatus = { name: 'Nitrogen', symbol: 'N', value: this.nitrogen, unit: 'kg/ha', status: 'LOW', statusColor: '#ef4444', guidance: 'Nitrogen management recommended.' };
    } else if (this.nitrogen <= 140) {
      this.nitrogenStatus = { name: 'Nitrogen', symbol: 'N', value: this.nitrogen, unit: 'kg/ha', status: 'MEDIUM', statusColor: '#f59e0b', guidance: 'Moderate Nitrogen.' };
    } else {
      this.nitrogenStatus = { name: 'Nitrogen', symbol: 'N', value: this.nitrogen, unit: 'kg/ha', status: 'GOOD', statusColor: '#10b981', guidance: 'Optimum Nitrogen.' };
    }

    // 2. Phosphorus
    if (this.phosphorus < 30) {
      this.phosphorusStatus = { name: 'Phosphorus', symbol: 'P', value: this.phosphorus, unit: 'kg/ha', status: 'LOW', statusColor: '#ef4444', guidance: 'Low Phosphorus.' };
    } else if (this.phosphorus <= 60) {
      this.phosphorusStatus = { name: 'Phosphorus', symbol: 'P', value: this.phosphorus, unit: 'kg/ha', status: 'MEDIUM', statusColor: '#f59e0b', guidance: 'Medium Phosphorus.' };
    } else {
      this.phosphorusStatus = { name: 'Phosphorus', symbol: 'P', value: this.phosphorus, unit: 'kg/ha', status: 'GOOD', statusColor: '#10b981', guidance: 'Optimal Phosphorus.' };
    }

    // 3. Potassium
    if (this.potassium < 80) {
      this.potassiumStatus = { name: 'Potassium', symbol: 'K', value: this.potassium, unit: 'kg/ha', status: 'LOW', statusColor: '#ef4444', guidance: 'Low Potassium.' };
    } else if (this.potassium <= 160) {
      this.potassiumStatus = { name: 'Potassium', symbol: 'K', value: this.potassium, unit: 'kg/ha', status: 'GOOD', statusColor: '#10b981', guidance: 'Sufficient Potassium.' };
    } else {
      this.potassiumStatus = { name: 'Potassium', symbol: 'K', value: this.potassium, unit: 'kg/ha', status: 'HIGH', statusColor: '#6366f1', guidance: 'High Potassium.' };
    }

    // 4. pH
    if (this.ph < 6.0) {
      this.phStatus = { name: 'Soil pH', symbol: 'pH', value: this.ph, unit: 'pH', status: 'LOW', statusColor: '#ef4444', guidance: 'Acidic soil.' };
      this.amendmentNotice = `Soil is acidic (pH ${this.ph}). Apply Agricultural Lime (250 kg/acre).`;
    } else if (this.ph <= 7.5) {
      this.phStatus = { name: 'Soil pH', symbol: 'pH', value: this.ph, unit: 'pH', status: 'GOOD', statusColor: '#10b981', guidance: 'Optimal pH.' };
      this.amendmentNotice = '';
    } else {
      this.phStatus = { name: 'Soil pH', symbol: 'pH', value: this.ph, unit: 'pH', status: 'HIGH', statusColor: '#f59e0b', guidance: 'Alkaline soil.' };
      this.amendmentNotice = `Soil is alkaline (pH ${this.ph}). Apply Gypsum (200 kg/acre).`;
    }

    // Guidance title & schedule
    if (this.nitrogenStatus.status === 'LOW') {
      this.primaryRecommendationTitle = 'Nitrogen Management Recommended';
      this.primaryRecommendationDetails = 'Consider soil-test-based fertilizer application. Apply Urea in split doses (1/3rd basal + 1/3rd at first irrigation + 1/3rd at vegetative peak) to maximize uptake and avoid leaching.';
    } else {
      this.primaryRecommendationTitle = 'Balanced Soil-Test-Based Fertilizer Program';
      this.primaryRecommendationDetails = 'Maintain balanced maintenance doses of N-P-K along with organic bio-fertilizers.';
    }

    this.fertilizerDoses = [
      { name: 'DAP (18:46:0)', kgPerAcre: 50, bags50kg: 1.0, stage: 'Basal (At Sowing)', method: 'Band placement below seed', purpose: 'Root development and starter nitrogen.' },
      { name: 'Urea (46% N) - 1st Split', kgPerAcre: 35, bags50kg: 0.7, stage: '1st Top Dressing (21 days / 1st Irrigation)', method: 'Broadcast in moist soil', purpose: 'Tillering and vegetative growth.' },
      { name: 'Urea (46% N) - 2nd Split', kgPerAcre: 35, bags50kg: 0.7, stage: '2nd Top Dressing (40-45 days)', method: 'Broadcast before irrigation', purpose: 'Canopy & flowering boost.' },
      { name: 'MOP (0:0:60)', kgPerAcre: 20, bags50kg: 0.4, stage: 'Basal (Land Prep)', method: 'Soil incorporation', purpose: 'Grain weight & drought tolerance.' },
      { name: 'Vermicompost / Bio-NPK', kgPerAcre: 200, bags50kg: 4.0, stage: 'Pre-sowing', method: 'Broadcast with topsoil', purpose: 'Microbial health & nutrient efficiency.', isOrganic: true }
    ];
  }

  toggleSpeakAdvice(): void {
    if (this.isSpeaking) {
      if (this.synth) this.synth.cancel();
      this.isSpeaking = false;
    } else if (this.synth) {
      const msg = `Fertilizer Guidance for ${this.targetCrop}. ${this.primaryRecommendationTitle}. ${this.primaryRecommendationDetails}. Apply 50 kg DAP at sowing, and 35 kg Urea in split doses.`;
      const utter = new SpeechSynthesisUtterance(msg);
      utter.rate = 0.95;
      this.isSpeaking = true;
      utter.onend = () => { this.isSpeaking = false; };
      this.synth.speak(utter);
    }
  }

  askAiAssistant(): void {
    const prompt = `My soil test shows Nitrogen is ${this.nitrogenStatus.status} (${this.nitrogen} kg/ha), Phosphorus is ${this.phosphorusStatus.status} (${this.phosphorus} kg/ha), Potassium is ${this.potassiumStatus.status} (${this.potassium} kg/ha), and pH is ${this.ph}. Please explain the exact fertilizer and irrigation schedule for ${this.acres} acres of ${this.targetCrop}.`;
    sessionStorage.setItem('pendingAiPrompt', prompt);
    window.location.href = '/assistant';
  }
}

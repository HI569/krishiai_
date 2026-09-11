import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface MandiPriceRecord {
  crop: string;
  emoji: string;
  mandiName: string;
  state: string;
  currentPrice: number; // INR per quintal (100 kg)
  mspPrice: number;
  priceTrend: 'RISING' | 'STABLE' | 'FALLING';
  arrivalTonnes: number;
  bestSellingVerdict: string;
}

@Component({
  selector: 'app-mandi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mandi-page">
      
      <!-- HERO -->
      <section class="hero">
        <div>
          <span class="eyebrow">KRISHIAI • APMC MARKET RADAR</span>
          <h1>Live Mandi Rates & Harvest Revenue</h1>
          <p>Track daily agricultural commodity prices across major Indian APMC Mandis and calculate your harvest profit.</p>
        </div>
        <div class="hero-icon">💰</div>
      </section>

      <!-- HARVEST REVENUE CALCULATOR -->
      <div class="calculator-card">
        <div class="calc-header">
          <div class="calc-title">
            <span class="calc-icon">🧮</span>
            <div>
              <h3>Instant Crop Value Calculator</h3>
              <p>Estimate the gross market payout for your harvest at current Mandi rates.</p>
            </div>
          </div>
        </div>

        <div class="calc-grid">
          <div class="calc-input">
            <label>Crop:</label>
            <select [(ngModel)]="selectedCrop" (ngModelChange)="recalcPayout()">
              <option *ngFor="let m of mandiData" [value]="m.crop">
                {{ m.emoji }} {{ m.crop }}
              </option>
            </select>
          </div>

          <div class="calc-input">
            <label>Estimated Production (Tonnes):</label>
            <input type="number" min="0.5" max="500" step="0.5" [(ngModel)]="tonnage" (ngModelChange)="recalcPayout()" />
          </div>

          <div class="calc-result-box">
            <span class="res-title">Estimated Gross Mandi Payout:</span>
            <span class="res-value">₹{{ totalPayout | number:'1.0-0' }}</span>
            <span class="res-sub">({{ (tonnage * 10) | number:'1.0-1' }} Quintals @ ₹{{ activeRecord?.currentPrice }}/qtl)</span>
          </div>
        </div>
      </div>

      <!-- LIVE COMMODITY MANDI TABLE -->
      <div class="mandi-table-card">
        <div class="table-head-row">
          <h3>📊 Real-Time APMC Mandi Rates (₹ / Quintal):</h3>
          <span class="live-pill">● LIVE APMC FEED</span>
        </div>

        <div class="records-grid">
          <div class="mandi-item" *ngFor="let record of mandiData">
            
            <div class="item-head">
              <div class="crop-info">
                <span class="crop-icon">{{ record.emoji }}</span>
                <div>
                  <strong>{{ record.crop }}</strong>
                  <span class="market-name">📍 {{ record.mandiName }}, {{ record.state }}</span>
                </div>
              </div>

              <div class="price-block">
                <span class="price-val">₹{{ record.currentPrice }}</span>
                <span class="price-unit">per quintal</span>
              </div>
            </div>

            <div class="item-body">
              <div class="msp-compare">
                <span class="msp-label">Govt MSP: <strong>₹{{ record.mspPrice }}</strong></span>
                <span 
                  class="diff-badge"
                  [class.badge-profit]="record.currentPrice >= record.mspPrice"
                  [class.badge-loss]="record.currentPrice < record.mspPrice"
                >
                  {{ record.currentPrice >= record.mspPrice ? '+' : '' }}₹{{ record.currentPrice - record.mspPrice }} vs MSP
                </span>
              </div>

              <div class="trend-row">
                <span class="trend-badge trend-{{ record.priceTrend.toLowerCase() }}">
                  <span *ngIf="record.priceTrend === 'RISING'">📈 Price Rising</span>
                  <span *ngIf="record.priceTrend === 'STABLE'">⚖️ Price Stable</span>
                  <span *ngIf="record.priceTrend === 'FALLING'">📉 Price Falling</span>
                </span>
                <span class="arrivals-text">📦 {{ record.arrivalTonnes }} t arrived today</span>
              </div>

              <div class="verdict-box">
                🎯 <strong>Selling Advisory:</strong> {{ record.bestSellingVerdict }}
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- SELLING TIPS -->
      <div class="tips-box">
        <h4>💡 Top Mandi Selling Strategies:</h4>
        <p>• <strong>Grade & Clean Grain:</strong> Removing foreign matter and chaff boosts modal auction bids by <strong>₹80 - ₹120 per quintal</strong>.</p>
        <p>• <strong>Moisture Threshold:</strong> Ensure grain moisture is strictly below <strong>12%</strong> for wheat/paddy to avoid deductions by APMC commission agents.</p>
      </div>

    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    .mandi-page {
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

    .calculator-card {
      background: #121815;
      border: 1px solid #253129;
      color: white;
      border-radius: 24px;
      padding: 26px;
      margin-bottom: 24px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
    }

    .calc-header { margin-bottom: 18px; }
    .calc-title { display: flex; align-items: center; gap: 14px; }
    .calc-icon { font-size: 32px; }
    .calc-title h3 { margin: 0; font-size: 20px; color: #f3fff8; }
    .calc-title p { margin: 4px 0 0; font-size: 13px; color: #8c9e94; }

    .calc-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1.3fr;
      gap: 16px;
      align-items: center;
      background: #0d130f;
      border: 1px solid #26332b;
      padding: 18px;
      border-radius: 18px;
    }

    .calc-input { display: flex; flex-direction: column; gap: 6px; }
    .calc-input label { font-size: 12.5px; font-weight: 700; color: #8cff78; }
    .calc-input select, .calc-input input {
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid #303d34;
      background: #070c09;
      color: #f1f7f2;
      font-weight: 700;
      font-size: 14px;
    }

    .calc-result-box {
      background: rgba(125, 255, 111, 0.08);
      border: 1px solid rgba(125, 255, 111, 0.25);
      padding: 14px 18px;
      border-radius: 14px;
      text-align: right;
      display: flex;
      flex-direction: column;
    }

    .res-title { font-size: 11px; color: #8c9e94; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; }
    .res-value { font-size: 30px; font-weight: 900; color: #7dff6f; text-shadow: 0 0 20px rgba(125, 255, 111, 0.3); }
    .res-sub { font-size: 11.5px; color: #aeb9b1; margin-top: 2px; }

    .mandi-table-card {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 24px;
      padding: 26px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.3);
    }

    .table-head-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .table-head-row h3 { margin: 0; font-size: 18px; font-weight: 800; color: #f3fff8; }
    .live-pill { font-size: 11px; font-weight: 800; background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 10px; border-radius: 10px; }

    .records-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 18px;
    }

    .mandi-item {
      background: #0d130f;
      border: 1px solid #26332b;
      border-radius: 18px;
      padding: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s;
    }
    .mandi-item:hover {
      border-color: rgba(125, 255, 111, 0.35);
      transform: translateY(-2px);
    }

    .item-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1px solid #26332b;
      padding-bottom: 12px;
    }

    .crop-info { display: flex; align-items: center; gap: 12px; }
    .crop-icon { font-size: 28px; }
    .crop-info strong { font-size: 16px; color: #f3fff8; display: block; }
    .market-name { font-size: 11.5px; color: #829087; margin-top: 2px; }

    .price-block { text-align: right; }
    .price-val { font-size: 24px; font-weight: 900; color: #7dff6f; display: block; }
    .price-unit { font-size: 10.5px; color: #829087; }

    .item-body { display: flex; flex-direction: column; gap: 10px; font-size: 12.5px; }
    .msp-compare { display: flex; justify-content: space-between; align-items: center; }
    .msp-label { color: #aeb9b1; }
    .msp-label strong { color: #f3fff8; }
    
    .diff-badge { font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 8px; }
    .badge-profit { background: rgba(34, 197, 94, 0.2); color: #86efac; border: 1px solid rgba(34, 197, 94, 0.4); }
    .badge-loss { background: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.4); }

    .trend-row { display: flex; justify-content: space-between; align-items: center; font-size: 11.5px; }
    .trend-badge { font-weight: 800; padding: 2px 6px; border-radius: 6px; }
    .trend-rising { color: #86efac; }
    .trend-stable { color: #93c5fd; }
    .trend-falling { color: #fca5a5; }
    .arrivals-text { color: #829087; }

    .verdict-box {
      background: rgba(125, 255, 111, 0.08);
      border: 1px solid rgba(125, 255, 111, 0.2);
      border-radius: 10px;
      padding: 10px 12px;
      font-size: 11.5px;
      color: #c4d7cc;
      line-height: 1.4;
    }
    .verdict-box strong { color: #7dff6f; }

    .tips-box {
      margin-top: 24px;
      background: #121815;
      border: 1px solid #253129;
      border-radius: 20px;
      padding: 22px 26px;
    }
    .tips-box h4 { margin: 0 0 10px; font-size: 14px; color: #8cff78; font-weight: 800; }
    .tips-box p { margin: 6px 0; font-size: 13px; color: #aeb9b1; line-height: 1.6; }

    @media (max-width: 750px) {
      .hero { padding: 22px 18px; }
      .hero-icon { display: none; }
      .calc-grid { grid-template-columns: 1fr; }
      .records-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class MandiComponent implements OnInit {

  selectedCrop = 'Wheat';
  tonnage = 4.1; // Default from yield model
  totalPayout = 98400;

  mandiData: MandiPriceRecord[] = [
    {
      crop: 'Wheat',
      emoji: '🌾',
      mandiName: 'Indore Mandi',
      state: 'Madhya Pradesh',
      currentPrice: 2400,
      mspPrice: 2275,
      priceTrend: 'RISING',
      arrivalTonnes: 1240,
      bestSellingVerdict: 'High demand from flour millers. Good time to liquidate 50% stock.'
    },
    {
      crop: 'Paddy / Basmati',
      emoji: '🌾',
      mandiName: 'Karnal Mandi',
      state: 'Haryana',
      currentPrice: 3850,
      mspPrice: 2300,
      priceTrend: 'RISING',
      arrivalTonnes: 850,
      bestSellingVerdict: 'Export demand strong. Hold premium grade for next week surge.'
    },
    {
      crop: 'Soybean',
      emoji: '🌿',
      mandiName: 'Ujjain Mandi',
      state: 'Madhya Pradesh',
      currentPrice: 4750,
      mspPrice: 4600,
      priceTrend: 'STABLE',
      arrivalTonnes: 2100,
      bestSellingVerdict: 'Stable crush margins. Sell in batches to capture weekly peaks.'
    },
    {
      crop: 'Cotton (Kapas)',
      emoji: '🌱',
      mandiName: 'Rajkot Mandi',
      state: 'Gujarat',
      currentPrice: 7250,
      mspPrice: 7120,
      priceTrend: 'RISING',
      arrivalTonnes: 620,
      bestSellingVerdict: 'Ginning mills actively procuring medium staple cotton.'
    },
    {
      crop: 'Tomato',
      emoji: '🍅',
      mandiName: 'Nashik Mandi',
      state: 'Maharashtra',
      currentPrice: 1650,
      mspPrice: 1200,
      priceTrend: 'RISING',
      arrivalTonnes: 450,
      bestSellingVerdict: 'Strong retail pull from urban markets. Harvest and dispatch immediately.'
    },
    {
      crop: 'Maize (Makka)',
      emoji: '🌽',
      mandiName: 'Chhindwara Mandi',
      state: 'Madhya Pradesh',
      currentPrice: 2180,
      mspPrice: 2090,
      priceTrend: 'STABLE',
      arrivalTonnes: 1400,
      bestSellingVerdict: 'Poultry feed manufacturers maintaining steady baseline purchasing.'
    },
    {
      crop: 'Potato',
      emoji: '🥔',
      mandiName: 'Agra Mandi',
      state: 'Uttar Pradesh',
      currentPrice: 1420,
      mspPrice: 1100,
      priceTrend: 'FALLING',
      arrivalTonnes: 3200,
      bestSellingVerdict: 'Heavy cold-storage arrivals. Move to processed chip-grade buyers.'
    },
    {
      crop: 'Mustard (Sarson)',
      emoji: '🌼',
      mandiName: 'Bharatpur Mandi',
      state: 'Rajasthan',
      currentPrice: 5850,
      mspPrice: 5650,
      priceTrend: 'RISING',
      arrivalTonnes: 780,
      bestSellingVerdict: 'Oil mills competing for high-oil-content lots (40%+ oil).'
    }
  ];

  get activeRecord(): MandiPriceRecord | undefined {
    return this.mandiData.find(m => m.crop.toLowerCase().includes(this.selectedCrop.toLowerCase()));
  }

  ngOnInit(): void {
    this.recalcPayout();
  }

  recalcPayout(): void {
    const rec = this.activeRecord || this.mandiData[0];
    const quintals = this.tonnage * 10;
    this.totalPayout = quintals * rec.currentPrice;
  }
}

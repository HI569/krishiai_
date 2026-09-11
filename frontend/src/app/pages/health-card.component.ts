import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-health-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="health-card-page">
      <!-- AMBIENT GLOWS -->
      <div class="glow-orb orb-1 no-print"></div>
      <div class="glow-orb orb-2 no-print"></div>

      <div class="health-card-container">
        <!-- CONTROLS & PRINT BUTTON (Hidden in Print View) -->
        <div class="no-print header-actions">
          <div class="header-text">
            <div class="eyebrow">OFFICIAL AGRONOMIC CERTIFICATE • DIGITAL KVK ARCHIVE</div>
            <h2>Soil Health & Crop Prescription Card</h2>
            <p>Generate, customize, and print an official farm advisory certificate for farmers or KVK records.</p>
          </div>

          <div class="actions-buttons">
            <button type="button" class="btn-print" (click)="printCard()">
              🖨️ Print / Save as PDF
            </button>
          </div>
        </div>

        <!-- EDITABLE FARMER METADATA IN SCREEN VIEW (Hidden in Print View) -->
        <div class="no-print edit-bar">
          <div class="edit-field">
            <label>Farmer Name:</label>
            <input type="text" [(ngModel)]="farmerName" />
          </div>
          <div class="edit-field">
            <label>Village / District:</label>
            <input type="text" [(ngModel)]="village" />
          </div>
          <div class="edit-field">
            <label>Target Crop:</label>
            <input type="text" [(ngModel)]="targetCrop" />
          </div>
          <div class="edit-field">
            <label>Farm Size (Acres):</label>
            <input type="number" step="0.5" [(ngModel)]="acres" />
          </div>
        </div>

        <!-- THE PRINTABLE OFFICIAL HEALTH CARD DOCUMENT -->
        <div class="card-document" id="printableCard">
          
          <!-- OFFICIAL TOP HEADER -->
          <div class="doc-header">
            <div class="doc-brand">
              <span class="doc-logo">🌾</span>
              <div>
                <h1 class="doc-title">KRISHI SOIL HEALTH & CROP PRESCRIPTION CARD</h1>
                <p class="doc-subtitle">Integrated Agronomic & Nutrient Management Advisory • KrishiAI Platform</p>
              </div>
            </div>
            <div class="doc-meta">
              <span class="doc-id">CARD ID: <strong>KAI-{{ cardYear }}-{{ cardId }}</strong></span>
              <span class="doc-date">Issued: {{ currentDate }}</span>
            </div>
          </div>

          <!-- FARMER & SOIL PROFILE SUMMARY -->
          <div class="section-grid profile-grid">
            <div class="grid-box">
              <h4>Farmer & Plot Information</h4>
              <div class="info-row"><span>Farmer Name:</span> <strong>{{ farmerName }}</strong></div>
              <div class="info-row"><span>Location / District:</span> <strong>{{ village }}</strong></div>
              <div class="info-row"><span>Target Crop:</span> <strong>{{ targetCrop }} (Rabi/Kharif)</strong></div>
              <div class="info-row"><span>Total Farm Area:</span> <strong>{{ acres }} Acres ({{ (acres * 0.4047) | number:'1.1-2' }} Ha)</strong></div>
            </div>

            <div class="grid-box">
              <h4>Soil Health Test Indicators</h4>
              <div class="info-row"><span>Nitrogen (N):</span> <strong class="text-rose">65 kg/ha (LOW)</strong></div>
              <div class="info-row"><span>Phosphorus (P):</span> <strong class="text-amber">42 kg/ha (MEDIUM)</strong></div>
              <div class="info-row"><span>Potassium (K):</span> <strong class="text-emerald">120 kg/ha (GOOD)</strong></div>
              <div class="info-row"><span>Soil pH & Organic Carbon:</span> <strong class="text-emerald">6.7 pH (Optimal) • 0.68% OC</strong></div>
            </div>
          </div>

          <!-- FERTILIZER PRESCRIPTION SCHEDULE -->
          <div class="doc-section">
            <h3 class="section-heading">🌱 Prescribed Fertilizer & Dosage Plan (For {{ acres }} Acres of {{ targetCrop }})</h3>
            
            <table class="doc-table">
              <thead>
                <tr>
                  <th>Fertilizer Name</th>
                  <th>Prescribed Quantity</th>
                  <th>Application Stage</th>
                  <th>Recommended Method</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>DAP (18:46:0)</strong></td>
                  <td>{{ 50 * acres }} kg ({{ (50 * acres) / 50 | number:'1.0-0' }} Bag{{ acres > 1 ? 's' : '' }})</td>
                  <td>Basal (At Sowing)</td>
                  <td>Band placement below seed line</td>
                </tr>
                <tr>
                  <td><strong>Urea (46% N) - Split 1</strong></td>
                  <td>{{ 35 * acres }} kg ({{ (35 * acres) / 50 | number:'1.1-1' }} Bags)</td>
                  <td>1st Top-dressing (21 days / 1st Irrigation)</td>
                  <td>Broadcasting in moist soil</td>
                </tr>
                <tr>
                  <td><strong>Urea (46% N) - Split 2</strong></td>
                  <td>{{ 35 * acres }} kg ({{ (35 * acres) / 50 | number:'1.1-1' }} Bags)</td>
                  <td>2nd Top-dressing (40 - 45 days)</td>
                  <td>Broadcasting before irrigation</td>
                </tr>
                <tr>
                  <td><strong>Muriate of Potash (MOP)</strong></td>
                  <td>{{ 20 * acres }} kg</td>
                  <td>Basal (Land preparation)</td>
                  <td>Soil incorporation</td>
                </tr>
                <tr>
                  <td><strong>Bio-NPK Consortium / Compost</strong></td>
                  <td>{{ 200 * acres }} kg</td>
                  <td>Pre-sowing (Last ploughing)</td>
                  <td>Broadcast & mix with topsoil</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- HARVEST YIELD PROJECTION & WEATHER WINDOW -->
          <div class="section-grid bottom-grid">
            <div class="grid-box">
              <h4>🌾 Harvest Yield Projection</h4>
              <div class="yield-callout">
                <span class="y-val">≈ {{ (1.64 * acres) | number:'1.1-1' }} Tonnes</span>
                <span class="y-sub">({{ (1.64 * acres * 10) | number:'1.0-0' }} Quintals • Confidence: Moderate)</span>
              </div>
              <p class="y-note">
                *Estimate based on ICAR growth models and recommended fertilizer compliance.
              </p>
            </div>

            <div class="grid-box">
              <h4>🛡️ Spraying & Crop Protection Protocol</h4>
              <ul class="protection-list">
                <li><strong>Spray Window:</strong> Morning (7:00 AM - 10:30 AM) when wind &lt; 10 km/h.</li>
                <li><strong>Disease Scouting:</strong> Weekly inspection for early leaf spots. Apply Neem oil (5ml/L) preventatively.</li>
                <li><strong>Safety:</strong> Maintain 14-day pre-harvest interval for any chemical sprays.</li>
              </ul>
            </div>
          </div>

          <!-- FOOTER & SIGNATURE STAMP -->
          <div class="doc-footer">
            <div class="footer-left">
              <span class="qr-mock">📱 [QR Code Verified]</span>
              <small>Scan QR code on field to verify recommendation integrity.</small>
            </div>
            <div class="footer-sign">
              <div class="sign-line"></div>
              <strong>KrishiAI Agronomic Advisory Council</strong>
              <small>Certified Digital Agronomy Engine</small>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    * { box-sizing: border-box; }
    
    .health-card-page {
      min-height: calc(100vh - 70px);
      background: #08120f;
      color: #f3f9f4;
      padding: 40px 20px 80px;
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
      top: -120px;
      right: -80px;
      background: radial-gradient(circle, rgba(0, 255, 148, 0.12), transparent 70%);
    }
    .orb-2 {
      width: 360px;
      height: 360px;
      bottom: 60px;
      left: -100px;
      background: radial-gradient(circle, rgba(125, 255, 111, 0.08), transparent 70%);
    }

    .health-card-container {
      max-width: 960px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .eyebrow {
      color: #8cff78;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      margin-bottom: 6px;
    }

    .header-text h2 {
      margin: 0 0 6px;
      font-size: 1.8rem;
      font-weight: 850;
      color: #ffffff;
    }
    .header-text p {
      margin: 0;
      font-size: 0.95rem;
      color: #b7c8bc;
    }

    .btn-print {
      background: #7dff6f;
      color: #07120a;
      border: none;
      padding: 13px 24px;
      border-radius: 14px;
      font-size: 0.95rem;
      font-weight: 850;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(125, 255, 111, 0.28);
      transition: all 0.2s;
    }
    .btn-print:hover {
      background: #8eff80;
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(125, 255, 111, 0.4);
    }

    .edit-bar {
      background: #121815;
      border: 1px solid #253129;
      border-radius: 18px;
      padding: 18px 22px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 28px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
    }

    .edit-field { display: flex; flex-direction: column; gap: 6px; }
    .edit-field label { font-size: 0.75rem; font-weight: 800; color: #8cff78; letter-spacing: 0.05em; }
    .edit-field input {
      padding: 10px 12px;
      background: #0c110e;
      border: 1px solid #303d34;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: #f1f7f2;
      outline: none;
      transition: border-color 0.2s;
    }
    .edit-field input:focus {
      border-color: #7dff6f;
      box-shadow: 0 0 0 3px rgba(125, 255, 111, 0.15);
    }

    /* PRINTABLE DOCUMENT STYLING (Screen & Print) */
    .card-document {
      background: white;
      border: 2px solid rgba(125, 255, 111, 0.4);
      border-radius: 20px;
      padding: 36px 42px;
      color: #172b1f;
      box-shadow: 0 16px 50px rgba(0, 0, 0, 0.6);
    }

    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #087443;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }

    .doc-brand { display: flex; align-items: center; gap: 14px; }
    .doc-logo { font-size: 40px; }
    .doc-title { margin: 0; font-size: 19px; font-weight: 900; color: #087443; letter-spacing: 0.5px; }
    .doc-subtitle { margin: 3px 0 0; font-size: 11px; color: #476251; font-weight: 600; }

    .doc-meta { text-align: right; font-size: 11px; color: #334155; }
    .doc-id strong { color: #087443; }
    .doc-date { display: block; margin-top: 2px; }

    .section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-bottom: 20px;
    }

    .grid-box {
      background: #f8faf8;
      border: 1px solid #e1ece4;
      border-radius: 14px;
      padding: 16px 18px;
    }

    .grid-box h4 {
      margin: 0 0 12px;
      font-size: 13px;
      font-weight: 850;
      color: #113623;
      border-bottom: 1px solid #e1ece4;
      padding-bottom: 6px;
      letter-spacing: 0.03em;
    }
    .info-row { display: flex; justify-content: space-between; font-size: 12px; padding: 4px 0; }
    .info-row span { color: #526b5c; }
    .info-row strong { color: #133321; }

    .text-rose { color: #dc2626; }
    .text-amber { color: #d97706; }
    .text-emerald { color: #059669; }

    .doc-section { margin-bottom: 20px; }
    .section-heading { font-size: 14px; font-weight: 850; color: #087443; margin: 0 0 10px; }

    .doc-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .doc-table th, .doc-table td {
      border: 1px solid #d1dfd6;
      padding: 9px 12px;
      text-align: left;
    }

    .doc-table th {
      background: #eef7f2;
      color: #0c4a2c;
      font-weight: 850;
    }

    .doc-table tr:nth-child(even) { background: #fbfdfc; }

    .yield-callout {
      background: #e1f5eb;
      border: 1px solid #a7f3d0;
      border-radius: 10px;
      padding: 12px;
      text-align: center;
      margin-bottom: 8px;
    }

    .y-val { font-size: 22px; font-weight: 900; color: #087443; display: block; }
    .y-sub { font-size: 11px; color: #15803d; font-weight: 600; }
    .y-note { font-size: 10px; color: #64748b; margin: 0; }

    .protection-list { margin: 0; padding-left: 18px; font-size: 11px; color: #334155; line-height: 1.6; }

    .doc-footer {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-top: 1.5px dashed #cbdad0;
      padding-top: 16px;
      margin-top: 20px;
    }

    .footer-left { display: flex; flex-direction: column; gap: 4px; }
    .qr-mock { font-size: 11px; font-weight: 750; color: #087443; background: #e8f5ed; padding: 4px 10px; border-radius: 6px; display: inline-block; width: fit-content; }
    .footer-left small { font-size: 10px; color: #64748b; }

    .footer-sign { text-align: center; }
    .sign-line { width: 170px; height: 1px; background: #94a3b8; margin-bottom: 6px; }
    .footer-sign strong { font-size: 11px; color: #133321; display: block; }
    .footer-sign small { font-size: 9px; color: #64748b; }

    /* PRINT SPECIFIC CSS */
    @media print {
      body { background: white !important; }
      .no-print, header, nav, footer, .bottom-nav, .topbar { display: none !important; }
      .health-card-page { padding: 0 !important; margin: 0 !important; max-width: 100% !important; background: white !important; }
      .card-document { border: 1.5px solid #000 !important; box-shadow: none !important; padding: 15px !important; }
    }

    @media (max-width: 750px) {
      .edit-bar { grid-template-columns: 1fr 1fr; }
      .section-grid { grid-template-columns: 1fr; }
      .card-document { padding: 20px; }
    }
  `]
})
export class HealthCardComponent implements OnInit {
  farmerName = 'Rajendra Patel';
  village = 'Indore, Madhya Pradesh';
  targetCrop = 'Wheat';
  acres = 2.5;

  cardYear = new Date().getFullYear();
  cardId = Math.floor(100000 + Math.random() * 900000);
  currentDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  ngOnInit(): void {}

  printCard(): void {
    window.print();
  }
}

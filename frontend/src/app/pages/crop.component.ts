import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-crop',
  standalone: true,
  imports: [CommonModule, FormsModule],

  template: `
    <div class="crop-page">

      <!-- BACKGROUND DECORATION -->
      <div class="bg-circle circle-one"></div>
      <div class="bg-circle circle-two"></div>

      <div class="crop-container">

        <!-- HERO -->
        <section class="hero">

          <div class="hero-badge">
            🌱 KrishiAI • AI Crop Advisor
          </div>

          <h1>
            Find the Best Crop<br>
            <span>for Your Farm</span>
          </h1>

          <p>
            Enter your soil and climate conditions and let our
            machine-learning model recommend the most suitable crop.
          </p>

        </section>


        <!-- INPUT CARD -->
        <section class="input-card">

          <div class="card-heading">

            <div class="heading-icon">
              🌾
            </div>

            <div>
              <h2>Farm Conditions</h2>
              <p>
                Provide the current soil and environmental conditions
              </p>
            </div>

          </div>


          <!-- SOIL SECTION -->
          <div class="section-label">
            <span>01</span>
            Soil Nutrients
          </div>

          <div class="input-grid">

            <!-- N -->
            <div class="input-box">
              <label>
                Nitrogen
                <span>N</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="n"
                  min="0"
                  placeholder="90"
                />
                <span>mg/kg</span>
              </div>

              <small>
                Soil nitrogen level
              </small>
            </div>


            <!-- P -->
            <div class="input-box">
              <label>
                Phosphorus
                <span>P</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="p"
                  min="0"
                  placeholder="42"
                />
                <span>mg/kg</span>
              </div>

              <small>
                Soil phosphorus level
              </small>
            </div>


            <!-- K -->
            <div class="input-box">
              <label>
                Potassium
                <span>K</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="k"
                  min="0"
                  placeholder="43"
                />
                <span>mg/kg</span>
              </div>

              <small>
                Soil potassium level
              </small>
            </div>


            <!-- PH -->
            <div class="input-box">
              <label>
                Soil pH
                <span>pH</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="ph"
                  min="0"
                  max="14"
                  step="0.1"
                  placeholder="6.5"
                />
              </div>

              <small>
                Soil acidity / alkalinity
              </small>
            </div>

          </div>


          <!-- CLIMATE SECTION -->
          <div class="section-label climate-label">
            <span>02</span>
            Climate Conditions
          </div>


          <div class="input-grid">

            <!-- TEMPERATURE -->
            <div class="input-box">
              <label>
                Temperature
                <span>°C</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="temperature"
                  step="0.1"
                  placeholder="25"
                />
                <span>°C</span>
              </div>

              <small>
                Average temperature
              </small>
            </div>


            <!-- HUMIDITY -->
            <div class="input-box">
              <label>
                Humidity
                <span>RH</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="humidity"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="80"
                />
                <span>%</span>
              </div>

              <small>
                Relative humidity
              </small>
            </div>


            <!-- RAINFALL -->
            <div class="input-box">
              <label>
                Rainfall
                <span>Rain</span>
              </label>

              <div class="input-wrapper">
                <input
                  type="number"
                  [(ngModel)]="rainfall"
                  min="0"
                  step="1"
                  placeholder="200"
                />
                <span>mm</span>
              </div>

              <small>
                Expected rainfall
              </small>
            </div>


            <!-- SEASON -->
            <div class="input-box">
              <label>
                Season
                <span>🌤</span>
              </label>

              <select [(ngModel)]="season">

                <option value="Kharif">
                  Kharif
                </option>

                <option value="Rabi">
                  Rabi
                </option>

                <option value="Zaid">
                  Zaid
                </option>

              </select>

              <small>
                Current growing season
              </small>
            </div>

          </div>


          <!-- LOCATION -->
          <div class="location-row">

            <div class="location-icon">
              📍
            </div>

            <div class="location-content">

              <label>Farm Location</label>

              <input
                type="text"
                [(ngModel)]="location"
                placeholder="Example: Andhra Pradesh, India"
              />

            </div>

          </div>


          <!-- BUTTON -->
          <button
            class="predict-button"
            type="button"
            (click)="recommend()"
            [disabled]="loading"
          >

            <span class="button-icon">
              {{ loading ? '⏳' : '✨' }}
            </span>

            <span>
              {{
                loading
                  ? 'Analyzing Farm...'
                  : 'Find My Best Crop'
              }}
            </span>

            <span class="arrow">
              →
            </span>

          </button>


          <!-- ERROR -->
          <div
            class="error-box"
            *ngIf="error"
          >

            <div class="error-icon">
              ⚠️
            </div>

            <div>
              <strong>
                Unable to get recommendation
              </strong>

              <p>
                {{ error }}
              </p>
            </div>

          </div>

        </section>


        <!-- LOADING -->
        <div
          class="loading-card"
          *ngIf="loading"
        >

          <div class="loader"></div>

          <h3>
            AI is analyzing your farm...
          </h3>

          <p>
            Comparing soil nutrients, pH and climate conditions
            with the trained crop model.
          </p>

        </div>


        <!-- RESULTS -->
        <section
          class="results-section"
          *ngIf="result"
        >

          <div class="results-header">

            <div>
              <div class="result-badge">
                ✨ AI ANALYSIS COMPLETE
              </div>

              <h2>
                Recommended Crops
              </h2>

              <p>
                Based on the conditions you provided
              </p>
            </div>

            <div class="model-badge">
              <span>🤖</span>
              Random Forest ML
            </div>

          </div>


          <!-- TOP CROP -->
          <div
            class="top-result"
            *ngIf="getTopCrop() as top"
          >

            <div class="top-left">

              <div class="crop-emoji">
                {{ top.icon || '🌱' }}
              </div>

              <div>

                <span class="best-label">
                  🏆 BEST MATCH
                </span>

                <h3>
                  {{ formatCropName(top.crop) }}
                </h3>

                <p>
                  {{ top.info }}
                </p>

              </div>

            </div>


            <div class="score">

              <div class="score-number">
                {{ getScore(top) }}%
              </div>

              <div class="score-label">
                Suitability
              </div>

            </div>

          </div>


          <!-- RESULT GRID -->
          <div class="result-grid">

            <div
              class="result-item"
              *ngFor="let crop of getRecommendations()"
              [class.best]="crop === getTopCrop()"
            >

              <div class="crop-card-top">

                <div class="crop-icon">
                  {{ crop.icon || '🌱' }}
                </div>

                <div>

                  <h3>
                    {{ formatCropName(crop.crop) }}
                  </h3>

                  <span
                    *ngIf="crop === getTopCrop()"
                    class="best-chip"
                  >
                    BEST
                  </span>

                </div>

              </div>


              <div class="progress-area">

                <div class="progress-header">

                  <span>
                    Suitability
                  </span>

                  <strong>
                    {{ getScore(crop) }}%
                  </strong>

                </div>

                <div class="progress-bar">

                  <div
                    class="progress-fill"
                    [style.width.%]="getScore(crop)"
                  ></div>

                </div>

              </div>


              <div class="crop-details">

                <div *ngIf="crop.season">
                  <small>Season</small>
                  <strong>
                    {{ crop.season }}
                  </strong>
                </div>

                <div *ngIf="crop.water">
                  <small>Water</small>
                  <strong>
                    {{ crop.water }}
                  </strong>
                </div>

              </div>

            </div>

          </div>


          <!-- INPUT SUMMARY -->
          <div class="summary-card">

            <div class="summary-title">
              <span>📊</span>

              <div>
                <h3>Your Farm Profile</h3>
                <p>Values used by the ML model</p>
              </div>
            </div>


            <div class="summary-grid">

              <div>
                <span>N</span>
                <strong>{{ n }}</strong>
              </div>

              <div>
                <span>P</span>
                <strong>{{ p }}</strong>
              </div>

              <div>
                <span>K</span>
                <strong>{{ k }}</strong>
              </div>

              <div>
                <span>pH</span>
                <strong>{{ ph }}</strong>
              </div>

              <div>
                <span>Temp.</span>
                <strong>{{ temperature }}°C</strong>
              </div>

              <div>
                <span>Humidity</span>
                <strong>{{ humidity }}%</strong>
              </div>

              <div>
                <span>Rainfall</span>
                <strong>{{ rainfall }} mm</strong>
              </div>

              <div>
                <span>Season</span>
                <strong>{{ season }}</strong>
              </div>

            </div>

          </div>


          <!-- DISCLAIMER -->
          <div class="disclaimer">
            <span>💡</span>
            <p>
              This recommendation is generated by a machine-learning
              model trained on crop-condition data. Use it as a
              decision-support tool and consider local agricultural
              advice before planting.
            </p>
          </div>

        </section>


        <!-- EMPTY STATE -->
        <section
          class="empty-state"
          *ngIf="!result && !loading"
        >

          <div class="empty-illustration">
            🌾
          </div>

          <h2>
            Ready to discover your ideal crop?
          </h2>

          <p>
            Enter your farm conditions above and our AI model
            will analyze them to find the best crop match.
          </p>

          <div class="feature-row">

            <div>
              <span>🧪</span>
              <strong>Soil Analysis</strong>
              <small>N • P • K • pH</small>
            </div>

            <div>
              <span>🌤️</span>
              <strong>Climate Analysis</strong>
              <small>Temperature • Humidity</small>
            </div>

            <div>
              <span>🤖</span>
              <strong>ML Prediction</strong>
              <small>Random Forest</small>
            </div>

          </div>

        </section>

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


    /* PAGE */

    .crop-page {
      min-height: calc(100vh - 70px);
      background:
        radial-gradient(
          circle at 10% 10%,
          rgba(28, 140, 87, 0.08),
          transparent 30%
        ),
        radial-gradient(
          circle at 90% 80%,
          rgba(28, 140, 87, 0.06),
          transparent 30%
        ),
        #f5f9f6;

      padding: 55px 24px 80px;

      position: relative;
      overflow: hidden;
    }


    .crop-container {
      width: 100%;
      max-width: 1120px;
      margin: auto;
      position: relative;
      z-index: 2;
    }


    .bg-circle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      border: 1px solid rgba(8, 127, 78, 0.08);
    }

    .circle-one {
      width: 350px;
      height: 350px;
      top: -180px;
      right: -100px;
    }

    .circle-two {
      width: 280px;
      height: 280px;
      bottom: -120px;
      left: -100px;
    }


    /* HERO */

    .hero {
      text-align: center;
      max-width: 760px;
      margin: 0 auto 38px;
    }


    .hero-badge {
      display: inline-flex;
      align-items: center;
      padding: 8px 15px;
      border-radius: 30px;
      background: #e8f6ee;
      border: 1px solid #cce8d8;
      color: #087f4e;
      font-size: 13px;
      font-weight: 750;
      letter-spacing: 0.2px;
      margin-bottom: 17px;
    }


    .hero h1 {
      margin: 0;
      color: #073d2d;
      font-size: clamp(36px, 5vw, 55px);
      line-height: 1.08;
      font-weight: 850;
      letter-spacing: -1.5px;
    }


    .hero h1 span {
      color: #087f4e;
    }


    .hero p {
      max-width: 650px;
      margin: 17px auto 0;
      color: #667a71;
      font-size: 17px;
      line-height: 1.65;
    }


    /* INPUT CARD */

    .input-card {
      background: rgba(255,255,255,0.97);
      border: 1px solid #dce9e2;
      border-radius: 24px;
      padding: 35px;
      box-shadow: 0 18px 60px rgba(22, 70, 48, 0.09);
    }


    .card-heading {
      display: flex;
      align-items: center;
      gap: 15px;
      padding-bottom: 26px;
      border-bottom: 1px solid #edf2ef;
      margin-bottom: 27px;
    }


    .heading-icon {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 15px;
      background: #eaf7ef;
      font-size: 26px;
    }


    .card-heading h2 {
      margin: 0;
      color: #123f31;
      font-size: 23px;
    }


    .card-heading p {
      margin: 5px 0 0;
      color: #7a8b84;
      font-size: 14px;
    }


    /* SECTION */

    .section-label {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #21483b;
      font-size: 14px;
      font-weight: 800;
      margin-bottom: 15px;
    }


    .section-label span {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #087f4e;
      color: white;
      font-size: 11px;
    }


    .climate-label {
      margin-top: 30px;
    }


    /* FORM GRID */

    .input-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
    }


    .input-box {
      padding: 17px;
      border: 1px solid #e0eae5;
      border-radius: 15px;
      background: #fbfdfc;
      transition: 0.2s ease;
    }


    .input-box:hover {
      border-color: #bdd7ca;
      transform: translateY(-1px);
    }


    .input-box label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #21483b;
      font-size: 13px;
      font-weight: 750;
      margin-bottom: 10px;
    }


    .input-box label span {
      color: #84958e;
      font-size: 11px;
      font-weight: 600;
    }


    .input-wrapper {
      position: relative;
    }


    .input-wrapper input {
      width: 100%;
      height: 47px;
      border: 1px solid #d5e1db;
      border-radius: 10px;
      background: white;
      padding: 0 60px 0 13px;
      color: #163d30;
      font-size: 16px;
      font-weight: 650;
      outline: none;
    }


    .input-wrapper input:focus {
      border-color: #087f4e;
      box-shadow: 0 0 0 3px rgba(8,127,78,0.08);
    }


    .input-wrapper > span {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #87968f;
      font-size: 11px;
      pointer-events: none;
    }


    .input-box select {
      width: 100%;
      height: 47px;
      border: 1px solid #d5e1db;
      border-radius: 10px;
      background: white;
      padding: 0 12px;
      color: #163d30;
      font-size: 15px;
      font-weight: 650;
      outline: none;
    }


    .input-box small {
      display: block;
      margin-top: 8px;
      color: #8a9993;
      font-size: 10px;
    }


    /* LOCATION */

    .location-row {
      margin-top: 25px;
      display: flex;
      gap: 13px;
      align-items: center;
      padding: 15px;
      border: 1px solid #e0eae5;
      border-radius: 14px;
      background: #f8fbf9;
    }


    .location-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 11px;
      background: #e8f6ee;
      font-size: 19px;
    }


    .location-content {
      flex: 1;
    }


    .location-content label {
      display: block;
      color: #21483b;
      font-size: 12px;
      font-weight: 750;
      margin-bottom: 4px;
    }


    .location-content input {
      width: 100%;
      border: none;
      background: transparent;
      outline: none;
      color: #21483b;
      font-size: 14px;
    }


    /* BUTTON */

    .predict-button {
      width: 100%;
      height: 60px;
      margin-top: 25px;
      border: none;
      border-radius: 14px;
      background: linear-gradient(
        135deg,
        #087f4e,
        #0b9b61
      );
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 11px;
      font-size: 16px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(8,127,78,0.20);
      transition: 0.2s ease;
    }


    .predict-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 14px 30px rgba(8,127,78,0.25);
    }


    .predict-button:disabled {
      opacity: 0.65;
      cursor: not-allowed;
      transform: none;
    }


    .button-icon {
      font-size: 19px;
    }


    .arrow {
      font-size: 21px;
      margin-left: 5px;
    }


    /* ERROR */

    .error-box {
      margin-top: 20px;
      display: flex;
      gap: 12px;
      padding: 15px;
      border-radius: 12px;
      background: #fff4f2;
      border: 1px solid #ffd5d0;
      color: #a32c24;
    }


    .error-icon {
      font-size: 20px;
    }


    .error-box strong {
      font-size: 13px;
    }


    .error-box p {
      margin: 4px 0 0;
      font-size: 12px;
    }


    /* LOADING */

    .loading-card {
      margin-top: 25px;
      padding: 35px;
      text-align: center;
      background: white;
      border: 1px solid #dce9e2;
      border-radius: 20px;
      box-shadow: 0 12px 35px rgba(22,70,48,0.07);
    }


    .loader {
      width: 38px;
      height: 38px;
      margin: auto;
      border: 4px solid #dceee4;
      border-top-color: #087f4e;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }


    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }


    .loading-card h3 {
      margin: 15px 0 5px;
      color: #123f31;
    }


    .loading-card p {
      margin: 0;
      color: #75877f;
      font-size: 13px;
    }


    /* RESULTS */

    .results-section {
      margin-top: 40px;
    }


    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 18px;
    }


    .result-badge {
      color: #087f4e;
      font-size: 11px;
      font-weight: 850;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }


    .results-header h2 {
      margin: 0;
      color: #123f31;
      font-size: 30px;
    }


    .results-header p {
      margin: 5px 0 0;
      color: #7a8b84;
      font-size: 14px;
    }


    .model-badge {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 9px 13px;
      border-radius: 10px;
      background: white;
      border: 1px solid #dce9e2;
      color: #466158;
      font-size: 12px;
      font-weight: 700;
    }


    /* TOP RESULT */

    .top-result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 28px;
      border-radius: 20px;
      background: linear-gradient(
        135deg,
        #e9f8ef,
        #f7fcf9
      );
      border: 1px solid #cce6d7;
      margin-bottom: 17px;
    }


    .top-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }


    .crop-emoji {
      width: 78px;
      height: 78px;
      display: grid;
      place-items: center;
      border-radius: 20px;
      background: white;
      font-size: 40px;
      box-shadow: 0 5px 18px rgba(20,70,45,0.08);
    }


    .best-label {
      color: #087f4e;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1px;
    }


    .top-result h3 {
      margin: 4px 0 4px;
      color: #073d2d;
      font-size: 29px;
    }


    .top-result p {
      max-width: 600px;
      margin: 0;
      color: #667b71;
      font-size: 13px;
      line-height: 1.5;
    }


    .score {
      text-align: center;
      min-width: 110px;
    }


    .score-number {
      color: #087f4e;
      font-size: 34px;
      font-weight: 900;
    }


    .score-label {
      color: #71847b;
      font-size: 11px;
      font-weight: 700;
    }


    /* RESULT GRID */

    .result-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }


    .result-item {
      padding: 20px;
      background: white;
      border: 1px solid #dfeae4;
      border-radius: 17px;
      box-shadow: 0 7px 25px rgba(20,70,45,0.05);
    }


    .result-item.best {
      border-color: #a9d7bd;
    }


    .crop-card-top {
      display: flex;
      align-items: center;
      gap: 11px;
    }


    .crop-icon {
      width: 46px;
      height: 46px;
      display: grid;
      place-items: center;
      border-radius: 12px;
      background: #edf8f1;
      font-size: 24px;
    }


    .crop-card-top h3 {
      display: inline-block;
      margin: 0;
      color: #21483b;
      font-size: 17px;
      text-transform: capitalize;
    }


    .best-chip {
      margin-left: 6px;
      padding: 3px 6px;
      border-radius: 5px;
      background: #e5f6ec;
      color: #087f4e;
      font-size: 8px;
      font-weight: 900;
    }


    .progress-area {
      margin-top: 18px;
    }


    .progress-header {
      display: flex;
      justify-content: space-between;
      color: #7c8c85;
      font-size: 11px;
    }


    .progress-header strong {
      color: #087f4e;
      font-size: 13px;
    }


    .progress-bar {
      height: 7px;
      margin-top: 7px;
      border-radius: 10px;
      background: #eaf1ed;
      overflow: hidden;
    }


    .progress-fill {
      height: 100%;
      border-radius: 10px;
      background: #087f4e;
      transition: width 0.7s ease;
    }


    .crop-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 17px;
      padding-top: 13px;
      border-top: 1px solid #edf2ef;
    }


    .crop-details small {
      display: block;
      color: #909e98;
      font-size: 9px;
    }


    .crop-details strong {
      color: #466158;
      font-size: 12px;
    }


    /* SUMMARY */

    .summary-card {
      margin-top: 17px;
      padding: 22px;
      background: white;
      border: 1px solid #dfeae4;
      border-radius: 17px;
    }


    .summary-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }


    .summary-title > span {
      font-size: 23px;
    }


    .summary-title h3 {
      margin: 0;
      color: #21483b;
      font-size: 16px;
    }


    .summary-title p {
      margin: 3px 0 0;
      color: #8a9993;
      font-size: 11px;
    }


    .summary-grid {
      display: grid;
      grid-template-columns: repeat(8, 1fr);
      gap: 8px;
      margin-top: 17px;
    }


    .summary-grid > div {
      padding: 11px 8px;
      text-align: center;
      background: #f7faf8;
      border-radius: 9px;
    }


    .summary-grid span {
      display: block;
      color: #8a9993;
      font-size: 9px;
    }


    .summary-grid strong {
      display: block;
      margin-top: 3px;
      color: #21483b;
      font-size: 12px;
    }


    /* DISCLAIMER */

    .disclaimer {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      padding: 13px 15px;
      background: #f4f8f6;
      border-radius: 11px;
      color: #72827b;
    }


    .disclaimer span {
      font-size: 17px;
    }


    .disclaimer p {
      margin: 0;
      font-size: 10px;
      line-height: 1.5;
    }


    /* EMPTY */

    .empty-state {
      margin-top: 25px;
      padding: 40px 25px;
      text-align: center;
      border: 1px dashed #cbdcd3;
      border-radius: 20px;
      background: rgba(255,255,255,0.65);
    }


    .empty-illustration {
      font-size: 52px;
      margin-bottom: 10px;
    }


    .empty-state h2 {
      margin: 0;
      color: #174b39;
      font-size: 22px;
    }


    .empty-state > p {
      max-width: 570px;
      margin: 8px auto 25px;
      color: #788982;
      font-size: 13px;
      line-height: 1.6;
    }


    .feature-row {
      display: flex;
      justify-content: center;
      gap: 12px;
    }


    .feature-row > div {
      min-width: 170px;
      padding: 14px;
      border-radius: 12px;
      background: white;
      border: 1px solid #dfeae4;
    }


    .feature-row span {
      display: block;
      font-size: 22px;
      margin-bottom: 5px;
    }


    .feature-row strong {
      display: block;
      color: #21483b;
      font-size: 12px;
    }


    .feature-row small {
      display: block;
      color: #8b9994;
      font-size: 9px;
      margin-top: 3px;
    }


    /* RESPONSIVE */

    @media (max-width: 950px) {

      .input-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .result-grid {
        grid-template-columns: 1fr;
      }

      .summary-grid {
        grid-template-columns: repeat(4, 1fr);
      }

    }


    @media (max-width: 650px) {

      .crop-page {
        padding: 30px 14px 60px;
      }

      .input-card {
        padding: 20px;
        border-radius: 18px;
      }

      .hero h1 {
        font-size: 36px;
      }

      .hero p {
        font-size: 14px;
      }

      .input-grid {
        grid-template-columns: 1fr;
      }

      .top-result {
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      }

      .top-left {
        align-items: flex-start;
      }

      .score {
        text-align: left;
      }

      .results-header {
        display: block;
      }

      .model-badge {
        display: inline-flex;
        margin-top: 12px;
      }

      .summary-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .feature-row {
        flex-direction: column;
      }

      .feature-row > div {
        width: 100%;
      }

    }

  `]
})
export class CropComponent {

  private farmService = inject(FarmService);


  /* MODEL INPUTS */

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


  /* --------------------------------------------------
     RECOMMEND CROP
  -------------------------------------------------- */

  recommend(): void {

    this.error = '';

    this.result = null;


    /* VALIDATION */

    if (
      this.n === null ||
      this.p === null ||
      this.k === null ||
      this.ph === null ||
      this.temperature === null ||
      this.humidity === null ||
      this.rainfall === null
    ) {

      this.error =
        'Please enter all soil and climate conditions.';

      return;
    }


    if (
      this.ph < 0 ||
      this.ph > 14
    ) {

      this.error =
        'Soil pH must be between 0 and 14.';

      return;
    }


    if (
      this.humidity < 0 ||
      this.humidity > 100
    ) {

      this.error =
        'Humidity must be between 0% and 100%.';

      return;
    }


    this.loading = true;


    /* EXACT FEATURES USED BY TRAINED MODEL */

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


    console.log(
      'Sending crop recommendation:',
      input
    );


    this.farmService.recommend(input).subscribe({

      next: (response: any) => {

        console.log(
          'Crop API response:',
          response
        );


        this.loading = false;


        if (!response) {

          this.error =
            'No response received from the backend.';

          return;
        }


        if (response.detail) {

          this.error =
            typeof response.detail === 'string'
              ? response.detail
              : 'The crop API returned an error.';

          return;
        }


        /*
         * API RETURNS:
         *
         * {
         *   recommendations: [...]
         * }
         *
         */

        if (
          !response.recommendations ||
          !Array.isArray(response.recommendations) ||
          response.recommendations.length === 0
        ) {

          this.error =
            'The model did not return any crop recommendation.';

          return;
        }


        this.result = response;

      },


      error: (err: any) => {

        console.error(
          'Crop API error:',
          err
        );


        this.loading = false;


        if (err.status === 404) {

          this.error =
            'Crop API route was not found. Check that the frontend is using /api/crop/recommend.';

        } else if (err.status === 0) {

          this.error =
            'Could not connect to the KrishiAI backend. Make sure FastAPI is running on port 8000.';

        } else {

          this.error =
            'The crop recommendation service returned an error.';

        }

      }

    });

  }


  /* --------------------------------------------------
     GET RECOMMENDATIONS
  -------------------------------------------------- */

  getRecommendations(): any[] {

    if (!this.result) {

      return [];

    }


    if (
      Array.isArray(this.result.recommendations)
    ) {

      return this.result.recommendations;

    }


    if (this.result.crop) {

      return [this.result];

    }


    return [];

  }


  /* --------------------------------------------------
     TOP CROP
  -------------------------------------------------- */

  getTopCrop(): any {

    const crops =
      this.getRecommendations();


    if (!crops.length) {

      return null;

    }


    return crops[0];

  }


  /* --------------------------------------------------
     SCORE
  -------------------------------------------------- */

  getScore(crop: any): number {

    if (!crop) {

      return 0;

    }


    const value =
      crop.suitability ??
      crop.confidence ??
      crop.score ??
      0;


    return Math.round(
      Number(value)
    );

  }


  /* --------------------------------------------------
     CROP NAME
  -------------------------------------------------- */

  formatCropName(name: any): string {

    if (!name) {

      return 'Unknown Crop';

    }


    return String(name)
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }

}
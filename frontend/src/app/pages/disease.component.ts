import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmService } from '../services/farm.service';

@Component({
  selector: 'app-disease',
  standalone: true,
  imports: [CommonModule],

  template: `
    <div class="page">

      <!-- =========================
           HERO
      ========================== -->
      <section class="hero">

        <div class="eyebrow">
          AI PLANT HEALTH
        </div>

        <h1>🌿 Check Plant</h1>

        <p>
          Upload a clear photo of a plant leaf and let the trained
          plant disease model analyze it.
        </p>

      </section>


      <!-- =========================
           MAIN CARD
      ========================== -->
      <section class="card">

        <!-- UPLOAD -->
        <div class="upload-area">

          <div class="photo-icon">
            📷
          </div>

          <h2>Upload Plant Photo</h2>

          <p>
            Choose a clear image of the affected plant leaf.
          </p>

          <input
            #fileInput
            type="file"
            accept="image/*"
            (change)="selectFile($event)"
            hidden
          />

          <button
            type="button"
            class="upload-btn"
            (click)="fileInput.click()"
          >
            📷 Choose Photo
          </button>

          <div
            class="filename"
            *ngIf="file"
          >
            Selected: {{ file.name }}
          </div>

        </div>


        <!-- IMAGE PREVIEW -->
        <div
          class="preview"
          *ngIf="preview"
        >

          <img
            [src]="preview"
            alt="Selected plant"
          />

        </div>


        <!-- ANALYZE BUTTON -->
        <button
          type="button"
          class="analyze-btn"
          [disabled]="!file || loading"
          (click)="analyze()"
        >

          {{ loading ? '🔬 Analyzing image...' : '🌿 Analyze Plant' }}

        </button>


        <!-- LOADING -->
        <div
          class="loading"
          *ngIf="loading"
        >

          <div class="spinner"></div>

          <p>
            The AI model is analyzing your plant image.
          </p>

        </div>


        <!-- ERROR -->
        <div
          class="error"
          *ngIf="error"
        >

          ❌ {{ error }}

        </div>


        <!-- =========================
             RESULT
        ========================== -->
        <div
          class="result"
          *ngIf="result && !loading"
        >

          <!-- RESULT HEADER -->
          <div class="result-header">

            <div>

              <div class="result-eyebrow">
                AI PLANT ANALYSIS
              </div>

              <h2>
                🔬 Analysis Result
              </h2>

            </div>

            <div class="status-badge">
              ✓ Analysis Complete
            </div>

          </div>


          <!-- =========================
               DISEASE
          ========================== -->
          <div class="disease-box">

            <div class="result-label">
              POSSIBLE DISEASE
            </div>

            <div class="disease-name">
              {{ getDiseaseName() }}
            </div>


            <!-- CONFIDENCE -->
            <div
              class="confidence"
              *ngIf="getConfidence() !== null"
            >

              <div class="confidence-top">

                <span>
                  Model confidence
                </span>

                <strong>
                  {{ getConfidence() }}%
                </strong>

              </div>

              <div class="confidence-bar">

                <span
                  [style.width.%]="getConfidence()"
                ></span>

              </div>

            </div>

          </div>


          <!-- =========================
               DESCRIPTION
          ========================== -->
          <div
            class="result-card"
            *ngIf="getDescription()"
          >

            <div class="result-card-title">
              🔎 What was detected
            </div>

            <p>
              {{ getDescription() }}
            </p>

          </div>


          <!-- =========================
               SYMPTOMS
          ========================== -->
          <div
            class="result-card"
            *ngIf="getSymptoms()"
          >

            <div class="result-card-title">
              🍃 Symptoms
            </div>

            <div class="list-text">
              {{ getSymptoms() }}
            </div>

          </div>


          <!-- =========================
               SOLUTION / ACTIONS
          ========================== -->
          <div
            class="result-card solution-card"
            *ngIf="getSolution()"
          >

            <div class="result-card-title">
              💊 Recommended Solution
            </div>

            <div class="list-text">
              {{ getSolution() }}
            </div>

          </div>


          <!-- =========================
               PREVENTION
          ========================== -->
          <div
            class="result-card"
            *ngIf="getPrevention()"
          >

            <div class="result-card-title">
              🛡️ Prevention
            </div>

            <div class="list-text">
              {{ getPrevention() }}
            </div>

          </div>


          <!-- =========================
               NO SOLUTION
          ========================== -->
          <div
            class="notice"
            *ngIf="!getSolution()"
          >

            ℹ️ The disease model returned a diagnosis,
            but no treatment or management information
            was provided by the backend.

          </div>


          <!-- =========================
               MODEL INFORMATION
          ========================== -->
          <div class="model-info">

            <span>
              🤖 Model
            </span>

            <strong>
              {{ getModelName() }}
            </strong>

            <span
              class="connected"
              *ngIf="result.model_connected"
            >
              ● Model connected
            </span>

          </div>


          <!-- =========================
               FILE
          ========================== -->
          <div
            class="file-info"
            *ngIf="result.filename"
          >

            📄 Analyzed:
            <strong>
              {{ result.filename }}
            </strong>

          </div>

        </div>

      </section>

    </div>
  `,

  styles: [`

    * {
      box-sizing: border-box;
    }

    .page {
      min-height: calc(100vh - 80px);
      padding: 35px;
      background: #f4f8f3;
    }

    .hero {
      max-width: 1200px;
      margin: auto;
    }

    .eyebrow {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #087f4e;
      margin-bottom: 8px;
    }

    .hero h1 {
      margin: 0 0 10px;
      font-size: 38px;
      color: #073b2a;
    }

    .hero p {
      color: #61746c;
      font-size: 17px;
      margin: 0;
    }

    .card {
      max-width: 1200px;
      margin: 30px auto;
      padding: 30px;
      background: white;
      border-radius: 18px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, .06);
    }

    .upload-area {
      border: 2px dashed #cbdcd2;
      border-radius: 15px;
      padding: 45px 20px;
      text-align: center;
    }

    .photo-icon {
      font-size: 55px;
    }

    .upload-area h2 {
      color: #073b2a;
      margin-bottom: 8px;
    }

    .upload-area p {
      color: #61746c;
      margin-bottom: 22px;
    }

    .upload-btn,
    .analyze-btn {
      border: none;
      border-radius: 10px;
      padding: 14px 24px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
    }

    .upload-btn {
      background: #087f4e;
      color: white;
    }

    .upload-btn:hover {
      background: #06683f;
    }

    .analyze-btn {
      display: block;
      margin: 25px auto 0;
      background: #073b2a;
      color: white;
    }

    .analyze-btn:hover:not(:disabled) {
      background: #0a513b;
    }

    .analyze-btn:disabled {
      opacity: .5;
      cursor: not-allowed;
    }

    .filename {
      margin-top: 15px;
      color: #53665e;
      font-size: 14px;
    }

    .preview {
      margin: 25px auto;
      text-align: center;
    }

    .preview img {
      max-width: 400px;
      max-height: 400px;
      border-radius: 14px;
      object-fit: contain;
      box-shadow: 0 5px 20px rgba(0, 0, 0, .1);
    }

    /* LOADING */

    .loading {
      margin: 25px auto;
      text-align: center;
      color: #53665e;
    }

    .spinner {
      width: 35px;
      height: 35px;
      margin: auto;
      border: 4px solid #dcebe3;
      border-top: 4px solid #087f4e;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* ERROR */

    .error {
      margin-top: 20px;
      padding: 15px;
      background: #fff1f1;
      color: #b42318;
      border-radius: 10px;
    }

    /* RESULT */

    .result {
      margin-top: 35px;
      padding: 25px;
      background: #f8fbf9;
      border-radius: 16px;
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      margin-bottom: 25px;
    }

    .result-eyebrow {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #087f4e;
    }

    .result-header h2 {
      margin: 5px 0 0;
      color: #073b2a;
    }

    .status-badge {
      padding: 9px 14px;
      border-radius: 20px;
      background: #e4f5eb;
      color: #087f4e;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
    }

    /* DISEASE BOX */

    .disease-box {
      background: white;
      border-radius: 14px;
      padding: 25px;
      border: 1px solid #e0ebe5;
    }

    .result-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #6b7d75;
    }

    .disease-name {
      font-size: 29px;
      font-weight: 800;
      color: #087f4e;
      margin: 10px 0 22px;
      word-break: break-word;
    }

    /* CONFIDENCE */

    .confidence {
      max-width: 600px;
    }

    .confidence-top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #53665e;
    }

    .confidence-top strong {
      color: #073b2a;
    }

    .confidence-bar {
      width: 100%;
      height: 10px;
      border-radius: 10px;
      background: #e4eee9;
      overflow: hidden;
    }

    .confidence-bar span {
      display: block;
      height: 100%;
      background: #087f4e;
      border-radius: 10px;
    }

    /* RESULT CARDS */

    .result-card {
      margin-top: 18px;
      padding: 22px;
      background: white;
      border: 1px solid #e0ebe5;
      border-radius: 14px;
      text-align: left;
    }

    .result-card-title {
      font-weight: 800;
      color: #073b2a;
      font-size: 17px;
      margin-bottom: 12px;
    }

    .result-card p {
      margin: 0;
      color: #53665e;
      line-height: 1.7;
      white-space: pre-line;
    }

    .list-text {
      white-space: pre-line;
      color: #53665e;
      line-height: 1.8;
    }

    .solution-card {
      border-left: 5px solid #087f4e;
    }

    /* NOTICE */

    .notice {
      margin-top: 18px;
      padding: 16px;
      background: #fff9e8;
      border-radius: 12px;
      color: #7a5b00;
      line-height: 1.6;
    }

    /* MODEL */

    .model-info {
      margin-top: 20px;
      padding: 15px;
      background: #eef5f1;
      border-radius: 10px;
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
      color: #53665e;
      font-size: 13px;
    }

    .model-info strong {
      color: #073b2a;
    }

    .connected {
      color: #087f4e;
      font-weight: 700;
    }

    .file-info {
      margin-top: 12px;
      color: #7a8982;
      font-size: 12px;
      word-break: break-word;
    }

    /* MOBILE */

    @media (max-width: 700px) {

      .page {
        padding: 20px;
      }

      .card {
        padding: 18px;
      }

      .hero h1 {
        font-size: 30px;
      }

      .result-header {
        align-items: flex-start;
        flex-direction: column;
      }

      .disease-name {
        font-size: 23px;
      }

    }

  `]
})
export class DiseaseComponent {

  private farmService = inject(FarmService);

  file: File | null = null;

  preview = '';

  loading = false;

  error = '';

  result: any = null;


  // ==========================================
  // FILE SELECTION
  // ==========================================

  selectFile(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    this.file = input.files[0];

    this.result = null;

    this.error = '';

    const reader = new FileReader();

    reader.onload = () => {

      this.preview = reader.result as string;

    };

    reader.readAsDataURL(this.file);

  }


  // ==========================================
  // ANALYZE IMAGE
  // ==========================================

  analyze(): void {

    if (!this.file || this.loading) {
      return;
    }

    this.loading = true;

    this.error = '';

    this.result = null;


    const formData = new FormData();

    formData.append('file', this.file);


    console.log(
      'Sending plant image:',
      this.file.name
    );


    this.farmService.disease(formData).subscribe({

      next: (response: any) => {

        console.log(
          'REAL PLANT DISEASE API RESPONSE:',
          response
        );

        this.loading = false;


        if (!response) {

          this.error =
            'No response from the plant analysis backend.';

          return;
        }


        if (response.detail) {

          this.error =
            typeof response.detail === 'string'
              ? response.detail
              : 'The plant image could not be analyzed.';

          return;
        }


        if (response.error) {

          this.error =
            typeof response.error === 'string'
              ? response.error
              : 'The plant image could not be analyzed.';

          return;
        }


        /*
         * IMPORTANT:
         *
         * We store the ACTUAL API response.
         *
         * There is no fake disease data here.
         */

        this.result = response;

      },


      error: (err: any) => {

        console.error(
          'Plant analysis API error:',
          err
        );

        this.loading = false;

        this.error =
          err?.error?.detail ||
          err?.error?.error ||
          'Could not connect to the plant analysis backend.';

      }

    });

  }


  // ==========================================
  // DISEASE NAME
  // ==========================================

  getDiseaseName(): string {

    if (!this.result) {
      return '';
    }

    const value =
      this.result.disease ??
      this.result.prediction ??
      this.result.class_name ??
      this.result.label ??
      this.result.diagnosis ??
      this.result.result;


    if (typeof value === 'object' && value !== null) {

      return (
        value?.name ??
        value?.disease ??
        value?.label ??
        'Disease detected'
      );

    }


    return value ??
      'Disease could not be identified';

  }


  // ==========================================
  // CONFIDENCE
  // ==========================================

  getConfidence(): number | null {

    if (!this.result) {
      return null;
    }

    const value =
      this.result.confidence ??
      this.result.probability ??
      this.result.score;


    if (
      value === undefined ||
      value === null
    ) {

      return null;

    }


    let numberValue = Number(value);


    if (isNaN(numberValue)) {
      return null;
    }


    /*
     * Model may return:
     *
     * 0.94 -> 94
     *
     * 94 -> 94
     */

    if (
      numberValue > 0 &&
      numberValue <= 1
    ) {

      numberValue *= 100;

    }


    numberValue = Math.max(
      0,
      Math.min(100, numberValue)
    );


    return Number(
      numberValue.toFixed(1)
    );

  }


  // ==========================================
  // DESCRIPTION
  // ==========================================

  getDescription(): string {

    if (!this.result) {
      return '';
    }

    return this.toText(
      this.result.description ??
      this.result.details ??
      this.result.explanation
    );

  }


  // ==========================================
  // SYMPTOMS
  // ==========================================

  getSymptoms(): string {

    if (!this.result) {
      return '';
    }

    return this.toText(
      this.result.symptoms ??
      this.result.signs ??
      this.result.symptom
    );

  }


  // ==========================================
  // SOLUTION / TREATMENT
  // ==========================================

  getSolution(): string {

    if (!this.result) {
      return '';
    }

    /*
     * YOUR BACKEND CURRENTLY RETURNS:
     *
     * "actions": [...]
     *
     * So actions MUST be included here.
     */

    return this.toText(

      this.result.solution ??

      this.result.treatment ??

      this.result.remedy ??

      this.result.management ??

      this.result.recommended_action ??

      this.result.recommendation ??

      this.result.advice ??

      this.result.actions

    );

  }


  // ==========================================
  // PREVENTION
  // ==========================================

  getPrevention(): string {

    if (!this.result) {
      return '';
    }

    return this.toText(

      this.result.prevention ??

      this.result.preventive_measures

    );

  }


  // ==========================================
  // MODEL NAME
  // ==========================================

  getModelName(): string {

    if (!this.result) {
      return 'Unknown';
    }

    return (
      this.result.model ??
      'Plant Disease Model'
    );

  }


  // ==========================================
  // CONVERT STRING / ARRAY / OBJECT
  // ==========================================

  private toText(value: any): string {

    if (
      value === undefined ||
      value === null ||
      value === ''
    ) {

      return '';

    }


    /*
     * STRING
     */

    if (typeof value === 'string') {

      return value;

    }


    /*
     * ARRAY
     */

    if (Array.isArray(value)) {

      return value

        .map((item: any) => {

          if (
            typeof item === 'string'
          ) {

            return '• ' + item;

          }

          return '• ' +
            JSON.stringify(item);

        })

        .join('\n');

    }


    /*
     * OBJECT
     */

    if (
      typeof value === 'object'
    ) {

      return Object.entries(value)

        .map(([key, val]) => {

          return `${this.formatKey(key)}: ${this.toText(val)}`;

        })

        .join('\n');

    }


    return String(value);

  }


  // ==========================================
  // FORMAT API FIELD NAME
  // ==========================================

  private formatKey(key: string): string {

    return key

      .replace(/_/g, ' ')

      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }

}
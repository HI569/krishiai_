import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FarmService } from '../../services/farm.service';

@Component({
  selector: 'app-disaster',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './disaster.html',
  styleUrl: './disaster.css',
})
export class Disaster {

  private farmService = inject(FarmService);

  loading = false;
  error = '';

  data: any = null;

  latitude = 30.901;
  longitude = 75.8573;
locationQuery = '';
locationResults: any[] = [];
selectedLocation = 'Ludhiana, Punjab, India';
searchingLocation = false;
searchLocation() {
  const query = this.locationQuery.trim();

  if (!query) {
    this.locationResults = [];
    return;
  }

  this.searchingLocation = true;
  this.locationResults = [];

  this.farmService.searchLocation(query).subscribe({
    next: (response) => {
      this.locationResults = response?.results || [];
      this.searchingLocation = false;
    },
    error: (err) => {
      console.error('Location search error:', err);
      this.locationResults = [];
      this.searchingLocation = false;
    }
  });
}

selectLocation(location: any) {
  this.latitude = location.latitude;
  this.longitude = location.longitude;

  this.selectedLocation =
    `${location.name}, ${location.state}, ${location.country}`;

  this.locationQuery = location.name;
  this.locationResults = [];
}
  predict() {
    this.loading = true;
    this.error = '';
    this.data = null;

    this.farmService.disaster(
      this.latitude,
      this.longitude
    ).subscribe({
      next: (response) => {
        this.data = response;
        this.loading = false;
      },

      error: (err) => {
        console.error('Disaster prediction error:', err);

        this.error =
          err?.error?.detail ||
          'Unable to get disaster prediction.';

        this.loading = false;
      }
    });
  }

  riskClass(level: string): string {
    return (level || '').toLowerCase();
  }

  formatName(name: string): string {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
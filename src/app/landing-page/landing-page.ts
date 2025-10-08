import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../api';
import { finalize } from 'rxjs/operators';
import { RouterLink } from '@angular/router';
import { DeviceDetector, DeviceType } from '../device-detector';
import { GoogleAnalytics } from '../google-analytics';

// Define a type for the possible UI states for better type safety
type UiState = 'FORM' | 'LOADING' | 'SUCCESS' | 'ERROR';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss']
})
export class LandingPage {
  private fb = inject(FormBuilder);
  private apiService = inject(Api);
  private deviceDetector = inject(DeviceDetector);
  private googleAnalytics = inject(GoogleAnalytics);

  uiState: WritableSignal<UiState> = signal('FORM');
  copyButtonText: WritableSignal<string> = signal('Copy Link');
  
  // Signals for the new device-aware flow
  deviceType: WritableSignal<DeviceType> = signal('Desktop');
  subscriptionUrl = signal('');
  

  iosUrl = computed(() => this.subscriptionUrl().replace(/^https?/, 'webcal'));


androidUrl = computed(() =>
    `https://calendar.google.com/calendar/u/0/r/settings/addbyurl?url=${encodeURIComponent(this.subscriptionUrl())}`
  );


  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  onGenerateCalendar(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.uiState.set('LOADING');
    const credentials = this.loginForm.value;

    this.apiService.getSubscriptionUrl(credentials).pipe(
      finalize(() => {
        if (this.uiState() === 'LOADING') this.uiState.set('ERROR');
      })
    ).subscribe({
      next: (url) => {
        this.subscriptionUrl.set(url);
        this.deviceType.set(this.deviceDetector.getDeviceType());
        this.uiState.set('SUCCESS');
        this.googleAnalytics.event('subscribe', {
          'event_category': 'engagement',
          'event_label': 'Subscribe to Calendar',
          'value': this.deviceType
        });
      },
      error: (error) => {
        console.error('Failed to get subscription URL:', error);
        this.uiState.set('ERROR');
      }
    });
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.subscriptionUrl()).then(() => {
      this.copyButtonText.set('Copied!');
      setTimeout(() => this.copyButtonText.set('Copy Link'), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      this.copyButtonText.set('Failed to Copy');
    });
  }

  resetForm(): void {
    this.uiState.set('FORM');
    this.loginForm.reset();
    this.subscriptionUrl.set('');
  }
}
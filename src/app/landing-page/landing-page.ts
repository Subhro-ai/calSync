import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Api } from '../api';
import { finalize } from 'rxjs/operators';
import { RouterLink } from '@angular/router';

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

  uiState: WritableSignal<UiState> = signal('FORM');
  subscriptionUrl: WritableSignal<string> = signal('');
  copyButtonText: WritableSignal<string> = signal('Copy Link');

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
        this.uiState.set('SUCCESS');
      },
      error: (error) => {
        console.error('Failed to get subscription URL:', error);
        this.uiState.set('ERROR');
      }
    });
  }

  /**
   * Copies the subscription URL to the user's clipboard.
   */
  onCopyLink(): void {
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


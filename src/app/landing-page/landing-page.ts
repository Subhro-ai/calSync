import { Component, inject, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// ApiService import is removed

// Define a type for the possible UI states for better type safety
type UiState = 'FORM' | 'LOADING' | 'SUCCESS' | 'ERROR';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.scss']
})
export class LandingPage {
  // --- Modern Dependency Injection using inject() ---
  private fb = inject(FormBuilder);
  // ApiService injection is removed
  
  // --- Component State using Signals ---
  uiState: WritableSignal<UiState> = signal('FORM');
  private fileBlob: Blob | null = null;

  // --- Reactive Form Initialization ---
  loginForm: FormGroup = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  /**
   * Handles the form submission to generate the calendar.
   */
  onGenerateCalendar(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.uiState.set('LOADING');
    
    // --- MOCK API CALL ---
    // The real ApiService call is replaced with a setTimeout to simulate a network request.
    const credentials = this.loginForm.value;
    console.log('Simulating submission with credentials:', credentials);

    setTimeout(() => {
      // Simulate a successful login based on mock credentials
      if (credentials.username.toLowerCase() !== 'fail') {
        const dummyIcsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TimetableSync//EN\nBEGIN:VEVENT\nUID:uid1@yourdomain.com\nSUMMARY:CS101\nDTSTART:20251027T090000\nDTEND:20251027T100000\nEND:VEVENT\nEND:VCALENDAR`;
        this.fileBlob = new Blob([dummyIcsContent], { type: 'text/calendar;charset=utf-8' });
        this.uiState.set('SUCCESS');
      } else {
        // Simulate a failed login
        this.uiState.set('ERROR');
      }
    }, 2000); // 2-second delay
  }

  /**
   * Handles the download of the generated .ics file.
   */
  onDownloadFile(): void {
    if (!this.fileBlob) {
      console.error('Download clicked but no file blob was available.');
      this.uiState.set('ERROR');
      return;
    }
    
    const url = window.URL.createObjectURL(this.fileBlob);
    
    // Create a temporary link to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timetable.ics';
    document.body.appendChild(a);
    a.click();
    
    // Clean up the temporary link and URL object
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    this.resetForm();
  }
  
  /**
   * Resets the UI state back to the initial form.
   */
  resetForm(): void {
    this.uiState.set('FORM');
    this.loginForm.reset();
    this.fileBlob = null;
  }
}


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, switchMap } from 'rxjs';

// Define an interface for the subscription response
export interface SubscriptionResponse {
  subscriptionUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class Api {
  private readonly apiUrl = 'https://calsync-backend.onrender.com/api';
  // private readonly apiUrl = 'http://localhost:8080/api'; // Use this for local development
  private http = inject(HttpClient);

  /**
   * Calls the /subscribe endpoint to get the unique calendar URL.
   * @param credentials The user's username and password.
   * @returns An Observable containing the subscription URL string.
   */
  getSubscriptionUrl(credentials: { username: string, password: string }): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<SubscriptionResponse>(`${this.apiUrl}/subscribe`, credentials, { headers }).pipe(
      map(response => response.subscriptionUrl) // Extract just the URL string from the response
    );
  }
}

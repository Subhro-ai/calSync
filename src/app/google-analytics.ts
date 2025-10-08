import { Injectable } from '@angular/core';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalytics {
  constructor() { }

  public event(eventName: string, params: {}) {
    gtag('event', eventName, params);
  }

  public pageView(path: string) {
    gtag('config', 'G-F5M5RPPG55', { 'page_path': path });
  }
  
}

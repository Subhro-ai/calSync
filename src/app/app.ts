import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { GoogleAnalytics } from './google-analytics';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('calSync');
  constructor(private router: Router, private googleAnalyticsService: GoogleAnalytics) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.pageView(event.urlAfterRedirects);
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-android-guide',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './android-guide.html',
})
export class AndroidGuide {}
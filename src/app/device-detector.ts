import { Injectable } from '@angular/core';

export type DeviceType = 'iOS' | 'Android' | 'Desktop';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetector {
  
  getDeviceType(): DeviceType {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) {
      return 'iOS';
    }
    if (/Android/.test(ua)) {
      return 'Android';
    }
    return 'Desktop';
  }
}
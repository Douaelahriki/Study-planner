import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability, AvailabilityResponse } from '../models/availability.model';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/availability';

  getMyAvailability(): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(this.apiUrl);
  }

  addAvailability(slot: Availability): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(this.apiUrl, slot);
  }

  updateAvailability(index: number, slot: Availability): Observable<AvailabilityResponse> {
    return this.http.put<AvailabilityResponse>(`${this.apiUrl}/${index}`, slot);
  }

  deleteAvailability(index: number): Observable<AvailabilityResponse> {
    return this.http.delete<AvailabilityResponse>(`${this.apiUrl}/${index}`);
  }

  setAllAvailability(availability: Availability[]): Observable<AvailabilityResponse> {
    return this.http.put<AvailabilityResponse>(this.apiUrl, { availability });
  }
}
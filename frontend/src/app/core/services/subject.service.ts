import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  Subject, 
  SubjectListResponse, 
  SubjectResponse, 
  CreateSubjectRequest 
} from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/subjects';

  getMySubjects(): Observable<SubjectListResponse> {
    return this.http.get<SubjectListResponse>(this.apiUrl);
  }

  getSubjectById(id: string): Observable<SubjectResponse> {
    return this.http.get<SubjectResponse>(`${this.apiUrl}/${id}`);
  }

  createSubject(data: CreateSubjectRequest): Observable<SubjectResponse> {
    return this.http.post<SubjectResponse>(this.apiUrl, data);
  }

  updateSubject(id: string, data: Partial<CreateSubjectRequest>): Observable<SubjectResponse> {
    return this.http.put<SubjectResponse>(`${this.apiUrl}/${id}`, data);
  }

  deleteSubject(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
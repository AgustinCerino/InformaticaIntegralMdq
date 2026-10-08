import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactRequest, ContactResponse } from './contact.models';

@Injectable({ providedIn: 'root' })
export class ContactApiService {
  private readonly http = inject(HttpClient);

  send(payload: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>('/api/contact', payload);
  }
}

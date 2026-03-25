import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import type { ChatMessageRequest, ChatMessageResponse, ChatSuggestionsResponse } from '../../models/types';

@Injectable({ providedIn: 'root' })
export class ChatbotApiService {
  private readonly base = `${environment.apiUrl}/chatbot`;

  constructor(private http: HttpClient) {}

  sendMessage(data: ChatMessageRequest): Observable<ChatMessageResponse> {
    return this.http.post<ChatMessageResponse>(`${this.base}/message`, data);
  }

  getSuggestions(): Observable<ChatSuggestionsResponse> {
    return this.http.get<ChatSuggestionsResponse>(`${this.base}/suggestions`);
  }

  getHistorique(sessionId?: string): Observable<{ messages: string[] }> {
    const options = sessionId ? { params: { sessionId } } : {};
    return this.http.get<{ messages: string[] }>(`${this.base}/historique`, options);
  }

  clearHistorique(sessionId?: string): Observable<{ message: string }> {
    const options = sessionId ? { params: { sessionId } } : {};
    return this.http.delete<{ message: string }>(`${this.base}/historique`, options);
  }

  getHealth(): Observable<{ status: string; service: string; version: string }> {
    return this.http.get<{ status: string; service: string; version: string }>(`${this.base}/health`);
  }
}


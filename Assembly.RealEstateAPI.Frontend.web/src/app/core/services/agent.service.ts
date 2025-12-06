import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/employee/agent';
import { CreateAgent } from '../models/employee/create-agent';
import { Observable, defer, throwError } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class AgentService {
    private http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:5109/api/Agent'

    agents = signal<Agent[]>([]);
    selectedAgent = signal<Agent | null>(null);
    loading = signal(false);
    error = signal<string | null>(null);

    loadAll(): Observable<void>{
      return defer(() => {
        this.loading.set(true);
        this.error.set(null);
        return this.http.get<Agent[]>(this.apiUrl)
        .pipe(
          tap(data => this.agents.set(data ?? [])),
          map(() => void 0),
          catchError( error => {
            this.error.set((error as any)?.message ?? 'Failed to load agents');
            return throwError(() => error);
        }),
      finalize(() => this.loading.set(false))
      );
    });
  }

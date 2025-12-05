import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Agent } from '../models/employee/agent';
import { CreateAgent } from '../models/employee/create-agent';

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

    async loadAll(): Promise<void>{
        this.loading.set(true);
        this.error.set(null);
        try{
            const data = await this.http.get<Agent[]>(this.apiUrl).toPromise();
            this.agents.set(data || []);
        } catch (error: any){
            this.error.set(error.message || 'Failed to load agents');
        } finally {
            this.loading.set(false);
        }
    }
}
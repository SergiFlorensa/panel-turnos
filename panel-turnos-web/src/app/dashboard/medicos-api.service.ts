import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MedicoResumen } from './turnos-api.service';

@Injectable({ providedIn: 'root' })
export class MedicosApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getMedicos(): Observable<MedicoResumen[]> {
    return this.http.get<MedicoResumen[]>(`${this.baseUrl}/medicos`);
  }
}

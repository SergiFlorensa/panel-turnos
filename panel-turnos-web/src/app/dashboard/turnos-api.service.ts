import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface UsuarioResumen {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface MedicoResumen {
  id: string;
  especialidad: string;
  usuario: UsuarioResumen;
}

export interface PacienteResumen {
  id: string;
  dni: string;
  usuario: UsuarioResumen;
}

export interface TurnoDto {
  id: string;
  medicoId: string;
  pacienteId: string;
  fechaHora: string;
  estado: string;
  notas?: string | null;
  medico: MedicoResumen;
  paciente: PacienteResumen;
}

export interface TurnosFilters {
  start?: string;
  end?: string;
  medicoId?: string;
}

@Injectable({ providedIn: 'root' })
export class TurnosApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getTurnos(filters: TurnosFilters = {}): Observable<TurnoDto[]> {
    let params = new HttpParams();

    if (filters.start) {
      params = params.set('start', filters.start);
    }
    if (filters.end) {
      params = params.set('end', filters.end);
    }
    if (filters.medicoId) {
      params = params.set('medicoId', filters.medicoId);
    }

    return this.http.get<TurnoDto[]>(`${this.baseUrl}/turnos`, { params });
  }
}

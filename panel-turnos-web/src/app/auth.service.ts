import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

interface LoginResponse {
  access_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales de login al backend
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Observable con el token JWT
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    // Esto es opcional: Angular ya pone este header por defecto en JSON
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<LoginResponse>(url, body, { headers });
  }
}

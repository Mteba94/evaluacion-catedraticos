import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiResponse } from '../../../shared/models/baseApiResponce.interface';
import { ProfessorData } from '../models/professor.interface';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoints.util';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {
  private readonly httpClient = inject(HttpClient);

  getAllProfessors(): Observable<BaseApiResponse<ProfessorData[]>>{
    const requestUrl = `${env.api}${endpoint.LIST_PROFESSORS}`;

    return this.httpClient
      .get<BaseApiResponse<ProfessorData[]>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp
        })
      )
  }

  dashboardDataByProfessor(professorId: number): Observable<BaseApiResponse<ProfessorData>>{
    const requestUrl = `${env.api}${endpoint.DASHBOARD}${professorId}`;

    return this.httpClient
      .get<BaseApiResponse<ProfessorData>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp
        })
      )
    }
}

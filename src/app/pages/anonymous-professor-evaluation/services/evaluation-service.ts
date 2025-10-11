import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiResponse } from '../../../shared/models/baseApiResponce.interface';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoints.util';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  private readonly httpClient = inject(HttpClient);

  createEvaluation(evaluationData: any): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.CREATE_EVALUATION}`;

    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, evaluationData).pipe(
      map((response: BaseApiResponse<boolean>)  => {
        return response;
      }))
  }
}

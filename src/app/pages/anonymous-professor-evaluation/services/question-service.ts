import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiResponse } from '../../../shared/models/baseApiResponce.interface';
import { Question } from '../models/question.interface';
import { environment as env } from '../../../../environments/environment.development';
import { endpoint } from '../../../shared/utils/endpoints.util';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly httpClient = inject(HttpClient);

  getAllQuestions(): Observable<BaseApiResponse<Question[]>>{
      const requestUrl = `${env.api}${endpoint.LIST_QUESTIONS}`;
  
      return this.httpClient
        .get<BaseApiResponse<Question[]>>(requestUrl)
        .pipe(
          map((resp) => {
            return resp
          })
        )
    }
}

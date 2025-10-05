import { Routes } from '@angular/router';
import { NotFound } from './pages/not-found/not-found';
import { AnonymousProfessorEvaluation } from './pages/layout/anonymous-professor-evaluation/anonymous-professor-evaluation';

export const routes: Routes = [
    {
        path: '',
        component: AnonymousProfessorEvaluation
    },
    {
        path: '**',
        component: NotFound
    },
];

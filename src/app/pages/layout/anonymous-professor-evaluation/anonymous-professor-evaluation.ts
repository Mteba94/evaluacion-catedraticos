import { Component, inject } from '@angular/core';
import { InteractiveEvaluationForm } from '../../anonymous-professor-evaluation/components/interactive-evaluation-form/interactive-evaluation-form';

@Component({
  selector: 'app-anonymous-professor-evaluation',
  imports: [
    InteractiveEvaluationForm
  ],
  templateUrl: './anonymous-professor-evaluation.html',
  styleUrl: './anonymous-professor-evaluation.css'
})
export class AnonymousProfessorEvaluation {
  //private readonly document = inject(Document)

  // handleStartEvaluation(): void {
  //   const element = this.document.getElementById('start-evaluation');
  //   if (element) {
  //     element.scrollIntoView({ 
  //       behavior: 'smooth' 
  //     });
  //   }
  // }

  // /**
  //  * Desplaza la vista a la sección de previsualización de resultados.
  //  */
  // handleViewResults(): void {
  //   const element = this.document.getElementById('results-preview');
  //   if (element) {
  //     element.scrollIntoView({ 
  //       behavior: 'smooth' 
  //     });
  //   }
  // }
}

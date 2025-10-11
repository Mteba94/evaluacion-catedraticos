import { Component, inject, OnInit } from '@angular/core';
import { Ratings } from '../../models/ratings.interface';
import { Professor, ProfessorData } from '../../models/professor.interface';
import { Question } from '../../models/question.interface';
import { CheckCircle, Eye, Info, Lock, LucideAngularModule, MessageSquare, MessagesSquare, Shield, Star, User } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../../../shared/components/reusables/select-component/select-component';
import { InputComponent } from '../../../../shared/components/reusables/input/input';
import { Button } from '../../../../shared/components/reusables/button/button';
import { FormsModule } from '@angular/forms';
import { ProfessorService } from '../../services/professor-service';
import { QuestionService } from '../../services/question-service';
import { EvaluationService } from '../../services/evaluation-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-interactive-evaluation-form',
  imports: [
    CommonModule,
    LucideAngularModule,
    SelectComponent,
    InputComponent,
    Button,
    FormsModule
  ],
  templateUrl: './interactive-evaluation-form.html',
  styleUrl: './interactive-evaluation-form.css'
})
export class InteractiveEvaluationForm {
  readonly icons = {
    checkCircle: CheckCircle,
    shield: Shield,
    lock: Lock,
    eye: Eye,
    user: User,
    info: Info,
    star: Star,
    messageSquare: MessageSquare
  }

  private readonly professorService = inject(ProfessorService)
  private readonly questionService = inject(QuestionService)
  private readonly evaluationService = inject(EvaluationService)

  // Conversión de useState a propiedades de clase
  selectedProfessor: string = '';
  ratings: Ratings = {
    teaching: 0,
    clarity: 0,
    availability: 0,
    fairness: 0,
    overall: 0
  };
  comments: string = '';
  currentStep: number = 0;
  showSuccess: boolean = false;
  showError: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;

  professors: Professor[] = [];
  questions: Question[] = [];


  ngOnInit(): void {
    this.getProfessors();
    this.getQuestions();
  }

  getProfessors():void{
    this.professorService
      .getAllProfessors()
      .subscribe({
        next: (resp) => {
          if(resp.isSuccess){
            this.professors = this.mapProfessors(resp.data);
          }
        }
      }) 
  }

  getQuestions():void{
    this.questionService
      .getAllQuestions()
      .subscribe({
        next: (resp) => {
          if(resp.isSuccess){
            this.questions = resp.data;
          }
        }
      }) 
  }

  private mapProfessors(data: ProfessorData[]): Professor[]{
    return data.map(item =>{
      return{
        value: item.id,
        label: item.name,
        description: item.course
      }
    })
  }

  private mapQuestions(data: Question[]): Question[]{
    return data.map(item =>{
      return{
        id: item.id,
        key: item.key,
        title: item.title,
        description: item.description
      }
    })
  }

  handleRatingChange(questionId: keyof Ratings, rating: number): void {
    this.ratings = { ...this.ratings, [questionId]: rating };
  }

  handleNext(): void {
    if (this.currentStep < 3 && this.isStepComplete()) {
      this.currentStep++;
    }
  }

  handlePrevious(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async handleSubmit(): Promise<void> {
    const evaluationData = {
      professorId: this.selectedProfessor,
      evaluationResponseRequests: this.questions.map(q => ({
        questionId: q.id,
        score: this.ratings[q.key]
      })),
      ratingsRequest: this.ratings,
      comments: this.comments
    };
    this.isLoading = true;
    const response = await firstValueFrom(
      this.evaluationService.createEvaluation(evaluationData)
    );

    console.log(response);

    if (response) {
      //console.log('Evaluación enviada con éxito:', response);
      this.isLoading = false;
      this.showSuccess = true;
    }else{
      this.showSuccess = false;
      this.showError = true;
      this.isLoading = false;
      //this.errorMessage = response?.message ?? 'Error al enviar la evaluación. Por favor, inténtelo de nuevo.';
    }

    console.log(response);


    setTimeout(() => {
      this.showSuccess = false;
      this.isLoading = false;
      this.currentStep = 0;
      this.selectedProfessor = '';
      this.ratings = { teaching: 0, clarity: 0, availability: 0, fairness: 0, overall: 0 };
      this.comments = '';
    }, 6000);
  }

  // Métodos auxiliares

  getStepTitle(): string {
    switch (this.currentStep) {
      case 0: return 'Seleccionar Profesor';
      case 1: return 'Evaluación por Categorías';
      case 2: return 'Comentarios Adicionales';
      case 3: return 'Confirmar Envío';
      default: return 'Evaluación';
    }
  }

  isStepComplete(): boolean {
    switch (this.currentStep) {
      case 0: return this.selectedProfessor !== '';
      case 1: return Object.values(this.ratings).every(rating => rating > 0);
      case 2: return this.comments.length >= 10;
      case 3: return true;
      default: return false;
    }
  }

  get selectedProfessorDetails() {
    return this.professors.find(p => p.value === Number(this.selectedProfessor));
  }
}

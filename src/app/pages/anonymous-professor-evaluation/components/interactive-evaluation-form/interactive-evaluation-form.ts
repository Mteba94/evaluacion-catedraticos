import { Component } from '@angular/core';
import { Ratings } from '../../models/ratings.interface';
import { Professor } from '../../models/professor.interface';
import { Question } from '../../models/question.interface';
import { CheckCircle, Eye, Info, Lock, LucideAngularModule, MessageSquare, MessagesSquare, Shield, Star, User } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../../../shared/components/reusables/select-component/select-component';
import { InputComponent } from '../../../../shared/components/reusables/input/input';
import { Button } from '../../../../shared/components/reusables/button/button';
import { FormsModule } from '@angular/forms';

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

  // Datos constantes
  readonly professors: Professor[] = [
    { value: 'gonzalez', label: 'Dr. María González - Matemáticas Avanzadas (MAT301)', description: 'Lunes, Miércoles, Viernes 10:00-11:30' },
    { value: 'rodriguez', label: 'Prof. Carlos Rodríguez - Física Cuántica (FIS402)', description: 'Martes, Jueves 14:00-15:30' },
    { value: 'martinez', label: 'Dra. Ana Martínez - Literatura Española (LIT201)', description: 'Lunes, Miércoles 16:00-17:30' },
    { value: 'lopez', label: 'Prof. Juan López - Química Orgánica (QUI303)', description: 'Martes, Jueves, Viernes 09:00-10:00' }
  ];

  readonly questions: Question[] = [
    { id: 'teaching', title: 'Calidad de Enseñanza', description: '¿Qué tan efectivo es el profesor explicando conceptos complejos?' },
    { id: 'clarity', title: 'Claridad en las Explicaciones', description: '¿Las explicaciones del profesor son claras y fáciles de entender?' },
    { id: 'availability', title: 'Disponibilidad y Apoyo', description: '¿El profesor está disponible para ayudar fuera de clase?' },
    { id: 'fairness', title: 'Justicia en Evaluaciones', description: '¿Las calificaciones y evaluaciones son justas y transparentes?' },
    { id: 'overall', title: 'Evaluación General', description: '¿Recomendarías este profesor a otros estudiantes?' }
  ];

  // Métodos de manejo de estado

  handleRatingChange(questionId: keyof Ratings, rating: number): void {
    // Angular usa inmutabilidad, pero para arrays/objetos complejos,
    // se recomienda clonar para asegurar la detección de cambios (aunque a veces no es estrictamente necesario)
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

  handleSubmit(): void {
    this.showSuccess = true;

    // Simulación del reset después del envío
    setTimeout(() => {
      this.showSuccess = false;
      this.currentStep = 0;
      this.selectedProfessor = '';
      this.ratings = { teaching: 0, clarity: 0, availability: 0, fairness: 0, overall: 0 };
      this.comments = '';
    }, 3000);
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
      case 2: return this.comments.length >= 50;
      case 3: return true;
      default: return false;
    }
  }

  get selectedProfessorDetails() {
    return this.professors.find(p => p.value === this.selectedProfessor);
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Angry, BarChart3, LucideAngularModule, MessageSquare, Shield, Smile, Star, TrendingUp, Users } from 'lucide-angular';
import { AnimatedStats } from '../../models/ratings.interface';
import { ProfessorData } from '../../models/professor.interface';
import { ProfessorService } from '../../services/professor-service';

@Component({
  selector: 'app-results-dashboard-preview',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './results-dashboard-preview.html',
  styleUrl: './results-dashboard-preview.css'
})
export class ResultsDashboardPreview {
  readonly icons = {
    users: Users,
    trendingUp: TrendingUp,
    star: Star,
    messageSquare: MessageSquare,
    shield: Shield,
    barChart3: BarChart3,
    smile: Smile,
    angry: Angry
  }

  public readonly Math = Math;
  // 1. ESTADO (Reemplazo de useState)
  public viewMode: 'student' | 'admin' = 'student';
  //public selectedProfessor: 'gonzalez' | 'rodriguez' = 'gonzalez';
  public selectedProfessor: string | null = null;
  public professorsData: Record<string, ProfessorData> = {};

  // Usamos un 'signal' para el estado animado para mejor rendimiento en la actualización
  public animatedStats = signal<AnimatedStats>({
    totalResponses: 0,
    averageRating: '0.0',
    completionRate: 0,
    positivePercentage: 0,
    negativePercentage: 0
  });

  private animationInterval: any;

  private readonly professorService = inject(ProfessorService)

  // 2. DATOS (Reemplazo de profesorData)
  // public professorsData: Record<string, ProfessorData> = {
  //   gonzalez: {
  //     id: 1,
  //     name: 'Dr. María González',
  //     course: 'Matemáticas Avanzadas - MAT301',
  //     avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  //     stats: { totalResponses: 127, averageRating: 4.2, completionRate: 89, semesterAverage: 3.8 },
  //     ratings: { teaching: 4.3, clarity: 4.1, availability: 4.0, fairness: 4.4, overall: 4.2 },
  //     recentComments: [
  //       "Excelente profesora, explica muy bien los conceptos complejos",
  //       "Muy disponible para resolver dudas fuera de clase",
  //       "Las evaluaciones son justas y bien estructuradas"
  //     ]
  //   },
  //   rodriguez: {
  //     id: 2,
  //     name: 'Prof. Carlos Rodríguez',
  //     course: 'Física Cuántica - FIS402',
  //     avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  //     stats: { totalResponses: 89, averageRating: 3.8, completionRate: 76, semesterAverage: 3.8 },
  //     ratings: { teaching: 3.9, clarity: 3.6, availability: 3.8, fairness: 4.0, overall: 3.8 },
  //     recentComments: [
  //       "Domina muy bien la materia pero podría explicar más lento",
  //       "Buen profesor, aunque a veces es difícil seguir el ritmo",
  //       "Muy justo en las calificaciones"
  //     ]
  //   }
  // };

  // 3. PROPIEDAD COMPUTADA (Reemplazo de currentData)
  get currentData(): ProfessorData | null {
    if (!this.selectedProfessor) return null;
    return this.professorsData[this.selectedProfessor];
  }

  constructor() {}

  // 4. CICLOS DE VIDA (Reemplazo de useEffect)
  ngOnInit(): void {
    // Inicializa la animación al cargar
    //this.animateStats();
    this.getProfessors();
  }

  ngOnDestroy(): void {
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  // 5. MÉTODOS DE LÓGICA (Simulación de animación)
  private animateStats(): void {
    const data = this.currentData?.stats;
    if (!data) return;

    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    //const data = this.currentData?.stats;
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    this.animationInterval = setInterval(() => {
      const progress = currentStep / steps;

      const newStats: AnimatedStats = {
        totalResponses: Math.floor(data.totalResponses * progress),
        averageRating: (data.averageRating * progress).toFixed(1),
        completionRate: Math.floor(data.completionRate * progress)
        ,positivePercentage: Math.floor((this.currentData?.commentsStats?.positivePercentage ?? 0) * progress)
        ,negativePercentage: Math.floor((this.currentData?.commentsStats?.negativePercentage ?? 0) * progress)
      };

      // Actualiza el signal
      this.animatedStats.set(newStats);

      currentStep++;
      if (currentStep > steps) {
        clearInterval(this.animationInterval);
        // Asegurar que el valor final sea exacto
        this.animatedStats.set({
          totalResponses: data.totalResponses,
          averageRating: data.averageRating.toFixed(1),
          completionRate: data.completionRate
          ,positivePercentage: this.currentData?.commentsStats?.positivePercentage ?? 0
          ,negativePercentage: this.currentData?.commentsStats?.negativePercentage ?? 0
        });
      }
    }, stepDuration);
  }

  getProfessorData(idProfessor: number): void {
    this.professorService.dashboardDataByProfessor(idProfessor)
      .subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            //this.professorsData[resp.data.name] = resp.data;
            const key = Object.keys(this.professorsData)
            .find(k => this.professorsData[k].id === idProfessor);

            if (key) {
              // Actualizamos el registro existente sin duplicar
              this.professorsData[key] = { 
                ...this.professorsData[key], 
                ...resp.data 
              };
            }
          }
        }
      });
  }

  // 6. MANEJADORES DE EVENTOS
  setViewMode(mode: 'student' | 'admin'): void {
    this.viewMode = mode;
  }

  // getProfessors():void{
  //   this.professorService
  //     .getAllProfessors()
  //     .subscribe({
  //       next: (resp) => {
  //         if(resp.isSuccess){
  //           //this.selectedProfessor = this.mapProfessors(resp.data);
  //            resp.data.forEach(prof => {
  //             const key = prof.name.toLowerCase().split(' ')[1]; // Ejemplo: "González"
  //             this.professorsData[key] = prof;
  //             this.getProfessorData(prof.id);
  //           });

  //           // Seleccionamos el primero por defecto
  //           const firstKey = Object.keys(this.professorsData)[0];
  //           if (firstKey) {
  //             this.selectedProfessor = firstKey;
  //             this.animateStats();
  //           }
  //         }
  //       }
  //     }) 
  // }

  getProfessors(): void {
    this.professorService.getAllProfessors().subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          resp.data.forEach(prof => {
            const key = prof.name.toLowerCase().split(' ')[1];
            this.professorsData[key] = prof;

            this.professorService.dashboardDataByProfessor(prof.id)
              .subscribe({
                next: (detailResp) => {
                  if (detailResp.isSuccess) {
                    this.professorsData[key] = { ...prof, ...detailResp.data };

                    // Si aún no hay profesor seleccionado, lo establecemos y animamos
                    if (!this.selectedProfessor) {
                      this.selectedProfessor = key;
                      this.animateStats();
                    }
                  }else{
                    this.animatedStats.set({
                      totalResponses: 0,
                      averageRating: '0.0',
                      completionRate: 0,
                      positivePercentage: 0,
                      negativePercentage: 0
                    });
                  }
                }
              });
          });
        }
      }
    });
  }

  // setSelectedProfessor(key: string): void {
  //   this.selectedProfessor = key;

  //   const professor = this.professorsData[key];

  //   if (!professor.stats || !professor.commentsStats) {
  //     // Si no tiene detalles, solicitarlos
  //     this.professorService.dashboardDataByProfessor(professor.id)
  //       .subscribe({
  //         next: (resp) => {
  //           if (resp.isSuccess) {
  //             this.professorsData[key] = { ...professor, ...resp.data };
  //             this.animateStats(); // Animar una vez que lleguen los datos
  //           }else{
  //             this.animatedStats.set({
  //               totalResponses: 0,
  //               averageRating: '0.0',
  //               completionRate: 0,
  //               positivePercentage: 0,
  //               negativePercentage: 0
  //             });
  //           }
  //         }
  //       });
  //   } else {
  //     // Si ya tiene detalles, solo animar
  //     this.animateStats();
  //   }
  // }

  setSelectedProfessor(key: string): void {
    this.selectedProfessor = key;

    const professor = this.professorsData[key];

    // Cancelar cualquier animación pendiente
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.professorService.dashboardDataByProfessor(professor.id)
        .subscribe({
          next: (resp) => {
            if (resp.isSuccess) {
              this.professorsData[key] = { ...professor, ...resp.data };
              this.animateStats(); // Animar solo si llegan datos
            }
          }
        });

    // if (!professor.stats || !professor.commentsStats) {
    //   // No hay datos: resetear animación a cero
    //   this.animatedStats.set({
    //     totalResponses: 0,
    //     averageRating: '0.0',
    //     completionRate: 0,
    //     positivePercentage: 0,
    //     negativePercentage: 0
    //   });

    //   // Intentamos solicitar detalles
      
    // } else {
    //   // Si ya tiene datos, animar normalmente
    //   this.animateStats();
    // }
  }
  
  // 7. MÉTODOS DE UTILIDAD (Reemplazo de funciones de renderizado de React)
  
  /**
   * Genera el HTML de estrellas para el rating. Retorna un array para usar con *ngFor.
   */
  renderStarRating(rating: number): { key: number, filled: boolean }[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push({
        key: i,
        filled: i <= Math.floor(rating)
      });
    }
    return stars;
  }

  /**
   * Calcula el ancho del progress bar para el estilo.
   */
  getProgressBarWidth(value: number, max: number = 5): string {
    const percentage = (value / max) * 100;
    return `${percentage}%`;
  }

  // Define las categorías para la vista de estudiante
  get categoryNames(): Record<string, string> {
    return {
      teaching: 'Calidad de Enseñanza',
      clarity: 'Claridad',
      availability: 'Disponibilidad',
      fairness: 'Justicia',
      overall: 'Evaluación General'
    };
  }

  // Define las categorías para la vista de administrador
  get adminCategoryNames(): Record<string, string> {
    return {
      teaching: 'Enseñanza',
      clarity: 'Claridad',
      availability: 'Disponibilidad',
      fairness: 'Justicia',
      overall: 'General'
    };
  }
}

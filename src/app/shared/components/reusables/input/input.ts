import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, signal, SimpleChanges } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';

function generateUniqueId(): string {
  return `input-${Math.random().toString(36).substring(2, 9)}`;
}

@Component({
  selector: 'app-input',
  imports: [
    CommonModule,
    LucideAngularModule,
    FormsModule
  ],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent), // Registrar InputComponent como CVA
      multi: true
    }
  ]
})
export class InputComponent {
  @Input() className: string = '';
  @Input() type: 'text' | 'number' | 'email' | 'password' | 'checkbox' | 'radio' | 'textarea' = 'text';
  @Input() label: string = '';
  @Input() description: string = '';
  @Input() error: string | null = null;
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  

  // 🆕 Propiedades internas para el CVA
    private _value: any = ''; // El valor interno que se leerá/escribirá
    onChange = (_: any) => {}; // Callback para notificar cambios al formulario
    onTouched = () => {};     // Callback para notificar que el control fue tocado

    // 🆕 Getter/Setter para el valor (opcional, pero ayuda a la claridad)
    get value(): any {
        return this._value;
    }
    set value(val: any) {
        if (val !== this._value) {
            this._value = val;
            this.onChange(val); // Notificar a Angular cuando el valor cambie
        }
    }

    writeValue(value: any): void {
        this._value = value;
    }

    // 2. Registra el callback de cambio: Angular te da una función para notificar los cambios.
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // 3. Registra el callback de toque: Angular te da una función para notificar cuando el input ha sido tocado (blur).
    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    
    // 4. Establece el estado deshabilitado: Angular llama a esto para deshabilitar el control.
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled; // Usa tu propiedad @Input() disabled
    }
    
    // 5. Modificar tu onValueChange existente: Debe usar el setter de 'value'
    onValueChange(event: Event): void {
        let newValue: any;
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;

        if (this.type === 'checkbox') {
            newValue = (target as HTMLInputElement).checked;
        } else {
            newValue = target.value;
        }
        
        this.value = newValue; // ⬅️ Usar el setter 'this.value =' que llama a this.onChange()
        
        // ❌ ELIMINAR: this.valueChange.emit(newValue); // Ya no se necesita el Output
    }
    
    // 6. Añadir un manejador de blur
    onBlur(): void {
        this.onTouched(); // Notificar a Angular que el control fue tocado
    }

  // ID interno (similar a la lógica de React)
  public inputId: string = '';

  // Clases base (definidas en el TS para simular la lógica de React)
  readonly baseInputClasses = 
    "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  readonly checkboxRadioClasses = 
    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  
  readonly textareaClasses = 
    "min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Generar ID único si no se proporciona
    this.inputId = this.id || generateUniqueId();
  }

  /**
   * Determina las clases finales para un input regular o textarea
   */
  get finalInputClasses(): string {
    let classes = this.type === 'textarea' ? this.textareaClasses : this.baseInputClasses;
    
    // Agregar clases condicionales
    if (this.error) {
      classes += " border-destructive focus-visible:ring-destructive";
    }
    // Agregar clases personalizadas
    classes += ` ${this.className}`;
    
    // La clase h-10 es específica de Tailwind, la añadimos para los inputs de texto si no es textarea
    if (this.type !== 'textarea') {
      classes += " h-10";
    }

    return classes;
  }
}



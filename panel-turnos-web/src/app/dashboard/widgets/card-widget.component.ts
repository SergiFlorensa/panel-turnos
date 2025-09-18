import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-widget',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow p-4 flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-500">{{ title }}</p>
        <h3 class="text-2xl font-bold">{{ value }}</h3>
      </div>
      <ng-content></ng-content> <!-- opcional para iconos -->
    </div>
  `,
})
export class CardWidgetComponent {
  @Input() title!: string;
  @Input() value!: string | number;
}

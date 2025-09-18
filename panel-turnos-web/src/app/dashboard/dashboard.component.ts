import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { MedicosApiService } from './medicos-api.service';
import { TurnosApiService, TurnoDto } from './turnos-api.service';

interface WeekDay {
  date: Date;
  weekdayLabel: string;
  dayNumber: number;
}

interface AgendaCell {
  dayLabel: string;
  date: Date;
  hour: number;
  turnos: TurnoDto[];
}

interface AgendaRow {
  hourLabel: string;
  hour: number;
  cells: AgendaCell[];
}

interface AgendaStats {
  total: number;
  confirmados: number;
  pendientes: number;
  atendidos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly turnosApi = inject(TurnosApiService);
  private readonly medicosApi = inject(MedicosApiService);

  private readonly hours = Array.from({ length: 10 }, (_, index) => 8 + index); // bloques 08-17
  private readonly weekStartSubject = new BehaviorSubject<Date>(startOfWeek(new Date()));
  private readonly medicoFilterSubject = new BehaviorSubject<string>('all');

  readonly weekDays$: Observable<WeekDay[]> = this.weekStartSubject.pipe(
    map((weekStart): WeekDay[] => buildWeekDays(weekStart)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly weekLabel$: Observable<string> = this.weekDays$.pipe(
    map((days) => {
      if (days.length === 0) {
        return '';
      }
      const first = days[0].date;
      const last = days[days.length - 1].date;
      return `${formatShortDate(first)} - ${formatShortDate(last)}`;
    }),
  );

  readonly medicos$ = this.medicosApi.getMedicos().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly turnos$: Observable<TurnoDto[]> = combineLatest([
    this.weekStartSubject,
    this.medicoFilterSubject,
  ]).pipe(
    switchMap(([weekStart, medicoId]) => {
      const start = toIsoStart(weekStart);
      const end = toIsoEnd(addDays(weekStart, 6));
      return this.turnosApi.getTurnos({
        start,
        end,
        medicoId: medicoId !== 'all' ? medicoId : undefined,
      });
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly agendaRows$: Observable<AgendaRow[]> = combineLatest([
    this.turnos$,
    this.weekDays$,
  ]).pipe(map(([turnos, days]) => this.buildAgenda(turnos, days)));

  readonly stats$: Observable<AgendaStats> = this.turnos$.pipe(map((turnos) => buildStats(turnos)));

  trackByHour(_: number, row: AgendaRow): number {
    return row.hour;
  }

  trackByDay(_: number, day: WeekDay): string {
    return formatDateKey(day.date);
  }

  trackByDate(_: number, cell: AgendaCell): string {
    return `${formatDateKey(cell.date)}-${cell.hour}`;
  }(_: number, cell: AgendaCell): string {
    return `${formatDateKey(cell.date)}-${cell.hour}`;
  }

  previousWeek(): void {
    this.shiftWeek(-7);
  }

  nextWeek(): void {
    this.shiftWeek(7);
  }

  goToToday(): void {
    this.weekStartSubject.next(startOfWeek(new Date()));
  }

  onMedicoChange(medicoId: string): void {
    this.medicoFilterSubject.next(medicoId);
  }

  private shiftWeek(days: number): void {
    const current = this.weekStartSubject.value;
    this.weekStartSubject.next(addDays(current, days));
  }

  private buildAgenda(turnos: TurnoDto[], days: WeekDay[]): AgendaRow[] {
    const agendaMap = new Map<string, TurnoDto[]>();

    for (const turno of turnos) {
      const date = new Date(turno.fechaHora);
      const key = `${formatDateKey(date)}-${date.getHours()}`;
      const existing = agendaMap.get(key);
      if (existing) {
        existing.push(turno);
      } else {
        agendaMap.set(key, [turno]);
      }
    }

    return this.hours.map((hour) => {
      const hourLabel = `${hour.toString().padStart(2, '0')}:00`;
      const cells: AgendaCell[] = days.map((day) => {
        const key = `${formatDateKey(day.date)}-${hour}`;
        return {
          dayLabel: day.weekdayLabel,
          date: day.date,
          hour,
          turnos: agendaMap.get(key) ?? [],
        };
      });

      return { hourLabel, hour, cells };
    });
  }
}

function startOfWeek(date: Date): Date {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // arranque ISO en lunes
  clone.setDate(clone.getDate() + diff);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function toIsoStart(date: Date): string {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone.toISOString();
}

function toIsoEnd(date: Date): string {
  const clone = new Date(date);
  clone.setHours(23, 59, 59, 999);
  return clone.toISOString();
}

function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
}

function formatShortWeekday(date: Date): string {
  return date.toLocaleDateString('es-ES', { weekday: 'short' });
}

function buildWeekDays(weekStart: Date): WeekDay[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      date,
      weekdayLabel: formatShortWeekday(date),
      dayNumber: date.getDate(),
    };
  });
}

function buildStats(turnos: TurnoDto[]): AgendaStats {
  const stats: AgendaStats = {
    total: turnos.length,
    confirmados: 0,
    pendientes: 0,
    atendidos: 0,
  };

  for (const turno of turnos) {
    switch (turno.estado) {
      case 'CONFIRMADO':
        stats.confirmados += 1;
        break;
      case 'ATENDIDO':
        stats.atendidos += 1;
        break;
      default:
        stats.pendientes += 1;
        break;
    }
  }

  return stats;
}


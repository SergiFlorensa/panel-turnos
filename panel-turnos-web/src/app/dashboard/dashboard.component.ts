import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, map, shareReplay, switchMap } from 'rxjs';
import { MedicosApiService } from './medicos-api.service';
import { TurnosApiService, TurnoDto } from './turnos-api.service';

interface AgendaCell {
  dayLabel: string;
  date: Date;
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
  private readonly hours = Array.from({ length: 10 }, (_, index) => 8 + index); // 08-17
  private readonly weekStartSubject = new BehaviorSubject<Date>(startOfWeek(new Date()));
  private readonly medicoFilterSubject = new BehaviorSubject<string>('all');

  readonly weekDays$ = this.weekStartSubject.pipe(
    map((weekStart) => buildWeekDays(weekStart)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly weekLabel$ = this.weekDays$.pipe(
    map((days) => {
      const first = days[0].date;
      const last = days[days.length - 1].date;
      return `${formatShortDate(first)} — ${formatShortDate(last)}`;
    }),
  );

  readonly medicos$ = this.medicosApi.getMedicos().pipe(shareReplay({ bufferSize: 1, refCount: true }));

  private readonly turnos$ = combineLatest([
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

  readonly agendaRows$ = combineLatest([this.turnos$, this.weekDays$]).pipe(
    map(([turnos, days]) => this.buildAgenda(turnos, days.map((day) => day.date))),
  );

  readonly stats$ = this.turnos$.pipe(map((turnos) => buildStats(turnos)));

  constructor(
    private readonly turnosApi: TurnosApiService,
    private readonly medicosApi: MedicosApiService,
  ) {}

  trackByHour(_: number, row: AgendaRow): number {
    return row.hour;
  }

  trackByDate(_: number, cell: AgendaCell): string {
    return `${formatDateKey(cell.date)}-${cell.hourLabel}`;
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

  private buildAgenda(turnos: TurnoDto[], days: Date[]): AgendaRow[] {
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
        const key = `${formatDateKey(day)}-${hour}`;
        return {
          dayLabel: formatShortWeekday(day),
          date: day,
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
  const diff = (day === 0 ? -6 : 1) - day; // ISO week starts Monday
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

function buildWeekDays(weekStart: Date): { label: string; date: Date }[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    return {
      label: `${formatShortWeekday(date)} ${date.getDate()}`,
      date,
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

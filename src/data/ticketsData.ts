export type TicketKind = 'control' | 'attestation';
export type TicketStatus = 'new' | 'in_progress' | 'passed' | 'failed';

export interface Ticket {
  id: string;
  number: number;
  title: string;
  kind: TicketKind;
  questionsCount: number;
  timeLimit: number | null;
  dateStart: string;
  dateEnd: string;
  status: TicketStatus;
  result?: string;
}

export const tickets: Ticket[] = [
  { id: 'c1', number: 101, title: 'Безопасность движения', kind: 'control', questionsCount: 20, timeLimit: 30, dateStart: '01.10.2026', dateEnd: '31.10.2026', status: 'new' },
  { id: 'c2', number: 102, title: 'Правила технической эксплуатации', kind: 'control', questionsCount: 25, timeLimit: 40, dateStart: '01.10.2026', dateEnd: '31.10.2026', status: 'in_progress' },
  { id: 'c3', number: 103, title: 'Охрана труда', kind: 'control', questionsCount: 15, timeLimit: null, dateStart: '01.09.2026', dateEnd: '30.09.2026', status: 'passed', result: '14 из 15' },
  { id: 'c4', number: 104, title: 'Сигнализация', kind: 'control', questionsCount: 10, timeLimit: 15, dateStart: '01.09.2026', dateEnd: '30.09.2026', status: 'failed', result: '5 из 10' },
  { id: 'c5', number: 105, title: 'Пожарная безопасность', kind: 'control', questionsCount: 12, timeLimit: 20, dateStart: '01.11.2026', dateEnd: '30.11.2026', status: 'new' },
  { id: 'a1', number: 201, title: 'Годовая аттестация. Блок 1', kind: 'attestation', questionsCount: 40, timeLimit: 60, dateStart: '15.10.2026', dateEnd: '15.12.2026', status: 'new' },
  { id: 'a2', number: 202, title: 'Годовая аттестация. Блок 2', kind: 'attestation', questionsCount: 40, timeLimit: 60, dateStart: '15.10.2026', dateEnd: '15.12.2026', status: 'new' },
  { id: 'a3', number: 203, title: 'Аттестация на допуск', kind: 'attestation', questionsCount: 30, timeLimit: null, dateStart: '01.03.2026', dateEnd: '31.03.2026', status: 'passed', result: '28 из 30' },
  { id: 'a4', number: 204, title: 'Внеочередная аттестация', kind: 'attestation', questionsCount: 20, timeLimit: 30, dateStart: '01.06.2026', dateEnd: '30.06.2026', status: 'failed', result: '11 из 20' },
];

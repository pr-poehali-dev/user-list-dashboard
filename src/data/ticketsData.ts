export type TicketStatus = 'new' | 'in_progress' | 'passed' | 'failed';

export interface Ticket {
  id: string;
  number: number;
  title: string;
  questionsCount: number;
  timeLimit: number | null;
  dateStart: string;
  dateEnd: string;
  status: TicketStatus;
  result?: string;
}

export const tickets: Ticket[] = [
  { id: 't1', number: 101, title: 'Безопасность движения', questionsCount: 20, timeLimit: 30, dateStart: '01.10.2026', dateEnd: '31.10.2026', status: 'new' },
  { id: 't2', number: 102, title: 'Правила технической эксплуатации', questionsCount: 25, timeLimit: 40, dateStart: '01.10.2026', dateEnd: '31.10.2026', status: 'in_progress' },
  { id: 't3', number: 103, title: 'Охрана труда', questionsCount: 15, timeLimit: null, dateStart: '01.09.2026', dateEnd: '30.09.2026', status: 'passed', result: '14 из 15' },
  { id: 't4', number: 104, title: 'Сигнализация', questionsCount: 10, timeLimit: 15, dateStart: '01.09.2026', dateEnd: '30.09.2026', status: 'failed', result: '5 из 10' },
  { id: 't5', number: 105, title: 'Пожарная безопасность', questionsCount: 12, timeLimit: 20, dateStart: '01.11.2026', dateEnd: '30.11.2026', status: 'new' },
  { id: 't6', number: 106, title: 'Годовая аттестация. Блок 1', questionsCount: 40, timeLimit: 60, dateStart: '15.10.2026', dateEnd: '15.12.2026', status: 'new' },
  { id: 't7', number: 107, title: 'Годовая аттестация. Блок 2', questionsCount: 40, timeLimit: 60, dateStart: '15.10.2026', dateEnd: '15.12.2026', status: 'new' },
  { id: 't8', number: 108, title: 'Аттестация на допуск', questionsCount: 30, timeLimit: null, dateStart: '01.03.2026', dateEnd: '31.03.2026', status: 'passed', result: '28 из 30' },
];

import { users, User } from '@/data/mockData';
import { tickets } from '@/data/ticketsData';

export interface TestReport {
  id: string;
  userId: number;
  ticketNumber: number;
  ticketTitle: string;
  date: string;
  correct: number;
  total: number;
  durationMin: number;
  passed: boolean;
}

const PASS_PERCENT = 80;

const generateReports = (): TestReport[] => {
  const list: TestReport[] = [];
  users.forEach((u, idx) => {
    const count = 1 + (idx % 4);
    for (let k = 0; k < count; k++) {
      const t = tickets[(idx + k * 3) % tickets.length];
      const total = t.questionsCount;
      const miss = (idx * 7 + k * 5) % Math.max(2, Math.round(total * 0.4));
      const correct = Math.max(0, total - miss);
      const day = ((idx + k * 4) % 27) + 1;
      const month = ((idx + k * 2) % 10) + 1;
      list.push({
        id: `r${u.id}-${k}`,
        userId: u.id,
        ticketNumber: t.number,
        ticketTitle: t.title,
        date: `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.2026`,
        correct,
        total,
        durationMin: 5 + ((idx * 3 + k * 7) % Math.max(6, total)),
        passed: (correct / total) * 100 >= PASS_PERCENT,
      });
    }
  });
  return list;
};

export const reports = generateReports();

export const getReportsByUser = (userId: number) => reports.filter(r => r.userId === userId);

export const userById = (id: number): User | undefined => users.find(u => u.id === id);

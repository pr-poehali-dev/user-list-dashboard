import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Ticket, TicketStatus } from '@/data/ticketsData';

const statusMeta: Record<TicketStatus, { label: string; className: string }> = {
  new: { label: 'Не начат', className: 'bg-gray-100 text-gray-700' },
  in_progress: { label: 'В процессе', className: 'bg-amber-100 text-amber-700' },
  passed: { label: 'Сдан', className: 'bg-emerald-100 text-emerald-700' },
  failed: { label: 'Не сдан', className: 'bg-red-100 text-red-700' },
};

interface TicketsTableProps {
  title: string;
  tickets: Ticket[];
}

const TicketsTable = ({ title, tickets }: TicketsTableProps) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = useMemo(
    () =>
      tickets.filter(
        t =>
          (status === 'all' || t.status === status) &&
          (t.title.toLowerCase().includes(search.toLowerCase()) || String(t.number).includes(search))
      ),
    [tickets, search, status]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {title} <span className="text-sm font-normal text-gray-400">({filtered.length} из {tickets.length})</span>
        </h2>
      </div>

      <div className="p-6 border-b bg-gray-50 flex gap-4 items-end">
        <div className="flex-1 relative">
          <label className="block text-sm font-medium mb-2">Поиск</label>
          <Icon name="Search" size={16} className="absolute left-3 bottom-3 text-gray-400" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Название или номер билета..."
            className="pl-9"
          />
        </div>
        <div className="w-56">
          <label className="block text-sm font-medium mb-2">Статус</label>
          <Select value={status} onValueChange={v => { setStatus(v); setCurrentPage(1); }}>
            <SelectTrigger><SelectValue placeholder="Все статусы" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              {Object.entries(statusMeta).map(([key, meta]) => (
                <SelectItem key={key} value={key}>{meta.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>Название</TableHead>
            <TableHead>Вопросов</TableHead>
            <TableHead>Время</TableHead>
            <TableHead>Срок</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Результат</TableHead>
            <TableHead className="text-right">Действие</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-gray-400 py-10">Билеты не найдены</TableCell>
            </TableRow>
          ) : (
            pageItems.map(t => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.number}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.questionsCount}</TableCell>
                <TableCell>{t.timeLimit ? `${t.timeLimit} мин` : 'Без ограничений'}</TableCell>
                <TableCell className="whitespace-nowrap">{t.dateStart} — {t.dateEnd}</TableCell>
                <TableCell>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusMeta[t.status].className}`}>
                    {statusMeta[t.status].label}
                  </span>
                </TableCell>
                <TableCell>{t.result ?? '—'}</TableCell>
                <TableCell className="text-right">
                  {(t.status === 'new' || t.status === 'in_progress') && (
                    <Button size="sm" className="gap-1.5">
                      <Icon name="Play" size={14} />
                      {t.status === 'new' ? 'Начать' : 'Продолжить'}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          Показывать по
          <Select value={String(pageSize)} onValueChange={v => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="w-20 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[5, 10, 20].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setCurrentPage(page - 1)}>
            <Icon name="ChevronLeft" size={16} />
          </Button>
          <span className="text-sm text-gray-600">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setCurrentPage(page + 1)}>
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TicketsTable;

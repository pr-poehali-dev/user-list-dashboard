import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import ReportsTable from '@/components/ReportsTable';
import { reports, getReportsByUser, userById } from '@/data/reportsData';

const PAGE = 50;

const ReportsSection = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'passed' | 'failed'>('all');
  const [studentId, setStudentId] = useState<number | null>(null);
  const [limit, setLimit] = useState(PAGE);

  const student = studentId !== null ? userById(studentId) : undefined;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reports.filter(r => {
      if (status === 'passed' && !r.passed) return false;
      if (status === 'failed' && r.passed) return false;
      if (!q) return true;
      const u = userById(r.userId);
      const hay = `${u?.surname} ${u?.name} ${u?.patronymic} ${r.userId} ${r.ticketTitle} ${u?.group}`.toLowerCase();
      return hay.includes(q);
    });
  }, [search, status]);

  if (student) {
    const list = getReportsByUser(student.id);
    const passedCount = list.filter(r => r.passed).length;
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => setStudentId(null)}>
            <Icon name="ArrowLeft" size={16} />
            Все отчёты
          </Button>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
          <h2 className="text-lg font-semibold">{student.surname} {student.name} {student.patronymic}</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Группа: {student.group} · Табельный № {student.id} · Пройдено тестов: {list.length}, сдано: {passedCount}
        </p>
        <ReportsTable items={list} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-semibold mb-4">Отчёты по тестам</h2>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={e => { setSearch(e.target.value); setLimit(PAGE); }}
            placeholder="Поиск по ФИО, табельному номеру, группе или тесту"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {([['all', 'Все'], ['passed', 'Сдан'], ['failed', 'Не сдан']] as const).map(([id, name]) => (
            <Button
              key={id}
              size="sm"
              variant={status === id ? 'default' : 'outline'}
              onClick={() => { setStatus(id); setLimit(PAGE); }}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-2">Найдено: {filtered.length}</p>
      <ReportsTable items={filtered.slice(0, limit)} showStudent onStudentClick={setStudentId} />
      {limit < filtered.length && (
        <div className="text-center mt-4">
          <Button variant="outline" onClick={() => setLimit(l => l + PAGE)}>Показать ещё</Button>
        </div>
      )}
    </div>
  );
};

export default ReportsSection;

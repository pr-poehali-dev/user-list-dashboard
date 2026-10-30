import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { TestReport, userById } from '@/data/reportsData';

interface ReportsTableProps {
  items: TestReport[];
  showStudent?: boolean;
  onStudentClick?: (userId: number) => void;
}

const ReportsTable = ({ items, showStudent = false, onStudentClick }: ReportsTableProps) => {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">Пройденных тестов нет</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 text-left text-xs text-gray-500">
            {showStudent && <th className="px-3 py-2 font-medium">Ученик</th>}
            <th className="px-3 py-2 font-medium">Тест</th>
            <th className="px-3 py-2 font-medium">Дата</th>
            <th className="px-3 py-2 font-medium">Результат</th>
            <th className="px-3 py-2 font-medium">Время</th>
            <th className="px-3 py-2 font-medium">Итог</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map(r => {
            const u = showStudent ? userById(r.userId) : undefined;
            return (
              <tr key={r.id} className="border-b hover:bg-gray-50">
                {showStudent && (
                  <td className="px-3 py-2.5">
                    <button
                      onClick={() => onStudentClick?.(r.userId)}
                      className="text-left font-medium text-blue-700 hover:underline"
                    >
                      {u ? `${u.surname} ${u.name} ${u.patronymic}` : r.userId}
                    </button>
                    <p className="text-xs text-gray-500">{u?.group}</p>
                  </td>
                )}
                <td className="px-3 py-2.5">
                  <p className="font-medium text-gray-900">{r.ticketTitle}</p>
                  <p className="text-xs text-gray-500">Билет № {r.ticketNumber}</p>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-gray-700">{r.date}</td>
                <td className="px-3 py-2.5 whitespace-nowrap text-gray-900">
                  {r.correct} из {r.total}
                  <span className="text-xs text-gray-500 ml-1">({Math.round((r.correct / r.total) * 100)}%)</span>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap text-gray-700">{r.durationMin} мин</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.passed ? 'Сдан' : 'Не сдан'}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Button variant="outline" size="sm">
                    <Icon name="FileText" size={14} />
                    Подробнее
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;

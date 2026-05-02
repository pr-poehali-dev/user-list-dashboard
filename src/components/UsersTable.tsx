import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки',
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];
const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];

interface UsersTableProps {
  users: User[];
  search: string;
  onSelectUser: (user: User) => void;
}

const UsersTable = ({ users, search, onSelectUser }: UsersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfigs, setSortConfigs] = useState<Array<{ key: string; direction: 'asc' | 'desc' }>>([]);
  const [filters, setFilters] = useState<{ group: string; direction: string; specialty: string }>({
    group: '',
    direction: '',
    specialty: '',
  });
  const [hideSortHint, setHideSortHint] = useState(false);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.surname.toLowerCase().includes(search.toLowerCase()) ||
      user.patronymic.toLowerCase().includes(search.toLowerCase())
    );

    if (filters.group) filtered = filtered.filter(user => user.group === filters.group);
    if (filters.direction) filtered = filtered.filter(user => user.direction === filters.direction);
    if (filters.specialty) filtered = filtered.filter(user => user.specialty === filters.specialty);

    if (sortConfigs.length > 0) {
      filtered.sort((a, b) => {
        for (const config of sortConfigs) {
          const aValue = a[config.key as keyof typeof a];
          const bValue = b[config.key as keyof typeof b];
          let comparison = 0;
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue, 'ru');
          } else if (aValue < bValue) {
            comparison = -1;
          } else if (aValue > bValue) {
            comparison = 1;
          }
          if (comparison !== 0) {
            return config.direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [search, sortConfigs, filters, users]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const handleSort = (key: string, shiftKey: boolean = false) => {
    setSortConfigs(prev => {
      if (!shiftKey) {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') return [{ key, direction: 'desc' }];
          return [];
        }
        return [{ key, direction: 'asc' }];
      } else {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') return prev.map(s => s.key === key ? { ...s, direction: 'desc' as const } : s);
          return prev.filter(s => s.key !== key);
        }
        return [...prev, { key, direction: 'asc' as const }];
      }
    });
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    const sortIndex = sortConfigs.findIndex(s => s.key === column);
    if (sortIndex === -1) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    const config = sortConfigs[sortIndex];
    const priority = sortConfigs.length > 1 ? sortIndex + 1 : null;
    return (
      <div className="flex items-center gap-1">
        {config.direction === 'asc'
          ? <Icon name="ArrowUp" size={14} className="text-blue-600" />
          : <Icon name="ArrowDown" size={14} className="text-blue-600" />}
        {priority && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
            {priority}
          </span>
        )}
      </div>
    );
  };

  const handleResetFilters = () => {
    setFilters({ group: '', direction: '', specialty: '' });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.group || filters.direction || filters.specialty;

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Пользователи <span className="text-sm font-normal text-gray-400">({filteredAndSortedUsers.length} из {users.length})</span>
        </h2>
        <Button className="flex items-center gap-2">
          <Icon name="Plus" size={16} />
          Добавить пользователя
        </Button>
      </div>

      <div className="p-6 border-b bg-gray-50">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Группа</label>
            <Select value={filters.group || 'all'} onValueChange={(value) => {
              setFilters(prev => ({ ...prev, group: value === 'all' ? '' : value }));
              setCurrentPage(1);
            }}>
              <SelectTrigger><SelectValue placeholder="Все группы" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все группы</SelectItem>
                {groups.map(group => <SelectItem key={group} value={group}>{group}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Дирекция</label>
            <Select value={filters.direction || 'all'} onValueChange={(value) => {
              setFilters(prev => ({ ...prev, direction: value === 'all' ? '' : value }));
              setCurrentPage(1);
            }}>
              <SelectTrigger><SelectValue placeholder="Все дирекции" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все дирекции</SelectItem>
                {directions.map(dir => <SelectItem key={dir} value={dir}>{dir}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Специальность</label>
            <Select value={filters.specialty || 'all'} onValueChange={(value) => {
              setFilters(prev => ({ ...prev, specialty: value === 'all' ? '' : value }));
              setCurrentPage(1);
            }}>
              <SelectTrigger><SelectValue placeholder="Все специальности" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все специальности</SelectItem>
                {specialties.map(spec => <SelectItem key={spec} value={spec}>{spec}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" onClick={handleResetFilters} className="flex items-center gap-2">
              <Icon name="X" size={16} />
              Сбросить
            </Button>
          )}
        </div>
      </div>

      {!hideSortHint && sortConfigs.length === 0 && (
        <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <Icon name="Info" size={16} />
            <span>Нажмите на заголовок столбца для сортировки. Удерживайте Shift для множественной сортировки.</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setHideSortHint(true)} className="text-blue-700 hover:text-blue-800">
            <Icon name="X" size={16} />
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('id', e.shiftKey)}>
              <div className="flex items-center justify-between">Табельный номер{getSortIcon('id')}</div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('surname', e.shiftKey)}>
              <div className="flex items-center justify-between">ФИО{getSortIcon('surname')}</div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('group', e.shiftKey)}>
              <div className="flex items-center justify-between">Группа{getSortIcon('group')}</div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('direction', e.shiftKey)}>
              <div className="flex items-center justify-between">Направление{getSortIcon('direction')}</div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('specialty', e.shiftKey)}>
              <div className="flex items-center justify-between">Специальность{getSortIcon('specialty')}</div>
            </TableHead>
            <TableHead className="cursor-pointer hover:bg-gray-50 select-none group" onClick={(e) => handleSort('birthDate', e.shiftKey)}>
              <div className="flex items-center justify-between">Дата рождения{getSortIcon('birthDate')}</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12 text-gray-400">
                {users.length === 0 ? 'Нет пользователей в системе' : 'Нет результатов по заданным фильтрам'}
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((user) => (
              <TableRow
                key={user.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSelectUser(user)}
              >
                <TableCell className="font-mono text-sm">{user.id}</TableCell>
                <TableCell className="font-medium">{user.surname} {user.name} {user.patronymic}</TableCell>
                <TableCell>{user.group}</TableCell>
                <TableCell>{user.direction}</TableCell>
                <TableCell>{user.specialty}</TableCell>
                <TableCell>{user.birthDate}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Показать:</span>
          <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">
            Показано {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredAndSortedUsers.length)} из {filteredAndSortedUsers.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            <Icon name="ChevronsLeft" size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            <Icon name="ChevronLeft" size={16} />
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="min-w-[36px]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            <Icon name="ChevronRight" size={16} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
            <Icon name="ChevronsRight" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;

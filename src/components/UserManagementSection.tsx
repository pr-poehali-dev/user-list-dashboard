import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

// Данные для групп и должностей
const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];

const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];

interface UserManagementSectionProps {
  users: User[];
  search: string;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  isEditGroupModalOpen: boolean;
  setIsEditGroupModalOpen: (open: boolean) => void;
  isDeleteGroupModalOpen: boolean;
  setIsDeleteGroupModalOpen: (open: boolean) => void;
  editGroupName: string;
  setEditGroupName: (name: string) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const UserManagementSection = ({
  users,
  search,
  selectedGroup,
  setSelectedGroup,
  isEditGroupModalOpen,
  setIsEditGroupModalOpen,
  isDeleteGroupModalOpen,
  setIsDeleteGroupModalOpen,
  editGroupName,
  setEditGroupName,
  selectedUser,
  setSelectedUser,
  isAuthModalOpen,
  setIsAuthModalOpen
}: UserManagementSectionProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editPreviewMode, setEditPreviewMode] = useState(false);

  useEffect(() => {
    if (editingUser) setEditPreviewMode(false);
  }, [editingUser]);

  const handleOpenEdit = () => {
    if (!selectedUser) return;
    setEditingUser({ ...selectedUser });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortConfigs, setSortConfigs] = useState<Array<{ key: string; direction: 'asc' | 'desc' }>>([]);
  const [filters, setFilters] = useState<{
    group: string;
    direction: string;
    specialty: string;
  }>({
    group: '',
    direction: '',
    specialty: ''
  });
  const [hideSortHint, setHideSortHint] = useState(false);

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.surname.toLowerCase().includes(search.toLowerCase()) ||
      user.patronymic.toLowerCase().includes(search.toLowerCase())
    );

    if (filters.group) {
      filtered = filtered.filter(user => user.group === filters.group);
    }
    if (filters.direction) {
      filtered = filtered.filter(user => user.direction === filters.direction);
    }
    if (filters.specialty) {
      filtered = filtered.filter(user => user.specialty === filters.specialty);
    }

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
    const endIndex = startIndex + pageSize;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const handleSort = (key: string, shiftKey: boolean = false) => {
    setSortConfigs(prev => {
      if (!shiftKey) {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') {
            return [{ key, direction: 'desc' }];
          } else {
            return [];
          }
        }
        return [{ key, direction: 'asc' }];
      } else {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') {
            return prev.map(s => s.key === key ? { ...s, direction: 'desc' as const } : s);
          } else {
            return prev.filter(s => s.key !== key);
          }
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
    setFilters({
      group: '',
      direction: '',
      specialty: ''
    });
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.group || filters.direction || filters.specialty;

  // User detail view
  if (selectedUser) {
    return (
      <>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
              <Icon name="ArrowLeft" size={16} />
              Назад к списку
            </Button>
            <Icon name="ChevronRight" size={16} className="text-gray-400" />
            <h2 className="text-xl font-semibold">{selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}</h2>
          </div>

          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={28} className="text-white" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}</p>
              <p className="text-sm text-gray-500">Табельный № {selectedUser.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'Фамилия', value: selectedUser.surname },
              { label: 'Имя', value: selectedUser.name },
              { label: 'Отчество', value: selectedUser.patronymic },
              { label: 'Дирекция', value: selectedUser.direction },
              { label: 'Табельный номер', value: selectedUser.id },
              { label: 'Основная должность', value: selectedUser.specialty },
              { label: 'Диспетчер по грузовой работе', value: selectedUser.isDispatcher ? 'Да' : 'Нет' },
              { label: 'Группа', value: selectedUser.group },
              { label: 'Создан', value: selectedUser.createdAt },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-gray-900">{String(value)}</p>
              </div>
            ))}
            <div className="bg-gray-50 rounded-lg px-4 py-3 col-span-2">
              <p className="text-xs text-gray-500 mb-1">Совмещаемые должности</p>
              {selectedUser.combinedSpecialty.length === 0
                ? <p className="text-sm font-semibold text-gray-400">Не указаны</p>
                : <div className="flex flex-wrap gap-1.5">
                    {selectedUser.combinedSpecialty.map((cs, i) => (
                      <span key={i} className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">{cs}</span>
                    ))}
                  </div>
              }
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleOpenEdit} className="flex items-center gap-2">
              <Icon name="Pencil" size={16} />
              Изменить
            </Button>
            <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
              <Icon name="Trash2" size={16} />
              Удалить
            </Button>
          </div>
        </div>

        {/* Edit User Modal */}
        <Dialog.Root open={isEditModalOpen} onOpenChange={(open) => { if (!open) { setIsEditModalOpen(false); setEditingUser(null); } }}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <Dialog.Title className="text-xl font-bold text-gray-900">Редактирование пользователя</Dialog.Title>
                <div className="flex gap-2">
                  <Button variant={!editPreviewMode ? 'default' : 'outline'} size="sm" onClick={() => setEditPreviewMode(false)}>Редактирование</Button>
                  <Button variant={editPreviewMode ? 'default' : 'outline'} size="sm" onClick={() => setEditPreviewMode(true)}>Предпросмотр</Button>
                </div>
              </div>

              {editingUser && !editPreviewMode && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Фамилия</label>
                      <input value={editingUser.surname} onChange={(e) => setEditingUser({ ...editingUser, surname: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Имя</label>
                      <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Отчество</label>
                    <input value={editingUser.patronymic} onChange={(e) => setEditingUser({ ...editingUser, patronymic: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Табельный номер</label>
                      <input value={editingUser.id} disabled className="w-full border-2 border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-400 font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Дирекция</label>
                      <select value={editingUser.direction} onChange={(e) => setEditingUser({ ...editingUser, direction: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                        {directions.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Основная должность</label>
                      <select value={editingUser.specialty} onChange={(e) => setEditingUser({ ...editingUser, specialty: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Совмещаемые должности</label>
                    <div className="space-y-2">
                      {editingUser.combinedSpecialty.map((cs, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <select
                            value={cs}
                            onChange={(e) => {
                              const updated = [...editingUser.combinedSpecialty];
                              updated[idx] = e.target.value;
                              setEditingUser({ ...editingUser, combinedSpecialty: updated });
                            }}
                            className="flex-1 border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm"
                          >
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingUser({ ...editingUser, combinedSpecialty: editingUser.combinedSpecialty.filter((_, i) => i !== idx) })}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 px-2"
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUser({ ...editingUser, combinedSpecialty: [...editingUser.combinedSpecialty, specialties[0]] })}
                        className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        <Icon name="Plus" size={14} />
                        Добавить должность
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Группа</label>
                      <select value={editingUser.group} onChange={(e) => setEditingUser({ ...editingUser, group: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                        {groups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Диспетчер по грузовой работе</label>
                      <div className="flex items-center h-[42px]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={editingUser.isDispatcher} onChange={(e) => setEditingUser({ ...editingUser, isDispatcher: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                          <span className="text-sm text-gray-700">{editingUser.isDispatcher ? 'Да' : 'Нет'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editingUser && editPreviewMode && (
                <div className="space-y-0 border rounded-lg overflow-hidden">
                  {[
                    { label: 'Фамилия', value: editingUser.surname },
                    { label: 'Имя', value: editingUser.name },
                    { label: 'Отчество', value: editingUser.patronymic },
                    { label: 'Дирекция', value: editingUser.direction },
                    { label: 'Табельный номер', value: editingUser.id },
                    { label: 'Основная должность', value: editingUser.specialty },
                    { label: 'Диспетчер по грузовой работе', value: editingUser.isDispatcher ? 'Да' : 'Нет' },
                    { label: 'Группа', value: editingUser.group },
                    { label: 'Создан', value: editingUser.createdAt },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3 border-b odd:bg-gray-50">
                      <span className="text-sm text-gray-500">{label}</span>
                      <span className="text-sm font-medium text-gray-900">{String(value)}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-3 border-b odd:bg-gray-50">
                    <span className="text-sm text-gray-500">Совмещаемые должности</span>
                    {editingUser.combinedSpecialty.length === 0
                      ? <span className="text-sm font-medium text-gray-400">Не указаны</span>
                      : <div className="flex flex-wrap gap-1 justify-end">
                          {editingUser.combinedSpecialty.map((cs, i) => (
                            <span key={i} className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">{cs}</span>
                          ))}
                        </div>
                    }
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }} className="flex items-center gap-1.5">
                  <Icon name="ArrowLeft" size={14} />
                  Назад
                </Button>
                <div className="flex-1" />
                <Button onClick={handleSaveEdit} className="flex items-center gap-1.5">
                  <Icon name="Save" size={14} />
                  Сохранить
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  }

  // Group view logic
  if (selectedGroup) {
    const groupUsers = users.filter(user => user.group === selectedGroup);
    
    return (
      <>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedGroup(null)}
              >
                <Icon name="ArrowLeft" size={16} />
                Назад к группам
              </Button>
              <Icon name="ChevronRight" size={16} className="text-gray-400" />
              <h2 className="text-xl font-semibold">{selectedGroup}</h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditGroupName(selectedGroup || '');
                  setIsEditGroupModalOpen(true);
                }}
              >
                <Icon name="Edit" size={16} />
                Редактировать
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-600 hover:text-red-700"
                onClick={() => setIsDeleteGroupModalOpen(true)}
              >
                <Icon name="Trash2" size={16} />
                Удалить
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Специальность</TableHead>
                  <TableHead>Дата рождения</TableHead>
                  <TableHead>Дирекция</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.surname} {user.name} {user.patronymic}
                    </TableCell>
                    <TableCell>{user.specialty}</TableCell>
                    <TableCell>{user.birthDate}</TableCell>
                    <TableCell>{user.direction}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Пользователей в группе: {groupUsers.length}
          </div>
        </div>

        {/* Edit Group Modal */}
        <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Редактировать группу
              </Dialog.Title>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Название группы</label>
                  <Input
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="Введите название группы"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsEditGroupModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button onClick={() => {
                    setIsEditGroupModalOpen(false);
                  }}>
                    Сохранить
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Delete Group Modal */}
        <Dialog.Root open={isDeleteGroupModalOpen} onOpenChange={setIsDeleteGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
              <Dialog.Title className="text-xl font-semibold mb-4 text-red-600">
                Удалить группу
              </Dialog.Title>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Вы уверены, что хотите удалить группу "{selectedGroup}"?
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsDeleteGroupModalOpen(false)}>
                    Отмена
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => {
                      setIsDeleteGroupModalOpen(false);
                      setSelectedGroup(null);
                    }}
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </>
    );
  }

  // Users table view
  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Пользователи <span className="text-sm font-normal text-gray-400">({filteredAndSortedUsers.length} из {users.length})</span></h2>
          <Button className="flex items-center gap-2">
            <Icon name="Plus" size={16} />
            Добавить пользователя
          </Button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Группа</label>
              <Select value={filters.group || 'all'} onValueChange={(value) => {
                setFilters(prev => ({ ...prev, group: value === 'all' ? '' : value }));
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Все группы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все группы</SelectItem>
                  {groups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Дирекция</label>
              <Select value={filters.direction || 'all'} onValueChange={(value) => {
                setFilters(prev => ({ ...prev, direction: value === 'all' ? '' : value }));
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Все дирекции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все дирекции</SelectItem>
                  {directions.map(dir => (
                    <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Специальность</label>
              <Select value={filters.specialty || 'all'} onValueChange={(value) => {
                setFilters(prev => ({ ...prev, specialty: value === 'all' ? '' : value }));
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Все специальности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все специальности</SelectItem>
                  {specialties.map(spec => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                onClick={handleResetFilters}
                className="flex items-center gap-2"
              >
                <Icon name="X" size={16} />
                Сбросить
              </Button>
            )}
          </div>
        </div>

        {/* Sort hint */}
        {!hideSortHint && sortConfigs.length === 0 && (
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <Icon name="Info" size={16} />
              <span>Нажмите на заголовок столбца для сортировки. Удерживайте Shift для множественной сортировки.</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setHideSortHint(true)}
              className="text-blue-700 hover:text-blue-800"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('id', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  Табельный номер
                  {getSortIcon('id')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('surname', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  ФИО
                  {getSortIcon('surname')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('group', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  Группа
                  {getSortIcon('group')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('direction', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  Направление
                  {getSortIcon('direction')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('specialty', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  Специальность
                  {getSortIcon('specialty')}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50 select-none group"
                onClick={(e) => handleSort('birthDate', e.shiftKey)}
              >
                <div className="flex items-center justify-between">
                  Дата рождения
                  {getSortIcon('birthDate')}
                </div>
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
                  onClick={() => setSelectedUser(user)}
                >
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell className="font-medium">
                    {user.surname} {user.name} {user.patronymic}
                  </TableCell>
                  <TableCell>{user.group}</TableCell>
                  <TableCell>{user.direction}</TableCell>
                  <TableCell>{user.specialty}</TableCell>
                  <TableCell>{user.birthDate}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Показать:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              <Icon name="ChevronsLeft" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
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
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    className="min-w-[36px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronRight" size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <Icon name="ChevronsRight" size={16} />
            </Button>
          </div>
        </div>
      </div>

    </>
  );
};

export default UserManagementSection;
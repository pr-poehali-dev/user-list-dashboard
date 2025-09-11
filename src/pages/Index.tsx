import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';

// Генерируем 1000 пользователей
const generateUsers = () => {
  const names = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Игорь', 'Анна', 'Павел', 'Ольга', 'Сергей', 'Татьяна', 'Андрей', 'Наталья', 'Владимир', 'Светлана', 'Михаил', 'Юлия', 'Максим', 'Екатерина', 'Роман', 'Ирина', 'Виктор', 'Любовь', 'Александр', 'Галина', 'Олег', 'Вера', 'Денис', 'Людмила', 'Артем', 'Надежда'];
  const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Соколов', 'Новикова', 'Белов', 'Орлова', 'Лебедев', 'Медведева', 'Макаров', 'Зайцева', 'Попов', 'Васильева', 'Федоров', 'Алексеева', 'Николаев', 'Григорьева', 'Степанов', 'Романова', 'Семенов', 'Кузнецова', 'Захаров', 'Данилова', 'Жуков', 'Фролова', 'Костин', 'Тихонова'];
  const patronymics = ['Петрович', 'Сергеевна', 'Александрович', 'Викторовна', 'Олегович', 'Дмитриевна', 'Андреевич', 'Михайловна', 'Владимирович', 'Игоревна', 'Сергеевич', 'Алексеевна', 'Николаевич', 'Петровна', 'Дмитриевич', 'Владимировна', 'Андреевич', 'Сергеевна', 'Олегович', 'Михайловна', 'Александрович', 'Викторовна', 'Игоревич', 'Павловна', 'Владиславович', 'Анатольевна', 'Максимович', 'Геннадьевна', 'Романович', 'Евгеньевна'];
  const groups = ['Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 'Молния', 'Орлы', 'Тигры', 'Драконы'];
  const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
  const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];
  
  const users = [];
  for (let i = 1; i <= 1000; i++) {
    const birthYear = 1970 + (i % 35); // возраст от 35 до 55 лет
    const birthMonth = (i % 12) + 1;
    const birthDay = (i % 28) + 1;
    
    users.push({
      id: 10000000 + i,
      name: names[i % names.length],
      surname: surnames[i % surnames.length],
      patronymic: patronymics[i % patronymics.length],
      group: groups[i % groups.length],
      direction: directions[i % directions.length],
      specialty: specialties[i % specialties.length],
      birthDate: `${birthDay.toString().padStart(2, '0')}.${birthMonth.toString().padStart(2, '0')}.${birthYear}`
    });
  }
  return users;
};

const users = generateUsers();

type User = {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  group: string;
  direction: string;
  specialty: string;
  birthDate: string;
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Подключение к серверу...');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.surname.toLowerCase().includes(search.toLowerCase()) ||
      user.patronymic.toLowerCase().includes(search.toLowerCase())
    );

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue, 'ru');
          return sortConfig.direction === 'asc' ? comparison : -comparison;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [search, sortConfig]);

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

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    if (!sortConfig || sortConfig.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortConfig.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-blue-600" />
      : <Icon name="ArrowDown" size={14} className="text-blue-600" />;
  };

  useEffect(() => {
    const loadingMessages = [
      'Подключение к серверу...',
      'Загрузка данных пользователей...',
      'Настройка интерфейса...',
      'Почти готово...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 800);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(messageInterval);
    }, 3200);
    
    return () => {
      clearTimeout(loadingTimer);
      clearInterval(messageInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-6">
              {/* Основное кольцо загрузки */}
              <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Внутренние точки */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Система пользователей</h2>
            <p className="text-gray-600 mb-4">{loadingText}</p>
            
            {/* Прогресс бар */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            
            {/* Дополнительная информация */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Icon name="Wifi" size={16} className="animate-pulse" />
              <span>Установка соединения</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="relative max-w-md">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Поиск пользователей..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsTeacherModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon name="GraduationCap" size={16} />
              Преподаватель
            </Button>
            
            <Button 
              onClick={() => setIsAdmin(!isAdmin)}
              variant={isAdmin ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Icon name="Shield" size={16} />
              {isAdmin ? 'Режим администратора' : 'Администратор'}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead 
                  className="w-20 font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {getSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-2">
                    Имя
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('surname')}
                >
                  <div className="flex items-center gap-2">
                    Фамилия
                    {getSortIcon('surname')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={() => handleSort('patronymic')}
                >
                  <div className="flex items-center gap-2">
                    Отчество
                    {getSortIcon('patronymic')}
                  </div>
                </TableHead>
                {isAdmin && <TableHead className="font-semibold">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-gray-50 cursor-pointer" 
                    onClick={() => {
                      setSelectedUser(user);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    <TableCell className="font-mono text-gray-600">#{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium">{user.surname}</TableCell>
                    <TableCell>{user.patronymic}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Icon name="MoreHorizontal" size={16} />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-gray-500">
                    <Icon name="Users" size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Пользователи не найдены</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Всего: {users.length} | Найдено: {filteredAndSortedUsers.length}
              {sortConfig && (
                <span className="ml-2 text-blue-600">
                  • Сортировка: {sortConfig.key === 'id' ? 'ID' : sortConfig.key === 'name' ? 'Имя' : sortConfig.key === 'surname' ? 'Фамилия' : 'Отчество'} 
                  ({sortConfig.direction === 'asc' ? '↑' : '↓'})
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Строк на странице:</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const showEllipsis = totalPages > 7;
                  
                  if (!showEllipsis) {
                    // Показываем все страницы если их мало
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={i === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i}
                        </Button>
                      );
                    }
                  } else {
                    // Умная пагинация с эллипсами
                    // Всегда показываем первую страницу
                    pages.push(
                      <Button
                        key={1}
                        variant={1 === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                    );
                    
                    // Левый эллипсис если нужен
                    if (currentPage > 4) {
                      pages.push(<span key="ellipsis-left" className="px-2 text-gray-400">...</span>);
                    }
                    
                    // Страницы вокруг текущей
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = startPage; i <= endPage; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                    }
                    
                    // Правый эллипсис если нужен
                    if (currentPage < totalPages - 3) {
                      pages.push(<span key="ellipsis-right" className="px-2 text-gray-400">...</span>);
                    }
                    
                    // Всегда показываем последнюю страницу
                    if (totalPages > 1) {
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={totalPages === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                  }
                  
                  return pages;
                })()}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Icon name="ShieldCheck" size={16} />
              <span className="font-medium">Режим администратора активен</span>
            </div>
          </div>
        )}

        {/* Модальное окно авторизации */}
        <Dialog.Root open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-white" />
                </div>
                Подтверждение авторизации
              </Dialog.Title>
              
              {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ФИО</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Дата рождения</label>
                      <p className="text-gray-900">{selectedUser.birthDate}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Дирекция</label>
                      <p className="text-gray-900">{selectedUser.direction}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Табельный номер</label>
                      <p className="font-mono text-gray-900">#{selectedUser.id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Специальность</label>
                      <p className="text-gray-900">{selectedUser.specialty}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Группа</label>
                      <p className="text-gray-900">{selectedUser.group}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        // Здесь будет логика авторизации
                        alert(`Пользователь ${selectedUser.surname} ${selectedUser.name} авторизован`);
                        setIsAuthModalOpen(false);
                      }}
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Авторизироваться
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsAuthModalOpen(false)}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отменить
                    </Button>
                  </div>
                </div>
              )}
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Модальное окно авторизации преподавателя */}
        <Dialog.Root open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-white" />
                </div>
                Авторизация преподавателя
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Пароль доступа
                  </label>
                  <Input
                    type="password"
                    placeholder="Введите пароль"
                    value={teacherPassword}
                    onChange={(e) => setTeacherPassword(e.target.value)}
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Авторизация по Enter
                        alert('Преподаватель авторизован');
                        setIsTeacherModalOpen(false);
                        setTeacherPassword('');
                      }
                    }}
                  />
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      // Здесь будет логика авторизации преподавателя
                      alert('Преподаватель авторизован');
                      setIsTeacherModalOpen(false);
                      setTeacherPassword('');
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Авторизоваться
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      setTeacherPassword('');
                    }}
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                </div>
              </div>
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Index;
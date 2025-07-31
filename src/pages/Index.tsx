import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

// Генерируем 1000 пользователей
const generateUsers = () => {
  const names = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Игорь', 'Анна', 'Павел', 'Ольга', 'Сергей', 'Татьяна', 'Андрей', 'Наталья', 'Владимир', 'Светлана', 'Михаил', 'Юлия', 'Максим', 'Екатерина', 'Роман', 'Ирина', 'Виктор', 'Любовь', 'Александр', 'Галина', 'Олег', 'Вера', 'Денис', 'Людмила', 'Артем', 'Надежда'];
  const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Соколов', 'Новикова', 'Белов', 'Орлова', 'Лебедев', 'Медведева', 'Макаров', 'Зайцева', 'Попов', 'Васильева', 'Федоров', 'Алексеева', 'Николаев', 'Григорьева', 'Степанов', 'Романова', 'Семенов', 'Кузнецова', 'Захаров', 'Данилова', 'Жуков', 'Фролова', 'Костин', 'Тихонова'];
  const patronymics = ['Петрович', 'Сергеевна', 'Александрович', 'Викторовна', 'Олегович', 'Дмитриевна', 'Андреевич', 'Михайловна', 'Владимирович', 'Игоревна', 'Сергеевич', 'Алексеевна', 'Николаевич', 'Петровна', 'Дмитриевич', 'Владимировна', 'Андреевич', 'Сергеевна', 'Олегович', 'Михайловна', 'Александрович', 'Викторовна', 'Игоревич', 'Павловна', 'Владиславович', 'Анатольевна', 'Максимович', 'Геннадьевна', 'Романович', 'Евгеньевна'];
  
  const users = [];
  for (let i = 1; i <= 1000; i++) {
    users.push({
      id: i,
      name: names[i % names.length],
      surname: surnames[i % surnames.length],
      patronymic: patronymics[i % patronymics.length]
    });
  }
  return users;
};

const users = generateUsers();

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Подключение к серверу...');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.surname.toLowerCase().includes(search.toLowerCase()) ||
    user.patronymic.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
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
          
          <Button 
            onClick={() => setIsAdmin(!isAdmin)}
            variant={isAdmin ? "default" : "outline"}
            className="flex items-center gap-2"
          >
            <Icon name="Shield" size={16} />
            {isAdmin ? 'Режим администратора' : 'Администратор'}
          </Button>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-20 font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Имя</TableHead>
                <TableHead className="font-semibold">Фамилия</TableHead>
                <TableHead className="font-semibold">Отчество</TableHead>
                {isAdmin && <TableHead className="font-semibold">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
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
              Всего: {users.length} | Найдено: {filteredUsers.length}
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
      </div>
    </div>
  );
};

export default Index;
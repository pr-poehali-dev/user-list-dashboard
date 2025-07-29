import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

const users = [
  { id: 1, name: 'Алексей', surname: 'Иванов', patronymic: 'Петрович' },
  { id: 2, name: 'Мария', surname: 'Петрова', patronymic: 'Сергеевна' },
  { id: 3, name: 'Дмитрий', surname: 'Сидоров', patronymic: 'Александрович' },
  { id: 4, name: 'Елена', surname: 'Козлова', patronymic: 'Викторовна' },
  { id: 5, name: 'Игорь', surname: 'Морозов', patronymic: 'Олегович' },
  { id: 6, name: 'Анна', surname: 'Волкова', patronymic: 'Дмитриевна' },
  { id: 7, name: 'Павел', surname: 'Соколов', patronymic: 'Андреевич' },
  { id: 8, name: 'Ольга', surname: 'Новикова', patronymic: 'Михайловна' },
  { id: 9, name: 'Сергей', surname: 'Белов', patronymic: 'Владимирович' },
  { id: 10, name: 'Татьяна', surname: 'Орлова', patronymic: 'Игоревна' },
  { id: 11, name: 'Андрей', surname: 'Лебедев', patronymic: 'Сергеевич' },
  { id: 12, name: 'Наталья', surname: 'Медведева', patronymic: 'Алексеевна' },
  { id: 13, name: 'Владимир', surname: 'Макаров', patronymic: 'Николаевич' },
  { id: 14, name: 'Светлана', surname: 'Зайцева', patronymic: 'Петровна' },
  { id: 15, name: 'Михаил', surname: 'Попов', patronymic: 'Дмитриевич' },
  { id: 16, name: 'Юлия', surname: 'Васильева', patronymic: 'Владимировна' },
  { id: 17, name: 'Максим', surname: 'Федоров', patronymic: 'Андреевич' },
  { id: 18, name: 'Екатерина', surname: 'Алексеева', patronymic: 'Сергеевна' },
  { id: 19, name: 'Роман', surname: 'Николаев', patronymic: 'Олегович' },
  { id: 20, name: 'Ирина', surname: 'Григорьева', patronymic: 'Михайловна' },
  { id: 21, name: 'Виктор', surname: 'Степанов', patronymic: 'Александрович' },
  { id: 22, name: 'Любовь', surname: 'Романова', patronymic: 'Викторовна' },
  { id: 23, name: 'Александр', surname: 'Семенов', patronymic: 'Игоревич' },
  { id: 24, name: 'Галина', surname: 'Кузнецова', patronymic: 'Павловна' },
  { id: 25, name: 'Олег', surname: 'Захаров', patronymic: 'Владиславович' },
  { id: 26, name: 'Вера', surname: 'Данилова', patronymic: 'Анатольевна' },
  { id: 27, name: 'Денис', surname: 'Жуков', patronymic: 'Максимович' },
  { id: 28, name: 'Людмила', surname: 'Фролова', patronymic: 'Геннадьевна' },
  { id: 29, name: 'Артем', surname: 'Костин', patronymic: 'Романович' },
  { id: 30, name: 'Надежда', surname: 'Тихонова', patronymic: 'Евгеньевна' },
];

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
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
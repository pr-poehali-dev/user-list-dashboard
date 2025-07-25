import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
];

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.surname.toLowerCase().includes(search.toLowerCase()) ||
    user.patronymic.toLowerCase().includes(search.toLowerCase())
  );

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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
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
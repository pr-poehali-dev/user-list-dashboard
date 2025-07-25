import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const users = [
  { id: 1, name: 'Алексей', surname: 'Иванов', patronymic: 'Петрович' },
  { id: 2, name: 'Мария', surname: 'Петрова', patronymic: 'Сергеевна' },
  { id: 3, name: 'Дмитрий', surname: 'Сидоров', patronymic: 'Александрович' },
  { id: 4, name: 'Елена', surname: 'Козлова', patronymic: 'Викторовна' },
  { id: 5, name: 'Игорь', surname: 'Морозов', patronymic: 'Олегович' },
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
          <Input 
            placeholder="Поиск пользователей..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          
          <Button 
            onClick={() => setIsAdmin(!isAdmin)}
            variant={isAdmin ? "default" : "outline"}
          >
            Администратор
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">ID</TableHead>
                <TableHead>Имя</TableHead>
                <TableHead>Фамилия</TableHead>
                <TableHead>Отчество</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.patronymic}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {isAdmin && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">Режим администратора включен</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
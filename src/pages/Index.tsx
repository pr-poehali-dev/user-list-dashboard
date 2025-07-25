import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

// Моковые данные пользователей
const mockUsers = [
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.patronymic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Шапка */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Управление пользователями</h1>
            </div>
            
            <Button 
              onClick={() => setIsAdmin(!isAdmin)}
              variant={isAdmin ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Icon name="Shield" size={16} />
              {isAdmin ? 'Режим администратора' : 'Войти как администратор'}
            </Button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Поиск и статистика */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Поиск пользователей..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                Всего: {mockUsers.length}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                Найдено: {filteredUsers.length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Таблица пользователей */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50">
            <CardTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Icon name="Users" size={20} />
              Список пользователей
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100 bg-gray-50/30">
                    <TableHead className="w-20 font-medium text-gray-700 pl-6">ID</TableHead>
                    <TableHead className="font-medium text-gray-700">Имя</TableHead>
                    <TableHead className="font-medium text-gray-700">Фамилия</TableHead>
                    <TableHead className="font-medium text-gray-700">Отчество</TableHead>
                    {isAdmin && (
                      <TableHead className="w-24 font-medium text-gray-700 pr-6">Действия</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <TableRow 
                        key={user.id} 
                        className={`border-b border-gray-50 hover:bg-blue-50/50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <TableCell className="font-mono text-sm text-gray-600 pl-6">
                          #{user.id.toString().padStart(3, '0')}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                        <TableCell className="font-medium text-gray-900">{user.surname}</TableCell>
                        <TableCell className="text-gray-700">{user.patronymic}</TableCell>
                        {isAdmin && (
                          <TableCell className="pr-6">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icon name="MoreHorizontal" size={16} />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-12">
                        <div className="flex flex-col items-center gap-3 text-gray-500">
                          <Icon name="Search" size={48} className="text-gray-300" />
                          <p className="text-lg font-medium">Пользователи не найдены</p>
                          <p className="text-sm">Попробуйте изменить поисковый запрос</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
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

// Дерево вопросов
const questionTree = [
  {
    id: 'safety',
    name: 'Безопасность движения',
    type: 'folder',
    children: [
      {
        id: 'safety-signals',
        name: 'Сигналы и знаки',
        type: 'folder',
        children: [
          { id: 'q1', name: 'Что означает красный сигнал светофора?', type: 'question' },
          { id: 'q2', name: 'Порядок подачи звуковых сигналов', type: 'question' }
        ]
      },
      { id: 'q3', name: 'Правила работы в зоне повышенной опасности', type: 'question' }
    ]
  },
  {
    id: 'technical',
    name: 'Техническое обслуживание',
    type: 'folder',
    children: [
      {
        id: 'technical-maintenance',
        name: 'Плановое обслуживание',
        type: 'folder',
        children: [
          { id: 'q4', name: 'Периодичность технического осмотра', type: 'question' },
          { id: 'q5', name: 'Проверка тормозной системы', type: 'question' }
        ]
      },
      { id: 'q6', name: 'Аварийный ремонт на линии', type: 'question' }
    ]
  },
  {
    id: 'operations',
    name: 'Эксплуатационная работа',
    type: 'folder',
    children: [
      { id: 'q7', name: 'Порядок приема смены', type: 'question' },
      { id: 'q8', name: 'Ведение поездной документации', type: 'question' }
    ]
  },
  {
    id: 'regulations',
    name: 'Правила и инструкции',
    type: 'folder',
    children: [
      { id: 'q9', name: 'ПТЭ железных дорог', type: 'question' },
      { id: 'q10', name: 'Инструкция по сигнализации', type: 'question' }
    ]
  },
  {
    id: 'emergency',
    name: 'Нестандартные ситуации',
    type: 'folder',
    children: [
      { id: 'q11', name: 'Действия при обнаружении неисправности', type: 'question' },
      { id: 'q12', name: 'Порядок остановки в случае опасности', type: 'question' }
    ]
  },
  {
    id: 'equipment',
    name: 'Локомотивное хозяйство',
    type: 'folder',
    children: [
      { id: 'q13', name: 'Устройство электровоза', type: 'question' },
      { id: 'q14', name: 'Системы управления', type: 'question' }
    ]
  },
  {
    id: 'documentation',
    name: 'Документооборот',
    type: 'folder',
    children: [
      { id: 'q15', name: 'Оформление путевых документов', type: 'question' },
      { id: 'q16', name: 'Журналы учета', type: 'question' }
    ]
  },
  {
    id: 'environment',
    name: 'Охрана окружающей среды',
    type: 'folder',
    children: [
      { id: 'q17', name: 'Экологические требования', type: 'question' },
      { id: 'q18', name: 'Утилизация отходов', type: 'question' }
    ]
  },
  {
    id: 'training',
    name: 'Обучение и развитие',
    type: 'folder',
    children: [
      { id: 'q19', name: 'Повышение квалификации', type: 'question' },
      { id: 'q20', name: 'Стажировка новых сотрудников', type: 'question' }
    ]
  },
  {
    id: 'health',
    name: 'Охрана труда',
    type: 'folder',
    children: [
      { id: 'q21', name: 'Медицинские требования', type: 'question' },
      { id: 'q22', name: 'Средства индивидуальной защиты', type: 'question' }
    ]
  }
];

// Данные для групп и должностей
const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];

const positions = [
  'Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник',
  'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов',
  'Начальник станции', 'Дежурный по станции', 'Осмотрщик вагонов', 'Кондуктор'
];

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
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [teacherSection, setTeacherSection] = useState('users');
  const [isTeacherCollapsed, setIsTeacherCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [filters, setFilters] = useState<{
    group: string;
    direction: string;
    specialty: string;
  }>({
    group: '',
    direction: '',
    specialty: ''
  });

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const renderTreeItem = (item: any, depth = 0) => {
    const isExpanded = expandedFolders.includes(item.id);
    
    return (
      <div key={item.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div 
          className={`flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer ${
            item.type === 'question' ? 'text-gray-600' : 'font-medium'
          }`}
          onClick={() => item.type === 'folder' && toggleFolder(item.id)}
        >
          {item.type === 'folder' ? (
            <>
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={16}
                className="text-gray-400"
              />
              <Icon name="Folder" size={16} className="text-yellow-500" />
              <span>{item.name}</span>
              {item.children && (
                <span className="text-xs text-gray-400 ml-auto">
                  ({item.children.length})
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-4" /> {/* Spacer for alignment */}
              <Icon name="FileText" size={16} className="text-blue-500" />
              <span>{item.name}</span>
            </>
          )}
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child: any) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

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
  }, [search, sortConfig, filters]);

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

  // Интерфейс преподавателя
  if (isTeacherMode) {
    const teacherSections = [
      { id: 'questions', name: 'Вопросы', icon: 'HelpCircle' },
      { id: 'knowledge', name: 'Объем знаний', icon: 'BookOpen' },
      { id: 'plans', name: 'Планы обучения', icon: 'Calendar' },
      { id: 'groups', name: 'Группы', icon: 'Users' },
      { id: 'positions', name: 'Должности', icon: 'Briefcase' },
      { id: 'users', name: 'Пользователи', icon: 'User' }
    ];

    const renderTeacherContent = () => {
      switch (teacherSection) {
        case 'questions':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Банк вопросов</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setExpandedFolders(questionTree.map(item => item.id))}
                    variant="outline" 
                    size="sm"
                  >
                    <Icon name="FolderOpen" size={16} />
                    Развернуть все
                  </Button>
                  <Button 
                    onClick={() => setExpandedFolders([])}
                    variant="outline" 
                    size="sm"
                  >
                    <Icon name="Folder" size={16} />
                    Свернуть все
                  </Button>
                  <Button size="sm">
                    <Icon name="Plus" size={16} />
                    Добавить
                  </Button>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                {questionTree.map(item => renderTreeItem(item))}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Folder" size={16} className="text-yellow-500" />
                    <span>Папки: {questionTree.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="FileText" size={16} className="text-blue-500" />
                    <span>Вопросов: {questionTree.reduce((acc, folder) => acc + (folder.children?.length || 0), 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'knowledge':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Объем знаний</h2>
              <p className="text-gray-600">Здесь будет отображаться объем знаний студентов.</p>
            </div>
          );
        case 'plans':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Планы обучения</h2>
              <p className="text-gray-600">Здесь будут отображаться планы обучения.</p>
            </div>
          );
        case 'groups':
          if (selectedGroup) {
            // Интерфейс просмотра выбранной группы
            const groupUsers = users.filter(user => user.group === selectedGroup);
            
            return (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                {/* Хлебные крошки и управление группой */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedGroup(null)}
                      className="text-gray-600 hover:text-gray-900"
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
                
                {/* Таблица пользователей группы */}
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
            );
          }
          
          // Список всех групп
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Группы</h2>
                <Button size="sm">
                  <Icon name="Plus" size={16} />
                  Добавить группу
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Пользователей</TableHead>
                      <TableHead className="w-24">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group, index) => {
                      const userCount = users.filter(user => user.group === group).length;
                      return (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell 
                            className="font-medium cursor-pointer hover:text-blue-600"
                            onClick={() => setSelectedGroup(group)}
                          >
                            {group}
                          </TableCell>
                          <TableCell className="text-gray-600">{userCount}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedGroup(group)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Icon name="Eye" size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Всего групп: {groups.length}
              </div>
            </div>
          );
        case 'positions':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Должности</h2>
                <Button size="sm">
                  <Icon name="Plus" size={16} />
                  Добавить должность
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Всего должностей: {positions.length}
              </div>
            </div>
          );
        case 'users':
        default:
          return (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Пользователи</h2>
                <Button className="flex items-center gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить пользователя
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center justify-between">
                        Табельный номер
                        {sortConfig?.key === 'id' && (
                          <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('surname')}
                    >
                      <div className="flex items-center justify-between">
                        ФИО
                        {sortConfig?.key === 'surname' && (
                          <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('group')}
                    >
                      <div className="flex items-center justify-between">
                        Группа
                        {sortConfig?.key === 'group' && (
                          <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('direction')}
                    >
                      <div className="flex items-center justify-between">
                        Направление
                        {sortConfig?.key === 'direction' && (
                          <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={() => handleSort('specialty')}
                    >
                      <div className="flex items-center justify-between">
                        Специальность
                        {sortConfig?.key === 'specialty' && (
                          <Icon name={sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown'} size={16} />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.surname} {user.name} {user.patronymic}</TableCell>
                      <TableCell>{user.group}</TableCell>
                      <TableCell>{user.direction}</TableCell>
                      <TableCell>{user.specialty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Показано {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredAndSortedUsers.length)} из {filteredAndSortedUsers.length}
                  </span>
                  <Select 
                    value={pageSize.toString()} 
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
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
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  <span className="text-sm px-3 py-1">
                    {currentPage} из {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Навигация преподавателя */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="GraduationCap" size={24} className="text-green-600" />
                  <span className="font-semibold text-lg">Панель преподавателя</span>
                </div>
                {/* Кнопка сворачивания - показывается на мобильных */}
                <Button
                  onClick={() => setIsTeacherCollapsed(!isTeacherCollapsed)}
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                >
                  <Icon name={isTeacherCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
                </Button>
              </div>
              <Button 
                onClick={() => {
                  setIsTeacherMode(false);
                  setTeacherSection('users');
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="LogOut" size={16} />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
            
            {/* Навигационные разделы - адаптивные */}
            <div className={`${isTeacherCollapsed ? 'hidden' : 'block'} md:block`}>
              <div className="flex flex-col md:flex-row border-t">
                {teacherSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setTeacherSection(section.id);
                      setIsTeacherCollapsed(true); // Сворачиваем после выбора на мобильных
                    }}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 md:border-b-2 md:border-r transition-colors ${
                      teacherSection === section.id 
                        ? 'border-green-600 text-green-600 bg-green-50' 
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name={section.icon} size={16} />
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Контент преподавателя */}
        <div className="max-w-6xl mx-auto p-8">
          {teacherSection === 'users' && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Поиск пользователей..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          {renderTeacherContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
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

        {/* Панель фильтров */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="Filter" size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Фильтры:</span>
            </div>
            
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <Select 
                value={filters.group} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, group: value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Все группы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все группы</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.direction} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, direction: value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Все дирекции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все дирекции</SelectItem>
                  {Array.from(new Set(users.map(u => u.direction))).sort().map((dir) => (
                    <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.specialty} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, specialty: value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Все специальности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Все специальности</SelectItem>
                  {Array.from(new Set(users.map(u => u.specialty))).sort().map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(filters.group || filters.direction || filters.specialty) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilters({ group: '', direction: '', specialty: '' });
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <Icon name="X" size={14} />
                Сбросить
              </Button>
            )}
          </div>
          
          {(filters.group || filters.direction || filters.specialty) && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Info" size={14} />
              <span>Активные фильтры:</span>
              {filters.group && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Группа: {filters.group}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-blue-900"
                    onClick={() => setFilters(prev => ({ ...prev, group: '' }))}
                  />
                </span>
              )}
              {filters.direction && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">
                  Дирекция: {filters.direction}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-green-900"
                    onClick={() => setFilters(prev => ({ ...prev, direction: '' }))}
                  />
                </span>
              )}
              {filters.specialty && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Специальность: {filters.specialty}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-purple-900"
                    onClick={() => setFilters(prev => ({ ...prev, specialty: '' }))}
                  />
                </span>
              )}
            </div>
          )}
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
                        setIsTeacherMode(true);
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
                      setIsTeacherMode(true);
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

        {/* Модальное окно редактирования группы */}
        <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Edit" size={20} className="text-white" />
                </div>
                Редактировать группу
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Название группы
                  </label>
                  <Input
                    placeholder="Введите название группы"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editGroupName.trim()) {
                        // Здесь будет логика сохранения
                        alert(`Группа переименована на "${editGroupName}"`);
                        setSelectedGroup(editGroupName);
                        setIsEditGroupModalOpen(false);
                      }
                    }}
                  />
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!editGroupName.trim()}
                    onClick={() => {
                      // Здесь будет логика сохранения
                      alert(`Группа переименована на "${editGroupName}"`);
                      setSelectedGroup(editGroupName);
                      setIsEditGroupModalOpen(false);
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsEditGroupModalOpen(false)}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
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

        {/* Модальное окно удаления группы */}
        <Dialog.Root open={isDeleteGroupModalOpen} onOpenChange={setIsDeleteGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-white" />
                </div>
                Удаление группы
              </Dialog.Title>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">
                        Вы действительно хотите удалить группу?
                      </h4>
                      <p className="text-sm text-red-700">
                        Все пользователи будут перемещены в "Без группы"
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedGroup && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Удаляемая группа:</p>
                    <p className="font-semibold text-gray-900">{selectedGroup}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Пользователей: {users.filter(user => user.group === selectedGroup).length}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      // Здесь будет логика удаления
                      alert(`Группа "${selectedGroup}" удалена. Пользователи перемещены в "Без группы"`);
                      setSelectedGroup(null);
                      setIsDeleteGroupModalOpen(false);
                    }}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить группу
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsDeleteGroupModalOpen(false)}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
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
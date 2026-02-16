import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { users, questionTree, User } from '@/data/mockData';
import QuestionBankSection from '@/components/QuestionBankSection';
import UserManagementSection from '@/components/UserManagementSection';

const teacherSections = [
  { id: 'users', name: 'Пользователи', icon: 'Users' },
  { id: 'questions', name: 'Банк вопросов', icon: 'FileQuestion' },
  { id: 'groups', name: 'Группы', icon: 'UsersRound' },
  { id: 'knowledge', name: 'Объем знаний', icon: 'Brain' },
  { id: 'plans', name: 'Планы обучения', icon: 'BookOpen' }
];

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mtlsError, setMtlsError] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Подключение к серверу...');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teacherSection, setTeacherSection] = useState('users');
  const [isTeacherCollapsed, setIsTeacherCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [treeData, setTreeData] = useState(questionTree);

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
  };

  const handleLoginClick = (user: User) => {
    setSelectedUser(user);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setSelectedUser(null);
  };

  const renderTeacherContent = () => {
    switch (teacherSection) {
      case 'users':
        return (
          <UserManagementSection
            users={users}
            search={search}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            isEditGroupModalOpen={isEditGroupModalOpen}
            setIsEditGroupModalOpen={setIsEditGroupModalOpen}
            isDeleteGroupModalOpen={isDeleteGroupModalOpen}
            setIsDeleteGroupModalOpen={setIsDeleteGroupModalOpen}
            editGroupName={editGroupName}
            setEditGroupName={setEditGroupName}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            isAuthModalOpen={isAuthModalOpen}
            setIsAuthModalOpen={setIsAuthModalOpen}
          />
        );
      case 'questions':
        return (
          <QuestionBankSection
            treeData={treeData}
            setTreeData={setTreeData}
            expandedFolders={expandedFolders}
            setExpandedFolders={setExpandedFolders}
            questionSearch={questionSearch}
            setQuestionSearch={setQuestionSearch}
          />
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
          const groupUsers = users.filter(user => user.group === selectedGroup);
          
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
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
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setEditGroupName(selectedGroup);
                      setIsEditGroupModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Edit" size={14} />
                    Переименовать
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => {
                      setIsDeleteGroupModalOpen(true);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Icon name="Trash2" size={14} />
                    Удалить группу
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Icon name="Users" size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Всего пользователей в группе</p>
                      <p className="text-3xl font-bold text-gray-900">{groupUsers.length}</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ФИО</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дирекция</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Специальность</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {groupUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {user.surname} {user.name} {user.patronymic}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.direction}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.specialty}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const groupsList = Array.from(new Set(users.map(u => u.group))).sort();
        return (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Группы</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupsList.map((group) => {
                const groupCount = users.filter(u => u.group === group).length;
                return (
                  <button
                    key={group}
                    onClick={() => setSelectedGroup(group)}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Icon name="Users" size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{group}</h3>
                          <p className="text-sm text-gray-500">{groupCount} пользователей</p>
                        </div>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      default:
        return null;
    }
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

  if (mtlsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
              <Icon name="ShieldX" size={36} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Ошибка подключения</h2>
            <p className="text-gray-500 text-sm">mTLS Handshake Failed</p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 font-mono text-sm">
            <div className="flex items-center gap-2 mb-3 text-red-600">
              <Icon name="AlertTriangle" size={14} />
              <span className="font-semibold">SSL/TLS ERROR 525</span>
            </div>
            <div className="space-y-1 text-gray-600 text-xs leading-relaxed">
              <p><span className="text-gray-400">timestamp:</span> {new Date().toISOString()}</p>
              <p><span className="text-gray-400">error:</span> <span className="text-red-600">CERTIFICATE_VERIFY_FAILED</span></p>
              <p><span className="text-gray-400">detail:</span> Клиентский сертификат не прошёл проверку подлинности на сервере. Цепочка доверия нарушена.</p>
              <p><span className="text-gray-400">issuer:</span> CN=RZD Corporate CA, O=OAO RZD, C=RU</p>
              <p><span className="text-gray-400">subject:</span> CN=client.edu.rzd.ru</p>
              <p><span className="text-gray-400">reason:</span> unable to get local issuer certificate</p>
              <p><span className="text-gray-400">depth:</span> 0</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <div className="flex gap-2">
              <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800 text-xs leading-relaxed">
                Сертификат безопасности вашей рабочей станции не распознан сервером. Убедитесь, что корневой сертификат корпоративного CA установлен в хранилище доверенных сертификатов, либо обратитесь в службу информационной безопасности.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              <Icon name="RefreshCw" size={14} />
              <span className="ml-2">Повторить</span>
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setMtlsError(false)}
            >
              <Icon name="LogIn" size={14} />
              <span className="ml-2">Продолжить всё равно</span>
            </Button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-4">
            Код ошибки: ERR_BAD_SSL_CLIENT_AUTH_CERT
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Система пользователей</h2>
            <p className="text-gray-600 mb-4">{loadingText}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Icon name="Wifi" size={16} className="animate-pulse" />
              <span>Установка соединения</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isTeacherMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-xl font-bold text-gray-900">Режим преподавателя</h1>
                  <p className="text-xs md:text-sm text-gray-600 hidden md:block">Управление пользователями и контентом</p>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                <button
                  onClick={() => setIsTeacherCollapsed(!isTeacherCollapsed)}
                  className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon name={isTeacherCollapsed ? "Menu" : "X"} size={20} />
                </button>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsTeacherMode(false)}
                  className="flex items-center gap-2"
                  size="sm"
                >
                  <Icon name="LogOut" size={16} />
                  <span className="hidden sm:inline">Выйти</span>
                </Button>
              </div>
            </div>
            
            <div className={`${isTeacherCollapsed ? 'hidden' : 'block'} md:block`}>
              <div className="flex flex-col md:flex-row border-t">
                {teacherSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setTeacherSection(section.id);
                      setIsTeacherCollapsed(true);
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
              onClick={handleAdminToggle}
              variant={isAdmin ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Icon name={isAdmin ? "ShieldCheck" : "Shield"} size={16} />
              Администратор
            </Button>
          </div>
        </div>

        <UserManagementSection
          users={users}
          search={search}
          selectedGroup={selectedGroup}
          setSelectedGroup={setSelectedGroup}
          isEditGroupModalOpen={isEditGroupModalOpen}
          setIsEditGroupModalOpen={setIsEditGroupModalOpen}
          isDeleteGroupModalOpen={isDeleteGroupModalOpen}
          setIsDeleteGroupModalOpen={setIsDeleteGroupModalOpen}
          editGroupName={editGroupName}
          setEditGroupName={setEditGroupName}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          isAuthModalOpen={isAuthModalOpen}
          setIsAuthModalOpen={setIsAuthModalOpen}
        />

        {isAdmin && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800">
              <Icon name="ShieldCheck" size={16} />
              <span className="font-medium">Режим администратора активен</span>
            </div>
          </div>
        )}

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
                      <label className="text-sm font-medium text-gray-600">Группа</label>
                      <p className="text-base text-gray-900">{selectedUser.group}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Специальность</label>
                      <p className="text-base text-gray-900">{selectedUser.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        alert(`Авторизация ${selectedUser.surname} ${selectedUser.name}`);
                        handleCloseAuthModal();
                      }}
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Войти
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleCloseAuthModal}
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

        <Dialog.Root open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-white" />
                </div>
                Авторизация преподавателя
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Пароль доступа
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      value={teacherPassword}
                      onChange={(e) => {
                        setTeacherPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className="w-full pr-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (teacherPassword === 'password') {
                            setIsTeacherMode(true);
                            setIsTeacherModalOpen(false);
                            setTeacherPassword('');
                            setPasswordError('');
                            setShowPassword(false);
                          } else {
                            setPasswordError('Неверный пароль');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <Icon name="AlertCircle" size={14} />
                      {passwordError}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      if (teacherPassword === 'password') {
                        setIsTeacherMode(true);
                        setIsTeacherModalOpen(false);
                        setTeacherPassword('');
                        setPasswordError('');
                        setShowPassword(false);
                      } else {
                        setPasswordError('Неверный пароль');
                      }
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Войти
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      setTeacherPassword('');
                      setPasswordError('');
                      setShowPassword(false);
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

        <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Edit" size={20} className="text-white" />
                </div>
                Переименовать группу
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Новое название группы
                  </label>
                  <Input
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="Введите название..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1"
                    onClick={() => {
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

        <Dialog.Root open={isDeleteGroupModalOpen} onOpenChange={setIsDeleteGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-red-600 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-white" />
                </div>
                Удалить группу
              </Dialog.Title>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Вы действительно хотите удалить группу <strong>{selectedGroup}</strong>?
                </p>
                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded p-3">
                  <Icon name="AlertTriangle" size={14} className="inline mr-1" />
                  Это действие нельзя отменить. Все пользователи группы останутся без группы.
                </p>
                
                <div className="flex gap-3">
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      alert(`Группа "${selectedGroup}" удалена`);
                      setSelectedGroup(null);
                      setIsDeleteGroupModalOpen(false);
                    }}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
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
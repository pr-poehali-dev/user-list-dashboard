import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { users, User } from '@/data/mockData';
import UserManagementSection from '@/components/UserManagementSection';
import MtlsErrorScreen from '@/components/MtlsErrorScreen';
import LoadingScreen from '@/components/LoadingScreen';
import TeacherLayout from '@/components/TeacherLayout';

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mtlsError, setMtlsError] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [retryProgress, setRetryProgress] = useState(0);
  const [retryStatus, setRetryStatus] = useState('');
  const [retryFailed, setRetryFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Подключение к серверу...');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupSpecialty, setEditGroupSpecialty] = useState('');
  const [editGroupCreatedAt, setEditGroupCreatedAt] = useState('');

  const handleRetryConnection = () => {
    setRetrying(true);
    setRetryFailed(false);
    setRetryProgress(0);
    setRetryStatus('Установка TCP-соединения...');

    const steps = [
      { progress: 20, text: 'Установка TCP-соединения...', delay: 400 },
      { progress: 45, text: 'TLS ClientHello отправлен...', delay: 900 },
      { progress: 65, text: 'Ожидание ServerHello...', delay: 1500 },
      { progress: 80, text: 'Проверка клиентского сертификата...', delay: 2200 },
      { progress: 95, text: 'Верификация цепочки доверия...', delay: 2900 },
    ];

    steps.forEach(({ progress, text, delay }) => {
      setTimeout(() => {
        setRetryProgress(progress);
        setRetryStatus(text);
      }, delay);
    });

    setTimeout(() => {
      setRetrying(false);
      setRetryFailed(true);
      setRetryProgress(0);
    }, 3500);
  };

  const handleAdminToggle = () => {
    setIsAdmin(!isAdmin);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setSelectedUser(null);
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
      <MtlsErrorScreen
        retrying={retrying}
        retryProgress={retryProgress}
        retryStatus={retryStatus}
        retryFailed={retryFailed}
        onRetry={handleRetryConnection}
        onContinue={() => setMtlsError(false)}
      />
    );
  }

  if (isLoading) {
    return <LoadingScreen loadingText={loadingText} />;
  }

  if (isTeacherMode) {
    return (
      <TeacherLayout
        onExit={() => setIsTeacherMode(false)}
        selectedGroup={selectedGroup}
        setSelectedGroup={setSelectedGroup}
        isEditGroupModalOpen={isEditGroupModalOpen}
        setIsEditGroupModalOpen={setIsEditGroupModalOpen}
        isDeleteGroupModalOpen={isDeleteGroupModalOpen}
        setIsDeleteGroupModalOpen={setIsDeleteGroupModalOpen}
        editGroupName={editGroupName}
        setEditGroupName={setEditGroupName}
        editGroupSpecialty={editGroupSpecialty}
        setEditGroupSpecialty={setEditGroupSpecialty}
        editGroupCreatedAt={editGroupCreatedAt}
        setEditGroupCreatedAt={setEditGroupCreatedAt}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        isAuthModalOpen={isAuthModalOpen}
        setIsAuthModalOpen={setIsAuthModalOpen}
      />
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
              variant={isAdmin ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Icon name={isAdmin ? 'ShieldCheck' : 'Shield'} size={16} />
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
                      type={showPassword ? 'text' : 'password'}
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
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16} />
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
      </div>
    </div>
  );
};

export default Index;
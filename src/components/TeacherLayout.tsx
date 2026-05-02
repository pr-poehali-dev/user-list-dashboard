import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { users, questionTree, User } from '@/data/mockData';
import QuestionBankSection from '@/components/QuestionBankSection';
import UserManagementSection from '@/components/UserManagementSection';
import GroupsSection from '@/components/GroupsSection';

const teacherSections = [
  { id: 'users', name: 'Пользователи', icon: 'Users' },
  { id: 'questions', name: 'Банк вопросов', icon: 'FileQuestion' },
  { id: 'groups', name: 'Группы', icon: 'UsersRound' },
  { id: 'knowledge', name: 'Объем знаний', icon: 'Brain' },
  { id: 'plans', name: 'Планы обучения', icon: 'BookOpen' },
];

interface TeacherLayoutProps {
  onExit: () => void;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  isEditGroupModalOpen: boolean;
  setIsEditGroupModalOpen: (open: boolean) => void;
  isDeleteGroupModalOpen: boolean;
  setIsDeleteGroupModalOpen: (open: boolean) => void;
  editGroupName: string;
  setEditGroupName: (name: string) => void;
  editGroupSpecialty: string;
  setEditGroupSpecialty: (specialty: string) => void;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const TeacherLayout = ({
  onExit,
  selectedGroup,
  setSelectedGroup,
  isEditGroupModalOpen,
  setIsEditGroupModalOpen,
  isDeleteGroupModalOpen,
  setIsDeleteGroupModalOpen,
  editGroupName,
  setEditGroupName,
  editGroupSpecialty,
  setEditGroupSpecialty,
  selectedUser,
  setSelectedUser,
  isAuthModalOpen,
  setIsAuthModalOpen,
}: TeacherLayoutProps) => {
  const [teacherSection, setTeacherSection] = useState('users');
  const [isTeacherCollapsed, setIsTeacherCollapsed] = useState(false);
  const [teacherSearch, setTeacherSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [treeData, setTreeData] = useState(questionTree);

  const renderTeacherContent = () => {
    switch (teacherSection) {
      case 'users':
        return (
          <UserManagementSection
            users={users}
            search={teacherSearch}
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
        return (
          <GroupsSection
            users={users}
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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Icon name="GraduationCap" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Режим преподавателя</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden md:block">Управление пользователями и контентом</p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={() => setIsTeacherCollapsed(!isTeacherCollapsed)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Icon name={isTeacherCollapsed ? 'Menu' : 'X'} size={20} />
              </button>

              <Button
                variant="outline"
                onClick={onExit}
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
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}
        {renderTeacherContent()}
      </div>

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
                      setIsAuthModalOpen(false);
                      setSelectedUser(null);
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Войти
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setSelectedUser(null);
                    }}
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
    </div>
  );
};

export default TeacherLayout;

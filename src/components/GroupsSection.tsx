import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

interface GroupsSectionProps {
  users: User[];
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
  editGroupCreatedAt: string;
  setEditGroupCreatedAt: (date: string) => void;
}

const GroupsSection = ({
  users,
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
  editGroupCreatedAt,
  setEditGroupCreatedAt,
}: GroupsSectionProps) => {
  if (selectedGroup) {
    const groupUsers = users.filter(user => user.group === selectedGroup);

    return (
      <>
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
                  setEditGroupSpecialty('');
                  setEditGroupCreatedAt('');
                  setIsEditGroupModalOpen(true);
                }}
                className="flex items-center gap-2"
              >
                <Icon name="Edit" size={14} />
                Изменить
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleteGroupModalOpen(true)}
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

        <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Edit" size={20} className="text-white" />
                </div>
                Изменить группу
              </Dialog.Title>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Название группы
                  </label>
                  <Input
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    placeholder="Введите название..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Родительская специальность
                  </label>
                  <select
                    value={editGroupSpecialty}
                    onChange={(e) => setEditGroupSpecialty(e.target.value)}
                    className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm bg-white"
                  >
                    <option value="">— Не указана —</option>
                    {['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {editGroupSpecialty && (
                    <p className="text-xs text-blue-600 mt-1">Группа будет привязана к специальности: {editGroupSpecialty}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Дата создания группы
                  </label>
                  <Input
                    type="date"
                    value={editGroupCreatedAt}
                    onChange={(e) => setEditGroupCreatedAt(e.target.value)}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
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
      </>
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
};

export default GroupsSection;
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

type GroupMembership = 'primary' | 'secondary' | 'any';

const membershipOptions: { value: GroupMembership; label: string; icon: string }[] = [
  { value: 'primary',   label: 'Эта группа — основная',       icon: 'Star' },
  { value: 'secondary', label: 'Эта группа — дополнительная', icon: 'GitBranch' },
  { value: 'any',       label: 'Все участники группы',         icon: 'Users' },
];

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
  const [membership, setMembership] = useState<GroupMembership>('primary');

  if (selectedGroup) {
    const groupUsers = users.filter(user => user.group === selectedGroup);

    return (
      <>
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center justify-between mb-6 pb-5 border-b">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <img src="https://cdn.poehali.dev/projects/5d906ec0-f138-4a20-8cee-355c791bf35f/bucket/fef0d53f-325e-4577-a1f7-3f4d3bad55b2.png" width="38" height="38" style={{mixBlendMode: 'multiply', filter: 'invert(27%) sepia(51%) saturate(500%) hue-rotate(100deg) brightness(90%)'}} />
              </div>
              <div>
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors mb-1 group/btn"
                >
                  <Icon name="ArrowLeft" size={14} className="group-hover/btn:-translate-x-0.5 transition-transform" />
                  Все группы
                </button>
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedGroup}</h2>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
              >
                <Icon name="BookOpen" size={14} />
                План обучения
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditGroupName(selectedGroup);
                  setEditGroupSpecialty('');
                  setEditGroupCreatedAt('');
                  setIsEditGroupModalOpen(true);
                }}
                className="flex items-center gap-2 text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors"
              >
                <Icon name="Edit" size={14} />
                Изменить
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDeleteGroupModalOpen(true)}
                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
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

            <div className="flex items-center gap-3 mb-1">
              <div className="relative">
                <Icon name="Filter" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  value={membership}
                  onChange={e => setMembership(e.target.value as GroupMembership)}
                  className="pl-8 pr-8 py-2 text-sm border rounded-lg bg-white text-gray-700 appearance-none cursor-pointer hover:border-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {membershipOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <Icon name="ChevronDown" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <span className="text-sm text-gray-400">{groupUsers.length} чел.</span>
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
                    className={!editGroupName.trim() ? 'border-red-300 focus-visible:ring-red-300' : ''}
                  />
                  {!editGroupName.trim() && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={12} />
                      Название группы обязательно
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Родительская специальность
                  </label>
                  <select
                    value={editGroupSpecialty}
                    onChange={(e) => setEditGroupSpecialty(e.target.value)}
                    className={`w-full border-2 rounded px-3 py-2 outline-none transition-colors text-sm bg-white ${!editGroupSpecialty ? 'border-red-300 focus:border-red-400' : 'border-blue-200 focus:border-blue-500'}`}
                  >
                    <option value="">— Не указана —</option>
                    {['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {!editGroupSpecialty && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={12} />
                      Выберите родительскую специальность
                    </p>
                  )}
                  {editGroupSpecialty && (
                    <p className="text-xs text-blue-600 mt-1">Группа будет привязана к специальности: {editGroupSpecialty}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Дата создания группы
                  </label>
                  <Input
                    value={editGroupCreatedAt}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
                      let formatted = raw;
                      if (raw.length > 4) formatted = raw.slice(0, 2) + '.' + raw.slice(2, 4) + '.' + raw.slice(4);
                      else if (raw.length > 2) formatted = raw.slice(0, 2) + '.' + raw.slice(2);
                      setEditGroupCreatedAt(formatted);
                    }}
                    placeholder="ДД.ММ.ГГГГ"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-400 mt-1">Например: 15.09.2023</p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-white border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white transition-colors"
                    disabled={!editGroupName.trim() || !editGroupSpecialty || editGroupCreatedAt.length < 10}
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
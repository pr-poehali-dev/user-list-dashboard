import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

interface UserGroupViewProps {
  users: User[];
  selectedGroup: string;
  setSelectedGroup: (group: string | null) => void;
  isEditGroupModalOpen: boolean;
  setIsEditGroupModalOpen: (open: boolean) => void;
  isDeleteGroupModalOpen: boolean;
  setIsDeleteGroupModalOpen: (open: boolean) => void;
  editGroupName: string;
  setEditGroupName: (name: string) => void;
}

const UserGroupView = ({
  users,
  selectedGroup,
  setSelectedGroup,
  isEditGroupModalOpen,
  setIsEditGroupModalOpen,
  isDeleteGroupModalOpen,
  setIsDeleteGroupModalOpen,
  editGroupName,
  setEditGroupName,
}: UserGroupViewProps) => {
  const groupUsers = users.filter(user => user.group === selectedGroup);

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGroup(null)}
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

      <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Редактировать группу
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Название группы</label>
                <Input
                  value={editGroupName}
                  onChange={(e) => setEditGroupName(e.target.value)}
                  placeholder="Введите название группы"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditGroupModalOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={() => setIsEditGroupModalOpen(false)}>
                  Сохранить
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={isDeleteGroupModalOpen} onOpenChange={setIsDeleteGroupModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4 text-red-600">
              Удалить группу
            </Dialog.Title>
            <div className="space-y-4">
              <p className="text-gray-600">
                Вы уверены, что хотите удалить группу "{selectedGroup}"?
              </p>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDeleteGroupModalOpen(false)}>
                  Отмена
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => {
                    setIsDeleteGroupModalOpen(false);
                    setSelectedGroup(null);
                  }}
                >
                  Удалить
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default UserGroupView;

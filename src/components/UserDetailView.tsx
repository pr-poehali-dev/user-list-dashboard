import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];
const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки',
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];

interface UserDetailViewProps {
  selectedUser: User;
  onBack: () => void;
}

const UserDetailView = ({ selectedUser, onBack }: UserDetailViewProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editPreviewMode, setEditPreviewMode] = useState(false);

  useEffect(() => {
    if (editingUser) setEditPreviewMode(false);
  }, [editingUser]);

  const handleOpenEdit = () => {
    setEditingUser({ ...selectedUser });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <Icon name="ArrowLeft" size={16} />
            Назад к списку
          </Button>
          <Icon name="ChevronRight" size={16} className="text-gray-400" />
          <h2 className="text-xl font-semibold">{selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}</h2>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="User" size={28} className="text-white" />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}</p>
            <p className="text-sm text-gray-500">Табельный № {selectedUser.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Фамилия', value: selectedUser.surname },
            { label: 'Имя', value: selectedUser.name },
            { label: 'Отчество', value: selectedUser.patronymic },
            { label: 'Дирекция', value: selectedUser.direction },
            { label: 'Табельный номер', value: selectedUser.id },
            { label: 'Основная должность', value: selectedUser.specialty },
            { label: 'Диспетчер по грузовой работе', value: selectedUser.isDispatcher ? 'Да' : 'Нет' },
            { label: 'Группа', value: selectedUser.group },
            { label: 'Дата рождения', value: selectedUser.birthDate },
            { label: 'Создан', value: selectedUser.createdAt },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
              <p className="text-xs text-gray-500 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-900">{String(value)}</p>
            </div>
          ))}
          <div className="bg-gray-50 rounded-lg px-4 py-3 col-span-2">
            <p className="text-xs text-gray-500 mb-1">Совмещаемые должности</p>
            {selectedUser.combinedSpecialty.length === 0
              ? <p className="text-sm font-semibold text-gray-400">Не указаны</p>
              : <div className="flex flex-wrap gap-1.5">
                  {selectedUser.combinedSpecialty.map((cs, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">{cs}</span>
                  ))}
                </div>
            }
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleOpenEdit} className="flex items-center gap-2">
            <Icon name="Pencil" size={16} />
            Изменить
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
            <Icon name="Trash2" size={16} />
            Удалить
          </Button>
        </div>
      </div>

      <Dialog.Root open={isEditModalOpen} onOpenChange={(open) => { if (!open) { setIsEditModalOpen(false); setEditingUser(null); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-bold text-gray-900">Редактирование пользователя</Dialog.Title>
              <div className="flex gap-2">
                <Button variant={!editPreviewMode ? 'default' : 'outline'} size="sm" onClick={() => setEditPreviewMode(false)}>Редактирование</Button>
                <Button variant={editPreviewMode ? 'default' : 'outline'} size="sm" onClick={() => setEditPreviewMode(true)}>Предпросмотр</Button>
              </div>
            </div>

            {editingUser && !editPreviewMode && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Фамилия</label>
                    <input value={editingUser.surname} onChange={(e) => setEditingUser({ ...editingUser, surname: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Имя</label>
                    <input value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Отчество</label>
                  <input value={editingUser.patronymic} onChange={(e) => setEditingUser({ ...editingUser, patronymic: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded px-3 py-2 outline-none transition-colors text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Табельный номер</label>
                    <input value={editingUser.id} disabled className="w-full border-2 border-gray-200 bg-gray-50 rounded px-3 py-2 text-sm text-gray-400 font-mono" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Дирекция</label>
                    <select value={editingUser.direction} onChange={(e) => setEditingUser({ ...editingUser, direction: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                      {directions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Основная должность</label>
                    <select value={editingUser.specialty} onChange={(e) => setEditingUser({ ...editingUser, specialty: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                      {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Совмещаемые должности</label>
                  <div className="space-y-2">
                    {editingUser.combinedSpecialty.map((cs, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <select
                          value={cs}
                          onChange={(e) => {
                            const updated = [...editingUser.combinedSpecialty];
                            updated[idx] = e.target.value;
                            setEditingUser({ ...editingUser, combinedSpecialty: updated });
                          }}
                          className="flex-1 border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm"
                        >
                          {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingUser({ ...editingUser, combinedSpecialty: editingUser.combinedSpecialty.filter((_, i) => i !== idx) })}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 px-2"
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser({ ...editingUser, combinedSpecialty: [...editingUser.combinedSpecialty, specialties[0]] })}
                      className="flex items-center gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      <Icon name="Plus" size={14} />
                      Добавить должность
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Группа</label>
                    <select value={editingUser.group} onChange={(e) => setEditingUser({ ...editingUser, group: e.target.value })} className="w-full border-2 border-blue-200 focus:border-blue-500 rounded px-3 py-2 outline-none transition-colors text-sm">
                      {groups.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Диспетчер по грузовой работе</label>
                    <div className="flex items-center h-[42px]">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={editingUser.isDispatcher} onChange={(e) => setEditingUser({ ...editingUser, isDispatcher: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                        <span className="text-sm text-gray-700">{editingUser.isDispatcher ? 'Да' : 'Нет'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {editingUser && editPreviewMode && (
              <div className="space-y-0 border rounded-lg overflow-hidden">
                {[
                  { label: 'Фамилия', value: editingUser.surname },
                  { label: 'Имя', value: editingUser.name },
                  { label: 'Отчество', value: editingUser.patronymic },
                  { label: 'Дирекция', value: editingUser.direction },
                  { label: 'Табельный номер', value: editingUser.id },
                  { label: 'Основная должность', value: editingUser.specialty },
                  { label: 'Диспетчер по грузовой работе', value: editingUser.isDispatcher ? 'Да' : 'Нет' },
                  { label: 'Группа', value: editingUser.group },
                  { label: 'Создан', value: editingUser.createdAt },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-3 border-b odd:bg-gray-50">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-medium text-gray-900">{String(value)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between px-4 py-3 border-b odd:bg-gray-50">
                  <span className="text-sm text-gray-500">Совмещаемые должности</span>
                  {editingUser.combinedSpecialty.length === 0
                    ? <span className="text-sm font-medium text-gray-400">Не указаны</span>
                    : <div className="flex flex-wrap gap-1 justify-end">
                        {editingUser.combinedSpecialty.map((cs, i) => (
                          <span key={i} className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">{cs}</span>
                        ))}
                      </div>
                  }
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => { setIsEditModalOpen(false); setEditingUser(null); }} className="flex items-center gap-1.5">
                <Icon name="ArrowLeft" size={14} />
                Назад
              </Button>
              <div className="flex-1" />
              <Button onClick={handleSaveEdit} className="flex items-center gap-1.5">
                <Icon name="Save" size={14} />
                Сохранить
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default UserDetailView;

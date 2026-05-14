import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { users } from '@/data/mockData';

const getInitialPositions = () => {
  const set = new Set<string>();
  users.forEach(u => {
    if (u.specialty) set.add(u.specialty);
    u.combinedSpecialty?.forEach(s => set.add(s));
  });
  return Array.from(set).sort();
};

const PositionsSection = () => {
  const [positions, setPositions] = useState<string[]>(getInitialPositions);
  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const filtered = positions.filter(p =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed || positions.includes(trimmed)) return;
    setPositions(prev => [...prev, trimmed].sort());
    setNewName('');
  };

  const handleRename = (idx: number) => {
    const trimmed = editingName.trim();
    if (!trimmed || (trimmed !== positions[idx] && positions.includes(trimmed))) return;
    setPositions(prev => {
      const copy = [...prev];
      copy[idx] = trimmed;
      return copy.sort();
    });
    setEditingIndex(null);
    setEditingName('');
  };

  const handleDelete = (idx: number) => {
    setPositions(prev => prev.filter((_, i) => i !== idx));
    setDeleteIndex(null);
  };

  const usersCount = (position: string) =>
    users.filter(u => u.specialty === position || u.combinedSpecialty?.includes(position)).length;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6 pb-5 border-b">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon name="Briefcase" size={28} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Справочник</p>
          <h2 className="text-2xl font-bold text-gray-900">Должности</h2>
          <p className="text-sm text-gray-500">{positions.length} должностей</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск должности..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Новая должность..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="w-52"
          />
          <Button onClick={handleAdd} disabled={!newName.trim()} className="bg-green-600 hover:bg-green-700 text-white gap-1.5">
            <Icon name="Plus" size={16} />
            Добавить
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Icon name="Briefcase" size={40} className="mx-auto mb-3 opacity-30" />
          <p>Должности не найдены</p>
        </div>
      ) : (
        <div className="divide-y rounded-lg border overflow-hidden">
          {filtered.map((pos, idx) => {
            const realIdx = positions.indexOf(pos);
            const count = usersCount(pos);
            return (
              <div key={pos} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="Briefcase" size={16} className="text-blue-500" />
                </div>

                {editingIndex === realIdx ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editingName}
                      onChange={e => setEditingName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(realIdx);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      autoFocus
                      className="h-8 text-sm"
                    />
                    <Button size="sm" onClick={() => handleRename(realIdx)} className="bg-green-600 hover:bg-green-700 text-white h-8 px-3">
                      <Icon name="Check" size={14} />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingIndex(null)} className="h-8 px-3">
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 text-sm font-medium text-gray-800">{pos}</span>
                    <span className="text-xs text-gray-400 mr-2">{count} чел.</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => { setEditingIndex(realIdx); setEditingName(pos); }}
                        className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Переименовать"
                      >
                        <Icon name="Pencil" size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteIndex(realIdx)}
                        className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {deleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-2">Удалить должность?</h3>
            <p className="text-gray-600 text-sm mb-5">
              «{positions[deleteIndex]}» будет удалена из справочника. Это действие нельзя отменить.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setDeleteIndex(null)}>Отмена</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(deleteIndex!)}>Удалить</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionsSection;

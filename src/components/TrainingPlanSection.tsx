import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { users } from '@/data/mockData';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'question';
  children?: TreeNode[];
}

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface TrainingPlanSectionProps {
  treeData: TreeNode[];
  knowledgeScope: Record<string, Set<string>>;
}

type CheckState = 'checked' | 'unchecked' | 'partial';

const getPositions = (): string[] => {
  const set = new Set<string>();
  users.forEach(u => {
    if (u.specialty) set.add(u.specialty);
    u.combinedSpecialty?.forEach(s => set.add(s));
  });
  return Array.from(set).sort();
};

const getAllFolderIds = (items: TreeNode[]): string[] => {
  const ids: string[] = [];
  const collect = (item: TreeNode) => {
    if (item.type === 'folder') {
      ids.push(item.id);
      item.children?.forEach(collect);
    }
  };
  items.forEach(collect);
  return ids;
};

const getDescendantFolderIds = (item: TreeNode): string[] => {
  if (!item.children) return [];
  const ids: string[] = [];
  const collect = (node: TreeNode) => {
    if (node.type === 'folder') {
      ids.push(node.id);
      node.children?.forEach(collect);
    }
  };
  item.children.forEach(collect);
  return ids;
};

const searchInTree = (items: TreeNode[], term: string): string[] => {
  const matched: string[] = [];
  const search = (item: TreeNode): boolean => {
    const selfMatch = item.name.toLowerCase().includes(term.toLowerCase());
    let childMatch = false;
    if (item.children) {
      for (const child of item.children) {
        if (search(child)) childMatch = true;
      }
    }
    if ((selfMatch || childMatch) && item.type === 'folder') matched.push(item.id);
    return selfMatch || childMatch;
  };
  items.forEach(search);
  return matched;
};

const filterTree = (items: TreeNode[], term: string, allowedIds: Set<string>): TreeNode[] => {
  const filter = (item: TreeNode): TreeNode | null => {
    if (item.type === 'folder' && !allowedIds.has(item.id)) return null;
    const selfMatch = !term.trim() || item.name.toLowerCase().includes(term.toLowerCase());
    const filteredChildren = item.children
      ? item.children.map(c => filter(c)).filter((x): x is TreeNode => x !== null)
      : undefined;
    if (selfMatch || (filteredChildren && filteredChildren.length > 0)) {
      return { ...item, children: filteredChildren };
    }
    return null;
  };
  return items.map(filter).filter((x): x is TreeNode => x !== null);
};

const MOCK_PLANS: Record<string, TrainingPlan[]> = {};

const getPositionPlans = (position: string): TrainingPlan[] => {
  if (!MOCK_PLANS[position]) {
    MOCK_PLANS[position] = [
      { id: `${position}-1`, name: 'Базовый план', description: 'Обязательная программа обучения', createdAt: '12.01.2024' },
      { id: `${position}-2`, name: 'Расширенный план', description: 'Углублённая программа для опытных сотрудников', createdAt: '05.03.2024' },
    ];
  }
  return MOCK_PLANS[position];
};

const TrainingPlanSection = ({ treeData, knowledgeScope }: TrainingPlanSectionProps) => {
  const [positionSearch, setPositionSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [planSearch, setPlanSearch] = useState('');

  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [checkedFolders, setCheckedFolders] = useState<Set<string>>(new Set());
  const [treeSearch, setTreeSearch] = useState('');

  const positions = useMemo(() => getPositions(), []);
  const filteredPositions = positions.filter(p =>
    p.toLowerCase().includes(positionSearch.toLowerCase())
  );

  const allowedIds: Set<string> = useMemo(() => {
    if (!selectedPosition) return new Set();
    return knowledgeScope[selectedPosition] ?? new Set(getAllFolderIds(treeData));
  }, [selectedPosition, knowledgeScope, treeData]);

  const filteredTree = useMemo(
    () => filterTree(treeData, treeSearch, allowedIds),
    [treeData, treeSearch, allowedIds]
  );

  const plans = useMemo(
    () => selectedPosition ? getPositionPlans(selectedPosition) : [],
    [selectedPosition]
  );
  const filteredPlans = plans.filter(p =>
    p.name.toLowerCase().includes(planSearch.toLowerCase())
  );

  useEffect(() => {
    if (treeSearch.trim()) {
      setExpandedFolders(searchInTree(filteredTree, treeSearch));
    }
  }, [treeSearch, filteredTree]);

  const handleSelectPlan = (plan: TrainingPlan) => {
    setSelectedPlan(plan);
    setCheckedFolders(new Set());
    setExpandedFolders([]);
    setTreeSearch('');
  };

  const getFolderCheckState = (item: TreeNode): CheckState => {
    if (item.type !== 'folder') return 'unchecked';
    const allIds = [item.id, ...getDescendantFolderIds(item)].filter(id => allowedIds.has(id));
    if (allIds.length === 0) return 'unchecked';
    const checked = allIds.filter(id => checkedFolders.has(id)).length;
    if (checked === 0) return 'unchecked';
    if (checked === allIds.length) return 'checked';
    return 'partial';
  };

  const handleCheck = (item: TreeNode) => {
    const state = getFolderCheckState(item);
    const allIds = [item.id, ...getDescendantFolderIds(item)].filter(id => allowedIds.has(id));
    setCheckedFolders(prev => {
      const next = new Set(prev);
      if (state === 'checked') {
        allIds.forEach(id => next.delete(id));
      } else {
        allIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => setExpandedFolders(getAllFolderIds(filteredTree));
  const handleCollapseAll = () => setExpandedFolders([]);

  const handleSelectAll = () => {
    setCheckedFolders(new Set(Array.from(allowedIds)));
  };
  const handleDeselectAll = () => setCheckedFolders(new Set());

  const renderItem = (item: TreeNode, depth = 0): React.ReactNode => {
    if (item.type !== 'folder') return null;
    const isExpanded = expandedFolders.includes(item.id);
    const state = getFolderCheckState(item);
    const hasChildren = item.children && item.children.some(c => c.type === 'folder');

    return (
      <div key={item.id}>
        <div
          className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 group cursor-pointer"
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          <button
            onClick={() => hasChildren && toggleFolder(item.id)}
            className={`w-4 h-4 flex items-center justify-center text-gray-400 flex-shrink-0 ${!hasChildren ? 'invisible' : ''}`}
          >
            <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={14} />
          </button>

          <button
            onClick={() => handleCheck(item)}
            className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              backgroundColor: state === 'checked' ? '#1e293b' : state === 'partial' ? '#e2e8f0' : 'white',
              borderColor: state === 'unchecked' ? '#d1d5db' : '#1e293b',
            }}
          >
            {state === 'checked' && <Icon name="Check" size={10} className="text-white" />}
            {state === 'partial' && <span className="w-2 h-0.5 bg-slate-600 rounded" />}
          </button>

          <button
            onClick={() => toggleFolder(item.id)}
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
          >
            <Icon
              name={isExpanded ? 'FolderOpen' : 'Folder'}
              size={15}
              className="text-amber-500 flex-shrink-0"
            />
            <span className="text-sm text-gray-800 truncate">{item.name}</span>
          </button>
        </div>

        {isExpanded && item.children && (
          <div>
            {item.children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (selectedPlan && selectedPosition) {
    const checkedCount = Array.from(checkedFolders).filter(id => allowedIds.has(id)).length;
    const totalAllowed = allowedIds.size;

    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3">
          <button
            onClick={() => setSelectedPlan(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon name="BookOpen" size={16} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">{selectedPosition}</p>
            <h2 className="text-base font-semibold text-gray-900 truncate">{selectedPlan.name}</h2>
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {checkedCount} / {totalAllowed} разделов
          </span>
        </div>

        <div className="p-3 border-b">
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 flex items-start gap-2 mb-3">
            <Icon name="Info" size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Доступны только разделы, включённые в объём знаний для должности <strong>{selectedPosition}</strong>.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-40">
              <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={treeSearch}
                onChange={e => setTreeSearch(e.target.value)}
                placeholder="Поиск по разделам..."
                className="pl-9 h-9 text-sm"
              />
            </div>
            <Button size="sm" variant="outline" onClick={handleExpandAll} className="h-9 gap-1.5 text-xs">
              <Icon name="ChevronsDownUp" size={14} />
              Развернуть все
            </Button>
            <Button size="sm" variant="outline" onClick={handleCollapseAll} className="h-9 gap-1.5 text-xs">
              <Icon name="ChevronsUpDown" size={14} />
              Свернуть все
            </Button>
            <Button size="sm" variant="outline" onClick={handleSelectAll} className="h-9 gap-1.5 text-xs">
              <Icon name="CheckSquare" size={14} />
              Выбрать все
            </Button>
            <Button size="sm" variant="outline" onClick={handleDeselectAll} className="h-9 gap-1.5 text-xs">
              <Icon name="Square" size={14} />
              Снять все
            </Button>
          </div>
        </div>

        <div className="px-2 py-2 border-b flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border-2 border-slate-800 bg-slate-800 inline-flex items-center justify-center">
              <Icon name="Check" size={9} className="text-white" />
            </span>
            выбран
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border-2 border-slate-800 bg-slate-200 inline-flex items-center justify-center">
              <span className="w-2 h-0.5 bg-slate-600 rounded" />
            </span>
            частично
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded border-2 border-gray-300 inline-flex" />
            не выбран
          </span>
        </div>

        <div className="divide-y max-h-[420px] overflow-y-auto p-2">
          {filteredTree.length === 0
            ? <p className="text-sm text-gray-400 text-center py-8">Нет доступных разделов</p>
            : filteredTree.map(item => renderItem(item))}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedPlan(null)}>Отмена</Button>
          <Button onClick={() => setSelectedPlan(null)}>Сохранить</Button>
        </div>
      </div>
    );
  }

  if (selectedPosition) {
    return (
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b flex items-center gap-3">
          <button
            onClick={() => setSelectedPosition(null)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Icon name="ArrowLeft" size={18} />
          </button>
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon name="BookOpen" size={16} className="text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Планы обучения</p>
            <h2 className="text-base font-semibold text-gray-900 truncate">{selectedPosition}</h2>
          </div>
        </div>

        <div className="p-3 border-b">
          <div className="relative">
            <Icon name="Search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={planSearch}
              onChange={e => setPlanSearch(e.target.value)}
              placeholder="Поиск по планам..."
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        <div className="divide-y max-h-[500px] overflow-y-auto">
          {filteredPlans.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">Планы не найдены</p>
          ) : (
            filteredPlans.map(plan => (
              <button
                key={plan.id}
                onClick={() => handleSelectPlan(plan)}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Icon name="FileText" size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{plan.name}</p>
                  <p className="text-xs text-gray-400 truncate">{plan.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-300">{plan.createdAt}</span>
                  <Icon name="ChevronRight" size={16} className="text-gray-300" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="p-3 border-t">
          <Button size="sm" variant="outline" className="w-full gap-2">
            <Icon name="Plus" size={14} />
            Добавить план
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6 pb-5 border-b">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon name="BookOpen" size={28} className="text-blue-600" />
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Настройка</p>
          <h2 className="text-2xl font-bold text-gray-900">Планы обучения</h2>
          <p className="text-sm text-gray-500">{positions.length} должностей</p>
        </div>
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4 mb-5">
        <Icon name="Info" size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-0.5">Что такое план обучения?</p>
          <p className="text-blue-600 leading-relaxed">
            Для каждой должности можно создать несколько планов обучения, указав какие разделы из объёма знаний будут охватываться. Выберите должность, чтобы управлять её планами.
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск должности..."
            value={positionSearch}
            onChange={e => setPositionSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="divide-y rounded-lg border overflow-hidden">
        {filteredPositions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">Должности не найдены</p>
        ) : (
          filteredPositions.map(position => {
            const planCount = getPositionPlans(position).length;
            return (
              <button
                key={position}
                onClick={() => { setSelectedPosition(position); setPlanSearch(''); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon name="Briefcase" size={16} className="text-slate-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{position}</p>
                  <p className="text-xs text-gray-400">{planCount} {planCount === 1 ? 'план' : planCount < 5 ? 'плана' : 'планов'}</p>
                </div>
                <Icon name="ChevronRight" size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TrainingPlanSection;

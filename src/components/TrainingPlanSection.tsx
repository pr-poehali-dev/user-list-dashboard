import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  positions: string[];
  dateStart?: string;
  dateEnd?: string;
  questionsCount?: number;
  answerTime?: number;
  answerTimeUnlimited?: boolean;
  isActive?: boolean;
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

let planIdCounter = 1;
const genPlanId = () => `plan-${planIdCounter++}`;

const createSeedPlans = (position: string): TrainingPlan[] => [
  {
    id: genPlanId(),
    name: 'Базовый план',
    description: 'Обязательная программа обучения',
    createdAt: '12.01.2024',
    positions: [position],
  },
  {
    id: genPlanId(),
    name: 'Расширенный план',
    description: 'Углублённая программа для опытных сотрудников',
    createdAt: '05.03.2024',
    positions: [position],
  },
];

const formatToday = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
};

const TrainingPlanSection = ({ treeData, knowledgeScope }: TrainingPlanSectionProps) => {
  const [positionSearch, setPositionSearch] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [planSearch, setPlanSearch] = useState('');

  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [checkedFolders, setCheckedFolders] = useState<Set<string>>(new Set());
  const [treeSearch, setTreeSearch] = useState('');

  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDateStart, setFormDateStart] = useState('');
  const [formDateEnd, setFormDateEnd] = useState('');
  const [formQuestionsCount, setFormQuestionsCount] = useState('');
  const [formAnswerTime, setFormAnswerTime] = useState('');
  const [formAnswerTimeUnlimited, setFormAnswerTimeUnlimited] = useState(false);
  const [formIsActive, setFormIsActive] = useState(true);

  const positions = useMemo(() => getPositions(), []);
  const filteredPositions = positions.filter(p =>
    p.toLowerCase().includes(positionSearch.toLowerCase())
  );

  const [allPlans, setAllPlans] = useState<TrainingPlan[]>(() => {
    const list: TrainingPlan[] = [];
    positions.forEach(pos => list.push(...createSeedPlans(pos)));
    return list;
  });

  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanPositions, setNewPlanPositions] = useState<Set<string>>(new Set());
  const [addPlanPositionSearch, setAddPlanPositionSearch] = useState('');

  const allowedIds: Set<string> = useMemo(() => {
    const targetPositions = selectedPlan ? selectedPlan.positions : (selectedPosition ? [selectedPosition] : []);
    if (targetPositions.length === 0) return new Set();
    const sets = targetPositions.map(pos => knowledgeScope[pos] ?? new Set(getAllFolderIds(treeData)));
    return sets.reduce((acc, s) => new Set([...acc].filter(id => s.has(id))));
  }, [selectedPlan, selectedPosition, knowledgeScope, treeData]);

  const filteredTree = useMemo(
    () => filterTree(treeData, treeSearch, allowedIds),
    [treeData, treeSearch, allowedIds]
  );

  const plans = useMemo(
    () => selectedPosition ? allPlans.filter(p => p.positions.includes(selectedPosition)) : [],
    [selectedPosition, allPlans]
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
    setFormName(plan.name);
    setFormDescription(plan.description);
    setFormDateStart(plan.dateStart ?? '');
    setFormDateEnd(plan.dateEnd ?? '');
    setFormQuestionsCount(plan.questionsCount?.toString() ?? '');
    setFormAnswerTime(plan.answerTime?.toString() ?? '');
    setFormAnswerTimeUnlimited(plan.answerTimeUnlimited ?? false);
    setFormIsActive(plan.isActive ?? true);
    setCheckedFolders(new Set());
    setExpandedFolders([]);
    setTreeSearch('');
  };

  const handleSavePlan = () => {
    if (!selectedPlan) return;
    setAllPlans(prev => prev.map(p => p.id === selectedPlan.id ? {
      ...p,
      name: formName,
      description: formDescription,
      dateStart: formDateStart,
      dateEnd: formDateEnd,
      questionsCount: formQuestionsCount ? Number(formQuestionsCount) : undefined,
      answerTime: formAnswerTime ? Number(formAnswerTime) : undefined,
      answerTimeUnlimited: formAnswerTimeUnlimited,
      isActive: formIsActive,
    } : p));
    setSelectedPlan(null);
  };

  const openAddPlanDialog = () => {
    setNewPlanName('');
    setNewPlanDescription('');
    setNewPlanPositions(new Set(selectedPosition ? [selectedPosition] : []));
    setAddPlanPositionSearch('');
    setIsAddPlanOpen(true);
  };

  const toggleNewPlanPosition = (pos: string) => {
    setNewPlanPositions(prev => {
      const next = new Set(prev);
      if (next.has(pos)) next.delete(pos); else next.add(pos);
      return next;
    });
  };

  const handleCreatePlan = () => {
    if (!newPlanName.trim() || newPlanPositions.size === 0) return;
    const newPlan: TrainingPlan = {
      id: genPlanId(),
      name: newPlanName.trim(),
      description: newPlanDescription.trim(),
      createdAt: formatToday(),
      positions: Array.from(newPlanPositions),
      isActive: true,
    };
    setAllPlans(prev => [...prev, newPlan]);
    setIsAddPlanOpen(false);
    handleSelectPlan(newPlan);
  };

  const addPlanFilteredPositions = positions.filter(p =>
    p.toLowerCase().includes(addPlanPositionSearch.toLowerCase())
  );

  const addPlanDialog = (
    <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Новый план обучения</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Название плана</label>
            <Input
              value={newPlanName}
              onChange={e => setNewPlanName(e.target.value)}
              placeholder="Введите название"
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Описание</label>
            <textarea
              value={newPlanDescription}
              onChange={e => setNewPlanDescription(e.target.value)}
              placeholder="Краткое описание программы..."
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-gray-500">Должности</label>
              <span className="text-xs text-gray-400">{newPlanPositions.size} выбрано</span>
            </div>
            <div className="relative mb-2">
              <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={addPlanPositionSearch}
                onChange={e => setAddPlanPositionSearch(e.target.value)}
                placeholder="Поиск должности..."
                className="pl-8 h-8 text-xs"
              />
            </div>
            <div className="border rounded-lg max-h-48 overflow-y-auto divide-y">
              {addPlanFilteredPositions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">Должности не найдены</p>
              ) : (
                addPlanFilteredPositions.map(pos => (
                  <label
                    key={pos}
                    className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  >
                    <Checkbox
                      checked={newPlanPositions.has(pos)}
                      onCheckedChange={() => toggleNewPlanPosition(pos)}
                    />
                    <span className="text-gray-800">{pos}</span>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddPlanOpen(false)}>Отмена</Button>
          <Button
            onClick={handleCreatePlan}
            disabled={!newPlanName.trim() || newPlanPositions.size === 0}
          >
            Создать план
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

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
        {/* Шапка */}
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
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold truncate">
              {selectedPlan.positions.join(', ')}
            </p>
            <h2 className="text-base font-semibold text-gray-900 truncate">{selectedPlan.name}</h2>
          </div>
        </div>

        {/* Двухколоночный layout */}
        <div className="flex min-h-0">

          {/* Левая колонка — поля */}
          <div className="w-80 flex-shrink-0 border-r flex flex-col">
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Название плана</label>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="Введите название"
                  className="text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Статус плана</label>
                <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setFormIsActive(true)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      formIsActive
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${formIsActive ? 'bg-white' : 'bg-emerald-400'}`} />
                    Активен
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormIsActive(false)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      !formIsActive
                        ? 'bg-gray-500 text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${!formIsActive ? 'bg-white' : 'bg-gray-400'}`} />
                    Неактивен
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Описание</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Краткое описание программы..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Дата начала</label>
                  <Input
                    type="date"
                    value={formDateStart}
                    onChange={e => setFormDateStart(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Дата окончания</label>
                  <Input
                    type="date"
                    value={formDateEnd}
                    onChange={e => setFormDateEnd(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Количество вопросов</label>
                <div className="relative">
                  <Icon name="Hash" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    min={1}
                    value={formQuestionsCount}
                    onChange={e => setFormQuestionsCount(e.target.value)}
                    placeholder="Например: 20"
                    className="pl-8 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-gray-500">Время на ответ (мин)</label>
                  <button
                    type="button"
                    onClick={() => setFormAnswerTimeUnlimited(v => !v)}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: formAnswerTimeUnlimited ? '#1e293b' : 'white',
                        borderColor: formAnswerTimeUnlimited ? '#1e293b' : '#d1d5db',
                      }}
                    >
                      {formAnswerTimeUnlimited && <Icon name="Check" size={9} className="text-white" />}
                    </span>
                    Без ограничений
                  </button>
                </div>
                <div className="relative">
                  <Icon name="Clock" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="number"
                    min={1}
                    value={formAnswerTimeUnlimited ? '' : formAnswerTime}
                    onChange={e => setFormAnswerTime(e.target.value)}
                    disabled={formAnswerTimeUnlimited}
                    placeholder={formAnswerTimeUnlimited ? 'Без ограничений' : 'Например: 30'}
                    className="pl-8 text-sm disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Правая колонка — дерево */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-3 border-b space-y-2">
              <div className="bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 flex items-start gap-2">
                <Icon name="Info" size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Доступны только разделы, входящие в объём знаний {selectedPlan.positions.length > 1 ? 'всех выбранных должностей' : 'должности'}: «<strong>{selectedPlan.positions.join('», «')}</strong>».
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-32">
                  <Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={treeSearch}
                    onChange={e => setTreeSearch(e.target.value)}
                    placeholder="Поиск..."
                    className="pl-8 h-8 text-xs"
                  />
                </div>
                <Button size="sm" variant="outline" onClick={handleExpandAll} className="h-8 px-2 text-xs gap-1">
                  <Icon name="ChevronsDownUp" size={13} />Развернуть
                </Button>
                <Button size="sm" variant="outline" onClick={handleCollapseAll} className="h-8 px-2 text-xs gap-1">
                  <Icon name="ChevronsUpDown" size={13} />Свернуть
                </Button>
                <Button size="sm" variant="outline" onClick={handleSelectAll} className="h-8 px-2 text-xs gap-1">
                  <Icon name="CheckSquare" size={13} />Все
                </Button>
                <Button size="sm" variant="outline" onClick={handleDeselectAll} className="h-8 px-2 text-xs gap-1">
                  <Icon name="Square" size={13} />Снять
                </Button>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 px-1">
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded border-2 border-slate-800 bg-slate-800 inline-flex items-center justify-center">
                    <Icon name="Check" size={8} className="text-white" />
                  </span>выбран
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded border-2 border-slate-800 bg-slate-200 inline-flex items-center justify-center">
                    <span className="w-1.5 h-px bg-slate-600 rounded" />
                  </span>частично
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded border-2 border-gray-300 inline-flex" />не выбран
                </span>
                <span className="ml-auto font-medium text-gray-500">{checkedCount} / {totalAllowed}</span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 max-h-[420px]">
              {filteredTree.length === 0
                ? <p className="text-sm text-gray-400 text-center py-8">Нет доступных разделов</p>
                : filteredTree.map(item => renderItem(item))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline" onClick={() => setSelectedPlan(null)}>Отмена</Button>
          <Button onClick={handleSavePlan}>Сохранить</Button>
        </div>
      </div>
    );
  }

  if (selectedPosition) {
    return (
      <>
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
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{plan.name}</p>
                    {plan.positions.length > 1 && (
                      <span className="flex-shrink-0 text-[10px] font-medium bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                        {plan.positions.length} должности
                      </span>
                    )}
                  </div>
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
          <Button size="sm" variant="outline" className="w-full gap-2" onClick={openAddPlanDialog}>
            <Icon name="Plus" size={14} />
            Добавить план
          </Button>
        </div>
      </div>
      {addPlanDialog}
      </>
    );
  }

  return (
    <>
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-4 mb-6 pb-5 border-b">
        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <Icon name="BookOpen" size={28} className="text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">Настройка</p>
          <h2 className="text-2xl font-bold text-gray-900">Планы обучения</h2>
          <p className="text-sm text-gray-500">{positions.length} должностей</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={openAddPlanDialog}>
          <Icon name="Plus" size={14} />
          Добавить план
        </Button>
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
            const planCount = allPlans.filter(p => p.positions.includes(position)).length;
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
    {addPlanDialog}
    </>
  );
};

export default TrainingPlanSection;
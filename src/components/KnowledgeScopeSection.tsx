import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'question';
  children?: TreeNode[];
}

interface KnowledgeScopeSectionProps {
  treeData: TreeNode[];
}

type CheckState = 'checked' | 'unchecked' | 'partial';

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

const filterTree = (items: TreeNode[], term: string): TreeNode[] => {
  if (!term.trim()) return items;
  const filter = (item: TreeNode): TreeNode | null => {
    const selfMatch = item.name.toLowerCase().includes(term.toLowerCase());
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

const KnowledgeScopeSection = ({ treeData }: KnowledgeScopeSectionProps) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [checkedFolders, setCheckedFolders] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');

  const filteredTree = useMemo(() => filterTree(treeData, search), [treeData, search]);

  useEffect(() => {
    if (search.trim()) {
      setExpandedFolders(searchInTree(treeData, search));
    }
  }, [search, treeData]);

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getFolderCheckState = (item: TreeNode): CheckState => {
    if (item.type !== 'folder') return 'unchecked';
    const allIds = [item.id, ...getDescendantFolderIds(item)];
    const checkedCount = allIds.filter(id => checkedFolders.has(id)).length;
    if (checkedCount === 0) return 'unchecked';
    if (checkedCount === allIds.length) return 'checked';
    return 'partial';
  };

  const handleCheck = (item: TreeNode) => {
    const state = getFolderCheckState(item);
    const allIds = [item.id, ...getDescendantFolderIds(item)];
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

  const highlightText = (text: string, term: string) => {
    if (!term.trim()) return text;
    const parts = text.split(new RegExp(`(${term})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 font-semibold rounded-sm">{part}</mark>
        : part
    );
  };

  const totalFolders = getAllFolderIds(treeData).length;
  const checkedCount = checkedFolders.size;

  const renderItem = (item: TreeNode, depth = 0) => {
    if (item.type === 'question') return null;

    const isExpanded = expandedFolders.includes(item.id);
    const state = getFolderCheckState(item);
    const hasChildren = item.children?.some(c => c.type === 'folder');

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors hover:bg-gray-50 ${state !== 'unchecked' ? 'bg-blue-50/40' : ''}`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
        >
          <button
            className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600"
            onClick={() => hasChildren && toggleFolder(item.id)}
          >
            {hasChildren
              ? <Icon name={isExpanded ? 'ChevronDown' : 'ChevronRight'} size={14} />
              : <span className="w-4" />
            }
          </button>

          <button
            onClick={() => handleCheck(item)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
              state === 'checked'
                ? 'bg-blue-600 border-blue-600'
                : state === 'partial'
                  ? 'bg-blue-100 border-blue-400'
                  : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            {state === 'checked' && <Icon name="Check" size={11} className="text-white" />}
            {state === 'partial' && <span className="w-2 h-0.5 bg-blue-500 rounded-full" />}
          </button>

          <button
            className="flex items-center gap-2 flex-1 min-w-0 text-left"
            onClick={() => hasChildren && toggleFolder(item.id)}
          >
            <Icon
              name={isExpanded ? 'FolderOpen' : 'Folder'}
              size={16}
              className={state !== 'unchecked' ? 'text-blue-500' : 'text-yellow-500'}
            />
            <span className="text-sm text-gray-800 truncate">
              {highlightText(item.name, search)}
            </span>
            {state === 'partial' && (
              <span className="text-xs text-blue-500 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                частично
              </span>
            )}
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

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Объем знаний</h2>
          <div className="text-sm text-gray-500">
            Выбрано <span className="font-medium text-blue-600">{checkedCount}</span> из {totalFolders} разделов
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по разделам..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 flex-shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 bg-blue-600 border-blue-600 inline-flex items-center justify-center">
                <Icon name="Check" size={10} className="text-white" />
              </span>
              включён
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 bg-blue-100 border-blue-400 inline-flex items-center justify-center">
                <span className="w-2 h-0.5 bg-blue-500 rounded-full" />
              </span>
              частично
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded border-2 border-gray-300 inline-flex" />
              не выбран
            </span>
          </div>
        </div>
      </div>

      <div className="p-2 max-h-[calc(100vh-280px)] overflow-y-auto">
        {filteredTree.length === 0
          ? <p className="text-sm text-gray-400 text-center py-8">Ничего не найдено</p>
          : filteredTree.map(item => renderItem(item))
        }
      </div>
    </div>
  );
};

export default KnowledgeScopeSection;

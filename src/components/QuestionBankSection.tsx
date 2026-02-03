import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';
import { QuestionAnswer, QuestionData } from '@/data/mockData';

// Данные для всех вопросов
const questionsData: Record<string, QuestionData> = {
  'q1': {
    id: 'q1',
    question: 'Что означает красный сигнал светофора?',
    answers: [
      { id: 'a1', text: 'Стой! Запрещается проезд светофора', isCorrect: true },
      { id: 'a2', text: 'Движение разрешено с особой осторожностью', isCorrect: false },
      { id: 'a3', text: 'Приготовиться к остановке', isCorrect: false },
      { id: 'a4', text: 'Уменьшить скорость', isCorrect: false }
    ],
    hint: 'Красный цвет всегда означает запрет',
    explanation: 'Красный сигнал светофора — запрещающий сигнал. При красном сигнале машинист обязан остановить состав перед светофором.',
    answerType: 'set'
  }
};

interface QuestionBankSectionProps {
  treeData: any[];
  setTreeData: (data: any[]) => void;
  expandedFolders: string[];
  setExpandedFolders: (folders: string[] | ((prev: string[]) => string[])) => void;
  questionSearch: string;
  setQuestionSearch: (search: string) => void;
}

const QuestionBankSection = ({
  treeData,
  setTreeData,
  expandedFolders,
  setExpandedFolders,
  questionSearch,
  setQuestionSearch
}: QuestionBankSectionProps) => {
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    item: any;
  }>({ show: false, x: 0, y: 0, item: null });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const [confirmMove, setConfirmMove] = useState<{
    show: boolean;
    item: any;
    targetFolder: any;
  } | null>(null);
  const [dragCursorPos, setDragCursorPos] = useState<{x: number, y: number} | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    item: any;
  } | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [hasHint, setHasHint] = useState(false);
  const [hasExplanation, setHasExplanation] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showQuestionText, setShowQuestionText] = useState(true);
  const [showAnswerTexts, setShowAnswerTexts] = useState<Record<string, boolean>>({});
  const [showHintText, setShowHintText] = useState(true);
  const [showExplanationText, setShowExplanationText] = useState(true);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };

  const searchInTree = (items: any[], searchTerm: string): { matchedIds: string[], hasMatch: boolean } => {
    const matchedIds: string[] = [];
    let hasMatch = false;

    const search = (item: any): boolean => {
      const itemMatches = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      let childrenMatch = false;

      if (item.children) {
        for (const child of item.children) {
          if (search(child)) {
            childrenMatch = true;
          }
        }
      }

      if (itemMatches || childrenMatch) {
        if (item.type === 'folder') {
          matchedIds.push(item.id);
        }
        hasMatch = true;
        return true;
      }

      return false;
    };

    items.forEach(item => search(item));
    return { matchedIds, hasMatch };
  };

  const filterTreeBySearch = (items: any[], searchTerm: string): any[] => {
    if (!searchTerm.trim()) return items;

    const filter = (item: any): any | null => {
      const itemMatches = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      let filteredChildren: any[] = [];

      if (item.children) {
        filteredChildren = item.children
          .map((child: any) => filter(child))
          .filter((child: any) => child !== null);
      }

      if (itemMatches || filteredChildren.length > 0) {
        return {
          ...item,
          children: filteredChildren.length > 0 ? filteredChildren : item.children
        };
      }

      return null;
    };

    return items.map(item => filter(item)).filter(item => item !== null);
  };

  const filteredQuestionTree = useMemo(() => {
    return filterTreeBySearch(treeData, questionSearch);
  }, [questionSearch, treeData]);

  useEffect(() => {
    if (questionSearch.trim()) {
      const { matchedIds } = searchInTree(treeData, questionSearch);
      setExpandedFolders(matchedIds);
    }
  }, [questionSearch, treeData]);

  const highlightText = (text: string, search: string) => {
    if (!search.trim()) return text;
    
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === search.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 font-semibold">{part}</mark>
      ) : (
        part
      )
    );
  };

  const handleContextMenu = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      item
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, item: null });
  };

  const handleAddFolder = () => {
    const parentItem = contextMenu.item;
    const newFolder = {
      id: `folder-${Date.now()}`,
      name: 'Новый каталог',
      type: 'folder',
      children: []
    };

    const addFolderToTree = (items: any[]): any[] => {
      return items.map(item => {
        if (item.id === parentItem.id) {
          return {
            ...item,
            children: [...(item.children || []), newFolder]
          };
        }
        if (item.children) {
          return {
            ...item,
            children: addFolderToTree(item.children)
          };
        }
        return item;
      });
    };

    setTreeData(addFolderToTree(treeData));
    setExpandedFolders(prev => [...prev, parentItem.id]);
    setEditingItem(newFolder.id);
    setEditingName('Новый каталог');
    closeContextMenu();
  };

  const handleOpenQuestion = () => {
    console.log('Открыть вопрос:', contextMenu.item);
    closeContextMenu();
  };

  const handleRenameItem = () => {
    setEditingItem(contextMenu.item.id);
    setEditingName(contextMenu.item.name);
    closeContextMenu();
  };

  const saveRename = () => {
    if (!editingName.trim()) {
      setEditingItem(null);
      return;
    }

    const renameInTree = (items: any[]): any[] => {
      return items.map(item => {
        if (item.id === editingItem) {
          return { ...item, name: editingName.trim() };
        }
        if (item.children) {
          return {
            ...item,
            children: renameInTree(item.children)
          };
        }
        return item;
      });
    };

    setTreeData(renameInTree(treeData));
    setEditingItem(null);
    setEditingName('');
  };

  const cancelRename = () => {
    setEditingItem(null);
    setEditingName('');
  };

  const handleDeleteItem = () => {
    setConfirmDelete({
      show: true,
      item: contextMenu.item
    });
    closeContextMenu();
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete || deleteConfirmText !== confirmDelete.item.name) {
      return;
    }

    const deleteFromTree = (items: any[]): any[] => {
      return items
        .filter(i => i.id !== confirmDelete.item.id)
        .map(i => ({
          ...i,
          children: i.children ? deleteFromTree(i.children) : undefined
        }));
    };

    setTreeData(deleteFromTree(treeData));
    setConfirmDelete(null);
    setDeleteConfirmText('');
  };

  const cancelDeleteAction = () => {
    setConfirmDelete(null);
    setDeleteConfirmText('');
  };

  useEffect(() => {
    const handleClick = () => closeContextMenu();
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const handleDragStart = (e: React.DragEvent, item: any) => {
    e.stopPropagation();
    setDraggedItem(item);
    setDragCursorPos({x: e.clientX, y: e.clientY});
  };

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientX !== 0 && e.clientY !== 0) {
      setDragCursorPos({x: e.clientX, y: e.clientY});
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragCursorPos(null);
    setDragOverItem(null);
  };

  const isDescendant = (parent: any, childId: string): boolean => {
    if (parent.id === childId) return true;
    if (parent.children) {
      return parent.children.some((child: any) => isDescendant(child, childId));
    }
    return false;
  };

  const findParent = (items: any[], childId: string, parent: any = null): any => {
    for (const item of items) {
      if (item.id === childId) {
        return parent;
      }
      if (item.children) {
        const found = findParent(item.children, childId, item);
        if (found !== null) return found;
      }
    }
    return null;
  };

  const canDropInto = (target: any): boolean => {
    if (!draggedItem || target.type !== 'folder') return false;
    if (draggedItem.id === target.id) return false;
    if (draggedItem.type === 'folder' && isDescendant(draggedItem, target.id)) return false;
    const parent = findParent(treeData, draggedItem.id);
    if (parent && parent.id === target.id) return false;
    return true;
  };

  const handleDragOver = (e: React.DragEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (canDropInto(item)) {
      setDragOverItem(item.id);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetFolder: any) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverItem(null);
    
    if (!canDropInto(targetFolder)) {
      return;
    }

    setConfirmMove({
      show: true,
      item: draggedItem,
      targetFolder: targetFolder
    });
  };

  const confirmMoveAction = () => {
    if (!confirmMove) return;

    const { item, targetFolder } = confirmMove;

    const removeFromTree = (items: any[]): any[] => {
      return items
        .filter(i => i.id !== item.id)
        .map(i => ({
          ...i,
          children: i.children ? removeFromTree(i.children) : undefined
        }));
    };

    const addToFolder = (items: any[]): any[] => {
      return items.map(i => {
        if (i.id === targetFolder.id) {
          return {
            ...i,
            children: [...(i.children || []), item]
          };
        }
        if (i.children) {
          return {
            ...i,
            children: addToFolder(i.children)
          };
        }
        return i;
      });
    };

    let newTree = removeFromTree(treeData);
    newTree = addToFolder(newTree);
    setTreeData(newTree);
    
    if (!expandedFolders.includes(targetFolder.id)) {
      setExpandedFolders([...expandedFolders, targetFolder.id]);
    }

    setConfirmMove(null);
    setDraggedItem(null);
  };

  const cancelMoveAction = () => {
    setConfirmMove(null);
    setDraggedItem(null);
  };

  const findQuestionFolder = (items: any[], questionId: string): any | null => {
    for (const item of items) {
      if (item.type === 'folder' && item.children) {
        const hasQuestion = item.children.some((child: any) => child.id === questionId);
        if (hasQuestion) {
          return item;
        }
        const foundInChild = findQuestionFolder(item.children, questionId);
        if (foundInChild) return foundInChild;
      }
    }
    return null;
  };

  const getQuestionsInFolder = (folderId: string): any[] => {
    const findFolder = (items: any[]): any | null => {
      for (const item of items) {
        if (item.id === folderId) return item;
        if (item.children) {
          const found = findFolder(item.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const folder = findFolder(treeData);
    if (folder && folder.children) {
      return folder.children.filter((child: any) => child.type === 'question');
    }
    return [];
  };

  const handleSaveQuestion = () => {
    if (editingQuestion) {
      questionsData[editingQuestion.id] = editingQuestion;
      setIsQuestionModalOpen(false);
      setEditingQuestion(null);
      setPreviewMode(false);
      setShowQuestionText(true);
      setShowAnswerTexts({});
      setShowHintText(true);
      setShowExplanationText(true);
    }
  };

  const handleAddAnswer = () => {
    if (editingQuestion) {
      const newAnswer: QuestionAnswer = {
        id: `a${editingQuestion.answers.length + 1}`,
        text: '',
        isCorrect: false
      };
      setEditingQuestion({
        ...editingQuestion,
        answers: [...editingQuestion.answers, newAnswer]
      });
      setShowAnswerTexts(prev => ({ ...prev, [newAnswer.id]: true }));
    }
  };

  const handleRemoveAnswer = (answerId: string) => {
    if (editingQuestion && editingQuestion.answers.length > 2) {
      setEditingQuestion({
        ...editingQuestion,
        answers: editingQuestion.answers.filter(a => a.id !== answerId)
      });
      setShowAnswerTexts(prev => {
        const newState = { ...prev };
        delete newState[answerId];
        return newState;
      });
    }
  };

  const handleUpdateAnswer = (answerId: string, field: 'text' | 'isCorrect' | 'image', value: string | boolean) => {
    if (editingQuestion) {
      setEditingQuestion({
        ...editingQuestion,
        answers: editingQuestion.answers.map(a => 
          a.id === answerId ? { ...a, [field]: value } : a
        )
      });
    }
  };

  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const renderTreeItem = (item: any, depth = 0) => {
    const isExpanded = expandedFolders.includes(item.id);
    const hasMatch = questionSearch.trim() && item.name.toLowerCase().includes(questionSearch.toLowerCase());
    const isEditing = editingItem === item.id;
    const isDragOver = dragOverItem === item.id;
    const isBeingDragged = draggedItem?.id === item.id;
    const canDrop = draggedItem ? canDropInto(item) : false;
    const isDragActive = !!draggedItem && !isBeingDragged;
    const isHovered = dragOverItem === item.id;
    
    return (
      <div key={item.id} style={{ marginLeft: `${depth * 20}px` }}>
        <div 
          className={`flex items-center gap-2 p-2 rounded transition-all ${
            item.type === 'question' ? 'text-gray-600' : 'font-medium'
          } ${hasMatch ? 'bg-yellow-50 border border-yellow-200' : ''}
          ${isBeingDragged ? 'opacity-30' : ''}
          ${!isDragActive ? 'hover:bg-gray-50 cursor-pointer' : ''}`}
          draggable={!isEditing}
          onDragStart={(e) => handleDragStart(e, item)}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (item.type === 'folder') {
              setDragOverItem(item.id);
            }
          }}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
          onClick={() => {
            if (isEditing) return;
            if (item.type === 'folder') {
              toggleFolder(item.id);
            } else if (item.type === 'question') {
              const questionData = questionsData[item.id] || {
                id: item.id,
                question: item.name,
                answers: [
                  { id: 'a1', text: '', isCorrect: false },
                  { id: 'a2', text: '', isCorrect: false }
                ],
                hint: '',
                explanation: '',
                answerType: 'set' as const
              };
              setEditingQuestion(questionData);
              setHasHint(!!questionData.hint);
              setHasExplanation(!!questionData.explanation);
              setShowQuestionText(true);
              const answerTextsState: Record<string, boolean> = {};
              questionData.answers.forEach(a => {
                answerTextsState[a.id] = true;
              });
              setShowAnswerTexts(answerTextsState);
              setShowHintText(true);
              setShowExplanationText(true);
              setIsQuestionModalOpen(true);
            }
          }}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          {item.type === 'folder' ? (
            <>
              <Icon 
                name={isExpanded ? "ChevronDown" : "ChevronRight"} 
                size={16}
                className="text-gray-400"
              />
              <Icon name="Folder" size={16} className="text-yellow-500" />
              {isEditing ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  onBlur={saveRename}
                  autoFocus
                  className="h-6 py-0 px-2 text-sm flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{highlightText(item.name, questionSearch)}</span>
              )}
              {!isEditing && item.children && (
                <span className="text-xs text-gray-400 ml-auto">
                  ({item.children.length})
                </span>
              )}
            </>
          ) : (
            <>
              <div className="w-4" />
              <Icon name="FileText" size={16} className="text-blue-500" />
              {isEditing ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  onBlur={saveRename}
                  autoFocus
                  className="h-6 py-0 px-2 text-sm flex-1"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{highlightText(item.name, questionSearch)}</span>
              )}
            </>
          )}
        </div>
        
        {item.type === 'folder' && isExpanded && item.children && (
          <div>
            {item.children.map((child: any) => renderTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Question search */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Поиск по вопросам..."
          value={questionSearch}
          onChange={(e) => setQuestionSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Question tree */}
      <div className="space-y-1 max-h-[600px] overflow-y-auto">
        {filteredQuestionTree.map(item => renderTreeItem(item))}
      </div>

      {/* Context menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[200px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {contextMenu.item.type === 'folder' && (
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={handleAddFolder}
            >
              <Icon name="FolderPlus" size={16} />
              Создать подкаталог
            </button>
          )}
          {contextMenu.item.type === 'question' && (
            <button
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
              onClick={handleOpenQuestion}
            >
              <Icon name="FileText" size={16} />
              Открыть вопрос
            </button>
          )}
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
            onClick={handleRenameItem}
          >
            <Icon name="Edit" size={16} />
            Переименовать
          </button>
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
            onClick={handleDeleteItem}
          >
            <Icon name="Trash2" size={16} />
            Удалить
          </button>
        </div>
      )}

      {/* Drag cursor preview */}
      {draggedItem && dragCursorPos && (
        <div
          className="fixed pointer-events-none z-50 bg-white border-2 border-blue-500 rounded px-2 py-1 shadow-lg"
          style={{
            left: dragCursorPos.x + 10,
            top: dragCursorPos.y + 10
          }}
        >
          <div className="flex items-center gap-2">
            <Icon 
              name={draggedItem.type === 'folder' ? 'Folder' : 'FileText'} 
              size={16} 
              className={draggedItem.type === 'folder' ? 'text-yellow-500' : 'text-blue-500'}
            />
            <span className="text-sm font-medium">{draggedItem.name}</span>
          </div>
        </div>
      )}

      {/* Confirm move dialog */}
      <Dialog.Root open={confirmMove !== null} onOpenChange={(open) => !open && cancelMoveAction()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4">
              Подтверждение перемещения
            </Dialog.Title>
            {confirmMove && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Вы уверены, что хотите переместить "{confirmMove.item.name}" в "{confirmMove.targetFolder.name}"?
                </p>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={cancelMoveAction}>
                    Отмена
                  </Button>
                  <Button onClick={confirmMoveAction}>
                    Переместить
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Confirm delete dialog */}
      <Dialog.Root open={confirmDelete !== null} onOpenChange={(open) => !open && cancelDeleteAction()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <Dialog.Title className="text-xl font-semibold mb-4 text-red-600">
              Подтверждение удаления
            </Dialog.Title>
            {confirmDelete && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Вы уверены, что хотите удалить "{confirmDelete.item.name}"?
                  {confirmDelete.item.type === 'folder' && confirmDelete.item.children && confirmDelete.item.children.length > 0 && (
                    <span className="block mt-2 text-red-500 font-semibold">
                      Внимание: будут удалены все вложенные элементы ({confirmDelete.item.children.length})!
                    </span>
                  )}
                </p>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Введите название для подтверждения:
                  </label>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder={confirmDelete.item.name}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={cancelDeleteAction}>
                    Отмена
                  </Button>
                  <Button 
                    onClick={confirmDeleteAction}
                    disabled={deleteConfirmText !== confirmDelete.item.name}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Question editing modal */}
      <Dialog.Root open={isQuestionModalOpen} onOpenChange={setIsQuestionModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-xl font-semibold">
                Редактирование вопроса
              </Dialog.Title>
              <div className="flex gap-2">
                <Button
                  variant={!previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                >
                  Редактирование
                </Button>
                <Button
                  variant={previewMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPreviewMode(true)}
                >
                  Предпросмотр
                </Button>
              </div>
            </div>
            {editingQuestion && (
              <div className="space-y-4">{!previewMode ? (
                <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Вопрос</label>
                    <button
                      onClick={() => setShowQuestionText(!showQuestionText)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Icon name={showQuestionText ? "EyeOff" : "Eye"} size={14} />
                      {showQuestionText ? 'Скрыть текст' : 'Показать текст'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {showQuestionText && <textarea
                      value={editingQuestion.question}
                      onChange={(e) => {
                        setEditingQuestion({
                          ...editingQuestion,
                          question: e.target.value
                        });
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      onFocus={(e) => {
                        e.target.style.height = 'auto';
                        e.target.style.height = e.target.scrollHeight + 'px';
                      }}
                      placeholder="Введите текст вопроса"
                      className="w-full border-2 border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 rounded px-3 py-2 resize-none overflow-hidden transition-colors"
                      rows={1}
                    />}
                    {editingQuestion.questionImage ? (
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3 border-2 border-gray-200">
                        <div className="relative mb-3">
                          <img src={editingQuestion.questionImage} alt="Question" className="w-full max-h-64 object-contain rounded" />
                        </div>
                        <div className="flex gap-2">
                          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer hover:bg-gray-50 text-sm transition-all hover:border-blue-400">
                            <Icon name="RefreshCw" size={16} className="text-blue-600" />
                            <span className="font-medium">Заменить</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleImageUpload(file, (url) => {
                                    setEditingQuestion({...editingQuestion, questionImage: url});
                                  });
                                }
                              }}
                            />
                          </label>
                          <button
                            onClick={() => setEditingQuestion({...editingQuestion, questionImage: undefined})}
                            className="px-3 py-2 bg-white border border-red-300 rounded hover:bg-red-50 text-red-600 transition-all hover:border-red-400 flex items-center gap-2"
                            title="Удалить изображение"
                          >
                            <Icon name="Trash2" size={16} />
                            <span className="font-medium text-sm">Удалить</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 text-sm transition-all group">
                        <Icon name="ImagePlus" size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Добавить изображение</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, (url) => {
                                setEditingQuestion({...editingQuestion, questionImage: url});
                              });
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Тип ответа</label>
                  <select
                    value={editingQuestion.answerType}
                    onChange={(e) => setEditingQuestion({
                      ...editingQuestion,
                      answerType: e.target.value as 'set' | 'sequence'
                    })}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="set">Множественный выбор</option>
                    <option value="sequence">Последовательность</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <label className="block text-sm font-medium mb-1">Варианты ответов</label>
                      {editingQuestion.answerType === 'set' ? (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Icon name="Info" size={12} />
                          Отметьте галочкой правильные ответы
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Icon name="Info" size={12} />
                          Укажите порядковый номер для правильной последовательности
                        </p>
                      )}
                    </div>
                    <Button size="sm" onClick={handleAddAnswer}>
                      <Icon name="Plus" size={16} className="mr-1" />
                      Добавить вариант
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {editingQuestion.answers.map((answer, index) => (
                      <div key={answer.id} className="flex items-start gap-2">
                        {editingQuestion.answerType === 'set' ? (
                          <input
                            type="checkbox"
                            checked={answer.isCorrect}
                            onChange={(e) => handleUpdateAnswer(answer.id, 'isCorrect', e.target.checked)}
                            className="w-5 h-5 mt-2"
                          />
                        ) : (
                          <select
                            value={answer.sequenceOrder?.toString() || ''}
                            onChange={(e) => {
                              const selectedOrder = e.target.value ? parseInt(e.target.value) : undefined;
                              setEditingQuestion({
                                ...editingQuestion,
                                answers: editingQuestion.answers.map((a, i) => 
                                  i === index ? { ...a, sequenceOrder: selectedOrder, isCorrect: !!selectedOrder } : a
                                )
                              });
                            }}
                            className={`w-16 border-2 rounded px-2 py-2 text-sm transition-colors ${
                              answer.sequenceOrder && editingQuestion.answers.filter(a => a.sequenceOrder === answer.sequenceOrder).length > 1
                                ? 'border-red-400 bg-red-50'
                                : 'border-gray-300'
                            }`}
                          >
                            <option value="">—</option>
                            {editingQuestion.answers.map((_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        )}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500">Вариант {index + 1}</span>
                            <button
                              onClick={() => setShowAnswerTexts(prev => ({ ...prev, [answer.id]: !prev[answer.id] }))}
                              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <Icon name={showAnswerTexts[answer.id] ? "EyeOff" : "Eye"} size={12} />
                              {showAnswerTexts[answer.id] ? 'Скрыть' : 'Показать'}
                            </button>
                          </div>
                          {showAnswerTexts[answer.id] && <textarea
                            value={answer.text}
                            onChange={(e) => {
                              handleUpdateAnswer(answer.id, 'text', e.target.value);
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            onFocus={(e) => {
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder={`Текст варианта ${index + 1}`}
                            className="w-full border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded px-3 py-2 resize-none overflow-hidden transition-colors"
                            rows={1}
                          />}
                          {answer.image ? (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-2 border-2 border-blue-200">
                              <div className="relative mb-2">
                                <img src={answer.image} alt={`Answer ${index + 1}`} className="w-full max-h-40 object-contain rounded" />
                              </div>
                              <div className="flex gap-2">
                                <label className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white border border-blue-300 rounded cursor-pointer hover:bg-blue-50 text-xs transition-all">
                                  <Icon name="RefreshCw" size={12} className="text-blue-600" />
                                  <span className="font-medium">Заменить</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleImageUpload(file, (url) => {
                                          handleUpdateAnswer(answer.id, 'image', url);
                                        });
                                      }
                                    }}
                                  />
                                </label>
                                <button
                                  onClick={() => handleUpdateAnswer(answer.id, 'image', '')}
                                  className="px-2 py-1.5 bg-white border border-red-300 rounded hover:bg-red-50 text-red-600 transition-all flex items-center gap-1.5"
                                  title="Удалить"
                                >
                                  <Icon name="X" size={12} />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center gap-1.5 px-2 py-2 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 text-xs transition-all group">
                              <Icon name="ImagePlus" size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                              <span className="font-medium text-gray-500 group-hover:text-blue-600 transition-colors">Изображение</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file, (url) => {
                                      handleUpdateAnswer(answer.id, 'image', url);
                                    });
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRemoveAnswer(answer.id)}
                          disabled={editingQuestion.answers.length <= 2}
                          className="mt-1"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                  {editingQuestion.answerType === 'sequence' && (() => {
                    const usedOrders = editingQuestion.answers
                      .map(a => a.sequenceOrder)
                      .filter(Boolean) as number[];
                    const uniqueOrders = new Set(usedOrders);
                    const hasDuplicates = usedOrders.length !== uniqueOrders.size;
                    const missingNumbers: number[] = [];
                    
                    if (usedOrders.length > 0) {
                      const maxOrder = Math.max(...usedOrders);
                      for (let i = 1; i < maxOrder; i++) {
                        if (!usedOrders.includes(i)) {
                          missingNumbers.push(i);
                        }
                      }
                    }
                    
                    const hasErrors = hasDuplicates || missingNumbers.length > 0;
                    
                    if (hasErrors) {
                      return (
                        <div className="mt-2 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded text-sm">
                          <div className="flex items-start gap-2">
                            <Icon name="AlertTriangle" size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              {hasDuplicates && (
                                <p className="text-yellow-800 font-medium">⚠️ Некоторые номера используются дважды</p>
                              )}
                              {missingNumbers.length > 0 && (
                                <p className="text-yellow-800">
                                  Пропущены номера: {missingNumbers.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={hasHint}
                      onChange={(e) => {
                        setHasHint(e.target.checked);
                        if (!e.target.checked) {
                          setEditingQuestion({
                            ...editingQuestion,
                            hint: '',
                            hintImage: undefined
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    Подсказка
                  </label>
                  {hasHint && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => setShowHintText(!showHintText)}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Icon name={showHintText ? "EyeOff" : "Eye"} size={12} />
                          {showHintText ? 'Скрыть текст' : 'Показать текст'}
                        </button>
                      </div>
                      {showHintText && <textarea
                        value={editingQuestion.hint}
                        onChange={(e) => {
                          setEditingQuestion({
                            ...editingQuestion,
                            hint: e.target.value
                          });
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onFocus={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="Подсказка для ученика"
                        className="w-full border-2 border-orange-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded px-3 py-2 resize-none overflow-hidden transition-colors"
                        rows={1}
                      />}
                      {editingQuestion.hintImage ? (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border-2 border-orange-200">
                          <div className="relative mb-3">
                            <img src={editingQuestion.hintImage} alt="Hint" className="w-full max-h-48 object-contain rounded" />
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-orange-300 rounded cursor-pointer hover:bg-orange-50 text-sm transition-all">
                              <Icon name="RefreshCw" size={16} className="text-orange-600" />
                              <span className="font-medium">Заменить</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file, (url) => {
                                      setEditingQuestion({...editingQuestion, hintImage: url});
                                    });
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => setEditingQuestion({...editingQuestion, hintImage: undefined})}
                              className="px-3 py-2 bg-white border border-red-300 rounded hover:bg-red-50 text-red-600 transition-all flex items-center gap-2"
                              title="Удалить"
                            >
                              <Icon name="Trash2" size={16} />
                              <span className="font-medium text-sm">Удалить</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 text-sm transition-all group">
                          <Icon name="ImagePlus" size={20} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                          <span className="font-medium text-gray-600 group-hover:text-orange-600 transition-colors">Добавить изображение</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => {
                                  setEditingQuestion({...editingQuestion, hintImage: url});
                                });
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <input
                      type="checkbox"
                      checked={hasExplanation}
                      onChange={(e) => {
                        setHasExplanation(e.target.checked);
                        if (!e.target.checked) {
                          setEditingQuestion({
                            ...editingQuestion,
                            explanation: '',
                            explanationImage: undefined
                          });
                        }
                      }}
                      className="w-4 h-4"
                    />
                    Объяснение
                  </label>
                  {hasExplanation && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          onClick={() => setShowExplanationText(!showExplanationText)}
                          className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Icon name={showExplanationText ? "EyeOff" : "Eye"} size={12} />
                          {showExplanationText ? 'Скрыть текст' : 'Показать текст'}
                        </button>
                      </div>
                      {showExplanationText && <textarea
                        value={editingQuestion.explanation}
                        onChange={(e) => {
                          setEditingQuestion({
                            ...editingQuestion,
                            explanation: e.target.value
                          });
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onFocus={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        placeholder="Подробное объяснение правильного ответа"
                        className="w-full border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded px-3 py-2 resize-none overflow-hidden min-h-[80px] transition-colors"
                        rows={3}
                      />}
                      {editingQuestion.explanationImage ? (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border-2 border-green-200">
                          <div className="relative mb-3">
                            <img src={editingQuestion.explanationImage} alt="Explanation" className="w-full max-h-56 object-contain rounded" />
                          </div>
                          <div className="flex gap-2">
                            <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-green-300 rounded cursor-pointer hover:bg-green-50 text-sm transition-all">
                              <Icon name="RefreshCw" size={16} className="text-green-600" />
                              <span className="font-medium">Заменить</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleImageUpload(file, (url) => {
                                      setEditingQuestion({...editingQuestion, explanationImage: url});
                                    });
                                  }
                                }}
                              />
                            </label>
                            <button
                              onClick={() => setEditingQuestion({...editingQuestion, explanationImage: undefined})}
                              className="px-3 py-2 bg-white border border-red-300 rounded hover:bg-red-50 text-red-600 transition-all flex items-center gap-2"
                              title="Удалить"
                            >
                              <Icon name="Trash2" size={16} />
                              <span className="font-medium text-sm">Удалить</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50/50 text-sm transition-all group">
                          <Icon name="ImagePlus" size={20} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                          <span className="font-medium text-gray-600 group-hover:text-green-600 transition-colors">Добавить изображение</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(file, (url) => {
                                  setEditingQuestion({...editingQuestion, explanationImage: url});
                                });
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>
                </>
              ) : (
                <div className="space-y-6 border rounded-lg p-6 bg-gray-50">
                  {/* Question Preview */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">Вопрос:</h3>
                    {editingQuestion.question && <p className="text-gray-800 mb-3">{editingQuestion.question}</p>}
                    {editingQuestion.questionImage && (
                      <img src={editingQuestion.questionImage} alt="Question" className="max-w-full rounded border" />
                    )}
                    {!editingQuestion.question && !editingQuestion.questionImage && (
                      <p className="text-gray-400 italic">Текст или изображение вопроса не добавлены</p>
                    )}
                  </div>

                  {/* Answers Preview */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingQuestion.answerType === 'set' ? 'Варианты ответов:' : 'Установите последовательность:'}
                    </h3>
                    <div className="space-y-3">
                      {editingQuestion.answers.map((answer, index) => (
                        <div 
                          key={answer.id} 
                          className={`flex items-center gap-3 p-3 rounded border-2 ${
                            editingQuestion.answerType === 'set' && answer.isCorrect 
                              ? 'border-green-500 bg-green-50' 
                              : editingQuestion.answerType === 'sequence' && answer.sequenceOrder
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200'
                          }`}
                        >
                          {editingQuestion.answerType === 'set' ? (
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              answer.isCorrect ? 'bg-green-500 border-green-500' : 'border-gray-300'
                            }`}>
                              {answer.isCorrect && <Icon name="Check" size={14} className="text-white" />}
                            </div>
                          ) : (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                              answer.sequenceOrder ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                            }`}>
                              {answer.sequenceOrder || '—'}
                            </div>
                          )}
                          <div className="flex-1 space-y-2">
                            {answer.text && <span className="block">{answer.text}</span>}
                            {answer.image && (
                              <img src={answer.image} alt={`Answer ${index + 1}`} className="max-w-xs rounded" />
                            )}
                            {!answer.text && !answer.image && (
                              <span className="text-gray-400 italic">Вариант {index + 1} (пусто)</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hint Preview */}
                  {(editingQuestion.hint || editingQuestion.hintImage) && (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Lightbulb" size={20} className="text-amber-600" />
                        <h3 className="font-semibold text-amber-900">Подсказка</h3>
                      </div>
                      {editingQuestion.hint && <p className="text-amber-800 mb-3">{editingQuestion.hint}</p>}
                      {editingQuestion.hintImage && (
                        <img src={editingQuestion.hintImage} alt="Hint" className="max-w-full rounded" />
                      )}
                    </div>
                  )}

                  {/* Explanation Preview */}
                  {(editingQuestion.explanation || editingQuestion.explanationImage) && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name="Info" size={20} className="text-blue-600" />
                        <h3 className="font-semibold text-blue-900">Объяснение</h3>
                      </div>
                      {editingQuestion.explanation && <p className="text-blue-800 mb-3">{editingQuestion.explanation}</p>}
                      {editingQuestion.explanationImage && (
                        <img src={editingQuestion.explanationImage} alt="Explanation" className="max-w-full rounded" />
                      )}
                    </div>
                  )}
                </div>
              )}

                <div className="flex gap-2 justify-end pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setIsQuestionModalOpen(false);
                    setPreviewMode(false);
                    setEditingQuestion(null);
                    setShowQuestionText(true);
                    setShowAnswerTexts({});
                    setShowHintText(true);
                    setShowExplanationText(true);
                  }}>
                    <Icon name="ArrowLeft" size={16} />
                    Назад
                  </Button>
                  <Button 
                    onClick={handleSaveQuestion}
                    disabled={editingQuestion.answerType === 'sequence' && (() => {
                      const usedOrders = editingQuestion.answers
                        .map(a => a.sequenceOrder)
                        .filter(Boolean) as number[];
                      const uniqueOrders = new Set(usedOrders);
                      const hasDuplicates = usedOrders.length !== uniqueOrders.size;
                      const missingNumbers: number[] = [];
                      
                      if (usedOrders.length > 0) {
                        const maxOrder = Math.max(...usedOrders);
                        for (let i = 1; i < maxOrder; i++) {
                          if (!usedOrders.includes(i)) {
                            missingNumbers.push(i);
                          }
                        }
                      }
                      
                      return hasDuplicates || missingNumbers.length > 0;
                    })()}
                  >
                    Сохранить
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default QuestionBankSection;
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import ZoomImage from '@/components/ZoomImage';
import { AnswerOption } from '@/data/questionsData';

interface SequenceAnswerProps {
  options: AnswerOption[];
  correctSequence: string[];
  chosen: string[];
  onChange: (next: string[]) => void;
  locked: boolean;
}

type DragSource = 'bank' | 'answer';

const OptionContent = ({ option, number }: { option: AnswerOption; number?: number }) => (
  <span className={`flex flex-1 min-w-0 gap-3 ${option.image && option.text ? 'flex-col sm:flex-row sm:items-start' : ''}`}>
    {number !== undefined && <span className="text-xs font-semibold text-gray-400 mt-0.5 flex-shrink-0">№{number}</span>}
    {option.image && <ZoomImage src={option.image} className="w-full max-w-[240px] sm:w-36 sm:max-w-none max-h-48 sm:max-h-36" />}
    {option.text && (
      <span className="text-sm md:text-[15px] leading-relaxed text-gray-900 flex-1 min-w-0 text-left whitespace-pre-line break-words">
        {option.text}
      </span>
    )}
  </span>
);

const SequenceAnswer = ({ options, correctSequence, chosen, onChange, locked }: SequenceAnswerProps) => {
  const [drag, setDrag] = useState<{ id: string; from: DragSource } | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [overBank, setOverBank] = useState(false);

  const byId = (id: string) => options.find(o => o.id === id)!;
  const bank = options.filter(o => !chosen.includes(o.id));

  const insertAt = (id: string, index: number) => {
    const without = chosen.filter(x => x !== id);
    const fromIndex = chosen.indexOf(id);
    const target = fromIndex !== -1 && fromIndex < index ? index - 1 : index;
    const next = [...without];
    next.splice(Math.max(0, Math.min(target, next.length)), 0, id);
    onChange(next);
  };

  const resetDrag = () => {
    setDrag(null);
    setOverIndex(null);
    setOverBank(false);
  };

  const handleDropOnAnswer = (index: number) => {
    if (drag && !locked) insertAt(drag.id, index);
    resetDrag();
  };

  const handleDropOnBank = () => {
    if (drag && !locked && drag.from === 'answer') onChange(chosen.filter(x => x !== drag.id));
    resetDrag();
  };

  const startDrag = (e: React.DragEvent, id: string, from: DragSource) => {
    if (locked) return;
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDrag({ id, from });
  };

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= chosen.length) return;
    const next = [...chosen];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const dropProps = (index: number) => ({
    onDragOver: (e: React.DragEvent) => {
      if (locked) return;
      e.preventDefault();
      setOverIndex(index);
    },
    onDragLeave: () => setOverIndex(prev => (prev === index ? null : prev)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      handleDropOnAnswer(index);
    },
  });

  const DropLine = ({ index }: { index: number }) => (
    <div
      {...dropProps(index)}
      className={`rounded-full transition-all ${
        drag && overIndex === index ? 'h-2 bg-blue-500 my-1' : drag ? 'h-3' : 'h-1.5'
      }`}
    />
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Ваш ответ</p>
        <div
          className={`rounded-lg border-2 border-dashed p-3 min-h-[96px] transition-colors ${
            locked ? 'border-gray-200 bg-white' : drag ? 'border-blue-300 bg-blue-50/50' : 'border-gray-300 bg-gray-50'
          }`}
          onDragOver={e => {
            if (locked) return;
            e.preventDefault();
            if (overIndex === null) setOverIndex(chosen.length);
          }}
          onDrop={e => {
            e.preventDefault();
            handleDropOnAnswer(overIndex ?? chosen.length);
          }}
        >
          {chosen.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center text-gray-400 py-5 gap-1">
              <Icon name="MousePointerClick" size={22} />
              <p className="text-sm">Нажмите на нужные варианты ниже или перетащите их сюда</p>
            </div>
          )}

          {chosen.map((id, index) => {
            const opt = byId(id);
            const inPlace = correctSequence[index] === id;
            let cls = 'border-gray-200 bg-white hover:border-blue-300';
            if (locked) cls = inPlace ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50';
            return (
              <div key={id}>
                {!locked && <DropLine index={index} />}
                <div
                  draggable={!locked}
                  onDragStart={e => startDrag(e, id, 'answer')}
                  onDragEnd={resetDrag}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${cls} ${
                    !locked ? 'cursor-grab active:cursor-grabbing' : ''
                  } ${drag?.id === id ? 'opacity-40' : ''}`}
                >
                  <span className="w-7 h-7 mt-0.5 rounded-full bg-gray-800 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </span>
                  <OptionContent option={opt} />
                  {!locked ? (
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Icon name="GripVertical" size={18} className="text-gray-300 hidden sm:block" />
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        title="Выше"
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <Icon name="ChevronUp" size={16} />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === chosen.length - 1}
                        title="Ниже"
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed"
                      >
                        <Icon name="ChevronDown" size={16} />
                      </button>
                      <button
                        onClick={() => onChange(chosen.filter(x => x !== id))}
                        title="Убрать"
                        className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Icon name="X" size={16} />
                      </button>
                    </div>
                  ) : (
                    <Icon
                      name={inPlace ? 'CheckCircle2' : 'XCircle'}
                      size={18}
                      className={`mt-1 flex-shrink-0 ${inPlace ? 'text-emerald-600' : 'text-red-600'}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
          {!locked && chosen.length > 0 && <DropLine index={chosen.length} />}
        </div>
      </div>

      {!locked && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Варианты <span className="normal-case font-normal text-gray-400">(подходят не все)</span>
          </p>
          <div
            onDragOver={e => {
              if (drag?.from === 'answer') {
                e.preventDefault();
                setOverBank(true);
              }
            }}
            onDragLeave={() => setOverBank(false)}
            onDrop={e => {
              e.preventDefault();
              handleDropOnBank();
            }}
            className={`rounded-lg border p-3 min-h-[64px] grid gap-2 transition-colors ${
              overBank ? 'border-blue-400 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            {bank.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-2">Все варианты использованы</p>
            )}
            {bank.map(opt => (
              <button
                key={opt.id}
                draggable
                onDragStart={e => startDrag(e, opt.id, 'bank')}
                onDragEnd={resetDrag}
                onClick={() => onChange([...chosen, opt.id])}
                className={`flex items-start gap-3 p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer ${
                  drag?.id === opt.id ? 'opacity-40' : ''
                }`}
              >
                <OptionContent option={opt} number={options.indexOf(opt) + 1} />
                <Icon name="Plus" size={16} className="text-blue-500 flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SequenceAnswer;

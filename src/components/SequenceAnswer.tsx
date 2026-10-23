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

const OptionContent = ({ option }: { option: AnswerOption }) => (
  <span className={`flex flex-1 min-w-0 gap-3 ${option.image && option.text ? 'flex-wrap items-start' : ''}`}>
    {option.image && <ZoomImage src={option.image} />}
    {option.text && (
      <span className="text-sm md:text-[15px] leading-relaxed text-gray-900 flex-1 basis-60 min-w-0 text-left whitespace-pre-line break-words">
        {option.text}
      </span>
    )}
  </span>
);

const SequenceAnswer = ({ options, correctSequence, chosen, onChange, locked }: SequenceAnswerProps) => {
  const [positions, setPositions] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    chosen.forEach((id, i) => {
      init[id] = i + 1;
    });
    return init;
  });

  const commit = (next: Record<string, number>) => {
    setPositions(next);
    const ids = Object.keys(next).sort((a, b) => next[a] - next[b]);
    onChange(ids);
  };

  const assign = (id: string, pos: number) => {
    const next = { ...positions };
    if (next[id] === pos) {
      delete next[id];
    } else {
      Object.keys(next).forEach(k => {
        if (next[k] === pos) delete next[k];
      });
      next[id] = pos;
    }
    commit(next);
  };

  if (locked) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ваш ответ</p>
        {chosen.length === 0 && <p className="text-sm text-gray-400">Ответ не выбран</p>}
        {chosen.map((id, index) => {
          const opt = options.find(o => o.id === id)!;
          const inPlace = correctSequence[index] === id;
          return (
            <div
              key={id}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 ${
                inPlace ? 'border-emerald-500 bg-emerald-50' : 'border-red-500 bg-red-50'
              }`}
            >
              <span className="w-7 h-7 mt-0.5 rounded-full bg-gray-800 text-white text-sm font-semibold flex items-center justify-center flex-shrink-0">
                {index + 1}
              </span>
              <OptionContent option={opt} />
              <Icon
                name={inPlace ? 'CheckCircle2' : 'XCircle'}
                size={18}
                className={`mt-1 flex-shrink-0 ${inPlace ? 'text-emerald-600' : 'text-red-600'}`}
              />
            </div>
          );
        })}
      </div>
    );
  }

  const owner = (pos: number) => Object.keys(positions).find(k => positions[k] === pos);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">
        Выберите номер для каждого подходящего варианта. Подходят не все варианты. Повторное нажатие на номер снимает выбор.
      </p>
      {options.map((opt, optIndex) => {
        const pos = positions[opt.id];
        return (
          <div
            key={opt.id}
            className={`rounded-lg border-2 p-3 md:p-4 transition-colors ${
              pos ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-sm font-semibold text-gray-400 mt-0.5 w-5 flex-shrink-0">{optIndex + 1}.</span>
              <OptionContent option={opt} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 pl-8">
              <span className="text-xs text-gray-500 mr-1">Место в порядке:</span>
              {options.map((_, i) => {
                const p = i + 1;
                const mine = pos === p;
                const takenBy = owner(p);
                const taken = !!takenBy && !mine;
                return (
                  <button
                    key={p}
                    onClick={() => assign(opt.id, p)}
                    title={taken ? 'Номер занят, выбор переставит его сюда' : `Поставить на место ${p}`}
                    className={`w-9 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                      mine
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : taken
                          ? 'bg-gray-100 border-gray-200 text-gray-400 hover:border-blue-300'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500 hover:bg-blue-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SequenceAnswer;

import Icon from '@/components/ui/icon';
import ThumbImage from '@/components/ThumbImage';
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
    {option.image && <ThumbImage src={option.image} />}
    {option.text && (
      <span className="text-sm md:text-[15px] leading-relaxed text-gray-900 flex-1 basis-60 min-w-0 text-left whitespace-pre-line break-words">
        {option.text}
      </span>
    )}
  </span>
);

const SequenceAnswer = ({ options, correctSequence, chosen, onChange, locked }: SequenceAnswerProps) => {
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

  const toggle = (id: string) => {
    onChange(chosen.includes(id) ? chosen.filter(x => x !== id) : [...chosen, id]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="text-xs text-gray-500">
          Нажимайте варианты в нужном порядке. Подходят не все. Повторное нажатие снимает выбор.
        </p>
        {chosen.length > 0 && (
          <button
            onClick={() => onChange([])}
            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 flex-shrink-0"
          >
            <Icon name="RotateCcw" size={12} />
            Сбросить
          </button>
        )}
      </div>
      {options.map(opt => {
        const idx = chosen.indexOf(opt.id);
        const picked = idx !== -1;
        return (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={`w-full flex items-start gap-3 p-3 md:p-4 rounded-lg border-2 text-left transition-colors ${
              picked ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <span
              className={`w-8 h-8 rounded-full border-2 text-sm font-semibold flex items-center justify-center flex-shrink-0 ${
                picked ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-transparent'
              }`}
            >
              {picked ? idx + 1 : '0'}
            </span>
            <OptionContent option={opt} />
          </button>
        );
      })}
    </div>
  );
};

export default SequenceAnswer;

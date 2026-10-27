import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Ticket } from '@/data/ticketsData';
import { User } from '@/data/mockData';
import { sampleQuestions } from '@/data/questionsData';
import SequenceAnswer from '@/components/SequenceAnswer';
import ZoomImage from '@/components/ZoomImage';
import ThumbImage from '@/components/ThumbImage';

interface TicketPlayerProps {
  ticket: Ticket;
  user: User;
  onExit: () => void;
}

const formatTime = (totalSeconds: number) => {
  const s = Math.max(0, totalSeconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(sec).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const TicketPlayer = ({ ticket, user, onExit }: TicketPlayerProps) => {
  const questions = sampleQuestions;
  const fullName = [user.surname, user.name, user.patronymic].filter(Boolean).join(' ');
  const [orders, setOrders] = useState<Record<string, string[]>>({});
  const [current, setCurrent] = useState(0);
  const [opened, setOpened] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [answered, setAnswered] = useState<Record<string, boolean>>({});
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);

  const limitSeconds = ticket.timeLimit ? ticket.timeLimit * 60 : null;
  const remaining = limitSeconds !== null ? limitSeconds - elapsed : null;
  const timeIsOver = remaining !== null && remaining <= 0;

  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => clearInterval(id);
  }, [finished]);

  useEffect(() => {
    if (timeIsOver) setFinished(true);
  }, [timeIsOver]);

  const question = questions[current];
  const isAnswered = question.id in answered;
  const currentSelection = selected[question.id] ?? [];

  const answeredCount = Object.keys(answered).length;
  const correctCount = Object.values(answered).filter(Boolean).length;

  const findUnanswered = (from: number, step: 1 | -1): number | null => {
    for (let i = from + step; i >= 0 && i < questions.length; i += step) {
      if (!(questions[i].id in answered)) return i;
    }
    return null;
  };

  const prevIndex = useMemo(() => findUnanswered(current, -1), [current, answered]);
  const nextIndex = useMemo(() => findUnanswered(current, 1), [current, answered]);

  const toggleOption = (optionId: string) => {
    if (isAnswered) return;
    setSelected(prev => {
      const list = prev[question.id] ?? [];
      const next = list.includes(optionId) ? list.filter(x => x !== optionId) : [...list, optionId];
      return { ...prev, [question.id]: next };
    });
  };

  const isSequence = question.type === 'sequence';
  const currentOrder = orders[question.id] ?? [];
  const correctSequence = question.sequence ?? [];
  const isOpen = (kind: string) => !!opened[`${question.id}:${kind}`];
  const togglePanel = (kind: string) =>
    setOpened(prev => ({ ...prev, [`${question.id}:${kind}`]: !prev[`${question.id}:${kind}`] }));
  const numberOf = (id: string) => question.options.findIndex(o => o.id === id) + 1;
  const selectedNumbers = isSequence
    ? currentOrder.map(numberOf)
    : question.options.filter(o => currentSelection.includes(o.id)).map(o => numberOf(o.id));
  const answerCode = isSequence
    ? correctSequence.map(numberOf).join(' → ')
    : question.options.filter(o => o.correct).map(o => numberOf(o.id)).join(', ');
  const canAnswer = isSequence ? currentOrder.length > 0 : currentSelection.length > 0;

  const handleAnswer = () => {
    if (isAnswered || !canAnswer) return;
    let isCorrect: boolean;
    if (isSequence) {
      isCorrect =
        currentOrder.length === correctSequence.length &&
        correctSequence.every((id, i) => currentOrder[i] === id);
    } else {
      const correctIds = question.options.filter(o => o.correct).map(o => o.id).sort();
      const chosen = [...currentSelection].sort();
      isCorrect = correctIds.length === chosen.length && correctIds.every((id, i) => id === chosen[i]);
    }
    const nextAnswered = { ...answered, [question.id]: isCorrect };
    setAnswered(nextAnswered);
    if (Object.keys(nextAnswered).length === questions.length) {
      setFinished(true);
    }
  };

  const goNextAfterAnswer = () => {
    const forward = findUnanswered(current, 1);
    const back = findUnanswered(current, -1);
    if (forward !== null) setCurrent(forward);
    else if (back !== null) setCurrent(back);
  };

  if (finished) {
    const total = questions.length;
    const percent = Math.round((correctCount / total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-xl mx-auto bg-white rounded-lg border shadow-sm p-8 text-center">
          <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${percent >= 70 ? 'bg-emerald-100' : 'bg-red-100'}`}>
            <Icon name={percent >= 70 ? 'CheckCircle2' : 'XCircle'} size={32} className={percent >= 70 ? 'text-emerald-600' : 'text-red-600'} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {timeIsOver && answeredCount < total ? 'Время вышло' : 'Аттестация завершена'}
          </h2>
          <p className="text-gray-500 mb-1">Билет № {ticket.number}. {ticket.title}</p>
          <p className="text-sm text-gray-700 mb-6">
            <span className="font-semibold">{fullName}</span>, {user.specialty}
          </p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Верно</p>
              <p className="text-lg font-semibold text-emerald-600">{correctCount} из {total}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Результат</p>
              <p className="text-lg font-semibold text-gray-900">{percent}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Затрачено</p>
              <p className="text-lg font-semibold text-gray-900">{formatTime(elapsed)}</p>
            </div>
          </div>
          <Button onClick={onExit}>К списку билетов</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex items-center justify-between p-3 md:p-4 gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Аттестация. Билет № {ticket.number}</p>
            <h1 className="text-base font-semibold text-gray-900 truncate">{ticket.title}</h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold ${
                remaining !== null && remaining <= 60
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <Icon name="Timer" size={16} />
              {remaining !== null ? formatTime(remaining) : formatTime(elapsed)}
            </div>
            <Button variant="outline" size="sm" onClick={onExit}>
              <Icon name="X" size={16} />
              <span className="hidden sm:inline">Прервать</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-3 md:p-6 space-y-4">
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3 pb-3 border-b">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="User" size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.specialty}</p>
            </div>
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500">
              Отвечено: {answeredCount} из {questions.length}
            </p>
            <p className="text-sm text-gray-500">
              {remaining !== null ? `Затрачено: ${formatTime(elapsed)}` : 'Без ограничения времени'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 max-h-[104px] overflow-y-auto p-1 -m-1">
            {questions.map((q, i) => {
              const done = q.id in answered;
              const isCurrent = i === current;
              let cls = 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
              if (done) cls = answered[q.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-red-500 border-red-500 text-white';
              if (isCurrent && !done) cls = 'bg-blue-600 border-blue-600 text-white';
              return (
                <button
                  key={q.id}
                  disabled={done}
                  onClick={() => setCurrent(i)}
                  className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors disabled:cursor-not-allowed ${cls} ${
                    isCurrent ? 'ring-2 ring-offset-1 ring-blue-300' : ''
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
         <div className="p-4 md:p-6">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">
            Вопрос {current + 1} из {questions.length}
          </p>
          {question.text && (
            <p className="text-base md:text-lg font-medium text-gray-900 mb-4 leading-relaxed whitespace-pre-line break-words">
              {question.text}
            </p>
          )}
          {question.image && (
            <div className="mb-4 flex justify-center rounded-lg bg-gray-50 p-2">
              <ZoomImage src={question.image} />
            </div>
          )}
          {!isSequence && <p className="text-xs text-gray-500 mb-3">Выберите все правильные ответы</p>}

          {isSequence ? (
            <>
              <SequenceAnswer
                key={question.id}
                options={question.options}
                correctSequence={correctSequence}
                chosen={currentOrder}
                locked={isAnswered}
                onChange={next => setOrders(prev => ({ ...prev, [question.id]: next }))}
              />
              {isAnswered && !answered[question.id] && (
                <div className="mt-3 rounded-lg border bg-gray-50 p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Правильная последовательность:</p>
                  <ol className="space-y-1 text-sm text-gray-800">
                    {correctSequence.map((id, i) => {
                      const o = question.options.find(x => x.id === id)!;
                      return (
                        <li key={id} className="flex items-center gap-2">
                          <span className="font-semibold">{i + 1}.</span>
                          {o.image && <img src={o.image} alt="" className="w-8 h-8 object-contain rounded border bg-white" />}
                          {o.text}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}
            </>
          ) : (
          <div className="space-y-2">
            {question.options.map((opt, optIndex) => {
              const checked = currentSelection.includes(opt.id);
              let cls = 'border-gray-200 hover:bg-gray-50';
              if (checked && !isAnswered) cls = 'border-blue-500 bg-blue-50';
              if (isAnswered) {
                if (opt.correct) cls = 'border-emerald-500 bg-emerald-50';
                else if (checked) cls = 'border-red-500 bg-red-50';
                else cls = 'border-gray-200 opacity-60';
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  disabled={isAnswered}
                  className={`w-full flex items-start gap-3 p-3 md:p-4 rounded-lg border-2 text-left transition-colors disabled:cursor-default ${cls}`}
                >
                  <span className="text-sm font-semibold text-gray-400 mt-0.5 w-5 flex-shrink-0">{optIndex + 1}.</span>
                  <span
                    className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                      checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {checked && <Icon name="Check" size={12} className="text-white" />}
                  </span>
                  <span className={`flex flex-1 min-w-0 gap-3 ${opt.image && opt.text ? 'flex-wrap items-start' : ''}`}>
                    {opt.image && <ThumbImage src={opt.image} />}
                    {opt.text && (
                      <span className="text-sm md:text-[15px] leading-relaxed text-gray-900 flex-1 basis-60 min-w-0 whitespace-pre-line break-words">
                        {opt.text}
                      </span>
                    )}
                  </span>
                  {isAnswered && opt.correct && <Icon name="CheckCircle2" size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />}
                  {isAnswered && !opt.correct && checked && <Icon name="XCircle" size={18} className="text-red-600 flex-shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
          )}

          {!isAnswered && selectedNumbers.length > 0 && (
            <div className="mt-3 rounded-lg bg-gray-50 border px-3 py-2 text-sm text-gray-700">
              {isSequence ? 'Порядок (номера вариантов): ' : 'Выбрано: '}
              <span className="font-semibold text-gray-900">{selectedNumbers.join(isSequence ? ' → ' : ' + ')}</span>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => togglePanel('hint')} disabled={!question.hint}>
              <Icon name="Lightbulb" size={16} />
              Подсказка
            </Button>
            <Button variant="outline" size="sm" onClick={() => togglePanel('code')}>
              <Icon name="KeyRound" size={16} />
              Код ответа
            </Button>
            <Button variant="outline" size="sm" onClick={() => togglePanel('explanation')} disabled={!question.explanation}>
              <Icon name="CircleCheck" size={16} />
              Правильный ответ
            </Button>
            <Button variant="outline" size="sm">
              <Icon name="BookOpen" size={16} />
              Учебник
            </Button>
          </div>

          {isOpen('hint') && question.hint && (
            <div className="mt-3 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              <Icon name="Lightbulb" size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed whitespace-pre-line break-words min-w-0">{question.hint}</p>
            </div>
          )}

          {isOpen('code') && (
            <div className="mt-3 flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <Icon name="KeyRound" size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed min-w-0">
                {isSequence ? 'Правильная последовательность (номера вариантов): ' : 'Номера правильных ответов: '}
                <span className="font-semibold">{answerCode || '—'}</span>
              </p>
            </div>
          )}

          {isOpen('explanation') && question.explanation && (
            <div className="mt-3 flex gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              <Icon name="CircleCheck" size={18} className="flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed whitespace-pre-line break-words min-w-0">{question.explanation}</p>
            </div>
          )}

          {isAnswered && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
                answered[question.id] ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
              }`}
            >
              <Icon name={answered[question.id] ? 'CheckCircle2' : 'XCircle'} size={18} />
              {answered[question.id]
                ? 'Ответ верный'
                : isSequence
                  ? 'Ответ неверный. Правильная последовательность показана ниже'
                  : 'Ответ неверный. Правильные варианты отмечены зелёным'}
            </div>
          )}

         </div>
          <div className="sticky bottom-0 z-10 bg-white/95 backdrop-blur border-t rounded-b-lg px-4 md:px-6 py-3 flex items-center justify-between gap-2">
            <Button variant="outline" disabled={prevIndex === null} onClick={() => prevIndex !== null && setCurrent(prevIndex)}>
              <Icon name="ChevronLeft" size={16} />
              <span className="hidden sm:inline">Назад</span>
            </Button>

            {isAnswered ? (
              <Button onClick={goNextAfterAnswer} disabled={nextIndex === null && prevIndex === null}>
                Следующий вопрос
                <Icon name="ChevronRight" size={16} />
              </Button>
            ) : (
              <Button onClick={handleAnswer} disabled={!canAnswer}>
                <Icon name="Check" size={16} />
                Дать ответ
              </Button>
            )}

            <Button variant="outline" disabled={nextIndex === null} onClick={() => nextIndex !== null && setCurrent(nextIndex)}>
              <span className="hidden sm:inline">Вперёд</span>
              <Icon name="ChevronRight" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPlayer;
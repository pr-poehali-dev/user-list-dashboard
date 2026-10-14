export interface AnswerOption {
  id: string;
  text?: string;
  image?: string;
  correct: boolean;
}

export interface TicketQuestion {
  id: string;
  text?: string;
  image?: string;
  options: AnswerOption[];
}

const IMG_RED = 'https://cdn.poehali.dev/projects/5d906ec0-f138-4a20-8cee-355c791bf35f/files/deb02c08-9302-42f1-8dfa-d695d93d96ef.jpg';
const IMG_GREEN = 'https://cdn.poehali.dev/projects/5d906ec0-f138-4a20-8cee-355c791bf35f/files/e9180257-83e2-46e1-86b6-94bd463f3586.jpg';
const IMG_YELLOW = 'https://cdn.poehali.dev/projects/5d906ec0-f138-4a20-8cee-355c791bf35f/files/b73e73a8-d24d-42f8-93d0-47c9e3991dd4.jpg';

export const sampleQuestions: TicketQuestion[] = [
  {
    id: 'q1',
    text: 'Какие действия необходимо выполнить при обнаружении неисправности тормозов в пути следования?',
    options: [
      { id: 'a', text: 'Остановить поезд и доложить диспетчеру', correct: true },
      { id: 'b', text: 'Продолжить движение до станции без сообщения', correct: false },
      { id: 'c', text: 'Принять меры к снижению скорости', correct: true },
      { id: 'd', text: 'Отключить тормоза и ускориться', correct: false },
    ],
  },
  {
    id: 'q2',
    text: 'Что означает показанный на изображении сигнал светофора?',
    image: IMG_RED,
    options: [
      { id: 'a', text: 'Остановка обязательна', correct: true },
      { id: 'b', text: 'Движение разрешено с любой скоростью', correct: false },
      { id: 'c', text: 'Проезд запрещён до смены сигнала', correct: true },
    ],
  },
  {
    id: 'q3',
    image: IMG_RED,
    options: [
      { id: 'a', text: 'Красный сигнал', correct: true },
      { id: 'b', text: 'Зелёный сигнал', correct: false },
      { id: 'c', text: 'Жёлтый сигнал', correct: false },
    ],
  },
  {
    id: 'q4',
    text: 'Выберите изображения с сигналами, разрешающими движение.',
    options: [
      { id: 'a', image: IMG_GREEN, text: 'Сигнал 1', correct: true },
      { id: 'b', image: IMG_RED, text: 'Сигнал 2', correct: false },
      { id: 'c', image: IMG_YELLOW, text: 'Сигнал 3', correct: true },
    ],
  },
  {
    id: 'q5',
    text: 'Какой сигнал требует снизить скорость и быть готовым к остановке?',
    options: [
      { id: 'a', image: IMG_YELLOW, correct: true },
      { id: 'b', image: IMG_GREEN, correct: false },
      { id: 'c', image: IMG_RED, correct: false },
    ],
  },
  {
    id: 'q6',
    text: 'Какие документы обязан иметь при себе машинист?',
    options: [
      { id: 'a', text: 'Удостоверение на право управления', correct: true },
      { id: 'b', text: 'Справка о прохождении медосмотра', correct: true },
      { id: 'c', text: 'Абонемент на проезд', correct: false },
    ],
  },
];

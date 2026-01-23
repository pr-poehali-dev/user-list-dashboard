export type User = {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  group: string;
  direction: string;
  specialty: string;
  birthDate: string;
};

export type QuestionAnswer = {
  id: string;
  text: string;
  isCorrect: boolean;
};

export type QuestionData = {
  id: string;
  question: string;
  answers: QuestionAnswer[];
  hint: string;
  explanation: string;
  answerType: 'set' | 'sequence';
};

const generateUsers = () => {
  const names = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Игорь', 'Анна', 'Павел', 'Ольга', 'Сергей', 'Татьяна', 'Андрей', 'Наталья', 'Владимир', 'Светлана', 'Михаил', 'Юлия', 'Максим', 'Екатерина', 'Роман', 'Ирина', 'Виктор', 'Любовь', 'Александр', 'Галина', 'Олег', 'Вера', 'Денис', 'Людмила', 'Артем', 'Надежда'];
  const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Соколов', 'Новикова', 'Белов', 'Орлова', 'Лебедев', 'Медведева', 'Макаров', 'Зайцева', 'Попов', 'Васильева', 'Федоров', 'Алексеева', 'Николаев', 'Григорьева', 'Степанов', 'Романова', 'Семенов', 'Кузнецова', 'Захаров', 'Данилова', 'Жуков', 'Фролова', 'Костин', 'Тихонова'];
  const patronymics = ['Петрович', 'Сергеевна', 'Александрович', 'Викторовна', 'Олегович', 'Дмитриевна', 'Андреевич', 'Михайловна', 'Владимирович', 'Игоревна', 'Сергеевич', 'Алексеевна', 'Николаевич', 'Петровна', 'Дмитриевич', 'Владимировна', 'Андреевич', 'Сергеевна', 'Олегович', 'Михайловна', 'Александрович', 'Викторовна', 'Игоревич', 'Павловна', 'Владиславович', 'Анатольевна', 'Максимович', 'Геннадьевна', 'Романович', 'Евгеньевна'];
  const groups = ['Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 'Молния', 'Орлы', 'Тигры', 'Драконы'];
  const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
  const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];
  
  const users = [];
  for (let i = 1; i <= 1000; i++) {
    const birthYear = 1970 + (i % 35);
    const birthMonth = (i % 12) + 1;
    const birthDay = (i % 28) + 1;
    
    users.push({
      id: 10000000 + i,
      name: names[i % names.length],
      surname: surnames[i % surnames.length],
      patronymic: patronymics[i % patronymics.length],
      group: groups[i % groups.length],
      direction: directions[i % directions.length],
      specialty: specialties[i % specialties.length],
      birthDate: `${birthDay.toString().padStart(2, '0')}.${birthMonth.toString().padStart(2, '0')}.${birthYear}`
    });
  }
  return users;
};

export const users = generateUsers();

export const questionTree = [
  {
    id: 'safety',
    name: 'Безопасность движения',
    type: 'folder',
    children: [
      {
        id: 'safety-signals',
        name: 'Сигналы и знаки',
        type: 'folder',
        children: [
          {
            id: 'safety-signals-light',
            name: 'Световые сигналы',
            type: 'folder',
            children: [
              { id: 'q1', name: 'Что означает красный сигнал светофора?', type: 'question' },
              { id: 'q1-1', name: 'Желтый мигающий сигнал светофора', type: 'question' },
              { id: 'q1-2', name: 'Зеленый сигнал с желтым', type: 'question' },
              { id: 'q1-3', name: 'Лунно-белый сигнал', type: 'question' },
              { id: 'q1-4', name: 'Маневровые светофоры', type: 'question' }
            ]
          },
          {
            id: 'safety-signals-sound',
            name: 'Звуковые сигналы',
            type: 'folder',
            children: [
              { id: 'q2', name: 'Порядок подачи звуковых сигналов', type: 'question' },
              { id: 'q2-1', name: 'Длинный свисток — значение', type: 'question' },
              { id: 'q2-2', name: 'Три коротких — аварийная остановка', type: 'question' },
              { id: 'q2-3', name: 'Сигналы при маневрах', type: 'question' }
            ]
          },
          {
            id: 'safety-signals-hand',
            name: 'Ручные сигналы',
            type: 'folder',
            children: [
              { id: 'q2-4', name: 'Сигналы днем и ночью', type: 'question' },
              { id: 'q2-5', name: 'Сигналы остановки', type: 'question' },
              { id: 'q2-6', name: 'Сигналы тише хода', type: 'question' }
            ]
          }
        ]
      },
      {
        id: 'safety-zones',
        name: 'Зоны повышенной опасности',
        type: 'folder',
        children: [
          { id: 'q3', name: 'Правила работы в зоне повышенной опасности', type: 'question' },
          { id: 'q3-1', name: 'Работа в тоннелях', type: 'question' },
          { id: 'q3-2', name: 'Работа на мостах', type: 'question' },
          { id: 'q3-3', name: 'Работа на переездах', type: 'question' },
          { id: 'q3-4', name: 'Работа в условиях плохой видимости', type: 'question' }
        ]
      },
      {
        id: 'safety-electric',
        name: 'Электробезопасность',
        type: 'folder',
        children: [
          {
            id: 'safety-electric-contact',
            name: 'Контактная сеть',
            type: 'folder',
            children: [
              { id: 'q3-5', name: 'Работы под контактной сетью', type: 'question' },
              { id: 'q3-6', name: 'Снятие и подача напряжения', type: 'question' },
              { id: 'q3-7', name: 'Действия при обрыве провода', type: 'question' }
            ]
          },
          { id: 'q3-8', name: 'Средства защиты от поражения током', type: 'question' },
          { id: 'q3-9', name: 'Первая помощь при поражении током', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'technical',
    name: 'Техническое обслуживание',
    type: 'folder',
    children: [
      {
        id: 'technical-maintenance',
        name: 'Плановое обслуживание',
        type: 'folder',
        children: [
          {
            id: 'technical-maintenance-to1',
            name: 'ТО-1',
            type: 'folder',
            children: [
              { id: 'q4', name: 'Периодичность технического осмотра', type: 'question' },
              { id: 'q4-1', name: 'Проверка ходовой части', type: 'question' },
              { id: 'q4-2', name: 'Проверка автосцепки', type: 'question' },
              { id: 'q4-3', name: 'Проверка буксовых узлов', type: 'question' }
            ]
          },
          {
            id: 'technical-maintenance-to2',
            name: 'ТО-2',
            type: 'folder',
            children: [
              { id: 'q5', name: 'Проверка тормозной системы', type: 'question' },
              { id: 'q5-1', name: 'Регулировка тормозных колодок', type: 'question' },
              { id: 'q5-2', name: 'Проверка воздушных резервуаров', type: 'question' },
              { id: 'q5-3', name: 'Испытание тормозов на герметичность', type: 'question' }
            ]
          },
          {
            id: 'technical-maintenance-to3',
            name: 'ТО-3',
            type: 'folder',
            children: [
              { id: 'q5-4', name: 'Капитальная проверка электрооборудования', type: 'question' },
              { id: 'q5-5', name: 'Ревизия тяговых двигателей', type: 'question' },
              { id: 'q5-6', name: 'Проверка систем безопасности', type: 'question' }
            ]
          }
        ]
      },
      {
        id: 'technical-repair',
        name: 'Ремонтные работы',
        type: 'folder',
        children: [
          { id: 'q6', name: 'Аварийный ремонт на линии', type: 'question' },
          { id: 'q6-1', name: 'Текущий ремонт ТР-1', type: 'question' },
          { id: 'q6-2', name: 'Текущий ремонт ТР-2', type: 'question' },
          { id: 'q6-3', name: 'Средний ремонт', type: 'question' },
          { id: 'q6-4', name: 'Капитальный ремонт', type: 'question' },
          { id: 'q6-5', name: 'Модернизация оборудования', type: 'question' }
        ]
      },
      {
        id: 'technical-diagnostics',
        name: 'Диагностика',
        type: 'folder',
        children: [
          {
            id: 'technical-diagnostics-equipment',
            name: 'Диагностическое оборудование',
            type: 'folder',
            children: [
              { id: 'q6-6', name: 'Использование мультиметра', type: 'question' },
              { id: 'q6-7', name: 'Тепловизионный контроль', type: 'question' },
              { id: 'q6-8', name: 'Ультразвуковая дефектоскопия', type: 'question' }
            ]
          },
          { id: 'q6-9', name: 'Анализ неисправностей', type: 'question' },
          { id: 'q6-10', name: 'Прогнозирование отказов', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'operations',
    name: 'Эксплуатационная работа',
    type: 'folder',
    children: [
      {
        id: 'operations-shift',
        name: 'Смена и подготовка',
        type: 'folder',
        children: [
          { id: 'q7', name: 'Порядок приема смены', type: 'question' },
          { id: 'q7-1', name: 'Предрейсовый медосмотр', type: 'question' },
          { id: 'q7-2', name: 'Проверка документов', type: 'question' },
          { id: 'q7-3', name: 'Инструктаж перед рейсом', type: 'question' },
          { id: 'q7-4', name: 'Осмотр локомотива', type: 'question' }
        ]
      },
      {
        id: 'operations-docs',
        name: 'Документация',
        type: 'folder',
        children: [
          { id: 'q8', name: 'Ведение поездной документации', type: 'question' },
          { id: 'q8-1', name: 'Журнал машиниста', type: 'question' },
          { id: 'q8-2', name: 'Маршрутный лист', type: 'question' },
          { id: 'q8-3', name: 'Акты и рапорта', type: 'question' },
          { id: 'q8-4', name: 'Электронный документооборот', type: 'question' }
        ]
      },
      {
        id: 'operations-driving',
        name: 'Ведение поезда',
        type: 'folder',
        children: [
          {
            id: 'operations-driving-modes',
            name: 'Режимы движения',
            type: 'folder',
            children: [
              { id: 'q8-5', name: 'Трогание с места', type: 'question' },
              { id: 'q8-6', name: 'Разгон состава', type: 'question' },
              { id: 'q8-7', name: 'Движение по перегону', type: 'question' },
              { id: 'q8-8', name: 'Служебное торможение', type: 'question' },
              { id: 'q8-9', name: 'Экстренное торможение', type: 'question' }
            ]
          },
          { id: 'q8-10', name: 'Энергоэффективное вождение', type: 'question' },
          { id: 'q8-11', name: 'Движение по сложному профилю', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'regulations',
    name: 'Правила и инструкции',
    type: 'folder',
    children: [
      {
        id: 'regulations-pte',
        name: 'ПТЭ железных дорог',
        type: 'folder',
        children: [
          { id: 'q9', name: 'Общие положения ПТЭ', type: 'question' },
          { id: 'q9-1', name: 'Габариты приближения строений', type: 'question' },
          { id: 'q9-2', name: 'Нормы содержания пути', type: 'question' },
          { id: 'q9-3', name: 'Устройство и содержание СЦБ', type: 'question' },
          { id: 'q9-4', name: 'Правила движения поездов', type: 'question' }
        ]
      },
      {
        id: 'regulations-instructions',
        name: 'Инструкции',
        type: 'folder',
        children: [
          { id: 'q10', name: 'Инструкция по сигнализации', type: 'question' },
          { id: 'q10-1', name: 'Инструкция по движению поездов', type: 'question' },
          { id: 'q10-2', name: 'Инструкция машинисту локомотива', type: 'question' },
          { id: 'q10-3', name: 'Инструкция по охране труда', type: 'question' },
          { id: 'q10-4', name: 'Инструкция по действиям в аварийных ситуациях', type: 'question' }
        ]
      },
      {
        id: 'regulations-norms',
        name: 'Нормативы',
        type: 'folder',
        children: [
          { id: 'q10-5', name: 'Нормы рабочего времени', type: 'question' },
          { id: 'q10-6', name: 'Скоростные режимы', type: 'question' },
          { id: 'q10-7', name: 'Нормы расхода топлива', type: 'question' },
          { id: 'q10-8', name: 'Нормы весовых характеристик', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'emergency',
    name: 'Нестандартные ситуации',
    type: 'folder',
    children: [
      {
        id: 'emergency-failures',
        name: 'Неисправности',
        type: 'folder',
        children: [
          { id: 'q11', name: 'Действия при обнаружении неисправности', type: 'question' },
          { id: 'q11-1', name: 'Отказ тормозов', type: 'question' },
          { id: 'q11-2', name: 'Отказ автосцепки', type: 'question' },
          { id: 'q11-3', name: 'Неисправность тяговых двигателей', type: 'question' },
          { id: 'q11-4', name: 'Потеря управления', type: 'question' }
        ]
      },
      {
        id: 'emergency-stops',
        name: 'Остановки',
        type: 'folder',
        children: [
          { id: 'q12', name: 'Порядок остановки в случае опасности', type: 'question' },
          { id: 'q12-1', name: 'Вынужденная остановка на перегоне', type: 'question' },
          { id: 'q12-2', name: 'Остановка в тоннеле', type: 'question' },
          { id: 'q12-3', name: 'Остановка на мосту', type: 'question' }
        ]
      },
      {
        id: 'emergency-accidents',
        name: 'Аварийные ситуации',
        type: 'folder',
        children: [
          {
            id: 'emergency-accidents-collision',
            name: 'Столкновения и сходы',
            type: 'folder',
            children: [
              { id: 'q12-4', name: 'Предотвращение столкновения', type: 'question' },
              { id: 'q12-5', name: 'Действия при сходе вагонов', type: 'question' },
              { id: 'q12-6', name: 'Опрокидывание состава', type: 'question' }
            ]
          },
          { id: 'q12-7', name: 'Пожар на подвижном составе', type: 'question' },
          { id: 'q12-8', name: 'Разрыв поезда', type: 'question' },
          { id: 'q12-9', name: 'Повреждение пути', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'equipment',
    name: 'Локомотивное хозяйство',
    type: 'folder',
    children: [
      {
        id: 'equipment-electric',
        name: 'Электровозы',
        type: 'folder',
        children: [
          {
            id: 'equipment-electric-modern',
            name: 'Современные модели',
            type: 'folder',
            children: [
              { id: 'q13', name: '2ЭС6 «Синара»', type: 'question' },
              { id: 'q13-1', name: '2ЭС10 «Гранит»', type: 'question' },
              { id: 'q13-2', name: '3ЭС5К «Ермак»', type: 'question' },
              { id: 'q13-3', name: 'ЭП20', type: 'question' }
            ]
          },
          {
            id: 'equipment-electric-classic',
            name: 'Классические модели',
            type: 'folder',
            children: [
              { id: 'q13-4', name: 'ЧС2', type: 'question' },
              { id: 'q13-5', name: 'ЧС4', type: 'question' },
              { id: 'q13-6', name: 'ЧС7', type: 'question' },
              { id: 'q13-7', name: 'ЧС8', type: 'question' }
            ]
          }
        ]
      },
      {
        id: 'equipment-diesel',
        name: 'Тепловозы',
        type: 'folder',
        children: [
          {
            id: 'equipment-diesel-cargo',
            name: 'Грузовые',
            type: 'folder',
            children: [
              { id: 'q14', name: '2ТЭ10', type: 'question' },
              { id: 'q14-1', name: '2ТЭ116', type: 'question' },
              { id: 'q14-2', name: '2ТЭ25', type: 'question' },
              { id: 'q14-3', name: 'ТЭМ2', type: 'question' },
              { id: 'q14-4', name: 'ТЭМ18', type: 'question' }
            ]
          },
          {
            id: 'equipment-diesel-passenger',
            name: 'Пассажирские',
            type: 'folder',
            children: [
              { id: 'q14-5', name: 'ТЭП70', type: 'question' },
              { id: 'q14-6', name: 'ТЭП75', type: 'question' },
              { id: 'q14-7', name: 'ТЭП80', type: 'question' },
              { id: 'q14-8', name: '2ТЭ121', type: 'question' }
            ]
          }
        ]
      },
      {
        id: 'equipment-vintage',
        name: 'Историческая техника',
        type: 'folder',
        children: [
          {
            id: 'equipment-vintage-electric',
            name: 'Исторические электровозы',
            type: 'folder',
            children: [
              { id: 'q14-9', name: 'ВЛ10 и модификации', type: 'question' },
              { id: 'q14-10', name: 'ВЛ80', type: 'question' },
              { id: 'q14-11', name: 'ВЛ85', type: 'question' },
              { id: 'q14-12', name: '2ЭС5К «Ермак»', type: 'question' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'documentation',
    name: 'Документооборот',
    type: 'folder',
    children: [
      {
        id: 'documentation-travel',
        name: 'Путевая документация',
        type: 'folder',
        children: [
          { id: 'q15', name: 'Оформление путевых документов', type: 'question' },
          { id: 'q15-1', name: 'Формы ДУ-1', type: 'question' },
          { id: 'q15-2', name: 'Уведомления о движении', type: 'question' },
          { id: 'q15-3', name: 'Разрешения на занятие пути', type: 'question' }
        ]
      },
      {
        id: 'documentation-logs',
        name: 'Журналы учета',
        type: 'folder',
        children: [
          { id: 'q16', name: 'Журналы технического состояния', type: 'question' },
          { id: 'q16-1', name: 'Книга замечаний', type: 'question' },
          { id: 'q16-2', name: 'Журнал осмотра локомотивов', type: 'question' },
          { id: 'q16-3', name: 'Учет расхода ресурсов', type: 'question' }
        ]
      },
      {
        id: 'documentation-reporting',
        name: 'Отчетность',
        type: 'folder',
        children: [
          { id: 'q16-4', name: 'Ежесменная отчетность', type: 'question' },
          { id: 'q16-5', name: 'Месячные отчеты', type: 'question' },
          { id: 'q16-6', name: 'Анализ эксплуатационных показателей', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'environment',
    name: 'Охрана окружающей среды',
    type: 'folder',
    children: [
      {
        id: 'environment-requirements',
        name: 'Экологические требования',
        type: 'folder',
        children: [
          { id: 'q17', name: 'Нормы выбросов', type: 'question' },
          { id: 'q17-1', name: 'Контроль загрязнений', type: 'question' },
          { id: 'q17-2', name: 'Санитарная зона железной дороги', type: 'question' },
          { id: 'q17-3', name: 'Шумовое загрязнение', type: 'question' }
        ]
      },
      {
        id: 'environment-waste',
        name: 'Обращение с отходами',
        type: 'folder',
        children: [
          { id: 'q18', name: 'Утилизация отходов', type: 'question' },
          { id: 'q18-1', name: 'Масла и ГСМ', type: 'question' },
          { id: 'q18-2', name: 'Аккумуляторы', type: 'question' },
          { id: 'q18-3', name: 'Металлолом', type: 'question' }
        ]
      },
      {
        id: 'environment-green',
        name: 'Зеленые технологии',
        type: 'folder',
        children: [
          { id: 'q18-4', name: 'Энергосбережение', type: 'question' },
          { id: 'q18-5', name: 'Рекуперативное торможение', type: 'question' },
          { id: 'q18-6', name: 'Экологичные материалы', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'training',
    name: 'Обучение и развитие',
    type: 'folder',
    children: [
      {
        id: 'training-qualification',
        name: 'Повышение квалификации',
        type: 'folder',
        children: [
          { id: 'q19', name: 'Программы обучения', type: 'question' },
          { id: 'q19-1', name: 'Курсы переподготовки', type: 'question' },
          { id: 'q19-2', name: 'Семинары и тренинги', type: 'question' },
          { id: 'q19-3', name: 'Дистанционное обучение', type: 'question' }
        ]
      },
      {
        id: 'training-internship',
        name: 'Стажировка',
        type: 'folder',
        children: [
          { id: 'q20', name: 'Стажировка новых сотрудников', type: 'question' },
          { id: 'q20-1', name: 'Программа наставничества', type: 'question' },
          { id: 'q20-2', name: 'Допуск к самостоятельной работе', type: 'question' },
          { id: 'q20-3', name: 'Оценка компетенций', type: 'question' }
        ]
      },
      {
        id: 'training-certification',
        name: 'Аттестация',
        type: 'folder',
        children: [
          { id: 'q20-4', name: 'Периодическая аттестация', type: 'question' },
          { id: 'q20-5', name: 'Экзамены по правилам', type: 'question' },
          { id: 'q20-6', name: 'Проверка знаний', type: 'question' },
          { id: 'q20-7', name: 'Присвоение классов квалификации', type: 'question' }
        ]
      }
    ]
  },
  {
    id: 'health',
    name: 'Охрана труда',
    type: 'folder',
    children: [
      {
        id: 'health-medical',
        name: 'Медицинские требования',
        type: 'folder',
        children: [
          { id: 'q21', name: 'Медосмотры при поступлении', type: 'question' },
          { id: 'q21-1', name: 'Периодические медосмотры', type: 'question' },
          { id: 'q21-2', name: 'Предрейсовые осмотры', type: 'question' },
          { id: 'q21-3', name: 'Противопоказания к работе', type: 'question' }
        ]
      },
      {
        id: 'health-protection',
        name: 'Средства защиты',
        type: 'folder',
        children: [
          { id: 'q22', name: 'Спецодежда и обувь', type: 'question' },
          { id: 'q22-1', name: 'Средства индивидуальной защиты', type: 'question' },
          { id: 'q22-2', name: 'Защита органов слуха', type: 'question' },
          { id: 'q22-3', name: 'Защита глаз', type: 'question' }
        ]
      },
      {
        id: 'health-firstaid',
        name: 'Первая помощь',
        type: 'folder',
        children: [
          { id: 'q22-4', name: 'Действия при травмах', type: 'question' },
          { id: 'q22-5', name: 'Сердечно-легочная реанимация', type: 'question' },
          { id: 'q22-6', name: 'Помощь при ожогах', type: 'question' },
          { id: 'q22-7', name: 'Транспортировка пострадавших', type: 'question' }
        ]
      }
    ]
  }
];

export const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];

export const positions = [
  'Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник',
  'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов',
  'Начальник станции', 'Дежурный по станции', 'Осмотрщик вагонов', 'Кондуктор'
];

export const questionsData: Record<string, QuestionData> = {
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

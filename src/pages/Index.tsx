import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as Dialog from '@radix-ui/react-dialog';
import Icon from '@/components/ui/icon';

// Генерируем 1000 пользователей
const generateUsers = () => {
  const names = ['Алексей', 'Мария', 'Дмитрий', 'Елена', 'Игорь', 'Анна', 'Павел', 'Ольга', 'Сергей', 'Татьяна', 'Андрей', 'Наталья', 'Владимир', 'Светлана', 'Михаил', 'Юлия', 'Максим', 'Екатерина', 'Роман', 'Ирина', 'Виктор', 'Любовь', 'Александр', 'Галина', 'Олег', 'Вера', 'Денис', 'Людмила', 'Артем', 'Надежда'];
  const surnames = ['Иванов', 'Петрова', 'Сидоров', 'Козлова', 'Морозов', 'Волкова', 'Соколов', 'Новикова', 'Белов', 'Орлова', 'Лебедев', 'Медведева', 'Макаров', 'Зайцева', 'Попов', 'Васильева', 'Федоров', 'Алексеева', 'Николаев', 'Григорьева', 'Степанов', 'Романова', 'Семенов', 'Кузнецова', 'Захаров', 'Данилова', 'Жуков', 'Фролова', 'Костин', 'Тихонова'];
  const patronymics = ['Петрович', 'Сергеевна', 'Александрович', 'Викторовна', 'Олегович', 'Дмитриевна', 'Андреевич', 'Михайловна', 'Владимирович', 'Игоревна', 'Сергеевич', 'Алексеевна', 'Николаевич', 'Петровна', 'Дмитриевич', 'Владимировна', 'Андреевич', 'Сергеевна', 'Олегович', 'Михайловна', 'Александрович', 'Викторовна', 'Игоревич', 'Павловна', 'Владиславович', 'Анатольевна', 'Максимович', 'Геннадьевна', 'Романович', 'Евгеньевна'];
  const groups = ['Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 'Молния', 'Орлы', 'Тигры', 'Драконы'];
  const directions = ['Западно-Сибирская', 'Восточно-Сибирская', 'Октябрьская', 'Свердловская', 'Камень-Устинская', 'Московская', 'Северная'];
  const specialties = ['Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник', 'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов'];
  
  const users = [];
  for (let i = 1; i <= 1000; i++) {
    const birthYear = 1970 + (i % 35); // возраст от 35 до 55 лет
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

const users = generateUsers();

// Дерево вопросов с глубокой вложенностью
const questionTree = [
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
          { id: 'q13', name: 'Устройство электровоза', type: 'question' },
          { id: 'q13-1', name: 'Тяговые электродвигатели', type: 'question' },
          { id: 'q13-2', name: 'Токоприемники', type: 'question' },
          { id: 'q13-3', name: 'Преобразователи', type: 'question' },
          { id: 'q13-4', name: 'Вспомогательные машины', type: 'question' }
        ]
      },
      {
        id: 'equipment-control',
        name: 'Системы управления',
        type: 'folder',
        children: [
          { id: 'q14', name: 'Общие принципы управления', type: 'question' },
          { id: 'q14-1', name: 'Контроллер машиниста', type: 'question' },
          { id: 'q14-2', name: 'АЛСН и автостоп', type: 'question' },
          { id: 'q14-3', name: 'КЛУБ-У (комплекс локомотивных устройств безопасности)', type: 'question' },
          { id: 'q14-4', name: 'Бортовая диагностика', type: 'question' }
        ]
      },
      {
        id: 'equipment-types',
        name: 'Типы локомотивов',
        type: 'folder',
        children: [
          {
            id: 'equipment-types-passenger',
            name: 'Пассажирские',
            type: 'folder',
            children: [
              { id: 'q14-5', name: 'ЧС4 и модификации', type: 'question' },
              { id: 'q14-6', name: 'ЧС7', type: 'question' },
              { id: 'q14-7', name: 'ЭП1М', type: 'question' },
              { id: 'q14-8', name: 'ЭП2К', type: 'question' }
            ]
          },
          {
            id: 'equipment-types-freight',
            name: 'Грузовые',
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
          { id: 'q22', name: 'Средства индивидуальной защиты', type: 'question' },
          { id: 'q22-1', name: 'Спецодежда', type: 'question' },
          { id: 'q22-2', name: 'Защитная обувь', type: 'question' },
          { id: 'q22-3', name: 'Каски и очки', type: 'question' },
          { id: 'q22-4', name: 'Сигнальные жилеты', type: 'question' }
        ]
      },
      {
        id: 'health-conditions',
        name: 'Условия труда',
        type: 'folder',
        children: [
          { id: 'q22-5', name: 'Режим труда и отдыха', type: 'question' },
          { id: 'q22-6', name: 'Санитарно-бытовые условия', type: 'question' },
          { id: 'q22-7', name: 'Оценка условий труда', type: 'question' },
          { id: 'q22-8', name: 'Компенсации за вредные условия', type: 'question' }
        ]
      }
    ]
  }
];

// Данные для групп и должностей
const groups = [
  'Победители', 'Безымянная', 'Группа номер 5', 'Звездочки', 
  'Молния', 'Орлы', 'Тигры', 'Драконы', 'Стрелы', 'Вершина'
];

const positions = [
  'Машинист электровоза', 'Помощник машиниста', 'Диспетчер', 'Проводник',
  'Слесарь по ремонту', 'Электромонтер', 'Инженер-путеец', 'Составитель поездов',
  'Начальник станции', 'Дежурный по станции', 'Осмотрщик вагонов', 'Кондуктор'
];

type User = {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  group: string;
  direction: string;
  specialty: string;
  birthDate: string;
};

const Index = () => {
  const [search, setSearch] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Подключение к серверу...');
  const [sortConfigs, setSortConfigs] = useState<Array<{ key: string; direction: 'asc' | 'desc' }>>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [teacherPassword, setTeacherPassword] = useState('');
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teacherSection, setTeacherSection] = useState('users');
  const [isTeacherCollapsed, setIsTeacherCollapsed] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [questionSearch, setQuestionSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [isEditGroupModalOpen, setIsEditGroupModalOpen] = useState(false);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [editGroupName, setEditGroupName] = useState('');
  const [filters, setFilters] = useState<{
    group: string;
    direction: string;
    specialty: string;
  }>({
    group: '',
    direction: '',
    specialty: ''
  });
  const [hideSortHint, setHideSortHint] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    item: any;
  }>({ show: false, x: 0, y: 0, item: null });
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [treeData, setTreeData] = useState(questionTree);
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
          onClick={() => !isEditing && item.type === 'folder' && toggleFolder(item.id)}
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

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.surname.toLowerCase().includes(search.toLowerCase()) ||
      user.patronymic.toLowerCase().includes(search.toLowerCase())
    );

    if (filters.group) {
      filtered = filtered.filter(user => user.group === filters.group);
    }
    if (filters.direction) {
      filtered = filtered.filter(user => user.direction === filters.direction);
    }
    if (filters.specialty) {
      filtered = filtered.filter(user => user.specialty === filters.specialty);
    }

    if (sortConfigs.length > 0) {
      filtered.sort((a, b) => {
        for (const config of sortConfigs) {
          const aValue = a[config.key as keyof typeof a];
          const bValue = b[config.key as keyof typeof b];
          
          let comparison = 0;
          
          if (typeof aValue === 'string' && typeof bValue === 'string') {
            comparison = aValue.localeCompare(bValue, 'ru');
          } else if (aValue < bValue) {
            comparison = -1;
          } else if (aValue > bValue) {
            comparison = 1;
          }
          
          if (comparison !== 0) {
            return config.direction === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    return filtered;
  }, [search, sortConfigs, filters]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedUsers.slice(startIndex, endIndex);
  }, [filteredAndSortedUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedUsers.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  const handleSort = (key: string, shiftKey: boolean = false) => {
    setSortConfigs(prev => {
      if (!shiftKey) {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') {
            return [{ key, direction: 'desc' }];
          } else {
            return [];
          }
        }
        return [{ key, direction: 'asc' }];
      } else {
        const existing = prev.find(s => s.key === key);
        if (existing) {
          if (existing.direction === 'asc') {
            return prev.map(s => s.key === key ? { ...s, direction: 'desc' as const } : s);
          } else {
            return prev.filter(s => s.key !== key);
          }
        }
        return [...prev, { key, direction: 'asc' as const }];
      }
    });
    setCurrentPage(1);
  };

  const getSortIcon = (column: string) => {
    const sortIndex = sortConfigs.findIndex(s => s.key === column);
    if (sortIndex === -1) {
      return <Icon name="ArrowUpDown" size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    const config = sortConfigs[sortIndex];
    const priority = sortConfigs.length > 1 ? sortIndex + 1 : null;
    return (
      <div className="flex items-center gap-1">
        {config.direction === 'asc' 
          ? <Icon name="ArrowUp" size={14} className="text-blue-600" />
          : <Icon name="ArrowDown" size={14} className="text-blue-600" />}
        {priority && (
          <span className="text-xs font-semibold text-blue-600 bg-blue-100 rounded-full w-4 h-4 flex items-center justify-center">
            {priority}
          </span>
        )}
      </div>
    );
  };

  useEffect(() => {
    const loadingMessages = [
      'Подключение к серверу...',
      'Загрузка данных пользователей...',
      'Настройка интерфейса...',
      'Почти готово...'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      setLoadingText(loadingMessages[messageIndex]);
    }, 800);
    
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      clearInterval(messageInterval);
    }, 3200);
    
    return () => {
      clearTimeout(loadingTimer);
      clearInterval(messageInterval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="relative mb-6">
              {/* Основное кольцо загрузки */}
              <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Внутренние точки */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Система пользователей</h2>
            <p className="text-gray-600 mb-4">{loadingText}</p>
            
            {/* Прогресс бар */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
            </div>
            
            {/* Дополнительная информация */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Icon name="Wifi" size={16} className="animate-pulse" />
              <span>Установка соединения</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Интерфейс преподавателя
  if (isTeacherMode) {
    const teacherSections = [
      { id: 'questions', name: 'Вопросы', icon: 'HelpCircle' },
      { id: 'knowledge', name: 'Объем знаний', icon: 'BookOpen' },
      { id: 'plans', name: 'Планы обучения', icon: 'Calendar' },
      { id: 'groups', name: 'Группы', icon: 'Users' },
      { id: 'positions', name: 'Должности', icon: 'Briefcase' },
      { id: 'users', name: 'Пользователи', icon: 'User' }
    ];

    const renderTeacherContent = () => {
      switch (teacherSection) {
        case 'questions':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Банк вопросов</h2>
                <div className="flex items-center gap-2">
                  <Button 
                    onClick={() => setExpandedFolders(treeData.map(item => item.id))}
                    variant="outline" 
                    size="sm"
                  >
                    <Icon name="FolderOpen" size={16} />
                    Развернуть все
                  </Button>
                  <Button 
                    onClick={() => setExpandedFolders([])}
                    variant="outline" 
                    size="sm"
                  >
                    <Icon name="Folder" size={16} />
                    Свернуть все
                  </Button>
                  <Button size="sm">
                    <Icon name="Plus" size={16} />
                    Добавить
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Поиск по вопросам и папкам..."
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto relative">
                {filteredQuestionTree.length > 0 ? (
                  filteredQuestionTree.map(item => renderTreeItem(item))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Ничего не найдено
                  </div>
                )}
                
                {contextMenu.show && (
                  <div 
                    className="fixed bg-white border shadow-lg rounded-lg py-1 z-50 min-w-[180px]"
                    style={{ 
                      left: `${contextMenu.x}px`, 
                      top: `${contextMenu.y}px` 
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {contextMenu.item?.type === 'folder' ? (
                      <>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                          onClick={handleAddFolder}
                        >
                          <Icon name="FolderPlus" size={16} className="text-blue-500" />
                          Добавить каталог
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                          onClick={handleRenameItem}
                        >
                          <Icon name="Edit" size={16} className="text-orange-500" />
                          Переименовать
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                          onClick={handleDeleteItem}
                        >
                          <Icon name="Trash2" size={16} />
                          Удалить
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                          onClick={handleOpenQuestion}
                        >
                          <Icon name="Eye" size={16} className="text-blue-500" />
                          Открыть
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
                          onClick={handleRenameItem}
                        >
                          <Icon name="Edit" size={16} className="text-orange-500" />
                          Переименовать
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                          onClick={handleDeleteItem}
                        >
                          <Icon name="Trash2" size={16} />
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Icon name="Folder" size={16} className="text-yellow-500" />
                    <span>Папки: {treeData.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="FileText" size={16} className="text-blue-500" />
                    <span>Вопросов: {treeData.reduce((acc, folder) => acc + (folder.children?.length || 0), 0)}</span>
                  </div>
                </div>
              </div>

              {/* Индикатор перетаскивания рядом с курсором */}
              {draggedItem && dragCursorPos && dragOverItem && (
                <div 
                  className="fixed pointer-events-none z-50"
                  style={{ 
                    left: `${dragCursorPos.x + 20}px`, 
                    top: `${dragCursorPos.y - 10}px` 
                  }}
                >
                  {(() => {
                    const hoveredItem = (() => {
                      const findItem = (items: any[]): any => {
                        for (const item of items) {
                          if (item.id === dragOverItem) return item;
                          if (item.children) {
                            const found = findItem(item.children);
                            if (found) return found;
                          }
                        }
                        return null;
                      };
                      return findItem(treeData);
                    })();
                    
                    const canDrop = hoveredItem ? canDropInto(hoveredItem) : false;
                    
                    return (
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border-2 ${
                        canDrop 
                          ? 'bg-green-50 border-green-500' 
                          : 'bg-red-50 border-red-500'
                      }`}>
                        <Icon 
                          name={canDrop ? "Check" : "X"} 
                          size={20} 
                          className={canDrop ? "text-green-600" : "text-red-600"}
                        />
                        <span className={`text-sm font-medium ${
                          canDrop ? "text-green-700" : "text-red-700"
                        }`}>
                          {canDrop ? "Можно переместить" : "Нельзя переместить"}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Модальное окно подтверждения перемещения */}
              <Dialog.Root open={confirmMove?.show || false} onOpenChange={(open) => !open && cancelMoveAction()}>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
                    <Dialog.Title className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Icon name="Move" size={20} className="text-blue-500" />
                      Подтверждение перемещения
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-600 mb-6">
                      Вы действительно хотите переместить <span className="font-semibold">"{confirmMove?.item?.name}"</span> в папку <span className="font-semibold">"{confirmMove?.targetFolder?.name}"</span>?
                    </Dialog.Description>
                    <div className="flex items-center gap-3 justify-end">
                      <Button variant="outline" onClick={cancelMoveAction}>
                        Отмена
                      </Button>
                      <Button onClick={confirmMoveAction}>
                        Переместить
                      </Button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* Модальное окно подтверждения удаления */}
              <Dialog.Root open={confirmDelete?.show || false} onOpenChange={(open) => !open && cancelDeleteAction()}>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-50">
                    <Dialog.Title className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-600">
                      <Icon name="AlertTriangle" size={20} />
                      Опасное действие
                    </Dialog.Title>
                    <Dialog.Description className="text-gray-700 mb-6 space-y-3">
                      <p>
                        Вы собираетесь удалить {confirmDelete?.item?.type === 'folder' ? 'каталог' : 'вопрос'} <span className="font-semibold text-red-600">"{confirmDelete?.item?.name}"</span>
                        {confirmDelete?.item?.type === 'folder' && confirmDelete?.item?.children?.length > 0 && (
                          <> и все его содержимое ({confirmDelete.item.children.length} {confirmDelete.item.children.length === 1 ? 'элемент' : confirmDelete.item.children.length < 5 ? 'элемента' : 'элементов'})</>
                        )}
                      </p>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                        <strong>Это действие необратимо!</strong> Все данные будут потеряны безвозвратно.
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Для подтверждения введите точное название {confirmDelete?.item?.type === 'folder' ? 'каталога' : 'вопроса'}:
                        </label>
                        <Input
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          placeholder={confirmDelete?.item?.name}
                          className="font-mono"
                          autoFocus
                        />
                        {deleteConfirmText && deleteConfirmText !== confirmDelete?.item?.name && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <Icon name="X" size={12} />
                            Название не совпадает
                          </p>
                        )}
                        {deleteConfirmText === confirmDelete?.item?.name && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <Icon name="Check" size={12} />
                            Название совпадает
                          </p>
                        )}
                      </div>
                    </Dialog.Description>
                    <div className="flex items-center gap-3 justify-end">
                      <Button variant="outline" onClick={cancelDeleteAction}>
                        Отмена
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={confirmDeleteAction}
                        disabled={deleteConfirmText !== confirmDelete?.item?.name}
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Удалить навсегда
                      </Button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          );
        case 'knowledge':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Объем знаний</h2>
              <p className="text-gray-600">Здесь будет отображаться объем знаний студентов.</p>
            </div>
          );
        case 'plans':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Планы обучения</h2>
              <p className="text-gray-600">Здесь будут отображаться планы обучения.</p>
            </div>
          );
        case 'groups':
          if (selectedGroup) {
            // Интерфейс просмотра выбранной группы
            const groupUsers = users.filter(user => user.group === selectedGroup);
            
            return (
              <div className="bg-white rounded-lg border shadow-sm p-6">
                {/* Хлебные крошки и управление группой */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedGroup(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <Icon name="ArrowLeft" size={16} />
                      Назад к группам
                    </Button>
                    <Icon name="ChevronRight" size={16} className="text-gray-400" />
                    <h2 className="text-xl font-semibold">{selectedGroup}</h2>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setEditGroupName(selectedGroup || '');
                        setIsEditGroupModalOpen(true);
                      }}
                    >
                      <Icon name="Edit" size={16} />
                      Редактировать
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setIsDeleteGroupModalOpen(true)}
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </Button>
                  </div>
                </div>
                
                {/* Таблица пользователей группы */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ФИО</TableHead>
                        <TableHead>Специальность</TableHead>
                        <TableHead>Дата рождения</TableHead>
                        <TableHead>Дирекция</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.surname} {user.name} {user.patronymic}
                          </TableCell>
                          <TableCell>{user.specialty}</TableCell>
                          <TableCell>{user.birthDate}</TableCell>
                          <TableCell>{user.direction}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  Пользователей в группе: {groupUsers.length}
                </div>
              </div>
            );
          }
          
          // Список всех групп
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Группы</h2>
                <Button size="sm">
                  <Icon name="Plus" size={16} />
                  Добавить группу
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>Пользователей</TableHead>
                      <TableHead className="w-24">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groups.map((group, index) => {
                      const userCount = users.filter(user => user.group === group).length;
                      return (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell 
                            className="font-medium cursor-pointer hover:text-blue-600"
                            onClick={() => setSelectedGroup(group)}
                          >
                            {group}
                          </TableCell>
                          <TableCell className="text-gray-600">{userCount}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedGroup(group)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Icon name="Eye" size={14} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Всего групп: {groups.length}
              </div>
            </div>
          );
        case 'positions':
          return (
            <div className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Должности</h2>
                <Button size="sm">
                  <Icon name="Plus" size={16} />
                  Добавить должность
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {positions.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{position}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                Всего должностей: {positions.length}
              </div>
            </div>
          );
        case 'users':
        default:
          return (
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold">Пользователи</h2>
                <Button className="flex items-center gap-2">
                  <Icon name="Plus" size={16} />
                  Добавить пользователя
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={(e) => handleSort('id', e.shiftKey)}
                    >
                      <div className="flex items-center justify-between">
                        Табельный номер
                        {getSortIcon('id')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={(e) => handleSort('surname', e.shiftKey)}
                    >
                      <div className="flex items-center justify-between">
                        ФИО
                        {getSortIcon('surname')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={(e) => handleSort('group', e.shiftKey)}
                    >
                      <div className="flex items-center justify-between">
                        Группа
                        {getSortIcon('group')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={(e) => handleSort('direction', e.shiftKey)}
                    >
                      <div className="flex items-center justify-between">
                        Направление
                        {getSortIcon('direction')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 select-none"
                      onClick={(e) => handleSort('specialty', e.shiftKey)}
                    >
                      <div className="flex items-center justify-between">
                        Специальность
                        {getSortIcon('specialty')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((user) => (
                    <TableRow 
                      key={user.id} 
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.surname} {user.name} {user.patronymic}</TableCell>
                      <TableCell>{user.group}</TableCell>
                      <TableCell>{user.direction}</TableCell>
                      <TableCell>{user.specialty}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between p-4 border-t">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Показано {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredAndSortedUsers.length)} из {filteredAndSortedUsers.length}
                  </span>
                  <Select 
                    value={pageSize.toString()} 
                    onValueChange={(value) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  <span className="text-sm px-3 py-1">
                    {currentPage} из {totalPages}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Навигация преподавателя */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="GraduationCap" size={24} className="text-green-600" />
                  <span className="font-semibold text-lg">Панель преподавателя</span>
                </div>
                {/* Кнопка сворачивания - показывается на мобильных */}
                <Button
                  onClick={() => setIsTeacherCollapsed(!isTeacherCollapsed)}
                  variant="outline"
                  size="sm"
                  className="md:hidden"
                >
                  <Icon name={isTeacherCollapsed ? "ChevronDown" : "ChevronUp"} size={16} />
                </Button>
              </div>
              <Button 
                onClick={() => {
                  setIsTeacherMode(false);
                  setTeacherSection('users');
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Icon name="LogOut" size={16} />
                <span className="hidden sm:inline">Выйти</span>
              </Button>
            </div>
            
            {/* Навигационные разделы - адаптивные */}
            <div className={`${isTeacherCollapsed ? 'hidden' : 'block'} md:block`}>
              <div className="flex flex-col md:flex-row border-t">
                {teacherSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setTeacherSection(section.id);
                      setIsTeacherCollapsed(true); // Сворачиваем после выбора на мобильных
                    }}
                    className={`flex items-center gap-2 px-6 py-3 border-b-2 md:border-b-2 md:border-r transition-colors ${
                      teacherSection === section.id 
                        ? 'border-green-600 text-green-600 bg-green-50' 
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                  >
                    <Icon name={section.icon} size={16} />
                    {section.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Контент преподавателя */}
        <div className="max-w-6xl mx-auto p-8">
          {teacherSection === 'users' && (
            <div className="mb-6">
              <div className="relative max-w-md">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Поиск пользователей..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          {renderTeacherContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative max-w-md">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Поиск пользователей..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsTeacherModalOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Icon name="GraduationCap" size={16} />
              Преподаватель
            </Button>
            
            <Button 
              onClick={() => setIsAdmin(!isAdmin)}
              variant={isAdmin ? "default" : "outline"}
              className="flex items-center gap-2"
            >
              <Icon name="Shield" size={16} />
              {isAdmin ? 'Режим администратора' : 'Администратор'}
            </Button>
          </div>
        </div>

        {/* Подсказка о множественной сортировке */}
        {sortConfigs.length === 0 && !hideSortHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between gap-3 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <Icon name="Info" size={16} />
              <span>
                <strong>Совет:</strong> Кликните по заголовку для сортировки. Удерживайте <kbd className="px-1.5 py-0.5 bg-white border rounded text-xs font-mono">Shift</kbd> для сортировки по нескольким столбцам.
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideSortHint(true)}
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-100 whitespace-nowrap"
            >
              Больше не показывать
            </Button>
          </div>
        )}

        {/* Панель фильтров */}
        <div className="bg-white rounded-lg border shadow-sm p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Icon name="Filter" size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Фильтры:</span>
            </div>
            
            <div className="flex-1 flex items-center gap-3 flex-wrap">
              <Select 
                value={filters.group || 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, group: value === 'all' ? '' : value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Все группы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все группы</SelectItem>
                  {groups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.direction || 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, direction: value === 'all' ? '' : value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Все дирекции" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все дирекции</SelectItem>
                  {Array.from(new Set(users.map(u => u.direction))).sort().map((dir) => (
                    <SelectItem key={dir} value={dir}>{dir}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.specialty || 'all'} 
                onValueChange={(value) => {
                  setFilters(prev => ({ ...prev, specialty: value === 'all' ? '' : value }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Все специальности" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все специальности</SelectItem>
                  {Array.from(new Set(users.map(u => u.specialty))).sort().map((spec) => (
                    <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(filters.group || filters.direction || filters.specialty) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilters({ group: '', direction: '', specialty: '' });
                  setCurrentPage(1);
                }}
                className="flex items-center gap-2"
              >
                <Icon name="X" size={14} />
                Сбросить
              </Button>
            )}
          </div>
          
          {(filters.group || filters.direction || filters.specialty) && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Info" size={14} />
              <span>Активные фильтры:</span>
              {filters.group && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  Группа: {filters.group}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-blue-900"
                    onClick={() => setFilters(prev => ({ ...prev, group: '' }))}
                  />
                </span>
              )}
              {filters.direction && (
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded">
                  Дирекция: {filters.direction}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-green-900"
                    onClick={() => setFilters(prev => ({ ...prev, direction: '' }))}
                  />
                </span>
              )}
              {filters.specialty && (
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  Специальность: {filters.specialty}
                  <Icon 
                    name="X" 
                    size={12} 
                    className="cursor-pointer hover:text-purple-900"
                    onClick={() => setFilters(prev => ({ ...prev, specialty: '' }))}
                  />
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead 
                  className="w-20 font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={(e) => handleSort('id', e.shiftKey)}
                >
                  <div className="flex items-center gap-2">
                    ID
                    {getSortIcon('id')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={(e) => handleSort('name', e.shiftKey)}
                >
                  <div className="flex items-center gap-2">
                    Имя
                    {getSortIcon('name')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={(e) => handleSort('surname', e.shiftKey)}
                >
                  <div className="flex items-center gap-2">
                    Фамилия
                    {getSortIcon('surname')}
                  </div>
                </TableHead>
                <TableHead 
                  className="font-semibold cursor-pointer group hover:bg-gray-100 transition-colors select-none"
                  onClick={(e) => handleSort('patronymic', e.shiftKey)}
                >
                  <div className="flex items-center gap-2">
                    Отчество
                    {getSortIcon('patronymic')}
                  </div>
                </TableHead>
                {isAdmin && <TableHead className="font-semibold">Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-gray-50 cursor-pointer" 
                    onClick={() => {
                      setSelectedUser(user);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    <TableCell className="font-mono text-gray-600">#{user.id}</TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="font-medium">{user.surname}</TableCell>
                    <TableCell>{user.patronymic}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Icon name="MoreHorizontal" size={16} />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-gray-500">
                    <Icon name="Users" size={48} className="mx-auto mb-2 text-gray-300" />
                    <p>Пользователи не найдены</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Всего: {users.length} | Найдено: {filteredAndSortedUsers.length}
              {sortConfigs.length > 0 && (
                <span className="ml-2 text-blue-600">
                  • Сортировка: {sortConfigs.map((s, i) => {
                    const label = s.key === 'id' ? 'ID' : s.key === 'name' ? 'Имя' : s.key === 'surname' ? 'Фамилия' : s.key;
                    return `${i > 0 ? ', ' : ''}${label} ${s.direction === 'asc' ? '↑' : '↓'}`;
                  }).join('')}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Строк на странице:</span>
              <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
              </Button>
              
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const showEllipsis = totalPages > 7;
                  
                  if (!showEllipsis) {
                    // Показываем все страницы если их мало
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={i === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(i)}
                          className="w-8 h-8 p-0"
                        >
                          {i}
                        </Button>
                      );
                    }
                  } else {
                    // Умная пагинация с эллипсами
                    // Всегда показываем первую страницу
                    pages.push(
                      <Button
                        key={1}
                        variant={1 === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(1)}
                        className="w-8 h-8 p-0"
                      >
                        1
                      </Button>
                    );
                    
                    // Левый эллипсис если нужен
                    if (currentPage > 4) {
                      pages.push(<span key="ellipsis-left" className="px-2 text-gray-400">...</span>);
                    }
                    
                    // Страницы вокруг текущей
                    const startPage = Math.max(2, currentPage - 1);
                    const endPage = Math.min(totalPages - 1, currentPage + 1);
                    
                    for (let i = startPage; i <= endPage; i++) {
                      if (i !== 1 && i !== totalPages) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                    }
                    
                    // Правый эллипсис если нужен
                    if (currentPage < totalPages - 3) {
                      pages.push(<span key="ellipsis-right" className="px-2 text-gray-400">...</span>);
                    }
                    
                    // Всегда показываем последнюю страницу
                    if (totalPages > 1) {
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={totalPages === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                  }
                  
                  return pages;
                })()}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Icon name="ShieldCheck" size={16} />
              <span className="font-medium">Режим администратора активен</span>
            </div>
          </div>
        )}

        {/* Модальное окно авторизации */}
        <Dialog.Root open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="UserCheck" size={20} className="text-white" />
                </div>
                Подтверждение авторизации
              </Dialog.Title>
              
              {selectedUser && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">ФИО</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedUser.surname} {selectedUser.name} {selectedUser.patronymic}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Дата рождения</label>
                      <p className="text-gray-900">{selectedUser.birthDate}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Дирекция</label>
                      <p className="text-gray-900">{selectedUser.direction}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Табельный номер</label>
                      <p className="font-mono text-gray-900">#{selectedUser.id}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Специальность</label>
                      <p className="text-gray-900">{selectedUser.specialty}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-600">Группа</label>
                      <p className="text-gray-900">{selectedUser.group}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4 border-t">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        // Здесь будет логика авторизации
                        alert(`Пользователь ${selectedUser.surname} ${selectedUser.name} авторизован`);
                        setIsAuthModalOpen(false);
                      }}
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Авторизироваться
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setIsAuthModalOpen(false)}
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отменить
                    </Button>
                  </div>
                </div>
              )}
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Модальное окно авторизации преподавателя */}
        <Dialog.Root open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Icon name="GraduationCap" size={20} className="text-white" />
                </div>
                Авторизация преподавателя
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Пароль доступа
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Введите пароль"
                      value={teacherPassword}
                      onChange={(e) => {
                        setTeacherPassword(e.target.value);
                        setPasswordError('');
                      }}
                      className="w-full pr-10"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (teacherPassword === 'password') {
                            setIsTeacherMode(true);
                            setIsTeacherModalOpen(false);
                            setTeacherPassword('');
                            setPasswordError('');
                            setShowPassword(false);
                          } else {
                            setPasswordError('Неверный пароль');
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                    >
                      <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <Icon name="AlertCircle" size={14} />
                      {passwordError}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      if (teacherPassword === 'password') {
                        setIsTeacherMode(true);
                        setIsTeacherModalOpen(false);
                        setTeacherPassword('');
                        setPasswordError('');
                        setShowPassword(false);
                      } else {
                        setPasswordError('Неверный пароль');
                      }
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Авторизоваться
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsTeacherModalOpen(false);
                      setTeacherPassword('');
                      setPasswordError('');
                      setShowPassword(false);
                    }}
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2" />
                    Назад
                  </Button>
                </div>
              </div>
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Модальное окно редактирования группы */}
        <Dialog.Root open={isEditGroupModalOpen} onOpenChange={setIsEditGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Icon name="Edit" size={20} className="text-white" />
                </div>
                Редактировать группу
              </Dialog.Title>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-2">
                    Название группы
                  </label>
                  <Input
                    placeholder="Введите название группы"
                    value={editGroupName}
                    onChange={(e) => setEditGroupName(e.target.value)}
                    className="w-full"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && editGroupName.trim()) {
                        // Здесь будет логика сохранения
                        alert(`Группа переименована на "${editGroupName}"`);
                        setSelectedGroup(editGroupName);
                        setIsEditGroupModalOpen(false);
                      }
                    }}
                  />
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!editGroupName.trim()}
                    onClick={() => {
                      // Здесь будет логика сохранения
                      alert(`Группа переименована на "${editGroupName}"`);
                      setSelectedGroup(editGroupName);
                      setIsEditGroupModalOpen(false);
                    }}
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsEditGroupModalOpen(false)}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </div>
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        {/* Модальное окно удаления группы */}
        <Dialog.Root open={isDeleteGroupModalOpen} onOpenChange={setIsDeleteGroupModalOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg">
              <Dialog.Title className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-white" />
                </div>
                Удаление группы
              </Dialog.Title>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="AlertTriangle" size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">
                        Вы действительно хотите удалить группу?
                      </h4>
                      <p className="text-sm text-red-700">
                        Все пользователи будут перемещены в "Без группы"
                      </p>
                    </div>
                  </div>
                </div>
                
                {selectedGroup && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Удаляемая группа:</p>
                    <p className="font-semibold text-gray-900">{selectedGroup}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Пользователей: {users.filter(user => user.group === selectedGroup).length}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      // Здесь будет логика удаления
                      alert(`Группа "${selectedGroup}" удалена. Пользователи перемещены в "Без группы"`);
                      setSelectedGroup(null);
                      setIsDeleteGroupModalOpen(false);
                    }}
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить группу
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsDeleteGroupModalOpen(false)}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Отменить
                  </Button>
                </div>
              </div>
              
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <Icon name="X" size={16} />
                <span className="sr-only">Закрыть</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default Index;
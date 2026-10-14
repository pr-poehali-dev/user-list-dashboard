import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';

interface UserAuthProfileProps {
  user: User;
  onBack: () => void;
  onLogin: () => void;
}

const UserAuthProfile = ({ user, onBack, onLogin }: UserAuthProfileProps) => {
  const fields = [
    { label: 'Фамилия', value: user.surname },
    { label: 'Имя', value: user.name },
    { label: 'Отчество', value: user.patronymic },
    { label: 'Дирекция', value: user.direction },
    { label: 'Табельный номер', value: user.id },
    { label: 'Основная должность', value: user.specialty },
    { label: 'Группа', value: user.group },
  ];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <Icon name="ArrowLeft" size={16} />
          Назад к списку
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={28} className="text-white" />
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">{user.surname} {user.name} {user.patronymic}</p>
          <p className="text-sm text-gray-500">Табельный № {user.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {fields.map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-gray-900">{String(value)}</p>
          </div>
        ))}
        {user.combinedSpecialty.length > 0 && (
          <div className="bg-gray-50 rounded-lg px-4 py-3 col-span-2">
            <p className="text-xs text-gray-500 mb-1">Совмещаемые должности</p>
            <div className="flex flex-wrap gap-1.5">
              {user.combinedSpecialty.map((cs, i) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">{cs}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={onLogin} className="flex items-center gap-2">
        <Icon name="LogIn" size={16} />
        Авторизоваться
      </Button>
    </div>
  );
};

export default UserAuthProfile;

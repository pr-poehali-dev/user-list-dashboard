import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';
import { tickets } from '@/data/ticketsData';
import TicketsTable from '@/components/TicketsTable';

const userSections = [
  { id: 'control', name: 'Контроль', icon: 'ClipboardCheck' },
  { id: 'attestation', name: 'Аттестация', icon: 'Award' },
];

interface UserLayoutProps {
  user: User;
  onExit: () => void;
}

const UserLayout = ({ user, onExit }: UserLayoutProps) => {
  const [section, setSection] = useState('control');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Icon name="User" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{user.surname} {user.name} {user.patronymic}</h1>
                <p className="text-xs md:text-sm text-gray-600 hidden md:block">{user.specialty}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onExit} className="flex items-center gap-2" size="sm">
              <Icon name="LogOut" size={16} />
              <span className="hidden sm:inline">Выйти</span>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row border-t">
            {userSections.map(s => (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 md:border-r transition-colors ${
                  section === s.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <Icon name={s.icon} size={16} />
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {section === 'control' && (
          <TicketsTable title="Контроль" tickets={tickets.filter(t => t.kind === 'control')} />
        )}
        {section === 'attestation' && (
          <TicketsTable title="Аттестация" tickets={tickets.filter(t => t.kind === 'attestation')} />
        )}
      </div>
    </div>
  );
};

export default UserLayout;

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { User } from '@/data/mockData';
import { tickets, Ticket } from '@/data/ticketsData';
import TicketsTable from '@/components/TicketsTable';
import TicketPlayer from '@/components/TicketPlayer';

interface UserLayoutProps {
  user: User;
  onExit: () => void;
}

const modes = [
  { id: 'control', name: 'Пройти контроль', description: 'Проверка знаний по билету', icon: 'ClipboardCheck' },
  { id: 'attestation', name: 'Пройти аттестацию', description: 'Итоговая аттестация по билету', icon: 'Award' },
];

const UserLayout = ({ user, onExit }: UserLayoutProps) => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  if (activeTicket) {
    return <TicketPlayer ticket={activeTicket} onExit={() => setActiveTicket(null)} />;
  }

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

          <div className="flex border-t">
            <div className="flex items-center gap-2 px-6 py-3 border-b-2 border-blue-600 text-blue-600 bg-blue-50">
              <Icon name="Ticket" size={16} />
              Билеты
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <TicketsTable title="Билеты" tickets={tickets} onSelect={setSelectedTicket} />
      </div>

      <Dialog open={!!selectedTicket} onOpenChange={open => !open && setSelectedTicket(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Билет № {selectedTicket?.number}</DialogTitle>
            <DialogDescription>{selectedTicket?.title}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {modes.map(m => (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === 'attestation' && selectedTicket) setActiveTicket(selectedTicket);
                  setSelectedTicket(null);
                }}
                className="w-full flex items-center gap-3 p-4 rounded-lg border hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Icon name={m.icon} size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserLayout;
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MtlsErrorScreenProps {
  retrying: boolean;
  retryProgress: number;
  retryStatus: string;
  retryFailed: boolean;
  onRetry: () => void;
  onContinue: () => void;
}

const MtlsErrorScreen = ({
  retrying,
  retryProgress,
  retryStatus,
  retryFailed,
  onRetry,
  onContinue,
}: MtlsErrorScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-8 max-w-lg w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
            <Icon name="ShieldX" size={36} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Ошибка подключения</h2>
          <p className="text-gray-500 text-sm">mTLS Handshake Failed</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-5 font-mono text-sm">
          <div className="flex items-center gap-2 mb-3 text-red-600">
            <Icon name="AlertTriangle" size={14} />
            <span className="font-semibold">SSL/TLS ERROR 525</span>
          </div>
          <div className="space-y-1 text-gray-600 text-xs leading-relaxed">
            <p><span className="text-gray-400">timestamp:</span> {new Date().toISOString()}</p>
            <p><span className="text-gray-400">error:</span> <span className="text-red-600">CERTIFICATE_VERIFY_FAILED</span></p>
            <p><span className="text-gray-400">detail:</span> Клиентский сертификат не прошёл проверку подлинности на сервере. Цепочка доверия нарушена.</p>
            <p><span className="text-gray-400">issuer:</span> CN=RZD Corporate CA, O=OAO RZD, C=RU</p>
            <p><span className="text-gray-400">subject:</span> CN=client.edu.rzd.ru</p>
            <p><span className="text-gray-400">reason:</span> unable to get local issuer certificate</p>
            <p><span className="text-gray-400">depth:</span> 0</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
          <div className="flex gap-2">
            <Icon name="Info" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-amber-800 text-xs leading-relaxed">
              Сертификат безопасности вашей рабочей станции не распознан сервером. Убедитесь, что корневой сертификат корпоративного CA установлен в хранилище доверенных сертификатов, либо обратитесь в службу информационной безопасности.
            </p>
          </div>
        </div>

        {retrying && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono">{retryStatus}</span>
              <span className="text-xs text-blue-600 font-mono">{retryProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${retryProgress}%` }}
              />
            </div>
          </div>
        )}

        {retryFailed && (
          <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 animate-in fade-in slide-in-from-top-1 duration-300">
            <Icon name="XCircle" size={14} className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-xs">Повторное подключение не удалось — сервер отклонил сертификат</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onRetry}
            disabled={retrying}
          >
            <Icon name="RefreshCw" size={14} className={retrying ? 'animate-spin' : ''} />
            <span className="ml-2">{retrying ? 'Подключение...' : 'Повторить'}</span>
          </Button>
          <Button
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            onClick={onContinue}
            disabled={retrying}
          >
            <Icon name="LogIn" size={14} />
            <span className="ml-2">Продолжить всё равно</span>
          </Button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Код ошибки: ERR_BAD_SSL_CLIENT_AUTH_CERT
        </p>
      </div>
    </div>
  );
};

export default MtlsErrorScreen;

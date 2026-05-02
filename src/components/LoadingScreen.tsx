import Icon from '@/components/ui/icon';

interface LoadingScreenProps {
  loadingText: string;
}

const LoadingScreen = ({ loadingText }: LoadingScreenProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 mx-auto border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">Система пользователей</h2>
          <p className="text-gray-600 mb-4">{loadingText}</p>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Icon name="Wifi" size={16} className="animate-pulse" />
            <span>Установка соединения</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;

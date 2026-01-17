import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  const isEmployer = user.user_type === 'employer';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>Воркеры</h1>
            <span className="text-sm text-gray-500">
              {isEmployer ? 'Личный кабинет работодателя' : 'Личный кабинет соискателя'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="Home" size={18} />
              <span className="ml-2">Главная</span>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} />
              <span className="ml-2">Выход</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-16 h-16 ${isEmployer ? 'bg-blue-500' : 'bg-green-500'} rounded-full flex items-center justify-center`}>
              <Icon name={isEmployer ? 'Building2' : 'User'} size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${
            isEmployer ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
          }`}>
            {isEmployer ? '👔 Работодатель' : '💼 Соискатель'}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isEmployer ? (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/employer/create-vacancy')}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Plus" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Создать вакансию</h3>
                <p className="text-gray-600 text-sm">Опубликуйте новую вакансию для привлечения кандидатов</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/employer/vacancies')}>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="FileText" size={24} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Мои вакансии</h3>
                <p className="text-gray-600 text-sm">Управляйте опубликованными вакансиями</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Users" size={24} className="text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Отклики</h3>
                <p className="text-gray-600 text-sm">Просматривайте и управляйте откликами кандидатов</p>
              </Card>
            </>
          ) : (
            <>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Search" size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Поиск работы</h3>
                <p className="text-gray-600 text-sm">Найдите подходящие вакансии</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="FileText" size={24} className="text-blue-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Моё резюме</h3>
                <p className="text-gray-600 text-sm">Создайте или отредактируйте резюме</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Send" size={24} className="text-green-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Мои отклики</h3>
                <p className="text-gray-600 text-sm">Просмотрите статус ваших откликов</p>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon name="Star" size={24} className="text-yellow-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Избранное</h3>
                <p className="text-gray-600 text-sm">Сохранённые вакансии</p>
              </Card>
            </>
          )}
        </div>

        <Card className="mt-6 p-6 bg-gray-50">
          <div className="flex items-start gap-4">
            <Icon name="Info" size={24} className="text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Добро пожаловать!</h3>
              <p className="text-gray-600 text-sm">
                {isEmployer 
                  ? 'Ваш личный кабинет работодателя готов к работе. Создайте первую вакансию и начните поиск сотрудников.'
                  : 'Ваш личный кабинет соискателя готов к работе. Заполните резюме и начните искать подходящие вакансии.'
                }
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
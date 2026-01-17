import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>ВОРКЕРЫ</h1>
          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Вакансии</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Избранное</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Отклики</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Резюме</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/employer/vacancies">
            <Button variant="ghost" className="text-sm text-gray-600 hover:text-gray-900">
              Для работодателей
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">{user?.name}</span>
              <Button onClick={() => navigate('/dashboard')} className="text-sm">
                Личный кабинет
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/register')} className="text-sm text-gray-600 hover:text-gray-900">
                Регистрация
              </Button>
              <Button variant="outline" onClick={() => navigate('/login')} className="text-sm">
                Войти
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Vacancy {
  id: number;
  title: string;
  location: string;
  salary: string;
  status: 'active' | 'moderation' | 'archived';
  views: number;
  applications: number;
  publishedDate: string;
}

const EmployerVacancies = () => {
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/91a5be6f-4645-488b-b001-07c6502a8dd7?employer_id=1');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const mappedVacancies = data.map((v: any) => ({
          id: v.id,
          title: v.title,
          location: v.city,
          salary: v.salary_from && v.salary_to 
            ? `${v.salary_from.toLocaleString()} - ${v.salary_to.toLocaleString()} ₽`
            : v.salary_from 
            ? `от ${v.salary_from.toLocaleString()} ₽`
            : 'По договорённости',
          status: v.status || 'active',
          views: v.views_count || 0,
          applications: v.applications_count || 0,
          publishedDate: new Date(v.created_at).toLocaleDateString('ru-RU', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })
        }));
        
        setVacancies(mappedVacancies);
      } catch (error) {
        console.error('Failed to load vacancies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVacancies();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: 'Активна', variant: 'default' as const },
      moderation: { label: 'На модерации', variant: 'secondary' as const },
      archived: { label: 'Архив', variant: 'outline' as const }
    };
    
    const statusData = statusMap[status as keyof typeof statusMap];
    return (
      <Badge variant={statusData.variant}>
        {statusData.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            Воркеры
          </h1>
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="outline">
                <Icon name="Home" size={16} className="mr-2" />
                На главную
              </Button>
            </Link>
            <Link to="/employer/create-vacancy">
              <Button>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать вакансию
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-2">Мои вакансии</h2>
            <p className="text-gray-600">Управляйте своими вакансиями и откликами</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-4">Загрузка...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Briefcase" size={24} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Активных вакансий</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {vacancies.filter(v => v.status === 'active').length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Icon name="Eye" size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Всего просмотров</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {vacancies.reduce((sum, v) => sum + v.views, 0)}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Всего откликов</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {vacancies.reduce((sum, v) => sum + v.applications, 0)}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {!loading && <div className="space-y-4">
          {vacancies.map(vacancy => (
            <Card key={vacancy.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{vacancy.title}</h3>
                    {getStatusBadge(vacancy.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {vacancy.location}
                    </span>
                    <span className="font-medium text-gray-900">{vacancy.salary}</span>
                    <span className="flex items-center gap-1">
                      <Icon name="Calendar" size={14} />
                      {vacancy.publishedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Eye" size={16} className="text-gray-400" />
                      <span className="text-gray-600">{vacancy.views} просмотров</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} className="text-gray-400" />
                      <span className="text-gray-600">{vacancy.applications} откликов</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/vacancy/${vacancy.id}`)}
                  >
                    <Icon name="Eye" size={16} className="mr-2" />
                    Просмотр
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/employer/vacancy/${vacancy.id}/edit`)}
                  >
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                  {vacancy.status === 'active' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Icon name="Archive" size={16} className="mr-2" />
                      Архивировать
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {vacancies.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <Icon name="Briefcase" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">У вас пока нет вакансий</h3>
            <p className="text-gray-600 mb-6">Создайте первую вакансию, чтобы начать поиск сотрудников</p>
            <Button onClick={() => navigate('/employer/create-vacancy')}>
              <Icon name="Plus" size={16} className="mr-2" />
              Создать вакансию
            </Button>
          </Card>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default EmployerVacancies;
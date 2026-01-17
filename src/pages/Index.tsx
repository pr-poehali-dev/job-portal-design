import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Vacancy {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  tags: string[];
  isRecommended?: boolean;
  isFavorite?: boolean;
  image?: string;
  rating?: number;
  reviews?: number;
  priceFrom?: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://functions.poehali.dev/c37d9d16-227a-44d0-b385-cb5d560dbffc')
      .then(res => res.json())
      .then(data => {
        const mappedVacancies = data.map((v: any, index: number) => ({
          ...v,
          isRecommended: index < 2
        }));
        setVacancies(mappedVacancies);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load vacancies:', err);
        setLoading(false);
      });
  }, []);



  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleApply = (id: number) => {
    setApplied(prev => [...prev, id]);
  };

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vacancy.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || vacancy.location.includes(selectedCity);
    return matchesSearch && matchesCity;
  });

  const recommendedVacancies = filteredVacancies.filter(v => v.isRecommended);
  const otherVacancies = filteredVacancies.filter(v => !v.isRecommended);

  return (
    <div className="min-h-screen bg-white">
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

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">ВРЕМЯ РЕАЛЬНО НАЙТИ РАБОТУ!</h2>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Название вакансии или компания"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base bg-white"
              />
            </div>
            <div className="w-64">
              <Input
                placeholder="Город"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="h-12 text-base bg-white"
              />
            </div>
            <Button className="h-12 px-8 bg-primary hover:bg-primary/90">
              Найти работу
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-4">Загрузка вакансий...</p>
          </div>
        )}
        
        {!loading && recommendedVacancies.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Icon name="Sparkles" size={20} className="text-primary" />
              <h3 className="text-xl font-semibold text-gray-900">Рекомендации для вас</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedVacancies.map(vacancy => (
                <Card key={vacancy.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate(`/vacancy/${vacancy.id}`)}>
                  <div className="relative">
                    <img 
                      src={vacancy.image || 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/908cd9c2-2fb1-4827-8c90-49133bc8ae55.jpg'} 
                      alt={vacancy.title}
                      className="w-full h-48 object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(vacancy.id);
                      }}
                      className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm"
                    >
                      <Icon 
                        name="Heart" 
                        size={20}
                        className={favorites.includes(vacancy.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </Button>
                    {vacancy.isRecommended && (
                      <Badge className="absolute top-3 left-3 bg-primary text-white border-0">
                        Топ выбор
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Icon 
                          key={i} 
                          name="Star" 
                          size={14} 
                          className={i < (vacancy.rating || 4) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">({vacancy.reviews || 42})</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{vacancy.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{vacancy.company}</p>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                      <Icon name="MapPin" size={14} />
                      <span>{vacancy.location}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">{vacancy.priceFrom || '50 000'} ₽</span>
                      <span className="text-sm text-gray-500">/месяц</span>
                    </div>
                    {applied.includes(vacancy.id) ? (
                      <Button disabled className="w-full" variant="outline">
                        <Icon name="Check" size={16} className="mr-2" />
                        Откликнулись
                      </Button>
                    ) : (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(vacancy.id);
                        }} 
                        className="w-full"
                      >
                        Откликнуться
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!loading && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Все вакансии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVacancies.map(vacancy => (
              <Card key={vacancy.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate(`/vacancy/${vacancy.id}`)}>
                <div className="relative">
                  <img 
                    src={vacancy.image || 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/908cd9c2-2fb1-4827-8c90-49133bc8ae55.jpg'} 
                    alt={vacancy.title}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(vacancy.id);
                    }}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white shadow-sm"
                  >
                    <Icon 
                      name="Heart" 
                      size={20}
                      className={favorites.includes(vacancy.id) ? "fill-red-500 text-red-500" : "text-gray-600"}
                    />
                  </Button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Icon 
                        key={i} 
                        name="Star" 
                        size={14} 
                        className={i < (vacancy.rating || 4) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({vacancy.reviews || 42})</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{vacancy.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{vacancy.company}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                    <Icon name="MapPin" size={14} />
                    <span>{vacancy.location}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-gray-900">{vacancy.priceFrom || '50 000'} ₽</span>
                    <span className="text-sm text-gray-500">/месяц</span>
                  </div>
                  {applied.includes(vacancy.id) ? (
                    <Button disabled className="w-full" variant="outline">
                      <Icon name="Check" size={16} className="mr-2" />
                      Откликнулись
                    </Button>
                  ) : (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(vacancy.id);
                      }} 
                      className="w-full"
                    >
                      Откликнуться
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
        )}

        {!loading && filteredVacancies.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Вакансии не найдены</p>
          </div>
        )}
      </div>

      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Соискателям</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Поиск вакансий</a></li>
                <li><a href="#" className="hover:text-gray-900">Мои резюме</a></li>
                <li><a href="#" className="hover:text-gray-900">Отклики</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Работодателям</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Разместить вакансию</a></li>
                <li><a href="#" className="hover:text-gray-900">Найти резюме</a></li>
                <li><a href="#" className="hover:text-gray-900">Тарифы</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">О нас</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">О компании</a></li>
                <li><a href="#" className="hover:text-gray-900">Контакты</a></li>
                <li><a href="#" className="hover:text-gray-900">Поддержка</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Соцсети</h5>
              <div className="flex gap-3">
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Icon name="Facebook" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Icon name="Twitter" size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600">
                  <Icon name="Linkedin" size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-gray-600 text-center">
            © 2024 JobSearch. Все права защищены
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import Header from '@/components/home/Header';
import SearchSection from '@/components/home/SearchSection';
import VacancyCard from '@/components/home/VacancyCard';
import Footer from '@/components/home/Footer';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [applied, setApplied] = useState<number[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://functions.poehali.dev/c37d9d16-227a-44d0-b385-cb5d560dbffc')
      .then(res => {
        if (!res.ok) throw new Error('Backend unavailable');
        return res.json();
      })
      .then(data => {
        const mappedVacancies = data.map((v: any, index: number) => ({
          ...v,
          isRecommended: index < 2
        }));
        setVacancies(mappedVacancies);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load vacancies, using fallback data:', err);
        const fallbackData: Vacancy[] = [
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "Tech Solutions",
            location: "Москва",
            salary: "200 000 - 300 000 ₽",
            description: "Мы ищем опытного Frontend разработчика для работы над крупным проектом в финтех сфере. Вы будете работать с современным стеком технологий и влиять на архитектурные решения.",
            tags: ["React", "TypeScript", "Redux"],
            isRecommended: true,
            image: 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/908cd9c2-2fb1-4827-8c90-49133bc8ae55.jpg',
            rating: 5,
            reviews: 48,
            priceFrom: 200000
          },
          {
            id: 2,
            title: "UX/UI Designer",
            company: "Digital Agency",
            location: "Санкт-Петербург",
            salary: "150 000 - 200 000 ₽",
            description: "Ищем креативного дизайнера для работы над крупными проектами. Вы будете отвечать за создание удобных и красивых интерфейсов.",
            tags: ["Figma", "UI/UX", "Prototyping"],
            isRecommended: true,
            image: 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/f2b915ff-e0aa-402a-96fb-d6bd91f7eaa6.jpg',
            rating: 4,
            reviews: 35,
            priceFrom: 150000
          },
          {
            id: 3,
            title: "Python Backend Developer",
            company: "FinTech Inc",
            location: "Москва",
            salary: "180 000 - 250 000 ₽",
            description: "Разрабатываем backend микросервисы для банковских решений. Ищем опытного Python разработчика в команду.",
            tags: ["Python", "Django", "PostgreSQL"],
            isRecommended: false,
            image: 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/338e2128-e5ca-4221-9d74-bd38ef0de21f.jpg',
            rating: 5,
            reviews: 52,
            priceFrom: 180000
          }
        ];
        setVacancies(fallbackData);
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

  const allTags = Array.from(new Set(vacancies.flatMap(v => v.tags)));

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedTags([]);
    setMinSalary('');
    setMaxSalary('');
  };

  const filteredVacancies = vacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vacancy.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vacancy.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || vacancy.location.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => vacancy.tags.includes(tag));
    
    const vacancySalary = vacancy.priceFrom || 0;
    const matchesMinSalary = !minSalary || vacancySalary >= parseInt(minSalary);
    const matchesMaxSalary = !maxSalary || vacancySalary <= parseInt(maxSalary);
    
    return matchesSearch && matchesCity && matchesTags && matchesMinSalary && matchesMaxSalary;
  });

  const recommendedVacancies = filteredVacancies.filter(v => v.isRecommended);
  const otherVacancies = filteredVacancies.filter(v => !v.isRecommended);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        minSalary={minSalary}
        setMinSalary={setMinSalary}
        maxSalary={maxSalary}
        setMaxSalary={setMaxSalary}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        allTags={allTags}
        clearFilters={clearFilters}
        filteredVacanciesCount={filteredVacancies.length}
      />

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedVacancies.map(vacancy => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  isFavorite={favorites.includes(vacancy.id)}
                  isApplied={applied.includes(vacancy.id)}
                  onToggleFavorite={toggleFavorite}
                  onApply={handleApply}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && filteredVacancies.length === 0 && (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Вакансии не найдены</h3>
            <p className="text-gray-600 mb-4">Попробуйте изменить параметры поиска</p>
            <Button onClick={clearFilters}>Сбросить фильтры</Button>
          </div>
        )}

        {!loading && otherVacancies.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Все вакансии</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherVacancies.map(vacancy => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                isFavorite={favorites.includes(vacancy.id)}
                isApplied={applied.includes(vacancy.id)}
                onToggleFavorite={toggleFavorite}
                onApply={handleApply}
              />
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

      <Footer />
    </div>
  );
};

export default Index;

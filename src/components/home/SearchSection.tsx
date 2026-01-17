import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  minSalary: string;
  setMinSalary: (value: string) => void;
  maxSalary: string;
  setMaxSalary: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  allTags: string[];
  clearFilters: () => void;
  filteredVacanciesCount: number;
}

const SearchSection = ({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  minSalary,
  setMinSalary,
  maxSalary,
  setMaxSalary,
  showFilters,
  setShowFilters,
  selectedTags,
  toggleTag,
  allTags,
  clearFilters,
  filteredVacanciesCount
}: SearchSectionProps) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">ВРЕМЯ РЕАЛЬНО НАЙТИ РАБОТУ!</h2>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Название вакансии, компания или ключевое слово"
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
            <Button 
              variant="outline" 
              className="h-12 px-6 bg-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon name="SlidersHorizontal" size={20} className="mr-2" />
              Фильтры
            </Button>
          </div>

          {showFilters && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Зарплата от (₽)</label>
                  <Input
                    type="number"
                    placeholder="Например: 50000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Зарплата до (₽)</label>
                  <Input
                    type="number"
                    placeholder="Например: 150000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Теги и навыки</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="flex-1"
                >
                  Сбросить фильтры
                </Button>
                <Button 
                  onClick={() => setShowFilters(false)}
                  className="flex-1"
                >
                  Применить
                </Button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Найдено вакансий: <strong>{filteredVacanciesCount}</strong></span>
            {(searchQuery || selectedCity || selectedTags.length > 0 || minSalary || maxSalary) && (
              <Button variant="link" onClick={clearFilters} className="h-auto p-0 text-primary">
                Очистить всё
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;

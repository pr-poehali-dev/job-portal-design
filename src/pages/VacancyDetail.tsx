import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface VacancyDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  conditions: string[];
  tags: string[];
  employmentType: string;
  experience: string;
  companyDescription: string;
  companySize: string;
  publishedDate: string;
  image?: string;
  rating?: number;
  reviews?: number;
  priceFrom?: number;
}

const VacancyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [vacancy, setVacancy] = useState<VacancyDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallbackVacancies: VacancyDetail[] = [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Tech Solutions",
        location: "Москва",
        salary: "200 000 - 300 000 ₽",
        description: "Мы ищем опытного Frontend разработчика для работы над крупным проектом в финтех сфере. Вы будете работать с современным стеком технологий и влиять на архитектурные решения.",
        tags: ["React", "TypeScript", "Redux"],
        requirements: [
          "Опыт коммерческой разработки на React от 3 лет",
          "Глубокое понимание TypeScript",
          "Опыт работы с Redux или другими state management решениями",
          "Знание современных подходов к тестированию (Jest, React Testing Library)",
          "Понимание принципов построения архитектуры фронтенд приложений"
        ],
        responsibilities: [
          "Разработка новых функций веб-приложения",
          "Оптимизация производительности",
          "Участие в code review",
          "Менторинг junior разработчиков",
          "Проектирование архитектуры новых модулей"
        ],
        conditions: [
          "Официальное оформление по ТК РФ",
          "Гибкий график работы",
          "Возможность удаленной работы",
          "ДМС после испытательного срока",
          "Корпоративное обучение"
        ],
        employmentType: "Полная занятость",
        experience: "3-6 лет",
        companyDescription: "Tech Solutions - современная IT компания, специализирующаяся на разработке финансовых решений для крупного бизнеса.",
        companySize: "100-500 сотрудников",
        publishedDate: "15 января 2026",
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
        requirements: [
          "Опыт работы дизайнером от 2 лет",
          "Отличное владение Figma",
          "Портфолио с реализованными проектами",
          "Понимание принципов UX и UI дизайна",
          "Знание современных трендов в веб-дизайне"
        ],
        responsibilities: [
          "Проектирование пользовательских интерфейсов",
          "Создание прототипов и wireframes",
          "Разработка дизайн-систем",
          "Проведение юзабилити-тестирований",
          "Взаимодействие с разработчиками"
        ],
        conditions: [
          "Оформление по ТК РФ",
          "Работа в офисе с возможностью удаленки",
          "Современное оборудование",
          "Творческая атмосфера",
          "Участие в конференциях за счет компании"
        ],
        employmentType: "Полная занятость",
        experience: "1-3 года",
        companyDescription: "Digital Agency - креативное агентство полного цикла, создающее digital-продукты для крупных брендов.",
        companySize: "50-100 сотрудников",
        publishedDate: "14 января 2026",
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
        requirements: [
          "Опыт разработки на Python от 3 лет",
          "Знание Django или FastAPI",
          "Опыт работы с PostgreSQL",
          "Понимание микросервисной архитектуры",
          "Опыт работы с Docker и CI/CD"
        ],
        responsibilities: [
          "Разработка и поддержка backend сервисов",
          "Проектирование API",
          "Оптимизация баз данных",
          "Написание тестов",
          "Участие в code review"
        ],
        conditions: [
          "Официальное трудоустройство",
          "Гибридный формат работы",
          "ДМС для сотрудника и семьи",
          "Современный офис в центре",
          "Бюджет на обучение"
        ],
        employmentType: "Полная занятость",
        experience: "3-6 лет",
        companyDescription: "FinTech Inc - инновационная финтех компания, разрабатывающая решения для банковской сферы.",
        companySize: "200-500 сотрудников",
        publishedDate: "13 января 2026",
        image: 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/338e2128-e5ca-4221-9d74-bd38ef0de21f.jpg',
        rating: 5,
        reviews: 52,
        priceFrom: 180000
      }
    ];

    fetch(`https://functions.poehali.dev/dc4947a9-240d-4227-b897-0daca4cc12e6?id=${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Backend unavailable');
        return res.json();
      })
      .then(data => {
        setVacancy(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load vacancy, using fallback:', err);
        const vacancyData = fallbackVacancies.find(v => v.id === parseInt(id || '0'));
        if (vacancyData) {
          setVacancy(vacancyData);
        }
        setLoading(false);
      });
  }, [id]);

  const handleApply = () => {
    setHasApplied(true);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-gray-500 mt-4">Загрузка вакансии...</p>
        </div>
      </div>
    );
  }

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Вакансия не найдена</p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer" onClick={() => navigate('/')}>Воркеры</h1>
            <nav className="hidden md:flex gap-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Вакансии</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Избранное</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Отклики</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Резюме</a>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm text-gray-600 hover:text-gray-900">
              Разместить вакансию
            </Button>
            <Button variant="outline" className="text-sm">
              Войти
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
          onClick={() => navigate('/')}
        >
          <Icon name="ArrowLeft" size={18} className="mr-1" />
          Назад к списку
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900 mb-4">{vacancy.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-base text-gray-600 mb-4">
                <span className="flex items-center gap-1 font-semibold text-gray-900 text-xl">
                  {vacancy.salary}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={16} />
                  {vacancy.location}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Briefcase" size={16} />
                  {vacancy.experience}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={16} />
                  {vacancy.employmentType}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                {vacancy.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-sm font-normal text-gray-600">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500">Опубликовано: {vacancy.publishedDate}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Описание вакансии</h2>
              <p className="text-gray-700 leading-relaxed">{vacancy.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Требования</h2>
              <ul className="space-y-2">
                {vacancy.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Icon name="Check" size={18} className="text-primary mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Обязанности</h2>
              <ul className="space-y-2">
                {vacancy.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Icon name="Circle" size={8} className="text-gray-400 mt-2 flex-shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Условия работы</h2>
              <ul className="space-y-2">
                {vacancy.conditions.map((cond, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Icon name="Star" size={16} className="text-primary mt-1 flex-shrink-0" />
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="space-y-4">
                {hasApplied ? (
                  <Button disabled className="w-full" size="lg" variant="outline">
                    <Icon name="Check" size={18} className="mr-2" />
                    Вы откликнулись
                  </Button>
                ) : (
                  <Button onClick={handleApply} className="w-full" size="lg">
                    Откликнуться
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={toggleFavorite}
                >
                  <Icon 
                    name="Heart" 
                    size={18} 
                    className={`mr-2 ${isFavorite ? 'fill-primary text-primary' : ''}`}
                  />
                  {isFavorite ? 'В избранном' : 'В избранное'}
                </Button>

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">{vacancy.company}</h3>
                  <p className="text-sm text-gray-600 mb-3">{vacancy.companyDescription}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon name="Users" size={16} />
                      <span>{vacancy.companySize}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Icon name="MapPin" size={16} />
                      <span>{vacancy.location}</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Icon name="Building2" size={18} className="mr-2" />
                  О компании
                </Button>
              </div>
            </Card>
          </div>
        </div>
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

export default VacancyDetail;
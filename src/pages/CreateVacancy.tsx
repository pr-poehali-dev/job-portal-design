import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CreateVacancy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    city: '',
    salaryFrom: '',
    salaryTo: '',
    description: '',
    requirements: '',
    responsibilities: '',
    conditions: '',
    experience: '',
    employmentType: 'full_time'
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.city || !formData.description) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Успешно!',
      description: 'Вакансия создана и отправлена на модерацию'
    });

    setTimeout(() => {
      navigate('/employer/vacancies');
    }, 1000);
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <h1 className="text-2xl font-semibold text-gray-900 cursor-pointer">
              Воркеры
            </h1>
          </Link>
          <Link to="/employer/vacancies">
            <Button variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Мои вакансии
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Создание вакансии</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название вакансии *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Например: Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Город *
                </label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  placeholder="Москва"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Опыт работы
                </label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  placeholder="1-3 года"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зарплата от (₽)
                </label>
                <Input
                  type="number"
                  value={formData.salaryFrom}
                  onChange={(e) => setFormData({...formData, salaryFrom: e.target.value})}
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Зарплата до (₽)
                </label>
                <Input
                  type="number"
                  value={formData.salaryTo}
                  onChange={(e) => setFormData({...formData, salaryTo: e.target.value})}
                  placeholder="200000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип занятости
              </label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="full_time">Полная занятость</option>
                <option value="part_time">Частичная занятость</option>
                <option value="remote">Удаленная работа</option>
                <option value="contract">По договору</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание вакансии *
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Расскажите о вакансии..."
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Требования (каждое с новой строки)
              </label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData({...formData, requirements: e.target.value})}
                placeholder="Опыт работы от 2 лет&#10;Знание React и TypeScript&#10;..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Обязанности (каждая с новой строки)
              </label>
              <Textarea
                value={formData.responsibilities}
                onChange={(e) => setFormData({...formData, responsibilities: e.target.value})}
                placeholder="Разработка новых фич&#10;Участие в code review&#10;..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Условия работы (каждое с новой строки)
              </label>
              <Textarea
                value={formData.conditions}
                onChange={(e) => setFormData({...formData, conditions: e.target.value})}
                placeholder="Офис в центре города&#10;Гибкий график&#10;ДМС&#10;..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Навыки и технологии
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Добавьте навык"
                />
                <Button type="button" onClick={addSkill}>
                  Добавить
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => removeSkill(skill)}>
                    {skill}
                    <Icon name="X" size={14} className="ml-1" />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Icon name="Check" size={18} className="mr-2" />
                Опубликовать вакансию
              </Button>
              <Link to="/employer/vacancies">
                <Button type="button" variant="outline">
                  Отмена
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateVacancy;
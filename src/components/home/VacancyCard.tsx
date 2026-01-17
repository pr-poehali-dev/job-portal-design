import { useNavigate } from 'react-router-dom';
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

interface VacancyCardProps {
  vacancy: Vacancy;
  isFavorite: boolean;
  isApplied: boolean;
  onToggleFavorite: (id: number) => void;
  onApply: (id: number) => void;
}

const VacancyCard = ({ vacancy, isFavorite, isApplied, onToggleFavorite, onApply }: VacancyCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group" onClick={() => navigate(`/vacancy/${vacancy.id}`)}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={vacancy.image || 'https://cdn.poehali.dev/projects/67b3a977-508a-4e6a-b135-916951979383/files/908cd9c2-2fb1-4827-8c90-49133bc8ae55.jpg'} 
          alt={vacancy.title}
          className="w-full h-full object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(vacancy.id);
          }}
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-sm w-8 h-8 p-0"
        >
          <Icon 
            name="Heart" 
            size={16}
            className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}
          />
        </Button>
        {vacancy.isRecommended && (
          <Badge className="absolute top-2 left-2 bg-primary text-white border-0 text-xs px-2 py-0.5">
            Топ выбор
          </Badge>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1.5">
          <Icon name="Eye" size={11} className="text-gray-400" />
          <span className="text-xs text-gray-500">{vacancy.reviews || 0} просмотров</span>
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-0.5 line-clamp-2">{vacancy.title}</h4>
        <p className="text-xs text-gray-500 mb-1.5">{vacancy.company}</p>
        <div className="flex items-center gap-0.5 text-xs text-gray-500 mb-2">
          <Icon name="MapPin" size={11} />
          <span>{vacancy.location}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-3">
          <span className="text-lg font-bold text-gray-900">{vacancy.priceFrom || '50 000'} ₽</span>
          <span className="text-xs text-gray-500">/мес</span>
        </div>
        {isApplied ? (
          <Button disabled className="w-full h-8 text-xs" variant="outline">
            <Icon name="Check" size={14} className="mr-1" />
            Откликнулись
          </Button>
        ) : (
          <Button 
            onClick={(e) => {
              e.stopPropagation();
              onApply(vacancy.id);
            }} 
            className="w-full h-8 text-xs"
          >
            Откликнуться
          </Button>
        )}
      </div>
    </Card>
  );
};

export default VacancyCard;
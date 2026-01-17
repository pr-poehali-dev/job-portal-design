import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
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
  );
};

export default Footer;

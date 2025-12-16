-- Добавляем пользователей (3 работодателя + 3 соискателя)
INSERT INTO users (email, password_hash, user_type) VALUES
('employer1@techsolutions.ru', 'hash123', 'employer'),
('employer2@digitalagency.ru', 'hash456', 'employer'),
('employer3@fintech.ru', 'hash789', 'employer'),
('jobseeker1@mail.ru', 'hash111', 'jobseeker'),
('jobseeker2@gmail.com', 'hash222', 'jobseeker'),
('jobseeker3@yandex.ru', 'hash333', 'jobseeker');

-- Добавляем работодателей
INSERT INTO employers (user_id, company_name, company_description, company_size, industry, city) VALUES
(1, 'Tech Solutions', 'Лидирующая компания в разработке финтех решений. Мы создаем продукты, которыми пользуются миллионы людей каждый день.', '200-500 сотрудников', 'IT / Финтех', 'Москва'),
(2, 'Digital Agency', 'Креативное digital-агентство полного цикла. Разрабатываем веб-сайты, мобильные приложения и брендинг.', '50-100 сотрудников', 'Маркетинг / Дизайн', 'Санкт-Петербург'),
(3, 'FinTech Inc', 'Инновационная финтех компания, создающая банковские решения нового поколения.', '100-200 сотрудников', 'Финансы / IT', 'Москва');

-- Добавляем соискателей
INSERT INTO jobseekers (user_id, first_name, last_name, phone, city, desired_position, desired_salary_from, desired_salary_to) VALUES
(4, 'Алексей', 'Иванов', '+7 (999) 123-45-67', 'Москва', 'Frontend Developer', 180000, 250000),
(5, 'Мария', 'Петрова', '+7 (999) 234-56-78', 'Санкт-Петербург', 'UX/UI Designer', 150000, 200000),
(6, 'Дмитрий', 'Сидоров', '+7 (999) 345-67-89', 'Екатеринбург', 'Backend Developer', 170000, 230000);

-- Добавляем вакансии
INSERT INTO vacancies (employer_id, title, description, requirements, responsibilities, conditions, salary_from, salary_to, city, employment_type, experience_level, skills, is_active) VALUES
(1, 'Senior Frontend Developer', 'Мы ищем опытного Frontend разработчика для работы над крупным проектом в финтех сфере. Вы будете работать с современным стеком технологий и влиять на архитектурные решения.', 
ARRAY['Опыт коммерческой разработки на React от 3 лет', 'Глубокое понимание TypeScript', 'Опыт работы с Redux или другими state management решениями', 'Знание современных подходов к стилизации', 'Опыт написания unit и integration тестов'],
ARRAY['Разработка новых функций веб-приложения', 'Поддержка и оптимизация существующего кода', 'Участие в code review и архитектурных решениях', 'Взаимодействие с backend командой и дизайнерами', 'Менторство junior разработчиков'],
ARRAY['Гибридный формат работы', 'ДМС с первого дня работы', 'Оплачиваемое обучение и конференции', '28 дней отпуска', 'Компенсация спорта', 'Современный офис в центре Москвы'],
200000, 300000, 'Москва', 'full_time', 'От 3 до 6 лет', ARRAY['React', 'TypeScript', 'Redux'], true),

(2, 'UX/UI Designer', 'Ищем креативного дизайнера для работы над крупными проектами. Вы будете отвечать за создание удобных и красивых интерфейсов.', 
ARRAY['Опыт работы UX/UI дизайнером от 2 лет', 'Уверенное владение Figma', 'Понимание принципов User Experience', 'Опыт создания дизайн-систем', 'Умение презентовать свои решения'],
ARRAY['Проектирование интерфейсов веб и мобильных приложений', 'Создание и поддержка дизайн-системы', 'Проведение UX исследований', 'Работа с командой разработки', 'Создание прототипов и макетов'],
ARRAY['Удаленная работа или офис', 'ДМС', 'Гибкий график', 'Современные инструменты', 'Дружная команда', 'Интересные проекты'],
150000, 200000, 'Санкт-Петербург', 'full_time', 'От 1 до 3 лет', ARRAY['Figma', 'UI/UX', 'Prototyping'], true),

(3, 'Python Backend Developer', 'Разрабатываем backend микросервисы для банковских решений. Ищем опытного Python разработчика в команду.', 
ARRAY['Опыт разработки на Python от 3 лет', 'Знание Django или FastAPI', 'Опыт работы с PostgreSQL', 'Понимание REST API и микросервисной архитектуры', 'Опыт работы с Docker'],
ARRAY['Разработка и поддержка микросервисов', 'Проектирование API', 'Оптимизация производительности', 'Написание тестов', 'Code review', 'Участие в проектировании архитектуры'],
ARRAY['Офис в центре Москвы', 'Можно работать удаленно 2 дня в неделю', 'ДМС для вас и семьи', 'Корпоративное обучение', 'Компенсация спорта', 'Бесплатные обеды'],
180000, 250000, 'Москва', 'full_time', 'От 3 до 6 лет', ARRAY['Python', 'Django', 'PostgreSQL'], true);

-- Добавляем резюме
INSERT INTO resumes (jobseeker_id, title, position, salary_from, salary_to, city, skills, about, is_visible) VALUES
(1, 'Frontend Developer', 'Senior Frontend Developer', 200000, 280000, 'Москва', ARRAY['React', 'TypeScript', 'Redux', 'Next.js', 'Tailwind'], 'Опытный frontend разработчик с 5 годами коммерческого опыта. Специализируюсь на React и TypeScript.', true),
(2, 'UX/UI Designer', 'UX/UI Designer', 140000, 190000, 'Санкт-Петербург', ARRAY['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'], 'Креативный дизайнер с фокусом на пользовательский опыт. 3 года опыта в digital агентствах.', true),
(3, 'Python Developer', 'Backend Python Developer', 170000, 240000, 'Екатеринбург', ARRAY['Python', 'Django', 'FastAPI', 'PostgreSQL', 'Docker'], 'Backend разработчик с опытом создания масштабируемых систем. 4 года в разработке.', true);

-- Добавляем опыт работы
INSERT INTO work_experience (resume_id, company_name, position, start_date, end_date, is_current, description) VALUES
(1, 'Tech Startup', 'Middle Frontend Developer', '2020-01-15', '2022-06-30', false, 'Разработка SPA приложений на React. Внедрение TypeScript в проект.'),
(1, 'Digital Agency', 'Senior Frontend Developer', '2022-07-01', NULL, true, 'Лид frontend команды. Разработка сложных веб-приложений для крупных клиентов.'),
(2, 'Creative Studio', 'Junior Designer', '2019-03-01', '2021-08-31', false, 'Создание UI макетов, работа с клиентами, прототипирование.'),
(2, 'Marketing Agency', 'UX/UI Designer', '2021-09-01', NULL, true, 'Проектирование интерфейсов, UX исследования, создание дизайн-систем.'),
(3, 'FinTech Startup', 'Junior Python Developer', '2018-06-01', '2020-12-31', false, 'Разработка backend API на Django. Работа с PostgreSQL.'),
(3, 'Enterprise Company', 'Python Developer', '2021-01-01', NULL, true, 'Разработка микросервисов на FastAPI. Оптимизация производительности.');

-- Добавляем образование
INSERT INTO education (resume_id, institution_name, degree, field_of_study, start_year, end_year) VALUES
(1, 'МГУ им. Ломоносова', 'Бакалавр', 'Прикладная математика и информатика', 2015, 2019),
(2, 'СПбГУ', 'Бакалавр', 'Дизайн', 2016, 2020),
(3, 'УрФУ', 'Бакалавр', 'Программная инженерия', 2014, 2018);

-- Добавляем отклики
INSERT INTO applications (vacancy_id, jobseeker_id, resume_id, status) VALUES
(1, 1, 1, 'pending'),
(2, 2, 2, 'viewed'),
(3, 3, 3, 'interview');

-- Добавляем избранные вакансии
INSERT INTO favorite_vacancies (jobseeker_id, vacancy_id) VALUES
(1, 2),
(2, 1),
(3, 1);
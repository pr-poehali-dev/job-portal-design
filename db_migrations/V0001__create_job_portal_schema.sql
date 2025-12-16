-- Таблица пользователей (общая для работодателей и соискателей)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('employer', 'jobseeker')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Таблица профилей соискателей
CREATE TABLE jobseekers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    city VARCHAR(100),
    photo_url TEXT,
    about_me TEXT,
    desired_position VARCHAR(200),
    desired_salary_from INTEGER,
    desired_salary_to INTEGER,
    employment_type VARCHAR(50)[] DEFAULT ARRAY['full_time'],
    work_schedule VARCHAR(50)[] DEFAULT ARRAY['full_day'],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица резюме соискателей
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    jobseeker_id INTEGER NOT NULL REFERENCES jobseekers(id),
    title VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    salary_from INTEGER,
    salary_to INTEGER,
    city VARCHAR(100),
    employment_type VARCHAR(50)[] DEFAULT ARRAY['full_time'],
    work_schedule VARCHAR(50)[] DEFAULT ARRAY['full_day'],
    skills TEXT[],
    about TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица опыта работы
CREATE TABLE work_experience (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id),
    company_name VARCHAR(200) NOT NULL,
    position VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица образования
CREATE TABLE education (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id),
    institution_name VARCHAR(200) NOT NULL,
    degree VARCHAR(100),
    field_of_study VARCHAR(200),
    start_year INTEGER,
    end_year INTEGER,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица профилей работодателей
CREATE TABLE employers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id),
    company_name VARCHAR(200) NOT NULL,
    company_description TEXT,
    company_size VARCHAR(50),
    industry VARCHAR(100),
    website_url TEXT,
    logo_url TEXT,
    phone VARCHAR(20),
    city VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица вакансий
CREATE TABLE vacancies (
    id SERIAL PRIMARY KEY,
    employer_id INTEGER NOT NULL REFERENCES employers(id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    responsibilities TEXT[],
    conditions TEXT[],
    salary_from INTEGER,
    salary_to INTEGER,
    city VARCHAR(100) NOT NULL,
    employment_type VARCHAR(50) NOT NULL DEFAULT 'full_time',
    work_schedule VARCHAR(50) NOT NULL DEFAULT 'full_day',
    experience_level VARCHAR(50),
    skills TEXT[],
    is_active BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица откликов на вакансии
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id),
    jobseeker_id INTEGER NOT NULL REFERENCES jobseekers(id),
    resume_id INTEGER REFERENCES resumes(id),
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'interview', 'rejected', 'accepted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vacancy_id, jobseeker_id)
);

-- Таблица избранных вакансий
CREATE TABLE favorite_vacancies (
    id SERIAL PRIMARY KEY,
    jobseeker_id INTEGER NOT NULL REFERENCES jobseekers(id),
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(jobseeker_id, vacancy_id)
);

-- Индексы для оптимизации запросов
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_vacancies_employer ON vacancies(employer_id);
CREATE INDEX idx_vacancies_city ON vacancies(city);
CREATE INDEX idx_vacancies_active ON vacancies(is_active);
CREATE INDEX idx_applications_vacancy ON applications(vacancy_id);
CREATE INDEX idx_applications_jobseeker ON applications(jobseeker_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_favorite_vacancies_jobseeker ON favorite_vacancies(jobseeker_id);
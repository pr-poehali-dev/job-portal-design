-- Добавляем поля для изображения и статуса модерации
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE vacancies ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'moderation', 'archived'));

-- Создаём таблицу просмотров
CREATE TABLE IF NOT EXISTS vacancy_views (
    id SERIAL PRIMARY KEY,
    vacancy_id INTEGER NOT NULL REFERENCES vacancies(id),
    user_id INTEGER,
    ip_address VARCHAR(45) NOT NULL,
    viewed_at DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX IF NOT EXISTS idx_vacancy_views_vacancy ON vacancy_views(vacancy_id);
CREATE INDEX IF NOT EXISTS idx_vacancy_views_ip_date ON vacancy_views(vacancy_id, ip_address, viewed_at);

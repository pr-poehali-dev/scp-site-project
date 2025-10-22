CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

INSERT INTO announcements (title, content, priority) VALUES 
('УРОВЕНЬ УГРОЗЫ: ЖЕЛТЫЙ', 'Всему персоналу: Зафиксирована повышенная активность SCP-████. Соблюдайте протоколы безопасности при перемещении между секторами. Избегайте теневых зон в период с 12:00 до 13:00.', 'high'),
('ТЕХНИЧЕСКОЕ ОБСЛУЖИВАНИЕ', 'Плановое техническое обслуживание систем содержания запланировано на 23:00. Резервное питание будет активировано автоматически. Персонал уровня 2 и выше остается на дежурстве.', 'normal'),
('ОБНОВЛЕНИЕ ПРОТОКОЛОВ', 'Обновлены процедуры содержания для объектов класса Euclid. Все сотрудники должны пройти инструктаж до конца недели. Запись на обучение доступна в системе персонала.', 'normal');
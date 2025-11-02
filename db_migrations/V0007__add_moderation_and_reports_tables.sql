CREATE TABLE IF NOT EXISTS user_reports (
    id SERIAL PRIMARY KEY,
    reported_user_id INTEGER REFERENCES secret_users(id),
    reporter_email VARCHAR(255) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_punishments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES secret_users(id),
    punishment_type VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    duration_minutes INTEGER,
    expires_at TIMESTAMP,
    warnings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'admin'
);

CREATE INDEX idx_user_reports_status ON user_reports(status);
CREATE INDEX idx_user_punishments_user_id ON user_punishments(user_id);
CREATE INDEX idx_user_punishments_expires_at ON user_punishments(expires_at);

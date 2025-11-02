import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface AdminSectionProps {
  isAuthorized: boolean;
  password: string;
  passwordError: boolean;
  onPasswordChange: (password: string) => void;
  onAuthorize: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

interface Report {
  id: number;
  reported_user_id: number;
  reported_username: string;
  reported_email: string;
  reporter_email: string;
  reason: string;
  status: string;
  created_at: string;
}

interface Punishment {
  id: number;
  user_id: number;
  username: string;
  email: string;
  punishment_type: string;
  reason: string;
  duration_minutes: number;
  expires_at: string;
  warnings_count: number;
  created_at: string;
  created_by: string;
}

const RULES_TEXT = `1. Нарушение общения и поведения:

Оскорбления и хамство:
• Использование нецензурной лексики по отношению к другим участникам
• Оскорбления, унижения, дискриминация по любому признаку
• Переход на личности вместо обсуждения сути вопроса

Троллинг и провокации:
• Преднамеренное провоцирование конфликтов и споров
• Распространение заведомо ложной информации с целью вызвать негативную реакцию
• Флейм (написание эмоциональных и часто оскорбительных сообщений)

Спам и флуд:
• Массовая рассылка нежелательной информации
• Бессмысленные, повторяющиеся или не относящиеся к теме сообщения
• Злоупотребление Caps Lock'ом или большим количеством знаков препинания

Неуважение к другим участникам:
• Игнорирование вопросов или просьб других участников
• Прерывание обсуждения без уважительной причины
• Захват темы (отклонение обсуждения от первоначальной темы)

2. Нарушение правил контента:

Размещение запрещенного контента:
• Распространение материалов, нарушающих закон (например, порнография, пропаганда насилия, экстремизм)
• Распространение конфиденциальной или личной информации без согласия
• Нарушение авторских прав (пиратский контент)

Некорректная информация:
• Распространение заведомо ложной или вводящей в заблуждение информации
• Представление личного мнения как факта без указания источника

Некачественный контент:
• Публикация сообщений, написанных неграмотно и трудночитаемых
• Публикация сообщений, не имеющих ценности для сообщества

3. Нарушение технических правил:

Неправильное использование функционала платформы:
• Злоупотребление функциями оповещения (например, массовые упоминания пользователей)
• Попытки взлома или обхода системы

Нарушение правил оформления контента:
• Неправильное использование тегов или разметки

Система наказаний:
• После 3 предупреждений - временная блокировка
• Серьезные нарушения могут привести к немедленной блокировке
• Возможность оспорить решение модераторов`;

export const AdminSection = ({
  isAuthorized,
  password,
  passwordError,
  onPasswordChange,
  onAuthorize
}: AdminSectionProps) => {
  const [activeTab, setActiveTab] = useState<'users' | 'reports' | 'moderation' | 'rules'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [punishments, setPunishments] = useState<Punishment[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [punishmentType, setPunishmentType] = useState<string>('warning');
  const [punishmentReason, setPunishmentReason] = useState<string>('');
  const [punishmentDuration, setPunishmentDuration] = useState<string>('');

  useEffect(() => {
    if (isAuthorized) {
      loadUsers();
      loadReports();
      loadPunishments();
    }
  }, [isAuthorized]);

  const loadUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b8e9b8a9-1b39-4dd5-a71c-e4bfe4aff01e');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const loadReports = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/5a100e56-3b22-468d-b802-09bf5e5f7103?type=reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Ошибка загрузки жалоб:', error);
    }
  };

  const loadPunishments = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/5a100e56-3b22-468d-b802-09bf5e5f7103');
      const data = await response.json();
      setPunishments(data.punishments || []);
    } catch (error) {
      console.error('Ошибка загрузки наказаний:', error);
    }
  };

  const handlePunish = async () => {
    if (!selectedUserId || !punishmentReason) {
      alert('Выберите пользователя и укажите причину');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/5a100e56-3b22-468d-b802-09bf5e5f7103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'punish',
          user_id: selectedUserId,
          punishment_type: punishmentType,
          reason: punishmentReason,
          duration_minutes: punishmentDuration ? parseInt(punishmentDuration) : null,
          created_by: 'Admin'
        })
      });

      const data = await response.json();
      if (data.success) {
        alert(punishmentType === 'warning' 
          ? `Предупреждение выдано! Всего предупреждений: ${data.warnings_count}/3` 
          : 'Наказание применено успешно');
        setPunishmentReason('');
        setPunishmentDuration('');
        setSelectedUserId(null);
        loadPunishments();
      }
    } catch (error) {
      alert('Ошибка применения наказания');
    }
  };

  const handleReportStatusUpdate = async (reportId: number, status: string) => {
    try {
      await fetch('https://functions.poehali.dev/5a100e56-3b22-468d-b802-09bf5e5f7103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_report_status',
          id: reportId,
          status
        })
      });
      loadReports();
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-600 flex items-center gap-2">
              <Icon name="Shield" size={24} />
              РАЗДЕЛ СОЗДАТЕЛЯ - УРОВЕНЬ 0
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-amber-400 text-sm">Код доступа создателя:</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAuthorize()}
                  className={`bg-black/60 border-amber-900/50 text-amber-100 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="Введите код"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">⚠ НЕВЕРНЫЙ КОД ДОСТУПА</p>
                )}
              </div>
              <Button onClick={onAuthorize} className="w-full bg-amber-900 hover:bg-amber-800 text-white">
                <Icon name="Unlock" size={18} className="mr-2" />
                АВТОРИЗОВАТЬСЯ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-amber-600 flex items-center gap-2">
            <Icon name="Crown" size={24} />
            ПАНЕЛЬ УПРАВЛЕНИЯ СОЗДАТЕЛЯ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'default' : 'outline'}
              className={activeTab === 'users' ? 'bg-amber-900 hover:bg-amber-800' : 'border-amber-900/50 text-amber-400'}
            >
              <Icon name="Users" size={16} className="mr-2" />
              Пользователи
            </Button>
            <Button
              onClick={() => setActiveTab('reports')}
              variant={activeTab === 'reports' ? 'default' : 'outline'}
              className={activeTab === 'reports' ? 'bg-amber-900 hover:bg-amber-800' : 'border-amber-900/50 text-amber-400'}
            >
              <Icon name="AlertTriangle" size={16} className="mr-2" />
              Жалобы ({reports.filter(r => r.status === 'pending').length})
            </Button>
            <Button
              onClick={() => setActiveTab('moderation')}
              variant={activeTab === 'moderation' ? 'default' : 'outline'}
              className={activeTab === 'moderation' ? 'bg-amber-900 hover:bg-amber-800' : 'border-amber-900/50 text-amber-400'}
            >
              <Icon name="Gavel" size={16} className="mr-2" />
              Модерация
            </Button>
            <Button
              onClick={() => setActiveTab('rules')}
              variant={activeTab === 'rules' ? 'default' : 'outline'}
              className={activeTab === 'rules' ? 'bg-amber-900 hover:bg-amber-800' : 'border-amber-900/50 text-amber-400'}
            >
              <Icon name="BookOpen" size={16} className="mr-2" />
              Правила
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeTab === 'users' && (
        <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-600">Список пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="p-3 bg-black/40 border border-amber-900/30 rounded">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-amber-100 font-bold">{user.username}</p>
                      <p className="text-amber-400 text-sm">{user.email}</p>
                    </div>
                    <div className="text-right text-xs text-amber-500">
                      ID: {user.id} | {new Date(user.created_at).toLocaleString('ru-RU')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'reports' && (
        <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-600">Жалобы пользователей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.length === 0 ? (
                <p className="text-amber-400 text-center py-4">Нет жалоб</p>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="p-3 bg-black/40 border border-amber-900/30 rounded">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <p className="text-amber-100 font-bold">
                          Жалоба на: {report.reported_username} ({report.reported_email})
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          report.status === 'pending' ? 'bg-yellow-900 text-yellow-100' :
                          report.status === 'resolved' ? 'bg-green-900 text-green-100' :
                          'bg-red-900 text-red-100'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <p className="text-amber-400 text-sm">От: {report.reporter_email}</p>
                      <p className="text-amber-300">{report.reason}</p>
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={() => handleReportStatusUpdate(report.id, 'resolved')}
                          size="sm"
                          className="bg-green-900 hover:bg-green-800"
                        >
                          Решено
                        </Button>
                        <Button
                          onClick={() => handleReportStatusUpdate(report.id, 'rejected')}
                          size="sm"
                          variant="outline"
                          className="border-red-900/50 text-red-400"
                        >
                          Отклонить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-amber-600">Выдать наказание</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-amber-400 text-sm">Пользователь:</label>
                  <select
                    value={selectedUserId || ''}
                    onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
                    className="w-full p-2 bg-black/60 border border-amber-900/50 text-amber-100 rounded"
                  >
                    <option value="">Выберите пользователя</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-amber-400 text-sm">Тип наказания:</label>
                  <select
                    value={punishmentType}
                    onChange={(e) => setPunishmentType(e.target.value)}
                    className="w-full p-2 bg-black/60 border border-amber-900/50 text-amber-100 rounded"
                  >
                    <option value="warning">Предупреждение</option>
                    <option value="mute">Мут</option>
                    <option value="kick">Кик</option>
                    <option value="ban">Бан</option>
                  </select>
                </div>

                {(punishmentType === 'mute' || punishmentType === 'ban') && (
                  <div>
                    <label className="text-amber-400 text-sm">Длительность (минуты):</label>
                    <Input
                      type="number"
                      value={punishmentDuration}
                      onChange={(e) => setPunishmentDuration(e.target.value)}
                      className="bg-black/60 border-amber-900/50 text-amber-100"
                      placeholder="Оставьте пустым для перманентного"
                    />
                  </div>
                )}

                <div>
                  <label className="text-amber-400 text-sm">Причина:</label>
                  <Textarea
                    value={punishmentReason}
                    onChange={(e) => setPunishmentReason(e.target.value)}
                    className="bg-black/60 border-amber-900/50 text-amber-100"
                    placeholder="Укажите причину наказания"
                    rows={3}
                  />
                </div>

                <Button onClick={handlePunish} className="w-full bg-amber-900 hover:bg-amber-800">
                  <Icon name="Gavel" size={18} className="mr-2" />
                  Применить наказание
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-amber-600">История наказаний</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {punishments.length === 0 ? (
                  <p className="text-amber-400 text-center py-4">Нет записей</p>
                ) : (
                  punishments.map((p) => (
                    <div key={p.id} className="p-3 bg-black/40 border border-amber-900/30 rounded">
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <p className="text-amber-100 font-bold">
                            {p.username} ({p.email})
                          </p>
                          <span className="text-xs text-amber-500">
                            {p.punishment_type.toUpperCase()}
                            {p.warnings_count > 0 && ` (${p.warnings_count}/3)`}
                          </span>
                        </div>
                        <p className="text-amber-300 text-sm">{p.reason}</p>
                        <p className="text-amber-500 text-xs">
                          От: {p.created_by} | {new Date(p.created_at).toLocaleString('ru-RU')}
                          {p.expires_at && ` | До: ${new Date(p.expires_at).toLocaleString('ru-RU')}`}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'rules' && (
        <Card className="border-amber-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-amber-600">Правила сообщества</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-amber-200 whitespace-pre-line text-sm leading-relaxed">
              {RULES_TEXT}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

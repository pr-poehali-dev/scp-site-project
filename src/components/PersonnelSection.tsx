import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Application {
  id: number;
  full_name: string;
  age: number;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

interface ChatMessage {
  id: number;
  username: string;
  message: string;
  created_at: string;
}

interface PersonnelSectionProps {
  isAuthorized: boolean;
  password: string;
  passwordError: boolean;
  applications: Application[];
  onPasswordChange: (password: string) => void;
  onAuthorize: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}

export const PersonnelSection = ({
  isAuthorized,
  password,
  passwordError,
  applications,
  onPasswordChange,
  onAuthorize,
  onUpdateStatus
}: PersonnelSectionProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showNewAnnouncement, setShowNewAnnouncement] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'normal' });
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('Агент-' + Math.floor(Math.random() * 9999));

  useEffect(() => {
    if (isAuthorized) {
      loadAnnouncements();
      loadChatMessages();
      const announcementInterval = setInterval(loadAnnouncements, 30000);
      const chatInterval = setInterval(loadChatMessages, 5000);
      return () => {
        clearInterval(announcementInterval);
        clearInterval(chatInterval);
      };
    }
  }, [isAuthorized]);

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/c629740d-0bd9-4d42-ba74-971a06ae6868');
      const data = await response.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error('Ошибка загрузки объявлений:', error);
    }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/c629740d-0bd9-4d42-ba74-971a06ae6868', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          ...newAnnouncement
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewAnnouncement({ title: '', content: '', priority: 'normal' });
        setShowNewAnnouncement(false);
        loadAnnouncements();
      }
    } catch (error) {
      alert('Ошибка создания объявления');
    }
  };

  const deleteAnnouncement = async (id: number) => {
    if (!confirm('Удалить объявление?')) return;

    try {
      await fetch('https://functions.poehali.dev/c629740d-0bd9-4d42-ba74-971a06ae6868', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      loadAnnouncements();
    } catch (error) {
      alert('Ошибка удаления объявления');
    }
  };

  const loadChatMessages = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e1f16e6e-1835-467f-b56f-2a190a732f87');
      const data = await response.json();
      setChatMessages(data.messages || []);
    } catch (error) {
      console.error('Ошибка загрузки сообщений чата:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch('https://functions.poehali.dev/e1f16e6e-1835-467f-b56f-2a190a732f87', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, message: newMessage })
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        loadChatMessages();
      }
    } catch (error) {
      alert('Ошибка отправки сообщения');
    }
  };
  if (!isAuthorized) {
    return (
      <Card className="border-2 border-destructive mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="Lock" size={24} className="text-destructive" />
            <h2 className="text-2xl font-bold text-destructive">РАЗДЕЛ ПЕРСОНАЛА</h2>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Доступ ограничен. Введите пароль для продолжения.
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`border-2 ${passwordError ? 'border-red-600' : 'border-destructive/50'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAuthorize();
                }
              }}
            />
            <Button
              onClick={onAuthorize}
              className="bg-destructive hover:bg-destructive/80"
            >
              ВОЙТИ
            </Button>
          </div>
          {passwordError && (
            <p className="text-red-600 text-sm mt-2">Неверный пароль</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-green-600 mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="Users" size={24} className="text-green-600" />
          <h2 className="text-2xl font-bold text-green-600">РАЗДЕЛ ПЕРСОНАЛА</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-900/20 p-4 rounded border border-green-600/30">
            <p className="text-sm text-green-600 font-bold mb-2">СТАТУС: АВТОРИЗОВАН</p>
            <p className="text-xs text-muted-foreground">
              Уровень допуска: 3 | Вы имеете доступ к управлению заявками на вступление в Фонд SCP.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-yellow-600">ОБЪЯВЛЕНИЯ ФОНДА</h3>
              <Button
                onClick={() => setShowNewAnnouncement(!showNewAnnouncement)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                size="sm"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                НОВОЕ ОБЪЯВЛЕНИЕ
              </Button>
            </div>

            {showNewAnnouncement && (
              <Card className="border-2 border-yellow-600 mb-4">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Input
                      placeholder="Заголовок объявления"
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                      className="border-yellow-600/50"
                    />
                    <textarea
                      placeholder="Текст объявления"
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                      className="w-full min-h-[100px] p-3 bg-background border-2 border-yellow-600/50 rounded-md text-foreground"
                    />
                    <div className="flex gap-2">
                      <select
                        value={newAnnouncement.priority}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                        className="flex-1 p-2 bg-background border-2 border-yellow-600/50 rounded-md text-foreground"
                      >
                        <option value="normal">Обычный</option>
                        <option value="high">Высокий приоритет</option>
                      </select>
                      <Button onClick={createAnnouncement} className="bg-yellow-600 hover:bg-yellow-700">
                        ОПУБЛИКОВАТЬ
                      </Button>
                      <Button onClick={() => setShowNewAnnouncement(false)} variant="outline">
                        ОТМЕНА
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {announcements.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет объявлений</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <Card
                    key={announcement.id}
                    className={`border-2 ${
                      announcement.priority === 'high'
                        ? 'border-red-600 bg-red-900/10'
                        : 'border-yellow-600/50 bg-yellow-900/5'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {announcement.priority === 'high' && (
                              <Icon name="AlertTriangle" size={16} className="text-red-600" />
                            )}
                            <h4 className="font-bold text-sm">{announcement.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{announcement.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(announcement.created_at).toLocaleString('ru-RU')}
                          </p>
                        </div>
                        <Button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-600/10"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-bold text-blue-600 mb-4">ЧАТ СОТРУДНИКОВ</h3>
            <Card className="border-2 border-blue-600/50 mb-6">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="bg-blue-900/10 p-3 rounded border border-blue-600/30 min-h-[300px] max-h-[400px] overflow-y-auto">
                    {chatMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center">Нет сообщений</p>
                    ) : (
                      <div className="space-y-2">
                        {chatMessages.map((msg) => (
                          <div key={msg.id} className="bg-background/80 p-2 rounded">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-bold text-blue-600">{msg.username}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-sm">{msg.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ваше имя"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-32 border-blue-600/50"
                    />
                    <Input
                      placeholder="Введите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          sendMessage();
                        }
                      }}
                      className="flex-1 border-blue-600/50"
                    />
                    <Button
                      onClick={sendMessage}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-green-600">ЗАЯВКИ НА РАССМОТРЕНИИ</h3>
            {applications.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет заявок на рассмотрении</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <Card key={app.id} className="border-2 border-muted">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold">{app.full_name}</p>
                            <p className="text-sm text-muted-foreground">
                              Возраст: {app.age} | Email: {app.email}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${
                            app.status === 'approved' ? 'bg-green-600/20 text-green-600' :
                            app.status === 'rejected' ? 'bg-red-600/20 text-red-600' :
                            'bg-yellow-600/20 text-yellow-600'
                          }`}>
                            {app.status === 'approved' ? 'ОДОБРЕНО' :
                             app.status === 'rejected' ? 'ОТКЛОНЕНО' :
                             'НА РАССМОТРЕНИИ'}
                          </span>
                        </div>
                        <div className="bg-background/50 p-3 rounded">
                          <p className="text-sm">{app.message}</p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Дата подачи: {new Date(app.created_at).toLocaleString('ru-RU')}
                        </div>
                        {app.status === 'pending' && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => onUpdateStatus(app.id, 'approved')}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <Icon name="Check" size={16} className="mr-1" />
                              ОДОБРИТЬ
                            </Button>
                            <Button
                              onClick={() => onUpdateStatus(app.id, 'rejected')}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                              size="sm"
                            >
                              <Icon name="X" size={16} className="mr-1" />
                              ОТКЛОНИТЬ
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
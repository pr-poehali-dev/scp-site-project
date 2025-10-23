import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const AVAILABLE_SUFFIXES = [
  'Младший Стажер',
  'Стажер',
  'Старший Стажер',
  'Младший Специалист',
  'Специалист',
  'Старший Специалист',
  'Ведущий Специалист',
  'Младший Координатор',
  'Координатор',
  'Старший Координатор',
  'Младший Аналитик',
  'Аналитик',
  'Старший Аналитик',
  'Ассистент Менеджера',
  'Менеджер Проектов',
  'Старший Менеджер Проектов',
  'Руководитель Группы',
  'Руководитель Отдела',
  'Заместитель Руководителя Отдела',
  'Директор Проекта',
  'Заместитель Директора Проекта',
  'Директор Департамента',
  'Заместитель Директора Департамента',
  'Финансовый Контролер',
  'Региональный Директор',
  'Операционный Директор',
  'Исполнительный Директор',
  'Советник Руководителя Фонда',
  'Заместитель Руководителя Фонда',
  'Руководитель Фонда'
];

interface UserSuffix {
  id: number;
  email: string;
  suffix: string;
  assigned_at: string;
}

interface SuffixManagerProps {
  isAuthorized: boolean;
  password: string;
  passwordError: boolean;
  onPasswordChange: (password: string) => void;
  onAuthorize: () => void;
}

export const SuffixManager = ({
  isAuthorized,
  password,
  passwordError,
  onPasswordChange,
  onAuthorize
}: SuffixManagerProps) => {
  const [userSuffixes, setUserSuffixes] = useState<UserSuffix[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [selectedSuffix, setSelectedSuffix] = useState(AVAILABLE_SUFFIXES[0]);

  useEffect(() => {
    if (isAuthorized) {
      loadUserSuffixes();
    }
  }, [isAuthorized]);

  const loadUserSuffixes = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b3d339c0-f350-48c0-845a-3e246cea0120');
      const data = await response.json();
      setUserSuffixes(data.suffixes || []);
    } catch (error) {
      console.error('Ошибка загрузки суффиксов:', error);
    }
  };

  const assignSuffix = async () => {
    if (!newEmail.trim()) {
      alert('Введите email пользователя');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/b3d339c0-f350-48c0-845a-3e246cea0120', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newEmail,
          suffix: selectedSuffix
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewEmail('');
        loadUserSuffixes();
        alert('Суффикс успешно назначен');
      }
    } catch (error) {
      alert('Ошибка назначения суффикса');
    }
  };

  const removeSuffix = async (email: string) => {
    if (!confirm('Удалить суффикс пользователя?')) return;

    try {
      await fetch('https://functions.poehali.dev/b3d339c0-f350-48c0-845a-3e246cea0120', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      loadUserSuffixes();
    } catch (error) {
      alert('Ошибка удаления суффикса');
    }
  };

  if (!isAuthorized) {
    return (
      <Card className="border-2 border-purple-600 mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="Shield" size={24} className="text-purple-600" />
            <h2 className="text-2xl font-bold text-purple-600">УПРАВЛЕНИЕ СУФФИКСАМИ</h2>
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
              className={`border-2 ${passwordError ? 'border-red-600' : 'border-purple-600/50'}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onAuthorize();
                }
              }}
            />
            <Button
              onClick={onAuthorize}
              className="bg-purple-600 hover:bg-purple-700"
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
    <Card className="border-2 border-purple-600 mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={24} className="text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">УПРАВЛЕНИЕ СУФФИКСАМИ</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-purple-900/20 p-4 rounded border border-purple-600/30">
            <p className="text-sm text-purple-600 font-bold mb-2">СТАТУС: ДОСТУП РАЗРЕШЁН</p>
            <p className="text-xs text-muted-foreground">
              Управление должностными суффиксами сотрудников Фонда SCP
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-purple-600">НАЗНАЧИТЬ СУФФИКС</h3>
            <div className="space-y-3">
              <Input
                placeholder="Email пользователя"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="border-purple-600/50"
              />
              <select
                value={selectedSuffix}
                onChange={(e) => setSelectedSuffix(e.target.value)}
                className="w-full p-3 bg-background border-2 border-purple-600/50 rounded-md text-foreground"
              >
                {AVAILABLE_SUFFIXES.map((suffix) => (
                  <option key={suffix} value={suffix}>
                    {suffix}
                  </option>
                ))}
              </select>
              <Button
                onClick={assignSuffix}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Icon name="UserPlus" size={16} className="mr-2" />
                НАЗНАЧИТЬ СУФФИКС
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 text-purple-600">НАЗНАЧЕННЫЕ СУФФИКСЫ</h3>
            {userSuffixes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Нет назначенных суффиксов</p>
            ) : (
              <div className="space-y-2">
                {userSuffixes.map((us) => (
                  <Card key={us.id} className="border-2 border-purple-600/30">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm">{us.email}</p>
                          <p className="text-xs text-purple-600">{us.suffix}</p>
                        </div>
                        <Button
                          onClick={() => removeSuffix(us.email)}
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
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
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

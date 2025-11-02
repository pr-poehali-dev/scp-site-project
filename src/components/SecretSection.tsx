import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ReportButton } from '@/components/ReportButton';

interface SecretSectionProps {
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

export const SecretSection = ({
  isAuthorized,
  password,
  passwordError,
  onPasswordChange,
  onAuthorize
}: SecretSectionProps) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('secret_logged_in_user');
    if (loggedInUser) {
      setCurrentUser(JSON.parse(loggedInUser));
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized && isLoggedIn) {
      loadUsers();
    }
  }, [isAuthorized, isLoggedIn]);

  const loadUsers = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/b8e9b8a9-1b39-4dd5-a71c-e4bfe4aff01e');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    }
  };

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/bd4e78c5-8cfe-46b4-8be8-69e4d5b38bb3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
        setCurrentUser(data.user);
        localStorage.setItem('secret_logged_in_user', JSON.stringify(data.user));
        setLoginEmail('');
        setLoginPassword('');
      } else {
        alert(data.error || 'Неверный email или пароль');
      }
    } catch (error) {
      alert('Ошибка входа');
    }
  };

  const handleRegister = async () => {
    if (!registerUsername || !registerEmail || !registerPassword) {
      alert('Заполните все поля');
      return;
    }

    if (registerPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/bd4e78c5-8cfe-46b4-8be8-69e4d5b38bb3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          username: registerUsername,
          email: registerEmail,
          password: registerPassword
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Регистрация успешна! Войдите в аккаунт.');
        setActiveTab('login');
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
      } else {
        alert(data.error || 'Ошибка регистрации');
      }
    } catch (error) {
      alert('Ошибка регистрации');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('secret_logged_in_user');
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-red-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Icon name="ShieldAlert" size={24} />
              СЕКРЕТНЫЙ РАЗДЕЛ - УРОВЕНЬ 5
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-red-400 text-sm">Код доступа:</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => onPasswordChange(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onAuthorize()}
                  className={`bg-black/60 border-red-900/50 text-red-100 ${passwordError ? 'border-red-500' : ''}`}
                  placeholder="Введите код"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">⚠ НЕВЕРНЫЙ КОД ДОСТУПА</p>
                )}
              </div>
              <Button onClick={onAuthorize} className="w-full bg-red-900 hover:bg-red-800 text-white">
                <Icon name="Unlock" size={18} className="mr-2" />
                АВТОРИЗОВАТЬСЯ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-red-900/30 bg-black/40 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Icon name="UserCircle" size={24} />
              СИСТЕМА УЧЕТА ПЕРСОНАЛА
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setActiveTab('login')}
                variant={activeTab === 'login' ? 'default' : 'outline'}
                className={activeTab === 'login' ? 'bg-red-900 hover:bg-red-800' : 'border-red-900/50 text-red-400'}
              >
                Вход
              </Button>
              <Button
                onClick={() => setActiveTab('register')}
                variant={activeTab === 'register' ? 'default' : 'outline'}
                className={activeTab === 'register' ? 'bg-red-900 hover:bg-red-800' : 'border-red-900/50 text-red-400'}
              >
                Регистрация
              </Button>
            </div>

            {activeTab === 'login' ? (
              <div className="space-y-4">
                <div>
                  <label className="text-red-400 text-sm">Email:</label>
                  <Input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-black/60 border-red-900/50 text-red-100"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-red-400 text-sm">Пароль:</label>
                  <Input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="bg-black/60 border-red-900/50 text-red-100"
                    placeholder="••••••"
                  />
                </div>
                <Button onClick={handleLogin} className="w-full bg-red-900 hover:bg-red-800">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти
                </Button>
                <div className="text-center mt-4">
                  <p className="text-red-400 text-sm mb-2">Нет аккаунта?</p>
                  <Button 
                    onClick={() => setActiveTab('register')} 
                    variant="outline" 
                    className="w-full border-red-900/50 text-red-400 hover:bg-red-900/20"
                  >
                    <Icon name="UserPlus" size={18} className="mr-2" />
                    Зарегистрироваться
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-red-400 text-sm">Имя пользователя:</label>
                  <Input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    className="bg-black/60 border-red-900/50 text-red-100"
                    placeholder="Агент-0000"
                  />
                </div>
                <div>
                  <label className="text-red-400 text-sm">Email:</label>
                  <Input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="bg-black/60 border-red-900/50 text-red-100"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="text-red-400 text-sm">Пароль (минимум 6 символов):</label>
                  <Input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                    className="bg-black/60 border-red-900/50 text-red-100"
                    placeholder="••••••"
                  />
                </div>
                <Button onClick={handleRegister} className="w-full bg-red-900 hover:bg-red-800">
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Зарегистрироваться
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-red-900/30 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Icon name="UserCheck" size={24} />
              Вы вошли как: {currentUser?.username}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm" className="border-red-900/50 text-red-400">
              <Icon name="LogOut" size={16} className="mr-2" />
              Выйти
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-300">Email: {currentUser?.email}</p>
          <p className="text-red-400 text-sm mt-2">
            Зарегистрирован: {new Date(currentUser?.created_at || '').toLocaleString('ru-RU')}
          </p>
        </CardContent>
      </Card>

      <Card className="border-red-900/30 bg-black/40 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Icon name="Users" size={24} />
            Список зарегистрированных пользователей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.length === 0 ? (
              <p className="text-red-400 text-center py-4">Нет зарегистрированных пользователей</p>
            ) : (
              users.map((user) => (
                <div key={user.id} className="p-3 bg-black/40 border border-red-900/30 rounded">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-red-100 font-bold">{user.username}</p>
                      <p className="text-red-400 text-sm">{user.email}</p>
                      <p className="text-xs text-red-500 mt-1">
                        {new Date(user.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    {currentUser?.id !== user.id && (
                      <ReportButton 
                        reportedUserId={user.id} 
                        reportedUsername={user.username} 
                      />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
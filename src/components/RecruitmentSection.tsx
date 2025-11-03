import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { RecruitmentTimer } from './RecruitmentTimer';

interface RecruitmentSectionProps {
  onSecretPasswordReceived: (password: string) => void;
}

export function RecruitmentSection({ onSecretPasswordReceived }: RecruitmentSectionProps) {
  const [isRecruitmentOpen, setIsRecruitmentOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [showRegistrationClosed, setShowRegistrationClosed] = useState(false);
  const [showTimer, setShowTimer] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    education: '',
    experience: ''
  });

  useEffect(() => {
    const recruitmentState = localStorage.getItem('recruitmentOpen');
    const registeredState = localStorage.getItem('userRegistered');
    const countState = localStorage.getItem('registeredCount');
    const timerEndState = localStorage.getItem('registrationTimerEnd');

    if (recruitmentState === 'true') {
      setIsRecruitmentOpen(true);
    }

    if (registeredState === 'true') {
      setIsRegistered(true);
    }

    if (countState) {
      setRegisteredCount(parseInt(countState));
    }

    if (timerEndState) {
      const now = Date.now();
      const timerEnd = parseInt(timerEndState);
      
      if (now < timerEnd) {
        setShowTimer(true);
      } else {
        setShowTimer(false);
        setShowRegistrationClosed(false);
      }
    }
  }, []);

  useEffect(() => {
    if (showTimer) {
      const timerEnd = parseInt(localStorage.getItem('registrationTimerEnd') || '0');
      const now = Date.now();
      
      if (now >= timerEnd) {
        setShowTimer(false);
        setShowRegistrationClosed(false);
        return;
      }

      const timeout = setTimeout(() => {
        setShowTimer(false);
        setShowRegistrationClosed(false);
      }, timerEnd - now);

      return () => clearTimeout(timeout);
    }
  }, [showTimer]);

  const handleRecruitmentOpen = () => {
    setIsRecruitmentOpen(true);
    localStorage.setItem('recruitmentOpen', 'true');
  };

  const handleRegistration = () => {
    if (!formData.name || !formData.age || !formData.education || !formData.experience) {
      return;
    }

    const newCount = registeredCount + 1;
    setRegisteredCount(newCount);
    setIsRegistered(true);
    localStorage.setItem('userRegistered', 'true');
    localStorage.setItem('registeredCount', newCount.toString());
    
    onSecretPasswordReceived('LEVEL-5-ACCESS');

    if (newCount >= 10) {
      const timerEnd = Date.now() + (10 * 60 * 1000);
      localStorage.setItem('registrationTimerEnd', timerEnd.toString());
      setShowRegistrationClosed(true);
      setShowTimer(true);
    }
  };

  if (!isRecruitmentOpen) {
    return <RecruitmentTimer onTimerComplete={handleRecruitmentOpen} />;
  }

  if (showTimer) {
    return (
      <Card className="mb-8 bg-yellow-950/30 border-yellow-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-300">
            <Icon name="Clock" size={24} />
            Регистрация Временно Закрыта
          </CardTitle>
          <CardDescription className="text-yellow-200/70">
            Набор персонала возобновится через 10 минут
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-8">
            <Icon name="UserX" size={48} className="mx-auto mb-4 text-yellow-400" />
            <p className="text-yellow-200">
              Достигнут лимит регистраций ({registeredCount}/10)
            </p>
            <p className="text-yellow-200/70 text-sm mt-2">
              Пожалуйста, подождите...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showRegistrationClosed && !showTimer) {
    setShowRegistrationClosed(false);
    setRegisteredCount(0);
    localStorage.setItem('registeredCount', '0');
    localStorage.removeItem('registrationTimerEnd');
  }

  return (
    <Card className="mb-8 bg-green-950/30 border-green-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-300">
          <Icon name="Users" size={24} />
          Набор Персонала
        </CardTitle>
        <CardDescription className="text-green-200/70">
          {isRegistered 
            ? `Регистрация завершена. Зарегистрировано: ${registeredCount}/10`
            : `Привет! Чтобы войти, пройди регистрацию. Мест: ${10 - registeredCount}/10`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-900/20 border border-green-800 rounded">
              <p className="text-green-300 font-semibold mb-2">
                ✓ Регистрация успешно завершена!
              </p>
              <p className="text-green-200/70 text-sm">
                Вы получили доступ к секретному разделу.
              </p>
              <p className="text-green-200 text-sm mt-2">
                Пароль: <span className="font-mono font-bold">LEVEL-5-ACCESS</span>
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-green-200">Полное имя</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Введите ваше имя"
                className="bg-green-950/50 border-green-800 text-green-100"
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-green-200">Возраст</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Введите возраст"
                className="bg-green-950/50 border-green-800 text-green-100"
              />
            </div>

            <div>
              <Label htmlFor="education" className="text-green-200">Образование</Label>
              <Input
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                placeholder="Укажите образование"
                className="bg-green-950/50 border-green-800 text-green-100"
              />
            </div>

            <div>
              <Label htmlFor="experience" className="text-green-200">Опыт работы</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Опишите ваш опыт"
                className="bg-green-950/50 border-green-800 text-green-100"
              />
            </div>

            <Button
              onClick={handleRegistration}
              className="w-full bg-green-700 hover:bg-green-600 text-white"
              disabled={!formData.name || !formData.age || !formData.education || !formData.experience}
            >
              <Icon name="UserPlus" size={20} className="mr-2" />
              Зарегистрироваться
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

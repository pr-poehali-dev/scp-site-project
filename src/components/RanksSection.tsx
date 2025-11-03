import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

const RANKS = [
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

export function RanksSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showRanks, setShowRanks] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsLoading(false);
            setShowRanks(true);
            return 100;
          }
          return prev + 10;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsLoading(true);
    setLoadingProgress(0);
  };

  if (!isOpen) {
    return (
      <Card className="mb-8 bg-purple-950/30 border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Icon name="Award" size={24} />
            Система Званий
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Иерархия должностей Фонда SCP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleOpen}
            className="w-full bg-purple-700 hover:bg-purple-600 text-white"
          >
            <Icon name="Lock" size={20} className="mr-2" />
            Открыть Раздел Званий
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="mb-8 bg-purple-950/30 border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Icon name="Loader2" size={24} className="animate-spin" />
            Загрузка Данных...
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Инициализация системы званий
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl font-bold text-purple-300 mb-4">
              {loadingProgress / 10}
            </div>
            <Progress value={loadingProgress} className="mb-4" />
            <p className="text-purple-200/70 text-sm">
              Отсчёт до завершения загрузки...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (showRanks) {
    return (
      <Card className="mb-8 bg-purple-950/30 border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-300">
            <Icon name="Award" size={24} />
            Система Званий Фонда SCP
          </CardTitle>
          <CardDescription className="text-purple-200/70">
            Полная иерархия должностей от стажёра до руководителя
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {RANKS.map((rank, index) => (
              <div
                key={index}
                className="p-3 bg-purple-900/20 border border-purple-800 rounded-lg hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-purple-100 text-sm font-medium leading-tight">
                      {rank}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
            <p className="text-purple-200 text-sm">
              <Icon name="Info" size={16} className="inline mr-2" />
              Всего званий: <span className="font-bold">{RANKS.length}</span>
            </p>
            <p className="text-purple-200/70 text-xs mt-2">
              Повышение звания происходит на основе опыта, заслуг и выполненных задач.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}

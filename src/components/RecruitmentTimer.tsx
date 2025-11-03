import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RecruitmentTimerProps {
  onTimerComplete: () => void;
}

export function RecruitmentTimer({ onTimerComplete }: RecruitmentTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const startTime = localStorage.getItem('recruitmentStartTime');
    const now = Date.now();

    if (!startTime) {
      localStorage.setItem('recruitmentStartTime', now.toString());
      setTimeLeft(10 * 60 * 60 * 1000);
    } else {
      const elapsed = now - parseInt(startTime);
      const remaining = (10 * 60 * 60 * 1000) - elapsed;

      if (remaining <= 0) {
        onTimerComplete();
        setTimeLeft(0);
      } else {
        setTimeLeft(remaining);
      }
    }
  }, [onTimerComplete]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          onTimerComplete();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimerComplete]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-8 bg-yellow-950/30 border-yellow-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-300">
          <Icon name="Clock" size={24} />
          Таймер до Открытия Набора
        </CardTitle>
        <CardDescription className="text-yellow-200/70">
          Набор персонала откроется через
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <div className="text-6xl font-bold text-yellow-300 mb-4 font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="text-yellow-200/70 text-sm">
            часы : минуты : секунды
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ReportButtonProps {
  reportedUserId: number;
  reportedUsername: string;
}

export const ReportButton = ({ reportedUserId, reportedUsername }: ReportButtonProps) => {
  const [showForm, setShowForm] = useState(false);
  const [reporterEmail, setReporterEmail] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!reporterEmail || !reason) {
      alert('Заполните все поля');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/5a100e56-3b22-468d-b802-09bf5e5f7103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_report',
          reported_user_id: reportedUserId,
          reporter_email: reporterEmail,
          reason: reason
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Жалоба отправлена. Модераторы рассмотрят её в ближайшее время.');
        setShowForm(false);
        setReporterEmail('');
        setReason('');
      }
    } catch (error) {
      alert('Ошибка отправки жалобы');
    }
  };

  if (!showForm) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        size="sm"
        variant="outline"
        className="border-red-900/50 text-red-400 hover:bg-red-900/20"
      >
        <Icon name="Flag" size={14} className="mr-1" />
        Пожаловаться
      </Button>
    );
  }

  return (
    <Card className="border-red-900/30 bg-black/40 backdrop-blur mt-2">
      <CardHeader>
        <CardTitle className="text-red-600 text-sm flex items-center gap-2">
          <Icon name="Flag" size={16} />
          Пожаловаться на: {reportedUsername}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="text-red-400 text-xs">Ваш Email:</label>
            <Input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              className="bg-black/60 border-red-900/50 text-red-100 text-sm"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="text-red-400 text-xs">Причина жалобы:</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-black/60 border-red-900/50 text-red-100 text-sm"
              placeholder="Опишите нарушение..."
              rows={3}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} size="sm" className="bg-red-900 hover:bg-red-800">
              Отправить
            </Button>
            <Button onClick={() => setShowForm(false)} size="sm" variant="outline" className="border-red-900/50 text-red-400">
              Отмена
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

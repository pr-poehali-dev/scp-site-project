import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface ApplicationStatusProps {
  status: string;
  timeUntilResubmit?: string;
}

export const ApplicationStatus = ({ status, timeUntilResubmit }: ApplicationStatusProps) => {
  if (status === 'approved') {
    return (
      <Card className="border-2 border-green-600 bg-green-900/20 max-w-md">
        <CardContent className="py-4">
          <div className="text-center">
            <Icon name="CheckCircle" size={32} className="mx-auto mb-2 text-green-600" />
            <p className="text-sm font-bold text-green-600">ЗАЯВКА ОДОБРЕНА</p>
            <p className="text-xs text-green-700 mt-2">
              Добро пожаловать в Фонд SCP! Вам присвоен уровень допуска 3.
            </p>
            <div className="mt-4 bg-black/40 p-3 rounded border border-green-600/50">
              <p className="text-xs text-green-400 mb-1">Пароль для доступа к разделу персонала:</p>
              <p className="text-lg font-bold text-green-500 tracking-widest">5535</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'rejected') {
    return (
      <Card className="border-2 border-red-600 bg-red-900/20 max-w-md">
        <CardContent className="py-4">
          <div className="text-center">
            <Icon name="XCircle" size={32} className="mx-auto mb-2 text-red-600" />
            <p className="text-sm font-bold text-red-600">ЗАЯВКА ОТКЛОНЕНА</p>
            <p className="text-xs text-red-700 mt-2">
              К сожалению, ваша заявка не соответствует требованиям Фонда SCP.
            </p>
            {timeUntilResubmit && (
              <div className="mt-3 bg-black/40 p-2 rounded border border-red-600/50">
                <p className="text-xs text-red-400">
                  Повторная подача заявки возможна через: <span className="font-bold">{timeUntilResubmit}</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-yellow-600 bg-yellow-900/20 max-w-md">
      <CardContent className="py-4">
        <div className="text-center">
          <Icon name="Clock" size={32} className="mx-auto mb-2 text-yellow-600" />
          <p className="text-sm font-bold text-yellow-600">ЗАЯВКА ОТПРАВЛЕНА</p>
          <p className="text-xs text-yellow-700 mt-2">
            Ваша заявка находится на рассмотрении. Ожидайте решения Совета O5.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: (data: { fullName: string; age: string; email: string; message: string }) => void;
}

export const ApplicationForm = ({ onClose, onSubmit }: ApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="border-2 border-destructive bg-background max-w-2xl w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-destructive">ФОРМА ЗАЯВКИ НА ВСТУПЛЕНИЕ</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">ПОЛНОЕ ИМЯ</label>
              <Input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="border-2 border-destructive/50"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">ВОЗРАСТ</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="border-2 border-destructive/50"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">EMAIL</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="border-2 border-destructive/50"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2">ПОЧЕМУ ВЫ ХОТИТЕ ПРИСОЕДИНИТЬСЯ К ФОНДУ SCP?</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full min-h-[120px] p-3 bg-background border-2 border-destructive/50 rounded-md text-foreground"
                required
              />
            </div>
            
            <div className="bg-destructive/10 p-4 rounded border border-destructive/30">
              <p className="text-xs text-muted-foreground">
                ПРЕДУПРЕЖДЕНИЕ: Все данные будут проверены. Ложная информация приведет к немедленному отклонению заявки.
                Факт подачи заявки означает ваше согласие на проверку биографии и психологическое тестирование.
              </p>
            </div>
            
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-destructive hover:bg-destructive/80 text-white font-bold"
              >
                ОТПРАВИТЬ ЗАЯВКУ
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                ОТМЕНА
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SecretEasterEggProps {
  onCodeReveal: (code: string) => void;
}

export const SecretEasterEgg = ({ onCodeReveal }: SecretEasterEggProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount >= 10 && !isRevealed) {
      setIsRevealed(true);
      onCodeReveal('060320');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Card 
        className="border-red-900/30 bg-black/40 backdrop-blur cursor-pointer hover:bg-black/50 transition-colors"
        onClick={handleClick}
      >
        <CardContent className="p-8 text-center">
          <p className="text-6xl font-mono text-red-600 mb-4">5535</p>
          {!isRevealed ? (
            <>
              <p className="text-red-400 text-sm">
                {clickCount > 0 ? `Кликов: ${clickCount}/10` : 'Нажмите на число...'}
              </p>
              {clickCount >= 5 && clickCount < 10 && (
                <p className="text-red-500 text-xs mt-2 animate-pulse">
                  Продолжай...
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <p className="text-red-600 text-lg font-bold">🔓 КОД РАСКРЫТ</p>
              <p className="text-red-400 font-mono text-xl tracking-wider">060320</p>
              <p className="text-red-500 text-xs mt-4">
                Код от раздела создателя
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

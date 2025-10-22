import Icon from '@/components/ui/icon';

export const SCPHeader = () => {
  return (
    <header className="mb-8 text-center relative">
      <div className="absolute top-0 right-0 classified-stamp text-destructive px-4 py-2 text-sm">
        CLASSIFIED
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold mb-2 typewriter">
        SCP FOUNDATION
      </h1>
      <p className="text-muted-foreground text-sm tracking-widest">
        SECURE · CONTAIN · PROTECT
      </p>
      <div className="mt-4 text-xs opacity-50">
        УРОВЕНЬ ДОПУСКА: 4 | ПРЕДУПРЕЖДЕНИЕ: НЕСАНКЦИОНИРОВАННЫЙ ДОСТУП КАРАЕТСЯ
      </div>
    </header>
  );
};

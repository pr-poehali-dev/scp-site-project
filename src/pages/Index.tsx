import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

interface SCPObject {
  id: string;
  name: string;
  class: 'Safe' | 'Euclid' | 'Keter';
  description: string;
  containment: string;
  anomalousProperties: string[];
  incidents: Array<{
    title: string;
    date: string;
    description: string;
  }>;
  notes?: string;
  classified?: Array<{
    title: string;
    content: string;
  }>;
}

const scpDatabase: SCPObject[] = [
  {
    id: 'XXXX',
    name: 'Картóжник',
    class: 'Euclid',
    description: 'SCP-XXXX, далее именуемый "Картóжник", выглядит как мальчик европеоидной внешности, приблизительно 12 лет, рост 150 см, вес 40 кг. Отличительной чертой Картóжника является его маниакальная страсть к рисованию на картоне и использование игральных карт.',
    containment: 'SCP-XXXX должен содержаться в усиленной камере содержания для гуманоидов, адаптированной для несовершеннолетних, в Зоне-██. Камера должна быть звукоизолирована и оборудована системой подавления психического воздействия. Камера должна быть оборудована датчиками движения и давления, а также системой автоматического блокирования в случае попытки побега. В камере необходимо поддерживать температуру 20°C и уровень влажности 60%. Персонал, взаимодействующий с SCP-XXXX, должен проходить еженедельные психологические обследования и избегать прямой зрительный контакт.',
    anomalousProperties: [
      'Рисунки: Любой человек, посмотревший на изображение, созданное Картóжником, испытывает сильное желание обладать им. Степень этого желания варьируется в зависимости от психологического состояния субъекта и может привести к агрессии в попытках заполучить изображение. Рисунки также могут содержать предсказания.',
      'Вселение: Картóжник способен вселяться в других людей, начиная с возраста 12 лет. Он может контролировать сознание и действия своей жертвы. Объектом вселения всегда является самый взрослый ребенок в группе.',
      'Трансформация: Картóжник может превращаться в неодушевленные предметы небольшого размера.'
    ],
    incidents: [
      {
        title: 'Инцидент побега 28.09.2025',
        date: '28.09.2025',
        description: '28.09.2025 в период между 18:00 и 19:00 Картóжнику удалось сбежать из Зоны-██ во время плановой передислокации объектов. Используя свои способности к трансформации и вселению, он смог обойти системы безопасности и скрыться до прибытия службы безопасности. Картóжник покинул Зону-██ приблизительно в 19:50.'
      },
      {
        title: 'Поведение после побега',
        date: '28.09.2025 - настоящее время',
        description: 'После побега Картóжник был замечен в окрестностях Зоны-██. Очевидцы сообщают, что он бегает по улицам и полям, раскидывая игральные карты. Люди, которые его видят, подвергаются нападению со стороны Картóжника. Природа нападений заключается в нанесении порезов картами на лицах. Раскиданные карты, по всей видимости, имеют символическое значение: карты ниже дамы обозначают злость к людям. Также Картóжник оставляет надписи мелками на стенах и тротуарах.'
      }
    ],
    notes: 'Считается, что мотивом для побега является месть за захват "Черного Волка", который произошел 10 октября 2025 года. Картóжник представляет серьезную угрозу для безопасности Фонда и гражданского населения. Его способности к вселению и трансформации делают его чрезвычайно трудным для поимки. Следует использовать все доступные ресурсы для его повторного захвата.',
    classified: [
      {
        title: 'ПРИЛОЖЕНИЕ XXXX-5: СОВЕРШЕННО СЕКРЕТНО',
        content: 'Люди, включенные в список для контролируемого взаимодействия с SCP-XXXX:\n\n• Роман Кушнир\n• Артём Соколов\n\nЭти субъекты получают особый статус и доступ к информации, связанной с содержанием и поведением SCP-XXXX. Они будут привлечены к контролируемым экспериментам для изучения аномальных свойств объекта.'
      }
    ]
  }
];

const getClassColor = (className: string) => {
  switch (className) {
    case 'Safe':
      return 'bg-green-600 hover:bg-green-700';
    case 'Euclid':
      return 'bg-yellow-600 hover:bg-yellow-700';
    case 'Keter':
      return 'bg-red-600 hover:bg-red-700';
    default:
      return 'bg-gray-600';
  }
};

const Index = () => {
  const [selectedSCP, setSelectedSCP] = useState<SCPObject | null>(scpDatabase[0]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="border-2 border-border hover:border-destructive transition-colors cursor-pointer animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="FileText" className="text-destructive" size={20} />
                <h3 className="font-bold text-sm">АКТИВНЫЕ ОБЪЕКТЫ</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{scpDatabase.length}</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-destructive transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" className="text-destructive" size={20} />
                <h3 className="font-bold text-sm">НАРУШЕНИЯ СОДЕРЖАНИЯ</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">1</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-destructive transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="Shield" className="text-muted-foreground" size={20} />
                <h3 className="font-bold text-sm">УРОВЕНЬ УГРОЗЫ</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">ВЫСОКИЙ</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="border-2 border-border">
              <CardHeader>
                <h2 className="font-bold text-sm flex items-center gap-2">
                  <Icon name="Database" size={18} />
                  БАЗА ДАННЫХ
                </h2>
              </CardHeader>
              <CardContent className="space-y-2">
                {scpDatabase.map((scp) => (
                  <button
                    key={scp.id}
                    onClick={() => setSelectedSCP(scp)}
                    className={`w-full text-left p-3 border-2 transition-all hover:border-destructive ${
                      selectedSCP?.id === scp.id ? 'border-destructive bg-destructive/10' : 'border-border'
                    }`}
                  >
                    <div className="font-bold text-sm mb-1">SCP-{scp.id}</div>
                    <div className="text-xs text-muted-foreground mb-2">{scp.name}</div>
                    <Badge className={getClassColor(scp.class)}>{scp.class}</Badge>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {selectedSCP && (
              <Card className="border-2 border-border paper-texture animate-fade-in">
                <CardHeader className="border-b-2 border-border bg-card/50">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 typewriter">
                        SCP-{selectedSCP.id}: {selectedSCP.name}
                      </h2>
                      <Badge className={`${getClassColor(selectedSCP.class)} text-white`}>
                        КЛАСС ОБЪЕКТА: {selectedSCP.class.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="classified-stamp text-destructive px-3 py-1 text-xs">
                      TOP SECRET
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="mt-6 space-y-6">
                  <section>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2 border-b-2 border-destructive pb-2">
                      <Icon name="Lock" size={16} />
                      ОСОБЫЕ УСЛОВИЯ СОДЕРЖАНИЯ
                    </h3>
                    <p className="text-sm leading-relaxed">{selectedSCP.containment}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2 border-b-2 border-destructive pb-2">
                      <Icon name="FileText" size={16} />
                      ОПИСАНИЕ
                    </h3>
                    <p className="text-sm leading-relaxed">{selectedSCP.description}</p>
                  </section>

                  <section>
                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2 border-b-2 border-destructive pb-2">
                      <Icon name="Zap" size={16} />
                      АНОМАЛЬНЫЕ СВОЙСТВА
                    </h3>
                    <ul className="space-y-2">
                      {selectedSCP.anomalousProperties.map((prop, idx) => (
                        <li key={idx} className="text-sm leading-relaxed pl-4 border-l-2 border-muted">
                          {prop}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {selectedSCP.incidents.length > 0 && (
                    <section>
                      <h3 className="text-sm font-bold mb-3 flex items-center gap-2 border-b-2 border-destructive pb-2">
                        <Icon name="AlertCircle" size={16} />
                        ИНЦИДЕНТЫ И ПРИЛОЖЕНИЯ
                      </h3>
                      <Accordion type="single" collapsible className="space-y-2">
                        {selectedSCP.incidents.map((incident, idx) => (
                          <AccordionItem key={idx} value={`incident-${idx}`} className="border-2 border-border px-4">
                            <AccordionTrigger className="text-sm font-semibold hover:text-destructive">
                              {incident.title} [{incident.date}]
                            </AccordionTrigger>
                            <AccordionContent className="text-sm leading-relaxed pt-2">
                              {incident.description}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </section>
                  )}

                  {selectedSCP.notes && (
                    <section className="border-2 border-destructive bg-destructive/5 p-4">
                      <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                        <Icon name="AlertTriangle" size={16} className="text-destructive" />
                        ПРИМЕЧАНИЕ
                      </h3>
                      <p className="text-sm leading-relaxed">{selectedSCP.notes}</p>
                    </section>
                  )}

                  {selectedSCP.classified && selectedSCP.classified.length > 0 && (
                    <section className="border-4 border-destructive bg-black text-destructive p-6">
                      <div className="text-center mb-4">
                        <div className="text-2xl font-bold tracking-widest mb-2 animate-glitch">
                          ⚠ СОВЕРШЕННО СЕКРЕТНО ⚠
                        </div>
                        <div className="text-xs">УРОВЕНЬ ДОПУСКА 5 ТРЕБУЕТСЯ</div>
                      </div>
                      
                      {selectedSCP.classified.map((item, idx) => (
                        <div key={idx} className="mt-4">
                          <h4 className="font-bold mb-2 text-sm">{item.title}</h4>
                          <p className="text-sm whitespace-pre-line leading-relaxed">{item.content}</p>
                        </div>
                      ))}
                    </section>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <footer className="mt-8 text-center text-xs text-muted-foreground border-t-2 border-border pt-4">
          <p>SCP FOUNDATION © 2025 | ДАННЫЙ ДОКУМЕНТ ЯВЛЯЕТСЯ СОБСТВЕННОСТЬЮ ФОНДА SCP</p>
          <p className="mt-1">НЕСАНКЦИОНИРОВАННОЕ РАСПРОСТРАНЕНИЕ КАРАЕТСЯ СОГЛАСНО ПРОТОКОЛУ ████-█</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;

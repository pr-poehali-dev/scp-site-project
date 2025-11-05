import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Progress } from '@/components/ui/progress';

interface Rank {
  title: string;
  duties: string;
  category: string;
}

const RANKS: Rank[] = [
  {
    title: 'Младший Стажер',
    duties: 'Выполнение простых задач под строгим контролем, ведение документации, помощь в организации встреч, соблюдение всех инструкций и сроков. Строгое следование регламентам компании.',
    category: 'Стажеры'
  },
  {
    title: 'Стажер',
    duties: 'Выполнение поставленных задач в рамках проекта, участие в анализе данных, подготовка отчетов, соблюдение конфиденциальности информации. Активное обучение и применение полученных знаний на практике.',
    category: 'Стажеры'
  },
  {
    title: 'Старший Стажер',
    duties: 'Самостоятельное выполнение задач, требующих углубленных знаний, участие в разработке новых процессов, менторство младших стажеров, контроль качества выполняемой работы. Ответственность за результаты своей работы.',
    category: 'Стажеры'
  },
  {
    title: 'Младший Специалист',
    duties: 'Выполнение специализированных задач под руководством старших коллег, участие в проектах, анализ и обработка данных, соблюдение стандартов качества. Ответственность за своевременное и качественное выполнение порученных задач.',
    category: 'Специалисты'
  },
  {
    title: 'Специалист',
    duties: 'Самостоятельное выполнение специализированных задач, участие в разработке и внедрении новых решений, консультирование младших специалистов, ответственность за результат своей работы. Строгое соблюдение корпоративных стандартов.',
    category: 'Специалисты'
  },
  {
    title: 'Старший Специалист',
    duties: 'Руководство проектами в рамках своей специализации, разработка и внедрение новых методологий, контроль качества работы специалистов, ответственность за достижение целей проекта. Обучение и наставничество специалистов.',
    category: 'Специалисты'
  },
  {
    title: 'Ведущий Специалист',
    duties: 'Экспертное руководство сложными проектами, разработка стратегических решений, контроль за соблюдением стандартов качества, ответственность за результаты деятельности отдела. Консультирование руководства по вопросам специализации.',
    category: 'Специалисты'
  },
  {
    title: 'Младший Координатор',
    duties: 'Координация отдельных аспектов проектов, ведение отчетности, коммуникация с участниками проекта, соблюдение сроков и бюджетов. Своевременное информирование руководства о возникающих проблемах.',
    category: 'Координаторы'
  },
  {
    title: 'Координатор',
    duties: 'Полная координация проектов, управление ресурсами, контроль за выполнением задач, взаимодействие с заинтересованными сторонами, ответственность за достижение целей проекта.',
    category: 'Координаторы'
  },
  {
    title: 'Старший Координатор',
    duties: 'Координация нескольких проектов одновременно, управление командой координаторов, разработка и внедрение новых процессов координации, ответственность за эффективность проектов.',
    category: 'Координаторы'
  },
  {
    title: 'Младший Аналитик',
    duties: 'Сбор и анализ данных под руководством старших аналитиков, подготовка отчетов, выявление тенденций и закономерностей, соблюдение стандартов аналитической работы.',
    category: 'Аналитики'
  },
  {
    title: 'Аналитик',
    duties: 'Самостоятельный анализ данных, разработка аналитических моделей, подготовка рекомендаций для руководства, участие в стратегическом планировании.',
    category: 'Аналитики'
  },
  {
    title: 'Старший Аналитик',
    duties: 'Руководство аналитическими проектами, разработка и внедрение новых аналитических инструментов, контроль качества аналитических данных, ответственность за точность прогнозов и рекомендаций.',
    category: 'Аналитики'
  },
  {
    title: 'Ассистент Менеджера',
    duties: 'Помощь менеджеру проектов в планировании и организации, ведение документации, отслеживание сроков, коммуникация с участниками проекта, решение оперативных вопросов.',
    category: 'Менеджеры Проектов'
  },
  {
    title: 'Менеджер Проектов',
    duties: 'Полное управление проектом, планирование, бюджетирование, организация, контроль, управление рисками, обеспечение достижения целей проекта в срок и в рамках бюджета.',
    category: 'Менеджеры Проектов'
  },
  {
    title: 'Старший Менеджер Проектов',
    duties: 'Управление несколькими проектами одновременно, разработка методологии управления проектами, контроль за работой менеджеров проектов, ответственность за успешную реализацию портфеля проектов.',
    category: 'Менеджеры Проектов'
  },
  {
    title: 'Руководитель Группы',
    duties: 'Планирование работы группы, распределение задач, контроль за выполнением, мотивация команды, обеспечение достижения KPI группы.',
    category: 'Руководители'
  },
  {
    title: 'Руководитель Отдела',
    duties: 'Стратегическое планирование работы отдела, управление ресурсами, контроль за выполнением планов, взаимодействие с другими отделами, обеспечение достижения целей отдела.',
    category: 'Руководители'
  },
  {
    title: 'Заместитель Руководителя Отдела',
    duties: 'Поддержка руководителя отдела во всех аспектах управления, замещение руководителя в его отсутствие, выполнение отдельных задач по поручению руководителя.',
    category: 'Руководители'
  },
  {
    title: 'Директор Проекта',
    duties: 'Общее руководство крупным проектом или программой проектов, принятие стратегических решений, взаимодействие с ключевыми заинтересованными сторонами, ответственность за достижение целей проекта/программы.',
    category: 'Руководители'
  },
  {
    title: 'Заместитель Директора Проекта',
    duties: 'Поддержка директора проекта во всех аспектах управления проектом, замещение директора в его отсутствие, координация работы различных команд проекта.',
    category: 'Руководители'
  },
  {
    title: 'Директор Департамента',
    duties: 'Стратегическое руководство департаментом, разработка и реализация планов развития, управление ресурсами, взаимодействие с другими департаментами и внешними организациями, ответственность за результаты деятельности департамента.',
    category: 'Руководители'
  },
  {
    title: 'Заместитель Директора Департамента',
    duties: 'Поддержка директора департамента во всех аспектах управления, замещение директора в его отсутствие, координация работы отделов департамента.',
    category: 'Руководители'
  },
  {
    title: 'Финансовый Контролер',
    duties: 'Обеспечение финансового контроля за деятельностью организации, разработка и внедрение финансовых политик и процедур, анализ финансовых результатов, подготовка отчетности, контроль за соблюдением бюджета.',
    category: 'Финансовые и Региональные Позиции'
  },
  {
    title: 'Региональный Директор',
    duties: 'Управление деятельностью компании в регионе, разработка и реализация стратегии развития региона, управление персоналом, взаимодействие с местными органами власти и бизнес-партнерами, ответственность за достижение целей по прибыли и росту рынка в регионе.',
    category: 'Финансовые и Региональные Позиции'
  },
  {
    title: 'Операционный Директор',
    duties: 'Управление операционной деятельностью компании, обеспечение эффективности и результативности бизнес-процессов, оптимизация затрат, контроль качества продукции и услуг, взаимодействие с другими подразделениями компании.',
    category: 'Финансовые и Региональные Позиции'
  },
  {
    title: 'Исполнительный Директор',
    duties: 'Оперативное управление компанией, реализация стратегии, утвержденной Советом Директоров, управление персоналом, финансовое планирование и контроль, взаимодействие с внешними заинтересованными сторонами.',
    category: 'Руководство Фондом'
  },
  {
    title: 'Советник Руководителя Фонда',
    duties: 'Консультирование руководителя фонда по стратегическим вопросам, анализ рынка и конкурентов, разработка рекомендаций по развитию фонда, участие в переговорах с партнерами и инвесторами.',
    category: 'Руководство Фондом'
  },
  {
    title: 'Заместитель Руководителя Фонда',
    duties: 'Поддержка руководителя фонда во всех аспектах управления, замещение руководителя в его отсутствие, координация работы подразделений фонда, выполнение отдельных задач по поручению руководителя.',
    category: 'Руководство Фондом'
  },
  {
    title: 'Руководитель Фонда',
    duties: 'Общее руководство фондом, разработка и реализация стратегии развития, управление инвестиционным портфелем, взаимодействие с инвесторами и партнерами, ответственность за достижение целей фонда.',
    category: 'Руководство Фондом'
  }
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
    const categories = Array.from(new Set(RANKS.map(rank => rank.category)));
    
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
          <div className="space-y-8">
            {categories.map((category, catIndex) => {
              const categoryRanks = RANKS.filter(rank => rank.category === category);
              
              return (
                <div key={catIndex} className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-purple-700">
                    <Icon name="Briefcase" size={20} className="text-purple-400" />
                    <h3 className="text-xl font-bold text-purple-300">{category}</h3>
                    <span className="ml-auto text-sm text-purple-400">
                      {categoryRanks.length} {categoryRanks.length === 1 ? 'должность' : categoryRanks.length < 5 ? 'должности' : 'должностей'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {categoryRanks.map((rank, index) => {
                      const globalIndex = RANKS.findIndex(r => r.title === rank.title) + 1;
                      
                      return (
                        <div
                          key={index}
                          className="p-4 bg-purple-900/20 border border-purple-800 rounded-lg hover:bg-purple-900/30 transition-all hover:shadow-lg hover:shadow-purple-900/20"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                              {globalIndex}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-purple-100 mb-1">
                                {rank.title}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-purple-400">
                                <Icon name="Shield" size={14} />
                                <span>{category}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pl-13 space-y-2">
                            <div className="flex items-start gap-2">
                              <Icon name="ClipboardList" size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-purple-300 mb-1">Обязанности:</p>
                                <p className="text-sm text-purple-200/80 leading-relaxed">
                                  {rank.duties}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Icon name="Info" size={16} className="text-purple-400" />
                <span className="text-purple-200 text-sm">
                  Всего званий: <span className="font-bold">{RANKS.length}</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Layers" size={16} className="text-purple-400" />
                <span className="text-purple-200 text-sm">
                  Категорий: <span className="font-bold">{categories.length}</span>
                </span>
              </div>
            </div>
            <p className="text-purple-200/70 text-xs mt-3 flex items-start gap-2">
              <Icon name="TrendingUp" size={14} className="mt-0.5 flex-shrink-0" />
              <span>Повышение звания происходит на основе опыта, заслуг и выполненных задач. Каждая должность имеет чёткие обязанности и требования.</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
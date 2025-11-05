import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SCPObject {
  id: string;
  name: string;
  class: string;
  containment: string;
  description: string;
  observations: { id: string; text: string }[];
  theories: string[];
}

const SCP_OBJECTS: SCPObject[] = [
  {
    id: 'SCP-XXX',
    name: 'Полуночный Посетитель',
    class: 'Евклид',
    containment: `SCP-XXX невозможно полноценно содержать из-за его непредсказуемых перемещений и спонтанных появлений. Вместо этого, Фонд сосредоточен на протоколах дезинформации и экстренного реагирования.

В каждом городе, где зафиксирована активность SCP-XXX, должны быть внедрены не менее двух агентов под прикрытием работников социальных служб или сотрудников полиции. Их задача - мониторинг сообщений о "странных личностях" в жилых районах и нейтрализация последствий деятельности SCP-XXX.

Разработан и поддерживается комплекс мер дезинформации, направленный на объяснение появлений SCP-XXX как "детских страхов", "галлюцинаций", "шуток пранкеров" или "происшествий с участием грабителей".

В случае задокументированной гибели ребенка, связанной с SCP-XXX, проводятся тщательные расследования с целью сокрытия связи с аномалией. Семьям погибших выплачиваются компенсации и оказывается психологическая помощь.`,
    description: `SCP-XXX - это гуманоидная сущность ростом около 1.8 метров. Его тело полностью покрыто черной субстанцией, похожей на сажу или темное масло. У SCP-XXX непропорционально большие глаза, полностью черные и лишенные зрачков. Неизвестно, носит ли SCP-XXX одежду или его "черная кожа" является его естественным покровом.

SCP-XXX появляется исключительно в многоквартирных жилых домах, чаще всего вечером или ночью. Он перемещается по подъездам, бесшумно передвигаясь по лестницам и коридорам. SCP-XXX целенаправленно ищет детей в возрасте от 3 до 12 лет, остающихся без присмотра взрослых (одни в квартире, поздно гуляющие во дворе, идущие домой из школы/магазина без сопровождения).

Поведение SCP-XXX по отношению к детям варьируется. В большинстве случаев он просто пристально смотрит на ребенка, издавая тихий, шипящий звук. Этот "контакт" вызывает у ребенка сильный страх и может привести к ночным кошмарам, тревоге и другим психологическим проблемам. Такие случаи классифицируются как "воздействие типа А".

В примерно 15% зафиксированных случаев SCP-XXX применяет физическое насилие по отношению к ребенку. Это может быть легкий толчок, щипок, или попытка схватить ребенка за руку. Эти случаи классифицируются как "воздействие типа Б" и часто приводят к серьезным травмам и увечьям.

В приблизительно 2% случаев "воздействия типа Б" заканчиваются смертью ребенка. Причины смерти варьируются, но чаще всего это обширные внутренние повреждения, вызванные необъяснимой силой, или остановка сердца, вызванная сильным испугом. Такие случаи классифицируются как "воздействие типа С" и требуют максимального уровня секретности.`,
    observations: [
      {
        id: 'XXX-1-1',
        text: 'Агент ██████ наблюдал SCP-XXX в многоквартирном доме в ██████████, Россия. SCP-XXX несколько раз проходил мимо квартиры, в которой, по данным агента, проживала 6-летняя девочка, часто остающаяся одна дома. Агент не зафиксировал попыток проникновения в квартиру, но отметил, что SCP-XXX каждый раз замедлял шаг, проходя мимо двери.'
      },
      {
        id: 'XXX-1-2',
        text: 'Анализ записей с камер видеонаблюдения в подъезде жилого дома в ██████, США, показал, что SCP-XXX вошел в подъезд вслед за 8-летним мальчиком, возвращавшимся из магазина. SCP-XXX двигался с неестественной скоростью, телепортируясь на короткие расстояния, чтобы не отстать от мальчика. Когда мальчик вошел в свою квартиру, SCP-XXX остановился у двери и несколько минут пристально смотрел на нее.'
      },
      {
        id: 'XXX-1-3',
        text: 'В ████████, Германия, зафиксирован случай "воздействия типа С". 10-летний мальчик был найден мертвым в подъезде своего дома. Согласно заключению судмедэкспертов, смерть наступила в результате разрыва внутренних органов. На теле мальчика обнаружены следы темной субстанции, схожей с той, которой покрыт SCP-XXX.'
      }
    ],
    theories: [
      'Некоторые исследователи предполагают, что SCP-XXX является проявлением коллективного страха детей, остающихся без присмотра. Эта теория объясняет, почему SCP-XXX появляется только в жилых домах и почему его жертвами становятся именно дети.',
      'Другая теория утверждает, что SCP-XXX является сущностью из другого измерения, которая питается детским страхом.',
      'Пока не существует надежных способов проверить ни одну из этих теорий.'
    ]
  }
];

export function SCPObjectSection() {
  const [selectedSCP, setSelectedSCP] = useState<string | null>(null);

  const getClassColor = (objectClass: string) => {
    switch (objectClass.toLowerCase()) {
      case 'безопасный':
        return 'text-green-400 border-green-700';
      case 'евклид':
        return 'text-yellow-400 border-yellow-700';
      case 'кетер':
        return 'text-red-400 border-red-700';
      default:
        return 'text-gray-400 border-gray-700';
    }
  };

  return (
    <Card className="mb-8 bg-gray-950/50 border-red-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-400">
          <Icon name="FileWarning" size={24} />
          База Данных SCP-Объектов
        </CardTitle>
        <CardDescription className="text-red-200/70">
          Секретные файлы аномальных объектов
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!selectedSCP ? (
          <div className="space-y-3">
            {SCP_OBJECTS.map((scp) => (
              <div
                key={scp.id}
                className="p-4 bg-red-950/20 border border-red-900 rounded-lg hover:bg-red-950/30 transition-all cursor-pointer"
                onClick={() => setSelectedSCP(scp.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-red-300 font-mono font-bold text-lg">
                        {scp.id}
                      </span>
                      <span className="text-red-100 font-semibold">
                        "{scp.name}"
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono px-2 py-1 border rounded ${getClassColor(scp.class)}`}>
                        {scp.class}
                      </span>
                    </div>
                  </div>
                  <Icon name="ChevronRight" size={20} className="text-red-400" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <Button
              onClick={() => setSelectedSCP(null)}
              variant="ghost"
              className="text-red-400 hover:text-red-300 -ml-2"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться к списку
            </Button>

            {SCP_OBJECTS.filter(scp => scp.id === selectedSCP).map((scp) => (
              <div key={scp.id} className="space-y-6">
                <div className="border-l-4 border-red-600 pl-4">
                  <h2 className="text-2xl font-bold text-red-300 font-mono mb-1">
                    {scp.id} - "{scp.name}"
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-red-200/70 text-sm">Класс объекта:</span>
                    <span className={`text-sm font-mono px-2 py-1 border rounded ${getClassColor(scp.class)}`}>
                      {scp.class}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="ShieldAlert" size={20} className="text-red-400" />
                    <h3 className="text-lg font-semibold text-red-300">
                      Особые условия содержания
                    </h3>
                  </div>
                  <div className="text-red-100/80 text-sm leading-relaxed whitespace-pre-line">
                    {scp.containment}
                  </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="FileText" size={20} className="text-red-400" />
                    <h3 className="text-lg font-semibold text-red-300">
                      Описание
                    </h3>
                  </div>
                  <div className="text-red-100/80 text-sm leading-relaxed whitespace-pre-line">
                    {scp.description}
                  </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="Eye" size={20} className="text-red-400" />
                    <h3 className="text-lg font-semibold text-red-300">
                      Дополнение {scp.id.replace('SCP-', '')}-1: Записи наблюдений
                    </h3>
                  </div>
                  <div className="space-y-4">
                    {scp.observations.map((obs, index) => (
                      <div
                        key={index}
                        className="pl-4 border-l-2 border-red-800"
                      >
                        <p className="text-red-300 text-xs font-mono mb-2">
                          Протокол наблюдения {obs.id}:
                        </p>
                        <p className="text-red-100/80 text-sm leading-relaxed">
                          {obs.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-red-950/20 border border-red-900 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon name="Lightbulb" size={20} className="text-red-400" />
                    <h3 className="text-lg font-semibold text-red-300">
                      Дополнение {scp.id.replace('SCP-', '')}-2: Теории
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {scp.theories.map((theory, index) => (
                      <p
                        key={index}
                        className="text-red-100/80 text-sm leading-relaxed pl-4 border-l-2 border-red-800"
                      >
                        {theory}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-red-950/30 border border-red-800 rounded flex items-start gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-200/70 text-xs">
                    ПРЕДУПРЕЖДЕНИЕ: Доступ к данному файлу ограничен. Несанкционированный доступ карается согласно Протоколу 12-Omega.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

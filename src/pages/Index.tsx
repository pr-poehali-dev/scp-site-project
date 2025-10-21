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
    id: '████',
    name: 'Полуденные Игрища',
    class: 'Euclid',
    description: 'SCP-████ – это предположительно нефизическая сущность, проявляющая свою активность исключительно в период с 12:00 до 13:00 по местному времени. SCP-████ поражает детей в возрасте строго 11 лет, "вселяясь" в них и временно получая контроль над телом. Поражённый ребёнок обозначается как SCP-████-1.',
    containment: 'Любые сообщения о необычном поведении у детей в возрасте 11 лет в период с 12:00 до 13:00 должны быть тщательно проверены. В случае подтверждения воздействия SCP-████, заражённый ребёнок (SCP-████-1) должен быть немедленно изолирован в специально оборудованной камере содержания гуманоидов в Зоне [УДАЛЕНО]. Камера содержания должна быть освещена ярким, рассеянным светом в течение всего дня. Категорически запрещается подвергать SCP-████-1 воздействию темноты или позволять ему находиться в тени на протяжении длительного времени.',
    anomalousProperties: [
      'Изменение Личности: SCP-████-1 становится чрезмерно игривым, жестоким и непредсказуемым. Он может совершать действия, не свойственные оригинальной личности ребёнка, такие как намеренное нанесение вреда себе или окружающим, вандализм и нарушение общепринятых норм.',
      'Повышенная Ловкость: SCP-████-1 демонстрирует нехарактерную для своего возраста ловкость и быстроту реакции. Ему могут удаваться акробатические трюки или побеги, которые были бы невозможны для него в обычное время.',
      'Фотофобия: SCP-████-1 проявляет выраженную неприязнь к яркому свету. Он стремится к тени и избегает прямого солнечного света. В темноте его активность значительно возрастает.',
      'Шепот: При попытке взаимодействия с SCP-████-1 во время "полуденного игрища", сотрудники часто слышат тихий, неразборчивый шепот, исходящий от ребёнка, даже если его рот закрыт.'
    ],
    incidents: [
      {
        title: 'Интервью Протокол ████-Alpha',
        date: 'После окончания полуденного игрища',
        description: 'Записи интервью с SCP-████-1 после окончания "полуденного игрища". Ребёнок выражает замешательство и страх, не понимая, что с ним происходит. Аномальные свойства SCP-████ прекращаются ровно в 13:00. SCP-████-1 возвращается к своему обычному состоянию, не помня о своих действиях в период "полуденного игрища". Ребёнок испытывает усталость и дезориентацию.'
      },
      {
        title: 'Эксперимент Лог ████-Beta',
        date: 'Текущие исследования',
        description: 'Описание экспериментов, направленных на изучение воздействия света и тени на активность SCP-████. Подтверждена связь между темнотой и усилением аномальных свойств. При попытке побега или проявлении признаков агрессии применяются нелетальные средства сдерживания (транквилизаторы, звуковые барьеры).'
      }
    ],
    notes: 'Источник инфекции неизвестен. Предполагается, что SCP-████ передаётся через [УДАЛЕНО - возможно, через зрительный контакт, определенные предметы, географические зоны]. Персоналу, взаимодействующему с SCP-████-1, настоятельно рекомендуется минимизировать прямой зрительный контакт и придерживаться формального стиля общения.'
  },
  {
    id: 'XXXX-3',
    name: 'Курьер',
    class: 'Safe',
    description: 'SCP-XXXX-3 - это мужчина европеоидной внешности, возрастом примерно 25 лет, ростом 180 см и весом 75 кг. Отличительной чертой SCP-XXXX-3 является его ненормально высокая скорость передвижения на короткие дистанции и фиксированное время появления в определенном месте. SCP-XXXX-3 утверждает, что является старшим братом SCP-XXXX ("Карточник") и SCP-XXXX-2 ("Младший Близнечик").',
    containment: 'SCP-XXXX-3 содержится в стандартной камере содержания для гуманоидов в Зоне-██. Камера должна быть оборудована минимальным набором мебели и предоставлять возможности для физических упражнений. SCP-XXXX-3 разрешено чтение, рисование (с предоставлением безопасных материалов) и общение с одобренным персоналом. Не допускается предоставление SCP-XXXX-3 доступа к информации о SCP-XXXX или SCP-XXXX-2 без одобрения O5.',
    anomalousProperties: [
      'Аномальная скорость: SCP-XXXX-3 способен развивать чрезвычайно высокую скорость на короткие дистанции (до 70 км/ч). Он совершает рывки на расстояние до 100 метров, после чего ему требуется короткий период отдыха. Эта способность, по словам самого SCP-XXXX-3, не требует никаких специальных усилий.',
      'Фиксированное появление: SCP-XXXX-3 аномально появляется в определённой географической точке в городе Москве каждый день ровно в 20:00 по московскому времени. Место появления — ГУМ, Красная площадь. Он не способен контролировать это явление и не знает, почему оно происходит. После появления он свободно перемещается в пределах Москвы, пока не будет задержан сотрудниками Фонда.',
      'Отсутствие других аномалий: В отличие от своих братьев, SCP-XXXX-3 не проявляет никаких других аномальных свойств, кроме вышеуказанных. Медицинское обследование не выявило никаких физиологических или генетических отклонений, которые могли бы объяснить его скорость.'
    ],
    incidents: [
      {
        title: 'Обнаружение и захват',
        date: 'Дата ЗАСЕКРЕЧЕНА',
        description: 'SCP-XXXX-3 привлёк внимание Фонда после серии сообщений в социальных сетях, в которых описывался "сверхбыстрый человек", появляющийся каждый вечер в ГУМе. После нескольких наблюдений и подтверждений аномалии Фондом была проведена операция по захвату SCP-XXXX-3. Задержанный охотно сотрудничал и раскрыл информацию о своих предполагаемых аномальных братьях.'
      },
      {
        title: 'Интервью: Показания о братьях',
        date: 'После захвата',
        description: 'Доктор ████: "Расскажите о ваших братьях, SCP-XXXX и SCP-XXXX-2."\n\nSCP-XXXX-3: "Их зовут, или звали, [УДАЛЕНО] и [УДАЛЕНО]. Я их не видел очень давно. Когда это началось, я сбежал. Это… это было страшно. Они были другими."\n\nДоктор ████: "Что вы имеете в виду под \'другими\'?"\n\nSCP-XXXX-3: "Они начали…меняться. [УДАЛЕНО] стал замкнутым и сумасшедшим. А [УДАЛЕНО]…он всегда был злым, но потом это стало что-то другое. Я просто не мог этого вынести."\n\nДоктор ████: "Вы знаете, в чём суть их аномалий?"\n\nSCP-XXXX-3: "Нет. Я просто знаю, что это что-то ненормальное. И то, что это как-то связано с картами и рисунками."'
      }
    ],
    notes: 'SCP-XXXX-3 кажется искренним в своём желании избежать своих братьев и не обладает информацией об их текущем местонахождении или планах. Его аномалия, возможно, является каким-то проявлением генетической связи с аномальными братьями, хотя природа этой связи неясна. Попытки использовать SCP-XXXX-3 для поиска SCP-XXXX и SCP-XXXX-2 продолжаются, но пока безрезультатны. Хотя официально SCP-XXXX-3 классифицируется как Безопасный, следует учитывать его потенциальную связь с двумя Евклид-объектами, представляющими серьезную угрозу.',
    classified: [
      {
        title: 'ПРИЛОЖЕНИЕ XXXX-3-3: ВОЗМОЖНАЯ РЕКЛАССИФИКАЦИЯ',
        content: 'Хотя официально SCP-XXXX-3 классифицируется как Безопасный, следует учитывать его потенциальную связь с двумя Евклид-объектами, представляющими серьезную угрозу.\n\nРЕКОМЕНДАЦИЯ: Продолжить наблюдение и рассмотреть возможность изменения класса объекта в случае обнаружения новых связей или проявлений аномалий.\n\nСТАТУС СОТРУДНИЧЕСТВА: АКТИВНОЕ\nУРОВЕНЬ УГРОЗЫ: НИЗКИЙ\nВОЗМОЖНОСТЬ ИСПОЛЬЗОВАНИЯ ДЛЯ ПОИСКА: Продолжаются попытки использовать SCP-XXXX-3 для обнаружения местонахождения SCP-XXXX и SCP-XXXX-2. Результаты пока отрицательные.'
      }
    ]
  },
  {
    id: 'XXXX-2',
    name: 'Младший Близнечик',
    class: 'Euclid',
    description: 'SCP-XXXX-2 – это аномальная сущность, внешне идентичная SCP-XXXX ("Карточнику"), но приблизительно на два года младше (около 10 лет). Внешнее различие минимально, но психологически SCP-XXXX-2 проявляет признаки садистского поведения и крайней нестабильности. Основная аномальная способность SCP-XXXX-2 – это вселение в людей и последующее "разделение".',
    containment: 'В связи с тесной связью с SCP-XXXX, захват и содержание SCP-XXXX-2 имеют приоритет А. В случае обнаружения SCP-XXXX-2, следует немедленно развернуть мобильную оперативную группу Эта-10 ("Охотники на двойников"). Места, где был замечен SCP-XXXX-2, должны быть обработаны амнезиаками класса B. Захваченные экземпляры SCP-XXXX-2-1 должны быть немедленно устранены. Прямой контакт с SCP-XXXX-2 должен быть сведен к минимуму.',
    anomalousProperties: [
      'Вселение и Раздвоение (SCP-XXXX-2-1): SCP-XXXX-2 способен вселяться в людей посредством физического контакта. После вселения, вместо полного контроля, как у SCP-XXXX, SCP-XXXX-2 вызывает быстрое раздвоение личности у жертвы. В течение нескольких минут у жертвы формируется второй, отдельный разум (обозначенный как SCP-XXXX-2-1), полностью подчиненный SCP-XXXX-2.',
      'Жертвы (SCP-XXXX-2-1): "Двойники" сохраняют внешность оригинальной жертвы, но их поведение кардинально меняется. Они проявляют насильственные и непредсказуемые наклонности, подчиняясь скрытым командам SCP-XXXX-2. SCP-XXXX-2 способен контролировать несколько SCP-XXXX-2-1 одновременно.',
      'Масштабирование: SCP-XXXX-2 способен "разделять" свои жертвы, создавая все больше и больше SCP-XXXX-2-1. При этом SCP-XXXX-2, судя по всему, не испытывает никакого истощения или ухудшения когнитивных функций.',
      'Схожесть с SCP-XXXX: Как и SCP-XXXX, SCP-XXXX-2 обладает способностями к рисованию (хотя его рисунки менее детализированы и более хаотичны) и трансформации в небольшие предметы.'
    ],
    incidents: [
      {
        title: 'Первое обнаружение',
        date: 'Несколько недель после побега SCP-XXXX',
        description: 'SCP-XXXX-2 был впервые обнаружен через несколько недель после побега SCP-XXXX из Зоны-██. Сообщения о странном поведении людей, внезапных вспышках насилия и распространении слухов о "мальчике-двойнике" привлекли внимание Фонда.'
      },
      {
        title: 'Допрос SCP-XXXX-2-1 (D-9472)',
        date: 'Дата ЗАСЕКРЕЧЕНА',
        description: 'Извлечение из протокола допроса:\n\nДоктор ████: "Опишите свой опыт после контакта с SCP-XXXX-2."\n\nD-9472: "Я… я помню только боль. Потом словно кто-то другой поселился в моей голове. Я видел мир его глазами. Он… он хотел, чтобы я причинял боль другим. Чтобы они тоже чувствовали себя так, как я."\n\nДоктор ████: "Вы можете вспомнить какие-либо конкретные указания?"\n\nD-9472: "Только шепот. Постоянный шепот в голове. Говорит… показывает… рисунки. Рисунки злобы."'
      }
    ],
    notes: 'SCP-XXXX-2 представляет собой экспоненциально растущую угрозу. Его способность к созданию и управлению множеством сущностей SCP-XXXX-2-1 делает его потенциально способным дестабилизировать целые города. Любая информация о местонахождении SCP-XXXX-2 должна быть немедленно передана старшему исследователю. До сих пор не установлено, контролирует ли SCP-XXXX-2 SCP-XXXX, или наоборот. Предполагается, что они действуют как своего рода "команда", используя свои аномальные способности для достижения неизвестных целей.',
    classified: [
      {
        title: 'ПРИЛОЖЕНИЕ XXXX-2-2: СВЯЗЬ С SCP-XXXX',
        content: 'До сих пор не установлено, контролирует ли SCP-XXXX-2 SCP-XXXX, или наоборот. Предполагается, что они действуют как своего рода "команда", используя свои аномальные способности для достижения неизвестных целей.\n\nСТАТУС: В РОЗЫСКЕ\nУРОВЕНЬ УГРОЗЫ: КРИТИЧЕСКИЙ\nПРИОРИТЕТ ЗАХВАТА: A\n\nМобильная оперативная группа Эта-10 ("Охотники на двойников") активирована для поиска и задержания SCP-XXXX-2.'
      }
    ]
  },
  {
    id: 'YYYY',
    name: 'Чёрный Волк',
    class: 'Euclid',
    description: 'SCP-YYYY – это гуманоидная сущность, проявляющая активность в период с 17:30 до 05:00 (по местному времени) в городе Энгельс, Саратовская область. После закрытия магазина "Фасоль" (адрес ЗАСЕКРЕЧЕНО), SCP-YYYY проявляет повышенную агрессию и непредсказуемость. Важно отметить, что магазин "Фасоль" не был разрушен или заброшен, он просто закрыт по неизвестным причинам.',
    containment: 'Район вокруг магазина "Фасоль" находится под наблюдением. Доступ к магазину строго воспрещен. Ведется круглосуточное наблюдение за районом. Используемые для наблюдения дроны замаскированы под обычные объекты городской среды (например, фонари, рекламные вывески, птицы) для сохранения секретности. Внедрена программа дезинформации среди населения города Энгельс, направленная на подавление любых слухов и легенд, связанных с магазином "Фасоль" и SCP-YYYY. Агентам Фонда запрещается обсуждать детали SCP-YYYY с местными жителями под любым предлогом.',
    anomalousProperties: [
      'Информационная угроза: Любое распространение информации о SCP-YYYY, его происхождении или связи с магазином "Фасоль", приводит к тому, что SCP-YYYY начинает выслеживать распространителя информации. Неважно, местный это житель или сотрудник Фонда, передача информации активирует преследование. Последствием преследования всегда является нанесение вреда или смерть.',
      'Внешность: Объект описывается как высокая и массивная фигура, с непропорционально длинными ногами, но не худая. Носит длинную, развевающуюся одежду черного цвета, скрывающую большую часть тела. Лицо имеет бледный, почти бежевый оттенок, лишенное каких-либо выраженных черт. Наблюдаются усиливающиеся деформации конечностей и признаки разложения на лице.',
      'Происхождение: Согласно первичным данным расследования, SCP-YYYY когда-то был обычным человеком, работавшим в магазине "Фасоль". После закрытия магазина был заперт внутри вместе с несколькими бродячими собаками. Собаки загрызли его до смерти. В магазине хранились токсичные отходы химического производства (предположительно, связанные с организацией [ЗАСЕКРЕЧЕНО]). Яд смешался с останками тела, вызвав мутацию.',
      'Стадия 1 - Слежка (несколько часов до нескольких дней): SCP-YYYY выслеживает жертв, участвовавших в актах вандализма по отношению к магазину "Фасоль", а также распространителей информации о нем. Объект сохраняет полное молчание, действует скрытно в тени.',
      'Стадия 2 - Нападение (несколько минут): SCP-YYYY переходит к активным действиям с большой жестокостью. Наблюдаются случаи нанесения физического вреда жертвам (ссадины, ушибы, переломы).',
      'Стадия 3 - "Забиратель душ" (1-3 часа): SCP-YYYY внезапно приближается к своим жертвам и каким-то образом лишает их жизненной энергии. Процесс может происходить как одновременно со всеми выбранными жертвами, так и последовательно. Наблюдаются случаи летального исхода.',
      'Ритуал защиты (эффективность ~30%): При обнаружении объекта необходимо громко произнести "Прости" 5 раз, затем разместить шоколадную плитку или 2 пачки жевательной резинки на любом высоком предмете. Эффективность данного ритуала значительно снизилась после закрытия магазина.'
    ],
    incidents: [
      {
        title: 'Захват объекта',
        date: '10.10.2025',
        description: 'SCP-YYYY был захвачен Фондом 10 октября 2025 года после серии инцидентов в городе Энгельс. Операция проводилась специальной мобильной оперативной группой с использованием химических седативов и электромагнитных сдерживающих устройств. Объект в настоящее время содержится в специализированной камере содержания.'
      },
      {
        title: '"Тихие крики"',
        date: 'Множественные наблюдения',
        description: 'Несколько свидетелей утверждают, что во время Стадии 3 слышали тихие, еле различимые крики, похожие на предсмертные стоны, а также приглушенный собачий лай. Анализ аудиозаписей подтвердил наличие звуковых аномалий в диапазоне 50-200 Гц.'
      },
      {
        title: 'Перехваченный телефонный разговор',
        date: 'Дата ЗАСЕКРЕЧЕНА',
        description: '«...Да, я слышал про него. Говорят, это бывший продавец из "Фасоли". Он теперь мстит всем, кто плохо говорит про магазин… Лучше молчать, а то придет...» Все участники разговора были допрошены и амнезированы.'
      }
    ],
    notes: 'SCP-YYYY является братом SCP-XXXX "Карточник". Связь между двумя объектами представляет повышенную угрозу для безопасности Фонда. Продолжается поиск информации о деятельности организации [ЗАСЕКРЕЧЕНО] и ее возможной связи с созданием SCP-YYYY. Вся информация об SCP-YYYY должна быть доступна только сотрудникам с уровнем допуска 4 или выше. Обсуждение SCP-YYYY вне защищенных каналов связи Фонда строго запрещено и будет караться дисциплинарными взысканиями.',
    classified: [
      {
        title: 'ПРИЛОЖЕНИЕ YYYY-1: СОВЕРШЕННО СЕКРЕТНО',
        content: 'Жертвы SCP-YYYY: Объект проявляет интерес к детям (от 2-х до 6-ти человек одновременно), участвовавшим в актах вандализма по отношению к магазину "Фасоль" до его закрытия, или просто находящимся вблизи него. Также он выслеживает всех людей, распространяющих информацию о нем.\n\nСВЯЗЬ С SCP-XXXX: Захват "Черного Волка" спровоцировал побег SCP-XXXX "Карточник" 28.09.2025. Оба объекта связаны семейными узами. Необходимо избегать одновременного содержания обоих объектов в одной зоне.'
      }
    ]
  },
  {
    id: 'XXXX',
    name: 'Карточник',
    class: 'Euclid',
    description: 'SCP-XXXX, далее именуемый "Карточник", выглядит как мальчик европеоидной внешности, приблизительно 12 лет, рост 150 см, вес 40 кг. Отличительной чертой Карточника является его маниакальная страсть к рисованию на картоне и использование игральных карт.',
    containment: 'SCP-XXXX должен содержаться в усиленной камере содержания для гуманоидов, адаптированной для несовершеннолетних, в Зоне-██. Камера должна быть звукоизолирована и оборудована системой подавления психического воздействия. Камера должна быть оборудована датчиками движения и давления, а также системой автоматического блокирования в случае попытки побега. В камере необходимо поддерживать температуру 20°C и уровень влажности 60%. Персонал, взаимодействующий с SCP-XXXX, должен проходить еженедельные психологические обследования и избегать прямой зрительный контакт.',
    anomalousProperties: [
      'Рисунки: Любой человек, посмотревший на изображение, созданное Карточником, испытывает сильное желание обладать им. Степень этого желания варьируется в зависимости от психологического состояния субъекта и может привести к агрессии в попытках заполучить изображение. Рисунки также могут содержать предсказания.',
      'Вселение: Карточник способен вселяться в других людей, начиная с возраста 12 лет. Он может контролировать сознание и действия своей жертвы. Объектом вселения всегда является самый взрослый ребенок в группе.',
      'Трансформация: Карточник может превращаться в неодушевленные предметы небольшого размера.'
    ],
    incidents: [
      {
        title: 'Инцидент побега 28.09.2025',
        date: '28.09.2025',
        description: '28.09.2025 в период между 18:00 и 19:00 Карточнику удалось сбежать из Зоны-██ во время плановой передислокации объектов. Используя свои способности к трансформации и вселению, он смог обойти системы безопасности и скрыться до прибытия службы безопасности. Карточник покинул Зону-██ приблизительно в 19:50.'
      },
      {
        title: 'Поведение после побега',
        date: '28.09.2025 - настоящее время',
        description: 'После побега Карточник был замечен в окрестностях Зоны-██. Очевидцы сообщают, что он бегает по улицам и полям, раскидывая игральные карты. Люди, которые его видят, подвергаются нападению со стороны Карточника. Природа нападений заключается в нанесении порезов картами на лицах. Раскиданные карты, по всей видимости, имеют символическое значение: карты ниже дамы обозначают злость к людям. Также Карточник оставляет надписи мелками на стенах и тротуарах.'
      }
    ],
    notes: 'Считается, что мотивом для побега является месть за захват "Черного Волка", который произошел 10 октября 2025 года. Карточник представляет серьезную угрозу для безопасности Фонда и гражданского населения. Его способности к вселению и трансформации делают его чрезвычайно трудным для поимки. Следует использовать все доступные ресурсы для его повторного захвата.',
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
  const [activeTab, setActiveTab] = useState<'database' | 'personnel'>('database');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSCPDatabase = scpDatabase.filter((scp) => {
    const query = searchQuery.toLowerCase();
    return (
      scp.id.toLowerCase().includes(query) ||
      scp.name.toLowerCase().includes(query) ||
      scp.class.toLowerCase().includes(query) ||
      scp.description.toLowerCase().includes(query)
    );
  });

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

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('database')}
            className={`px-6 py-3 border-2 font-bold text-sm transition-all ${
              activeTab === 'database'
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-border hover:border-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="Database" size={18} />
              БАЗА ДАННЫХ
            </div>
          </button>
          <button
            onClick={() => setActiveTab('personnel')}
            className={`px-6 py-3 border-2 font-bold text-sm transition-all ${
              activeTab === 'personnel'
                ? 'border-destructive bg-destructive/10 text-destructive'
                : 'border-border hover:border-destructive'
            }`}
          >
            <div className="flex items-center gap-2">
              <Icon name="UserCheck" size={18} />
              ТОЛЬКО ДЛЯ ПЕРСОНАЛА
            </div>
          </button>
        </div>

        {activeTab === 'database' && (
        <>
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
              <div className="text-3xl font-bold text-destructive">2</div>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-destructive transition-colors cursor-pointer animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icon name="Shield" className="text-muted-foreground" size={20} />
                <h3 className="font-bold text-sm">ОБЪЕКТОВ В СОДЕРЖАНИИ</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
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
                <div className="mb-4">
                  <div className="relative">
                    <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Поиск по ID, названию, классу..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-background border-2 border-border text-sm focus:border-destructive focus:outline-none transition-colors"
                    />
                  </div>
                  {searchQuery && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Найдено: {filteredSCPDatabase.length} из {scpDatabase.length}
                    </div>
                  )}
                </div>
                {filteredSCPDatabase.length === 0 ? (
                  <div className="text-center py-8 text-sm text-muted-foreground">
                    <Icon name="SearchX" size={32} className="mx-auto mb-2 opacity-50" />
                    Объекты не найдены
                  </div>
                ) : (
                  filteredSCPDatabase.map((scp) => (
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
                )))}
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
        </>
        )}

        {activeTab === 'personnel' && (
          <Card className="border-2 border-destructive animate-fade-in">
            <CardHeader className="border-b-2 border-destructive bg-destructive/10">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2 text-destructive">
                  ⚠ ТОЛЬКО ДЛЯ ПЕРСОНАЛА ⚠
                </div>
                <div className="text-xs">УРОВЕНЬ ДОПУСКА 3 И ВЫШЕ</div>
              </div>
            </CardHeader>
            
            <CardContent className="mt-6 space-y-8">
              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b-2 border-destructive pb-2">
                  <Icon name="MessageSquare" size={18} />
                  I. Стандартные фразы при взаимодействии с SCP-объектами
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Особенно класса Евклид/Кетер</p>
                <ul className="space-y-2 text-sm">
                  <li className="pl-4 border-l-2 border-muted">"Пожалуйста, не двигайтесь. Мы здесь, чтобы обеспечить вашу безопасность."</li>
                  <li className="pl-4 border-l-2 border-muted">"Сопротивление бессмысленно. Смиритесь и сотрудничайте, это в ваших же интересах."</li>
                  <li className="pl-4 border-l-2 border-muted">"Мы соблюдаем все протоколы. Вам не будет причинен вред, если вы будете следовать нашим инструкциям."</li>
                  <li className="pl-4 border-l-2 border-muted">"Ответьте на вопросы. Ваша информация поможет нам понять вашу природу."</li>
                  <li className="pl-4 border-l-2 border-muted">"Обратите внимание: любые враждебные действия приведут к применению ответных мер."</li>
                  <li className="pl-4 border-l-2 border-destructive">(При необходимости): "Мы действуем в соответствии с Директивой [УКАЗАТЬ НОМЕР ДИРЕКТИВЫ]".</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b-2 border-destructive pb-2">
                  <Icon name="Shield" size={18} />
                  II. Фразы для сотрудников службы безопасности
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="pl-4 border-l-2 border-muted">"Сохраняйте периметр. Никому не позволено приближаться."</li>
                  <li className="pl-4 border-l-2 border-muted">"Код [УКАЗАТЬ КОД]. Повторяю, код [УКАЗАТЬ КОД]. Всем постам усилить бдительность."</li>
                  <li className="pl-4 border-l-2 border-muted">"Доложите о любой подозрительной активности."</li>
                  <li className="pl-4 border-l-2 border-muted">"Применить нелетальные средства. Не допускать кровопролития, если это возможно."</li>
                  <li className="pl-4 border-l-2 border-muted">"Вывести гражданских из зоны поражения."</li>
                  <li className="pl-4 border-l-2 border-destructive">"Нарушение условий содержания! Всем сотрудникам занять боевые позиции!"</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b-2 border-destructive pb-2">
                  <Icon name="FlaskConical" size={18} />
                  III. Фразы для научных сотрудников
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="pl-4 border-l-2 border-muted">"Запишите все наблюдения. Даже незначительные детали могут быть важны."</li>
                  <li className="pl-4 border-l-2 border-muted">"Проанализируйте данные и предоставьте отчет в кратчайшие сроки."</li>
                  <li className="pl-4 border-l-2 border-muted">"Соблюдайте осторожность. Это не обычное явление - любая ошибка может быть фатальной."</li>
                  <li className="pl-4 border-l-2 border-muted">"Не вступайте в прямой контакт с объектом без разрешения."</li>
                  <li className="pl-4 border-l-2 border-muted">"Отошлите результаты исследования на рассмотрение, уровень допуска [УКАЗАТЬ УРОВЕНЬ]."</li>
                  <li className="pl-4 border-l-2 border-muted">"Предложите альтернативные методы содержания, если существующие неэффективны."</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b-2 border-destructive pb-2">
                  <Icon name="Users" size={18} />
                  IV. Фразы для персонала класса D
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="pl-4 border-l-2 border-muted">"Вы должны следовать инструкциям. От этого зависит продолжительность вашей жизни."</li>
                  <li className="pl-4 border-l-2 border-muted">"Сообщите о любых изменениях в своем состоянии."</li>
                  <li className="pl-4 border-l-2 border-muted">"Вопросы будут заданы позже. Сейчас ваша задача - выполнять указания."</li>
                  <li className="pl-4 border-l-2 border-destructive">(Чаще всего сказано без особой вежливости): "Шевелись!"</li>
                  <li className="pl-4 border-l-2 border-destructive">(Перед выполнением опасного задания): "Помните, что ваша жизнь не имеет значения. Вы здесь только для того, чтобы помочь нам получить информацию."</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b-2 border-destructive pb-2">
                  <Icon name="FileWarning" size={18} />
                  V. Общие фразы, используемые в Фонде
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="pl-4 border-l-2 border-muted">"Уровень допуска недостаточен для просмотра данной информации."</li>
                  <li className="pl-4 border-l-2 border-muted">"Информация засекречена в целях безопасности."</li>
                  <li className="pl-4 border-l-2 border-muted">"Это необходимо для всеобщего блага."</li>
                  <li className="pl-4 border-l-2 border-muted">"Мы действуем из тени, чтобы вы могли жить в свете."</li>
                  <li className="pl-4 border-l-2 border-muted">"Оставайтесь на связи. Докладывайте о любых изменениях обстановки"</li>
                  <li className="pl-4 border-l-2 border-muted">"Протокол [УКАЗАТЬ НОМЕР ПРОТОКОЛА] в действии!"</li>
                  <li className="pl-4 border-l-2 border-destructive">"Помните: Фонд - это все, вы - ничто."</li>
                </ul>
              </section>

              <section className="border-2 border-destructive bg-destructive/5 p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={18} className="text-destructive" />
                  Дополнительные рекомендации
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong className="text-destructive">Стиль:</strong> Речь должна быть профессиональной, сдержанной и лишенной излишней эмоциональности.
                  </div>
                  <div>
                    <strong className="text-destructive">Четкость:</strong> Инструкции должны быть ясными и не допускать двоякого толкования.
                  </div>
                  <div>
                    <strong className="text-destructive">Краткость:</strong> Нет времени на лишние слова, особенно в критических ситуациях.
                  </div>
                  <div>
                    <strong className="text-destructive">Использование кодовых слов:</strong> Используете кодовые слова которые понятны лишь определенным сотрудникам.
                  </div>
                  <div>
                    <strong className="text-destructive">Стандартизация:</strong> Соблюдение стандартизированных фраз и протоколов повышает эффективность работы и снижает вероятность ошибок.
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        )}

        <footer className="mt-8 text-center text-xs text-muted-foreground border-t-2 border-border pt-4">
          <p>SCP FOUNDATION © 2025 | ДАННЫЙ ДОКУМЕНТ ЯВЛЯЕТСЯ СОБСТВЕННОСТЬЮ ФОНДА SCP</p>
          <p className="mt-1">НЕСАНКЦИОНИРОВАННОЕ РАСПРОСТРАНЕНИЕ КАРАЕТСЯ СОГЛАСНО ПРОТОКОЛУ 138</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
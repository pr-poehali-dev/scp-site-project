import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export interface SCPObject {
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

interface SCPGridProps {
  scpObjects: SCPObject[];
  isPersonnelAuthorized: boolean;
}

export const SCPGrid = ({ scpObjects, isPersonnelAuthorized }: SCPGridProps) => {
  const getClassColor = (scpClass: string) => {
    switch (scpClass) {
      case 'Safe':
        return 'text-blue-500 border-blue-500';
      case 'Euclid':
        return 'text-yellow-500 border-yellow-500';
      case 'Keter':
        return 'text-destructive border-destructive';
      default:
        return 'text-muted-foreground border-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scpObjects.map((scp) => (
        <Card
          key={scp.id}
          className={`border-2 hover:shadow-lg transition-shadow cursor-pointer ${getClassColor(scp.class)}`}
        >
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl font-bold">SCP-{scp.id}</h3>
                <p className="text-sm text-muted-foreground">{scp.name}</p>
              </div>
              <Badge variant="outline" className={getClassColor(scp.class)}>
                {scp.class}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="description">
                <AccordionTrigger className="text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={16} />
                    ОПИСАНИЕ
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{scp.description}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="containment">
                <AccordionTrigger className="text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Icon name="Lock" size={16} />
                    ПРОЦЕДУРЫ СОДЕРЖАНИЯ
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-muted-foreground">{scp.containment}</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="properties">
                <AccordionTrigger className="text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Icon name="AlertTriangle" size={16} />
                    АНОМАЛЬНЫЕ СВОЙСТВА
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {scp.anomalousProperties.map((prop, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-destructive">•</span>
                        <span>{prop}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="incidents">
                <AccordionTrigger className="text-sm font-bold">
                  <div className="flex items-center gap-2">
                    <Icon name="Activity" size={16} />
                    ИНЦИДЕНТЫ
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {scp.incidents.map((incident, idx) => (
                      <div key={idx} className="border-l-2 border-destructive pl-3">
                        <p className="text-sm font-bold">{incident.title}</p>
                        <p className="text-xs text-muted-foreground mb-1">{incident.date}</p>
                        <p className="text-sm text-muted-foreground">{incident.description}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {scp.notes && (
                <AccordionItem value="notes">
                  <AccordionTrigger className="text-sm font-bold">
                    <div className="flex items-center gap-2">
                      <Icon name="BookOpen" size={16} />
                      ПРИМЕЧАНИЯ
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{scp.notes}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {scp.classified && isPersonnelAuthorized && (
                <AccordionItem value="classified">
                  <AccordionTrigger className="text-sm font-bold text-destructive">
                    <div className="flex items-center gap-2">
                      <Icon name="ShieldAlert" size={16} />
                      ЗАСЕКРЕЧЕННАЯ ИНФОРМАЦИЯ
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {scp.classified.map((item, idx) => (
                        <div key={idx} className="bg-destructive/10 p-3 rounded border border-destructive/30">
                          <p className="text-sm font-bold text-destructive mb-2">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

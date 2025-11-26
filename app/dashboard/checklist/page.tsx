'use client';

import { useState } from 'react';
import {
  FileText,
  CheckSquare,
  Square,
  Download,
  Printer,
  Car,
  Eye,
  Wrench,
  Volume2,
  FileSearch,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChecklistItem {
  id: string;
  text: string;
  tip?: string;
  checked: boolean;
}

interface ChecklistSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: ChecklistItem[];
  expanded: boolean;
}

const initialChecklist: ChecklistSection[] = [
  {
    id: 'exterior',
    title: 'Exterior Inspection',
    icon: Eye,
    color: 'text-brand-500',
    expanded: true,
    items: [
      { id: 'ext1', text: 'Walk around and check for dents, scratches, or rust', tip: 'Look closely at wheel wells, door edges, and rocker panels', checked: false },
      { id: 'ext2', text: 'Check all body panels for color match and alignment', tip: 'Mismatched colors may indicate accident repair', checked: false },
      { id: 'ext3', text: 'Inspect windshield for chips or cracks', checked: false },
      { id: 'ext4', text: 'Check all lights (headlights, taillights, turn signals, brake lights)', checked: false },
      { id: 'ext5', text: 'Examine tires for even wear and tread depth', tip: 'Uneven wear can indicate alignment or suspension issues', checked: false },
      { id: 'ext6', text: 'Check for signs of flood damage (water lines, mud, musty smell)', checked: false },
      { id: 'ext7', text: 'Look under the car for leaks or rust on the frame', checked: false },
      { id: 'ext8', text: 'Test all door handles and locks', checked: false },
      { id: 'ext9', text: 'Inspect mirrors for cracks or damage', checked: false },
      { id: 'ext10', text: 'Check the trunk/cargo area for signs of water damage', checked: false },
    ],
  },
  {
    id: 'interior',
    title: 'Interior Inspection',
    icon: Car,
    color: 'text-success',
    expanded: false,
    items: [
      { id: 'int1', text: 'Check all seats for tears, stains, or excessive wear', checked: false },
      { id: 'int2', text: 'Test all power seats, mirrors, and windows', checked: false },
      { id: 'int3', text: 'Verify odometer reading matches what was advertised', checked: false },
      { id: 'int4', text: 'Check dashboard for warning lights with engine off (all should light up)', checked: false },
      { id: 'int5', text: 'Test AC and heater at all settings', checked: false },
      { id: 'int6', text: 'Test all audio/infotainment features', checked: false },
      { id: 'int7', text: 'Check headliner for sagging or stains', checked: false },
      { id: 'int8', text: 'Inspect carpets for dampness or mold (flood indicator)', checked: false },
      { id: 'int9', text: 'Test sunroof/moonroof operation if equipped', checked: false },
      { id: 'int10', text: 'Check seat belts for fraying or damage', checked: false },
    ],
  },
  {
    id: 'engine',
    title: 'Engine & Mechanical',
    icon: Wrench,
    color: 'text-warning',
    expanded: false,
    items: [
      { id: 'eng1', text: 'Check oil level and condition (should be golden/amber, not black)', checked: false },
      { id: 'eng2', text: 'Check coolant level and look for oil contamination', tip: 'Milky coolant may indicate head gasket issues', checked: false },
      { id: 'eng3', text: 'Inspect belts and hoses for cracks or wear', checked: false },
      { id: 'eng4', text: 'Look for oil leaks around gaskets and seals', checked: false },
      { id: 'eng5', text: 'Check battery terminals for corrosion', checked: false },
      { id: 'eng6', text: 'Inspect brake fluid level', checked: false },
      { id: 'eng7', text: 'Check transmission fluid (if accessible)', tip: 'Should be red/pink, burnt smell indicates problems', checked: false },
      { id: 'eng8', text: 'Look for aftermarket modifications', checked: false },
      { id: 'eng9', text: 'Check for signs of engine work or recent repairs', checked: false },
      { id: 'eng10', text: 'Verify VIN matches on door, dashboard, and engine', checked: false },
    ],
  },
  {
    id: 'drive',
    title: 'Test Drive Checklist',
    icon: Volume2,
    color: 'text-info',
    expanded: false,
    items: [
      { id: 'drv1', text: 'Start the car from cold - note any unusual startup sounds', checked: false },
      { id: 'drv2', text: 'Check for any dashboard warning lights after startup', checked: false },
      { id: 'drv3', text: 'Test steering for play or vibration at various speeds', checked: false },
      { id: 'drv4', text: 'Brake at various speeds - check for pulling or vibration', checked: false },
      { id: 'drv5', text: 'Test acceleration - note any hesitation or unusual sounds', checked: false },
      { id: 'drv6', text: 'Listen for transmission shifting (should be smooth)', checked: false },
      { id: 'drv7', text: 'Drive over bumps - check suspension noises', checked: false },
      { id: 'drv8', text: 'Test at highway speed - check for vibrations', checked: false },
      { id: 'drv9', text: 'Turn off radio and listen for unusual engine or exhaust sounds', checked: false },
      { id: 'drv10', text: 'Check that the car tracks straight when hands are briefly released', checked: false },
      { id: 'drv11', text: 'Test parking brake on an incline', checked: false },
      { id: 'drv12', text: 'After driving, pop the hood and look for new leaks or smoke', checked: false },
    ],
  },
  {
    id: 'documents',
    title: 'Documentation',
    icon: FileSearch,
    color: 'text-error',
    expanded: false,
    items: [
      { id: 'doc1', text: 'Verify title is in seller\'s name (not a curbstoner)', checked: false },
      { id: 'doc2', text: 'Check for liens on the title', checked: false },
      { id: 'doc3', text: 'Request service records', checked: false },
      { id: 'doc4', text: 'Get a vehicle history report (Carfax/AutoCheck)', checked: false },
      { id: 'doc5', text: 'Verify VIN on documents matches the vehicle', checked: false },
      { id: 'doc6', text: 'Check for open recalls (use NHTSA website)', checked: false },
      { id: 'doc7', text: 'Ask about remaining warranty coverage', checked: false },
      { id: 'doc8', text: 'Request copies of any repair invoices', checked: false },
    ],
  },
  {
    id: 'redflags',
    title: 'Red Flags to Watch For',
    icon: AlertTriangle,
    color: 'text-error',
    expanded: false,
    items: [
      { id: 'red1', text: 'Seller seems rushed or pressuring you', checked: false },
      { id: 'red2', text: 'Price is significantly below market value', checked: false },
      { id: 'red3', text: 'Seller won\'t allow independent inspection', checked: false },
      { id: 'red4', text: 'Multiple keys missing', checked: false },
      { id: 'red5', text: 'Fresh undercoating that might hide rust', checked: false },
      { id: 'red6', text: 'Inconsistent stories about vehicle history', checked: false },
      { id: 'red7', text: 'Title issues or out-of-state registration', checked: false },
      { id: 'red8', text: 'Service records don\'t match mileage', checked: false },
    ],
  },
];

export default function InspectionChecklistPage() {
  const [checklist, setChecklist] = useState<ChecklistSection[]>(initialChecklist);

  const toggleItem = (sectionId: string, itemId: string) => {
    setChecklist((prev) =>
      prev.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.map((item) =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ),
          };
        }
        return section;
      })
    );
  };

  const toggleSection = (sectionId: string) => {
    setChecklist((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  const resetChecklist = () => {
    setChecklist(
      initialChecklist.map((section) => ({
        ...section,
        items: section.items.map((item) => ({ ...item, checked: false })),
      }))
    );
  };

  const totalItems = checklist.reduce((sum, section) => sum + section.items.length, 0);
  const checkedItems = checklist.reduce(
    (sum, section) => sum + section.items.filter((item) => item.checked).length,
    0
  );
  const progressPercent = Math.round((checkedItems / totalItems) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <FileText className="w-8 h-8 text-brand-500" />
            In-Person Inspection Checklist
          </h1>
          <p className="text-muted-foreground mt-2">
            Use this checklist when viewing a vehicle in person
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetChecklist}>
            Reset
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      {/* Print header */}
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-2xl font-bold">MyAutoWhiz - Vehicle Inspection Checklist</h1>
        <p className="text-gray-600">Use this checklist when inspecting a used vehicle</p>
      </div>

      {/* Progress */}
      <Card className="print:hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              {checkedItems} of {totalItems} items checked
            </span>
          </div>
          <div className="h-3 bg-surface-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Checklist sections */}
      <div className="space-y-4">
        {checklist.map((section) => {
          const sectionChecked = section.items.filter((item) => item.checked).length;
          const Icon = section.icon;
          
          return (
            <Card key={section.id} className="print:break-inside-avoid">
              <CardHeader
                className="cursor-pointer print:cursor-default"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-5 h-5', section.color)} />
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <span className="text-sm text-muted-foreground">
                      ({sectionChecked}/{section.items.length})
                    </span>
                  </div>
                  <div className="print:hidden">
                    {section.expanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>
              {(section.expanded || true) && ( // Always show in print
                <CardContent className={cn(!section.expanded && 'hidden print:block')}>
                  <div className="space-y-3">
                    {section.items.map((item) => (
                      <div
                        key={item.id}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer print:cursor-default',
                          item.checked ? 'bg-success/10' : 'bg-surface-tertiary/50 hover:bg-surface-tertiary'
                        )}
                        onClick={() => toggleItem(section.id, item.id)}
                      >
                        {item.checked ? (
                          <CheckSquare className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                        ) : (
                          <Square className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className={cn(item.checked && 'line-through text-muted-foreground')}>
                            {item.text}
                          </p>
                          {item.tip && (
                            <p className="text-sm text-muted-foreground mt-1 italic">
                              💡 {item.tip}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Notes section */}
      <Card className="print:break-inside-avoid">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Write down any observations or concerns</CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full h-32 bg-surface-tertiary rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 print:border print:border-gray-300 print:h-48"
            placeholder="Add your notes here..."
          />
        </CardContent>
      </Card>

      {/* Print footer */}
      <div className="hidden print:block text-center text-sm text-gray-500 mt-8 pt-4 border-t">
        <p>Generated by MyAutoWhiz.com - Your AI-Powered Vehicle Analysis Platform</p>
        <p>Always get a professional inspection before purchasing a used vehicle.</p>
      </div>
    </div>
  );
}

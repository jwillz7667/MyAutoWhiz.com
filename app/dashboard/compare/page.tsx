'use client';

import { useState } from 'react';
import {
  Scale,
  Plus,
  X,
  Car,
  Search,
  CheckCircle2,
  XCircle,
  Minus,
  TrendingUp,
  Fuel,
  Shield,
  Calendar,
  Gauge,
  DollarSign,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';

interface Vehicle {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  price: number;
  mileage: number;
  mpgCity?: number;
  mpgHighway?: number;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  horsepower?: number;
  safetyRating?: number;
  reliabilityScore?: number;
  analysisScore?: number;
  pros?: string[];
  cons?: string[];
}

// Demo vehicles for comparison
const demoVehicles: Vehicle[] = [
  {
    id: '1',
    year: 2021,
    make: 'Honda',
    model: 'Accord',
    trim: 'EX-L',
    price: 26500,
    mileage: 35000,
    mpgCity: 30,
    mpgHighway: 38,
    engine: '1.5L Turbo I4',
    transmission: 'CVT',
    drivetrain: 'FWD',
    horsepower: 192,
    safetyRating: 5,
    reliabilityScore: 88,
    analysisScore: 87,
    pros: ['Excellent fuel economy', 'Spacious interior', 'Strong resale value'],
    cons: ['Road noise at highway speeds', 'CVT may not suit everyone'],
  },
  {
    id: '2',
    year: 2021,
    make: 'Toyota',
    model: 'Camry',
    trim: 'SE',
    price: 25800,
    mileage: 42000,
    mpgCity: 28,
    mpgHighway: 39,
    engine: '2.5L I4',
    transmission: '8-Speed Auto',
    drivetrain: 'FWD',
    horsepower: 203,
    safetyRating: 5,
    reliabilityScore: 91,
    analysisScore: 85,
    pros: ['Legendary reliability', 'Smooth ride', 'Good warranty'],
    cons: ['Slightly dated infotainment', 'Higher mileage'],
  },
  {
    id: '3',
    year: 2022,
    make: 'Mazda',
    model: 'Mazda6',
    trim: 'Grand Touring',
    price: 28500,
    mileage: 28000,
    mpgCity: 26,
    mpgHighway: 35,
    engine: '2.5L Turbo I4',
    transmission: '6-Speed Auto',
    drivetrain: 'FWD',
    horsepower: 250,
    safetyRating: 5,
    reliabilityScore: 85,
    analysisScore: 89,
    pros: ['Premium interior', 'Engaging to drive', 'Turbo power'],
    cons: ['Discontinued model', 'Less rear legroom'],
  },
];

export default function CompareVehiclesPage() {
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const addVehicle = (vehicle: Vehicle) => {
    if (selectedVehicles.length < 3 && !selectedVehicles.find((v) => v.id === vehicle.id)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
    }
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeVehicle = (id: string) => {
    setSelectedVehicles(selectedVehicles.filter((v) => v.id !== id));
  };

  const filteredVehicles = demoVehicles.filter(
    (v) =>
      !selectedVehicles.find((sv) => sv.id === v.id) &&
      (searchQuery === '' ||
        `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getComparisonIndicator = (values: (number | undefined)[], index: number, higherIsBetter: boolean) => {
    const validValues = values.filter((v): v is number => v !== undefined);
    if (validValues.length < 2) return null;
    
    const value = values[index];
    if (value === undefined) return null;
    
    const best = higherIsBetter ? Math.max(...validValues) : Math.min(...validValues);
    const worst = higherIsBetter ? Math.min(...validValues) : Math.max(...validValues);
    
    if (value === best) return <CheckCircle2 className="w-4 h-4 text-success" />;
    if (value === worst) return <XCircle className="w-4 h-4 text-error" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <Scale className="w-8 h-8 text-brand-500" />
            Compare Vehicles
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare up to 3 vehicles side by side
          </p>
        </div>
      </div>

      {/* Vehicle selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {[0, 1, 2].map((index) => {
          const vehicle = selectedVehicles[index];
          
          return (
            <Card key={index} className={cn(!vehicle && 'border-dashed')}>
              {vehicle ? (
                <>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </CardTitle>
                        <CardDescription>{vehicle.trim}</CardDescription>
                      </div>
                      <button
                        onClick={() => removeVehicle(vehicle.id)}
                        className="text-muted-foreground hover:text-error transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-surface-tertiary rounded-lg flex items-center justify-center mb-4">
                      <Car className="w-16 h-16 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">{formatCurrency(vehicle.price)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mileage</span>
                        <span className="font-medium">{formatNumber(vehicle.mileage)} mi</span>
                      </div>
                      {vehicle.analysisScore && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Analysis Score</span>
                          <span className={cn(
                            'font-medium',
                            vehicle.analysisScore >= 80 ? 'text-success' :
                            vehicle.analysisScore >= 60 ? 'text-warning' : 'text-error'
                          )}>
                            {vehicle.analysisScore}/100
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 rounded-full bg-surface-tertiary flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-4">Add Vehicle {index + 1}</p>
                  <Button
                    variant="outline"
                    onClick={() => setShowSearch(true)}
                    disabled={selectedVehicles.length >= 3}
                  >
                    Select Vehicle
                  </Button>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Search modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Select a Vehicle</CardTitle>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Search by make, model, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredVehicles.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => addVehicle(vehicle)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface-tertiary/50 hover:bg-surface-tertiary transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
                      <Car className="w-5 h-5 text-brand-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(vehicle.price)} • {formatNumber(vehicle.mileage)} mi
                      </p>
                    </div>
                  </button>
                ))}
                {filteredVehicles.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No vehicles found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comparison table */}
      {selectedVehicles.length >= 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Specification</th>
                    {selectedVehicles.map((v) => (
                      <th key={v.id} className="text-center py-3 px-4 font-medium">
                        {v.make} {v.model}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {/* Price */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-success" />
                      Price
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {formatCurrency(v.price)}
                          {getComparisonIndicator(selectedVehicles.map((sv) => sv.price), i, false)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Mileage */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-warning" />
                      Mileage
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {formatNumber(v.mileage)} mi
                          {getComparisonIndicator(selectedVehicles.map((sv) => sv.mileage), i, false)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* MPG */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Fuel className="w-4 h-4 text-info" />
                      Fuel Economy (City/Hwy)
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {v.mpgCity}/{v.mpgHighway} MPG
                          {getComparisonIndicator(selectedVehicles.map((sv) => sv.mpgHighway), i, true)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Horsepower */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-error" />
                      Horsepower
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {v.horsepower} HP
                          {getComparisonIndicator(selectedVehicles.map((sv) => sv.horsepower), i, true)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Safety Rating */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-brand-500" />
                      Safety Rating
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {'★'.repeat(v.safetyRating || 0)}{'☆'.repeat(5 - (v.safetyRating || 0))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Reliability */}
                  <tr>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-success" />
                      Reliability Score
                    </td>
                    {selectedVehicles.map((v, i) => (
                      <td key={v.id} className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          {v.reliabilityScore}/100
                          {getComparisonIndicator(selectedVehicles.map((sv) => sv.reliabilityScore), i, true)}
                        </div>
                      </td>
                    ))}
                  </tr>
                  
                  {/* Engine */}
                  <tr>
                    <td className="py-3 px-4">Engine</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.id} className="text-center py-3 px-4">{v.engine}</td>
                    ))}
                  </tr>
                  
                  {/* Transmission */}
                  <tr>
                    <td className="py-3 px-4">Transmission</td>
                    {selectedVehicles.map((v) => (
                      <td key={v.id} className="text-center py-3 px-4">{v.transmission}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pros and Cons */}
      {selectedVehicles.length >= 2 && (
        <div className="grid md:grid-cols-3 gap-4">
          {selectedVehicles.map((vehicle) => (
            <Card key={vehicle.id}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {vehicle.make} {vehicle.model}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {vehicle.pros && vehicle.pros.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-success mb-2">Pros</p>
                    <ul className="space-y-1">
                      {vehicle.pros.map((pro, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {vehicle.cons && vehicle.cons.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-error mb-2">Cons</p>
                    <ul className="space-y-1">
                      {vehicle.cons.map((con, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {selectedVehicles.length < 2 && (
        <Card className="bg-surface-tertiary/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Scale className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Select Vehicles to Compare</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Add at least 2 vehicles to see a detailed side-by-side comparison of specifications, 
              features, and our analysis scores.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

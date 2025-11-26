'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Heart,
  Car,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Edit2,
  MoreVertical,
  MapPin,
  Clock,
  DollarSign,
  X,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatNumber, formatRelativeTime } from '@/lib/utils';

interface SavedVehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  nickname?: string;
  notes?: string;
  listingUrl?: string;
  listingPrice?: number;
  listingSource?: string;
  analysisScore?: number;
  savedAt: string;
}

// Demo data
const demoVehicles: SavedVehicle[] = [
  {
    id: '1',
    vin: '1HGBH41JXMN109186',
    year: 2021,
    make: 'Honda',
    model: 'Accord',
    trim: 'EX-L',
    nickname: 'Silver Accord',
    notes: 'Test drove, liked the ride. Seller seems motivated.',
    listingUrl: 'https://example.com/listing/123',
    listingPrice: 27000,
    listingSource: 'AutoTrader',
    analysisScore: 87,
    savedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    vin: '5YJSA1E26MF123456',
    year: 2022,
    make: 'Tesla',
    model: 'Model S',
    trim: 'Long Range',
    listingPrice: 78000,
    listingSource: 'Tesla.com',
    analysisScore: 92,
    savedAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '3',
    vin: '2T1BURHE5JC123456',
    year: 2020,
    make: 'Toyota',
    model: 'Corolla',
    trim: 'SE',
    nickname: 'Budget Option',
    notes: 'Good value, high mileage but clean history',
    listingPrice: 18500,
    listingSource: 'Craigslist',
    savedAt: new Date(Date.now() - 604800000).toISOString(),
  },
];

export default function SavedVehiclesPage() {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<SavedVehicle | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setVehicles(demoVehicles);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (searchQuery === '') return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchLower) ||
      vehicle.nickname?.toLowerCase().includes(searchLower) ||
      vehicle.vin.toLowerCase().includes(searchLower)
    );
  });

  const handleDelete = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    setActiveMenu(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
            <Heart className="w-8 h-8 text-error" />
            Saved Vehicles
          </h1>
          <p className="text-muted-foreground mt-1">
            Keep track of vehicles you&apos;re interested in
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Add</span> Vehicle
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name, make, model, or VIN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Vehicles grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : filteredVehicles.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Image placeholder */}
                <div className="aspect-video bg-surface-tertiary flex items-center justify-center relative">
                  <Car className="w-16 h-16 text-muted-foreground" />
                  
                  {/* Score badge */}
                  {vehicle.analysisScore && (
                    <div
                      className={cn(
                        'absolute top-3 right-3 px-2 py-1 rounded-full text-sm font-bold',
                        vehicle.analysisScore >= 80
                          ? 'bg-success/20 text-success'
                          : vehicle.analysisScore >= 60
                          ? 'bg-warning/20 text-warning'
                          : 'bg-error/20 text-error'
                      )}
                    >
                      {vehicle.analysisScore}
                    </div>
                  )}

                  {/* Menu button */}
                  <button
                    onClick={() => setActiveMenu(activeMenu === vehicle.id ? null : vehicle.id)}
                    className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {activeMenu === vehicle.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute top-12 left-3 z-20 w-40 bg-surface-secondary border border-white/10 rounded-lg shadow-xl overflow-hidden">
                        <button
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(vehicle.id)}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {vehicle.nickname && (
                    <p className="text-sm text-brand-500 font-medium mb-1">{vehicle.nickname}</p>
                  )}
                  <h3 className="font-semibold">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  {vehicle.trim && (
                    <p className="text-sm text-muted-foreground">{vehicle.trim}</p>
                  )}

                  {/* Price and source */}
                  <div className="flex items-center justify-between mt-3">
                    {vehicle.listingPrice && (
                      <span className="text-lg font-bold text-success">
                        {formatCurrency(vehicle.listingPrice)}
                      </span>
                    )}
                    {vehicle.listingSource && (
                      <span className="text-xs text-muted-foreground">
                        {vehicle.listingSource}
                      </span>
                    )}
                  </div>

                  {/* Notes preview */}
                  {vehicle.notes && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {vehicle.notes}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(vehicle.savedAt)}
                    </span>
                    <div className="flex gap-2">
                      {vehicle.listingUrl && (
                        <a
                          href={vehicle.listingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-brand-500 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {vehicle.analysisScore ? (
                        <Link
                          href={`/dashboard/reports/${vehicle.id}`}
                          className="text-muted-foreground hover:text-brand-500 transition-colors"
                        >
                          View Report
                        </Link>
                      ) : (
                        <Link
                          href={`/dashboard/analyze?vin=${vehicle.vin}`}
                          className="text-brand-500 hover:text-brand-400 transition-colors text-sm"
                        >
                          Analyze
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-surface-tertiary/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Saved Vehicles</h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {searchQuery
                ? 'No vehicles match your search. Try a different query.'
                : 'Save vehicles you\'re interested in to easily compare them later.'}
            </p>
            {!searchQuery && (
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Edit Vehicle</CardTitle>
                <button
                  onClick={() => setEditingVehicle(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Vehicle</p>
                <p className="font-medium">
                  {editingVehicle.year} {editingVehicle.make} {editingVehicle.model}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nickname</label>
                <Input
                  placeholder="e.g., Dream Car, Budget Option"
                  defaultValue={editingVehicle.nickname}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  className="w-full h-24 bg-surface-tertiary rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="Add any notes about this vehicle..."
                  defaultValue={editingVehicle.notes}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Listing URL</label>
                <Input
                  type="url"
                  placeholder="https://..."
                  defaultValue={editingVehicle.listingUrl}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Listing Price</label>
                  <Input
                    type="number"
                    placeholder="25000"
                    defaultValue={editingVehicle.listingPrice}
                    leftIcon={<span className="text-muted-foreground">$</span>}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Source</label>
                  <Input
                    placeholder="AutoTrader, Carvana, etc."
                    defaultValue={editingVehicle.listingSource}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setEditingVehicle(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={() => setEditingVehicle(null)}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

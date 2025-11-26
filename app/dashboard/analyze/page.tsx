'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import {
  Car,
  Camera,
  Mic,
  FileSearch,
  Upload,
  X,
  Info,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ChevronRight,
  Image as ImageIcon,
  Volume2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatVIN, isValidVIN, formatFileSize } from '@/lib/utils';
import { toast } from '@/components/ui/toaster';

type AnalysisStep = 'vin' | 'options' | 'photos' | 'audio' | 'confirm';

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  type: 'image' | 'audio';
}

interface AnalysisOptions {
  includeHistory: boolean;
  includeVisual: boolean;
  includeAudio: boolean;
  mileage: string;
  askingPrice: string;
}

export default function NewAnalysisPage() {
  const router = useRouter();
  const [step, setStep] = useState<AnalysisStep>('vin');
  const [vin, setVin] = useState('');
  const [vinError, setVinError] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState<{
    year: number;
    make: string;
    model: string;
  } | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [options, setOptions] = useState<AnalysisOptions>({
    includeHistory: true,
    includeVisual: true,
    includeAudio: false,
    mileage: '',
    askingPrice: '',
  });
  const [photos, setPhotos] = useState<UploadedFile[]>([]);
  const [audioFiles, setAudioFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle VIN input
  const handleVinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatVIN(e.target.value);
    setVin(formatted);
    setVinError('');
  };

  // Decode VIN
  const handleDecodeVin = async () => {
    if (!isValidVIN(vin)) {
      setVinError('Please enter a valid 17-character VIN');
      return;
    }

    setIsDecoding(true);
    try {
      // Call NHTSA API directly for demo
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValuesExtended/${vin}?format=json`
      );
      const data = await response.json();
      
      if (data.Results && data.Results[0]) {
        const result = data.Results[0];
        setVehicleInfo({
          year: parseInt(result.ModelYear) || 0,
          make: result.Make || 'Unknown',
          model: result.Model || 'Unknown',
        });
        setStep('options');
      } else {
        setVinError('Could not decode VIN. Please check and try again.');
      }
    } catch (error) {
      setVinError('Error decoding VIN. Please try again.');
    } finally {
      setIsDecoding(false);
    }
  };

  // Photo dropzone
  const onPhotoDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
      type: 'image' as const,
    }));
    setPhotos((prev) => [...prev, ...newPhotos].slice(0, 20));
  }, []);

  const { getRootProps: getPhotoRootProps, getInputProps: getPhotoInputProps, isDragActive: isPhotoDragActive } = useDropzone({
    onDrop: onPhotoDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: 20,
  });

  // Audio dropzone
  const onAudioDrop = useCallback((acceptedFiles: File[]) => {
    const newAudio = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      type: 'audio' as const,
    }));
    setAudioFiles((prev) => [...prev, ...newAudio].slice(0, 5));
  }, []);

  const { getRootProps: getAudioRootProps, getInputProps: getAudioInputProps, isDragActive: isAudioDragActive } = useDropzone({
    onDrop: onAudioDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.m4a', '.aac'] },
    maxSize: 50 * 1024 * 1024, // 50MB
    maxFiles: 5,
  });

  // Remove file
  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === id);
      if (photo?.preview) URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const removeAudio = (id: string) => {
    setAudioFiles((prev) => prev.filter((a) => a.id !== id));
  };

  // Submit analysis
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In production, this would upload files and create the analysis
      // For now, simulate success
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: 'Analysis Started',
        description: 'Your vehicle analysis has been queued. You\'ll be notified when it\'s ready.',
        variant: 'success',
      });
      
      router.push('/dashboard/reports');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start analysis. Please try again.',
        variant: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step navigation
  const steps = [
    { id: 'vin', label: 'Enter VIN' },
    { id: 'options', label: 'Options' },
    { id: 'photos', label: 'Photos' },
    { id: 'audio', label: 'Audio' },
    { id: 'confirm', label: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  index < currentStepIndex
                    ? 'bg-brand-500 text-white'
                    : index === currentStepIndex
                    ? 'bg-brand-500/20 text-brand-500 ring-2 ring-brand-500'
                    : 'bg-surface-tertiary text-muted-foreground'
                )}
              >
                {index < currentStepIndex ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'w-12 md:w-24 h-0.5 mx-2',
                    index < currentStepIndex ? 'bg-brand-500' : 'bg-surface-tertiary'
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {steps[currentStepIndex]?.label}
        </p>
      </div>

      {/* Step 1: VIN Entry */}
      {step === 'vin' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5 text-brand-500" />
              Enter Vehicle VIN
            </CardTitle>
            <CardDescription>
              The VIN is a 17-character code found on the dashboard or driver&apos;s door jamb
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Input
                placeholder="Enter 17-character VIN"
                value={vin}
                onChange={handleVinChange}
                maxLength={17}
                className="text-lg font-mono tracking-wider uppercase"
                error={vinError}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {vin.length}/17 characters
              </p>
            </div>

            <div className="bg-surface-tertiary/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Where to find the VIN:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Driver&apos;s side dashboard (visible through windshield)</li>
                  <li>Driver&apos;s door jamb sticker</li>
                  <li>Vehicle registration or title document</li>
                  <li>Insurance card</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleDecodeVin}
              disabled={vin.length !== 17 || isDecoding}
              className="w-full"
              isLoading={isDecoding}
            >
              Decode VIN
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Analysis Options */}
      {step === 'options' && vehicleInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Options</CardTitle>
            <CardDescription>
              Customize your analysis for {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Vehicle confirmed */}
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="font-medium">Vehicle Identified</p>
                <p className="text-sm text-muted-foreground">
                  {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                </p>
              </div>
            </div>

            {/* Mileage & Price */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Mileage
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 45000"
                  value={options.mileage}
                  onChange={(e) => setOptions({ ...options, mileage: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Asking Price (Optional)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 25000"
                  value={options.askingPrice}
                  onChange={(e) => setOptions({ ...options, askingPrice: e.target.value })}
                  leftIcon={<span className="text-muted-foreground">$</span>}
                />
              </div>
            </div>

            {/* Analysis types */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Include in Analysis</p>
              
              <label className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg cursor-pointer hover:bg-surface-tertiary transition-colors">
                <div className="flex items-center gap-3">
                  <FileSearch className="w-5 h-5 text-warning" />
                  <div>
                    <p className="font-medium">Vehicle History Report</p>
                    <p className="text-sm text-muted-foreground">Accidents, title status, ownership</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeHistory}
                  onChange={(e) => setOptions({ ...options, includeHistory: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-surface-secondary text-brand-500 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg cursor-pointer hover:bg-surface-tertiary transition-colors">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-brand-500" />
                  <div>
                    <p className="font-medium">AI Visual Inspection</p>
                    <p className="text-sm text-muted-foreground">Detect damage from photos</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeVisual}
                  onChange={(e) => setOptions({ ...options, includeVisual: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-surface-secondary text-brand-500 focus:ring-brand-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg cursor-pointer hover:bg-surface-tertiary transition-colors">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-success" />
                  <div>
                    <p className="font-medium">Engine Sound Analysis</p>
                    <p className="text-sm text-muted-foreground">Detect mechanical issues</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={options.includeAudio}
                  onChange={(e) => setOptions({ ...options, includeAudio: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-surface-secondary text-brand-500 focus:ring-brand-500"
                />
              </label>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('vin')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(options.includeVisual ? 'photos' : options.includeAudio ? 'audio' : 'confirm')}
                className="flex-1"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Photo Upload */}
      {step === 'photos' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-brand-500" />
              Upload Vehicle Photos
            </CardTitle>
            <CardDescription>
              Upload up to 20 photos for the most accurate visual analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dropzone */}
            <div
              {...getPhotoRootProps()}
              className={cn(
                'upload-zone',
                isPhotoDragActive && 'dragover'
              )}
            >
              <input {...getPhotoInputProps()} />
              <div className="w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-brand-500" />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {isPhotoDragActive ? 'Drop photos here' : 'Drag & drop photos or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  JPG, PNG, WebP • Max 10MB per file
                </p>
              </div>
            </div>

            {/* Uploaded photos */}
            {photos.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-3">
                  Uploaded Photos ({photos.length}/20)
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group aspect-square">
                      <img
                        src={photo.preview}
                        alt="Vehicle"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Photo tips */}
            <div className="bg-surface-tertiary/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">📸 Photo Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Take photos in good lighting (natural daylight is best)</li>
                <li>• Include all 4 corners, sides, front, and rear</li>
                <li>• Photograph the engine bay, interior, and trunk</li>
                <li>• Close-ups of any damage, rust, or wear</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('options')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={() => setStep(options.includeAudio ? 'audio' : 'confirm')}
                className="flex-1"
              >
                {options.includeAudio ? 'Continue' : 'Review'}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Audio Upload */}
      {step === 'audio' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-success" />
              Upload Engine Sounds
            </CardTitle>
            <CardDescription>
              Record the engine running for at least 30 seconds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Dropzone */}
            <div
              {...getAudioRootProps()}
              className={cn(
                'upload-zone',
                isAudioDragActive && 'dragover'
              )}
            >
              <input {...getAudioInputProps()} />
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-success" />
              </div>
              <div className="text-center">
                <p className="font-medium">
                  {isAudioDragActive ? 'Drop audio files here' : 'Drag & drop audio or click to browse'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  MP3, WAV, M4A • Max 50MB per file
                </p>
              </div>
            </div>

            {/* Uploaded audio */}
            {audioFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded Audio ({audioFiles.length}/5)</p>
                {audioFiles.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-center justify-between p-3 bg-surface-tertiary/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Volume2 className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">{audio.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(audio.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAudio(audio.id)}
                      className="text-muted-foreground hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Audio tips */}
            <div className="bg-surface-tertiary/50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2">🎤 Recording Tips</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Record in a quiet location away from traffic</li>
                <li>• Keep phone 2-3 feet from the engine</li>
                <li>• Record both idle and light acceleration</li>
                <li>• Let engine warm up first (1-2 minutes)</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('photos')} className="flex-1">
                Back
              </Button>
              <Button onClick={() => setStep('confirm')} className="flex-1">
                Review
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Confirmation */}
      {step === 'confirm' && vehicleInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Submit</CardTitle>
            <CardDescription>
              Confirm your analysis details before submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">
                    {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                  </p>
                </div>
                <Car className="w-5 h-5 text-brand-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">VIN</p>
                  <p className="font-mono">{vin}</p>
                </div>
              </div>

              {options.mileage && (
                <div className="flex items-center justify-between p-4 bg-surface-tertiary/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{parseInt(options.mileage).toLocaleString()} miles</p>
                  </div>
                </div>
              )}

              <div className="p-4 bg-surface-tertiary/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Analysis includes:</p>
                <div className="flex flex-wrap gap-2">
                  {options.includeHistory && (
                    <span className="badge badge-warning">Vehicle History</span>
                  )}
                  {options.includeVisual && (
                    <span className="badge badge-info">
                      Visual Analysis ({photos.length} photos)
                    </span>
                  )}
                  {options.includeAudio && (
                    <span className="badge badge-success">
                      Audio Analysis ({audioFiles.length} files)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cost estimate */}
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Estimated Cost</p>
                  <p className="text-sm text-muted-foreground">
                    Based on selected options
                  </p>
                </div>
                <p className="text-2xl font-bold text-brand-500">
                  ${options.includeHistory ? '5.00' : '0.00'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep('audio')} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                isLoading={isSubmitting}
                className="flex-1"
              >
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

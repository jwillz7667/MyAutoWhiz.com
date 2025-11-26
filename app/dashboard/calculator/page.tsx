'use client';

import { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  Fuel,
  Wrench,
  Shield,
  TrendingDown,
  Car,
  Info,
  PieChart,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface CostInputs {
  purchasePrice: number;
  downPayment: number;
  loanTerm: number; // months
  interestRate: number;
  annualMiles: number;
  mpg: number;
  fuelPrice: number;
  insuranceMonthly: number;
  maintenanceAnnual: number;
  yearsToOwn: number;
}

export default function CostCalculatorPage() {
  const [inputs, setInputs] = useState<CostInputs>({
    purchasePrice: 25000,
    downPayment: 5000,
    loanTerm: 60,
    interestRate: 6.5,
    annualMiles: 12000,
    mpg: 28,
    fuelPrice: 3.50,
    insuranceMonthly: 150,
    maintenanceAnnual: 800,
    yearsToOwn: 5,
  });

  const calculations = useMemo(() => {
    const loanAmount = inputs.purchasePrice - inputs.downPayment;
    const monthlyRate = inputs.interestRate / 100 / 12;
    const numPayments = inputs.loanTerm;
    
    // Monthly loan payment (PMT formula)
    const monthlyPayment = monthlyRate > 0
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)
      : loanAmount / numPayments;
    
    // Total loan cost
    const totalLoanPayments = monthlyPayment * numPayments;
    const totalInterest = totalLoanPayments - loanAmount;
    
    // Annual fuel cost
    const gallonsPerYear = inputs.annualMiles / inputs.mpg;
    const annualFuelCost = gallonsPerYear * inputs.fuelPrice;
    
    // Depreciation estimate (rough - 15% first year, 10% each subsequent year)
    let currentValue = inputs.purchasePrice;
    let totalDepreciation = 0;
    for (let year = 1; year <= inputs.yearsToOwn; year++) {
      const depRate = year === 1 ? 0.15 : 0.10;
      const yearDepreciation = currentValue * depRate;
      totalDepreciation += yearDepreciation;
      currentValue -= yearDepreciation;
    }
    
    // Total costs over ownership period
    const totalFuel = annualFuelCost * inputs.yearsToOwn;
    const totalInsurance = inputs.insuranceMonthly * 12 * inputs.yearsToOwn;
    const totalMaintenance = inputs.maintenanceAnnual * inputs.yearsToOwn;
    const totalCost = inputs.purchasePrice + totalInterest + totalFuel + totalInsurance + totalMaintenance;
    
    // Cost per mile
    const totalMiles = inputs.annualMiles * inputs.yearsToOwn;
    const costPerMile = totalCost / totalMiles;
    
    // Monthly average
    const monthlyAverage = totalCost / (inputs.yearsToOwn * 12);
    
    return {
      loanAmount,
      monthlyPayment,
      totalLoanPayments,
      totalInterest,
      annualFuelCost,
      totalFuel,
      totalInsurance,
      totalMaintenance,
      totalDepreciation,
      estimatedResaleValue: currentValue,
      totalCost,
      costPerMile,
      monthlyAverage,
      // For pie chart
      breakdown: [
        { name: 'Purchase + Interest', value: inputs.purchasePrice + totalInterest, color: '#00d4ff' },
        { name: 'Fuel', value: totalFuel, color: '#f59e0b' },
        { name: 'Insurance', value: totalInsurance, color: '#3b82f6' },
        { name: 'Maintenance', value: totalMaintenance, color: '#10b981' },
      ],
    };
  }, [inputs]);

  const updateInput = (key: keyof CostInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [key]: numValue }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold flex items-center gap-3">
          <Calculator className="w-8 h-8 text-brand-500" />
          Total Cost of Ownership Calculator
        </h1>
        <p className="text-muted-foreground mt-2">
          Calculate the true cost of owning a vehicle over time
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input form */}
        <div className="space-y-6">
          {/* Purchase & Financing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-brand-500" />
                Purchase & Financing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Purchase Price</label>
                <Input
                  type="number"
                  value={inputs.purchasePrice}
                  onChange={(e) => updateInput('purchasePrice', e.target.value)}
                  leftIcon={<span className="text-muted-foreground">$</span>}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Down Payment</label>
                <Input
                  type="number"
                  value={inputs.downPayment}
                  onChange={(e) => updateInput('downPayment', e.target.value)}
                  leftIcon={<span className="text-muted-foreground">$</span>}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Term (months)</label>
                  <Input
                    type="number"
                    value={inputs.loanTerm}
                    onChange={(e) => updateInput('loanTerm', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => updateInput('interestRate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fuel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Fuel className="w-5 h-5 text-warning" />
                Fuel Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Annual Miles Driven</label>
                <Input
                  type="number"
                  value={inputs.annualMiles}
                  onChange={(e) => updateInput('annualMiles', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Efficiency (MPG)</label>
                  <Input
                    type="number"
                    value={inputs.mpg}
                    onChange={(e) => updateInput('mpg', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fuel Price ($/gal)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputs.fuelPrice}
                    onChange={(e) => updateInput('fuelPrice', e.target.value)}
                    leftIcon={<span className="text-muted-foreground">$</span>}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Costs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="w-5 h-5 text-success" />
                Other Costs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Insurance</label>
                <Input
                  type="number"
                  value={inputs.insuranceMonthly}
                  onChange={(e) => updateInput('insuranceMonthly', e.target.value)}
                  leftIcon={<span className="text-muted-foreground">$</span>}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Annual Maintenance</label>
                <Input
                  type="number"
                  value={inputs.maintenanceAnnual}
                  onChange={(e) => updateInput('maintenanceAnnual', e.target.value)}
                  leftIcon={<span className="text-muted-foreground">$</span>}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Years You Plan to Own</label>
                <Input
                  type="number"
                  value={inputs.yearsToOwn}
                  onChange={(e) => updateInput('yearsToOwn', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {/* Summary */}
          <Card className="bg-gradient-to-br from-brand-500/10 to-success/10 border-brand-500/20">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Total {inputs.yearsToOwn}-Year Cost
                </p>
                <p className="text-4xl font-display font-bold text-brand-500">
                  {formatCurrency(calculations.totalCost)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-surface-primary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Average</p>
                  <p className="text-xl font-bold">{formatCurrency(calculations.monthlyAverage)}</p>
                </div>
                <div className="p-4 bg-surface-primary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Cost Per Mile</p>
                  <p className="text-xl font-bold">${calculations.costPerMile.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loan Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Loan Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loan Amount</span>
                <span className="font-medium">{formatCurrency(calculations.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Payment</span>
                <span className="font-medium">{formatCurrency(calculations.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Interest</span>
                <span className="font-medium text-warning">{formatCurrency(calculations.totalInterest)}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between font-medium">
                <span>Total Loan Payments</span>
                <span>{formatCurrency(calculations.totalLoanPayments)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {calculations.breakdown.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.value / calculations.totalCost) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Depreciation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-error" />
                Depreciation Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Depreciation</span>
                <span className="font-medium text-error">
                  -{formatCurrency(calculations.totalDepreciation)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Est. Value After {inputs.yearsToOwn} Years
                </span>
                <span className="font-medium">
                  {formatCurrency(calculations.estimatedResaleValue)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Info */}
          <div className="bg-surface-tertiary/50 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              This calculator provides estimates based on national averages. Actual costs may vary based on 
              your location, driving habits, specific vehicle, and other factors. Depreciation is estimated 
              at 15% for the first year and 10% for subsequent years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

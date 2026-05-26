'use client';

import { useState } from 'react';
import { Globe, Shield, AlertTriangle } from 'lucide-react';
import { CountryDetailPanel } from '@/components/globe/country-detail-panel';
import type { CountryThreat } from '@/lib/globe-data';
import { countryThreats, getThreatColor } from '@/lib/globe-data';

export default function GlobalThreatMapPage() {
  const [selectedCountry, setSelectedCountry] = useState<CountryThreat | null>(null);

  const criticalCount = countryThreats.filter(c => c.category === 'Critical').length;
  const highCount = countryThreats.filter(c => c.category === 'High').length;
  const avgThreatScore = Math.round(countryThreats.reduce((sum, c) => sum + c.threatScore, 0) / countryThreats.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Global Threat Map
          </h1>
          <p className="text-gray-400 mt-1">Real-time visualization of worldwide cyber threats</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Critical Threats</p>
              <p className="text-3xl font-bold text-red-500 mt-1">{criticalCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">High Risk Countries</p>
              <p className="text-3xl font-bold text-orange-500 mt-1">{highCount}</p>
            </div>
            <Shield className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Average Threat Score</p>
              <p className="text-3xl font-bold text-primary mt-1">{avgThreatScore}%</p>
            </div>
            <Globe className="w-10 h-10 text-primary opacity-50" />
          </div>
        </div>
      </div>

      <div className="bg-[#0A1929] border border-primary/30 rounded-lg p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white">Global Threat Intelligence</h2>
          <p className="text-sm text-gray-400 mt-1">
            Click on any country to view detailed threat analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {countryThreats.map((country) => (
            <button
              key={country.code}
              onClick={() => setSelectedCountry(country)}
              className="bg-[#0A0E1A] border border-primary/20 rounded-lg p-4 hover:border-primary/50 transition-all text-left group"
              style={{
                boxShadow: country.threatScore >= 85 ? `0 0 20px ${getThreatColor(country.threatScore)}40` : 'none'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold group-hover:text-primary transition-colors">{country.name}</h3>
                <span 
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    country.category === 'Critical' ? 'bg-red-500/20 text-red-500' :
                    country.category === 'High' ? 'bg-orange-500/20 text-orange-500' :
                    country.category === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-green-500/20 text-green-500'
                  }`}
                >
                  {country.category}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Threat Score</span>
                  <span className="text-lg font-bold" style={{ color: getThreatColor(country.threatScore) }}>
                    {country.threatScore}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ 
                      width: `${country.threatScore}%`, 
                      backgroundColor: getThreatColor(country.threatScore)
                    }}
                  />
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  {country.attackTypes.length} attack types • {country.recentIncidents.length} recent incidents
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedCountry && (
        <CountryDetailPanel 
          country={selectedCountry} 
          onClose={() => setSelectedCountry(null)} 
        />
      )}
    </div>
  );
}

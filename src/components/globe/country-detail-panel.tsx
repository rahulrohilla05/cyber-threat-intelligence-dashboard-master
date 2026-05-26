'use client';

import { X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CountryThreat } from '@/lib/globe-data';
import { getThreatColor } from '@/lib/globe-data';

export function CountryDetailPanel({ country, onClose }: { country: CountryThreat; onClose: () => void }) {
  return (
    <div className="fixed inset-y-0 right-0 w-[500px] bg-[#0A1929] border-l border-primary/30 shadow-2xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-[#0A1929] border-b border-primary/30 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{country.name}</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-gray-400">Threat Score:</span>
            <span className="text-2xl font-bold" style={{ color: getThreatColor(country.threatScore) }}>
              {country.threatScore}%
            </span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              country.category === 'Critical' ? 'bg-red-500/20 text-red-500' :
              country.category === 'High' ? 'bg-orange-500/20 text-orange-500' :
              country.category === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
              'bg-green-500/20 text-green-500'
            }`}>
              {country.category}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Attack Types</h3>
          <div className="space-y-3">
            {country.attackTypes.map((attack, idx) => (
              <div key={idx} className="bg-[#0A0E1A] rounded-lg p-3 border border-primary/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{attack.type}</span>
                  <span className="text-primary font-bold">{attack.count.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                    style={{ width: `${(attack.count / Math.max(...country.attackTypes.map(a => a.count))) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">Recent Incidents</h3>
          <div className="space-y-3">
            {country.recentIncidents.map((incident, idx) => (
              <div key={idx} className="bg-[#0A0E1A] rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{incident.description}</p>
                    <p className="text-xs text-gray-500">{new Date(incident.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white mb-4">Threat Trend (Last 30 Days)</h3>
          <div className="bg-[#0A0E1A] rounded-lg p-4 border border-primary/20">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={country.trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0A1929',
                    border: '1px solid #00BFFF',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#00BFFF" 
                  strokeWidth={3}
                  dot={{ fill: '#00BFFF', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500">Average</p>
                <p className="text-lg font-bold text-primary">
                  {Math.round(country.trendData.reduce((sum, d) => sum + d.score, 0) / country.trendData.length)}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Peak</p>
                <p className="text-lg font-bold text-orange-500">
                  {Math.max(...country.trendData.map(d => d.score))}%
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Trend</p>
                <p className={`text-lg font-bold ${
                  country.trendData[country.trendData.length - 1].score > country.trendData[0].score 
                    ? 'text-red-500' 
                    : 'text-green-500'
                }`}>
                  {country.trendData[country.trendData.length - 1].score > country.trendData[0].score ? '↑' : '↓'}
                  {Math.abs(country.trendData[country.trendData.length - 1].score - country.trendData[0].score)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

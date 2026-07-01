'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { Bike, Footprints, TrendingUp, MapPin, AlertTriangle, Zap, Shield } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const TrafficMap = dynamic(() => import('./TrafficMap'), { ssr: false });

interface CrashYear {
  year: number;
  total: number;
  fatalities: number;
  injuries: number;
}

interface CrashData {
  bicycle: CrashYear[];
  pedestrian: CrashYear[];
  note: string;
}

interface TrafficFeature {
  properties: {
    OBJECTID: number;
    Location: string;
    DAILY_AVG_TOT: number;
    Date: string;
    Bikes: number | null;
    Peds: number | null;
    CountType: string;
    BEGIN_DATE: string;
    Jurisdiction: number;
  };
  geometry: {
    type: string;
    coordinates: number[];
  };
}

interface YearData {
  year: number;
  bikes: number;
  peds: number;
  total: number;
  sites: number;
  avgBikes: number;
  avgPeds: number;
  avgTotal: number;
}

interface MapPoint {
  lat: number;
  lng: number;
  location: string;
  bikes: number;
  peds: number;
  total: number;
  date: string;
}

function parseDate(d: string): number {
  if (!d) return 0;
  const parts = d.split('/');
  if (parts.length === 3) {
    return parseInt(parts[2]);
  }
  return 0;
}

function processData(features: TrafficFeature[]): { yearly: YearData[]; mapPoints: MapPoint[] } {
  const byYear: Record<number, { year: number; bikes: number; peds: number; total: number; sites: number; bikeSites: number; pedSites: number }> = {};
  const mapPoints: MapPoint[] = [];

  for (const f of features) {
    const p = f.properties;
    const year = parseDate(p.Date);
    if (!year) continue;

    if (!byYear[year]) {
      byYear[year] = { year, bikes: 0, peds: 0, total: 0, sites: 0, bikeSites: 0, pedSites: 0 };
    }
    byYear[year].total += p.DAILY_AVG_TOT || 0;
    byYear[year].sites += 1;
    if (p.Bikes !== null && p.Bikes !== undefined) {
      byYear[year].bikes += p.Bikes;
      byYear[year].bikeSites += 1;
    }
    if (p.Peds !== null && p.Peds !== undefined) {
      byYear[year].peds += p.Peds;
      byYear[year].pedSites += 1;
    }

    if ((p.Bikes || p.Peds) && f.geometry?.coordinates) {
      const [lng, lat] = f.geometry.coordinates;
      if (lat && lng) {
        mapPoints.push({
          lat, lng,
          location: p.Location,
          bikes: p.Bikes || 0,
          peds: p.Peds || 0,
          total: p.DAILY_AVG_TOT || 0,
          date: p.Date,
        });
      }
    }
  }

  const yearly = Object.values(byYear)
    .sort((a, b) => a.year - b.year)
    .map(y => ({
      year: y.year,
      bikes: y.bikes,
      peds: y.peds,
      total: y.total,
      sites: y.sites,
      avgBikes: y.bikeSites > 0 ? Math.round(y.bikes / y.bikeSites) : 0,
      avgPeds: y.pedSites > 0 ? Math.round(y.peds / y.pedSites) : 0,
      avgTotal: y.sites > 0 ? Math.round(y.total / y.sites) : 0,
    }));
  return { yearly, mapPoints };
}

const BCYCLE_EVENTS = [
  { year: 2016, label: 'BCycle Santa Cruz Launch', color: '#22c55e' },
  { year: 2019, label: 'E-bike fleet added', color: '#f59e0b' },
];

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-5 bg-gray-900/80 border-gray-700/50 backdrop-blur">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <span className="text-sm text-gray-400">{label}</span>
        </div>
        <div className="text-2xl font-bold text-white">{value}</div>
        {sub && <div className="text-xs text-gray-500 mt-1">{sub}</div>}
      </Card>
    </motion.div>
  );
}

export default function SantaCruzMobilityPage() {
  const [data, setData] = useState<{ yearly: YearData[]; mapPoints: MapPoint[] } | null>(null);
  const [crashData, setCrashData] = useState<CrashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/santa-cruz-traffic.geojson').then(r => r.json()),
      fetch('/data/crash-data.json').then(r => r.json()).catch(() => null),
    ]).then(([geojson, crashes]) => {
      setData(processData(geojson.features));
      if (crashes) setCrashData(crashes);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    if (!data) return null;
    const bikeYears = data.yearly.filter(y => y.bikes > 0);
    const totalBikes = bikeYears.reduce((s, y) => s + y.bikes, 0);
    const totalPeds = bikeYears.reduce((s, y) => s + y.peds, 0);
    const peakBikeYear = bikeYears.reduce((max, y) => y.bikes > max.bikes ? y : max, bikeYears[0]);
    const topCorridors = [...data.mapPoints].sort((a, b) => b.bikes - a.bikes).slice(0, 5);
    return { totalBikes, totalPeds, peakBikeYear, bikeYears, topCorridors, totalSites: data.mapPoints.length };
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-lg animate-pulse">Loading Santa Cruz mobility data...</div>
      </div>
    );
  }

  if (!data || !stats) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-gray-900 to-blue-900/40 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Bike className="w-8 h-8 text-emerald-400" />
            <h1 className="text-3xl font-bold">Santa Cruz Mobility Evolution</h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            Pedestrian & bike traffic counts across Santa Cruz County (2010–2022).
            Tracking the impact of BCycle bikeshare, e-bike adoption, and active transportation infrastructure.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">251 count sites</span>
            <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">2,327 SCC bike facilities</span>
            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">71 BCycle stations</span>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">SWITRS crashes 2021–2023</span>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">46K+ features</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Bike} label="Total Bike Counts" value={stats.totalBikes.toLocaleString()} sub="Across all count sites" color="#22c55e" />
          <StatCard icon={Footprints} label="Total Ped Counts" value={stats.totalPeds.toLocaleString()} sub="Across all count sites" color="#3b82f6" />
          <StatCard icon={MapPin} label="Count Locations" value={String(stats.totalSites)} sub="With bike/ped data" color="#a855f7" />
          <StatCard icon={TrendingUp} label="Peak Bike Year" value={String(stats.peakBikeYear?.year)} sub={`${stats.peakBikeYear?.bikes.toLocaleString()} bikes counted`} color="#f59e0b" />
        </div>

        {/* Map */}
        <Card className="p-0 overflow-hidden bg-gray-900/80 border-gray-700/50">
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              Bike & Pedestrian Count Locations
            </h2>
            <p className="text-sm text-gray-400">Traffic counts + 1,454 bike paths (cyan) + 71 BCycle stations (green dots). Toggle layers top-right.</p>
          </div>
          <div className="h-[450px]">
            <TrafficMap points={data.mapPoints} />
          </div>
        </Card>

        {/* Time Series */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-5 bg-gray-900/80 border-gray-700/50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Avg Bike & Ped Counts Per Site
            </h2>
            <p className="text-xs text-gray-500 mb-3">Normalized per counting station to compare across years with different site counts</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.yearly.filter(y => y.avgBikes > 0 || y.avgPeds > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v: number, name: string) => [v.toLocaleString(), name]}
                />
                <Legend />
                {BCYCLE_EVENTS.map(e => (
                  <ReferenceLine key={e.year} x={e.year} stroke={e.color} strokeDasharray="5 5" label={{ value: e.label, fill: e.color, fontSize: 10, position: 'top' }} />
                ))}
                <Bar dataKey="avgBikes" name="Avg Bikes/Site" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgPeds" name="Avg Peds/Site" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-5 bg-gray-900/80 border-gray-700/50">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Avg Daily Traffic Volume by Year
            </h2>
            <p className="text-xs text-gray-500 mb-3">Average daily traffic per counting site across all 251 locations</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data.yearly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  formatter={(v: number) => [v.toLocaleString(), 'Avg Daily Traffic']}
                />
                {BCYCLE_EVENTS.map(e => (
                  <ReferenceLine key={e.year} x={e.year} stroke={e.color} strokeDasharray="5 5" label={{ value: e.label, fill: e.color, fontSize: 10, position: 'top' }} />
                ))}
                <Bar dataKey="avgTotal" name="Avg Daily Traffic" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Crash Trend + Infrastructure */}
        {crashData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-5 bg-gray-900/80 border-gray-700/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-400" />
                Bicycle Crash Trend (State Highways)
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={crashData.bicycle}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="injuries" name="Injuries" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="a" />
                  <Bar dataKey="fatalities" name="Fatalities" fill="#ef4444" radius={[4, 4, 0, 0]} stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-5 bg-gray-900/80 border-gray-700/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bike className="w-5 h-5 text-cyan-400" />
                Bicycle Infrastructure (SCC)
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-400">2,327</div>
                  <div className="text-xs text-gray-500 mt-1">Bike Facility Segments</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">71</div>
                  <div className="text-xs text-gray-500 mt-1">BCycle Stations</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-amber-400">140</div>
                  <div className="text-xs text-gray-500 mt-1">Crosswalk Signals</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">3,040</div>
                  <div className="text-xs text-gray-500 mt-1">Street Lights</div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-xs text-gray-400 font-medium">Bike Facility Types</div>
                {[
                  { label: 'Class II (Bike Lanes)', count: 1245, color: '#22d3ee' },
                  { label: 'Class III (Bike Routes)', count: 783, color: '#06b6d4' },
                  { label: 'Class I (Separated Paths)', count: 208, color: '#0891b2' },
                  { label: 'Class IV (Protected)', count: 91, color: '#0e7490' },
                ].map(t => (
                  <div key={t.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                    <span className="text-xs text-gray-400 flex-1">{t.label}</span>
                    <span className="text-xs font-medium" style={{ color: t.color }}>{t.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Top Corridors */}
        <Card className="p-5 bg-gray-900/80 border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4">Top Bike Corridors</h2>
          <div className="space-y-3">
            {stats.topCorridors.map((c, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-600 w-8">#{i + 1}</span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{c.location}</div>
                  <div className="text-xs text-gray-500">{c.date}</div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-emerald-400"><Bike className="w-4 h-4 inline mr-1" />{c.bikes}</span>
                  <span className="text-blue-400"><Footprints className="w-4 h-4 inline mr-1" />{c.peds}</span>
                </div>
                <div className="w-32 bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (c.bikes / stats.topCorridors[0].bikes) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* E-bike insight */}
        <Card className="p-5 bg-amber-900/20 border-amber-700/30">
          <div className="flex gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-300">E-Bike Safety Insight</h3>
              <p className="text-sm text-gray-400 mt-1">
                Bike crashes spiked 155% from 2021 (9) to 2022 (23) on state highways &mdash; coinciding with
                the e-bike boom. 2023 dropped to 19 with zero fatalities, suggesting infrastructure
                improvements may be working. City street data (not included above) would give the full picture.
                Map now shows 1,454 bike paths/lanes and 71 BCycle stations for infrastructure context.
              </p>
            </div>
          </div>
        </Card>

        {/* Data Attribution */}
        <Card className="p-5 bg-gray-900/80 border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Data Sources & Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 font-medium">Traffic Counts:</span> Santa Cruz County Open GIS,
                251 counting stations (2010–2022), daily average volumes with bike/ped breakdowns where available.
              </div>
              <div>
                <span className="text-gray-400 font-medium">Bicycle Infrastructure:</span> Santa Cruz County GIS
                Bicycle Facilities layer (2,327 segments), classified by Caltrans bike mode (Class I–IV).
                Pulled from AINative Lakehouse via SCC ArcGIS REST API.
              </div>
              <div>
                <span className="text-gray-400 font-medium">BCycle Stations:</span> BCycle Santa Cruz GBFS feed
                (General Bikeshare Feed Specification), 71 stations with live availability.
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-gray-400 font-medium">Crash Data:</span> Caltrans/SWITRS (Statewide Integrated
                Traffic Records System) via California Open Data Portal. State highways only — does not include city
                streets or local roads.
              </div>
              <div>
                <span className="text-gray-400 font-medium">Safety Infrastructure:</span> SCC signals, crosswalks,
                beacons (140 features) and street lights (3,040 features) from county GIS.
              </div>
              <div>
                <span className="text-gray-400 font-medium">Map Tiles:</span> OpenStreetMap via CARTO dark basemap.
                Bike paths overlay from OSM Overpass API (1,454 ways: cycleways + bike lanes).
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-800 text-xs text-gray-600">
            All data ingested into AINative Lakehouse (MinIO/Parquet) at <code className="text-gray-500">ainative-lakehouse/santa-cruz-mobility/</code> and
            <code className="text-gray-500"> raw/external/scc/</code>.
            Built with AINative AI Kit · {new Date().toLocaleDateString()}
          </div>
        </Card>
      </div>
    </div>
  );
}

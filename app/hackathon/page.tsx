'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Loader2, AlertCircle, CheckCircle2, Clock, Sparkles, Mail,
  FileText, TrendingUp, CreditCard, ShieldCheck, Download,
  Building2, BarChart3, Wrench, Database,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────────────────

interface AgentStep {
  agent: string;
  phase: number;
  status: 'pending' | 'running' | 'complete' | 'error';
  documents?: any[];
  count?: number;
}

interface GapAnalysis {
  critical_gaps: Array<{ name: string; priority: string; impact?: string }>;
  red_flags: Array<{ issue?: string; flag?: string; severity: string }>;
  due_diligence_risk: string;
  recommended_next_steps?: string[];
}

interface GapFix {
  document_name: string;
  category: string;
  generated_content: any;
  status: string;
  investor_note: string;
  compatible_platforms: string[];
}

interface CapTableExport {
  opencap_export?: any;
  carta_csv_preview?: any;
  pulley_scenario?: any;
  investor_summary?: any;
  data_room_index?: any[];
  readiness_checklist?: Array<{ item: string; status: string; platform: string }>;
}

interface Summary {
  documents_found: number;
  sources_covered: number;
  critical_gaps?: number;
  due_diligence_risk?: string;
  investor_readiness?: number;
  red_flags_count?: number;
  gaps_closed?: number;
  final_investor_readiness?: number;
  cap_table_export_ready?: boolean;
  platforms_supported?: string[];
}

// ── Agent config ─────────────────────────────────────────────────────────────

const AGENT_CONFIG: Array<{ name: string; phase: number; icon: React.ComponentType<{ className?: string }>; label: string }> = [
  { name: 'Scout Gmail',     phase: 1, icon: Mail,        label: 'Gmail Scout' },
  { name: 'Scout Drive',     phase: 1, icon: FileText,    label: 'Drive Scout' },
  { name: 'Scout Carta',     phase: 1, icon: TrendingUp,  label: 'Carta Scout' },
  { name: 'Scout Stripe/Ramp', phase: 1, icon: CreditCard, label: 'Stripe/Ramp Scout' },
  { name: 'Extract Financials', phase: 2, icon: BarChart3, label: 'Financial Extractor' },
  { name: 'Gap Fixer',       phase: 4, icon: Wrench,      label: 'Gap Fixer' },
  { name: 'Cap Table Export', phase: 4, icon: Database,   label: 'Cap Table Exporter' },
];

const PHASE_LABELS: Record<number, string> = {
  1: 'Phase 1 — Scout (4 parallel agents)',
  2: 'Phase 2 — Extract & Classify',
  3: 'Phase 3 — Gap Analysis & Synthesis',
  4: 'Phase 4 — Fix Gaps & Export',
};

const RISK_COLOR: Record<string, string> = {
  high: 'text-red-400',
  medium: 'text-yellow-400',
  low: 'text-green-400',
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function HackathonPage() {
  const [founderEmail, setFounderEmail] = useState('sarah@techstartup.io');
  const [companyName, setCompanyName] = useState('TechStartup Inc');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [gapFixes, setGapFixes] = useState<GapFix[]>([]);
  const [capTableExport, setCapTableExport] = useState<CapTableExport | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'gaps' | 'fixes' | 'export'>('timeline');
  const [error, setError] = useState<string | null>(null);
  const [opencapPushing, setOpencapPushing] = useState(false);
  const [opencapResult, setOpencapResult] = useState<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSteps([]);
    setGapAnalysis(null);
    setGapFixes([]);
    setCapTableExport(null);
    setSummary(null);
    setActiveTab('timeline');

    // Animate phases sequentially in the UI while waiting for real response
    const animatePhases = async () => {
      const phases = [
        { agents: ['Scout Gmail', 'Scout Drive', 'Scout Carta', 'Scout Stripe/Ramp'], phase: 1 },
        { agents: ['Classifier', 'Extract Financials'], phase: 2 },
        { agents: ['Gap Analyzer', 'Synthesizer'], phase: 3 },
        { agents: ['Gap Fixer', 'Cap Table Export'], phase: 4 },
      ];

      for (const { agents, phase } of phases) {
        setSteps(prev => [
          ...prev,
          ...agents.map(a => ({ agent: a, phase, status: 'running' as const })),
        ]);
        await new Promise(r => setTimeout(r, 800));
      }
    };

    animatePhases();

    try {
      abortRef.current = new AbortController();
      const res = await fetch('http://localhost:8001/reconstruct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ founder_email: founderEmail, company_name: companyName }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Map agent execution statuses
      const executedMap: Record<string, string> = {};
      (data.agents_executed || []).forEach((a: any) => { executedMap[a.name] = a.status; });

      setSteps(AGENT_CONFIG.map(cfg => ({
        agent: cfg.name,
        phase: cfg.phase,
        status: executedMap[cfg.name] === 'complete' ? 'complete'
              : executedMap[cfg.name] === 'error' ? 'error'
              : 'complete', // default to complete if ran
        count: Array.isArray((data.agents_executed || []).find((a: any) => a.name === cfg.name)?.documents)
          ? (data.agents_executed || []).find((a: any) => a.name === cfg.name)?.documents?.length
          : undefined,
      })));

      // Gap analysis
      const ga = data.gap_analysis?.data || data.gap_analysis || null;
      if (ga) setGapAnalysis(ga);

      // Gap fixes
      const fixes = data.data_room?.gap_fixes?.data;
      if (fixes) {
        const fixList = fixes.generated_documents || fixes.gap_fixes || fixes.fixes || [];
        setGapFixes(Array.isArray(fixList) ? fixList : [fixes]);
      }

      // Cap table export
      const cte = data.data_room?.cap_table_export?.data;
      if (cte) setCapTableExport(cte);

      setSummary(data.summary || null);
      setActiveTab('timeline');

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'An error occurred');
        setSteps(prev => prev.map(s => ({ ...s, status: 'error' })));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handlePushToOpenCap = async () => {
    if (!capTableExport) return;
    setOpencapPushing(true);
    setOpencapResult(null);
    try {
      const res = await fetch('http://localhost:8001/push-to-opencap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: companyName,
          opencap_export: capTableExport.opencap_export || {},
          data_room_index: capTableExport.data_room_index || [],
        }),
      });
      const data = await res.json();
      setOpencapResult(data);
    } catch (e: any) {
      setOpencapResult({ success: false, error: e.message });
    } finally {
      setOpencapPushing(false);
    }
  };

  const readiness = summary?.final_investor_readiness ?? summary?.investor_readiness ?? null;
  const isDone = !loading && steps.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-secondary mb-2">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-medium">Google I/O Hackathon 2025</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">Data Room Reconstructor</h1>
        <p className="text-muted-foreground">
          5 parallel Gemini agents scout your docs, identify gaps, auto-fix them,
          and produce a 100% investor-ready data room exportable to OpenCap Stack, Carta &amp; Pulley.
        </p>
      </div>

      {/* Input */}
      {steps.length === 0 && !loading && (
        <Card className="mb-8 max-w-2xl">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Founder Email</label>
                <Input
                  type="email"
                  value={founderEmail}
                  onChange={e => setFounderEmail(e.target.value)}
                  placeholder="founder@company.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Company Name</label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Your Company"
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading} size="lg" className="w-full">
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Running Agent Swarm...</>
                ) : (
                  'Launch Agent Swarm'
                )}
              </Button>
            </form>
          </div>
        </Card>
      )}

      {error && (
        <Card className="mb-6 max-w-4xl border-red-500/50">
          <div className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </Card>
      )}

      {/* Summary bar */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Docs Found', value: summary.documents_found },
            { label: 'Gaps Closed', value: summary.gaps_closed ?? '—' },
            { label: 'DD Risk', value: summary.due_diligence_risk?.toUpperCase() ?? '—', colored: true, risk: summary.due_diligence_risk },
            { label: 'Investor Ready', value: readiness != null ? `${readiness}%` : '—' },
          ].map(stat => (
            <Card key={stat.label}>
              <div className="p-4 text-center">
                <div className={cn(
                  'text-2xl font-bold',
                  stat.colored ? RISK_COLOR[stat.risk || ''] ?? '' : ''
                )}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Tabs */}
      {(steps.length > 0 || loading) && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            {(['timeline', 'gaps', 'fixes', 'export'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {tab === 'timeline' && <><Clock className="inline w-3.5 h-3.5 mr-1.5" />Agent Timeline</>}
                {tab === 'gaps' && <><AlertCircle className="inline w-3.5 h-3.5 mr-1.5" />Gap Analysis</>}
                {tab === 'fixes' && <><Wrench className="inline w-3.5 h-3.5 mr-1.5" />Gap Fixes</>}
                {tab === 'export' && <><Database className="inline w-3.5 h-3.5 mr-1.5" />Investor Export</>}
              </button>
            ))}
            {steps.length > 0 && (
              <button
                onClick={() => { setSteps([]); setSummary(null); setGapAnalysis(null); setGapFixes([]); setCapTableExport(null); }}
                className="ml-auto px-4 py-2 rounded-lg text-sm bg-muted/50 text-muted-foreground hover:bg-muted"
              >
                Reset
              </button>
            )}
          </div>

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Phase groups */}
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" />Execution Timeline
                  </h3>
                  <div className="space-y-6">
                    {[1, 2, 3, 4].map(phase => {
                      const phaseSteps = steps.filter(s => s.phase === phase);
                      if (phaseSteps.length === 0 && !loading) return null;
                      return (
                        <div key={phase}>
                          <div className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
                            {PHASE_LABELS[phase]}
                          </div>
                          <div className="space-y-2">
                            <AnimatePresence>
                              {phaseSteps.map((step, i) => {
                                const cfg = AGENT_CONFIG.find(a => a.name === step.agent);
                                const Icon = cfg?.icon || FileText;
                                return (
                                  <motion.div
                                    key={`${phase}-${i}`}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2"
                                  >
                                    <div className={cn(
                                      'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                                      step.status === 'running' ? 'bg-primary/20'
                                      : step.status === 'complete' ? 'bg-green-500/20'
                                      : 'bg-red-500/20'
                                    )}>
                                      {step.status === 'running'
                                        ? <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                                        : step.status === 'complete'
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                                        : <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
                                    </div>
                                    <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                    <span className="text-sm font-medium flex-1">{step.agent}</span>
                                    {step.count != null && (
                                      <span className="text-xs text-muted-foreground">{step.count} docs</span>
                                    )}
                                    <span className={cn(
                                      'text-xs',
                                      step.status === 'running' ? 'text-primary'
                                      : step.status === 'complete' ? 'text-green-400'
                                      : 'text-red-400'
                                    )}>
                                      {step.status === 'running' ? 'Running…'
                                       : step.status === 'complete' ? 'Done'
                                       : 'Error'}
                                    </span>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                            {loading && phaseSteps.length === 0 && phase <= 2 && (
                              <div className="flex items-center gap-2 text-muted-foreground text-sm py-1">
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />Queued…
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Live status */}
              <Card>
                <div className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />Agent Swarm Status
                  </h3>
                  <div className="space-y-3">
                    {loading && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        <div>
                          <p className="text-sm font-medium">Gemini agents running in parallel</p>
                          <p className="text-xs text-muted-foreground">Scouting, classifying, extracting, fixing gaps…</p>
                        </div>
                      </div>
                    )}
                    {isDone && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-400">Data room ready for investors</p>
                          <p className="text-xs text-muted-foreground">All gaps fixed · Export available</p>
                        </div>
                      </div>
                    )}
                    {isDone && summary && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sources scanned</span>
                          <span>{summary.sources_covered} / 4</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Documents found</span>
                          <span>{summary.documents_found}</span>
                        </div>
                        {summary.gaps_closed != null && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Gaps auto-fixed</span>
                            <span className="text-green-400">{summary.gaps_closed}</span>
                          </div>
                        )}
                        {readiness != null && (
                          <div className="mt-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Investor Readiness</span>
                              <span className="font-bold text-green-400">{readiness}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <motion.div
                                className="bg-green-400 h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${readiness}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        )}
                        {summary.platforms_supported && (
                          <div className="flex gap-2 flex-wrap pt-2">
                            {summary.platforms_supported.map(p => (
                              <span key={p} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Gap Analysis Tab */}
          {activeTab === 'gaps' && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <div className="p-6">
                  <h4 className="font-medium mb-3 text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />Critical Gaps
                  </h4>
                  {gapAnalysis?.critical_gaps?.length ? (
                    <div className="space-y-2">
                      {gapAnalysis.critical_gaps.map((g, i) => (
                        <div key={i} className="p-2 rounded bg-red-500/10 border border-red-500/20">
                          <p className="text-sm font-medium">{g.name}</p>
                          {g.impact && <p className="text-xs text-muted-foreground mt-0.5">{g.impact}</p>}
                          <p className="text-xs text-red-400 mt-0.5">Priority: {g.priority}</p>
                        </div>
                      ))}
                    </div>
                  ) : loading ? (
                    <p className="text-xs text-muted-foreground">Analyzing…</p>
                  ) : (
                    <p className="text-xs text-green-400">No critical gaps</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h4 className="font-medium mb-3 text-yellow-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />Red Flags
                  </h4>
                  {gapAnalysis?.red_flags?.length ? (
                    <div className="space-y-2">
                      {gapAnalysis.red_flags.map((f, i) => (
                        <div key={i} className="p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                          <p className="text-sm font-medium">{f.issue || f.flag}</p>
                          <p className="text-xs text-yellow-400 mt-0.5">{f.severity}</p>
                        </div>
                      ))}
                    </div>
                  ) : loading ? (
                    <p className="text-xs text-muted-foreground">Analyzing…</p>
                  ) : (
                    <p className="text-xs text-green-400">No red flags</p>
                  )}
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h4 className="font-medium mb-3 text-orange-400">DD Risk &amp; Next Steps</h4>
                  {gapAnalysis ? (
                    <>
                      <div className={cn('text-2xl font-bold mb-3', RISK_COLOR[gapAnalysis.due_diligence_risk] ?? '')}>
                        {gapAnalysis.due_diligence_risk?.toUpperCase() ?? '—'}
                      </div>
                      {gapAnalysis.recommended_next_steps?.length ? (
                        <ul className="space-y-1">
                          {gapAnalysis.recommended_next_steps.map((s, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                              <span className="text-primary shrink-0">→</span>{s}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-xs text-muted-foreground">{loading ? 'Analyzing…' : 'No data yet'}</p>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Gap Fixes Tab */}
          {activeTab === 'fixes' && (
            <div className="space-y-4">
              {gapFixes.length === 0 && (
                <Card>
                  <div className="p-6 text-center text-muted-foreground">
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />Gap Fixer agent running…</>
                    ) : 'No gap fixes generated yet. Run the agent swarm first.'}
                  </div>
                </Card>
              )}
              {gapFixes.map((fix, i) => (
                <Card key={i}>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <Wrench className="w-4 h-4 text-primary" />
                          {fix.document_name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{fix.category} · {fix.investor_note}</p>
                      </div>
                      <span className={cn(
                        'text-xs px-2 py-1 rounded shrink-0',
                        fix.status === 'generated' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-primary/10 text-primary border border-primary/20'
                      )}>
                        {fix.status}
                      </span>
                    </div>
                    {fix.compatible_platforms?.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {fix.compatible_platforms.map(p => (
                          <span key={p} className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    {fix.generated_content && typeof fix.generated_content === 'object' && (
                      <pre className="mt-3 text-xs bg-muted rounded p-3 overflow-auto max-h-40 text-muted-foreground">
                        {JSON.stringify(fix.generated_content, null, 2)}
                      </pre>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Export Tab — Investor-Ready Data Room */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              {!capTableExport && !loading && (
                <Card>
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    Run the agent swarm to generate the investor-ready data room.
                  </div>
                </Card>
              )}

              {capTableExport && (() => {
                const index: any[] = capTableExport.data_room_index || [];
                const stats = (capTableExport as any).data_room_stats || {};
                const categories = ['Legal', 'Equity', 'HR', 'Tax', 'Agreements', 'Fundraising', 'Financial', 'Technical'];
                const categoryIcons: Record<string, React.ComponentType<{className?: string}>> = {
                  Legal: ShieldCheck, Equity: TrendingUp, HR: FileText, Tax: FileText,
                  Agreements: FileText, Fundraising: Sparkles, Financial: BarChart3, Technical: Database,
                };

                return (
                  <>
                    {/* Push to OpenCap */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <Button
                        onClick={handlePushToOpenCap}
                        disabled={opencapPushing}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      >
                        {opencapPushing
                          ? <><Loader2 className="w-4 h-4 animate-spin" />Pushing to OpenCap Stack…</>
                          : <><Building2 className="w-4 h-4" />Push to OpenCap Stack</>}
                      </Button>
                      {opencapResult && (
                        <div className={cn(
                          'flex items-center gap-2 px-4 py-2 rounded-lg text-sm border',
                          opencapResult.success
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        )}>
                          {opencapResult.success
                            ? <><CheckCircle2 className="w-4 h-4 shrink-0" />
                                {opencapResult.results?.summary?.stakeholders_pushed ?? 0} stakeholders · {opencapResult.results?.summary?.share_classes_pushed ?? 0} share classes · {opencapResult.results?.summary?.documents_pushed ?? 0} docs pushed to OpenCap</>
                            : <><AlertCircle className="w-4 h-4 shrink-0" />Push failed: {opencapResult.error || opencapResult.detail}</>}
                        </div>
                      )}
                    </div>

                    {/* Stats bar */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border-green-500/20">
                        <div className="p-4 text-center">
                          <div className="text-2xl font-bold text-green-400">{stats.present ?? 0}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />Found & Verified
                          </div>
                        </div>
                      </Card>
                      <Card className="border-blue-500/20">
                        <div className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-400">{stats.generated ?? 0}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                            <Sparkles className="w-3 h-3" />AI Generated
                          </div>
                        </div>
                      </Card>
                      <Card className="border-yellow-500/20">
                        <div className="p-4 text-center">
                          <div className="text-2xl font-bold text-yellow-400">{stats.missing ?? 0}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" />Action Required
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Platform export badges */}
                    <div className="flex gap-3 flex-wrap">
                      {[
                        { name: 'OpenCap Stack', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                        { name: 'Carta', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                        { name: 'Pulley', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
                      ].map(p => (
                        <div key={p.name} className={cn('flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium', p.bg, p.color, p.border)}>
                          <CheckCircle2 className="w-4 h-4" />
                          {p.name} — Export Ready
                        </div>
                      ))}
                    </div>

                    {/* Documents by category */}
                    <div className="grid lg:grid-cols-2 gap-4">
                      {categories.map(cat => {
                        const docs = index.filter((d: any) => d.category === cat);
                        if (docs.length === 0) return null;
                        const Icon = categoryIcons[cat] || FileText;
                        const presentCount = docs.filter((d: any) => d.status === 'present').length;
                        const generatedCount = docs.filter((d: any) => d.status === 'generated').length;

                        return (
                          <Card key={cat}>
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold flex items-center gap-2 text-sm">
                                  <Icon className="w-4 h-4 text-primary" />{cat}
                                </h4>
                                <div className="flex gap-1.5">
                                  {presentCount > 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400">{presentCount} found</span>
                                  )}
                                  {generatedCount > 0 && (
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{generatedCount} generated</span>
                                  )}
                                </div>
                              </div>
                              <div className="space-y-1.5">
                                {docs.map((doc: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      {doc.status === 'present'
                                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                        : doc.status === 'generated'
                                        ? <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                        : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                                      <span className="text-xs truncate text-foreground">{doc.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0">
                                      {doc.required && (
                                        <span className="text-xs text-muted-foreground/60">req</span>
                                      )}
                                      <span className={cn(
                                        'text-xs px-1.5 py-0.5 rounded',
                                        doc.status === 'present' ? 'bg-green-500/10 text-green-400'
                                        : doc.status === 'generated' ? 'bg-blue-500/10 text-blue-400'
                                        : 'bg-yellow-500/10 text-yellow-400'
                                      )}>
                                        {doc.status === 'present' ? '✓ verified' : doc.status === 'generated' ? '⚡ generated' : '⚠ missing'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>

                    {/* Readiness checklist */}
                    {capTableExport.readiness_checklist?.length ? (
                      <Card>
                        <div className="p-6">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-400" />Platform Readiness Checklist
                          </h3>
                          <div className="grid md:grid-cols-3 gap-4">
                            {(['OpenCap Stack', 'Carta', 'Pulley'] as const).map(platform => {
                              const items = capTableExport.readiness_checklist!.filter((c: any) => c.platform === platform);
                              return (
                                <div key={platform}>
                                  <div className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{platform}</div>
                                  <div className="space-y-1.5">
                                    {items.map((item: any, i: number) => (
                                      <div key={i} className="flex items-center gap-2 text-xs">
                                        {item.status === 'ready'
                                          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                                          : <AlertCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0" />}
                                        <span className={item.status === 'ready' ? 'text-foreground' : 'text-muted-foreground'}>{item.item}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </Card>
                    ) : null}

                    {/* Cap table snapshot */}
                    {capTableExport.opencap_export && (
                      <Card>
                        <div className="p-6">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />Cap Table Snapshot
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b border-border">
                                  <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Stakeholder</th>
                                  <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Role</th>
                                  <th className="text-right py-2 pr-4 text-muted-foreground font-medium">Shares</th>
                                  <th className="text-right py-2 pr-4 text-muted-foreground font-medium">Share Class</th>
                                  <th className="text-right py-2 text-muted-foreground font-medium">Ownership</th>
                                </tr>
                              </thead>
                              <tbody>
                                {capTableExport.opencap_export.stakeholders?.map((s: any, i: number) => (
                                  <tr key={i} className="border-b border-border/50 last:border-0">
                                    <td className="py-2 pr-4 font-medium">{s.name}</td>
                                    <td className="py-2 pr-4 text-muted-foreground">{s.role}</td>
                                    <td className="py-2 pr-4 text-right">{s.shares?.toLocaleString()}</td>
                                    <td className="py-2 pr-4 text-right text-muted-foreground">{s.share_class}</td>
                                    <td className="py-2 text-right font-semibold text-primary">{s.ownership_pct}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </Card>
                    )}

                    {/* Dilution scenarios */}
                    {capTableExport.pulley_scenario?.scenarios && (
                      <Card>
                        <div className="p-6">
                          <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-cyan-400" />Dilution Scenarios (Pulley)
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            {capTableExport.pulley_scenario.scenarios.map((s: any, i: number) => (
                              <div key={i} className="p-4 rounded-lg bg-muted">
                                <div className="text-sm font-semibold mb-2">{s.name}</div>
                                <div className="space-y-1 text-xs text-muted-foreground">
                                  <div className="flex justify-between"><span>Valuation</span><span className="text-foreground">${(s.valuation/1e6).toFixed(0)}M</span></div>
                                  <div className="flex justify-between"><span>New shares</span><span className="text-foreground">{s.new_shares?.toLocaleString()}</span></div>
                                  <div className="flex justify-between"><span>Price/share</span><span className="text-foreground">${s.price_per_share}</span></div>
                                  <div className="flex justify-between"><span>Founder dilution</span><span className="text-yellow-400">-{s.founder_dilution_pct}%</span></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

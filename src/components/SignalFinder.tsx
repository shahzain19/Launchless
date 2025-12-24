import { useState, useEffect } from 'react';
import { useToast } from '../hooks/useToast';

interface SetupForm {
    productDescription: string;
    targetAudience: string;
    painPoints: string[];
    platforms: string[];
}

interface SignalDefinition {
    id: number;
    productDescription: string;
    targetAudience: string;
    painPoints: string[];
    signalPatterns: any;
    platforms: string[];
    status: string;
}

interface SignalLead {
    id: number;
    platform: string;
    sourceUrl: string;
    authorUsername: string;
    authorProfile: string;
    signalType: string;
    confidence: number;
    signalData: any;
    suggestedOpener: string;
    status: string;
    contactedAt?: string;
    notes?: string;
    createdAt: string;
}

interface SignalFinderProps {
    projectId: string;
}

export default function SignalFinder({ projectId }: SignalFinderProps) {
    const [activeTab, setActiveTab] = useState<'setup' | 'leads'>('setup');
    const [definition, setDefinition] = useState<SignalDefinition | null>(null);
    const [leads, setLeads] = useState<SignalLead[]>([]);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);
    const [setupForm, setSetupForm] = useState<SetupForm>({
        productDescription: '',
        targetAudience: '',
        painPoints: [''],
        platforms: ['github', 'twitter']
    });

    const { error, success } = useToast();
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

    useEffect(() => {
        fetchDefinition();
        fetchLeads();
    }, [projectId]);

    async function fetchDefinition() {
        try {
            const res = await fetch(`${API_URL}/api/signals/${projectId}/definition`, {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                setDefinition(data.data);
                setSetupForm({
                    productDescription: data.data.productDescription,
                    targetAudience: data.data.targetAudience,
                    painPoints: data.data.painPoints,
                    platforms: data.data.platforms
                });
                setActiveTab('leads');
            } else if (res.status !== 404) {
                throw new Error('Failed to fetch signal definition');
            }
        } catch (err) {
            console.error('Failed to fetch definition:', err);
        }
    }

    async function fetchLeads() {
        try {
            const res = await fetch(`${API_URL}/api/signals/${projectId}/leads`, {
                credentials: 'include'
            });
            
            if (res.ok) {
                const data = await res.json();
                setLeads(data.data);
            } else if (res.status !== 404) {
                throw new Error('Failed to fetch leads');
            }
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        }
    }

    async function saveDefinition() {
        if (!setupForm.productDescription || !setupForm.targetAudience || setupForm.painPoints.filter(p => p.trim()).length === 0) {
            error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/signals/${projectId}/definition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    productDescription: setupForm.productDescription,
                    targetAudience: setupForm.targetAudience,
                    painPoints: setupForm.painPoints.filter(p => p.trim()),
                    platforms: setupForm.platforms
                })
            });

            if (!res.ok) throw new Error('Failed to save definition');

            const data = await res.json();
            setDefinition(data.data);
            success('Signal definition saved successfully');
            setActiveTab('leads');
        } catch (err) {
            error('Failed to save signal definition');
        } finally {
            setLoading(false);
        }
    }

    async function scanForSignals() {
        if (!definition) return;

        setScanning(true);
        try {
            const res = await fetch(`${API_URL}/api/signals/${projectId}/scan`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    platforms: definition.platforms,
                    limit: 20
                })
            });

            if (!res.ok) throw new Error('Failed to scan for signals');

            const data = await res.json();
            setLeads(prev => [...data.data.leads, ...prev]);
            success(`Found ${data.data.total} new signals`);
        } catch (err) {
            error('Failed to scan for signals');
        } finally {
            setScanning(false);
        }
    }

    async function updateLeadStatus(leadId: number, status: string, notes?: string) {
        try {
            const res = await fetch(`${API_URL}/api/signals/${projectId}/leads/${leadId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ status, notes })
            });

            if (!res.ok) throw new Error('Failed to update lead');

            setLeads(prev => prev.map(lead => 
                lead.id === leadId 
                    ? { ...lead, status, notes, contactedAt: status === 'contacted' ? new Date().toISOString() : lead.contactedAt }
                    : lead
            ));
            
            success('Lead updated successfully');
        } catch (err) {
            error('Failed to update lead');
        }
    }

    function addPainPoint() {
        setSetupForm(prev => ({
            ...prev,
            painPoints: [...prev.painPoints, '']
        }));
    }

    function updatePainPoint(index: number, value: string) {
        setSetupForm(prev => ({
            ...prev,
            painPoints: prev.painPoints.map((p, i) => i === index ? value : p)
        }));
    }

    function removePainPoint(index: number) {
        setSetupForm(prev => ({
            ...prev,
            painPoints: prev.painPoints.filter((_, i) => i !== index)
        }));
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Signal Finder</h2>
                    <p className="text-zinc-400 text-sm">
                        AI finds people who already need your product. You stay in control.
                    </p>
                </div>
                
                {definition && (
                    <button
                        onClick={scanForSignals}
                        disabled={scanning}
                        className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {scanning ? 'Scanning...' : 'Scan for Signals'}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-zinc-900 rounded-lg p-1">
                <button
                    onClick={() => setActiveTab('setup')}
                    className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                        activeTab === 'setup'
                            ? "bg-white text-black font-medium"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Setup
                </button>
                <button
                    onClick={() => setActiveTab('leads')}
                    className={`flex-1 py-2 px-4 text-sm rounded-md transition-all ${
                        activeTab === 'leads'
                            ? "bg-white text-black font-medium"
                            : "text-zinc-400 hover:text-zinc-200"
                    }`}
                >
                    Leads ({leads.length})
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'setup' && (
                <SetupTab
                    form={setupForm}
                    setForm={setSetupForm}
                    onSave={saveDefinition}
                    loading={loading}
                    addPainPoint={addPainPoint}
                    updatePainPoint={updatePainPoint}
                    removePainPoint={removePainPoint}
                />
            )}

            {activeTab === 'leads' && (
                <LeadsTab
                    leads={leads}
                    onUpdateStatus={updateLeadStatus}
                    hasDefinition={!!definition}
                />
            )}
        </div>
    );
}

// Setup Tab Component
function SetupTab({ 
    form, 
    setForm, 
    onSave, 
    loading, 
    addPainPoint, 
    updatePainPoint, 
    removePainPoint 
}: {
    form: SetupForm;
    setForm: (form: SetupForm | ((prev: SetupForm) => SetupForm)) => void;
    onSave: () => void;
    loading: boolean;
    addPainPoint: () => void;
    updatePainPoint: (index: number, value: string) => void;
    removePainPoint: (index: number) => void;
}) {
    return (
        <div className="space-y-6">
            <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
                <h3 className="font-medium text-white mb-4">Product Intent Definition</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            What does your product do? *
                        </label>
                        <textarea
                            value={form.productDescription}
                            onChange={(e) => setForm((prev: SetupForm) => ({ ...prev, productDescription: e.target.value }))}
                            placeholder="A tool that turns GitHub repos into launch posts for devs who hate marketing."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            Who is it for? *
                        </label>
                        <input
                            type="text"
                            value={form.targetAudience}
                            onChange={(e) => setForm((prev: SetupForm) => ({ ...prev, targetAudience: e.target.value }))}
                            placeholder="Solo developers, indie hackers, startup founders"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            What pain does it solve? *
                        </label>
                        <div className="space-y-2">
                            {form.painPoints.map((point: string, index: number) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={point}
                                        onChange={(e) => updatePainPoint(index, e.target.value)}
                                        placeholder="Developers hate writing marketing copy"
                                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                                    />
                                    {form.painPoints.length > 1 && (
                                        <button
                                            onClick={() => removePainPoint(index)}
                                            className="text-zinc-500 hover:text-red-400 px-2"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addPainPoint}
                                className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                                + Add another pain point
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-300 mb-2">
                            Platforms to monitor
                        </label>
                        <div className="flex gap-3">
                            {['github', 'twitter', 'reddit', 'indie_hackers'].map(platform => (
                                <label key={platform} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.platforms.includes(platform)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setForm((prev: SetupForm) => ({ ...prev, platforms: [...prev.platforms, platform] }));
                                            } else {
                                                setForm((prev: SetupForm) => ({ ...prev, platforms: prev.platforms.filter((p: string) => p !== platform) }));
                                            }
                                        }}
                                        className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-zinc-300 capitalize">
                                        {platform.replace('_', ' ')}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                            Start with GitHub + Twitter for best results
                        </p>
                    </div>
                </div>

                <button
                    onClick={onSave}
                    disabled={loading}
                    className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Saving...' : 'Save & Generate Patterns'}
                </button>
            </div>
        </div>
    );
}

// Leads Tab Component
function LeadsTab({ 
    leads, 
    onUpdateStatus, 
    hasDefinition 
}: {
    leads: SignalLead[];
    onUpdateStatus: (leadId: number, status: string, notes?: string) => void;
    hasDefinition: boolean;
}) {
    const [filter, setFilter] = useState<string>('all');

    const filteredLeads = leads.filter(lead => {
        if (filter === 'all') return true;
        return lead.status === filter;
    });

    if (!hasDefinition) {
        return (
            <div className="text-center py-12">
                <div className="text-zinc-400 mb-4">No signal definition found</div>
                <div className="text-sm text-zinc-500">
                    Complete the setup first to start finding signals
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Filter */}
            <div className="flex gap-2">
                {['all', 'new', 'contacted', 'skipped', 'saved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                            filter === status
                                ? 'bg-white text-black'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                    >
                        {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                        {status !== 'all' && (
                            <span className="ml-1 text-xs">
                                ({leads.filter(l => l.status === status).length})
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Leads */}
            {filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-zinc-400 mb-4">
                        {filter === 'all' ? 'No signals found yet' : `No ${filter} leads`}
                    </div>
                    {filter === 'all' && (
                        <div className="text-sm text-zinc-500">
                            Click "Scan for Signals" to find potential customers
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map(lead => (
                        <LeadCard
                            key={lead.id}
                            lead={lead}
                            onUpdateStatus={onUpdateStatus}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// Lead Card Component
function LeadCard({ 
    lead, 
    onUpdateStatus 
}: {
    lead: SignalLead;
    onUpdateStatus: (leadId: number, status: string, notes?: string) => void;
}) {
    const [notes, setNotes] = useState(lead.notes || '');
    const [showNotes, setShowNotes] = useState(false);

    const confidenceColor = lead.confidence >= 0.8 ? 'text-green-400' : 
                           lead.confidence >= 0.6 ? 'text-yellow-400' : 'text-red-400';

    const platformIcon = {
        github: '🐙',
        twitter: '🐦',
        reddit: '🤖',
        indie_hackers: '🚀'
    }[lead.platform] || '📡';

    return (
        <div className="bg-zinc-900/30 rounded-lg p-6 border border-zinc-800/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{platformIcon}</span>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white">Lead #{lead.id}</span>
                            <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                                {lead.platform}
                            </span>
                            <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                                {lead.signalType.replace('_', ' ')}
                            </span>
                        </div>
                        <div className="text-sm text-zinc-400 mt-1">
                            <a 
                                href={lead.authorProfile} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300"
                            >
                                @{lead.authorUsername}
                            </a>
                        </div>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className={`text-sm font-medium ${confidenceColor}`}>
                        {Math.round(lead.confidence * 100)}% confidence
                    </div>
                    <div className="text-xs text-zinc-500">
                        {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>

            {/* Signal Data */}
            <div className="bg-zinc-950/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-zinc-300 mb-2">
                    <span className="text-zinc-500">Why flagged:</span>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1">
                    {Object.entries(lead.signalData).map(([key, value]) => (
                        <li key={key}>
                            • {key.replace(/([A-Z])/g, ' $1').toLowerCase()}: {String(value)}
                        </li>
                    ))}
                </ul>
                <a 
                    href={lead.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
                >
                    View source →
                </a>
            </div>

            {/* Suggested Opener */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                <div className="text-sm text-blue-300 mb-2">Suggested opener:</div>
                <div className="text-sm text-zinc-300 italic">
                    "{lead.suggestedOpener}"
                </div>
                <button
                    onClick={() => navigator.clipboard.writeText(lead.suggestedOpener)}
                    className="text-xs text-blue-400 hover:text-blue-300 mt-2"
                >
                    Copy to clipboard
                </button>
            </div>

            {/* Notes */}
            {showNotes && (
                <div className="mb-4">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this lead..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-500 focus:border-blue-500 focus:outline-none text-sm"
                        rows={2}
                    />
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onUpdateStatus(lead.id, 'contacted', notes)}
                    disabled={lead.status === 'contacted'}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    {lead.status === 'contacted' ? 'Contacted' : 'Mark Contacted'}
                </button>
                
                <button
                    onClick={() => onUpdateStatus(lead.id, 'skipped')}
                    disabled={lead.status === 'skipped'}
                    className="bg-zinc-600 hover:bg-zinc-700 disabled:bg-zinc-600/50 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Skip
                </button>
                
                <button
                    onClick={() => onUpdateStatus(lead.id, 'saved', notes)}
                    disabled={lead.status === 'saved'}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                    Save
                </button>

                <button
                    onClick={() => setShowNotes(!showNotes)}
                    className="text-zinc-400 hover:text-zinc-200 px-2 py-1 text-sm"
                >
                    {showNotes ? 'Hide Notes' : 'Add Notes'}
                </button>
            </div>

            {lead.contactedAt && (
                <div className="text-xs text-zinc-500 mt-2">
                    Contacted on {new Date(lead.contactedAt).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}
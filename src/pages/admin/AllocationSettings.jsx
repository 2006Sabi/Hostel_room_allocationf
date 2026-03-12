import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Settings as SettingsIcon,
    Save,
    RefreshCcw,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    ToggleLeft,
    ToggleRight,
    Sliders,
    Info
} from 'lucide-react';

const AllocationSettings = () => {
    const [settings, setSettings] = useState({
        yearWeight: 40,
        cgpaWeight: 40,
        distanceWeight: 20,
        autoAllocationEnabled: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/settings');
            setSettings(data);
        } catch (err) {
            setError('Failed to load allocation settings');
        } finally {
            setLoading(false);
        }
    };

    const handleWeightChange = (name, value) => {
        const numValue = parseInt(value) || 0;
        setSettings({ ...settings, [name]: numValue });
    };

    const handleToggle = () => {
        setSettings({ ...settings, autoAllocationEnabled: !settings.autoAllocationEnabled });
    };

    const saveSettings = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        // Validate weights sum to 100
        const total = settings.yearWeight + settings.cgpaWeight + settings.distanceWeight;
        if (total !== 100) {
            setError(`Total weight must be 100%. Current total: ${total}%`);
            setSaving(false);
            return;
        }

        try {
            await api.put('/admin/settings', settings);
            setSuccess('Allocation rules updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-red-500"></div></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                        <SettingsIcon size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Allocation Rules</h1>
                        <p className="text-gray-500 text-sm">Configure weighted priorities for automatic hostel room allocation.</p>
                    </div>
                </div>
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-red-100 active:scale-95 disabled:opacity-50"
                >
                    {saving ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <Save size={20} />}
                    {saving ? 'Saving...' : 'Save Rules'}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl border border-green-100 flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 size={18} />
                    {success}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Weight Configuration */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Sliders className="text-red-500" size={20} />
                            <h2 className="text-xl font-black text-gray-900">Priority Weights</h2>
                        </div>

                        {/* Year Weight */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">Academic Year Weight</label>
                                <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black text-sm">{settings.yearWeight}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={settings.yearWeight}
                                onChange={(e) => handleWeightChange('yearWeight', e.target.value)}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-red-600"
                            />
                            <p className="text-xs text-gray-400">Higher weights prioritize students in senior years (4th &gt; 3rd &gt; 2nd &gt; 1st).</p>
                        </div>

                        {/* CGPA Weight */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">CGPA Performance Weight</label>
                                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black text-sm">{settings.cgpaWeight}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={settings.cgpaWeight}
                                onChange={(e) => handleWeightChange('cgpaWeight', e.target.value)}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <p className="text-xs text-gray-400">Higher weights prioritize students with exceptional academic performance.</p>
                        </div>

                        {/* Distance Weight */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">Home Distance Weight</label>
                                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg font-black text-sm">{settings.distanceWeight}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={settings.distanceWeight}
                                onChange={(e) => handleWeightChange('distanceWeight', e.target.value)}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                            />
                            <p className="text-xs text-gray-400">Higher weights prioritize students residing further from the campus.</p>
                        </div>

                        <div className={`p-4 rounded-2xl flex items-center justify-between border ${settings.yearWeight + settings.cgpaWeight + settings.distanceWeight === 100 ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
                            <div className="flex items-center gap-2">
                                <Info size={16} />
                                <span className="text-sm font-bold">Total Distribution</span>
                            </div>
                            <span className="text-lg font-black">{settings.yearWeight + settings.cgpaWeight + settings.distanceWeight}%</span>
                        </div>
                    </div>
                </div>

                {/* System Toggles */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <ShieldCheck className="text-red-500" size={20} />
                            <h2 className="text-xl font-black text-gray-900">System</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-3xl group">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Auto Allocation</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">Real-time processing</p>
                                </div>
                                <button
                                    onClick={handleToggle}
                                    className={`transition-colors duration-300 ${settings.autoAllocationEnabled ? 'text-red-600' : 'text-gray-300'}`}
                                >
                                    {settings.autoAllocationEnabled ? <ToggleRight size={44} /> : <ToggleLeft size={44} />}
                                </button>
                            </div>

                            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-3xl border-dashed">
                                <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                    When <span className="font-bold">Auto Allocation</span> is enabled, the system automatically assigns rooms as soon as applications are approved based on the weights.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <RefreshCcw size={18} className="text-red-500" /> Current Policy
                        </h3>
                        <div className="space-y-4 opacity-80">
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span>Batch Processing</span>
                                <span className="font-bold">Enabled</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b border-white/10 pb-3">
                                <span>Warden Override</span>
                                <span className="font-bold text-green-400">Always On</span>
                            </div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-4">
                                Version: 2.0.4-Stable
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllocationSettings;

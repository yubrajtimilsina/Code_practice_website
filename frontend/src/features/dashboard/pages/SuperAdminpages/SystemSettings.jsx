import { useState, useEffect } from "react";
import api from "../../../../utils/api.js";
import { Settings, Save, RefreshCw, AlertTriangle, ShieldCheck } from "lucide-react";

export default function SystemSettings() {
    const [settings, setSettings] = useState({
        siteName: "",
        maintenanceMode: false,
        allowRegistration: true,
        contestMode: false,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get("/super-admin/settings");
            setSettings(res.data);
        } catch (err) {
            console.error("Failed to fetch settings", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            setSaving(true);
            setMessage(null);
            await api.put("/super-admin/settings", settings);
            setMessage({ type: "success", text: "Settings updated successfully" });
        } catch (err) {
            setMessage({ type: "error", text: "Failed to update settings" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 bg-slate-100 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Settings className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
                    </div>
                    <button
                        onClick={handleUpdate}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                        {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
                        }`}>
                        {message.type === "success" ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {message.text}
                    </div>
                )}

                <div className="space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            General Configuration
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <h3 className="font-medium text-slate-900">Maintenance Mode</h3>
                                    <p className="text-sm text-slate-500">Temporarily disable access to all users except admins</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? "bg-red-600" : "bg-slate-300"
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? "translate-x-6" : "translate-x-1"
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <h3 className="font-medium text-slate-900">Allow New Registrations</h3>
                                    <p className="text-sm text-slate-500">Enable or disable new user account creation</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, allowRegistration: !settings.allowRegistration })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.allowRegistration ? "bg-blue-600" : "bg-slate-300"
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.allowRegistration ? "translate-x-6" : "translate-x-1"
                                        }`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <h3 className="font-medium text-slate-900">Contest Mode</h3>
                                    <p className="text-sm text-slate-500">Hides global leaderboard and discussions during contests</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, contestMode: !settings.contestMode })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.contestMode ? "bg-purple-600" : "bg-slate-300"
                                        }`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.contestMode ? "translate-x-6" : "translate-x-1"
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-800">
                            <strong>Caution:</strong> Changes to system settings are applied immediately across the entire platform.
                            Be careful when enabling Maintenance Mode or disabling registrations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

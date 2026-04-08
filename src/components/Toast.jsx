import React, { useEffect } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

const Toast = ({ message, isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration]);

    if (!isVisible) return null;

    return (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="bg-white rounded-2xl shadow-2xl border border-green-100 p-4 flex items-center gap-4 min-w-[320px] max-w-md">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="text-green-500" size={24} />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">
                        {message}
                    </p>
                </div>
                <button 
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                >
                    <X size={18} />
                </button>
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-full animate-progress" style={{ animationDuration: `${duration}ms` }}></div>
            </div>
            <style jsx>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-progress {
                    animation-name: progress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }
            `}</style>
        </div>
    );
};

export default Toast;

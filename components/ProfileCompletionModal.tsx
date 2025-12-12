import React from 'react';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    missingFields: string[];
}

const ProfileCompletionModal = ({ isOpen, onClose, missingFields }: ProfileCompletionModalProps) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-orange-50 p-6 flex flex-col items-center text-center border-b border-orange-100">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">Profilinizde Eksikler Var</h3>
                    <p className="text-slate-600 mt-2 text-sm">
                        Daha kolay görev alabilmek ve güvenilir bir profil oluşturmak için aşağıdaki bilgileri tamamlamanızı öneririz.
                    </p>
                </div>

                <div className="p-6">
                    <h4 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Eksik Bilgiler:</h4>
                    <ul className="space-y-3 mb-8">
                        {missingFields.map((field, index) => (
                            <li key={index} className="flex items-start text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="min-w-[20px] pt-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5"></div>
                                </div>
                                <span className="text-sm font-medium">{field}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                let targetTab = 'personal';
                                if (missingFields.includes("Telefon Numarası")) targetTab = 'personal';
                                else if (missingFields.includes("Tercih Edilen Adliyeler")) targetTab = 'courthouses';
                                else if (missingFields.includes("Uzmanlık Alanları")) targetTab = 'specialization';
                                navigate(`/settings?tab=${targetTab}`);
                            }}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition flex items-center justify-center"
                        >
                            Tamamla <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full bg-white hover:bg-slate-50 text-slate-500 py-3 rounded-xl font-medium transition"
                        >
                            Daha Sonra
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCompletionModal;

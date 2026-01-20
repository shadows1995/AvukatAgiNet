import React from 'react';
import { FileText } from 'lucide-react';
import SEO from '../components/SEO';

const DistanceSalesAgreementPage = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <SEO
                title="Mesafeli Satış Sözleşmesi - AvukatAğı"
                description="AvukatAğı Mesafeli Satış Sözleşmesi ve Ön Bilgilendirme Formu."
            />
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary-100 rounded-xl">
                        <FileText className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">MESAFELİ SATIŞ SÖZLEŞMESİ</h1>
                </div>

                <div className="prose prose-slate max-w-none text-center py-12">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Bu Hizmet Tamamen Ücretsizdir</h2>
                        <p className="text-green-700 text-lg">
                            AvukatAgi.net şu anda tüm avukatlar için tamamen ücretsiz hizmet vermektedir.
                        </p>
                        <p className="text-green-600 mt-2">
                            Bu nedenle Mesafeli Satış Sözleşmesi hükümleri şu an için uygulama alanı bulmamaktadır.
                            Hiçbir ücret ödemeden sistemin tüm özelliklerini kullanabilirsiniz.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DistanceSalesAgreementPage;

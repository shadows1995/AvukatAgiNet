import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Sparkles, MapPin, Star, Phone, Mail, Lock, CheckCircle, FileText, X } from 'lucide-react';
import { User } from '../types';
import { supabase } from '../supabaseClient';

const ProfilePage = ({ currentUser }: { currentUser: User }) => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [canViewContact, setCanViewContact] = useState(false);
  const [showAuthInfo, setShowAuthInfo] = useState(false);

  useEffect(() => {
    // ... existing useEffect ...
    // (I will skip re-writing the whole useEffect, just targeting the imports and top of component)
    // ACTUALLY, replace_file_content requires me to target specific lines. 
    // I'll split this into chunks.


    useEffect(() => {
      const fetchProfileData = async () => {
        if (!userId) return;
        setLoading(true);
        try {
          // 1. Fetch User Profile
          const { data: userData, error } = await supabase.from('users').select('*').eq('uid', userId).single();

          if (userData) {
            const mappedUser: User = {
              uid: userData.uid,
              email: userData.email,
              fullName: userData.full_name,
              baroNumber: userData.baro_number,
              baroCity: userData.baro_city,
              phone: userData.phone,
              specializations: userData.specializations,
              city: userData.city,
              preferredCourthouses: userData.preferred_courthouses,
              isPremium: userData.is_premium,
              membershipType: userData.membership_type,
              premiumUntil: userData.premium_until,
              premiumSince: userData.premium_since,
              premiumPlan: userData.premium_plan,
              premiumPrice: userData.premium_price,
              role: userData.role,
              rating: userData.rating,
              completedJobs: userData.completed_jobs,
              avatarUrl: userData.avatar_url,
              createdAt: userData.created_at,
              updatedAt: userData.updated_at,
              jobStatus: userData.job_status,
              aboutMe: userData.about_me,
              title: userData.title,
              address: userData.address
            };
            setProfileUser(mappedUser);
          }

          // 2. Check Relationship (for contact info visibility)
          // Case A: I am owner, looking at applicant
          const { data: jobs1 } = await supabase.from('jobs')
            .select('*')
            .eq('created_by', currentUser.uid)
            .eq('selected_applicant', userId)
            .in('status', ['in_progress', 'completed']);

          // Case B: I am applicant, looking at owner
          const { data: jobs2 } = await supabase.from('jobs')
            .select('*')
            .eq('created_by', userId)
            .eq('selected_applicant', currentUser.uid)
            .in('status', ['in_progress', 'completed']);

          if ((jobs1 && jobs1.length > 0) || (jobs2 && jobs2.length > 0) || currentUser.uid === userId) {
            setCanViewContact(true);
          } else {
            setCanViewContact(false);
          }

        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
    }, [userId, currentUser]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary-600" /></div>;
    if (!profileUser) return <div className="text-center p-20 text-slate-500">Kullanıcı bulunamadı.</div>;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
          <div className="px-8 pb-8 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-10 mb-6">
              <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg relative z-10">
                {(canViewContact || currentUser.uid === profileUser.uid) && profileUser.avatarUrl ? (
                  <img src={profileUser.avatarUrl} alt={profileUser.fullName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold">
                    {(canViewContact || currentUser.uid === profileUser.uid) ? profileUser.fullName.charAt(0) : <Lock className="w-8 h-8 opacity-50" />}
                  </div>
                )}
              </div>
              <div className="md:ml-6 mt-4 md:mt-0 flex-1">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                  {(canViewContact || currentUser.uid === profileUser.uid) ? (
                    <>
                      {profileUser.title || 'Av.'} {profileUser.fullName}
                      {profileUser.isPremium && <Sparkles className="w-5 h-5 text-amber-500 ml-2 fill-current" />}
                    </>
                  ) : (
                    <span className="flex items-center">
                      Av. {profileUser.fullName.split(' ').map(n => n[0] + '***').join(' ')}
                      <Lock className="w-4 h-4 text-slate-400 ml-2" />
                    </span>
                  )}
                </h1>
                <p className="text-slate-500 flex items-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" /> {profileUser.city} • {profileUser.baroCity} Barosu
                  {(canViewContact || currentUser.uid === profileUser.uid) && ` (${profileUser.baroNumber})`}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end space-y-2">
                <div className="flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
                  <Star className="w-5 h-5 text-amber-500 fill-current mr-2" />
                  <span className="text-lg font-bold text-amber-700">{profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'}</span>
                  <span className="text-sm text-amber-600 ml-1">/ 5.0</span>
                </div>

                {currentUser.uid === profileUser.uid ? (
                  <a href="/settings" className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium shadow-sm hover:bg-primary-700 transition flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Profili Düzenle
                  </a>
                ) : canViewContact ? (
                  <button
                    onClick={() => setShowAuthInfo(true)}
                    className="mt-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium shadow-sm hover:bg-slate-200 transition flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Yetki Belgesi Bilgileri
                  </button>
                ) : null}
              </div>
            </div>

            {/* Authorization Info Modal */}
            {showAuthInfo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-primary-600" />
                      Yetki Belgesi Bilgileri
                    </h3>
                    <button onClick={() => setShowAuthInfo(false)} className="text-slate-400 hover:text-slate-600 bg-white rounded-full p-1 border border-slate-200 hover:bg-slate-50 transition">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baro</label>
                      <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {profileUser.baroCity ? `${profileUser.baroCity} Barosu` : 'Belirtilmemiş'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Baro Sicil No</label>
                      <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {profileUser.baroNumber || 'Belirtilmemiş'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ofis Adresi</label>
                      <p className="text-slate-800 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {profileUser.address || 'Belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setShowAuthInfo(false)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {(canViewContact || currentUser.uid === profileUser.uid) ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">Hakkında</h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {profileUser.aboutMe || "Bu kullanıcı henüz kendini tanıtan bir yazı eklememiş."}
                  </p>
                </div>

                {/* Specializations */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-3">Uzmanlık Alanları</h3>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.specializations && profileUser.specializations.length > 0 ? (
                      profileUser.specializations.map(spec => (
                        <span key={spec} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                          {spec}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-sm">Belirtilmemiş</span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center">
                <Lock className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">Profil Kısıtlı</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Bu kullanıcının detaylı profil bilgilerini görüntülemek için, kendisiyle onaylanmış bir göreviniz bulunmalıdır.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Yearly Job Stats (Premium Tracking) - Only visible to owner */}
        {currentUser.uid === profileUser.uid && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary-600 fill-current" /> Yıllık Tamamlanan Görevler
              </h3>
              {profileUser.membershipType === 'premium_plus' && (
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                  Premium Plus
                </span>
              )}
            </div>
            <div className="p-6">
              <YearlyStats userId={userId!} />
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Star className="w-5 h-5 mr-2 text-amber-500 fill-current" /> Değerlendirmeler
            </h3>
            <span className="text-sm text-slate-500">
              {profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'} / 5.0
            </span>
          </div>
          <div className="p-6">
            <ReviewsList userId={userId!} />
          </div>
        </div>

        {/* Contact Information - Conditional Visibility */}
        {(canViewContact || currentUser.uid === profileUser.uid) && (
          <div className={`rounded-2xl shadow-sm border overflow-hidden ${canViewContact ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-primary-600" /> İletişim Bilgileri
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Telefon</p>
                    {profileUser.phone ? (
                      currentUser.uid === profileUser.uid ? (
                        <p className="text-lg font-bold text-slate-800 mt-1">{profileUser.phone}</p>
                      ) : (
                        <a
                          href={`https://wa.me/90${profileUser.phone.replace(/\s+/g, '').replace(/^0/, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center mt-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          WhatsApp ile İletişime Geç ({profileUser.phone})
                        </a>
                      )
                    ) : (
                      <p className="text-sm text-slate-500 mt-1">Belirtilmemiş</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">E-Posta</p>
                    <p className="text-lg font-bold text-slate-800">{profileUser.email}</p>
                  </div>
                </div>
                {profileUser.address && (
                  <div className="md:col-span-2 flex items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                      <MapPin className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">Ofis Adresi</p>
                      <p className="text-lg font-bold text-slate-800">{profileUser.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Sub-component for listing reviews to keep code clean
  const ReviewsList = ({ userId }: { userId: string }) => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchReviews = async () => {
        try {
          // Fetch ratings for this user
          const { data: ratingsData, error } = await supabase
            .from('ratings')
            .select('*')
            .eq('reviewee_id', userId)
            .order('created_at', { ascending: false });

          if (error) throw error;

          if (ratingsData) {
            // Fetch reviewer details for each rating
            const reviewsWithDetails = await Promise.all(ratingsData.map(async (rating) => {
              const { data: reviewerData } = await supabase
                .from('users')
                .select('full_name, avatar_url')
                .eq('uid', rating.reviewer_id)
                .single();

              return {
                ...rating,
                reviewer: reviewerData || { full_name: 'Bilinmeyen Kullanıcı', avatar_url: null }
              };
            }));
            setReviews(reviewsWithDetails);
          }
        } catch (err) {
          console.error("Error fetching reviews:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchReviews();
    }, [userId]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>;

    if (reviews.length === 0) {
      return (
        <div className="text-center py-8">
          <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-slate-300" />
          </div>
          <p className="text-slate-500 text-sm">Henüz değerlendirme yapılmamış.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="flex space-x-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
            <div className="flex-shrink-0">
              {review.reviewer.avatar_url ? (
                <img src={review.reviewer.avatar_url} alt={review.reviewer.full_name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                  {review.reviewer.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{review.reviewer.full_name}</h4>
                  <div className="flex items-center mt-1 space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${star <= review.rating ? 'text-amber-400 fill-current' : 'text-slate-200'}`}
                      />
                    ))}
                    <span className="text-xs text-slate-400 ml-2">
                      {new Date(review.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>
              {review.review_text && (
                <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">
                  {review.review_text}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };


  const YearlyStats = ({ userId }: { userId: string }) => {
    const [stats, setStats] = useState<{ year: number; count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStats = async () => {
        try {
          const { data: jobs, error } = await supabase
            .from('jobs')
            .select('completed_at')
            .eq('selected_applicant', userId)
            .eq('status', 'completed');

          if (error) throw error;

          if (jobs) {
            const yearMap = new Map<number, number>();
            jobs.forEach(job => {
              if (job.completed_at) {
                const year = new Date(job.completed_at).getFullYear();
                yearMap.set(year, (yearMap.get(year) || 0) + 1);
              }
            });

            // Sort by year descending
            const sortedStats = Array.from(yearMap.entries())
              .map(([year, count]) => ({ year, count }))
              .sort((a, b) => b.year - a.year);

            // If current year is missing, add it with 0
            const currentYear = new Date().getFullYear();
            if (!yearMap.has(currentYear)) {
              sortedStats.unshift({ year: currentYear, count: 0 });
            }

            setStats(sortedStats);
          }
        } catch (err) {
          console.error("Error fetching yearly stats:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchStats();
    }, [userId]);

    if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-slate-300 w-6 h-6" /></div>;

    const currentYear = new Date().getFullYear();
    const currentStats = stats.find(s => s.year === currentYear) || { year: currentYear, count: 0 };
    const target = 3;
    const progress = Math.min((currentStats.count / target) * 100, 100);

    return (
      <div className="space-y-6">
        {/* Current Year Progress */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">{currentYear} HEDEFİ</span>
              <div className="text-2xl font-bold text-slate-800 mt-1">
                {currentStats.count} <span className="text-slate-400 text-lg font-medium">/ {target} Görev</span>
              </div>
            </div>
            {currentStats.count >= target ? (
              <div className="flex items-center text-green-600 font-bold bg-green-100 px-3 py-1 rounded-lg">
                <CheckCircle className="w-5 h-5 mr-1" /> Hedef Tamamlandı
              </div>
            ) : (
              <div className="text-slate-400 text-sm font-medium">
                Kalan: {target - currentStats.count}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-out rounded-full ${currentStats.count >= target ? 'bg-green-500' : 'bg-primary-500'}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <p className="text-xs text-slate-500 mt-3 leading-relaxed">
            Premium Plus kapsamında, üyeliğinizin bir sonraki yıl ücretsiz uzatılması için yılda en az 3 görev tamamlamanız gerekmektedir.
          </p>
        </div>

        {/* Past Years Table */}
        {stats.length > 1 && (
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Yıl</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tamamlanan Görev</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Durum</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {stats.filter(s => s.year !== currentYear).map((stat) => (
                  <tr key={stat.year}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{stat.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{stat.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {stat.count >= 3 ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hedef Tutuldu
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 text-slate-800">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Sparkles, MapPin, Star, Phone, Mail, Lock } from 'lucide-react';
import { User } from '../types';
import { db } from '../firebaseConfig';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';

const ProfilePage = ({ currentUser }: { currentUser: User }) => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [canViewContact, setCanViewContact] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        // 1. Fetch User Profile
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfileUser({ uid: docSnap.id, ...docSnap.data() } as User);
        }

        // 2. Check Relationship (for contact info visibility)
        // Logic: Can view if (Current User is Owner AND Profile User is Selected Applicant) OR (Current User is Selected Applicant AND Profile User is Owner)
        // We check 'jobs' collection.
        
        // Case A: I am owner, looking at applicant
        const q1 = query(
          collection(db, "jobs"), 
          where("createdBy", "==", currentUser.uid),
          where("selectedApplicant", "==", userId),
          where("status", "in", ["in_progress", "completed"])
        );

        // Case B: I am applicant, looking at owner
        const q2 = query(
           collection(db, "jobs"),
           where("createdBy", "==", userId),
           where("selectedApplicant", "==", currentUser.uid),
           where("status", "in", ["in_progress", "completed"])
        );

        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        
        if (!snap1.empty || !snap2.empty || currentUser.uid === userId) {
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

  if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-8 h-8 text-primary-600"/></div>;
  if (!profileUser) return <div className="text-center p-20 text-slate-500">Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-secondary-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold">
                {profileUser.fullName.charAt(0)}
              </div>
            </div>
            <div className="md:ml-6 mt-4 md:mt-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 flex items-center">
                {profileUser.title || 'Av.'} {profileUser.fullName}
                {profileUser.isPremium && <Sparkles className="w-5 h-5 text-amber-500 ml-2 fill-current" />}
              </h1>
              <p className="text-slate-500 flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1" /> {profileUser.city} • {profileUser.baroCity} Barosu ({profileUser.baroNumber})
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center bg-amber-50 px-4 py-2 rounded-lg border border-amber-100">
               <Star className="w-5 h-5 text-amber-500 fill-current mr-2" />
               <span className="text-lg font-bold text-amber-700">{profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'}</span>
               <span className="text-sm text-amber-600 ml-1">/ 5.0</span>
            </div>
          </div>

          {/* About Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Hakkında</h3>
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
        </div>
      </div>

      {/* Contact Information - Conditional Visibility */}
      <div className={`rounded-2xl shadow-sm border overflow-hidden ${canViewContact ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
         <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-primary-600" /> İletişim Bilgileri
            </h3>
         </div>
         <div className="p-6">
            {canViewContact ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm mr-4">
                       <Phone className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                       <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Telefon</p>
                       <p className="text-lg font-bold text-slate-800">{profileUser.phone || 'Belirtilmemiş'}</p>
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
              </div>
            ) : (
              <div className="text-center py-8">
                 <Lock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                 <h4 className="text-slate-800 font-medium mb-1">İletişim Bilgileri Gizli</h4>
                 <p className="text-sm text-slate-500 max-w-md mx-auto">
                   Telefon ve E-posta bilgilerini görüntüleyebilmek için bu kullanıcı ile aranızda 
                   onaylanmış bir görev (İşveren veya Çalışan olarak) bulunmalıdır.
                 </p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search, Filter, Eye, MoreVertical,
    User, Shield, Ban, CheckCircle
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';

interface User {
    uid: string;
    fullName: string;
    email: string;
    role: string;
    accountStatus: string;
    createdAt: any;
}

const AdminUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        role: '',
        accountStatus: '',
        searchQuery: '',
        page: 1,
        limit: 20
    });
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchUsers();
    }, [filters]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getUsers(filters);
            setUsers(data.users);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getRoleBadge = (role: string) => {
        const styles = {
            admin: 'bg-red-100 text-red-800',
            premium_plus: 'bg-purple-100 text-purple-800',
            premium: 'bg-amber-100 text-amber-800',
            free: 'bg-gray-100 text-gray-800'
        };
        return styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arama</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="İsim veya email..."
                            className="w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={filters.searchQuery}
                            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value, page: 1 })}
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
                    >
                        <option value="">Tümü</option>
                        <option value="free">Ücretsiz</option>
                        <option value="premium">Premium</option>
                        <option value="premium_plus">Premium +</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="w-48">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                    <select
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={filters.accountStatus}
                        onChange={(e) => setFilters({ ...filters, accountStatus: e.target.value, page: 1 })}
                    >
                        <option value="">Tümü</option>
                        <option value="active">Aktif</option>
                        <option value="banned">Banlı</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kayıt Tarihi</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Yükleniyor...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Kullanıcı bulunamadı</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.uid} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.accountStatus === 'banned' ? (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                    Banlı
                                                </span>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Aktif
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {(() => {
                                                if (!user.createdAt) return '-';
                                                const seconds = user.createdAt.seconds || user.createdAt._seconds;
                                                if (seconds) return new Date(seconds * 1000).toLocaleDateString('tr-TR');
                                                return new Date(user.createdAt).toLocaleDateString('tr-TR');
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => navigate(`/admin/users/${user.uid}`)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Simplified) */}
                <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                    <div className="flex-1 flex justify-between">
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.max(1, filters.page - 1) })}
                            disabled={filters.page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Önceki
                        </button>
                        <span className="text-sm text-gray-700 self-center">
                            Sayfa {filters.page} / {totalPages}
                        </span>
                        <button
                            onClick={() => setFilters({ ...filters, page: Math.min(totalPages, filters.page + 1) })}
                            disabled={filters.page === totalPages}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                            Sonraki
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

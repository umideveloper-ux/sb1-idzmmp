import React from 'react';
import { School, LicenseClass } from '../types';
import Chat from './Chat';
import { LogOut, Car, Users, TrendingUp, MessageSquare, Settings } from 'lucide-react';

interface DashboardProps {
  school: School;
  onLogout: () => void;
  schools: School[];
  updateCandidates: (schoolId: string, updatedCandidates: School['candidates']) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ school, onLogout, schools, updateCandidates }) => {
  console.log('Dashboard props:', { school, schools });

  if (!school) {
    return <div>Yükleniyor...</div>;
  }

  const handleCandidateChange = (licenseClass: LicenseClass, change: number) => {
    const updatedCandidates = {
      ...school.candidates,
      [licenseClass]: Math.max(0, school.candidates[licenseClass] + change)
    };
    updateCandidates(school.id, updatedCandidates);
  };

  const totalCandidates = Object.values(school.candidates).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Car className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">{school.name}</span>
              <span className="ml-2 text-sm text-gray-500">(ID: {school.id})</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </nav>

      {/* ... (diğer dashboard içeriği) ... */}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600">
            <h3 className="text-lg leading-6 font-medium text-white">Tüm Kursların Aday Sayıları</h3>
          </div>
          <div className="bg-white overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kurs Adı</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">B</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A1</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">A2</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">C</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schools.map((s) => {
                  const total = Object.values(s.candidates).reduce((sum, count) => sum + count, 0);
                  return (
                    <tr key={s.id} className={`hover:bg-gray-50 ${s.id === school.id ? 'bg-indigo-50' : ''}`}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.id}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{s.name}</div>
                            <div className="text-sm text-gray-500">{s.email}</div>
                          </div>
                        </div>
                      </td>
                      {(['B', 'A1', 'A2', 'C', 'D'] as LicenseClass[]).map((licenseClass) => (
                        <td key={licenseClass} className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {s.candidates[licenseClass]}
                        </td>
                      ))}
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                        {total}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Chat currentSchool={school} schools={schools} />
      </div>
    </div>
  );
};

export default Dashboard;
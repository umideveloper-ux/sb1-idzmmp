import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { School } from './types';
import { updateCandidates, listenToSchoolsData } from './firebase';

const App: React.FC = () => {
  const [loggedInSchool, setLoggedInSchool] = useState<School | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App component mounted');
    console.log('Setting up listener for schools data');
    const unsubscribe = listenToSchoolsData((updatedSchools) => {
      console.log('Schools updated:', updatedSchools);
      setSchools(updatedSchools);
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up listener for schools data');
      unsubscribe();
    };
  }, []);

  const handleLogin = (school: School) => {
    console.log('Logging in school:', school);
    setLoggedInSchool(school);
  };

  const handleLogout = () => {
    console.log('Logging out');
    setLoggedInSchool(null);
  };

  const handleUpdateCandidates = (schoolId: string, updatedCandidates: School['candidates']) => {
    console.log('Updating candidates:', schoolId, updatedCandidates);
    updateCandidates(schoolId, updatedCandidates);
    
    setSchools(prevSchools => 
      prevSchools.map(school => 
        school.id === schoolId ? { ...school, candidates: updatedCandidates } : school
      )
    );
    
    if (loggedInSchool && loggedInSchool.id === schoolId) {
      setLoggedInSchool(prevSchool => ({ ...prevSchool!, candidates: updatedCandidates }));
    }
  };

  console.log('App render - loggedInSchool:', loggedInSchool, 'schools:', schools, 'isLoading:', isLoading);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="App">
      {loggedInSchool ? (
        <Dashboard
          school={loggedInSchool}
          onLogout={handleLogout}
          schools={schools}
          updateCandidates={handleUpdateCandidates}
        />
      ) : (
        <Login schools={schools} onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
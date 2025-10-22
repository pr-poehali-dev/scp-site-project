import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { SCPHeader } from '@/components/SCPHeader';
import { ApplicationForm } from '@/components/ApplicationForm';
import { ApplicationStatus } from '@/components/ApplicationStatus';
import { PersonnelSection } from '@/components/PersonnelSection';
import { SCPGrid } from '@/components/SCPGrid';
import { scpDatabase } from '@/data/scpDatabase';

interface Application {
  id: number;
  full_name: string;
  age: number;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

const Index = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [hasSubmittedApplication, setHasSubmittedApplication] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('');
  const [isPersonnelAuthorized, setIsPersonnelAuthorized] = useState(false);
  const [personnelPassword, setPersonnelPassword] = useState('');
  const [personnelPasswordError, setPersonnelPasswordError] = useState(false);
  const [timeUntilResubmit, setTimeUntilResubmit] = useState<string>('');
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const submitted = localStorage.getItem('scp_application_submitted');
    const status = localStorage.getItem('scp_application_status');
    const timestamp = localStorage.getItem('scp_application_timestamp');
    
    if (submitted === 'true' && timestamp) {
      const submittedTime = parseInt(timestamp);
      const currentTime = Date.now();
      const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
      
      if (currentTime - submittedTime >= twoDaysInMs && status === 'rejected') {
        localStorage.removeItem('scp_application_submitted');
        localStorage.removeItem('scp_application_status');
        localStorage.removeItem('scp_application_timestamp');
        localStorage.removeItem('scp_application_email');
        setHasSubmittedApplication(false);
        setApplicationStatus('');
      } else {
        setHasSubmittedApplication(true);
        if (status) {
          setApplicationStatus(status);
        }
        
        if (status === 'rejected') {
          const timeLeft = twoDaysInMs - (currentTime - submittedTime);
          const hours = Math.floor(timeLeft / (60 * 60 * 1000));
          const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
          setTimeUntilResubmit(`${hours}ч ${minutes}м`);
          
          const interval = setInterval(() => {
            const now = Date.now();
            const left = twoDaysInMs - (now - submittedTime);
            if (left <= 0) {
              localStorage.removeItem('scp_application_submitted');
              localStorage.removeItem('scp_application_status');
              localStorage.removeItem('scp_application_timestamp');
              localStorage.removeItem('scp_application_email');
              setHasSubmittedApplication(false);
              setApplicationStatus('');
              clearInterval(interval);
            } else {
              const h = Math.floor(left / (60 * 60 * 1000));
              const m = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000));
              setTimeUntilResubmit(`${h}ч ${m}м`);
            }
          }, 60000);
          
          return () => clearInterval(interval);
        }
      }
    }
  }, []);

  useEffect(() => {
    const checkApplicationStatus = async () => {
      const email = localStorage.getItem('scp_application_email');
      if (email && hasSubmittedApplication) {
        try {
          const response = await fetch(`https://functions.poehali.dev/921b7740-88ac-47cd-9ee4-772236e3de28?email=${encodeURIComponent(email)}`);
          const data = await response.json();
          if (data.application && data.application.status !== 'pending') {
            setApplicationStatus(data.application.status);
            localStorage.setItem('scp_application_status', data.application.status);
            
            if (data.application.status === 'rejected') {
              const timestamp = localStorage.getItem('scp_application_timestamp');
              if (timestamp) {
                const submittedTime = parseInt(timestamp);
                const currentTime = Date.now();
                const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
                
                if (currentTime - submittedTime >= twoDaysInMs) {
                  localStorage.removeItem('scp_application_submitted');
                  localStorage.removeItem('scp_application_status');
                  localStorage.removeItem('scp_application_timestamp');
                  localStorage.removeItem('scp_application_email');
                  setHasSubmittedApplication(false);
                  setApplicationStatus('');
                }
              }
            }
          }
        } catch (error) {
          console.error('Ошибка проверки статуса:', error);
        }
      }
    };

    if (hasSubmittedApplication && applicationStatus !== 'approved') {
      checkApplicationStatus();
      const interval = setInterval(checkApplicationStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [hasSubmittedApplication, applicationStatus]);

  useEffect(() => {
    if (isPersonnelAuthorized) {
      loadApplications();
      const interval = setInterval(loadApplications, 10000);
      return () => clearInterval(interval);
    }
  }, [isPersonnelAuthorized]);

  const loadApplications = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/921b7740-88ac-47cd-9ee4-772236e3de28');
      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    }
  };

  const handleApplicationSubmit = async (formData: { fullName: string; age: string; email: string; message: string }) => {
    if (!formData.fullName || !formData.age) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/921b7740-88ac-47cd-9ee4-772236e3de28', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit',
          full_name: formData.fullName,
          age: parseInt(formData.age),
          email: formData.email,
          message: formData.message
        })
      });
      
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('scp_application_submitted', 'true');
        localStorage.setItem('scp_application_email', formData.email);
        localStorage.setItem('scp_application_timestamp', Date.now().toString());
        localStorage.setItem('scp_application_status', 'pending');
        setHasSubmittedApplication(true);
        setApplicationStatus('pending');
        alert('Заявка успешно отправлена! Ожидайте рассмотрения.');
        setShowApplicationForm(false);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      alert('Ошибка отправки заявки');
    }
  };

  const handlePersonnelPasswordSubmit = () => {
    if (personnelPassword === '5535') {
      setIsPersonnelAuthorized(true);
      setPersonnelPasswordError(false);
      setPersonnelPassword('');
    } else {
      setPersonnelPasswordError(true);
    }
  };

  const updateApplicationStatus = async (id: number, status: string) => {
    try {
      await fetch('https://functions.poehali.dev/921b7740-88ac-47cd-9ee4-772236e3de28', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', id, status })
      });
      loadApplications();
    } catch (error) {
      alert('Ошибка обновления статуса');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <SCPHeader />

        {!hasSubmittedApplication ? (
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowApplicationForm(true)}
              className="px-8 py-3 bg-destructive border-2 border-destructive text-white font-bold hover:bg-destructive/80 transition-colors animate-pulse"
            >
              <div className="flex items-center gap-2">
                <Icon name="FileText" size={20} />
                ПОДАТЬ ЗАЯВКУ НА ВСТУПЛЕНИЕ
              </div>
            </button>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <ApplicationStatus status={applicationStatus} timeUntilResubmit={timeUntilResubmit} />
          </div>
        )}

        {showApplicationForm && (
          <ApplicationForm
            onClose={() => setShowApplicationForm(false)}
            onSubmit={handleApplicationSubmit}
          />
        )}

        <PersonnelSection
          isAuthorized={isPersonnelAuthorized}
          password={personnelPassword}
          passwordError={personnelPasswordError}
          applications={applications}
          onPasswordChange={setPersonnelPassword}
          onAuthorize={handlePersonnelPasswordSubmit}
          onUpdateStatus={updateApplicationStatus}
        />

        <SCPGrid scpObjects={scpDatabase} isPersonnelAuthorized={isPersonnelAuthorized} />
      </div>
    </div>
  );
};

export default Index;

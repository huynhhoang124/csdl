import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { GradesPage } from '@/pages/student/GradesPage';
import { RegisterPage } from '@/pages/student/RegisterPage';
import { TeacherDashboard } from '@/pages/teacher/TeacherDashboard';
import { TeacherClassesPage } from '@/pages/teacher/ClassesPage';
import { ScholarshipsPage } from '@/pages/student/ScholarshipsPage';
import { ResearchPage } from '@/pages/student/ResearchPage';
import { ThesisPage } from '@/pages/student/ThesisPage';
import { OverseasPage } from '@/pages/student/OverseasPage';
import { EventsPage } from '@/pages/student/EventsPage';
import { DevDashboard } from '@/pages/dev/DevDashboard';
import { TablesPage } from '@/pages/dev/TablesPage';
import { ImpersonatePage } from '@/pages/dev/ImpersonatePage';
import { PlaygroundPage } from '@/pages/dev/PlaygroundPage';
import { ERDiagramPage } from '@/pages/dev/ERDiagramPage';
import { TestRunnerPage } from '@/pages/dev/TestRunnerPage';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-display">{title}</h2>
        <p className="text-slate-500">Đang phát triển ở Sprint tiếp theo</p>
      </div>
    </div>
  );
}

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const applyTheme = useThemeStore((s) => s.apply);
  useEffect(() => { hydrate(); applyTheme(); }, [hydrate, applyTheme]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/student" element={<LoginPage role="student" />} />
      <Route path="/login/teacher" element={<LoginPage role="teacher" />} />
      <Route path="/login/dev" element={<LoginPage role="dev" />} />

      <Route path="/student" element={<ProtectedRoute role="student"><AppLayout /></ProtectedRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="scholarships" element={<ScholarshipsPage />} />
        <Route path="research" element={<ResearchPage />} />
        <Route path="thesis" element={<ThesisPage />} />
        <Route path="overseas" element={<OverseasPage />} />
        <Route path="events" element={<EventsPage />} />
      </Route>

      <Route path="/teacher" element={<ProtectedRoute role="teacher"><AppLayout /></ProtectedRoute>}>
        <Route index element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClassesPage />} />
        <Route path="grades" element={<TeacherClassesPage />} />
        <Route path="thesis" element={<ComingSoon title="Đồ án hướng dẫn" />} />
        <Route path="research" element={<ComingSoon title="Đề tài NCKH" />} />
      </Route>

      <Route path="/dev" element={<ProtectedRoute role="dev"><AppLayout /></ProtectedRoute>}>
        <Route index element={<DevDashboard />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="impersonate" element={<ImpersonatePage />} />
        <Route path="playground" element={<PlaygroundPage />} />
        <Route path="er-diagram" element={<ERDiagramPage />} />
        <Route path="test-runner" element={<TestRunnerPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/404" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

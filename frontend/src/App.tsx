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
import { TeacherThesisPage } from '@/pages/teacher/ThesisPage';
import { TeacherResearchPage } from '@/pages/teacher/ResearchPage';
import { ScholarshipsPage } from '@/pages/student/ScholarshipsPage';
import { ResearchPage } from '@/pages/student/ResearchPage';
import { ThesisPage } from '@/pages/student/ThesisPage';
import { OverseasPage } from '@/pages/student/OverseasPage';
import { EventsPage } from '@/pages/student/EventsPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminPersonalPage } from '@/pages/admin/PersonalPage';
import { AdminStudentsPage } from '@/pages/admin/StudentsPage';
import { AdminTeachersPage } from '@/pages/admin/TeachersPage';
import { AdminDepartmentsPage } from '@/pages/admin/DepartmentsPage';
import { AdminProgramsPage } from '@/pages/admin/ProgramsPage';
import { AdminCoursesPage } from '@/pages/admin/CoursesPage';
import { AdminClassesPage } from '@/pages/admin/ClassesPage';
import { AdminGradesPage } from '@/pages/admin/GradesPage';
import { AdminScholarshipsPage } from '@/pages/admin/ScholarshipsPage';
import { AdminTrainingProgramsPage } from '@/pages/admin/TrainingProgramsPage';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

export function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const applyTheme = useThemeStore((s) => s.apply);
  useEffect(() => { hydrate(); applyTheme(); }, [hydrate, applyTheme]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/student" element={<LoginPage role="student" />} />
      <Route path="/login/teacher" element={<LoginPage role="teacher" />} />
      <Route path="/login/admin" element={<LoginPage role="admin" />} />

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
        <Route path="thesis" element={<TeacherThesisPage />} />
        <Route path="research" element={<TeacherResearchPage />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute role="admin"><AppLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="personal" element={<AdminPersonalPage />} />
        <Route path="students" element={<AdminStudentsPage />} />
        <Route path="teachers" element={<AdminTeachersPage />} />
        <Route path="departments" element={<AdminDepartmentsPage />} />
        <Route path="programs" element={<AdminProgramsPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="classes" element={<AdminClassesPage />} />
        <Route path="grades" element={<AdminGradesPage />} />
        <Route path="scholarships" element={<AdminScholarshipsPage />} />
        <Route path="training-programs" element={<AdminTrainingProgramsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/404" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

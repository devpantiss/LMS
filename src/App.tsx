import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { useAppStore } from './store/useAppStore';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { Catalog } from './pages/student/Catalog';
import { CourseDetails, CoursePlayer } from './pages/student/CourseExperience';
import { AssignmentDetail, PracticalsRedirect } from './pages/student/Assignments';
import { Quiz } from './pages/student/Quiz';
import { Achievements, CalendarPage, Discussions, LearningPaths, Profile, SkillUniverse } from './pages/student/StudentMore';
import { CourseBuilder, Grading, Students, TeacherAnalytics, TeacherCourses, TeacherDashboard } from './pages/teacher/TeacherPages';
import { AdminAnalytics, AdminCourses, AdminDashboard, AdminGeneric, AdminUsers } from './pages/admin/AdminPages';
import { GenericPage } from './pages/GenericPage';
import { Login } from './pages/Login';
import { Button } from './components/ui';
import type { Role } from './types';

function RoleGate({ role }: { role: Role }) {
  const { role: current, isAuthenticated } = useAppStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return current === role ? <AppShell /> : <Navigate to={`/${current}`} replace />;
}

function NotFound() {
  return <div className="not-found"><span>404</span><h1>This path drifted out of orbit.</h1><p>The learning universe is vast, but this page doesn’t exist.</p><Button onClick={() => history.back()}>Go back</Button></div>;
}

export default function App() {
  const { role, isAuthenticated } = useAppStore();
  return <Routes>
    <Route path="/" element={<Navigate to={isAuthenticated ? `/${role}` : '/login'} replace />} />
    <Route path="/login" element={<Login />} />
    <Route element={<RoleGate role="student" />}>
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/student/learning" element={<Catalog />} />
      <Route path="/student/explore" element={<Navigate to="/student/learning" replace />} />
      <Route path="/student/courses/:courseId" element={<CourseDetails />} />
      <Route path="/student/courses/:courseId/learn/:lessonId" element={<CoursePlayer />} />
      <Route path="/student/assignments" element={<PracticalsRedirect />} />
      <Route path="/student/assignments/:id" element={<AssignmentDetail />} />
      <Route path="/student/quiz/:id" element={<Quiz />} />
      <Route path="/student/calendar" element={<CalendarPage />} />
      <Route path="/student/skills" element={<SkillUniverse />} />
      <Route path="/student/paths" element={<Navigate to="/student/learning" replace />} />
      <Route path="/student/discussions" element={<Discussions />} />
      <Route path="/student/achievements" element={<Achievements />} />
      <Route path="/student/certificates" element={<Achievements certificates />} />
      <Route path="/student/profile" element={<Profile />} />
    </Route>
    <Route element={<RoleGate role="teacher" />}>
      <Route path="/teacher" element={<TeacherDashboard />} />
      <Route path="/teacher/courses" element={<TeacherCourses />} />
      <Route path="/teacher/courses/new" element={<CourseBuilder />} />
      <Route path="/teacher/courses/:id/builder" element={<CourseBuilder />} />
      <Route path="/teacher/students" element={<Students />} />
      <Route path="/teacher/grading/:id" element={<Grading />} />
      {['assignments', 'quizzes', 'gradebook', 'discussions', 'calendar'].map(path => <Route key={path} path={`/teacher/${path}`} element={<GenericPage title={path[0].toUpperCase() + path.slice(1)} />} />)}
      <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
    </Route>
    <Route element={<RoleGate role="admin" />}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/courses" element={<AdminCourses />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      {(['instructors', 'enrollments', 'groups', 'learning-paths', 'skills', 'content', 'certificates', 'reports', 'announcements', 'audit-log', 'settings'] as const).map(path => <Route key={path} path={`/admin/${path}`} element={path === 'enrollments' ? <AdminUsers /> : <AdminGeneric kind={path === 'learning-paths' ? 'paths' : path === 'audit-log' ? 'audit' : path} />} />)}
    </Route>
    <Route path="*" element={<NotFound />} />
  </Routes>;
}

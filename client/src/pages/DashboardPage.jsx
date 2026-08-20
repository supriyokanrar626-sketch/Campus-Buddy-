import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  TODAYS_CLASSES,
  DEADLINES,
  MESS_MENU,
  NOTICES,
  getClassStatus,
  getCurrentMealPeriod,
  formatTimeRemaining,
  formatDate,
} from '../data/mockData';
import {
  CalendarDays,
  Clock,
  AlertTriangle,
  Utensils,
  Megaphone,
  MapPin,
  User,
  BookOpen,
  FlaskConical,
  Trophy,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Bell,
} from 'lucide-react';

const categoryIcons = {
  Exam: BookOpen,
  Event: Trophy,
  Placement: Briefcase,
  General: Bell,
};

export default function DashboardPage() {
  const { userProfile, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeMeal, setActiveMeal] = useState(getCurrentMealPeriod());
  const [, setTick] = useState(0);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Update countdown every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const displayName = userProfile?.displayName || 'Student';
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {greeting}, <span className="gradient-text">{displayName.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
          {userProfile?.rollNo && (
            <span className="badge badge-info ml-2">{userProfile.rollNo}</span>
          )}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">
        {/* ===== CARD 1: TODAY'S CLASSES ===== */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Today's Classes</h2>
                <p className="text-[0.65rem] text-slate-500">
                  {TODAYS_CLASSES.length} classes scheduled
                </p>
              </div>
            </div>
            <span className="badge badge-info">{userProfile?.department?.split(' ')[0] || 'CSE'}</span>
          </div>

          {loading ? (
            <SkeletonLoader type="list" />
          ) : (
            <div className="space-y-2">
              {TODAYS_CLASSES.map((cls) => {
                const status = getClassStatus(cls);
                return (
                  <div
                    key={cls.id}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      status === 'ongoing'
                        ? 'bg-gradient-to-r from-primary/10 to-transparent border border-primary/20'
                        : status === 'completed'
                        ? 'opacity-50'
                        : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div
                      className="w-1 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: cls.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{cls.subject}</p>
                      <div className="flex items-center gap-3 text-[0.65rem] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {cls.room}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {status === 'ongoing' && (
                        <span className="badge badge-success text-[0.6rem]">● Live</span>
                      )}
                      {status === 'upcoming' && (
                        <span className="text-[0.65rem] text-slate-500">{cls.type}</span>
                      )}
                      {status === 'completed' && (
                        <span className="text-[0.65rem] text-slate-600">Done</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== CARD 2: DEADLINES ===== */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-danger/15 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-danger" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Upcoming Deadlines</h2>
                <p className="text-[0.65rem] text-slate-500">Don't miss these!</p>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="list" />
          ) : (
            <div className="space-y-3">
              {DEADLINES.map((dl) => {
                const urgencyBadge =
                  dl.urgency === 'high'
                    ? 'badge-danger'
                    : dl.urgency === 'medium'
                    ? 'badge-warning'
                    : 'badge-success';
                const timeLeft = formatTimeRemaining(dl.dueDate);
                return (
                  <div
                    key={dl.id}
                    className="p-3 rounded-xl glass-light hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-medium flex-1 pr-2">{dl.title}</h3>
                      <span className={`badge ${urgencyBadge} shrink-0`}>
                        {dl.urgency}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-slate-500 mb-2">{dl.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[0.65rem] text-slate-500">{dl.subject}</span>
                      <span
                        className={`text-xs font-semibold ${
                          dl.urgency === 'high' ? 'text-danger' : 'text-slate-400'
                        }`}
                      >
                        ⏱ {timeLeft}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== CARD 3: MESS MENU ===== */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-warning/15 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Mess Menu</h2>
                <p className="text-[0.65rem] text-slate-500">Today's meals</p>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="card" />
          ) : (
            <>
              {/* Meal Tabs */}
              <div className="flex gap-1 mb-4 p-1 rounded-xl bg-white/[0.03] border border-white/5">
                {Object.entries(MESS_MENU).map(([key, meal]) => (
                  <button
                    key={key}
                    onClick={() => setActiveMeal(key)}
                    className={`flex-1 text-center py-2 px-1 rounded-lg text-[0.65rem] font-medium transition-all ${
                      activeMeal === key
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/15 text-white border border-primary/20'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <span className="block text-base mb-0.5">{meal.icon}</span>
                    {meal.label}
                  </button>
                ))}
              </div>

              {/* Current Meal Items */}
              <div className="animate-fade-in">
                <p className="text-[0.65rem] text-slate-500 mb-2">
                  {MESS_MENU[activeMeal].time}
                </p>
                <div className="space-y-1.5">
                  {MESS_MENU[activeMeal].items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                      <span className="text-sm text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* ===== CARD 4: NOTICES ===== */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ opacity: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-semibold text-sm">Notices & Announcements</h2>
                <p className="text-[0.65rem] text-slate-500">{NOTICES.length} new updates</p>
              </div>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="list" />
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {NOTICES.map((notice) => {
                const Icon = categoryIcons[notice.category] || Bell;
                const priorityDot =
                  notice.priority === 'high'
                    ? 'bg-danger'
                    : notice.priority === 'medium'
                    ? 'bg-warning'
                    : 'bg-slate-500';
                return (
                  <div
                    key={notice.id}
                    className="p-3 rounded-xl glass-light hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityDot} shrink-0`} />
                          <h3 className="text-sm font-medium truncate">{notice.title}</h3>
                        </div>
                        <p className="text-[0.65rem] text-slate-500 line-clamp-2">{notice.body}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="badge badge-purple text-[0.55rem]">{notice.category}</span>
                          <span className="text-[0.6rem] text-slate-600">
                            {formatDate(notice.date)} · {notice.author}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

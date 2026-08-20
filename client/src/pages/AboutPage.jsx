import { useEffect, useRef, useState } from 'react';
import { CAMPUS_BUILDINGS, CAMPUS_CENTER, COLLEGE_INFO, FACULTY_AVAILABILITY } from '../data/mockData';
import {
  Clock,
  GraduationCap,
  Building2,
  BookOpen,
  User,
  MapPin,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export default function AboutPage() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [counters, setCounters] = useState(COLLEGE_INFO.stats.map(() => 0));

  // Get faculty for a specific building
  const getFacultyForBuilding = (buildingId) => {
    const buildingMap = {
      'bld-1': ['fac-1', 'fac-4'], // Main Academic Building
      'bld-2': [], // Library
      'bld-3': [], // Canteen
      'bld-4': ['fac-2'], // CSE Department & Labs
      'bld-5': ['fac-5'], // ECE Department & Labs
      'bld-6': [], // Auditorium
      'bld-7': [], // Boys Hostel
      'bld-8': [], // Sports Complex
    };
    const facultyIds = buildingMap[buildingId] || [];
    return FACULTY_AVAILABILITY.filter((f) => facultyIds.includes(f.id));
  };

  // Generate popup HTML for a building
  const getPopupHtml = (building) => {
    const faculty = getFacultyForBuilding(building.id);
    const facultyHtml = faculty.length > 0
      ? faculty.map((f) => `
        <div style="margin-bottom: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; border-left: 3px solid ${f.statusColor};">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="font-size: 16px;">${f.image}</span>
            <strong style="color: #e2e8f0; font-size: 13px;">${f.name}</strong>
            <span style="margin-left: auto; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; background: ${f.statusColor}22; color: ${f.statusColor}; border: 1px solid ${f.statusColor}44;">
              ${f.status}
            </span>
          </div>
          <div style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
            ${f.designation} • ${f.department}<br/>
            ${f.cabin}<br/>
            ${f.currentClass ? `📚 <strong>In Class:</strong> ${f.currentClass.subject} (${f.currentClass.time})` : '✅ Available for consultation'}<br/>
            ${f.nextAvailable ? `⏰ Next available: ${f.nextAvailable}` : ''}
          </div>
          <div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">
            <a href="mailto:${f.email}" style="font-size: 10px; color: #06b6d4; text-decoration: none;">📧 ${f.email}</a>
            <span style="font-size: 10px; color: #64748b;">📞 ${f.phone}</span>
          </div>
        </div>
      `).join('')
      : '<p style="font-size: 12px; color: #64748b; font-style: italic;">No faculty assigned to this building</p>';

    return `
      <div style="min-width: 280px; font-family: inherit;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
          <span style="font-size: 28px;">${building.emoji}</span>
          <div>
            <h3 style="margin: 0; color: #f1f5f9; font-size: 15px; font-weight: 600;">${building.name}</h3>
            <p style="margin: 2px 0 0; font-size: 11px; color: #94a3b8;">${building.shortName}</p>
          </div>
        </div>
        <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 10px; line-height: 1.5;">${building.description}</p>
        <div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; margin-bottom: 12px;">
          <span>🕒</span> <span>${building.hours}</span>
        </div>
        ${faculty.length > 0 ? `
          <div style="margin-bottom: 8px;">
            <h4 style="margin: 0 0 8px; font-size: 12px; font-weight: 600; color: #e2e8f0; display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 14px;">👨‍🏫</span> Faculty in this Building
            </h4>
            ${facultyHtml}
          </div>
        ` : ''}
        <div style="padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #64748b;">
          Category: ${building.category}
        </div>
      </div>
    `;
  };

  // Animate counters
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const counterInterval = setInterval(() => {
      step++;
      const progress = Math.min(step / steps, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounters(
        COLLEGE_INFO.stats.map((stat) => {
          const num = parseInt(stat.value);
          return Math.round(num * eased);
        })
      );

      if (step >= steps) clearInterval(counterInterval);
    }, interval);

    return () => {
      clearInterval(counterInterval);
    };
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let map;
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      const centerLatLng = [CAMPUS_CENTER[1], CAMPUS_CENTER[0]];

      map = L.map(mapContainerRef.current, {
        center: centerLatLng,
        zoom: 17,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      L.control.attribution({
        position: 'bottomright',
        prefix: '<a href="https://leafletjs.com" target="_blank">Leaflet</a> | &copy; OpenStreetMap &copy; CARTO'
      }).addTo(map);

      setMapLoaded(true);

      // Add building markers
      CAMPUS_BUILDINGS.forEach((building) => {
        const customIcon = L.divIcon({
          html: `<div class="campus-marker cursor-pointer" style="
            width: 40px; height: 40px; border-radius: 50%;
            background: ${building.color}22;
            border: 2px solid ${building.color};
            display: flex; align-items: center; justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 0 15px ${building.color}33;
          ">${building.emoji}</div>`,
          className: '',
          iconSize: [40, 40],
          iconAnchor: [20, 20],
          popupAnchor: [0, -20],
        });

        const popupHtml = getPopupHtml(building);

        const marker = L.marker([building.coordinates[1], building.coordinates[0]], { icon: customIcon })
          .bindPopup(popupHtml, {
            maxWidth: 320,
            className: 'custom-leaflet-popup'
          })
          .addTo(map);

        markersRef.current[building.id] = marker;
      });

      mapRef.current = map;
    });

    return () => {
      if (map) map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to building on sidebar click and open popup
  const handleBuildingClick = (building) => {
    setSelectedBuilding(building.id);
    if (mapRef.current) {
      mapRef.current.flyTo(
        [building.coordinates[1], building.coordinates[0]],
        19,
        { duration: 1.5 }
      );

      setTimeout(() => {
        const marker = markersRef.current[building.id];
        if (marker) {
          marker.openPopup();
        }
      }, 500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl sm:text-3xl font-bold">
          About <span className="gradient-text">{COLLEGE_INFO.shortName}</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">{COLLEGE_INFO.tagline}</p>
      </div>

      {/* Map + Building List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2 glass-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="relative">
            <div
              ref={mapContainerRef}
              className="w-full h-[400px] lg:h-[500px]"
            />
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <p className="text-sm text-slate-500">Loading map...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building List */}
        <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Campus Buildings
          </h2>
          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            {CAMPUS_BUILDINGS.map((building) => {
              const faculty = getFacultyForBuilding(building.id);
              const inCabinCount = faculty.filter(f => f.status === 'In Cabin').length;
              const inClassCount = faculty.filter(f => f.status === 'In Class').length;
              const onLeaveCount = faculty.filter(f => f.status === 'On Leave').length;

              return (
                <button
                  key={building.id}
                  onClick={() => handleBuildingClick(building)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${selectedBuilding === building.id
                      ? 'bg-gradient-to-r from-primary/15 to-transparent border border-primary/20'
                      : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                >
                  <span className="text-xl">{building.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{building.name}</p>
                    <p className="text-[0.6rem] text-slate-500 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {building.hours}
                    </p>
                    {faculty.length > 0 && (
                      <div className="flex items-center gap-2 mt-1.5">
                        {inCabinCount > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.55rem] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle className="w-2.5 h-2.5" /> {inCabinCount}
                          </span>
                        )}
                        {inClassCount > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.55rem] bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <User className="w-2.5 h-2.5" /> {inClassCount}
                          </span>
                        )}
                        {onLeaveCount > 0 && (
                          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.55rem] bg-rose-500/20 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-2.5 h-2.5" /> {onLeaveCount}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: building.color }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Faculty Availability Panel */}
      <div className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Faculty Availability (Real-time Status)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FACULTY_AVAILABILITY.map((faculty) => (
            <div key={faculty.id} className="glass-light p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">{faculty.image}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{faculty.name}</p>
                  <p className="text-[0.6rem] text-slate-500 truncate">{faculty.designation}</p>
                  <p className="text-[0.6rem] text-slate-400 truncate mt-0.5">{faculty.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-[0.55rem] font-medium border ${
                      faculty.status === 'In Cabin'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : faculty.status === 'In Class'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}>
                      {faculty.status === 'In Cabin' && <CheckCircle className="w-2.5 h-2.5 me-1" />}
                      {faculty.status === 'In Class' && <User className="w-2.5 h-2.5 me-1" />}
                      {faculty.status === 'On Leave' && <XCircle className="w-2.5 h-2.5 me-1" />}
                      {faculty.status}
                    </span>
                  </div>
                  {faculty.currentClass && (
                    <p className="text-[0.55rem] text-slate-500 mt-1.5 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5" />
                      {faculty.currentClass.subject} • {faculty.currentClass.time}
                    </p>
                  )}
                  <p className="text-[0.55rem] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" />
                    {faculty.cabin}
                  </p>
                  <p className="text-[0.55rem] text-primary mt-1 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {faculty.nextAvailable}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* College Info Section */}
      <div className="glass-card p-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left — Info */}
          <div>
            <h2 className="text-xl font-bold mb-1">{COLLEGE_INFO.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{COLLEGE_INFO.address}</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <GraduationCap className="w-4 h-4 text-primary shrink-0" />
                <span className="text-slate-400">Affiliated to:</span>
                <span className="text-slate-200">{COLLEGE_INFO.affiliation}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <BookOpen className="w-4 h-4 text-secondary shrink-0" />
                <span className="text-slate-400">Accreditation:</span>
                <span className="text-slate-200">{COLLEGE_INFO.accreditation}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-success shrink-0" />
                <span className="text-slate-400">Campus Area:</span>
                <span className="text-slate-200">{COLLEGE_INFO.campus}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-warning shrink-0" />
                <span className="text-slate-400">Established:</span>
                <span className="text-slate-200">{COLLEGE_INFO.established}</span>
              </div>
            </div>

            {/* Departments */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3 text-slate-300">Departments</h3>
              <div className="flex flex-wrap gap-2">
                {COLLEGE_INFO.departments.map((dept, i) => (
                  <span key={i} className="badge badge-info text-[0.6rem]">
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Stats */}
          <div>
            <h3 className="text-sm font-semibold mb-4 text-slate-300">At a Glance</h3>
            <div className="grid grid-cols-2 gap-3">
              {COLLEGE_INFO.stats.map((stat, i) => (
                <div
                  key={i}
                  className="glass-light p-4 rounded-xl text-center hover:border-white/10 transition-all"
                >
                  <span className="text-2xl block mb-2">{stat.icon}</span>
                  <p className="text-2xl font-bold gradient-text">
                    {counters[i]}
                    {stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                  </p>
                  <p className="text-[0.65rem] text-slate-500 mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import {
  Activity,
  Ambulance,
  Bell,
  Bot,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleUserRound,
  FileHeart,
  HeartPulse,
  Home,
  Languages,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Pill,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import FeatureViews, { featureCatalog, type FeatureId } from "./FeatureViews";
import "./featureViews.css";
import RoleWorkspaces from "./RoleWorkspaces";
import "./roleWorkspaces.css";

type Role = "Patient" | "Doctor" | "Hospital Admin" | "Super Admin";
type Language = "English" | "हिंदी" | "मराठी";

const roleMeta: Record<Role, { name: string; subtitle: string; initials: string }> = {
  Patient: {
    name: "Aarav Mehta",
    subtitle: "Patient account",
    initials: "AM",
  },
  Doctor: {
    name: "Dr. Sana Mehta",
    subtitle: "Medical practitioner",
    initials: "SM",
  },
  "Hospital Admin": {
    name: "CityCare Admin",
    subtitle: "Hospital operations",
    initials: "CA",
  },
  "Super Admin": {
    name: "Platform Admin",
    subtitle: "System operations",
    initials: "PA",
  },
};

const translations: Record<
  Language,
  { greeting: string; overview: string; services: string; serviceSub: string }
> = {
  English: {
    greeting: "Good morning",
    overview: "Here’s your health overview for today.",
    services: "Explore health services",
    serviceSub: "Everything you need, in one secure place",
  },
  हिंदी: {
    greeting: "सुप्रभात",
    overview: "आज का आपका स्वास्थ्य सारांश यहाँ है।",
    services: "स्वास्थ्य सेवाएँ खोजें",
    serviceSub: "आपकी सभी स्वास्थ्य सेवाएँ एक सुरक्षित स्थान पर",
  },
  मराठी: {
    greeting: "शुभ सकाळ",
    overview: "आजचा तुमचा आरोग्य आढावा येथे आहे.",
    services: "आरोग्य सेवा शोधा",
    serviceSub: "तुमच्या सर्व आरोग्य सेवा एका सुरक्षित ठिकाणी",
  },
};

const navItems = [
  { label: "Home", icon: Home },
  { label: "Explore", icon: Search },
  { label: "AI Health", icon: Bot },
  { label: "Records", icon: FileHeart },
  { label: "Profile", icon: CircleUserRound },
];

function Logo() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <HeartPulse size={22} strokeWidth={2.4} />
      </span>
      <span className="brand-copy">
        <strong>Health Navigator</strong>
        <small>AI care, thoughtfully guided</small>
      </span>
    </div>
  );
}

function SimpleModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <section className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <header className="modal-header">
          <h2>{title}</h2>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("Patient");
  const [language, setLanguage] = useState<Language>("English");
  const [activeFeature, setActiveFeature] = useState<FeatureId | null>(null);
  const [activeNav, setActiveNav] = useState("Home");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [roleMenu, setRoleMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsRead, setNotificationsRead] = useState(false);
  const [toast, setToast] = useState("");
  const copy = translations[language];
  const currentUser = roleMeta[role];

  const visibleFeatures = useMemo(
    () =>
      featureCatalog.filter((item) =>
        `${item.title} ${item.description}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const openFeature = (feature: FeatureId, nav = "Explore") => {
    setActiveFeature(feature);
    setActiveNav(nav);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goHome = () => {
    setActiveFeature(null);
    setActiveNav("Home");
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNav = (label: string) => {
    if (label === "Home" || label === "Explore") {
      goHome();
      setActiveNav(label);
      if (label === "Explore") {
        window.setTimeout(
          () => document.querySelector("#service-grid")?.scrollIntoView({ behavior: "smooth" }),
          20,
        );
      }
    } else if (label === "AI Health") openFeature("symptoms", label);
    else if (label === "Records") openFeature("records", label);
    else {
      setActiveNav(label);
      setProfileOpen(true);
      setMobileMenu(false);
    }
  };

  const switchRole = (nextRole: Role) => {
    setRole(nextRole);
    setActiveFeature(null);
    setActiveNav("Home");
    setRoleMenu(false);
    setProfileOpen(false);
    notify(`Dashboard switched to ${nextRole}`);
  };

  const patientHome = (
    <div className="page-wrap">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <span />
            {role} dashboard
          </div>
          <h1>
            {copy.greeting}, {currentUser.name.split(" ")[0]}
          </h1>
          <p>{copy.overview}</p>
        </div>
        <div className="date-card">
          <CalendarDays size={19} />
          <span>
            <small>Today</small>
            <strong>24 June 2025</strong>
          </span>
        </div>
      </section>

      <section className="hero-grid">
        <div className="care-card">
          <div className="care-copy">
            <span className="status-chip">
              <Sparkles size={14} /> AI HEALTH ASSISTANT
            </span>
            <h2>How are you feeling today?</h2>
            <p>
              Select symptoms, answer guided questions, and receive realistic preliminary next-step
              guidance in your preferred language.
            </p>
            <button className="primary-button" onClick={() => openFeature("symptoms", "AI Health")}>
              Start a health check <ChevronRight size={17} />
            </button>
            <small className="medical-note">Guidance only — not a medical diagnosis</small>
          </div>
          <div className="care-visual" aria-hidden="true">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="assistant-figure">
              <Bot size={38} />
              <span className="pulse-line">
                <Activity size={54} />
              </span>
            </div>
          </div>
        </div>
        <div className="stats-stack">
          <button className="stat-card" onClick={() => openFeature("appointments")}>
            <span className="stat-icon stat-0">
              <CalendarDays size={20} />
            </span>
            <span>
              <strong>2</strong>
              <small>Upcoming visits</small>
            </span>
            <ChevronRight size={18} />
          </button>
          <button className="stat-card" onClick={() => openFeature("records", "Records")}>
            <span className="stat-icon stat-1">
              <FileHeart size={20} />
            </span>
            <span>
              <strong>6</strong>
              <small>Health records</small>
            </span>
            <ChevronRight size={18} />
          </button>
          <button className="stat-card" onClick={() => openFeature("vitals")}>
            <span className="stat-icon stat-2">
              <HeartPulse size={20} />
            </span>
            <span>
              <strong>Good</strong>
              <small>Latest vitals</small>
            </span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <section className="section-block" id="service-grid">
        <div className="section-heading">
          <div>
            <h2>{copy.services}</h2>
            <p>{copy.serviceSub}</p>
          </div>
          {query && (
            <button className="text-button" onClick={() => setQuery("")}>
              Clear search
            </button>
          )}
        </div>
        {visibleFeatures.length > 0 ? (
          <div className="feature-grid">
            {visibleFeatures.map((item, index) => {
              const Icon = item.icon;
              const tones = [
                "blue",
                "violet",
                "sky",
                "pink",
                "orange",
                "cyan",
                "indigo",
                "rose",
                "green",
                "amber",
                "mint",
                "violet",
              ];
              return (
                <button className="feature-card" key={item.id} onClick={() => openFeature(item.id)}>
                  <span className={`feature-icon ${tones[index]}`}>
                    <Icon size={23} />
                  </span>
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                  <ChevronRight className="feature-arrow" size={17} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <Search size={26} />
            <h3>No matching service</h3>
            <p>Try searching for a doctor, report, medicine, hospital, or wellness service.</p>
            <button className="secondary-button" onClick={() => setQuery("")}>
              Show all services
            </button>
          </div>
        )}
      </section>

      <section className="dashboard-grid">
        <div className="panel appointment-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming appointment</h2>
              <p>Your next scheduled consultation</p>
            </div>
            <button className="icon-button" onClick={() => openFeature("appointments")}>
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="appointment-body">
            <div className="doctor-avatar">SM</div>
            <div className="doctor-info">
              <span className="verified-label">
                <Check size={12} /> Verified doctor
              </span>
              <h3>Dr. Sana Mirza</h3>
              <p>Cardiologist · 12 years experience</p>
              <div className="appointment-meta">
                <span>
                  <CalendarDays size={15} /> 27 June
                </span>
                <span>10:30 AM</span>
                <span>CityCare Hospital</span>
              </div>
            </div>
            <div className="appointment-actions">
              <button
                className="primary-button compact"
                onClick={() => openFeature("appointments")}
              >
                Manage
              </button>
              <button className="secondary-button compact" onClick={() => openFeature("doctors")}>
                Video room
              </button>
            </div>
          </div>
        </div>

        <div className="panel health-panel">
          <div className="panel-heading">
            <div>
              <h2>Latest health snapshot</h2>
              <p>Log readings to update your trends</p>
            </div>
            <button className="add-button" onClick={() => openFeature("vitals")}>
              <Activity size={15} /> Add reading
            </button>
          </div>
          <div className="snapshot-grid">
            <span>
              <small>Heart rate</small>
              <strong>72 bpm</strong>
            </span>
            <span>
              <small>Blood pressure</small>
              <strong>118/76</strong>
            </span>
            <span>
              <small>SpO₂</small>
              <strong>98%</strong>
            </span>
          </div>
          <button className="health-link" onClick={() => openFeature("vitals")}>
            View 7-day trends <ChevronRight size={15} />
          </button>
        </div>
      </section>

      <section className="records-row">
        <div>
          <span className="record-icon">
            <Upload size={22} />
          </span>
          <div>
            <h3>Keep your medical records together</h3>
            <p>Upload reports, preview files, and control doctor access from one secure view.</p>
          </div>
        </div>
        <button className="secondary-button" onClick={() => openFeature("records", "Records")}>
          <Upload size={17} /> Manage records
        </button>
      </section>
    </div>
  );

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />
          <button className="mobile-close icon-button" onClick={() => setMobileMenu(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="main-nav" aria-label="Primary navigation">
          <p className="nav-label">OVERVIEW</p>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={activeNav === label ? "nav-item active" : "nav-item"}
              onClick={() => handleNav(label)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {label === "AI Health" && <span className="nav-pill">AI</span>}
            </button>
          ))}
          <p className="nav-label nav-spaced">QUICK ACCESS</p>
          <button className="nav-item" onClick={() => openFeature("vitals")}>
            <Activity size={19} />
            <span>Health tracker</span>
          </button>
          <button className="nav-item" onClick={() => openFeature("medicines")}>
            <Pill size={19} />
            <span>Medications</span>
          </button>
          <button className="nav-item" onClick={() => openFeature("wellness")}>
            <MessageCircle size={19} />
            <span>Help & support</span>
          </button>
        </nav>
        <button className="sidebar-safety" onClick={() => openFeature("records", "Records")}>
          <ShieldCheck size={18} />
          <div>
            <strong>Your data is protected</strong>
            <span>Review consent access</span>
          </div>
        </button>
        <button className="sidebar-profile" onClick={() => setRoleMenu(!roleMenu)}>
          <span className="avatar">{currentUser.initials}</span>
          <span>
            <strong>{currentUser.name}</strong>
            <small>{currentUser.subtitle}</small>
          </span>
          <MoreHorizontal size={18} />
        </button>
        {roleMenu && (
          <div className="role-menu">
            <p>Preview dashboard as</p>
            {(["Patient", "Doctor", "Hospital Admin", "Super Admin"] as Role[]).map((item) => (
              <button
                key={item}
                className={role === item ? "selected" : ""}
                onClick={() => switchRole(item)}
              >
                {item}
                {role === item && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </aside>

      {mobileMenu && <button className="sidebar-scrim" onClick={() => setMobileMenu(false)} />}

      <main className="main-content">
        <header className="topbar">
          <button className="menu-button icon-button" onClick={() => setMobileMenu(true)}>
            <Menu size={22} />
          </button>
          <div className="mobile-logo">
            <Logo />
          </div>
          <div className="global-search">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (activeFeature) goHome();
              }}
              placeholder="Search services, doctors, records..."
            />
          </div>
          <label className="language-select">
            <Languages size={18} />
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option>English</option>
              <option>हिंदी</option>
              <option>मराठी</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <button
            className="notification-button icon-button"
            onClick={() => setNotificationsOpen(true)}
            aria-label="Notifications"
          >
            <Bell size={20} />
            {!notificationsRead && <span />}
          </button>
          <button className="sos-top" onClick={() => openFeature("emergency")}>
            <Ambulance size={18} />
            <span>Emergency SOS</span>
          </button>
        </header>

        {activeFeature ? (
          <FeatureViews active={activeFeature} onBack={goHome} />
        ) : role === "Patient" ? (
          patientHome
        ) : (
          <RoleWorkspaces role={role} />
        )}
      </main>

      <nav className="bottom-nav" aria-label="Mobile navigation">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className={activeNav === label ? "active" : ""}
            onClick={() => handleNav(label)}
          >
            <Icon size={20} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <button
        className="floating-sos"
        onClick={() => openFeature("emergency")}
        aria-label="Emergency SOS"
      >
        <Ambulance size={23} />
      </button>

      {notificationsOpen && (
        <SimpleModal
          title="Notifications"
          onClose={() => {
            setNotificationsOpen(false);
            setNotificationsRead(true);
          }}
        >
          <div className="notification-list">
            <button onClick={() => openFeature("appointments")}>
              <span className="notification-icon">
                <CalendarDays size={18} />
              </span>
              <p>
                <strong>Appointment reminder</strong>
                Your cardiology visit is on 27 June at 10:30 AM.
              </p>
              <ChevronRight size={16} />
            </button>
            <button onClick={() => openFeature("preventive")}>
              <span className="notification-icon mint">
                <ShieldCheck size={18} />
              </span>
              <p>
                <strong>Preventive care</strong>
                Your annual wellness check is due next month.
              </p>
              <ChevronRight size={16} />
            </button>
          </div>
        </SimpleModal>
      )}

      {profileOpen && (
        <SimpleModal title="Profile & role" onClose={() => setProfileOpen(false)}>
          <div className="profile-modal">
            <span className="profile-avatar">{currentUser.initials}</span>
            <h3>{currentUser.name}</h3>
            <p>Local interactive demonstration profile</p>
            <label>
              Dashboard role
              <select value={role} onChange={(event) => switchRole(event.target.value as Role)}>
                <option>Patient</option>
                <option>Doctor</option>
                <option>Hospital Admin</option>
                <option>Super Admin</option>
              </select>
            </label>
            <label>
              Preferred language
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
              >
                <option>English</option>
                <option>हिंदी</option>
                <option>मराठी</option>
              </select>
            </label>
            <button
              className="primary-button full"
              onClick={() => {
                setProfileOpen(false);
                notify("Profile preferences saved");
              }}
            >
              Save preferences
            </button>
          </div>
        </SimpleModal>
      )}

      {toast && (
        <div className="toast">
          <Check size={17} /> {toast}
        </div>
      )}
    </div>
  );
}

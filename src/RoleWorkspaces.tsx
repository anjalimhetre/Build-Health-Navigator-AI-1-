import { FormEvent, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  ArrowLeft,
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileHeart,
  FileText,
  Filter,
  HeartPulse,
  Hospital,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import "./roleWorkspaces.css";

export type WorkspaceRole = "Doctor" | "Hospital Admin" | "Super Admin";

type Patient = {
  id: number;
  name: string;
  initials: string;
  age: number;
  reason: string;
  time: string;
  status: "Waiting" | "In consultation" | "Completed";
  consent: boolean;
  vitals: string;
};

const patients: Patient[] = [
  {
    id: 1,
    name: "Riya Sharma",
    initials: "RS",
    age: 34,
    reason: "Recurring migraine",
    time: "09:30",
    status: "Waiting",
    consent: true,
    vitals: "BP 118/76 · HR 72",
  },
  {
    id: 2,
    name: "Vikram Patel",
    initials: "VP",
    age: 52,
    reason: "Diabetes follow-up",
    time: "10:15",
    status: "In consultation",
    consent: true,
    vitals: "BP 132/84 · Glucose 126",
  },
  {
    id: 3,
    name: "Anita Deshmukh",
    initials: "AD",
    age: 46,
    reason: "Chest discomfort",
    time: "11:00",
    status: "Waiting",
    consent: false,
    vitals: "Consent required",
  },
  {
    id: 4,
    name: "Kabir Singh",
    initials: "KS",
    age: 28,
    reason: "Post-operative review",
    time: "11:45",
    status: "Completed",
    consent: true,
    vitals: "BP 121/79 · SpO₂ 98%",
  },
];

function DoctorWorkspace() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(1);
  const [queue, setQueue] = useState(patients);
  const [notes, setNotes] = useState<Record<number, string>>({
    1: "Reports throbbing pain twice weekly. No visual aura.",
  });
  const [draftNote, setDraftNote] = useState(notes[1] ?? "");
  const [saved, setSaved] = useState(false);
  const [prescriptions, setPrescriptions] = useState<
    { id: number; patientId: number; medicine: string; dosage: string; frequency: string }[]
  >([]);
  const [rx, setRx] = useState({ medicine: "", dosage: "", frequency: "Once daily" });

  const selected = queue.find((patient) => patient.id === selectedId) ?? queue[0];
  const filtered = queue.filter((patient) =>
    `${patient.name} ${patient.reason}`.toLowerCase().includes(query.toLowerCase()),
  );

  const choosePatient = (patient: Patient) => {
    setSelectedId(patient.id);
    setDraftNote(notes[patient.id] ?? "");
    setSaved(false);
  };

  const submitRx = (event: FormEvent) => {
    event.preventDefault();
    if (!rx.medicine.trim() || !rx.dosage.trim()) return;
    setPrescriptions((items) => [...items, { id: Date.now(), patientId: selected.id, ...rx }]);
    setRx({ medicine: "", dosage: "", frequency: "Once daily" });
  };

  const advancePatient = () => {
    setQueue((items) =>
      items.map((patient) =>
        patient.id === selected.id
          ? {
              ...patient,
              status:
                patient.status === "Waiting"
                  ? "In consultation"
                  : patient.status === "In consultation"
                    ? "Completed"
                    : "Completed",
            }
          : patient,
      ),
    );
  };

  return (
    <div className="doctor-workspace">
      <section className="rw-hero">
        <div>
          <span className="rw-eyebrow">
            <Stethoscope size={14} /> Clinical workspace
          </span>
          <h1>Good morning, Dr. Mehta</h1>
          <p>Review your queue, patient records, notes, and prescriptions in one place.</p>
        </div>
        <div className="rw-hero-stat">
          <span>Today</span>
          <strong>4 patients</strong>
          <small>Next consultation at 09:30</small>
        </div>
      </section>

      <div className="doctor-layout">
        <aside className="rw-card patient-queue">
          <div className="rw-card-heading">
            <div>
              <h2>Patient queue</h2>
              <p>
                {queue.filter((item) => item.status !== "Completed").length} active consultations
              </p>
            </div>
            <Filter size={17} />
          </div>
          <label className="rw-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patient or reason"
            />
          </label>
          <div className="patient-list">
            {filtered.map((patient) => (
              <button
                key={patient.id}
                className={patient.id === selected.id ? "patient-row selected" : "patient-row"}
                onClick={() => choosePatient(patient)}
              >
                <span className="rw-avatar">{patient.initials}</span>
                <span className="patient-row-copy">
                  <strong>{patient.name}</strong>
                  <small>
                    {patient.time} · {patient.reason}
                  </small>
                  <span className={`rw-status ${patient.status.toLowerCase().replace(" ", "-")}`}>
                    {patient.status}
                  </span>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </aside>

        <div className="doctor-main">
          <section className="rw-card patient-summary">
            <div className="patient-identity">
              <span className="rw-avatar large">{selected.initials}</span>
              <div>
                <span className="rw-eyebrow">Selected patient</span>
                <h2>{selected.name}</h2>
                <p>
                  {selected.age} years · {selected.reason}
                </p>
              </div>
            </div>
            <div className="summary-actions">
              <span className={selected.consent ? "consent yes" : "consent no"}>
                {selected.consent ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
                {selected.consent ? "Records consent active" : "Records consent needed"}
              </span>
              <button
                className="rw-button primary"
                disabled={!selected.consent || selected.status === "Completed"}
                onClick={advancePatient}
              >
                {selected.status === "Waiting"
                  ? "Start consultation"
                  : selected.status === "In consultation"
                    ? "Complete visit"
                    : "Visit completed"}
              </button>
            </div>
          </section>

          <div className="clinical-grid">
            <section className="rw-card records-viewer">
              <div className="rw-card-heading">
                <div>
                  <h2>Consented medical records</h2>
                  <p>Shared by the patient for this consultation</p>
                </div>
                <FileHeart size={19} />
              </div>
              {selected.consent ? (
                <>
                  <div className="vitals-strip">
                    <HeartPulse size={18} />
                    <span>
                      <small>Latest vitals</small>
                      <strong>{selected.vitals}</strong>
                    </span>
                  </div>
                  <div className="record-list">
                    <button>
                      <span className="record-file-icon">
                        <FileText size={18} />
                      </span>
                      <span>
                        <strong>Complete Blood Count</strong>
                        <small>18 Jun 2025 · Pathology</small>
                      </span>
                      <span className="view-label">View</span>
                    </button>
                    <button>
                      <span className="record-file-icon scan">
                        <Activity size={18} />
                      </span>
                      <span>
                        <strong>ECG Report</strong>
                        <small>04 May 2025 · Cardiology</small>
                      </span>
                      <span className="view-label">View</span>
                    </button>
                    <button>
                      <span className="record-file-icon rx">
                        <Pill size={18} />
                      </span>
                      <span>
                        <strong>Previous Prescription</strong>
                        <small>04 May 2025 · Dr. Rao</small>
                      </span>
                      <span className="view-label">View</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="rw-empty">
                  <ShieldCheck size={28} />
                  <h3>Patient consent required</h3>
                  <p>Records remain hidden until the patient grants access.</p>
                </div>
              )}
            </section>

            <section className="rw-card notes-editor">
              <div className="rw-card-heading">
                <div>
                  <h2>Clinical notes</h2>
                  <p>Saved locally for this session</p>
                </div>
                {saved && (
                  <span className="saved-mark">
                    <Check size={14} /> Saved
                  </span>
                )}
              </div>
              <textarea
                value={draftNote}
                onChange={(event) => {
                  setDraftNote(event.target.value);
                  setSaved(false);
                }}
                placeholder="Add symptoms, observations, assessment and follow-up plan..."
              />
              <button
                className="rw-button secondary"
                onClick={() => {
                  setNotes((current) => ({ ...current, [selected.id]: draftNote }));
                  setSaved(true);
                }}
              >
                <ClipboardCheck size={16} /> Save clinical notes
              </button>
            </section>
          </div>

          <section className="rw-card prescription-writer">
            <div className="rw-card-heading">
              <div>
                <h2>E-prescription writer</h2>
                <p>Add medicines only after clinical assessment</p>
              </div>
              <Pill size={19} />
            </div>
            <form onSubmit={submitRx}>
              <label>
                Medicine
                <input
                  value={rx.medicine}
                  onChange={(event) => setRx({ ...rx, medicine: event.target.value })}
                  placeholder="e.g. Paracetamol 500 mg"
                  required
                />
              </label>
              <label>
                Dosage
                <input
                  value={rx.dosage}
                  onChange={(event) => setRx({ ...rx, dosage: event.target.value })}
                  placeholder="e.g. 1 tablet after food"
                  required
                />
              </label>
              <label>
                Frequency
                <select
                  value={rx.frequency}
                  onChange={(event) => setRx({ ...rx, frequency: event.target.value })}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </label>
              <button className="rw-button primary" type="submit">
                <Plus size={16} /> Add medicine
              </button>
            </form>
            <div className="prescription-items">
              {prescriptions
                .filter((item) => item.patientId === selected.id)
                .map((item) => (
                  <div key={item.id}>
                    <Pill size={16} />
                    <span>
                      <strong>{item.medicine}</strong>
                      <small>
                        {item.dosage} · {item.frequency}
                      </small>
                    </span>
                    <button
                      aria-label="Remove medicine"
                      onClick={() =>
                        setPrescriptions((items) => items.filter((entry) => entry.id !== item.id))
                      }
                    >
                      <X size={15} />
                    </button>
                  </div>
                ))}
              {!prescriptions.some((item) => item.patientId === selected.id) && (
                <p className="inline-empty">No medicines added for this patient yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

type BedStatus = "Available" | "Occupied" | "Cleaning";
type BedItem = { id: string; ward: "General" | "ICU"; status: BedStatus; patient?: string };

const initialBeds: BedItem[] = [
  { id: "G-101", ward: "General", status: "Occupied", patient: "R. Sharma" },
  { id: "G-102", ward: "General", status: "Available" },
  { id: "G-103", ward: "General", status: "Cleaning" },
  { id: "G-104", ward: "General", status: "Occupied", patient: "A. Khan" },
  { id: "G-105", ward: "General", status: "Available" },
  { id: "G-106", ward: "General", status: "Available" },
  { id: "I-01", ward: "ICU", status: "Occupied", patient: "S. Patel" },
  { id: "I-02", ward: "ICU", status: "Available" },
  { id: "I-03", ward: "ICU", status: "Cleaning" },
  { id: "I-04", ward: "ICU", status: "Occupied", patient: "M. Iyer" },
];

const nextBedStatus: Record<BedStatus, BedStatus> = {
  Available: "Occupied",
  Occupied: "Cleaning",
  Cleaning: "Available",
};

function HospitalWorkspace() {
  const [beds, setBeds] = useState(initialBeds);
  const [ward, setWard] = useState<"All" | "General" | "ICU">("All");
  const [fleet, setFleet] = useState([
    { id: "AMB-01", driver: "R. Jadhav", status: "Available", location: "Hospital bay" },
    { id: "AMB-02", driver: "P. Yadav", status: "En Route", location: "MG Road · 2.4 km" },
    { id: "AMB-03", driver: "S. Pawar", status: "Maintenance", location: "Service centre" },
  ]);
  const [shifts, setShifts] = useState([
    { id: 1, doctor: "Dr. Sana Mirza", department: "Cardiology", time: "08:00 – 16:00" },
    { id: 2, doctor: "Dr. Arjun Rao", department: "Emergency", time: "12:00 – 20:00" },
    { id: 3, doctor: "Dr. Neha Jain", department: "Paediatrics", time: "09:00 – 17:00" },
  ]);
  const [shiftForm, setShiftForm] = useState({ doctor: "", department: "", time: "" });

  const filteredBeds = ward === "All" ? beds : beds.filter((bed) => bed.ward === ward);
  const available = beds.filter((bed) => bed.status === "Available").length;

  const toggleBed = (id: string) => {
    setBeds((items) =>
      items.map((bed) =>
        bed.id === id
          ? {
              ...bed,
              status: nextBedStatus[bed.status],
              patient: nextBedStatus[bed.status] === "Occupied" ? "Awaiting assignment" : undefined,
            }
          : bed,
      ),
    );
  };

  const addShift = (event: FormEvent) => {
    event.preventDefault();
    if (!shiftForm.doctor || !shiftForm.department || !shiftForm.time) return;
    setShifts((items) => [...items, { id: Date.now(), ...shiftForm }]);
    setShiftForm({ doctor: "", department: "", time: "" });
  };

  return (
    <div className="hospital-workspace">
      <section className="rw-hero">
        <div>
          <span className="rw-eyebrow">
            <Building2 size={14} /> Hospital operations
          </span>
          <h1>CityCare Control Centre</h1>
          <p>Manage bed allocation, emergency fleet availability, and clinical shifts.</p>
        </div>
        <div className="operation-summary">
          <span>
            <BedDouble size={18} />
            <strong>{available}</strong>
            <small>Available beds</small>
          </span>
          <span>
            <Ambulance size={18} />
            <strong>{fleet.filter((item) => item.status === "Available").length}</strong>
            <small>Ready ambulances</small>
          </span>
          <span>
            <Stethoscope size={18} />
            <strong>{shifts.length}</strong>
            <small>Doctors on roster</small>
          </span>
        </div>
      </section>

      <section className="rw-card bed-manager">
        <div className="rw-card-heading">
          <div>
            <h2>Ward & ICU allocation</h2>
            <p>Select any bed to cycle its operational status</p>
          </div>
          <div className="rw-tabs">
            {(["All", "General", "ICU"] as const).map((item) => (
              <button
                key={item}
                className={ward === item ? "active" : ""}
                onClick={() => setWard(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="bed-legend">
          <span className="available">Available</span>
          <span className="occupied">Occupied</span>
          <span className="cleaning">Cleaning</span>
        </div>
        <div className="bed-grid">
          {filteredBeds.map((bed) => (
            <button
              key={bed.id}
              className={`bed-tile ${bed.status.toLowerCase()}`}
              onClick={() => toggleBed(bed.id)}
            >
              <BedDouble size={22} />
              <strong>{bed.id}</strong>
              <small>{bed.ward}</small>
              <span>{bed.status}</span>
              {bed.patient && <em>{bed.patient}</em>}
            </button>
          ))}
        </div>
      </section>

      <div className="admin-grid">
        <section className="rw-card fleet-manager">
          <div className="rw-card-heading">
            <div>
              <h2>Ambulance fleet</h2>
              <p>Update the current operational status</p>
            </div>
            <Ambulance size={20} />
          </div>
          <div className="fleet-list">
            {fleet.map((vehicle) => (
              <div key={vehicle.id}>
                <span className="fleet-icon">
                  <Ambulance size={19} />
                </span>
                <span>
                  <strong>{vehicle.id}</strong>
                  <small>
                    {vehicle.driver} · {vehicle.location}
                  </small>
                </span>
                <select
                  value={vehicle.status}
                  onChange={(event) =>
                    setFleet((items) =>
                      items.map((item) =>
                        item.id === vehicle.id ? { ...item, status: event.target.value } : item,
                      ),
                    )
                  }
                >
                  <option>Available</option>
                  <option>En Route</option>
                  <option>At Scene</option>
                  <option>Maintenance</option>
                </select>
              </div>
            ))}
          </div>
        </section>

        <section className="rw-card roster-manager">
          <div className="rw-card-heading">
            <div>
              <h2>Doctor shift roster</h2>
              <p>Today’s clinical coverage</p>
            </div>
            <CalendarDays size={20} />
          </div>
          <div className="shift-list">
            {shifts.map((shift) => (
              <div key={shift.id}>
                <span className="rw-avatar small">
                  {shift.doctor
                    .replace("Dr. ", "")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <strong>{shift.doctor}</strong>
                  <small>
                    {shift.department} · {shift.time}
                  </small>
                </span>
                <button
                  aria-label="Remove shift"
                  onClick={() => setShifts((items) => items.filter((item) => item.id !== shift.id))}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
          <form className="shift-form" onSubmit={addShift}>
            <input
              required
              value={shiftForm.doctor}
              onChange={(event) => setShiftForm({ ...shiftForm, doctor: event.target.value })}
              placeholder="Doctor name"
            />
            <input
              required
              value={shiftForm.department}
              onChange={(event) => setShiftForm({ ...shiftForm, department: event.target.value })}
              placeholder="Department"
            />
            <input
              required
              value={shiftForm.time}
              onChange={(event) => setShiftForm({ ...shiftForm, time: event.target.value })}
              placeholder="Shift time"
            />
            <button className="rw-button primary" type="submit">
              <Plus size={15} /> Add shift
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

type HospitalApplication = {
  id: number;
  name: string;
  city: string;
  beds: number;
  specialties: string;
  status: "Pending" | "Approved" | "Rejected";
};

function SuperAdminWorkspace() {
  const [applications, setApplications] = useState<HospitalApplication[]>([
    {
      id: 1,
      name: "Sahyadri Multispeciality",
      city: "Pune",
      beds: 120,
      specialties: "Cardiology, Neurology",
      status: "Pending",
    },
    {
      id: 2,
      name: "Lotus Women’s Hospital",
      city: "Nashik",
      beds: 65,
      specialties: "Obstetrics, Paediatrics",
      status: "Pending",
    },
    {
      id: 3,
      name: "Konkan Care Centre",
      city: "Ratnagiri",
      beds: 42,
      specialties: "General Medicine",
      status: "Pending",
    },
  ]);
  const [auditQuery, setAuditQuery] = useState("");
  const [auditType, setAuditType] = useState("All");
  const audits = [
    {
      id: "AUD-1048",
      time: "24 Jun · 10:42",
      actor: "admin@citycare.in",
      action: "Updated ICU availability",
      type: "Hospital",
      result: "Success",
    },
    {
      id: "AUD-1047",
      time: "24 Jun · 10:36",
      actor: "Dr. Sana Mirza",
      action: "Viewed consented record",
      type: "Clinical",
      result: "Success",
    },
    {
      id: "AUD-1046",
      time: "24 Jun · 10:14",
      actor: "System",
      action: "Emergency case escalated",
      type: "Emergency",
      result: "Alert",
    },
    {
      id: "AUD-1045",
      time: "24 Jun · 09:58",
      actor: "user-8842",
      action: "Revoked doctor consent",
      type: "Privacy",
      result: "Success",
    },
    {
      id: "AUD-1044",
      time: "24 Jun · 09:41",
      actor: "onboarding@lotus.in",
      action: "Submitted verification",
      type: "Hospital",
      result: "Pending",
    },
  ];
  const filteredAudits = useMemo(
    () =>
      audits.filter(
        (audit) =>
          (auditType === "All" || audit.type === auditType) &&
          `${audit.id} ${audit.actor} ${audit.action}`
            .toLowerCase()
            .includes(auditQuery.toLowerCase()),
      ),
    [auditQuery, auditType],
  );

  const updateApplication = (id: number, status: "Approved" | "Rejected") => {
    setApplications((items) =>
      items.map((application) =>
        application.id === id ? { ...application, status } : application,
      ),
    );
  };

  return (
    <div className="super-workspace">
      <section className="rw-hero">
        <div>
          <span className="rw-eyebrow">
            <ShieldCheck size={14} /> Platform administration
          </span>
          <h1>Health network overview</h1>
          <p>Monitor system operations, provider verification, and privacy audit activity.</p>
        </div>
        <span className="system-healthy">
          <span />
          All systems operational
        </span>
      </section>

      <section className="analytics-grid">
        <article className="analytics-card">
          <span className="analytics-icon users">
            <Users size={21} />
          </span>
          <span>
            <small>Registered users</small>
            <strong>48,219</strong>
            <em>+8.4% this month</em>
          </span>
        </article>
        <article className="analytics-card">
          <span className="analytics-icon hospitals">
            <Hospital size={21} />
          </span>
          <span>
            <small>Verified hospitals</small>
            <strong>284</strong>
            <em>12 pending review</em>
          </span>
        </article>
        <article className="analytics-card">
          <span className="analytics-icon cases">
            <Activity size={21} />
          </span>
          <span>
            <small>Consultations today</small>
            <strong>1,642</strong>
            <em>94% completed</em>
          </span>
        </article>
        <article className="analytics-card">
          <span className="analytics-icon emergency">
            <Ambulance size={21} />
          </span>
          <span>
            <small>Open emergency cases</small>
            <strong>4</strong>
            <em>All assigned</em>
          </span>
        </article>
      </section>

      <section className="rw-card approval-panel">
        <div className="rw-card-heading">
          <div>
            <h2>Hospital onboarding approvals</h2>
            <p>Review submitted provider verification requests</p>
          </div>
          <span className="count-badge">
            {applications.filter((item) => item.status === "Pending").length} pending
          </span>
        </div>
        <div className="approval-list">
          {applications.map((application) => (
            <article key={application.id}>
              <span className="hospital-logo">
                <Hospital size={21} />
              </span>
              <span className="application-copy">
                <strong>{application.name}</strong>
                <small>
                  {application.city} · {application.beds} beds · {application.specialties}
                </small>
              </span>
              {application.status === "Pending" ? (
                <span className="approval-actions">
                  <button
                    className="approve"
                    onClick={() => updateApplication(application.id, "Approved")}
                  >
                    <Check size={15} /> Approve
                  </button>
                  <button
                    className="reject"
                    onClick={() => updateApplication(application.id, "Rejected")}
                  >
                    <X size={15} /> Reject
                  </button>
                </span>
              ) : (
                <span className={`decision ${application.status.toLowerCase()}`}>
                  {application.status === "Approved" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  {application.status}
                  <button onClick={() => updateApplication(application.id, "Approved")}>
                    Reopen
                  </button>
                </span>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rw-card audit-panel">
        <div className="rw-card-heading">
          <div>
            <h2>System audit log</h2>
            <p>Search recent privacy, clinical, and operational actions</p>
          </div>
          <FileText size={20} />
        </div>
        <div className="audit-controls">
          <label className="rw-search">
            <Search size={16} />
            <input
              value={auditQuery}
              onChange={(event) => setAuditQuery(event.target.value)}
              placeholder="Search ID, actor or action"
            />
          </label>
          <select value={auditType} onChange={(event) => setAuditType(event.target.value)}>
            <option>All</option>
            <option>Hospital</option>
            <option>Clinical</option>
            <option>Emergency</option>
            <option>Privacy</option>
          </select>
        </div>
        <div className="audit-table-wrap">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Event ID</th>
                <th>Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Category</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {filteredAudits.map((audit) => (
                <tr key={audit.id}>
                  <td>{audit.id}</td>
                  <td>{audit.time}</td>
                  <td>{audit.actor}</td>
                  <td>{audit.action}</td>
                  <td>
                    <span className="audit-type">{audit.type}</span>
                  </td>
                  <td>
                    <span className={`audit-result ${audit.result.toLowerCase()}`}>
                      {audit.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredAudits.length && (
            <div className="rw-empty">
              <Search size={26} />
              <h3>No audit events found</h3>
              <p>Try a different actor, action, or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function RoleWorkspaces({ role }: { role: WorkspaceRole }) {
  return (
    <div className="role-workspace">
      {role === "Doctor" && <DoctorWorkspace />}
      {role === "Hospital Admin" && <HospitalWorkspace />}
      {role === "Super Admin" && <SuperAdminWorkspace />}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Ambulance,
  ArrowLeft,
  BedDouble,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileHeart,
  FileText,
  HeartHandshake,
  HeartPulse,
  Hospital,
  MapPin,
  Navigation,
  PhoneCall,
  Pill,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Syringe,
  Upload,
  UserRound,
  UsersRound,
  Video,
  Wind,
  X,
  type LucideIcon,
} from "lucide-react";
import "./featureViews.css";

export type FeatureId =
  | "symptoms"
  | "doctors"
  | "appointments"
  | "records"
  | "medicines"
  | "vitals"
  | "hospitals"
  | "emergency"
  | "insurance"
  | "preventive"
  | "wellness"
  | "family";

export const featureCatalog: {
  id: FeatureId;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    id: "symptoms",
    title: "Symptom checker",
    description: "Guided preliminary care advice",
    icon: Sparkles,
  },
  {
    id: "doctors",
    title: "Doctor consultation",
    description: "Search, book & join teleconsults",
    icon: Stethoscope,
  },
  {
    id: "appointments",
    title: "Appointments",
    description: "Manage your consultations",
    icon: CalendarDays,
  },
  {
    id: "records",
    title: "Medical records",
    description: "Reports, scans & consent",
    icon: FileHeart,
  },
  {
    id: "medicines",
    title: "Medicine tracker",
    description: "Schedules, doses & refills",
    icon: Pill,
  },
  {
    id: "vitals",
    title: "Health vitals",
    description: "Log readings & see trends",
    icon: Activity,
  },
  {
    id: "hospitals",
    title: "Hospital & bed finder",
    description: "Nearby facilities & mock availability",
    icon: Hospital,
  },
  {
    id: "emergency",
    title: "Emergency SOS",
    description: "Simulated dispatch & first aid",
    icon: Ambulance,
  },
  {
    id: "insurance",
    title: "Insurance & claims",
    description: "Coverage and claim tracking",
    icon: ShieldCheck,
  },
  {
    id: "preventive",
    title: "Preventive care",
    description: "Vaccines & health checkups",
    icon: Syringe,
  },
  {
    id: "wellness",
    title: "Mental wellness",
    description: "Mood, breathing & counselors",
    icon: Brain,
  },
  {
    id: "family",
    title: "Family profiles",
    description: "Linked care in one place",
    icon: UsersRound,
  },
];

type DialogContent = {
  title: string;
  body: React.ReactNode;
} | null;

function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button className={`fv-button ${variant}`} {...props}>
      {children}
    </button>
  );
}

function Dialog({ content, close }: { content: DialogContent; close: () => void }) {
  if (!content) return null;
  return (
    <div className="fv-dialog-backdrop" onMouseDown={close}>
      <section
        className="fv-dialog"
        role="dialog"
        aria-modal="true"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <h3>{content.title}</h3>
          <button className="fv-icon-button" onClick={close} aria-label="Close dialog">
            <X size={19} />
          </button>
        </header>
        <div className="fv-dialog-body">{content.body}</div>
      </section>
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div className="fv-section-title">
      <span>
        <Icon size={19} />
      </span>
      <div>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
    </div>
  );
}

const symptoms = [
  "Fever",
  "Headache",
  "Cough",
  "Sore throat",
  "Fatigue",
  "Nausea",
  "Stomach pain",
  "Dizziness",
  "Body ache",
  "Shortness of breath",
];

function SymptomView() {
  const [selected, setSelected] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ side: "user" | "assistant"; text: string }[]>([
    {
      side: "assistant",
      text: "Hello, I can help you organize your symptoms. Select what you are experiencing, then tell me when it started.",
    },
  ]);
  const send = () => {
    const description = input.trim() || selected.join(", ");
    if (!description) return;
    const urgent = selected.includes("Shortness of breath");
    setMessages((old) => [
      ...old,
      { side: "user", text: description },
      {
        side: "assistant",
        text: urgent
          ? "Breathing difficulty can require urgent assessment. Please seek immediate in-person care or call 112 if severe, worsening, or accompanied by chest pain, confusion, or blue lips."
          : "These symptoms can have several causes. Rest, keep hydrated, and monitor temperature. A clinician should assess you if symptoms persist beyond 48 hours, worsen, or you develop breathing trouble, chest pain, confusion, or dehydration.",
      },
    ]);
    setInput("");
  };
  return (
    <div className="fv-two-column">
      <section className="fv-card">
        <SectionTitle
          icon={HeartPulse}
          title="What are you experiencing?"
          text="Select all that apply. You can add more detail in the conversation."
        />
        <div className="fv-chip-list">
          {symptoms.map((item) => (
            <button
              key={item}
              className={selected.includes(item) ? "selected" : ""}
              onClick={() =>
                setSelected((old) =>
                  old.includes(item) ? old.filter((value) => value !== item) : [...old, item],
                )
              }
            >
              {selected.includes(item) && <Check size={13} />}
              {item}
            </button>
          ))}
        </div>
        <div className="fv-summary-box">
          <strong>{selected.length} symptoms selected</strong>
          <span>
            {selected.length ? selected.join(" · ") : "Choose symptoms to begin your guided check."}
          </span>
        </div>
      </section>
      <section className="fv-card fv-chat-card">
        <SectionTitle
          icon={Sparkles}
          title="Preliminary guidance"
          text="A safe, conversational symptom review"
        />
        <div className="fv-chat">
          {messages.map((message, index) => (
            <div key={index} className={`fv-message ${message.side}`}>
              {message.text}
            </div>
          ))}
        </div>
        <div className="fv-chat-input">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && send()}
            placeholder="e.g. Fever since last night, 101°F..."
          />
          <button onClick={send} aria-label="Send symptom detail">
            <Send size={18} />
          </button>
        </div>
        <p className="fv-disclaimer">
          <ShieldCheck size={14} />
          Preliminary guidance only. This does not diagnose illness or replace a qualified doctor.
          Call 112 for a life-threatening emergency.
        </p>
      </section>
    </div>
  );
}

const doctors = [
  {
    name: "Dr. Sana Mirza",
    specialty: "Cardiology",
    experience: "12 years",
    rating: "4.9",
    fee: "₹900",
    next: "Today",
  },
  {
    name: "Dr. Rohan Kulkarni",
    specialty: "General Medicine",
    experience: "9 years",
    rating: "4.8",
    fee: "₹650",
    next: "Tomorrow",
  },
  {
    name: "Dr. Neha Deshmukh",
    specialty: "Dermatology",
    experience: "11 years",
    rating: "4.7",
    fee: "₹750",
    next: "26 Jun",
  },
  {
    name: "Dr. Ishaan Shah",
    specialty: "Pediatrics",
    experience: "14 years",
    rating: "4.9",
    fee: "₹800",
    next: "Today",
  },
];

function DoctorsView({ setDialog }: { setDialog: (value: DialogContent) => void }) {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [picked, setPicked] = useState<(typeof doctors)[number] | null>(null);
  const [slot, setSlot] = useState("");
  const [booked, setBooked] = useState<string[]>([]);
  const [videoDoctor, setVideoDoctor] = useState<(typeof doctors)[number] | null>(null);
  const filtered = doctors.filter(
    (doctor) =>
      (specialty === "All" || doctor.specialty === specialty) &&
      `${doctor.name} ${doctor.specialty}`.toLowerCase().includes(query.toLowerCase()),
  );
  if (videoDoctor) {
    return (
      <section className="fv-video-room">
        <div className="fv-video-stage">
          <div className="fv-video-person">
            <span>{videoDoctor.name.split(" ").slice(-1)[0][0]}</span>
            <strong>{videoDoctor.name}</strong>
            <small>Camera preview · Demo consultation room</small>
          </div>
          <div className="fv-self-preview">AM</div>
          <div className="fv-video-controls">
            <button
              onClick={() => setDialog({ title: "Microphone", body: <p>Microphone muted.</p> })}
            >
              <PhoneCall size={18} />
            </button>
            <button onClick={() => setDialog({ title: "Camera", body: <p>Camera toggled.</p> })}>
              <Video size={18} />
            </button>
            <button className="end" onClick={() => setVideoDoctor(null)}>
              End demo call
            </button>
          </div>
        </div>
        <aside className="fv-call-notes">
          <h3>Consultation notes</h3>
          <textarea placeholder="Add personal notes from this consultation..." />
          <Button onClick={() => setVideoDoctor(null)}>Save notes & leave</Button>
          <p>This is a simulated room. No video or audio is transmitted.</p>
        </aside>
      </section>
    );
  }
  return (
    <>
      <div className="fv-toolbar">
        <label className="fv-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search doctor or specialty"
          />
        </label>
        <select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
          {["All", "Cardiology", "General Medicine", "Dermatology", "Pediatrics"].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="fv-doctor-grid">
        {filtered.map((doctor) => (
          <article className="fv-card fv-doctor-card" key={doctor.name}>
            <div className="fv-doctor-top">
              <span className="fv-doctor-avatar">{doctor.name.split(" ").slice(-1)[0][0]}</span>
              <div>
                <small>
                  <CheckCircle2 size={12} /> Verified practitioner
                </small>
                <h3>{doctor.name}</h3>
                <p>{doctor.specialty}</p>
              </div>
              <strong>★ {doctor.rating}</strong>
            </div>
            <div className="fv-doctor-facts">
              <span>
                <small>Experience</small>
                {doctor.experience}
              </span>
              <span>
                <small>Consultation</small>
                {doctor.fee}
              </span>
              <span>
                <small>Next slot</small>
                {doctor.next}
              </span>
            </div>
            <div className="fv-row-actions">
              <Button
                onClick={() => {
                  setPicked(doctor);
                  setSlot("");
                }}
              >
                <CalendarDays size={15} /> Book slot
              </Button>
              <Button variant="secondary" onClick={() => setVideoDoctor(doctor)}>
                <Video size={15} /> Demo call
              </Button>
            </div>
            {booked.includes(doctor.name) && (
              <div className="fv-success-inline">
                <Check size={14} /> Consultation booked
              </div>
            )}
          </article>
        ))}
      </div>
      {picked && (
        <div className="fv-inline-drawer">
          <div>
            <small>Booking with</small>
            <h3>{picked.name}</h3>
            <p>Select an available time for a video consultation.</p>
          </div>
          <div className="fv-slot-list">
            {["09:30 AM", "11:00 AM", "02:30 PM", "05:15 PM"].map((time) => (
              <button
                className={slot === time ? "selected" : ""}
                key={time}
                onClick={() => setSlot(time)}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="fv-row-actions">
            <Button variant="ghost" onClick={() => setPicked(null)}>
              Close
            </Button>
            <Button
              disabled={!slot}
              onClick={() => {
                setBooked((old) => [...old, picked.name]);
                setDialog({
                  title: "Appointment confirmed",
                  body: (
                    <div className="fv-confirmation">
                      <CheckCircle2 size={36} />
                      <h3>{picked.name}</h3>
                      <p>Video consultation · 27 June 2025 at {slot}</p>
                      <Button onClick={() => setDialog(null)}>Done</Button>
                    </div>
                  ),
                });
                setPicked(null);
              }}
            >
              Confirm booking
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

type AppointmentStatus = "Upcoming" | "Completed" | "Cancelled";
type Appointment = {
  id: number;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  mode: string;
};

function AppointmentsView({ setDialog }: { setDialog: (value: DialogContent) => void }) {
  const [filter, setFilter] = useState<AppointmentStatus>("Upcoming");
  const [items, setItems] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "Dr. Sana Mirza",
      specialty: "Cardiology",
      date: "27 Jun 2025",
      time: "10:30 AM",
      status: "Upcoming",
      mode: "In clinic",
    },
    {
      id: 2,
      doctor: "Dr. Rohan Kulkarni",
      specialty: "General Medicine",
      date: "03 Jul 2025",
      time: "04:00 PM",
      status: "Upcoming",
      mode: "Video",
    },
    {
      id: 3,
      doctor: "Dr. Neha Deshmukh",
      specialty: "Dermatology",
      date: "12 May 2025",
      time: "11:15 AM",
      status: "Completed",
      mode: "In clinic",
    },
    {
      id: 4,
      doctor: "Dr. Ishaan Shah",
      specialty: "Pediatrics",
      date: "02 Apr 2025",
      time: "09:00 AM",
      status: "Cancelled",
      mode: "Video",
    },
  ]);
  const reschedule = (item: Appointment) =>
    setDialog({
      title: "Reschedule appointment",
      body: (
        <RescheduleForm
          appointment={item}
          onSave={(date, time) => {
            setItems((old) =>
              old.map((row) => (row.id === item.id ? { ...row, date, time } : row)),
            );
            setDialog(null);
          }}
        />
      ),
    });
  return (
    <>
      <div className="fv-tabs">
        {(["Upcoming", "Completed", "Cancelled"] as AppointmentStatus[]).map((item) => (
          <button
            key={item}
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
          >
            {item}
            <span>{items.filter((row) => row.status === item).length}</span>
          </button>
        ))}
      </div>
      <div className="fv-list">
        {items
          .filter((item) => item.status === filter)
          .map((item) => (
            <article className="fv-card fv-appointment" key={item.id}>
              <span className="fv-date-tile">
                <strong>{item.date.split(" ")[0]}</strong>
                <small>{item.date.split(" ")[1]}</small>
              </span>
              <div>
                <small>{item.specialty}</small>
                <h3>{item.doctor}</h3>
                <p>
                  <Clock3 size={14} /> {item.date} · {item.time} · {item.mode}
                </p>
              </div>
              <span className={`fv-status ${item.status.toLowerCase()}`}>{item.status}</span>
              {item.status === "Upcoming" && (
                <div className="fv-row-actions">
                  <Button variant="secondary" onClick={() => reschedule(item)}>
                    Reschedule
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() =>
                      setItems((old) =>
                        old.map((row) =>
                          row.id === item.id ? { ...row, status: "Cancelled" } : row,
                        ),
                      )
                    }
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {item.status === "Completed" && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setDialog({
                      title: "Visit summary",
                      body: (
                        <div className="fv-report-detail">
                          <p>
                            <strong>Assessment</strong>Routine follow-up completed. Continue the
                            clinician-approved care plan.
                          </p>
                          <p>
                            <strong>Next step</strong>Review again in 3 months or sooner if symptoms
                            change.
                          </p>
                        </div>
                      ),
                    })
                  }
                >
                  View summary
                </Button>
              )}
            </article>
          ))}
      </div>
    </>
  );
}

function RescheduleForm({
  appointment,
  onSave,
}: {
  appointment: Appointment;
  onSave: (date: string, time: string) => void;
}) {
  const [date, setDate] = useState("30 Jun 2025");
  const [time, setTime] = useState("11:30 AM");
  return (
    <div className="fv-form">
      <p>Choose a new date and available time for {appointment.doctor}.</p>
      <label>
        New date
        <select value={date} onChange={(event) => setDate(event.target.value)}>
          <option>30 Jun 2025</option>
          <option>01 Jul 2025</option>
          <option>04 Jul 2025</option>
        </select>
      </label>
      <label>
        New time
        <select value={time} onChange={(event) => setTime(event.target.value)}>
          <option>11:30 AM</option>
          <option>02:00 PM</option>
          <option>05:30 PM</option>
        </select>
      </label>
      <Button onClick={() => onSave(date, time)}>Save new schedule</Button>
    </div>
  );
}

const reports = [
  {
    id: 1,
    name: "Complete Blood Count",
    type: "Laboratory",
    date: "18 Jun 2025",
    doctor: "Dr. Rohan Kulkarni",
    values: [
      ["Haemoglobin", "14.2 g/dL", "13.0–17.0"],
      ["WBC", "7,400 /µL", "4,000–11,000"],
      ["Platelets", "245,000 /µL", "150,000–450,000"],
    ],
  },
  {
    id: 2,
    name: "Lipid Profile",
    type: "Laboratory",
    date: "03 Jun 2025",
    doctor: "Dr. Sana Mirza",
    values: [
      ["Total cholesterol", "184 mg/dL", "< 200"],
      ["HDL", "52 mg/dL", "> 40"],
      ["LDL", "108 mg/dL", "< 130"],
    ],
  },
  {
    id: 3,
    name: "Chest X-ray",
    type: "Imaging",
    date: "21 May 2025",
    doctor: "CityCare Radiology",
    values: [
      ["Study", "PA view", "—"],
      ["Reported finding", "No acute abnormality", "Radiologist report"],
      ["Image quality", "Diagnostic", "—"],
    ],
  },
];

function RecordsView({ setDialog }: { setDialog: (value: DialogContent) => void }) {
  const [consent, setConsent] = useState<Record<string, boolean>>({
    "Dr. Sana Mirza": true,
    "Dr. Rohan Kulkarni": false,
  });
  const [uploads, setUploads] = useState<{ name: string; size: string }[]>([]);
  const file = useRef<HTMLInputElement>(null);
  const show = (report: (typeof reports)[number]) =>
    setDialog({
      title: report.name,
      body: (
        <div className="fv-report-detail">
          <div className="fv-report-meta">
            <span>{report.type}</span>
            <span>{report.date}</span>
            <span>{report.doctor}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Test / finding</th>
                <th>Result</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {report.values.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="fv-disclaimer">
            Sample demonstration data. Lab values and imaging must be interpreted by your clinician
            in context.
          </p>
        </div>
      ),
    });
  return (
    <div className="fv-record-layout">
      <section>
        <div className="fv-section-inline">
          <SectionTitle
            icon={FileText}
            title="Reports & scans"
            text="Sample records stored in your health timeline"
          />
          <Button variant="secondary" onClick={() => file.current?.click()}>
            <Upload size={15} /> Upload report
          </Button>
          <input
            ref={file}
            hidden
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(event) => {
              const selected = event.target.files?.[0];
              if (selected)
                setUploads((old) => [
                  ...old,
                  { name: selected.name, size: `${(selected.size / 1024).toFixed(1)} KB` },
                ]);
            }}
          />
        </div>
        <div className="fv-list">
          {[...uploads.map((item, index) => ({ ...item, id: 100 + index })), ...reports].map(
            (report) => (
              <article className="fv-card fv-record" key={report.id}>
                <span>
                  <FileText size={20} />
                </span>
                <div>
                  <h3>{report.name}</h3>
                  <p>
                    {"type" in report
                      ? `${report.type} · ${report.date}`
                      : `Upload · ${report.size}`}
                  </p>
                </div>
                {"values" in report ? (
                  <Button variant="secondary" onClick={() => show(report)}>
                    View report
                  </Button>
                ) : (
                  <span className="fv-status upcoming">Ready to review</span>
                )}
              </article>
            ),
          )}
        </div>
      </section>
      <aside className="fv-card fv-consent">
        <SectionTitle
          icon={ShieldCheck}
          title="Doctor access"
          text="Control who can open selected records"
        />
        {Object.entries(consent).map(([doctor, enabled]) => (
          <label key={doctor}>
            <span>
              <strong>{doctor}</strong>
              <small>{enabled ? "Access allowed until 30 Jun" : "No current access"}</small>
            </span>
            <input
              type="checkbox"
              checked={enabled}
              onChange={() => setConsent((old) => ({ ...old, [doctor]: !enabled }))}
            />
          </label>
        ))}
        <p>Consent changes take effect immediately in this local demo.</p>
      </aside>
    </div>
  );
}

type Medicine = {
  id: number;
  name: string;
  dose: string;
  timing: string;
  remaining: number;
};

function MedicinesView() {
  const [medicines, setMedicines] = useState<Medicine[]>([
    { id: 1, name: "Metformin", dose: "500 mg", timing: "After breakfast", remaining: 12 },
    { id: 2, name: "Amlodipine", dose: "5 mg", timing: "9:00 PM", remaining: 7 },
    { id: 3, name: "Vitamin D3", dose: "60,000 IU", timing: "Sunday after lunch", remaining: 3 },
  ]);
  const [checked, setChecked] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  return (
    <div className="fv-med-layout">
      <section>
        <SectionTitle
          icon={Pill}
          title="Today’s medication"
          text={`${checked.length} of ${medicines.length} doses marked complete`}
        />
        <div className="fv-dose-progress">
          <span style={{ width: `${(checked.length / medicines.length) * 100}%` }} />
        </div>
        <div className="fv-list">
          {medicines.map((medicine) => (
            <article
              className={`fv-card fv-medicine ${checked.includes(medicine.id) ? "taken" : ""}`}
              key={medicine.id}
            >
              <button
                className="fv-dose-check"
                onClick={() =>
                  setChecked((old) =>
                    old.includes(medicine.id)
                      ? old.filter((id) => id !== medicine.id)
                      : [...old, medicine.id],
                  )
                }
              >
                {checked.includes(medicine.id) && <Check size={17} />}
              </button>
              <div>
                <small>{medicine.dose}</small>
                <h3>{medicine.name}</h3>
                <p>
                  <Clock3 size={13} /> {medicine.timing}
                </p>
              </div>
              <span className="fv-pill-count">{medicine.remaining} doses left</span>
              <Button
                variant="secondary"
                onClick={() => {
                  setMedicines((old) =>
                    old.map((row) => (row.id === medicine.id ? { ...row, remaining: 30 } : row)),
                  );
                  setNotice(`Refill request prepared for ${medicine.name}.`);
                }}
              >
                Request refill
              </Button>
            </article>
          ))}
        </div>
      </section>
      <aside className="fv-card fv-schedule">
        <h3>Daily schedule</h3>
        {[
          ["08:00", "Breakfast dose", "Metformin 500 mg"],
          ["13:00", "Lunch", "No medicines"],
          ["21:00", "Evening dose", "Amlodipine 5 mg"],
        ].map((row) => (
          <div key={row[0]}>
            <strong>{row[0]}</strong>
            <span>
              <b>{row[1]}</b>
              <small>{row[2]}</small>
            </span>
          </div>
        ))}
        {notice && <p className="fv-success-inline">{notice}</p>}
        <p className="fv-disclaimer">
          Always follow the prescription verified by you and your clinician. Do not change doses
          independently.
        </p>
      </aside>
    </div>
  );
}

type Vital = {
  id: number;
  day: string;
  bp: string;
  heart: number;
  glucose: number;
  spo2: number;
};

function VitalsView() {
  const [readings, setReadings] = useState<Vital[]>([
    { id: 1, day: "Wed", bp: "118/78", heart: 71, glucose: 96, spo2: 98 },
    { id: 2, day: "Thu", bp: "120/80", heart: 73, glucose: 101, spo2: 98 },
    { id: 3, day: "Fri", bp: "117/76", heart: 69, glucose: 94, spo2: 99 },
    { id: 4, day: "Sat", bp: "122/81", heart: 75, glucose: 105, spo2: 97 },
    { id: 5, day: "Sun", bp: "119/79", heart: 72, glucose: 98, spo2: 98 },
    { id: 6, day: "Mon", bp: "121/80", heart: 74, glucose: 100, spo2: 98 },
    { id: 7, day: "Tue", bp: "118/77", heart: 70, glucose: 97, spo2: 99 },
  ]);
  const [form, setForm] = useState({ sys: "", dia: "", heart: "", glucose: "", spo2: "" });
  const points = readings
    .slice(-7)
    .map((item, index) => `${index * 90 + 10},${115 - (item.heart - 60) * 3}`)
    .join(" ");
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const next: Vital = {
      id: Date.now(),
      day: "Now",
      bp: `${form.sys}/${form.dia}`,
      heart: Number(form.heart),
      glucose: Number(form.glucose),
      spo2: Number(form.spo2),
    };
    setReadings((old) => [...old.slice(-6), next]);
    setForm({ sys: "", dia: "", heart: "", glucose: "", spo2: "" });
  };
  const latest = readings[readings.length - 1];
  return (
    <div className="fv-vitals-layout">
      <section className="fv-card fv-vital-chart">
        <SectionTitle
          icon={Activity}
          title="7-day heart-rate trend"
          text="Updates immediately when you add a reading"
        />
        <div className="fv-metric-row">
          {[
            ["Blood pressure", latest.bp, "mmHg"],
            ["Heart rate", String(latest.heart), "bpm"],
            ["Blood sugar", String(latest.glucose), "mg/dL"],
            ["SpO₂", String(latest.spo2), "%"],
          ].map((value) => (
            <span key={value[0]}>
              <small>{value[0]}</small>
              <strong>{value[1]}</strong>
              <i>{value[2]}</i>
            </span>
          ))}
        </div>
        <svg viewBox="0 0 570 135" className="fv-line-chart" aria-label="Heart rate trend">
          <path d="M10 25H550M10 70H550M10 115H550" />
          <polyline points={points} />
          {readings.slice(-7).map((item, index) => (
            <circle key={item.id} cx={index * 90 + 10} cy={115 - (item.heart - 60) * 3} r="4" />
          ))}
        </svg>
        <div className="fv-chart-days">
          {readings.slice(-7).map((item) => (
            <span key={item.id}>{item.day}</span>
          ))}
        </div>
      </section>
      <form className="fv-card fv-form" onSubmit={save}>
        <SectionTitle icon={Plus} title="Log a reading" text="Enter values from a trusted device" />
        <div className="fv-split-fields">
          <label>
            Systolic
            <input
              required
              inputMode="numeric"
              value={form.sys}
              onChange={(event) => setForm({ ...form, sys: event.target.value })}
              placeholder="120"
            />
          </label>
          <label>
            Diastolic
            <input
              required
              inputMode="numeric"
              value={form.dia}
              onChange={(event) => setForm({ ...form, dia: event.target.value })}
              placeholder="80"
            />
          </label>
        </div>
        <label>
          Heart rate (bpm)
          <input
            required
            inputMode="numeric"
            value={form.heart}
            onChange={(event) => setForm({ ...form, heart: event.target.value })}
            placeholder="72"
          />
        </label>
        <label>
          Blood sugar (mg/dL)
          <input
            required
            inputMode="numeric"
            value={form.glucose}
            onChange={(event) => setForm({ ...form, glucose: event.target.value })}
            placeholder="98"
          />
        </label>
        <label>
          Oxygen saturation (%)
          <input
            required
            inputMode="numeric"
            min="70"
            max="100"
            value={form.spo2}
            onChange={(event) => setForm({ ...form, spo2: event.target.value })}
            placeholder="98"
          />
        </label>
        <Button type="submit">Save reading</Button>
      </form>
      <section className="fv-card fv-readings-table">
        <h3>Recent readings</h3>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>BP</th>
              <th>Heart</th>
              <th>Glucose</th>
              <th>SpO₂</th>
            </tr>
          </thead>
          <tbody>
            {[...readings]
              .reverse()
              .slice(0, 7)
              .map((row) => (
                <tr key={row.id}>
                  <td>{row.day}</td>
                  <td>{row.bp}</td>
                  <td>{row.heart}</td>
                  <td>{row.glucose}</td>
                  <td>{row.spo2}%</td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

const hospitals = [
  {
    name: "CityCare Multispeciality",
    distance: "1.8 km",
    rating: "4.7",
    general: 14,
    icu: 3,
    specialties: ["Emergency", "Cardiology", "Neurology"],
  },
  {
    name: "Sahyadri Medical Centre",
    distance: "3.2 km",
    rating: "4.5",
    general: 8,
    icu: 1,
    specialties: ["Orthopaedics", "Trauma", "Radiology"],
  },
  {
    name: "Lotus Women & Children",
    distance: "4.6 km",
    rating: "4.8",
    general: 11,
    icu: 2,
    specialties: ["Maternity", "Pediatrics", "NICU"],
  },
];

function HospitalsView({ setDialog }: { setDialog: (value: DialogContent) => void }) {
  const [query, setQuery] = useState("");
  const open = (hospital: (typeof hospitals)[number], type: "admit" | "directions") =>
    setDialog({
      title: type === "admit" ? "Admission enquiry" : "Directions",
      body:
        type === "admit" ? (
          <Admission hospital={hospital} done={() => setDialog(null)} />
        ) : (
          <div className="fv-confirmation">
            <Navigation size={35} />
            <h3>{hospital.name}</h3>
            <p>
              A {hospital.distance} route preview is ready. In a connected app, this opens your
              preferred maps provider.
            </p>
            <Button onClick={() => setDialog(null)}>Start simulated route</Button>
          </div>
        ),
    });
  return (
    <>
      <div className="fv-notice">
        <ShieldCheck size={18} />
        <span>
          <strong>Demonstration availability</strong>
          Bed counts below are realistic local mock data, not live hospital inventory.
        </span>
      </div>
      <label className="fv-search fv-wide-search">
        <Search size={17} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search hospital or specialty"
        />
      </label>
      <div className="fv-hospital-list">
        {hospitals
          .filter((item) =>
            `${item.name} ${item.specialties.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((hospital) => (
            <article className="fv-card fv-hospital" key={hospital.name}>
              <span className="fv-hospital-icon">
                <Hospital size={24} />
              </span>
              <div className="fv-hospital-info">
                <small>
                  <MapPin size={12} /> {hospital.distance} away · ★ {hospital.rating}
                </small>
                <h3>{hospital.name}</h3>
                <div className="fv-specialties">
                  {hospital.specialties.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="fv-beds">
                <span>
                  <BedDouble size={17} />
                  <small>General beds</small>
                  <strong>{hospital.general}</strong>
                </span>
                <span>
                  <HeartPulse size={17} />
                  <small>ICU beds</small>
                  <strong>{hospital.icu}</strong>
                </span>
              </div>
              <div className="fv-row-actions">
                <Button onClick={() => open(hospital, "admit")}>Book admission</Button>
                <Button variant="secondary" onClick={() => open(hospital, "directions")}>
                  <Navigation size={14} /> Directions
                </Button>
              </div>
            </article>
          ))}
      </div>
    </>
  );
}

function Admission({ hospital, done }: { hospital: (typeof hospitals)[number]; done: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  if (submitted)
    return (
      <div className="fv-confirmation">
        <CheckCircle2 size={38} />
        <h3>Enquiry recorded</h3>
        <p>
          {hospital.name} would verify availability and contact you. This demo did not reserve a
          live bed.
        </p>
        <Button onClick={done}>Done</Button>
      </div>
    );
  return (
    <form
      className="fv-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <p>
        Request verification from <strong>{hospital.name}</strong>.
      </p>
      <label>
        Care type
        <select>
          <option>General admission</option>
          <option>ICU enquiry</option>
          <option>Emergency assessment</option>
        </select>
      </label>
      <label>
        Patient note
        <textarea required placeholder="Briefly describe the admission need" />
      </label>
      <Button type="submit">Send enquiry</Button>
    </form>
  );
}

function EmergencyView() {
  const stages = ["Not started", "Dispatched", "En route", "Arrived"];
  const [confirmed, setConfirmed] = useState(false);
  const [stage, setStage] = useState(0);
  const [contacts, setContacts] = useState([
    { name: "Priya Mehta", status: "Ready" },
    { name: "Rahul Mehta", status: "Ready" },
  ]);
  const [firstAid, setFirstAid] = useState<string[]>([]);
  const advance = () => {
    if (stage < 3) setStage(stage + 1);
    if (stage === 0) setContacts((old) => old.map((item) => ({ ...item, status: "Alert sent" })));
  };
  return (
    <div className="fv-emergency-layout">
      <section className="fv-card fv-sos-panel">
        <span className="fv-sos-icon">
          <Ambulance size={33} />
        </span>
        <h2>{confirmed ? "Demo emergency case active" : "Emergency SOS"}</h2>
        <p>
          {confirmed
            ? "Use the controls below to step through a safe simulation of dispatch coordination."
            : "This local demonstration does not contact emergency services until connected to an authorized dispatch system."}
        </p>
        {!confirmed ? (
          <Button
            variant="danger"
            onClick={() => {
              setConfirmed(true);
              setStage(1);
              setContacts((old) => old.map((item) => ({ ...item, status: "Alert sent" })));
            }}
          >
            Confirm simulated SOS
          </Button>
        ) : (
          <>
            <div className="fv-case-id">DEMO CASE · HNA-240625-01</div>
            <Button disabled={stage === 3} onClick={advance}>
              {stage === 3 ? "Ambulance has arrived" : `Advance to ${stages[stage + 1]}`}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setConfirmed(false);
                setStage(0);
                setContacts((old) => old.map((item) => ({ ...item, status: "Ready" })));
              }}
            >
              End simulation
            </Button>
          </>
        )}
      </section>
      <section className="fv-card fv-tracker">
        <SectionTitle
          icon={Navigation}
          title="Ambulance tracker"
          text="Interactive demonstration — not live tracking"
        />
        <div className="fv-stage-track">
          {stages.slice(1).map((item, index) => (
            <div className={stage >= index + 1 ? "done" : ""} key={item}>
              <span>{stage > index + 1 ? <Check size={14} /> : index + 1}</span>
              <strong>{item}</strong>
              <small>
                {index === 0 ? "Unit assigned" : index === 1 ? "8 min mock ETA" : "At location"}
              </small>
            </div>
          ))}
        </div>
        <div className="fv-contact-list">
          <h3>Emergency contacts</h3>
          {contacts.map((contact) => (
            <div key={contact.name}>
              <span>
                <UserRound size={16} />
                {contact.name}
              </span>
              <strong>{contact.status}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="fv-card fv-first-aid">
        <SectionTitle
          icon={HeartHandshake}
          title="First-aid checklist"
          text="Follow dispatcher instructions when available"
        />
        {[
          "Move away from immediate danger",
          "Keep the person still and comfortable",
          "Do not give food or drink if unconscious",
          "Keep phone accessible for emergency responders",
        ].map((item) => (
          <label key={item}>
            <input
              type="checkbox"
              checked={firstAid.includes(item)}
              onChange={() =>
                setFirstAid((old) =>
                  old.includes(item) ? old.filter((row) => row !== item) : [...old, item],
                )
              }
            />
            <span>{item}</span>
          </label>
        ))}
        <div className="fv-emergency-number">
          <PhoneCall size={17} />
          <span>
            India emergency number <strong>112</strong>
          </span>
        </div>
      </section>
    </div>
  );
}

type Claim = { id: string; type: string; amount: string; status: string; date: string };

function InsuranceView() {
  const [claims, setClaims] = useState<Claim[]>([
    {
      id: "CLM-7821",
      type: "Outpatient consultation",
      amount: "₹3,200",
      status: "Under review",
      date: "18 Jun 2025",
    },
    {
      id: "CLM-6940",
      type: "Diagnostic tests",
      amount: "₹5,850",
      status: "Approved",
      date: "02 May 2025",
    },
  ]);
  const [form, setForm] = useState({ type: "Hospitalization", amount: "", note: "" });
  return (
    <div className="fv-insurance-layout">
      <section className="fv-policy-card">
        <div>
          <small>ACTIVE FAMILY FLOATER POLICY</small>
          <h2>HealthSecure Plus</h2>
          <p>Policy no. HS-2025-884291</p>
        </div>
        <ShieldCheck size={32} />
        <div className="fv-policy-numbers">
          <span>
            <small>Sum insured</small>
            <strong>₹10,00,000</strong>
          </span>
          <span>
            <small>Available</small>
            <strong>₹8,42,000</strong>
          </span>
          <span>
            <small>Renewal</small>
            <strong>31 Dec 2025</strong>
          </span>
        </div>
      </section>
      <form
        className="fv-card fv-form"
        onSubmit={(event) => {
          event.preventDefault();
          setClaims((old) => [
            {
              id: `CLM-${Math.floor(1000 + Math.random() * 8999)}`,
              type: form.type,
              amount: `₹${Number(form.amount).toLocaleString("en-IN")}`,
              status: "Submitted",
              date: "Just now",
            },
            ...old,
          ]);
          setForm({ type: "Hospitalization", amount: "", note: "" });
        }}
      >
        <SectionTitle
          icon={CircleDollarSign}
          title="Submit a claim"
          text="Add a reimbursement request"
        />
        <label>
          Claim type
          <select
            value={form.type}
            onChange={(event) => setForm({ ...form, type: event.target.value })}
          >
            <option>Hospitalization</option>
            <option>Outpatient consultation</option>
            <option>Diagnostic tests</option>
            <option>Pharmacy</option>
          </select>
        </label>
        <label>
          Claim amount (₹)
          <input
            required
            min="1"
            type="number"
            value={form.amount}
            onChange={(event) => setForm({ ...form, amount: event.target.value })}
          />
        </label>
        <label>
          Description
          <textarea
            required
            value={form.note}
            onChange={(event) => setForm({ ...form, note: event.target.value })}
            placeholder="Briefly describe the expense"
          />
        </label>
        <Button type="submit">Submit claim</Button>
      </form>
      <section className="fv-card fv-claims">
        <h3>Claim status tracker</h3>
        {claims.map((claim) => (
          <div key={claim.id}>
            <span>
              <small>
                {claim.id} · {claim.date}
              </small>
              <strong>{claim.type}</strong>
            </span>
            <b>{claim.amount}</b>
            <i className={claim.status.toLowerCase().replace(" ", "-")}>{claim.status}</i>
          </div>
        ))}
      </section>
    </div>
  );
}

function PreventiveView() {
  const [vaccines, setVaccines] = useState([
    { name: "Influenza", due: "Due in September", status: "Upcoming" },
    { name: "Tetanus booster", due: "Due 12 Aug 2025", status: "Due soon" },
    { name: "COVID-19 booster", due: "Completed 14 Jan 2025", status: "Complete" },
  ]);
  const [scheduled, setScheduled] = useState<string[]>([]);
  const schedule = (name: string) =>
    setScheduled((old) => (old.includes(name) ? old : [...old, name]));
  return (
    <div className="fv-preventive-layout">
      <section>
        <SectionTitle
          icon={Syringe}
          title="Immunization schedule"
          text="Reminders based on your saved profile"
        />
        <div className="fv-list">
          {vaccines.map((item) => (
            <article className="fv-card fv-vaccine" key={item.name}>
              <span className="fv-vaccine-icon">
                <Syringe size={20} />
              </span>
              <div>
                <small>{item.status}</small>
                <h3>{item.name}</h3>
                <p>{item.due}</p>
              </div>
              {item.status !== "Complete" && (
                <Button
                  variant="secondary"
                  onClick={() =>
                    setVaccines((old) =>
                      old.map((row) =>
                        row.name === item.name
                          ? { ...row, status: "Scheduled", due: "Scheduled for 08 Jul 2025" }
                          : row,
                      ),
                    )
                  }
                >
                  {item.status === "Scheduled" ? "Scheduled" : "Schedule"}
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>
      <section>
        <SectionTitle
          icon={HeartPulse}
          title="Recommended checkups"
          text="Preventive checks suggested for your profile"
        />
        <div className="fv-checkup-grid">
          {[
            ["Annual health check", "CBC, liver, kidney, thyroid", "Recommended this month"],
            ["Eye examination", "Vision and eye pressure", "Last done 14 months ago"],
            ["Dental checkup", "Routine oral health assessment", "Recommended every 6 months"],
          ].map((item) => (
            <article className="fv-card" key={item[0]}>
              <span>
                <CalendarDays size={19} />
              </span>
              <h3>{item[0]}</h3>
              <p>{item[1]}</p>
              <small>{item[2]}</small>
              <Button
                variant={scheduled.includes(item[0]) ? "ghost" : "secondary"}
                onClick={() => schedule(item[0])}
              >
                {scheduled.includes(item[0]) ? (
                  <>
                    <Check size={14} /> Scheduled for 05 Jul
                  </>
                ) : (
                  "Schedule checkup"
                )}
              </Button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function WellnessView() {
  const moods = ["Great", "Good", "Okay", "Low", "Struggling"];
  const [mood, setMood] = useState("");
  const [history, setHistory] = useState<{ mood: string; at: string }[]>([]);
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(false);
  const [counselor, setCounselor] = useState("");
  useEffect(() => {
    if (!running || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds((old) => old - 1), 1000);
    return () => window.clearInterval(timer);
  }, [running, seconds]);
  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);
  const phase = seconds % 8 >= 4 ? "Breathe out" : "Breathe in";
  return (
    <div className="fv-wellness-layout">
      <section className="fv-card">
        <SectionTitle icon={Brain} title="Mood check-in" text="How are you feeling right now?" />
        <div className="fv-moods">
          {moods.map((item, index) => (
            <button
              className={mood === item ? "selected" : ""}
              key={item}
              onClick={() => setMood(item)}
            >
              <span>{["😊", "🙂", "😐", "😔", "😟"][index]}</span>
              {item}
            </button>
          ))}
        </div>
        <Button
          disabled={!mood}
          onClick={() => {
            setHistory((old) => [{ mood, at: "Today, just now" }, ...old]);
            setMood("");
          }}
        >
          Save check-in
        </Button>
        {history.map((item, index) => (
          <div className="fv-mood-history" key={index}>
            <CheckCircle2 size={15} />
            <span>
              <strong>{item.mood}</strong>
              {item.at}
            </span>
          </div>
        ))}
      </section>
      <section className="fv-card fv-breathe">
        <SectionTitle icon={Wind} title="Guided breathing" text="A simple one-minute reset" />
        <div className={running ? "fv-breath-orb running" : "fv-breath-orb"}>
          <strong>{running ? phase : seconds === 0 ? "Complete" : "Ready"}</strong>
          <span>{seconds}s</span>
        </div>
        <div className="fv-row-actions">
          <Button
            onClick={() => {
              if (seconds === 0) setSeconds(60);
              setRunning(!running);
            }}
          >
            {running ? "Pause" : seconds === 0 ? "Restart" : "Start breathing"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setRunning(false);
              setSeconds(60);
            }}
          >
            Reset
          </Button>
        </div>
      </section>
      <section className="fv-card fv-counselors">
        <SectionTitle
          icon={HeartHandshake}
          title="Counselor support"
          text="Book a confidential demonstration consultation"
        />
        {["Ananya Rao · Clinical Psychologist", "Kabir Joshi · Wellness Counselor"].map((name) => (
          <div key={name}>
            <span className="fv-doctor-avatar">{name[0]}</span>
            <p>
              <strong>{name.split(" · ")[0]}</strong>
              <small>{name.split(" · ")[1]} · Next: Tomorrow</small>
            </p>
            <Button variant="secondary" onClick={() => setCounselor(name)}>
              {counselor === name ? "Booked · 4:00 PM" : "Book"}
            </Button>
          </div>
        ))}
        <p className="fv-disclaimer">
          If you may harm yourself or someone else, call 112 or go to the nearest emergency
          department now.
        </p>
      </section>
    </div>
  );
}

type FamilyMember = {
  id: number;
  name: string;
  relation: string;
  age: number;
  blood: string;
  records: number;
  appointment: string;
};

function FamilyView() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: 1,
      name: "Aarav Mehta",
      relation: "Self",
      age: 31,
      blood: "B+",
      records: 6,
      appointment: "Dr. Sana · 27 Jun",
    },
    {
      id: 2,
      name: "Priya Mehta",
      relation: "Spouse",
      age: 29,
      blood: "O+",
      records: 4,
      appointment: "No upcoming visit",
    },
    {
      id: 3,
      name: "Anita Mehta",
      relation: "Mother",
      age: 61,
      blood: "A+",
      records: 11,
      appointment: "Dr. Kulkarni · 02 Jul",
    },
  ]);
  const [active, setActive] = useState(1);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", relation: "Child", age: "", blood: "O+" });
  const member = members.find((item) => item.id === active) ?? members[0];
  return (
    <div className="fv-family-layout">
      <aside className="fv-card fv-family-switcher">
        <div className="fv-section-inline">
          <h3>Family profiles</h3>
          <button className="fv-icon-button" onClick={() => setAdding(!adding)}>
            <Plus size={18} />
          </button>
        </div>
        {members.map((item) => (
          <button
            key={item.id}
            className={active === item.id ? "active" : ""}
            onClick={() => setActive(item.id)}
          >
            <span>{item.name[0]}</span>
            <p>
              <strong>{item.name}</strong>
              <small>{item.relation}</small>
            </p>
            <ChevronRight size={16} />
          </button>
        ))}
        {adding && (
          <form
            className="fv-form fv-add-member"
            onSubmit={(event) => {
              event.preventDefault();
              const next = {
                id: Date.now(),
                name: form.name,
                relation: form.relation,
                age: Number(form.age),
                blood: form.blood,
                records: 0,
                appointment: "No upcoming visit",
              };
              setMembers((old) => [...old, next]);
              setActive(next.id);
              setAdding(false);
              setForm({ name: "", relation: "Child", age: "", blood: "O+" });
            }}
          >
            <input
              required
              placeholder="Full name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
            />
            <div className="fv-split-fields">
              <select
                value={form.relation}
                onChange={(event) => setForm({ ...form, relation: event.target.value })}
              >
                <option>Child</option>
                <option>Parent</option>
                <option>Spouse</option>
                <option>Sibling</option>
              </select>
              <input
                required
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={(event) => setForm({ ...form, age: event.target.value })}
              />
            </div>
            <Button type="submit">Add member</Button>
          </form>
        )}
      </aside>
      <section>
        <div className="fv-family-hero">
          <span>{member.name[0]}</span>
          <div>
            <small>{member.relation}</small>
            <h2>{member.name}</h2>
            <p>
              {member.age} years · Blood group {member.blood}
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() =>
              setMembers((old) =>
                old.map((item) =>
                  item.id === member.id
                    ? {
                        ...item,
                        appointment:
                          item.appointment === "No upcoming visit"
                            ? "General consultation · 05 Jul"
                            : item.appointment,
                      }
                    : item,
                ),
              )
            }
          >
            Book appointment
          </Button>
        </div>
        <div className="fv-family-cards">
          <article className="fv-card">
            <FileHeart size={21} />
            <small>Medical records</small>
            <strong>{member.records}</strong>
            <p>Reports and prescriptions shared with this family profile.</p>
            <Button
              variant="ghost"
              onClick={() =>
                setMembers((old) =>
                  old.map((item) =>
                    item.id === member.id ? { ...item, records: item.records + 1 } : item,
                  ),
                )
              }
            >
              Add sample record
            </Button>
          </article>
          <article className="fv-card">
            <CalendarDays size={21} />
            <small>Next appointment</small>
            <strong className="fv-family-appointment">{member.appointment}</strong>
            <p>Manage this family member’s scheduled care.</p>
          </article>
          <article className="fv-card">
            <ShieldCheck size={21} />
            <small>Profile access</small>
            <strong>Managed by you</strong>
            <p>Consent and visibility are controlled independently per member.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default function FeatureViews({
  active,
  onBack,
}: {
  active: FeatureId;
  onBack: () => void;
}) {
  const [dialog, setDialog] = useState<DialogContent>(null);
  const feature = featureCatalog.find((item) => item.id === active) ?? featureCatalog[0];
  const Icon = feature.icon;
  return (
    <div className="feature-view">
      <header className="fv-page-header">
        <button onClick={onBack} className="fv-back">
          <ArrowLeft size={18} /> Back
        </button>
        <span className="fv-page-icon">
          <Icon size={22} />
        </span>
        <div>
          <h1>{feature.title}</h1>
          <p>{feature.description}</p>
        </div>
      </header>
      <div className="fv-content">
        {active === "symptoms" && <SymptomView />}
        {active === "doctors" && <DoctorsView setDialog={setDialog} />}
        {active === "appointments" && <AppointmentsView setDialog={setDialog} />}
        {active === "records" && <RecordsView setDialog={setDialog} />}
        {active === "medicines" && <MedicinesView />}
        {active === "vitals" && <VitalsView />}
        {active === "hospitals" && <HospitalsView setDialog={setDialog} />}
        {active === "emergency" && <EmergencyView />}
        {active === "insurance" && <InsuranceView />}
        {active === "preventive" && <PreventiveView />}
        {active === "wellness" && <WellnessView />}
        {active === "family" && <FamilyView />}
      </div>
      <Dialog content={dialog} close={() => setDialog(null)} />
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './App.css'

type IconName = 'grid' | 'scan' | 'car' | 'clock' | 'bell' | 'spark' | 'settings' | 'search' | 'chevron' | 'arrow' | 'camera' | 'check' | 'alert' | 'logout' | 'menu' | 'close' | 'send' | 'filter' | 'download' | 'plus' | 'eye' | 'pin' | 'calendar' | 'shield' | 'user'
type Section = 'Resumen' | 'Control vehicular' | 'Vehículos' | 'Historial' | 'Alertas' | 'Agente inteligente'
type Vehicle = { plate: string; make: string; model: string; color: string; status: 'Autorizado' | 'Pendiente' | 'Alerta'; owner: string; time: string; location: string }

const initialVehicles: Vehicle[] = [
  { plate: 'ABC-123', make: 'Toyota', model: 'Corolla', color: 'Blanco', status: 'Autorizado', owner: 'María González', time: '10:42:18', location: 'Entrada principal' },
  { plate: 'XYZ-789', make: 'Honda', model: 'Civic', color: 'Gris', status: 'Autorizado', owner: 'Carlos Méndez', time: '10:38:05', location: 'Entrada principal' },
  { plate: 'DEF-456', make: 'Nissan', model: 'Sentra', color: 'Azul', status: 'Alerta', owner: 'No registrado', time: '10:31:52', location: 'Estacionamiento B' },
  { plate: 'GHI-012', make: 'Mazda', model: 'CX-5', color: 'Negro', status: 'Pendiente', owner: 'Ana Ruiz', time: '10:24:09', location: 'Entrada norte' },
]

const navItems: { label: Section; icon: IconName }[] = [
  { label: 'Resumen', icon: 'grid' },
  { label: 'Control vehicular', icon: 'scan' },
  { label: 'Vehículos', icon: 'car' },
  { label: 'Historial', icon: 'clock' },
  { label: 'Alertas', icon: 'bell' },
  { label: 'Agente inteligente', icon: 'spark' },
]

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path d="M4 12h16M8 9v6m8-6v6" /></>,
    car: <><path d="m5 11 1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><path d="M3 11h18v7H3zM6 18v2m12-2v2M3 14h3m12 0h3" /><circle cx="7" cy="14.5" r=".5" /><circle cx="17" cy="14.5" r=".5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1 2.5 2 1-2 1L19 21l-1-2.5-2-1 2-1 1-2.5Z" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.4 1.1-1.5 2.6-1.7-.7a8 8 0 0 1-1.5.9l-.3 1.8h-3l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.7-1.5-2.6 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.5-2.6 1.7.7a8 8 0 0 1 1.5-.9l.3-1.8h3l.3 1.8a8 8 0 0 1 1.5.9l1.7-.7 1.5 2.6-1.4 1.1a7 7 0 0 1 0 1.8Z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    camera: <><path d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v9H2V9a2 2 0 0 1 2-2Z" /><circle cx="12" cy="12" r="3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    alert: <><path d="m10.3 4.3-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-2.7l-8-14a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4m0 4h.01" /></>,
    logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m4-5 5 5 5-5m-5 5V3" /></>,
    plus: <><path d="M12 5v14m-7-7h14" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M5 21a7 7 0 0 1 14 0" /></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function InstallAppButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    function handleInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }

    function handleInstalled() {
      setInstallPrompt(null)
      setMessage('PlacaSegura quedó instalada en tu dispositivo.')
    }

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function installApp() {
    if (!installPrompt) {
      if (!window.isSecureContext) {
        setMessage('Para instalarla como aplicación completa se necesita una URL HTTPS. Por ahora puedes abrir la página en el celular y crear un acceso directo desde el menú del navegador.')
      } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        setMessage('En Safari, toca Compartir y elige “Añadir a pantalla de inicio”.')
      } else {
        setMessage('Abre el menú del navegador y toca “Instalar aplicación” o “Añadir a pantalla de inicio”.')
      }
      return
    }

    try {
      await installPrompt.prompt()
      const choice = await installPrompt.userChoice
      setInstallPrompt(null)
      setMessage(choice.outcome === 'accepted' ? 'PlacaSegura quedó instalada en tu dispositivo.' : 'Puedes instalar PlacaSegura más tarde desde el menú del navegador.')
    } catch (error) {
      console.error('No se pudo iniciar la instalación de PlacaSegura.', error)
      setMessage('No se pudo iniciar la instalación. Inténtalo desde el menú del navegador.')
    }
  }

  return (
    <div className="install-app">
      <button className="install-app-button" type="button" onClick={installApp}>
        <span className="install-app-icon"><Icon name="download" size={16} /></span>
        <span>Instalar PlacaSegura en este dispositivo</span>
        <Icon name="chevron" size={16} />
      </button>
      {message && <p className="install-app-message" role="status">{message}</p>}
    </div>
  )
}

function Login({ onLogin }: { onLogin: (role: 'Administrador' | 'Docente', name: string) => void }) {
  const [role, setRole] = useState<'Administrador' | 'Docente'>('Administrador')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña para continuar.')
      return
    }
    onLogin(role, email.split('@')[0].replace(/[._-]/g, ' '))
  }

  return (
    <main className="login-page">
      <section className="login-art">
        <div className="brand brand-light"><span className="brand-mark"><Icon name="scan" size={21} /></span><span>Placa<span className="brand-accent">Segura</span></span></div>
        <div className="login-art-content">
          <div className="eyebrow"><span className="status-dot" /> SISTEMA DE CONTROL VEHICULAR</div>
          <h1>Tu campus,<br />siempre <em>seguro.</em></h1>
          <p>Reconocimiento inteligente de placas para una comunidad protegida y conectada.</p>
          <div className="security-visual">
            <div className="visual-top"><span><span className="status-dot" /> CÁMARA EN VIVO</span><span>CAM 01 · ENTRADA</span></div>
            <div className="visual-road">
              <div className="scan-line" />
              <div className="visual-car"><div className="car-window" /><div className="plate-mini">ABC · 123</div><i /><b /></div>
              <span className="corner corner-tl" /><span className="corner corner-tr" /><span className="corner corner-bl" /><span className="corner corner-br" />
              <span className="visual-label"><Icon name="check" size={13} /> PLACA DETECTADA · 98.4%</span>
            </div>
            <div className="visual-bottom"><span>LECTURA RECONOCIDA</span><strong>ABC-123</strong><span className="access-ok"><Icon name="check" size={13} /> ACCESO AUTORIZADO</span></div>
          </div>
        </div>
        <div className="login-art-foot"><span>TECNOLOGÍA AL SERVICIO DE TU COMUNIDAD</span><span>© 2026 PlacaSegura</span></div>
      </section>
      <section className="login-form-side">
        <div className="login-form-wrap">
          <div className="mobile-brand brand"><span className="brand-mark"><Icon name="scan" size={21} /></span><span>Placa<span className="brand-accent">Segura</span></span></div>
          <div className="form-heading"><span className="form-kicker">BIENVENIDO DE NUEVO</span><h2>Inicia sesión</h2><p>Ingresa a tu cuenta para continuar.</p></div>
          <div className="role-picker" aria-label="Tipo de usuario">
            {(['Administrador', 'Docente'] as const).map((item) => <button key={item} type="button" className={role === item ? 'role-option selected' : 'role-option'} onClick={() => setRole(item)}><Icon name={item === 'Administrador' ? 'shield' : 'user'} size={17} />{item}</button>)}
          </div>
          <form onSubmit={submit} className="login-form">
            <label htmlFor="email">Correo institucional</label>
            <div className="input-wrap"><Icon name="user" size={17} /><input id="email" type="email" placeholder="nombre@institucion.edu" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            <div className="password-label"><label htmlFor="password">Contraseña</label><a href="#ayuda" onClick={(event) => event.preventDefault()}>¿La olvidaste?</a></div>
            <div className="input-wrap"><span className="lock-icon"><Icon name="shield" size={17} /></span><input id="password" type="password" placeholder="Ingresa tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="primary-button login-submit">Ingresar al sistema <Icon name="chevron" size={17} /></button>
          </form>
          <InstallAppButton />
          <div className="login-note"><Icon name="shield" size={16} /><span>Acceso protegido y monitoreado.<br />Tu información está segura.</span></div>
          <p className="login-help">¿Necesitas ayuda? <a href="mailto:soporte@placasegura.edu">Contacta a soporte</a></p>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [user, setUser] = useState<{ role: 'Administrador' | 'Docente'; name: string } | null>(null)
  const [section, setSection] = useState<Section>('Resumen')
  const [vehicles, setVehicles] = useState(initialVehicles)
  const [search, setSearch] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const [chat, setChat] = useState<{ by: 'assistant' | 'user'; text: string }[]>([
    { by: 'assistant', text: '¡Hola! Soy tu agente inteligente. Puedo ayudarte a consultar placas, revisar alertas o encontrar vehículos en el campus.' },
  ])
  const [plateInput, setPlateInput] = useState('')
  const [notice, setNotice] = useState('')
  const filteredVehicles = useMemo(() => vehicles.filter((vehicle) => `${vehicle.plate} ${vehicle.make} ${vehicle.model} ${vehicle.owner}`.toLowerCase().includes(search.toLowerCase())), [vehicles, search])

  if (!user) return <Login onLogin={(role, name) => setUser({ role, name })} />

  const displayName = user.name.replace(/\b\w/g, (letter) => letter.toUpperCase()) || user.role
  function addVehicle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const plate = plateInput.trim().toUpperCase()
    if (!plate) return
    if (vehicles.some((vehicle) => vehicle.plate === plate)) {
      setNotice(`La placa ${plate} ya está registrada.`)
      return
    }
    setVehicles([{ plate, make: 'Por definir', model: 'Vehículo nuevo', color: '—', status: 'Autorizado', owner: 'Nuevo registro', time: 'Ahora', location: 'Registro manual' }, ...vehicles])
    setPlateInput('')
    setNotice(`Vehículo ${plate} agregado correctamente.`)
  }
  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = query.trim()
    if (!message) return
    setChat((messages) => [...messages, { by: 'user', text: message }, { by: 'assistant', text: 'Puedo ayudarte a revisar los registros de hoy. Se han detectado 128 vehículos, con 3 alertas que requieren revisión. ¿Quieres consultar una placa en particular?' }])
    setQuery('')
  }

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" aria-label="Cerrar menú" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <a className="brand sidebar-brand" href="#inicio" onClick={(event) => { event.preventDefault(); setSection('Resumen') }}><span className="brand-mark"><Icon name="scan" size={21} /></span><span>Placa<span className="brand-accent">Segura</span></span></a>
        <div className="workspace-label">ESPACIO DE TRABAJO</div>
        <div className="campus-select"><span className="campus-emblem">I</span><span className="campus-copy"><strong>Instituto Central</strong><small>Campus principal</small></span><Icon name="chevron" size={15} /></div>
        <div className="nav-label">MENÚ PRINCIPAL</div>
        <nav className="main-nav" aria-label="Navegación principal">
          {navItems.map(({ label, icon }) => <button key={label} className={`nav-item ${section === label ? 'active' : ''}`} onClick={() => { setSection(label); setMobileNav(false) }}><Icon name={icon} /><span>{label}</span>{label === 'Alertas' && <span className="nav-badge">3</span>}</button>)}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-item settings-item" onClick={() => setNotice('La configuración estará disponible próximamente.')}><Icon name="settings" /><span>Configuración</span></button>
          <div className="sidebar-divider" />
          <div className="profile-card"><div className="avatar">{displayName.slice(0, 1)}</div><div className="profile-info"><strong>{displayName}</strong><span>{user.role}</span></div><button className="icon-button logout-button" title="Cerrar sesión" onClick={() => setUser(null)}><Icon name="logout" size={17} /></button></div>
        </div>
      </aside>
      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu icon-button" aria-label="Abrir menú" onClick={() => setMobileNav(true)}><Icon name="menu" /></button>
          <div className="breadcrumb"><span>Instituto Central</span><Icon name="chevron" size={14} /><strong>{section}</strong></div>
          <div className="top-actions"><div className="system-status"><span className="status-dot" /> Sistema activo</div><button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => setSection('Alertas')}><Icon name="bell" size={19} /><i /></button><div className="top-avatar">{displayName.slice(0, 1)}</div></div>
        </header>
        <div className="page-content">
          {notice && <button className="toast-message" onClick={() => setNotice('')}><Icon name="check" size={16} />{notice}<Icon name="close" size={15} /></button>}
          {section === 'Resumen' && <Dashboard setSection={setSection} vehicles={vehicles} />}
          {section === 'Control vehicular' && <Control vehicles={vehicles} plateInput={plateInput} setPlateInput={setPlateInput} addVehicle={addVehicle} />}
          {section === 'Vehículos' && <VehicleDirectory vehicles={filteredVehicles} search={search} setSearch={setSearch} addVehicle={addVehicle} plateInput={plateInput} setPlateInput={setPlateInput} />}
          {section === 'Historial' && <History vehicles={filteredVehicles} search={search} setSearch={setSearch} />}
          {section === 'Alertas' && <Alerts vehicles={vehicles.filter((vehicle) => vehicle.status === 'Alerta' || vehicle.status === 'Pendiente')} />}
          {section === 'Agente inteligente' && <Assistant chat={chat} query={query} setQuery={setQuery} sendMessage={sendMessage} />}
        </div>
      </main>
    </div>
  )
}

function PageHeading({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: ReactNode }) {
  return <div className="page-heading"><div><div className="page-eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{children && <div className="heading-actions">{children}</div>}</div>
}

function Dashboard({ setSection, vehicles }: { setSection: (section: Section) => void; vehicles: Vehicle[] }) {
  const latest = vehicles.slice(0, 4)
  return <>
    <PageHeading eyebrow="MIÉRCOLES, 25 DE NOVIEMBRE" title="Buenos días 👋" description="Aquí tienes el resumen de actividad de tu campus." >
      <button className="outline-button" onClick={() => setSection('Historial')}><Icon name="calendar" size={16} /> Hoy, 25 nov <Icon name="chevron" size={14} /></button>
      <button className="primary-button" onClick={() => setSection('Control vehicular')}><Icon name="scan" size={16} /> Control vehicular</button>
    </PageHeading>
    <div className="metrics-grid">
      <Metric icon="scan" label="Lecturas de hoy" number="128" note="+12.8%" tone="mint" />
      <Metric icon="shield" label="Vehículos autorizados" number="116" note="90.6% del total" tone="blue" />
      <Metric icon="alert" label="Alertas activas" number="03" note="Requieren atención" tone="coral" />
      <Metric icon="car" label="Vehículos registrados" number={String(vehicles.length + 243)} note="En el campus" tone="violet" />
    </div>
    <div className="dashboard-grid">
      <section className="content-card activity-card">
        <div className="card-heading"><div><h2>Actividad vehicular</h2><p>Lecturas registradas durante el día</p></div><button className="select-button">Esta semana <Icon name="chevron" size={14} /></button></div>
        <div className="chart-legend"><span><i className="legend-dot legend-main" /> Entradas</span><span><i className="legend-dot legend-secondary" /> Salidas</span></div>
        <div className="chart-area">
          <div className="chart-y-labels"><span>160</span><span>120</span><span>80</span><span>40</span><span>0</span></div>
          <div className="chart-content"><div className="chart-gridlines"><i /><i /><i /><i /><i /></div><div className="chart-bars">{[{ day: 'Lun', a: 42, b: 25 }, { day: 'Mar', a: 64, b: 43 }, { day: 'Mié', a: 52, b: 35 }, { day: 'Jue', a: 78, b: 48 }, { day: 'Vie', a: 58, b: 34 }, { day: 'Sáb', a: 36, b: 22 }, { day: 'Dom', a: 48, b: 29 }].map((item) => <div className="bar-group" key={item.day}><div className="bar-pair"><i className="bar-primary" style={{ height: `${item.a}%` }} /><i className="bar-secondary" style={{ height: `${item.b}%` }} /></div><span>{item.day}</span></div>)}</div></div>
        </div>
      </section>
      <section className="content-card alerts-card">
        <div className="card-heading"><div><h2>Alertas recientes</h2><p>Eventos que necesitan tu atención</p></div><button className="text-button" onClick={() => setSection('Alertas')}>Ver todas <Icon name="chevron" size={14} /></button></div>
        <div className="alert-list">
          <AlertRow tone="red" title="Vehículo no registrado" description="Placa DEF-456 · Entrada principal" time="Hace 8 min" />
          <AlertRow tone="amber" title="Placa parcialmente visible" description="Placa GHI-012 · Entrada norte" time="Hace 24 min" />
          <AlertRow tone="blue" title="Vehículo fuera de horario" description="Placa JKL-345 · Estacionamiento B" time="Hace 1 h" />
        </div>
        <button className="all-alerts-button" onClick={() => setSection('Alertas')}>Ir al centro de alertas <Icon name="arrow" size={15} /></button>
      </section>
    </div>
    <section className="content-card recent-card">
      <div className="card-heading"><div><h2>Últimos registros</h2><p>Movimientos vehiculares recientes en el campus</p></div><button className="text-button" onClick={() => setSection('Historial')}>Ver historial completo <Icon name="chevron" size={14} /></button></div>
      <VehicleTable vehicles={latest} />
    </section>
  </>
}

function Metric({ icon, label, number, note, tone }: { icon: IconName; label: string; number: string; note: string; tone: string }) {
  return <article className="metric-card"><div className={`metric-icon ${tone}`}><Icon name={icon} size={19} /></div><span className="metric-label">{label}</span><div className="metric-number">{number}</div><div className={`metric-note ${tone === 'coral' ? 'note-alert' : ''}`}><span>{tone === 'mint' ? '↗ ' : ''}{note}</span></div><div className={`metric-spark ${tone}`}><svg viewBox="0 0 100 32" preserveAspectRatio="none"><path d={tone === 'coral' ? 'M0 25 C15 26 15 11 28 16 S45 26 54 13 73 18 82 8 92 14 100 4' : 'M0 25 C12 20 17 27 28 16 S42 22 53 13 69 17 78 8 89 13 100 3'} /></svg></div></article>
}

function AlertRow({ tone, title, description, time }: { tone: string; title: string; description: string; time: string }) {
  return <div className="alert-row"><span className={`alert-icon ${tone}`}><Icon name={tone === 'red' ? 'alert' : tone === 'amber' ? 'eye' : 'clock'} size={16} /></span><div className="alert-copy"><strong>{title}</strong><span>{description}</span></div><span className="alert-time">{time}</span></div>
}

function VehicleTable({ vehicles }: { vehicles: Vehicle[] }) {
  return <div className="table-scroll"><table className="vehicle-table"><thead><tr><th>PLACA</th><th>VEHÍCULO</th><th>PROPIETARIO</th><th>UBICACIÓN</th><th>HORA</th><th>ESTADO</th></tr></thead><tbody>{vehicles.length ? vehicles.map((vehicle) => <tr key={vehicle.plate}><td><span className="plate-tag">{vehicle.plate}</span></td><td><div className="vehicle-name"><span className="table-car"><Icon name="car" size={17} /></span><span><strong>{vehicle.make} {vehicle.model}</strong><small>{vehicle.color}</small></span></div></td><td>{vehicle.owner}</td><td><span className="location-cell"><Icon name="pin" size={14} />{vehicle.location}</span></td><td>{vehicle.time}</td><td><StatusBadge status={vehicle.status} /></td></tr>) : <tr><td className="empty-row" colSpan={6}>No se encontraron vehículos.</td></tr>}</tbody></table></div>
}

function StatusBadge({ status }: { status: Vehicle['status'] }) {
  return <span className={`status-badge ${status === 'Autorizado' ? 'status-authorized' : status === 'Alerta' ? 'status-alert' : 'status-pending'}`}><i />{status}</span>
}

function Control({ vehicles, plateInput, setPlateInput, addVehicle }: { vehicles: Vehicle[]; plateInput: string; setPlateInput: (value: string) => void; addVehicle: (event: FormEvent<HTMLFormElement>) => void }) {
  const [cameraActive, setCameraActive] = useState(true)
  const [lookupValue, setLookupValue] = useState('ABC-123')
  const [lookupResult, setLookupResult] = useState<Vehicle | null | undefined>(undefined)
  return <>
    <PageHeading eyebrow="ACCESO Y MONITOREO" title="Control vehicular" description="Supervisa entradas y salidas en tiempo real." >
      <span className="live-pill"><i /> Monitoreo activo</span>
    </PageHeading>
    <div className="control-layout">
      <section className="content-card camera-card"><div className="card-heading"><div><h2>Entrada principal</h2><p><span className="camera-online" /> Cámara CAM-01 · En línea</p></div><button className="outline-button small-button" onClick={() => setCameraActive(!cameraActive)}><Icon name={cameraActive ? 'eye' : 'close'} size={15} />{cameraActive ? 'Vista en vivo' : 'Cámara pausada'}</button></div><div className={`camera-preview ${cameraActive ? '' : 'camera-paused'}`}><div className="camera-overlay"><span>CAM-01</span><span>REC <i /></span></div><div className="camera-scanner"><span /><i /><b /><em /></div><div className="road-lane" /><div className="preview-car"><i /><b /><span>ABC-123</span></div>{cameraActive && <div className="camera-detection"><Icon name="check" size={15} /> PLACA DETECTADA · ABC-123 <span>98.4%</span></div>}</div><div className="camera-footer"><span><span className="status-dot" /> Última lectura: hace unos segundos</span><button className="text-button">Pantalla completa <Icon name="arrow" size={14} /></button></div></section>
      <section className="content-card manual-card"><div className="card-heading"><div><h2>Verificar una placa</h2><p>Consulta el acceso de un vehículo</p></div><span className="manual-icon"><Icon name="scan" size={18} /></span></div><form className="plate-form" onSubmit={(event) => { event.preventDefault(); const plate = lookupValue.trim().toUpperCase(); setLookupValue(plate); setLookupResult(vehicles.find((vehicle) => vehicle.plate === plate) ?? null) }}><label htmlFor="plate-search">Número de placa</label><input id="plate-search" required placeholder="Ej. ABC-123" value={lookupValue} onChange={(event) => setLookupValue(event.target.value.toUpperCase())} /><button className="primary-button" type="submit"><Icon name="search" size={16} /> Verificar placa</button></form><div className="verification-result"><div className={`result-check ${lookupResult === null ? 'result-denied' : ''}`}><Icon name={lookupResult === null ? 'alert' : 'check'} size={17} /></div><div><strong>{lookupResult === undefined ? 'Última verificación' : lookupResult ? 'Vehículo encontrado' : 'Sin registro'}</strong><span>{lookupResult ? `${lookupResult.plate} · ${lookupResult.make} ${lookupResult.model}` : lookupResult === null ? `${lookupValue} · No está en el registro` : 'ABC-123 · Toyota Corolla'}</span><small>{lookupResult ? `${lookupResult.status} · ${lookupResult.time}` : lookupResult === null ? 'Acceso pendiente de autorización' : 'Acceso autorizado · 10:42:18'}</small></div>{lookupResult && <StatusBadge status={lookupResult.status} />}{lookupResult === null && <span className="status-badge status-alert"><i />No registrado</span>}</div><div className="manual-add"><span>¿No encuentras el vehículo?</span><form onSubmit={addVehicle}><input aria-label="Nueva placa" placeholder="Agregar placa" value={plateInput} onChange={(event) => setPlateInput(event.target.value.toUpperCase())} /><button type="submit" title="Agregar vehículo"><Icon name="plus" size={17} /></button></form></div></section>
    </div>
    <section className="content-card recent-card"><div className="card-heading"><div><h2>Actividad reciente</h2><p>Lecturas de placas más recientes</p></div><span className="live-pill"><i /> En vivo</span></div><VehicleTable vehicles={vehicles.slice(0, 4)} /></section>
  </>
}

function VehicleDirectory({ vehicles, search, setSearch, addVehicle, plateInput, setPlateInput }: { vehicles: Vehicle[]; search: string; setSearch: (value: string) => void; addVehicle: (event: FormEvent<HTMLFormElement>) => void; plateInput: string; setPlateInput: (value: string) => void }) {
  return <>
    <PageHeading eyebrow="REGISTRO DEL CAMPUS" title="Vehículos" description="Administra los vehículos autorizados para ingresar al campus.">
      <button className="outline-button" onClick={() => window.print()}><Icon name="download" size={16} /> Exportar</button>
    </PageHeading>
    <section className="content-card directory-card"><div className="directory-toolbar"><div className="table-search"><Icon name="search" size={17} /><input placeholder="Buscar por placa, vehículo o propietario..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="outline-button"><Icon name="filter" size={16} /> Filtros</button><form className="add-vehicle-form" onSubmit={addVehicle}><input aria-label="Número de placa" placeholder="Nueva placa" value={plateInput} onChange={(event) => setPlateInput(event.target.value.toUpperCase())} /><button className="primary-button" type="submit"><Icon name="plus" size={16} /> Agregar vehículo</button></form></div><VehicleTable vehicles={vehicles} /><div className="table-foot"><span>Mostrando <strong>{vehicles.length}</strong> de <strong>247</strong> vehículos</span><div className="pagination"><button disabled>‹</button><button className="current-page">1</button><button>2</button><button>3</button><span>...</span><button>›</button></div></div></section>
  </>
}

function History({ vehicles, search, setSearch }: { vehicles: Vehicle[]; search: string; setSearch: (value: string) => void }) {
  return <>
    <PageHeading eyebrow="REGISTRO DE MOVIMIENTOS" title="Historial" description="Consulta las entradas y salidas registradas en el sistema.">
      <button className="outline-button" onClick={() => window.print()}><Icon name="download" size={16} /> Exportar historial</button>
    </PageHeading>
    <div className="metrics-grid history-metrics"><Metric icon="scan" label="Lecturas hoy" number="128" note="+12.8% vs. ayer" tone="mint" /><Metric icon="car" label="Entradas" number="76" note="Durante el día" tone="blue" /><Metric icon="logout" label="Salidas" number="52" note="Durante el día" tone="violet" /><Metric icon="alert" label="Incidencias" number="03" note="Requieren revisión" tone="coral" /></div>
    <section className="content-card directory-card"><div className="directory-toolbar"><div className="table-search"><Icon name="search" size={17} /><input placeholder="Buscar por placa o propietario..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><button className="outline-button"><Icon name="calendar" size={16} /> Últimos 7 días</button><button className="outline-button"><Icon name="filter" size={16} /> Todos los movimientos</button></div><VehicleTable vehicles={vehicles} /><div className="table-foot"><span>Mostrando <strong>{vehicles.length}</strong> registros de hoy</span><div className="pagination"><button disabled>‹</button><button className="current-page">1</button><button>2</button><button>3</button><span>...</span><button>›</button></div></div></section>
  </>
}

function Alerts({ vehicles }: { vehicles: Vehicle[] }) {
  return <>
    <PageHeading eyebrow="CENTRO DE NOTIFICACIONES" title="Alertas" description="Revisa eventos que necesitan atención en el campus."><button className="outline-button"><Icon name="check" size={16} /> Marcar todas como revisadas</button></PageHeading>
    <div className="alert-summary"><div className="alert-summary-icon"><Icon name="alert" size={20} /></div><div><strong>3 alertas requieren atención</strong><span>Revisa los registros para mantener seguro el acceso al campus.</span></div><span className="alert-count">03 ACTIVAS</span></div>
    <section className="content-card alert-page-card"><div className="card-heading"><div><h2>Alertas recientes</h2><p>Ordenadas por hora de detección</p></div><button className="select-button">Todas las alertas <Icon name="chevron" size={14} /></button></div><div className="alert-detail-list">
      <AlertDetail tone="red" title="Vehículo no registrado" plate="DEF-456" description="El vehículo no se encuentra en la lista de autorizados." location="Entrada principal" time="Hoy, 10:31:52" />
      <AlertDetail tone="amber" title="Placa parcialmente visible" plate="GHI-012" description="La lectura tiene baja confianza. Se recomienda verificación manual." location="Entrada norte" time="Hoy, 10:24:09" />
      <AlertDetail tone="blue" title="Vehículo fuera de horario" plate="JKL-345" description="Intento de ingreso detectado fuera del horario permitido." location="Estacionamiento B" time="Hoy, 09:48:33" />
      {vehicles.filter((vehicle) => vehicle.status === 'Alerta' || vehicle.status === 'Pendiente').map((vehicle) => <div className="alert-detail" key={vehicle.plate}><span className="alert-icon red"><Icon name="alert" size={17} /></span><div className="alert-detail-copy"><div><strong>Verificar registro de vehículo</strong><span className="plate-tag">{vehicle.plate}</span></div><p>{vehicle.make} {vehicle.model} · {vehicle.owner}</p><small><Icon name="pin" size={13} /> {vehicle.location} <span>·</span> Hoy, {vehicle.time}</small></div><button className="outline-button alert-action">Revisar <Icon name="chevron" size={14} /></button></div>)}
    </div></section>
  </>
}

function AlertDetail({ tone, title, plate, description, location, time }: { tone: string; title: string; plate: string; description: string; location: string; time: string }) {
  return <div className="alert-detail"><span className={`alert-icon ${tone}`}><Icon name={tone === 'red' ? 'alert' : tone === 'amber' ? 'eye' : 'clock'} size={17} /></span><div className="alert-detail-copy"><div><strong>{title}</strong><span className="plate-tag">{plate}</span></div><p>{description}</p><small><Icon name="pin" size={13} /> {location} <span>·</span> {time}</small></div><button className="outline-button alert-action">Revisar <Icon name="chevron" size={14} /></button></div>
}

function Assistant({ chat, query, setQuery, sendMessage }: { chat: { by: 'assistant' | 'user'; text: string }[]; query: string; setQuery: (value: string) => void; sendMessage: (event: FormEvent<HTMLFormElement>) => void }) {
  return <>
    <PageHeading eyebrow="ASISTENCIA INTELIGENTE" title="Agente inteligente" description="Consulta la actividad del campus usando lenguaje natural."><span className="live-pill"><i /> Agente conectado</span></PageHeading>
    <div className="assistant-layout"><section className="content-card chat-card"><div className="chat-heading"><span className="assistant-avatar"><Icon name="spark" size={19} /></span><div><strong>Asistente PlacaSegura</strong><span><i /> Disponible para ayudarte</span></div><button className="icon-button"><Icon name="settings" size={17} /></button></div><div className="chat-messages">{chat.map((message, index) => <div className={`chat-message ${message.by}`} key={`${index}-${message.by}`}><span className="chat-avatar">{message.by === 'assistant' ? <Icon name="spark" size={15} /> : 'T'}</span><div><span className="chat-sender">{message.by === 'assistant' ? 'Asistente PlacaSegura' : 'Tú'}</span><p>{message.text}</p></div></div>)}</div><form className="chat-compose" onSubmit={sendMessage}><input placeholder="Escribe tu consulta..." value={query} onChange={(event) => setQuery(event.target.value)} /><button className="send-button" type="submit" aria-label="Enviar mensaje"><Icon name="send" size={17} /></button></form><div className="chat-disclaimer">El agente puede cometer errores. Verifica los datos importantes.</div></section><aside className="assistant-side"><section className="content-card suggestion-card"><h3><Icon name="spark" size={17} /> Prueba preguntando</h3><p>Selecciona una consulta para empezar:</p>{['¿Cuántos vehículos ingresaron hoy?', '¿Hay alertas sin revisar?', 'Busca la placa ABC-123'].map((suggestion) => <button key={suggestion} className="suggestion" onClick={() => setQuery(suggestion)}>{suggestion}<Icon name="arrow" size={14} /></button>)}</section><section className="content-card assistant-stats"><h3>Datos de hoy</h3><div><span>Vehículos detectados</span><strong>128</strong></div><div><span>Accesos autorizados</span><strong>116</strong></div><div><span>Alertas activas</span><strong className="text-red">03</strong></div><div><span>Precisión de lectura</span><strong>98.4%</strong></div></section></aside></div>
  </>
}

export default App

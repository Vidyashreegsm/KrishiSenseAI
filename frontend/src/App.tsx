import { useState, type FormEvent } from 'react'
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  Droplets,
  FlaskConical,
  LayoutDashboard,
  Leaf,
  MapPin,
  Menu,
  Search,
  Settings,
  Sprout,
  TrendingUp,
  Wheat,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const API_URL = 'http://127.0.0.1:8000'

const chartData = [
  { month: 'Jan', rainfall: 42 },
  { month: 'Feb', rainfall: 35 },
  { month: 'Mar', rainfall: 55 },
  { month: 'Apr', rainfall: 72 },
  { month: 'May', rainfall: 108 },
  { month: 'Jun', rainfall: 185 },
  { month: 'Jul', rainfall: 240 },
]

const navigation = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Crop recommendation', icon: Sprout },
  { label: 'Yield prediction', icon: TrendingUp },
]

type CropRecommendationResponse = {
  recommended_crop: string
  top_recommendations: {
    crop: string
    model_score_percent: number
  }[]
  model: string
  test_accuracy_percent: number
  notice: string
}

function App() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [location, setLocation] = useState('Mysuru, Karnataka')

  const [nitrogen, setNitrogen] = useState('90')
  const [phosphorus, setPhosphorus] = useState('42')
  const [potassium, setPotassium] = useState('43')
  const [ph, setPh] = useState('6.5')
  const [rainfall, setRainfall] = useState('202.9')
  const [temperature, setTemperature] = useState('20.88')
  const [humidity, setHumidity] = useState('82')
  const [season, setSeason] = useState('Kharif')

  const [crop, setCrop] = useState('Rice')
  const [area, setArea] = useState('2')

  const [isRecommending, setIsRecommending] = useState(false)
  const [cropResult, setCropResult] =
    useState<CropRecommendationResponse | null>(null)
  const [cropError, setCropError] = useState('')
  const [notice, setNotice] = useState('')

  async function handleRecommendation(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()
    setNotice('')
    setCropError('')
    setCropResult(null)
    setIsRecommending(true)

    const payload = {
      N: Number(nitrogen),
      P: Number(phosphorus),
      K: Number(potassium),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall),
    }

    if (Object.values(payload).some((value) => !Number.isFinite(value))) {
      setCropError('Please enter valid numbers in all the required fields.')
      setIsRecommending(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/crops/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        const detail =
          typeof data.detail === 'string'
            ? data.detail
            : `The API returned an error (${response.status}).`

        throw new Error(detail)
      }

      setCropResult(data as CropRecommendationResponse)
    } catch (error) {
      setCropError(
        error instanceof Error && error.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Make sure FastAPI is running at http://127.0.0.1:8000.'
          : error instanceof Error
            ? error.message
            : 'Something went wrong. Please try again.',
      )
    } finally {
      setIsRecommending(false)
    }
  }

  function handleYield(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(
      'Yield prediction is not available yet. A separate model trained and evaluated on historical crop yield data is required.',
    )
  }

  function navigate(label: string) {
    setActiveNav(label)
    setMobileMenu(false)

    if (label !== 'Overview') {
      document
        .getElementById(
          label === 'Crop recommendation' ? 'crop-form' : 'yield-form',
        )
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f8f4] text-slate-800">
      {mobileMenu && (
        <button
          aria-label="Close menu overlay"
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200/80 bg-white px-5 py-6 transition-transform lg:translate-x-0 ${
          mobileMenu ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-white shadow-lg shadow-green-900/15">
              <Sprout size={25} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900">
                KrishiSense
              </h1>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-green-700">
                AI FARMING
              </p>
            </div>
          </div>

          <button
            aria-label="Close navigation"
            onClick={() => setMobileMenu(false)}
            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-10">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => navigate(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition ${
                  activeNav === label
                    ? 'bg-green-700 text-white shadow-md shadow-green-900/10'
                    : 'text-slate-500 hover:bg-green-50 hover:text-green-800'
                }`}
              >
                <Icon size={19} />
                {label}

                {label === 'Crop recommendation' && (
                  <span className="ml-auto rounded-md bg-white/15 px-1.5 py-0.5 text-[10px]">
                    AI
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-9">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Preferences
          </p>

          <button
            onClick={() =>
              setNotice('Settings will be available in a later version.')
            }
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50"
          >
            <Settings size={19} />
            Settings
          </button>
        </div>

        <div className="mt-auto rounded-2xl bg-[#edf5e9] p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-green-700">
            <Leaf size={20} />
          </div>
          <h3 className="mt-3 text-sm font-bold text-green-950">
            Farming, made smarter.
          </h3>
          <p className="mt-1 text-xs leading-5 text-green-900/70">
            Turn soil and weather information into more informed farming
            decisions.
          </p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-green-800">
            <span className="h-2 w-2 rounded-full bg-green-600" />
            Crop model connected
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-lg">
            👩‍🌾
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-800">
              Farm workspace
            </p>
            <p className="text-xs text-slate-500">Soil & crop insights</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setMobileMenu(true)}
              className="rounded-xl p-2 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={21} />
            </button>

            <div className="min-w-0">
              <p className="text-xs text-slate-500">
                Workspace / {activeNav}
              </p>
              <h2 className="truncate text-lg font-bold text-slate-900 sm:text-xl">
                Good day, farmer <span>🌱</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 md:flex">
              <Search size={16} />
              <span>Search insights...</span>
              <span className="ml-4 rounded border border-slate-200 px-1.5 py-0.5 text-[10px]">
                /
              </span>
            </div>

            <button
              aria-label="Notifications"
              onClick={() =>
                setNotice('You are all caught up on notifications.')
              }
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
            </button>

            <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-green-100 font-bold text-green-800 sm:flex">
              K
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] space-y-7 p-4 sm:p-7 lg:p-9">
          <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#123e2b] via-[#17613b] to-[#39824a] p-6 text-white shadow-xl shadow-green-950/10 sm:p-9">
            <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-2 -top-12 h-56 w-56 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -bottom-24 right-36 h-52 w-52 rounded-full bg-lime-300/10 blur-3xl" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-green-50">
                <Activity size={14} />
                Your intelligent farming companion
              </div>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Grow with knowledge.
                <br />
                <span className="text-lime-300">
                  Harvest with confidence.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-green-50/80 sm:text-base">
                Understand your soil, explore suitable crops, and make informed
                decisions with data-driven agricultural insights.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('Crop recommendation')}
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-300 px-5 py-3 text-sm font-bold text-green-950 transition hover:bg-lime-200"
                >
                  <Sprout size={18} />
                  Explore crops
                  <ArrowUpRight size={16} />
                </button>

                <button
                  onClick={() => navigate('Yield prediction')}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  <TrendingUp size={17} />
                  Yield prediction
                </button>
              </div>
            </div>

            <div className="absolute bottom-0 right-0 hidden h-full w-[36%] items-end justify-center opacity-25 lg:flex">
              <Wheat size={210} strokeWidth={0.8} />
            </div>
          </section>

          {notice && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-900"
            >
              <CheckCircle2 className="mt-0.5 shrink-0" size={19} />
              <p className="flex-1 leading-6">{notice}</p>
              <button
                aria-label="Dismiss message"
                onClick={() => setNotice('')}
                className="rounded-lg p-1 hover:bg-green-100"
              >
                <X size={17} />
              </button>
            </div>
          )}

          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                  At a glance
                </p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                  Your farming overview
                </h2>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={15} />
                Preview data · Illustrative only
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Soil pH"
                value={ph}
                unit="pH"
                note="Current form input"
                icon={FlaskConical}
                tone="green"
                trend="User entered"
              />
              <StatCard
                title="Rainfall input"
                value={rainfall}
                unit="mm"
                note="Model feature input"
                icon={CloudSun}
                tone="blue"
                trend="User entered"
              />
              <StatCard
                title="Humidity"
                value={humidity}
                unit="%"
                note="Model feature input"
                icon={Droplets}
                tone="orange"
                trend="User entered"
              />
              <StatCard
                title="Yield estimate"
                value="—"
                unit=""
                note="Yield model not trained"
                icon={TrendingUp}
                tone="purple"
                trend="Unavailable"
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Rainfall overview
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Illustrative monthly values · not a live forecast
                  </p>
                </div>
                <span className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                  Example data
                </span>
              </div>

              <div className="mt-6 h-[245px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 8, right: 5, left: -22, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="rainFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#3b82f6"
                          stopOpacity={0.23}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>

                    <CartesianGrid
                      stroke="#edf1f5"
                      strokeDasharray="4 4"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e2e8f0',
                        fontSize: 12,
                      }}
                      formatter={(value) => [`${value} mm`, 'Rainfall']}
                    />
                    <Area
                      type="monotone"
                      dataKey="rainfall"
                      stroke="#3b82f6"
                      strokeWidth={2.5}
                      fill="url(#rainFill)"
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">
                    Your farm profile
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Edit the location for your analysis
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                  <MapPin size={20} />
                </div>
              </div>

              <label
                htmlFor="farm-location"
                className="mt-6 block text-xs font-semibold text-slate-600"
              >
                Farm location
              </label>
              <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 focus-within:border-green-500">
                <MapPin size={17} className="shrink-0 text-green-700" />
                <input
                  id="farm-location"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Enter village or district"
                />
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Selected location</p>
                <p className="mt-1 font-bold text-slate-800">
                  {location || 'Not set'}
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The current model uses manually entered values. Location-based
                  weather and regional data are not connected yet.
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                No live weather service connected
              </div>
            </div>
          </section>

          <section id="crop-form" className="scroll-mt-24">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                Decision support
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                Find crops suited to your soil
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the seven features expected by the trained model.
              </p>
            </div>

            <form
              onSubmit={handleRecommendation}
              className="grid gap-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 xl:grid-cols-[1.3fr_0.7fr]"
            >
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
                    <FlaskConical size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Soil and weather inputs
                    </h3>
                    <p className="text-xs text-slate-500">
                      Use measured values when available
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <NumberField
                    label="Nitrogen (N)"
                    value={nitrogen}
                    setValue={setNitrogen}
                    min="0"
                    max="300"
                    unit="Dataset value"
                  />
                  <NumberField
                    label="Phosphorus (P)"
                    value={phosphorus}
                    setValue={setPhosphorus}
                    min="0"
                    max="300"
                    unit="Dataset value"
                  />
                  <NumberField
                    label="Potassium (K)"
                    value={potassium}
                    setValue={setPotassium}
                    min="0"
                    max="300"
                    unit="Dataset value"
                  />
                  <NumberField
                    label="Soil pH"
                    value={ph}
                    setValue={setPh}
                    min="0"
                    max="14"
                    step="0.1"
                    unit="pH"
                  />
                  <NumberField
                    label="Temperature"
                    value={temperature}
                    setValue={setTemperature}
                    min="-10"
                    max="60"
                    step="0.1"
                    unit="°C"
                  />
                  <NumberField
                    label="Humidity"
                    value={humidity}
                    setValue={setHumidity}
                    min="0"
                    max="100"
                    step="0.1"
                    unit="%"
                  />
                </div>

                <div className="mt-5">
                  <label
                    htmlFor="rainfall-input"
                    className="mb-2 block text-xs font-semibold text-slate-600"
                  >
                    Rainfall input
                  </label>
                  <div className="relative">
                    <CloudSun
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="rainfall-input"
                      type="number"
                      min="0"
                      max="2000"
                      step="0.1"
                      required
                      value={rainfall}
                      onChange={(event) => setRainfall(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Match the meaning and units of the rainfall feature in the
                    training dataset. Do not assume it is a seasonal total.
                  </p>
                </div>
              </div>

              <div className="flex flex-col border-t border-slate-100 pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                    <Wheat size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">
                      Growing conditions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Season is recorded for context
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="season-input"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Season
                </label>
                <select
                  id="season-input"
                  value={season}
                  onChange={(event) => setSeason(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option>Kharif</option>
                  <option>Rabi</option>
                  <option>Zaid</option>
                  <option>Perennial</option>
                </select>

                <div className="mt-5 rounded-xl border border-dashed border-green-200 bg-green-50/70 p-4">
                  <p className="flex items-center gap-2 text-sm font-bold text-green-900">
                    <Activity size={17} />
                    How the model works
                  </p>
                  <p className="mt-2 text-xs leading-5 text-green-900/75">
                    The Random Forest model ranks crop labels using the seven
                    numeric inputs. Season and location are not model features
                    and do not affect its prediction yet.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isRecommending}
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 xl:mt-auto"
                >
                  {isRecommending ? (
                    <>
                      <Activity size={17} className="animate-spin" />
                      Analyzing soil...
                    </>
                  ) : (
                    <>
                      <Search size={17} />
                      Recommend crops
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {cropError && (
              <div
                role="alert"
                className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
              >
                <div className="flex items-start gap-3">
                  <X size={20} className="shrink-0" />
                  <div>
                    <p className="font-bold">Recommendation failed</p>
                    <p className="mt-1 leading-6">{cropError}</p>
                  </div>
                </div>
              </div>
            )}

            {cropResult && (
              <div className="mt-5 rounded-2xl border border-green-200 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                      AI crop recommendation
                    </p>
                    <h3 className="mt-2 text-2xl font-extrabold capitalize text-slate-900">
                      {cropResult.recommended_crop}
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Model: {cropResult.model} · Held-out test accuracy:{' '}
                      {cropResult.test_accuracy_percent}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-green-50 p-4 text-green-800">
                    <Sprout size={30} />
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h4 className="font-bold text-slate-800">
                    Top 3 model recommendations
                  </h4>

                  {cropResult.top_recommendations.map((item) => (
                    <div key={item.crop}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                        <span className="font-semibold capitalize text-slate-700">
                          {item.crop}
                        </span>
                        <span className="font-bold text-slate-900">
                          {item.model_score_percent}%
                        </span>
                      </div>

                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-green-600 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(0, item.model_score_percent),
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                  <p className="font-bold">Important farming note</p>
                  <p className="mt-1">{cropResult.notice}</p>
                  <p className="mt-2">
                    Model scores are not guarantees of crop success. Confirm
                    local climate, soil measurements, irrigation, season, and
                    regional agricultural advice before planting.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section id="yield-form" className="scroll-mt-24">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-green-700">
                Harvest planning
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                Yield prediction
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Prepare crop and area details for a future yield estimate.
              </p>
            </div>

            <form
              onSubmit={handleYield}
              className="grid gap-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-[1fr_1fr_auto] md:items-end"
            >
              <div>
                <label
                  htmlFor="yield-crop"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Crop to grow
                </label>
                <select
                  id="yield-crop"
                  value={crop}
                  onChange={(event) => setCrop(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                >
                  <option>Rice</option>
                  <option>Ragi</option>
                  <option>Maize</option>
                  <option>Wheat</option>
                  <option>Groundnut</option>
                  <option>Sugarcane</option>
                  <option>Cotton</option>
                  <option>Pulses</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="yield-area"
                  className="mb-2 block text-xs font-semibold text-slate-600"
                >
                  Cultivated area (acres)
                </label>
                <input
                  id="yield-area"
                  type="number"
                  min="0.01"
                  max="100000"
                  step="0.01"
                  required
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                <TrendingUp size={17} />
                Check availability
              </button>

              <p className="text-xs leading-5 text-slate-500 md:col-span-3">
                No yield figure is generated. A separate regression model
                trained and evaluated on historical yield data is required.
              </p>
            </form>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row">
            <p>© 2026 KrishiSense AI · Built for smarter farming decisions.</p>
            <p>Crop recommendation enabled · Yield model not trained</p>
          </footer>
        </main>
      </div>
    </div>
  )
}

type StatCardProps = {
  title: string
  value: string
  unit: string
  note: string
  trend: string
  icon: typeof Leaf
  tone: 'green' | 'blue' | 'orange' | 'purple'
}

function StatCard({
  title,
  value,
  unit,
  note,
  trend,
  icon: Icon,
  tone,
}: StatCardProps) {
  const tones = {
    green: 'bg-green-50 text-green-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-violet-50 text-violet-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon size={19} />
        </div>
      </div>

      <div className="mt-5 flex items-baseline gap-1.5">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-500">{unit}</span>
      </div>

      <p className="mt-1 text-xs text-slate-500">{note}</p>

      <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-medium text-slate-500">
        {value === '—' ? (
          <Activity size={14} />
        ) : tone === 'orange' ? (
          <ArrowDownRight size={14} />
        ) : (
          <ArrowUpRight size={14} />
        )}
        {trend}
      </div>
    </div>
  )
}

type NumberFieldProps = {
  label: string
  value: string
  setValue: (value: string) => void
  min: string
  max: string
  step?: string
  unit: string
}

function NumberField({
  label,
  value,
  setValue,
  min,
  max,
  step = '1',
  unit,
}: NumberFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold text-slate-600">
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-200 transition focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-100">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          required
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 rounded-xl bg-transparent px-3 py-3 text-sm outline-none"
        />
        <span className="pr-3 text-[11px] text-slate-400">{unit}</span>
      </div>
    </div>
  )
}

export default App
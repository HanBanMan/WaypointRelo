import React, { useState } from 'react';

const PRESETS = {
  tinker_to_jbab: {
    id: "tinker_to_jbab",
    title: "Tinker AFB to JBAB",
    origin: "Tinker AFB, OK",
    destination: "JBAB (Joint Base Anacostia-Bolling), D.C.",
    pcsDate: "2026-09-15",
    settleDate: "2026-11-15",
    budgetCap: 2500,
    schoolCutoffMonth: 9,
    schoolCutoffDay: 30,
    branch: "Navy",
    children: [
      { id: 1, name: "Your Daughter (Girl)", dob: "2022-01-19", customNote: "Meets 4-by-Sept-30 cutoff. Fully qualifies for free, full-day public preschool PK4 in Washington D.C." },
      { id: 2, name: "Your Son (Boy)", dob: "2023-05-20", customNote: "Meets 3-by-Sept-30 cutoff. Fully qualifies for free, full-day public preschool PK3 in Washington D.C." }
    ],
    commutes: [
      { id: 1, name: "Navy Yard NFCU / Base", distance: "3.5 miles", time: "8 - 12 mins", note: "Straight shot over South Capitol St Bridge. Low stress, matches drop-off coordinates." },
      { id: 2, name: "Crystal City NFCU (VA)", distance: "6.2 miles", time: "12 - 18 mins", note: "Split-commute across the Potomac. Requires coordination." },
      { id: 3, name: "Hybla Valley NFCU (Alexandria)", distance: "11.4 miles", time: "18 - 26 mins", note: "High commute strain. Direct bottleneck at the Woodrow Wilson Bridge." }
    ],
    schools: [
      { id: 1, name: "LEARN DC Charter School", type: "On-Base Public Charter", hours: "8:00 AM - 4:00 PM", notes: "50% seats reserved for military. Accepts post-lottery late enrollments for mid-year PCS." },
      { id: 2, name: "Leckie Education Campus", type: "Zoned Public (DCPS)", hours: "8:45 AM - 3:15 PM", notes: "Guaranteed right-to-attend for K+. Dedicated school bus picks up inside base housing." },
      { id: 3, name: "JBAB Child Development Center", type: "Subsidized Military Care", hours: "6:00 AM - 6:00 PM", notes: "Great fallback for early 06:00 shifts, but high waitlists. Sign up early on MilitaryChildCare.com." }
    ]
  }
};

export default function App() {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [activeTab, setActiveTab] = useState('planner'); // 'planner', 'customizer', 'github'
  
  // Customizer and Wizard Shared states
  const [origin, setOrigin] = useState("Tinker AFB, OK");
  const [destination, setDestination] = useState("JBAB (Joint Base Anacostia-Bolling), D.C.");
  const [pcsDate, setPcsDate] = useState("2026-09-15");
  const [settleDate, setSettleDate] = useState("2026-11-15");
  const [budgetCap, setBudgetCap] = useState(2500);
  const [schoolCutoffMonth, setSchoolCutoffMonth] = useState(9);
  const [schoolCutoffDay, setSchoolCutoffDay] = useState(30);
  const [branch, setBranch] = useState("Navy");
  
  const [childrenList, setChildrenList] = useState(PRESETS.tinker_to_jbab.children);
  const [commuteList, setCommuteList] = useState(PRESETS.tinker_to_jbab.commutes);
  const [schoolsList, setSchoolsList] = useState(PRESETS.tinker_to_jbab.schools);
  
  const [selectedCommuteId, setSelectedCommuteId] = useState(1);
  const [targetSchoolYear, setTargetSchoolYear] = useState(2026);
  const [showExporter, setShowExporter] = useState(false);

  const handleNextStep = (nextStepNumber) => {
    if (nextStepNumber === 2 && !destination.trim()) {
      alert("Please enter where you are moving next!");
      return;
    }
    if (nextStepNumber === 4 && !origin.trim()) {
      alert("Please enter your current location!");
      return;
    }
    setOnboardingStep(nextStepNumber);
  };

  const handleSelectBranch = (selectedBranch) => {
    setBranch(selectedBranch);
  };

  const handleFinishOnboarding = () => {
    if (!pcsDate) {
      alert("Please select your projected move date!");
      return;
    }

    // Automatically calculate settlement date to be 2 months later
    const dateObj = new Date(pcsDate);
    dateObj.setMonth(dateObj.getMonth() + 2);
    setSettleDate(dateObj.toISOString().split('T')[0]);

    // Pre-seed matching templates if user selected JBAB or Washington DC
    if (destination.toLowerCase().includes("jbab") || destination.toLowerCase().includes("washington") || destination.toLowerCase().includes("d.c.")) {
      setChildrenList(PRESETS.tinker_to_jbab.children);
      setCommuteList(PRESETS.tinker_to_jbab.commutes);
      setSchoolsList(PRESETS.tinker_to_jbab.schools);
    } else {
      setChildrenList([
        { id: 1, name: "Your Daughter (Girl)", dob: "2022-01-19", customNote: "Check local cutoff rules." },
        { id: 2, name: "Your Son (Boy)", dob: "2023-05-20", customNote: "Check local nursery school requirements." }
      ]);
      setCommuteList([
        { id: 1, name: "Primary Workplace", distance: "5.2 miles", time: "12 - 15 mins", note: "Standard commute routing." },
        { id: 2, name: "Secondary Office / Local Hub", distance: "12.4 miles", time: "22 - 30 mins", note: "Alternate Highway Route." }
      ]);
      setSchoolsList([
        { id: 1, name: "Local Zoned Primary School", type: "Public School Option", hours: "8:30 AM - 3:00 PM", notes: "Check boundary zoning map on arrival." },
        { id: 2, name: "Community Pre-School Center", type: "Subsidized Early Care", hours: "7:00 AM - 6:00 PM", notes: "Great fallback for dual-career early shifts." }
      ]);
    }

    setOnboardingComplete(true);
  };

  const loadPreset = (presetKey) => {
    const p = PRESETS[presetKey];
    setOrigin(p.origin);
    setDestination(p.destination);
    setPcsDate(p.pcsDate);
    setSettleDate(p.settleDate);
    setBudgetCap(p.budgetCap);
    setSchoolCutoffMonth(p.schoolCutoffMonth);
    setSchoolCutoffDay(p.schoolCutoffDay);
    setBranch(p.branch);
    setChildrenList(p.children);
    setCommuteList(p.commutes);
    setSchoolsList(p.schools);
    setSelectedCommuteId(p.commutes[0]?.id || 1);
  };

  const calculateAgeDetails = (dobString) => {
    if (!dobString) return { targetFormatted: "N/A", gradeLabel: "N/A" };
    const dob = new Date(dobString);
    const targetDate = new Date(targetSchoolYear, schoolCutoffMonth - 1, schoolCutoffDay);
    
    let ageYears = targetDate.getFullYear() - dob.getFullYear();
    let ageMonths = targetDate.getMonth() - dob.getMonth();
    
    if (ageMonths < 0 || (ageMonths === 0 && targetDate.getDate() < dob.getDate())) {
      ageYears--;
      ageMonths += 12;
    }

    const currentDiff = new Date() - dob;
    const currentAgeYears = Math.floor(currentDiff / (1000 * 60 * 60 * 24 * 365.25));
    const currentAgeMonths = Math.floor((currentDiff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30.43));

    let gradeLabel = "Too Young / Daycare";
    if (ageYears === 3) gradeLabel = "Pre-Kindergarten 3 (PK3)";
    else if (ageYears === 4) gradeLabel = "Pre-Kindergarten 4 (PK4)";
    else if (ageYears === 5) gradeLabel = "Kindergarten (K)";
    else if (ageYears > 5) gradeLabel = `Grade ${ageYears - 5}`;

    return {
      years: ageYears,
      months: ageMonths,
      currentFormatted: `${currentAgeYears} yrs, ${currentAgeMonths} mos`,
      targetFormatted: `${ageYears} years, ${ageMonths} months`,
      gradeLabel
    };
  };

  const getConfigurationJson = () => {
    return JSON.stringify({
      origin,
      destination,
      pcsDate,
      settleDate,
      budgetCap,
      schoolCutoffMonth,
      schoolCutoffDay,
      branch,
      children: childrenList,
      commutes: commuteList,
      schools: schoolsList
    }, null, 2);
  };

  // State handlers
  const addChild = () => {
    const nextId = childrenList.length > 0 ? Math.max(...childrenList.map(c => c.id)) + 1 : 1;
    setChildrenList([...childrenList, { id: nextId, name: `Child #${nextId}`, dob: "2023-01-01", customNote: "" }]);
  };

  const removeChild = (id) => {
    setChildrenList(childrenList.filter(c => c.id !== id));
  };

  const updateChild = (id, field, value) => {
    setChildrenList(childrenList.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCommute = () => {
    const nextId = commuteList.length > 0 ? Math.max(...commuteList.map(c => c.id)) + 1 : 1;
    setCommuteList([...commuteList, { id: nextId, name: "New Location", distance: "5 miles", time: "15 mins", note: "" }]);
  };

  const updateCommute = (id, field, value) => {
    setCommuteList(commuteList.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCommute = (id) => {
    setCommuteList(commuteList.filter(c => c.id !== id));
  };

  const addSchool = () => {
    const nextId = schoolsList.length > 0 ? Math.max(...schoolsList.map(s => s.id)) + 1 : 1;
    setSchoolsList([...schoolsList, { id: nextId, name: "New School Facility", type: "Public / Charter", hours: "8:00 AM - 3:00 PM", notes: "" }]);
  };

  const updateSchool = (id, field, value) => {
    setSchoolsList(schoolsList.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSchool = (id) => {
    setSchoolsList(schoolsList.filter(s => s.id !== id));
  };

  if (!onboardingComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          {/* Progress indicators */}
          <div className="flex gap-2 mb-8 justify-center">
            {[1, 2, 3, 4].map(idx => (
              <div 
                key={idx} 
                className={`h-1.5 w-10 rounded-full transition-all duration-300 ${onboardingStep >= idx ? 'bg-indigo-500' : 'bg-slate-800'}`}
              />
            ))}
          </div>

          {/* STEP 1: Destination */}
          {onboardingStep === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">Where are you moving to next?</h2>
                <p className="text-xs text-slate-400">Your target city, base, state, or neighborhood.</p>
              </div>
              <input 
                type="text" 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
                placeholder="e.g. JBAB, Washington D.C., San Diego, CA"
              />
              <button 
                onClick={() => handleNextStep(2)} 
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm py-3 rounded-xl transition-all"
              >
                Continue
              </button>
            </div>
          )}

          {/* STEP 2: Branch selection */}
          {onboardingStep === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">What branch of service are you in?</h2>
                <p className="text-xs text-slate-400">Select your branch, or choose civilian below.</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {["Navy", "Air Force", "Army", "Marine Corps", "Space Force", "Coast Guard"].map(b => (
                  <button 
                    key={b}
                    onClick={() => handleSelectBranch(b)}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold transition-all ${branch === b ? 'border-indigo-500 bg-indigo-950 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handleSelectBranch("None")}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-bold transition-all mt-2 ${branch === "None" ? 'border-indigo-500 bg-indigo-950 text-white' : 'border-slate-800 bg-slate-950 text-slate-400'}`}
              >
                None / Civilian Relocation
              </button>
              <div className="flex gap-2 pt-4">
                <button onClick={() => handleNextStep(1)} className="w-1/3 bg-slate-950 text-slate-400 py-3 rounded-xl border border-slate-800">Back</button>
                <button onClick={() => handleNextStep(3)} className="w-2/3 bg-indigo-600 text-white py-3 rounded-xl font-bold">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 3: Origin Station */}
          {onboardingStep === 3 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">
                  {branch === "None" ? "Where are you currently moving from?" : "Where are you currently stationed?"}
                </h2>
                <p className="text-xs text-slate-400">Your current base, city, or residence.</p>
              </div>
              <input 
                type="text" 
                value={origin} 
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
                placeholder="e.g. Tinker AFB, OK, Dallas, TX"
              />
              <div className="flex gap-2">
                <button onClick={() => handleNextStep(2)} className="w-1/3 bg-slate-950 text-slate-400 py-3 rounded-xl border border-slate-800">Back</button>
                <button onClick={() => handleNextStep(4)} className="w-2/3 bg-indigo-600 text-white py-3 rounded-xl font-bold">Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: Date Input */}
          {onboardingStep === 4 && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-white">
                  {branch === "None" ? "When are you projected to move?" : "When are you projected to move (PCS)?"}
                </h2>
                <p className="text-xs text-slate-400 font-normal">We'll use this to build out dates and calculate age cutoffs.</p>
              </div>
              <input 
                type="date" 
                value={pcsDate} 
                onChange={(e) => setPcsDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500" 
              />
              <div className="flex gap-2">
                <button onClick={() => handleNextStep(3)} className="w-1/3 bg-slate-950 text-slate-400 py-3 rounded-xl border border-slate-800">Back</button>
                <button onClick={handleFinishOnboarding} className="w-2/3 bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20">Generate Dashboard</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur sticky top-0 z-50 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-tr from-amber-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              <span className="text-xl">🏠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                ToMoveTo <span className="text-amber-400 text-sm font-medium px-2 py-0.5 bg-amber-950/50 border border-amber-800/40 rounded-full">Global Relocation Planner</span>
              </h1>
              <p className="text-xs text-slate-400">Collaborative Educational & Commute Planner • Warm & Supportive Onboarding</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
            <span className="font-bold text-slate-300">Affiliation: {branch}</span>
            <button 
              onClick={() => { setOnboardingStep(1); setOnboardingComplete(false); }}
              className="ml-2 text-[10px] bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-400 hover:text-white"
            >
              Reset Setup
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Navigation Tabs bar */}
        <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-850 flex flex-wrap gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('planner')}
            className={`flex-1 py-3 px-4 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] ${
              activeTab === 'planner' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            📋 Active ToMoveTo Panel
          </button>
          <button
            onClick={() => setActiveTab('customizer')}
            className={`flex-1 py-3 px-4 rounded-lg text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-2 min-w-[140px] ${
              activeTab === 'customizer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            ⚙️ Customize ToMoveTo (Fork Config)
          </button>
        </div>

        {/* ==================== TAB 1: PLANNER ==================== */}
        {activeTab === 'planner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Relocation details */}
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
                
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Relocation Course</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase">Trajectory</div>
                    <div className="text-sm font-extrabold text-white flex items-center gap-2 mt-0.5">
                      <span>{origin.split(',')[0]}</span>
                      <span className="text-indigo-400">➔</span>
                      <span>{destination.split(',')[0]}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-1 border-t border-slate-900">
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold uppercase">
                        {branch === "None" ? "MOVE DATE" : "DEPARTURE DATE"}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mt-0.5">
                        {pcsDate ? new Date(pcsDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-500 font-bold">EST. SETTLED BY</div>
                      <div className="text-xs font-semibold text-indigo-300 mt-0.5">
                        {settleDate ? new Date(settleDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold uppercase block">MONTHLY RENT TARGET</span>
                      <span className="text-sm font-extrabold text-emerald-400">${budgetCap?.toLocaleString()} / mo Max</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-900/30 text-emerald-300 font-bold px-2.5 py-1 rounded-full uppercase">
                      Budget Safe
                    </span>
                  </div>
                </div>
              </div>

              {/* Commutes */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">Work Site Commutes</h2>
                <div className="space-y-2">
                  {commuteList.map((commute) => (
                    <button
                      key={commute.id}
                      onClick={() => setSelectedCommuteId(commute.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 ${
                        selectedCommuteId === commute.id
                          ? 'border-indigo-500 bg-indigo-600/10 text-white'
                          : 'border-slate-855 bg-slate-900/20 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex justify-between items-center font-bold text-xs">
                        <span className="text-slate-200">{commute.name}</span>
                        <span className="text-indigo-400 font-mono">{commute.time}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                        <span>Distance: {commute.distance}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right main panel */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* School matrix */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-white">Dynamic School Eligibility Matrix</h3>
                    <p className="text-xs text-slate-400">Calculates age & grade placement relative to destination's school parameters.</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-slate-400 font-bold">Target Term:</label>
                    <select 
                      value={targetSchoolYear}
                      onChange={(e) => setTargetSchoolYear(parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2 py-1 focus:outline-none text-slate-300"
                    >
                      <option value={2026}>Fall SY 2026-2027</option>
                      <option value={2027}>Fall SY 2027-2028</option>
                      <option value={2028}>Fall SY 2028-2029</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {childrenList.map((child) => {
                    const ageDetails = calculateAgeDetails(child.dob);
                    return (
                      <div key={child.id} className="bg-slate-900/50 border border-slate-855 rounded-xl p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-sm text-white">{child.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">DOB: {child.dob}</p>
                          </div>
                          <span className="text-[11px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded">
                            {ageDetails.gradeLabel}
                          </span>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs border-t border-slate-850 pt-2.5">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Current Age:</span>
                            <span className="font-semibold text-slate-300">{ageDetails.currentFormatted}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase block">Age by Cutoff:</span>
                            <span className="font-semibold text-slate-300">{ageDetails.targetFormatted}</span>
                          </div>
                        </div>

                        {child.customNote && (
                          <div className="mt-3 p-2 bg-slate-950 rounded text-[11px] text-slate-400 leading-relaxed border border-slate-800/60">
                            {child.customNote}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Schools Profiles */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-extrabold text-white mb-1">Target School Facility Profiles</h3>
                <p className="text-xs text-slate-400 mb-4">Verified education choices at destination station with active support program options.</p>

                <div className="space-y-4">
                  {schoolsList.map((school) => (
                    <div key={school.id} className="bg-slate-900 border border-slate-850 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{school.name}</h4>
                          <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-900/30 px-2 py-0.5 rounded font-semibold">{school.type}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono">Daily Operational Hours: {school.hours}</p>
                        <p className="text-xs text-slate-300 leading-relaxed pt-1">{school.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commute Analysis */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-base font-extrabold text-white mb-2">Simulated Active Route Analysis</h3>
                <p className="text-xs text-slate-400 mb-4">Details based on the selected destination location commute on the sidebar.</p>

                {commuteList.find(c => c.id === selectedCommuteId) ? (
                  <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-2">
                    <div className="flex justify-between items-center border-b border-indigo-900/20 pb-2">
                      <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                        {commuteList.find(c => c.id === selectedCommuteId).name}
                      </span>
                      <span className="text-xs font-mono font-extrabold text-indigo-300">
                        {commuteList.find(c => c.id === selectedCommuteId).distance} • {commuteList.find(c => c.id === selectedCommuteId).time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-1">
                      {commuteList.find(c => c.id === selectedCommuteId).note || "No specific route note provided for this location."}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Select a commute from the left sidebar to analyze details.</p>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ==================== TAB 2: CUSTOMIZER ==================== */}
        {activeTab === 'customizer' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>⚙️ ToMoveTo Customizer</span>
                <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded">Real-time updates</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize every value, base, child, commute route, and school profile. Once updated, you can generate the JSON file configuration for your open-source repository.
              </p>
            </div>

            {/* Base Station Basics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b border-slate-900 pb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  {branch === "None" ? "Origin Location" : "Origin Station / Base Name"}
                </label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  {branch === "None" ? "Destination Location" : "Destination Station / Base Name"}
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">
                  {branch === "None" ? "Target Move Date" : "PCS Departure Date"}
                </label>
                <input
                  type="date"
                  value={pcsDate}
                  onChange={(e) => setPcsDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Est. Settlement Date</label>
                <input
                  type="date"
                  value={settleDate}
                  onChange={(e) => setSettleDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Rent Budget Cap ($)</label>
                <input
                  type="number"
                  value={budgetCap}
                  onChange={(e) => setBudgetCap(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Cutoff Month</label>
                  <select
                    value={schoolCutoffMonth}
                    onChange={(e) => setSchoolCutoffMonth(parseInt(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                  >
                    {[...Array(12).keys()].map(m => (
                      <option key={m+1} value={m+1}>{new Date(2000, m, 1).toLocaleString(undefined, {month: 'long'})}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Cutoff Day</label>
                  <input
                    type="number"
                    value={schoolCutoffDay}
                    min="1"
                    max="31"
                    onChange={(e) => setSchoolCutoffDay(parseInt(e.target.value) || 1)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Children Editor */}
            <div className="border-b border-slate-900 pb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Children Profile Specifications</h4>
                <button
                  onClick={addChild}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  + Add Child Profile
                </button>
              </div>

              <div className="space-y-4">
                {childrenList.map((child) => (
                  <div key={child.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Name / Identifier</label>
                      <input
                        type="text"
                        value={child.name}
                        onChange={(e) => updateChild(child.id, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={child.dob}
                        onChange={(e) => updateChild(child.id, 'dob', e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Specific Strategy Note</label>
                      <input
                        type="text"
                        value={child.customNote}
                        onChange={(e) => updateChild(child.id, 'customNote', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeChild(child.id)}
                      className="bg-red-950 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Commute Editor */}
            <div className="border-b border-slate-900 pb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Sites & Commutes</h4>
                <button
                  onClick={addCommute}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  + Add Commute Route
                </button>
              </div>

              <div className="space-y-4">
                {commuteList.map((c) => (
                  <div key={c.id} className="bg-slate-900 p-4 rounded-xl border border-slate-850 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Location Name</label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => updateCommute(c.id, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Distance</label>
                      <input
                        type="text"
                        value={c.distance}
                        onChange={(e) => updateCommute(c.id, 'distance', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Time</label>
                      <input
                        type="text"
                        value={c.time}
                        onChange={(e) => updateCommute(c.id, 'time', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Notes / Strategy</label>
                      <input
                        type="text"
                        value={c.note}
                        onChange={(e) => updateCommute(c.id, 'note', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeCommute(c.id)}
                      className="bg-red-950 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Schools Editor */}
            <div className="border-b border-slate-900 pb-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Schools Profile Matrix</h4>
                <button
                  onClick={addSchool}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all"
                >
                  + Add School Profile
                </button>
              </div>

              <div className="space-y-4">
                {schoolsList.map((s) => (
                  <div key={s.id} className="bg-slate-900 p-4 rounded-xl border border-slate-855 flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Facility Name</label>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateSchool(s.id, 'name', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-44">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Type</label>
                      <input
                        type="text"
                        value={s.type}
                        onChange={(e) => updateSchool(s.id, 'type', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Operating Hours</label>
                      <input
                        type="text"
                        value={s.hours}
                        onChange={(e) => updateSchool(s.id, 'hours', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                      <label className="block text-[10px] text-slate-500 font-bold uppercase mb-1">Highlights & Key Notes</label>
                      <input
                        type="text"
                        value={s.notes}
                        onChange={(e) => updateSchool(s.id, 'notes', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-100 text-xs focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => removeSchool(s.id)}
                      className="bg-red-950 text-red-400 border border-red-900/50 hover:bg-red-900 hover:text-white px-3 py-1.5 rounded-lg text-xs transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exporter Block */}
            <div className="pt-4 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowExporter(!showExporter)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow"
                >
                  {showExporter ? "Hide Export Code Block" : "Generate Custom Config JSON"}
                </button>
                <button
                  onClick={() => setActiveTab('planner')}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs px-5 py-3 rounded-xl transition-all"
                >
                  View Live Changes in Active NextBase ➔
                </button>
              </div>

              {showExporter && (
                <div className="space-y-2 mt-2">
                  <div className="text-xs font-bold text-emerald-400">Copy this JSON configuration schema for your open-source repo:</div>
                  <pre className="bg-slate-950 text-emerald-500 border border-slate-850 rounded-xl p-4 text-[11px] overflow-auto max-h-72 font-mono leading-relaxed">
                    {getConfigurationJson()}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2026 ToMoveTo Open-Source Relocation Blueprint. Built for families everywhere.</div>
          <div className="flex gap-4">
            <span onClick={() => { setOnboardingStep(1); setOnboardingComplete(false); }} className="hover:text-indigo-400 transition-colors cursor-pointer">Setup Wizard</span>
            <span>•</span>
            <span className="hover:text-indigo-400 transition-colors cursor-pointer">Submit Base Preset</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bot, Camera, Stethoscope, User as UserIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ...existing code...
const hospitals = [
  { name: "City Hospital", location: "123 Main St", contact: "555-1234" },
  { name: "Green Valley Clinic", location: "456 Green Rd", contact: "555-5678" },
  { name: "Sunrise Medical Center", location: "789 Sunrise Ave", contact: "555-9012" },
  { name: "Riverfront Hospital", location: "321 River St", contact: "555-3456" }
];
const appointmentSessions = ["Morning (8am-11am)", "Afternoon (12pm-3pm)", "Evening (4pm-7pm)", "Night (8pm-10pm)"];

const questions = [
  { field: 'name', text: "What's your full name?", placeholder: "Enter your full name" },
  { field: 'age', text: "Your age?", placeholder: "Enter your age", type: 'number' },
  { field: 'symptoms', text: "Describe your symptoms.", placeholder: "Tell me about your symptoms...", multiline: true },
  { field: 'imageUpload', text: "Upload an image of visible symptoms (optional).", showImageOption: true },
  { field: 'severity', text: "Rate your pain/discomfort (1-10).", placeholder: "Enter a number 1-10", type: 'number' },
  { field: 'duration', text: "How long have you had these symptoms?", options: ["Less than 1 hour", "1-6 hours", "6-24 hours", "1-3 days", "3-7 days", "More than a week"] },
  { field: 'hospital', text: "Select a nearby hospital:", options: hospitals },
  { field: 'appointment', text: "Preferred appointment session:", options: appointmentSessions },
  { field: 'appointmentDate', text: "Select your preferred appointment date:", placeholder: "Choose a date", type: 'date' }
];

const PatientTriage = () => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const permissionRequests = [
    { key: 'camera', icon: <Camera className="w-12 h-12 text-blue-500 mb-2" />, text: 'Camera', action: 'access Camera', subtext: 'This is required for capturing symptom images.' },
    { key: 'gallery', icon: <Bot className="w-12 h-12 text-accent mb-2" />, text: 'Gallery', action: 'access Gallery', subtext: 'This is required for uploading images.' },
    { key: 'notification', icon: <AlertTriangle className="w-12 h-12 text-warning mb-2" />, text: 'Notifications', action: 'send Notifications', subtext: 'This is required for appointment alerts.' },
    { key: 'location', icon: <Stethoscope className="w-12 h-12 text-green-500 mb-2" />, text: 'Location', action: 'access Location', subtext: 'This is required for finding nearby hospitals.' },
  ];
  const [permissionStep, setPermissionStep] = useState(0);
  const [aiQueue, setAiQueue] = useState([]);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: '1', type: 'bot', content: "Hi! I'm Dr. Maya, your AI health assistant. Let's get started! What's your full name?", timestamp: new Date() }
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    symptoms: "",
    imageUpload: "",
    voiceNote: "",
    language: "en",
    severity: "",
    duration: "",
    hospital: "",
    hospitalContact: "",
    hospitalLocation: "",
    appointment: "",
    appointmentDate: ""
  });
  const [uploadedImage, setUploadedImage] = useState(null);
  const [voiceNote, setVoiceNote] = useState(null);
  const [language, setLanguage] = useState("en");
  const [triageResult, setTriageResult] = useState(null);
  const [showAccessModal, setShowAccessModal] = useState(true);
  const [accessPermissions, setAccessPermissions] = useState({ camera: false, gallery: false, location: false });
  const messagesEndRef = useRef(null);

  const currentQ = questions[currentQuestion];

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, { ...msg, id: Math.random().toString(), timestamp: new Date() }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSubmit = () => {
    if (!currentInput && !uploadedImage && !currentQ.showImageOption) return;
    let value = currentInput;
    if (currentQ.showImageOption && uploadedImage) value = "[Image Uploaded]";
    addMessage({ type: "user", content: value });
    let info = { ...patientInfo };
    info[currentQ.field] = value;
    if (currentQ.field === "hospital") {
      const selected = hospitals.find(h => h.name === value);
      if (selected) {
        info.hospitalContact = selected.contact;
        info.hospitalLocation = selected.location;
      }
    }
    setPatientInfo(info);
    setCurrentInput("");
    setUploadedImage(null);
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => {
        addMessage({ type: "bot", content: questions[currentQuestion + 1].text });
        setCurrentQuestion(currentQuestion + 1);
      }, 500);
    } else {
      // Send patient info to Flask backend for AI prioritization
      fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: info.symptoms })
      })
        .then(res => res.json())
        .then(data => {
          addMessage({ type: "bot", content: data.response || "Thank you! Your details have been sent to the doctor." });
        });

      // Send image to backend if uploaded
      if (uploadedImage) {
        fetch("http://localhost:5000/api/image-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image_path: info.imageUpload })
        })
          .then(res => res.json())
          .then(data => {
            addMessage({ type: "bot", content: data.result || "Image analyzed." });
          });
      }

      // Send patient registration to backend
      fetch("http://localhost:5000/api/patient/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
      })
        .then(res => res.json())
        .then(data => {
          // Optionally handle registration response
        });
    }
  };

  const handleOptionClick = (option) => {
    setCurrentInput(option.name || option);
    setTimeout(handleSubmit, 300);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setUploadedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* Global Styles for glassmorphism and neumorphic effects */}
      <style>{`
        .glass-bubble {
          background: rgba(255,255,255,0.25);
          backdrop-filter: blur(12px);
          box-shadow: 0 0 24px 4px #c7bfff, 0 0 48px 8px #aeefff;
          border-radius: 1.5rem;
          border: 2px solid #e0cfff;
        }
        .glass-input {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
        }
        .glow-send {
          box-shadow: 0 0 16px #c7bfff;
        }
        .shadow-neumorphic {
          box-shadow: 8px 8px 16px #e0cfff, -8px -8px 16px #fff;
        }
        .shadow-neumorphic-glow {
          box-shadow: 0 0 16px #c7bfff, 0 0 32px #aeefff;
        }
        @keyframes slideup { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-slideup { animation: slideup 0.4s cubic-bezier(.4,1.4,.6,1) both; }
      `}</style>
      {/* Sequential Native Mobile Permission Modal */}
      {showAccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300">
          <div className="animate-slideup bg-white rounded-2xl shadow-2xl w-80 max-w-xs mx-auto flex flex-col items-center p-5" style={{minWidth:'280px'}}>
            {/* Icon */}
            {permissionRequests[permissionStep].icon}
            {/* Bold Text */}
            <div className="font-bold text-lg text-center mb-2">Allow Diagnosure to {permissionRequests[permissionStep].action}?</div>
            {/* Optional subtext */}
            <div className="text-sm text-gray-500 text-center mb-4">{permissionRequests[permissionStep].subtext}</div>
            {/* Buttons */}
            <div className="w-full flex flex-col gap-2 mt-2">
              <button className="w-full py-2 rounded-lg bg-blue-600 text-white font-bold text-base shadow" onClick={() => {
                if (permissionStep < permissionRequests.length - 1) {
                  setPermissionStep(permissionStep + 1);
                } else {
                  setShowAccessModal(false);
                }
              }}>Allow</button>
              <button className="w-full py-2 rounded-lg bg-gray-200 text-gray-700 font-bold text-base shadow" onClick={() => {
                if (permissionStep < permissionRequests.length - 1) {
                  setPermissionStep(permissionStep + 1);
                } else {
                  setShowAccessModal(false);
                }
              }}>Don't Allow</button>
              <button className="w-full py-2 rounded-lg bg-gray-100 text-gray-700 font-medium text-base border-t border-gray-300" onClick={() => {
                if (permissionStep < permissionRequests.length - 1) {
                  setPermissionStep(permissionStep + 1);
                } else {
                  setShowAccessModal(false);
                }
              }}>Only this time</button>
            </div>
          </div>
        </div>
      )}
      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/10 flex flex-col">
        <img src="/image3.png" alt="Diagnosure Logo" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0" style={{filter:'blur(2px)'}} />
        {/* Header */}
        <header className="border-b bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300/80 backdrop-blur-md shrink-0 shadow-md">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/90 shadow-lg flex items-center justify-center">
                <img src="/image2.png" alt="Diagnosure Logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-700 to-blue-900 bg-clip-text text-transparent drop-shadow">Diagnosure</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>Home</Button>
          </div>
        </header>
        {/* Chat Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {/* Medical animation in the center above chatbot avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex justify-center items-center mb-2">
              {/* Animated SVG stethoscope */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-slow">
                <path d="M20 16v12a12 12 0 0024 0V16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="32" cy="48" r="8" fill="#aeefff" stroke="#3b82f6" strokeWidth="3"/>
                <path d="M32 40v-8" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>
            <style>{`
              @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
              .animate-bounce-slow { animation: bounce-slow 2s infinite; }
            `}</style>
            <div className="relative flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-blue-400 to-pink-400 shadow-2xl flex items-center justify-center animate-pulse border-4 border-white/60" style={{boxShadow:'0 0 32px 8px #c7bfff, 0 0 64px 16px #aeefff'}}>
                <Bot className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              <span className="mt-2 text-base text-blue-700 font-semibold" style={{textShadow:'0 0 8px #fff'}}>Maya</span>
            </div>
          </div>
          <div className="w-full max-w-2xl">
            {messages.map((msg, idx) => (
              <div key={msg.id} className={`flex mb-4 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-5 py-3 rounded-2xl shadow-lg transition-all duration-300 ${msg.type === "user" ? "bg-gradient-to-r from-white/80 to-blue-100 text-blue-900 border border-blue-200" : "glass-bubble border-2 border-purple-300/60"}`}
                  style={msg.type === 'user' ? {fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:'1.1rem', lineHeight:'1.6', boxShadow:'0 2px 8px #c7bfff'} : {fontFamily:'Inter, sans-serif', fontWeight:500, fontSize:'1.1rem', lineHeight:'1.6', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(12px)', boxShadow:'0 0 24px 4px #c7bfff, 0 0 48px 8px #aeefff', borderRadius:'1.5rem', border:'2px solid #e0cfff'}}>
                  {msg.type === "bot" && <Bot className="inline w-5 h-5 mr-2 text-purple-400 animate-bounce" />}
                  {msg.type === "user" && <UserIcon className="inline w-5 h-5 mr-2 text-blue-400 animate-bounce" />}
                  <span className="align-middle font-medium">{msg.content}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Section */}
          {!triageResult && (
            <div className="w-full max-w-2xl mt-6 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                {/* If chat asks for image upload, show Yes/No buttons */}
                {currentQ?.placeholder === "Upload an image of visible symptoms (optional)" ? (
                  <div className="flex flex-col items-center mb-4">
                    <div className="mb-2 font-medium text-blue-900">Upload an image of visible symptoms (optional)</div>
                    <div className="flex gap-4">
                      <button className="px-6 py-2 rounded-xl bg-blue-600 text-white font-bold shadow hover:bg-blue-700" onClick={() => setShowImageUpload(true)}>Yes</button>
                      <button className="px-6 py-2 rounded-xl bg-gray-200 text-blue-700 font-bold shadow hover:bg-gray-300" onClick={() => setShowImageUpload(false)}>No</button>
                    </div>
                  </div>
                  ) : null}
                {/* Input bar with camera icon for image upload */}
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full flex items-center">
                    {/* Camera icon for image upload */}
                    <label htmlFor="image-upload" className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-blue-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h2l2-3h10l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm9 7a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <input
                      value={currentInput}
                      onChange={e => setCurrentInput(e.target.value)}
                      placeholder={currentQ?.placeholder || "Type your answer..."}
                      className="w-full rounded-full px-12 py-3 bg-gradient-to-r from-white/80 to-purple-100 shadow-lg border-none outline-none text-blue-900 font-medium text-lg glass-input"
                      style={{backdropFilter:'blur(8px)', boxShadow:'0 2px 16px #c7bfff'}}
                      onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                    <button onClick={handleSubmit} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full px-4 py-2 shadow-lg text-white font-bold text-lg glow-send hover:scale-105 transition-transform duration-200" style={{boxShadow:'0 0 16px #c7bfff'}}>
                      Send
                    </button>
                  </div>
                  {/* Voice and language selectors below input */}
                  <div className="flex gap-3 mt-3">
                    <button type="button" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded shadow hover:shadow-lg" onClick={() => alert('Voice recording feature coming soon!')}>Record Voice</button>
                    <select value={language} onChange={e => setLanguage(e.target.value)} className="bg-gradient-to-r from-white/80 to-blue-100 text-blue-700 rounded px-2 py-1 shadow">
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="ta">Tamil</option>
                      <option value="bn">Bengali</option>
                      <option value="gu">Gujarati</option>
                      <option value="te">Telugu</option>
                      <option value="kn">Kannada</option>
                      <option value="pa">Punjabi</option>
                      <option value="ur">Urdu</option>
                    </select>
                  </div>
                </div>
                {/* If Yes is selected, show camera/gallery upload */}
                {showImageUpload && (
                  <div className="w-full flex flex-col items-center mt-4">
                    <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="block w-full text-blue-900" />
                    <div className="text-xs text-gray-500 mt-2">You can use your camera or select from gallery.</div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* AI-Prioritized Patient Queue Section */}
          {aiQueue.length > 0 && (
            <Card className="mt-8 w-full max-w-2xl shadow-2xl border border-primary/20">
              <CardContent>
                <div className="flex items-center mb-4">
                  <Stethoscope className="w-8 h-8 text-blue-500 mr-3 animate-pulse" />
                  <h2 className="text-2xl font-extrabold text-primary">AI-Prioritized Patient Queue</h2>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="px-3 py-2">SNo</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Issue</th>
                      <th className="px-3 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiQueue.map((row, idx) => (
                      <tr key={idx} className="border-b border-blue-800">
                        <td className="px-3 py-2 text-blue-100">{row.Sno}</td>
                        <td className="px-3 py-2 text-blue-100">{row.Name}</td>
                        <td className="px-3 py-2 text-blue-100">{row.Issue}</td>
                        <td className="px-3 py-2 text-blue-100">{row.Time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button variant="outline" className="flex-1 text-lg py-3" onClick={() => navigate("/")}>Return to Homepage</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default PatientTriage;

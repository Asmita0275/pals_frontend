import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  MoreHorizontal,
  Search,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Patient {
  id: string;
  name: string;
  age: number;
  triageLevel: 'emergency' | 'warning' | 'safe';
  symptoms: string;
  waitTime: string;
  aiSummary: string;
  vitals?: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
  };
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch doctor profile and patient queue from backend
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [allPatients, setAllPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Fetch doctor profile
    fetch('http://localhost:5000/api/doctor/profile')
      .then(res => res.json())
      .then(data => setDoctorProfile(data.doctor));

    // Fetch patient queue (add this endpoint to backend if needed)
    fetch('http://localhost:5000/api/patient/queue')
      .then(res => res.json())
      .then(data => setAllPatients(data.patients || []));
  }, []);

  const getTriageIcon = (level: string) => {
    switch (level) {
      case 'emergency': return <AlertCircle className="w-4 h-4" />;
      case 'warning': return <Clock className="w-4 h-4" />;
      case 'safe': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case 'emergency': return 'bg-emergency text-emergency-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'safe': return 'bg-safe text-safe-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTriageLabel = (level: string) => {
    switch (level) {
      case 'emergency': return 'Emergency';
      case 'warning': return 'Moderate';
      case 'safe': return 'Routine';
      default: return 'Unknown';
    }
  };

  const sortedPatients = allPatients
    .filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priorityOrder = { emergency: 0, warning: 1, safe: 2 };
      return priorityOrder[a.triageLevel] - priorityOrder[b.triageLevel];
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-accent/10">
  <img src="/image3.png" alt="Diagnosure Logo" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0" style={{filter:'blur(2px)'}} />
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/')}> 
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-extrabold text-primary">Doctor Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Alerts (2)
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/80 shadow-lg flex items-center justify-center">
                <img src="/image2.png" alt="Diagnosure Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-bold text-primary">Dr. Smith</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient Queue */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-xl border border-primary/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-xl font-bold">
                  <span>Patient Queue</span>
                  <Badge variant="secondary" className="text-base px-3 py-1">{sortedPatients.length} patients</Badge>
                </CardTitle>
                <CardDescription className="text-lg">Patients sorted by triage priority</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="Search patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 py-3 rounded-xl border-2 border-primary/10 text-lg"
                    />
                  </div>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Filter className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {sortedPatients.map((patient) => (
                    <Card 
                      key={patient.id}
                      className={`cursor-pointer transition-all duration-200 hover:bg-primary/5 rounded-xl shadow-md border border-primary/10 ${
                        selectedPatient?.id === patient.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-lg">{patient.name}</h4>
                            <p className="text-base text-muted-foreground">Age {patient.age}</p>
                          </div>
                          <Badge className={getTriageColor(patient.triageLevel) + ' text-base px-3 py-1'}>
                            {getTriageIcon(patient.triageLevel)}
                            <span className="ml-1">{getTriageLabel(patient.triageLevel)}</span>
                          </Badge>
                        </div>
                        <p className="text-base text-muted-foreground mb-2">{patient.symptoms}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Waiting: {patient.waitTime}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Patient Details */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-8">
                <Card className="shadow-xl border border-primary/10 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                          <User className="w-6 h-6 text-primary" />
                          {selectedPatient.name}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          Age {selectedPatient.age} • Waiting: {selectedPatient.waitTime}
                        </CardDescription>
                      </div>
                      <Badge className={getTriageColor(selectedPatient.triageLevel) + ' text-base px-3 py-1'}>
                        {getTriageIcon(selectedPatient.triageLevel)}
                        <span className="ml-1">{getTriageLabel(selectedPatient.triageLevel)}</span>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center text-lg">
                        <FileText className="w-5 h-5 mr-2" />
                        AI Clinical Summary
                      </h4>
                      <p className="text-base bg-muted p-4 rounded-xl">
                        {selectedPatient.aiSummary}
                      </p>
                    </div>

                    {selectedPatient.vitals && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center text-lg">
                          <Activity className="w-5 h-5 mr-2" />
                          Vital Signs
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-base">
                          <div className="bg-muted p-4 rounded-xl text-center">
                            <p className="font-medium">Blood Pressure</p>
                            <p className="text-xl">{selectedPatient.vitals.bloodPressure}</p>
                          </div>
                          <div className="bg-muted p-4 rounded-xl text-center">
                            <p className="font-medium">Heart Rate</p>
                            <p className="text-xl">{selectedPatient.vitals.heartRate} bpm</p>
                          </div>
                          <div className="bg-muted p-4 rounded-xl text-center">
                            <p className="font-medium">Temperature</p>
                            <p className="text-xl">{selectedPatient.vitals.temperature}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4 pt-4">
                      <Button className="flex-1 text-lg py-3">
                        <Calendar className="w-5 h-5 mr-2" />
                        Start Consultation
                      </Button>
                      <Button variant="outline" className="flex-1 text-lg py-3">
                        <FileText className="w-5 h-5 mr-2" />
                        View Full History
                      </Button>
                      <Button variant="outline" size="icon" className="rounded-xl">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </div>
                    {/* Prescription and Report Upload */}
                    <div className="mt-8">
                      <h4 className="font-semibold mb-2 text-lg">Prescription & Report</h4>
                      <textarea className="w-full p-3 border-2 border-primary/10 rounded-xl mb-2 text-lg" placeholder="Enter prescription or report..." />
                      <Button variant="default" className="w-full text-lg py-3">Save Prescription/Report</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-xl border border-primary/10 rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" size="lg" className="rounded-xl">Order Lab Tests</Button>
                      <Button variant="outline" size="lg" className="rounded-xl">Prescribe Medication</Button>
                      <Button variant="outline" size="lg" className="rounded-xl">Refer Specialist</Button>
                      <Button variant="outline" size="lg" className="rounded-xl">Discharge Patient</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-[400px] flex items-center justify-center shadow-xl border border-primary/10 rounded-2xl">
                <CardContent className="text-center">
                  <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Select a Patient</h3>
                  <p className="text-lg text-muted-foreground">
                    Choose a patient from the queue to view their details and AI assessment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
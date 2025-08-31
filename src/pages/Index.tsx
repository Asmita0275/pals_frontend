import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Users, 
  Clock, 
  Shield, 
  MessageSquare, 
  Stethoscope,
  ChevronRight,
  Activity,
  UserCheck,
  AlertTriangle,
  Sparkles,
  Bot,
  Camera,
  Zap
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for role
    const savedRole = localStorage.getItem('userRole');
    if (savedRole) setRole(savedRole);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-32 h-32 mb-6 rounded-full overflow-hidden bg-white/80 shadow-lg flex items-center justify-center mx-auto">
          <img src="/image3.png" alt="Diagnosure Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-5xl font-bold text-primary mb-2 animate-fade-in">Diagnosure</h1>
        <p className="text-lg text-muted-foreground animate-fade-in">AI-Powered Healthcare Triage</p>
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black relative">
      <img src="/image3.png" alt="Diagnosure Logo" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0" style={{filter:'blur(2px)'}} />
    <img src="/image3.png" alt="Diagnosure Logo" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 max-w-lg h-auto object-contain opacity-10 pointer-events-none z-0" style={{filter:'blur(2px)'}} />
      {/* Header */}
  <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-black">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <img src="/image2.png" alt="Diagnosure Logo" className="w-10 h-10 rounded-full object-cover bg-white/80 shadow" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg" style={{fontFamily: 'Century Schoolbook, serif'}}>Diagnosure</h1>
          </div>
          <div className="flex space-x-3">
            <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-lg font-bold shadow-lg px-6 py-2" onClick={() => navigate('/auth')}>
              Login / Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-16 text-center overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-20 animate-bounce delay-2000">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full flex items-center justify-center animate-pulse shadow-xl">
              <Stethoscope className="w-10 h-10 text-accent" />
            </div>
          </div>
          <div className="absolute bottom-20 left-20 animate-bounce delay-3000">
            <div className="w-16 h-16 bg-gradient-to-br from-safe/30 to-accent/20 rounded-full flex items-center justify-center animate-pulse shadow-xl">
              <Activity className="w-8 h-8 text-safe" />
            </div>
          </div>
          <div className="absolute top-40 left-1/2 animate-bounce delay-500">
            <div className="w-12 h-12 bg-gradient-to-br from-warning/30 to-primary/10 rounded-full flex items-center justify-center animate-pulse shadow-xl">
              <Zap className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>

        <Badge className="mb-4 animate-fade-in bg-gradient-to-r from-primary/20 to-accent/20 border-primary/30 text-lg px-4 py-2 shadow-lg" variant="secondary">
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          AI-Powered Healthcare Innovation
        </Badge>
        <h2 className="text-5xl md:text-7xl font-extrabold text-primary mb-6 animate-fade-in drop-shadow-lg">
          <span style={{fontFamily: 'Century Schoolbook, serif'}}>Diagnosure</span>
          <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-6xl mt-2" style={{fontFamily: 'Futura, sans-serif'}}>
            Intelligent Patient Triage
          </span>
        </h2>
        <p className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-fade-in font-medium">
          <span style={{fontFamily: 'Futura, sans-serif'}}>
            <span className="text-blue-100">Streamline patient care with AI-powered symptom assessment, smart triage categorization, and real-time doctor dashboards. Reducing wait times and improving healthcare outcomes.</span>
          </span>
        </p>
        
        {/* Animated Characters */}
        <div className="flex justify-center items-center gap-8 mb-8">
          <div className="relative animate-bounce delay-200">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-10 h-10 text-primary-foreground animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
          </div>
          <div className="text-2xl animate-pulse"></div>
          <div className="relative animate-bounce delay-700">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button size="lg" onClick={() => navigate('/auth')} className="group bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300">
            Get Started
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            <span style={{fontFamily: 'Century Schoolbook, serif'}} className="px-6 py-2 rounded-xl border-4 border-white text-white bg-transparent shadow-lg">Revolutionizing Healthcare Triage</span>
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <span className="text-blue-100">Advanced AI technology meets healthcare expertise to deliver faster, more accurate patient assessments and care coordination.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-primary/5 group">
            <CardHeader>
              <div className="relative">
                <MessageSquare className="w-8 h-8 text-primary mb-2 group-hover:animate-bounce" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Conversational AI</CardTitle>
              <CardDescription>
                Natural language symptom collection with adaptive questioning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Intelligent chatbot guides patients through symptom assessment 
                with personalized questions based on their responses.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertTriangle className="w-8 h-8 text-warning mb-2" />
              <CardTitle>Smart Triage</CardTitle>
              <CardDescription>
                AI-powered risk categorization with clinical explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-2">
                <Badge className="bg-emergency text-emergency-foreground">Emergency</Badge>
                <Badge className="bg-warning text-warning-foreground">Moderate</Badge>
                <Badge className="bg-safe text-safe-foreground">Routine</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Color-coded urgency levels with transparent AI reasoning.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Activity className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Real-time Dashboard</CardTitle>
              <CardDescription>
                Live patient queue with priority-based sorting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Doctors see prioritized patient lists with AI-generated summaries 
                and suggested next steps.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 hover:bg-accent/5 group">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-6 h-6 text-accent group-hover:animate-pulse" />
                <Users className="w-6 h-6 text-primary group-hover:animate-bounce delay-100" />
                <MessageSquare className="w-6 h-6 text-safe group-hover:animate-pulse delay-200" />
              </div>
              <CardTitle className="group-hover:text-accent transition-colors">Multi-Modal Input</CardTitle>
              <CardDescription>
                Text, voice, and image-based symptom reporting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Accessible for all literacy levels with speech-to-text and 
                visual symptom documentation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="w-8 h-8 text-accent mb-2" />
              <CardTitle>Faster Care</CardTitle>
              <CardDescription>
                Reduced wait times through intelligent prioritization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Urgent cases identified immediately, routine cases efficiently 
                scheduled for optimal resource utilization.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-8 h-8 text-safe mb-2" />
              <CardTitle>Clinical Safety</CardTitle>
              <CardDescription>
                HIPAA-compliant with explainable AI decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every triage decision backed by transparent reasoning that 
                healthcare professionals can review and validate.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
  <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-black">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <p className="text-muted-foreground">Faster Triage Processing</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">92%</div>
              <p className="text-muted-foreground">Accuracy in Risk Assessment</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-safe mb-2">60%</div>
              <p className="text-muted-foreground">Reduction in Wait Times</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h3 className="text-4xl font-extrabold text-primary mb-4 drop-shadow-lg">
          Ready to Transform Healthcare?
        </h3>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto font-medium">
          Join healthcare providers worldwide who are using Diagnosure to deliver 
          faster, more accurate patient care.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-lg font-bold shadow-lg px-8 py-3" onClick={() => navigate('/auth')}>
            <UserCheck className="w-5 h-5 mr-2" />
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="text-lg font-bold px-8 py-3">
            Schedule Demo
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2025 Diagnosure. Revolutionizing healthcare through AI innovation.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
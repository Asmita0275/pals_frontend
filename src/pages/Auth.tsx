import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import type { User, Session } from '@supabase/supabase-js';

const Auth = () => {
  // State for patient and doctor details
  const [patientDetails, setPatientDetails] = useState({
    age: '',
    gender: '',
    address: '',
    phone: ''
  });
  const [doctorDetails, setDoctorDetails] = useState({
    specialization: '',
    hospital: '',
    hospitalAddress: '',
    phone: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Redirect authenticated users to home page
        if (session?.user) {
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Redirect if already authenticated
      if (session?.user) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Skip error toast, just redirect
      localStorage.setItem('userRole', role);
      if (role === 'patient') {
        navigate('/patienttriage');
      } else {
        navigate('/doctordashboard');
      }
      return;
    }

    setLoading(true);
    const redirectUrl = `${window.location.origin}/`;
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });
    setLoading(false);
    // Always redirect after signup
    localStorage.setItem('userRole', role);
    if (role === 'patient') {
      navigate('/patienttriage');
    } else {
      navigate('/doctordashboard');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    // Always redirect after login
    localStorage.setItem('userRole', role);
    if (role === 'patient') {
      navigate('/patienttriage');
    } else {
      navigate('/doctordashboard');
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <img src="/image3.png" alt="Diagnosure Logo" className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none z-0" style={{filter:'blur(2px)'}} />
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white/80 shadow-lg flex items-center justify-center">
              <img src="/image2.png" alt="Diagnosure Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold text-foreground">Diagnosure</span>
          </div>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              {isLogin ? "Welcome Back" : (role === 'patient' ? "Patient Registration" : "Doctor Registration")}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Sign in to access your Diagnosure dashboard" 
                : (role === 'patient' 
                  ? "Please fill in your full details to register as a patient."
                  : "Please fill in your details and hospital information to register as a doctor.")
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              {!isLogin && role === 'patient' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required={!isLogin} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                    <Input id="age" type="number" placeholder="Enter your age" required value={patientDetails?.age || ''} onChange={e => setPatientDetails({ ...patientDetails, age: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                    <Input id="gender" type="text" placeholder="Enter your gender" required value={patientDetails?.gender || ''} onChange={e => setPatientDetails({ ...patientDetails, gender: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input id="address" type="text" placeholder="Enter your address" required value={patientDetails?.address || ''} onChange={e => setPatientDetails({ ...patientDetails, address: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" required value={patientDetails?.phone || ''} onChange={e => setPatientDetails({ ...patientDetails, phone: e.target.value })} />
                  </div>
                </>
              )}
              {!isLogin && role === 'doctor' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="fullName" type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required={!isLogin} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-sm font-medium">Specialization</Label>
                    <Input id="specialization" type="text" placeholder="Enter your specialization" required value={doctorDetails?.specialization || ''} onChange={e => setDoctorDetails({ ...doctorDetails, specialization: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospital" className="text-sm font-medium">Hospital Name</Label>
                    <Input id="hospital" type="text" placeholder="Enter hospital name" required value={doctorDetails?.hospital || ''} onChange={e => setDoctorDetails({ ...doctorDetails, hospital: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hospitalAddress" className="text-sm font-medium">Hospital Address</Label>
                    <Input id="hospitalAddress" type="text" placeholder="Enter hospital address" required value={doctorDetails?.hospitalAddress || ''} onChange={e => setDoctorDetails({ ...doctorDetails, hospitalAddress: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input id="phone" type="tel" placeholder="Enter your phone number" required value={doctorDetails?.phone || ''} onChange={e => setDoctorDetails({ ...doctorDetails, phone: e.target.value })} />
                  </div>
                </>
              )}
              {/* ...existing code... (role selection, email, password, etc.) */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Login as</Label>
                <div className="flex gap-4">
                  <Button type="button" variant={role === 'patient' ? 'default' : 'outline'} onClick={() => setRole('patient')}>Patient</Button>
                  <Button type="button" variant={role === 'doctor' ? 'default' : 'outline'} onClick={() => setRole('doctor')}>Doctor</Button>
                </div>
              </div>
              {/* ...existing code... (email, password, confirm password, submit button, etc.) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
                </div>
              </div>
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10" required={!isLogin} minLength={6} />
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}</Button>
            </form>
            {/* ...existing code... (toggle login/signup, forgot password, etc.) */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
              <Button variant="link" onClick={toggleMode} className="text-primary hover:text-primary-dark font-medium">{isLogin ? "Create one here" : "Sign in instead"}</Button>
            </div>
            {isLogin && (
              <div className="mt-4 text-center">
                <Button variant="link" className="text-sm text-muted-foreground">Forgot your password?</Button>
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-xs text-muted-foreground">By continuing, you agree to our Terms of Service and Privacy Policy</div>
      </div>
    </div>
  );
};

export default Auth;
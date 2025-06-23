import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText } from 'lucide-react';
const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate('/app');
      }
    };
    checkUser();
  }, [navigate]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: {
            full_name: fullName
          }
        }
      });
      if (error) throw error;
      if (data.user) {
        toast({
          title: "Success!",
          description: "Please check your email to confirm your account."
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (data.user) {
        navigate('/app');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 shadow-lg">
        <CardHeader className="text-center bg-white">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-slate-600 mr-2" />
            <h1 className="text-2xl font-bold text-slate-800">Jot</h1>
          </div>
          <CardTitle className="text-slate-800">Welcome to Jot</CardTitle>
          <CardDescription className="text-slate-600">
            Your personal note-taking app with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="signin" className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-slate-700 data-[state=active]:bg-white data-[state=active]:text-slate-800">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-slate-900" />
                </div>
                <div>
                  <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-slate-900" />
                </div>
                <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Input type="text" placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-slate-900" />
                </div>
                <div>
                  <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-slate-900" />
                </div>
                <div>
                  <Input type="password" placeholder="Password (min. 6 characters)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-slate-900" />
                </div>
                <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign Up
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>;
};
export default Auth;
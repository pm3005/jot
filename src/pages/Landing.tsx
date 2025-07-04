
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { FileText, PenTool, Folder, Sparkles } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-slate-600 mr-2" />
          <h1 className="text-2xl font-bold text-slate-800">Jot</h1>
        </div>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/auth')} className="bg-slate-800 hover:bg-slate-700 text-white">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
         <h2 className="text-5xl font-bold text-slate-800 mb-6">
            Your ideas,{" "}
            <span className="bg-gradient-to-r from-purple-700 to-indigo-500 bg-clip-text text-transparent">
              organized
            </span>{" "}
            and{" "}
            <span className="bg-gradient-to-r from-teal-700 to-cyan-500 bg-clip-text text-transparent">
              enhanced
            </span>
          </h2>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
           Messy class notes? Midnight deadlines? <br />
  Not anymore. Format and rewrite your notes at the click of a button. <br />
  Now all you have to do is <strong>Jot</strong>.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-slate-800 hover:bg-slate-700 text-lg px-8 py-3 text-white">
            Start Writing Today
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white text-black border border-black">
            <CardHeader>
              <PenTool className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <CardTitle className="text-slate-800">Rich Text Editor</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600">
                Write with a powerful editor that supports formatting, lists, and everything you need to express your ideas clearly.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white text-black border border-black">
            <CardHeader>
              <Folder className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <CardTitle className="text-slate-800">Smart Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600">
                Organize your notes with folders, tags, and smart search to find exactly what you're looking for in seconds.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white text-black border border-black">
            <CardHeader>
              <Sparkles className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <CardTitle className="text-slate-800">AI Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-slate-600">
                Get writing suggestions, improve your content, and enhance your notes with intelligent AI-powered features.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg p-12 shadow-sm border border-slate-200">
          <h3 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to transform your note-taking?
          </h3>
          <p className="text-lg text-slate-600 mb-8">
            Join thousands of users who have already made the switch to smarter note-taking.
          </p>
          <Button size="lg" onClick={() => navigate('/auth')} className="bg-slate-800 hover:bg-slate-700 text-lg px-8 py-3 text-white">
            Get Started for Free
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 mr-2" />
            <span className="text-lg font-semibold">Jot</span>
          </div>
          <p className="text-slate-400">
            © 2024 Jot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

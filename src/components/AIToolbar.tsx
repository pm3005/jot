import { useState } from 'react';
import { Wand2, FileText, Sparkles, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIToolbarProps {
  selectedText: string;
  onReplaceText: (text: string) => void;
  onReplaceHtml: (html: string) => void;
  onInsertText: (text: string) => void;
  onInsertHtml: (html: string) => void;
}

const AIToolbar = ({ 
  selectedText, 
  onReplaceText, 
  onReplaceHtml, 
  onInsertText, 
  onInsertHtml 
}: AIToolbarProps) => {
  const [showRewriteMenu, setShowRewriteMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const rewriteMoods = [
    { label: 'Professional', value: 'professional' },
    { label: 'Casual', value: 'casual' },
    { label: 'Academic', value: 'academic' },
    { label: 'Creative', value: 'creative' },
    { label: 'Concise', value: 'concise' },
    { label: 'Detailed', value: 'detailed' },
  ];

  const callAIFunction = async (action: 'rewrite' | 'format' | 'generate', text: string, mood?: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { action, text, mood }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'AI service error');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.result;
    } catch (error) {
      console.error('AI function call error:', error);
      throw error;
    }
  };

  const handleRewrite = async (mood: string) => {
    if (!selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please select some text to rewrite.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setShowRewriteMenu(false);
    
    try {
      const rewrittenText = await callAIFunction('rewrite', selectedText, mood);
      onReplaceText(rewrittenText);
      
      toast({
        title: "Text rewritten",
        description: `Successfully rewritten in ${mood} style.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to rewrite text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormat = async () => {
    if (!selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please select some text to format.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const formattedText = await callAIFunction('format', selectedText);
      // Use HTML replacement for formatting since it may contain HTML tags
      onReplaceHtml(formattedText);
      
      toast({
        title: "Text formatted",
        description: "Successfully formatted and fixed typos.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to format text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    
    try {
      // Use selected text as context, or provide a default prompt if no text is selected
      const contextText = selectedText.trim() || "Write a helpful and informative paragraph about note-taking and productivity.";
      const generatedText = await callAIFunction('generate', contextText);
      // Use HTML insertion for generated content since it may contain HTML formatting
      onInsertHtml(generatedText);
      
      toast({
        title: "Text generated",
        description: "Successfully generated continuation text.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Rewrite Button with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowRewriteMenu(!showRewriteMenu)}
          disabled={isProcessing}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wand2 size={16} />
          <span>Rewrite</span>
          <ChevronDown size={14} />
        </button>
        
        {showRewriteMenu && (
          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
            {rewriteMoods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => handleRewrite(mood.value)}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
              >
                {mood.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Format Button */}
      <button
        onClick={handleFormat}
        disabled={isProcessing}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText size={16} />
        <span>Format</span>
      </button>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isProcessing}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Sparkles size={16} />
        <span>Generate</span>
      </button>

      {isProcessing && (
        <div className="flex items-center space-x-2 text-slate-500">
          <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full"></div>
          <span className="text-sm">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default AIToolbar;
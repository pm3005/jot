
import { useState } from 'react';
import { Wand2, FileText, Sparkles, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIToolbarProps {
  selectedText: string;
  onReplaceText: (text: string) => void;
  onInsertText: (text: string) => void;
}

const AIToolbar = ({ selectedText, onReplaceText, onInsertText }: AIToolbarProps) => {
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

  const simulateAIResponse = async (prompt: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Mock responses based on the prompt type
    if (prompt.includes('rewrite')) {
      return `${selectedText} (rewritten in ${prompt.split(' ')[1]} style)`;
    } else if (prompt.includes('format')) {
      return selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase().replace(/\s+/g, ' ').trim();
    } else if (prompt.includes('generate')) {
      return ` This is AI-generated continuation text that flows naturally from your content. It demonstrates how the Generate feature can help you continue your thoughts seamlessly.`;
    }
    return selectedText;
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
      const rewrittenText = await simulateAIResponse(`rewrite ${mood} ${selectedText}`);
      onReplaceText(rewrittenText);
      
      toast({
        title: "Text rewritten",
        description: `Successfully rewritten in ${mood} style.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rewrite text. Please try again.",
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
      const formattedText = await simulateAIResponse(`format ${selectedText}`);
      onReplaceText(formattedText);
      
      toast({
        title: "Text formatted",
        description: "Successfully formatted and fixed typos.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to format text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    setIsProcessing(true);
    
    try {
      const generatedText = await simulateAIResponse('generate continuation');
      onInsertText(generatedText);
      
      toast({
        title: "Text generated",
        description: "Successfully generated continuation text.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate text. Please try again.",
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

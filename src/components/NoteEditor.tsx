import { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Note } from '@/types/Note';
import AIToolbar from '@/components/AIToolbar';
import InsertMenu from '@/components/InsertMenu';
import { Undo, Redo, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface NoteEditorProps {
  note: Note;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
}

const NoteEditor = ({ note, onUpdateNote }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<any>(null);
  const quillRef = useRef<ReactQuill>(null);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        onUpdateNote(note.id, { title, content });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [title, content, note.id, note.title, note.content, onUpdateNote]);

  const handleContentChange = (value: string) => {
    setUndoStack(prev => [...prev, content]);
    setRedoStack([]);
    setContent(value);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
  };

  const handleSelectionChange = (range: any) => {
    if (range && range.length > 0) {
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const text = quill.getText(range.index, range.length);
        setSelectedText(text);
        setSelectionRange(range);
      }
    } else {
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  const replaceSelectedText = (newText: string) => {
    if (quillRef.current && selectionRange) {
      const quill = quillRef.current.getEditor();
      quill.deleteText(selectionRange.index, selectionRange.length);
      quill.insertText(selectionRange.index, newText);
      quill.setSelection(selectionRange.index + newText.length);
    }
  };

  const insertTextAtCursor = (text: string) => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      const selection = quill.getSelection();
      const index = selection ? selection.index : quill.getLength();
      quill.insertText(index, text);
      quill.setSelection(index + text.length);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [content, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      setContent(previousContent);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0];
      setUndoStack(prev => [...prev, content]);
      setRedoStack(prev => prev.slice(1));
      setContent(nextContent);
    }
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    
    // Add title
    pdf.setFontSize(20);
    pdf.text(title || 'Untitled Note', 20, 30);
    
    // Add content (strip HTML tags for basic text)
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    pdf.setFontSize(12);
    
    // Split text into lines that fit the page width
    const splitText = pdf.splitTextToSize(textContent, 170);
    pdf.text(splitText, 20, 50);
    
    // Save the PDF
    pdf.save(`${title || 'note'}.pdf`);
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ]
    }
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'align', 'blockquote', 'code-block', 'link', 'image', 'video'
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-3xl font-bold text-navy-900 bg-transparent border-none outline-none placeholder-slate-400 flex-1 mr-4"
            placeholder="Untitled Note"
          />
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportToPDF}
              className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
              title="Export to PDF"
            >
              <Download size={18} />
            </button>
            
            <button
              onClick={handleUndo}
              disabled={undoStack.length === 0}
              className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            
            <button
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <AIToolbar
            selectedText={selectedText}
            onReplaceText={replaceSelectedText}
            onInsertText={insertTextAtCursor}
          />
          
          <InsertMenu onInsert={insertTextAtCursor} />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-6">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          onChangeSelection={handleSelectionChange}
          modules={modules}
          formats={formats}
          className="h-full"
          placeholder="Start writing your note..."
        />
      </div>
    </div>
  );
};

export default NoteEditor;

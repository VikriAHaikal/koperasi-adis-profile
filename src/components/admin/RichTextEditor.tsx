import React, { useRef, useEffect, useState } from 'react';
import { 
  Bold, Italic, Underline, Heading2, Heading3, 
  List, ListOrdered, Eraser, Link, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  onUploadImage?: (file: File) => Promise<string>;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tulis konten lengkap berita di sini...',
  onUploadImage
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Load initial content or handle external state resets
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, arg: string = '') => {
    // Focus the editor first to ensure selection is active
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    handleInput();
  };

  const insertLink = () => {
    const url = prompt('Masukkan URL Link (contoh: https://google.com):');
    if (url) {
      let formattedUrl = url.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('/')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand('createLink', false, formattedUrl);
      
      // Post-process links to add target="_blank" and secure rel attributes
      if (editorRef.current) {
        const anchors = editorRef.current.getElementsByTagName('a');
        for (let i = 0; i < anchors.length; i++) {
          const a = anchors[i];
          if (a.getAttribute('href') === formattedUrl) {
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            a.style.color = 'var(--primary)';
            a.style.textDecoration = 'underline';
            a.style.fontWeight = '600';
          }
        }
        handleInput();
      }
    }
  };

  const handleImageUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadImage) {
      setIsUploading(true);
      try {
        const publicUrl = await onUploadImage(file);
        if (editorRef.current) {
          editorRef.current.focus();
        }
        document.execCommand('insertImage', false, publicUrl);
        
        // Post-process image to apply beautiful, responsive CSS styles
        if (editorRef.current) {
          const imgs = editorRef.current.getElementsByTagName('img');
          for (let i = 0; i < imgs.length; i++) {
            const img = imgs[i];
            if (img.getAttribute('src') === publicUrl) {
              img.style.maxWidth = '100%';
              img.style.height = 'auto';
              img.style.borderRadius = '12px';
              img.style.marginTop = '16px';
              img.style.marginBottom = '16px';
              img.style.display = 'block';
              img.style.border = '1px solid var(--border-light)';
              img.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.05)';
            }
          }
          handleInput();
        }
      } catch (err: any) {
        alert(err.message || 'Gagal mengunggah gambar');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // reset uploader
        }
      }
    }
  };

  return (
    <div style={{
      border: '1px solid var(--border-light)',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      position: 'relative'
    }}>
      {/* Loading Overlay */}
      {isUploading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          gap: '10px'
        }}>
          <span className="spinner-mini" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-dark)' }}>Mengunggah Gambar...</span>
        </div>
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '8px',
        borderBottom: '1px solid var(--border-light)',
        backgroundColor: '#f8fafc',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        {/* Formatting Group */}
        <button
          type="button"
          onClick={() => executeCommand('bold')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Tebal"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('italic')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Miring"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('underline')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Garis Bawah"
        >
          <Underline size={14} />
        </button>
        
        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        {/* Headings */}
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h2>')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Judul Utama H2"
        >
          <Heading2 size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<h3>')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Subjudul H3"
        >
          <Heading3 size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('formatBlock', '<p>')}
          className="btn btn-secondary"
          style={{ padding: '4px 8px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 600 }}
          title="Teks Normal"
        >
          Normal
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => executeCommand('justifyLeft')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Rata Kiri"
        >
          <AlignLeft size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyCenter')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Rata Tengah"
        >
          <AlignCenter size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('justifyRight')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Rata Kanan"
        >
          <AlignRight size={14} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        {/* Lists */}
        <button
          type="button"
          onClick={() => executeCommand('insertUnorderedList')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Daftar Bullet"
        >
          <List size={14} />
        </button>
        <button
          type="button"
          onClick={() => executeCommand('insertOrderedList')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Daftar Nomor"
        >
          <ListOrdered size={14} />
        </button>

        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        {/* Links & Images */}
        <button
          type="button"
          onClick={insertLink}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Sisipkan Tautan (Link)"
        >
          <Link size={14} />
        </button>

        {onUploadImage && (
          <button
            type="button"
            onClick={handleImageUploadClick}
            className="btn btn-secondary"
            style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Unggah & Sisipkan Gambar"
          >
            <ImageIcon size={14} />
          </button>
        )}

        <div style={{ width: '1px', height: '20px', backgroundColor: '#e2e8f0', margin: '0 6px' }} />

        {/* Eraser */}
        <button
          type="button"
          onClick={() => executeCommand('removeFormat')}
          className="btn btn-secondary"
          style={{ padding: '6px', minWidth: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Bersihkan Format"
        >
          <Eraser size={14} />
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{
          minHeight: '280px',
          padding: '16px',
          outline: 'none',
          fontSize: '0.92rem',
          lineHeight: '1.6',
          color: 'var(--text-dark)',
          overflowY: 'auto'
        }}
        className="rich-editor-area"
      />

      <style>{`
        .rich-editor-area:empty::before {
          content: attr(data-placeholder);
          color: #94a3b8;
          pointer-events: none;
        }
        .rich-editor-area h2 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-top: 20px;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        .rich-editor-area h3 {
          font-size: 1.15rem;
          font-weight: 700;
          margin-top: 15px;
          margin-bottom: 8px;
          color: var(--text-dark);
        }
        .rich-editor-area p {
          margin-bottom: 10px;
        }
        .rich-editor-area ul, .rich-editor-area ol {
          padding-left: 20px;
          margin-bottom: 10px;
        }
        .rich-editor-area a {
          color: var(--primary);
          text-decoration: underline;
        }
        .rich-editor-area img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin-top: 12px;
          margin-bottom: 12px;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-light);
        }
      `}</style>
    </div>
  );
};

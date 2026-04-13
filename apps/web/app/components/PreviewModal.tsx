'use client';
import { Download, FileText, X } from 'lucide-react';

interface PreviewModalProps {
  previewDoc: { id: string; nomeFile: string } | null;
  setPreviewDoc: (doc: { id: string; nomeFile: string } | null) => void;
  baseUrl: string;
}

export function PreviewModal({ previewDoc, setPreviewDoc, baseUrl }: PreviewModalProps) {
  if (!previewDoc) return null;

  const ext = previewDoc.nomeFile.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
  const isPdf = ext === 'pdf';
  const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(ext);
  const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
  const isText = ['txt', 'csv', 'json', 'xml', 'html', 'md', 'log'].includes(ext);
  const isOfficePreviewable = ['doc', 'docx', 'xls', 'xlsx'].includes(ext);
  const isOfficeFallback = ['ppt', 'pptx'].includes(ext);
  const previewUrl = `${baseUrl}/api/documenti/${previewDoc.id}/download`;
  const officePreviewUrl = `${baseUrl}/api/documenti/${previewDoc.id}/preview`;

  const extColor: Record<string, string> = {
    pdf: 'text-red-400', doc: 'text-blue-400', docx: 'text-blue-400',
    xls: 'text-emerald-400', xlsx: 'text-emerald-400', dwg: 'text-amber-400',
    zip: 'text-purple-400',
  };
  const iconColor = extColor[ext] ?? 'text-white/60';

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Barra superiore */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#003A7D] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <FileText size={16} className={`${iconColor} shrink-0`} />
          <span className="text-sm font-bold text-white truncate">{previewDoc.nomeFile}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-white/10 px-2 py-0.5 rounded-full shrink-0">.{ext}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={previewUrl}
            download={previewDoc.nomeFile}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Download size={12} /> Scarica
          </a>
          <button
            onClick={() => setPreviewDoc(null)}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Contenuto preview */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        {isPdf && (
          <iframe src={previewUrl} className="w-full h-full rounded-xl bg-white" title={previewDoc.nomeFile} />
        )}
        {isImage && (
          <img
            src={previewUrl}
            alt={previewDoc.nomeFile}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {isVideo && (
          <video src={previewUrl} controls className="max-w-full max-h-full rounded-xl shadow-2xl" />
        )}
        {isAudio && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText size={40} className="text-white/60" />
            </div>
            <audio src={previewUrl} controls className="rounded-lg" />
          </div>
        )}
        {isText && (
          <iframe src={previewUrl} className="w-full h-full rounded-xl bg-white" title={previewDoc.nomeFile} />
        )}
        {isOfficePreviewable && (
          <iframe src={officePreviewUrl} className="w-full h-full rounded-xl bg-white" title={previewDoc.nomeFile} />
        )}
        {isOfficeFallback && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText size={30} className={iconColor} />
            </div>
            <p className="text-white/70 text-sm">
              I file <span className="font-black text-white uppercase">.{ext}</span> non sono supportati per l&apos;anteprima.
            </p>
            <a href={previewUrl} download={previewDoc.nomeFile} className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#003A7D] rounded-xl text-sm font-black uppercase tracking-widest hover:bg-stone-100 transition-colors shadow-lg">
              <Download size={15} /> Scarica e apri
            </a>
          </div>
        )}
        {!isPdf && !isImage && !isVideo && !isAudio && !isText && !isOfficePreviewable && !isOfficeFallback && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
              <FileText size={30} className={iconColor} />
            </div>
            <p className="text-white/70 text-sm">
              Anteprima non disponibile per i file <span className="font-black text-white uppercase">.{ext}</span>
            </p>
            <a
              href={previewUrl}
              download={previewDoc.nomeFile}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#003A7D] rounded-xl text-sm font-black uppercase tracking-widest hover:bg-stone-100 transition-colors shadow-lg"
            >
              <Download size={15} /> Scarica il file
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

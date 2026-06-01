'use client';
import { Download, FileText, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetchBlob, apiFetchText } from '../hooks/apiFetch';

interface PreviewModalProps {
  previewDoc: { id: string; nomeFile: string } | null;
  setPreviewDoc: (doc: { id: string; nomeFile: string } | null) => void;
  baseUrl: string;
}

function triggerBlobDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export function PreviewModal({ previewDoc, setPreviewDoc, baseUrl }: Readonly<PreviewModalProps>) {
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [officeHtml, setOfficeHtml] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const ext = previewDoc?.nomeFile.split('.').pop()?.toLowerCase() ?? '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
  const isPdf = ext === 'pdf';
  const isVideo = ['mp4', 'webm', 'mov', 'avi'].includes(ext);
  const isAudio = ['mp3', 'wav', 'ogg', 'm4a'].includes(ext);
  const isText = ['txt', 'csv', 'json', 'xml', 'html', 'md', 'log'].includes(ext);
  const isOfficePreviewable = ['doc', 'docx', 'xls', 'xlsx'].includes(ext);
  const isOfficeFallback = ['ppt', 'pptx'].includes(ext);

  const extColor: Record<string, string> = {
    pdf: 'text-red-400', doc: 'text-blue-400', docx: 'text-blue-400',
    xls: 'text-emerald-400', xlsx: 'text-emerald-400', dwg: 'text-[#898989]',
    zip: 'text-purple-400',
  };
  const iconColor = extColor[ext] ?? 'text-white/60';

  useEffect(() => {
    let disposed = false;
    let currentObjectUrl: string | null = null;

    setPreviewObjectUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setOfficeHtml('');
    setPreviewError(null);

    if (!previewDoc) {
      setIsLoadingPreview(false);
      return () => undefined;
    }

    const shouldLoadBinaryPreview = isPdf || isImage || isVideo || isAudio || isText;
    const shouldLoadOfficePreview = isOfficePreviewable;

    if (!shouldLoadBinaryPreview && !shouldLoadOfficePreview) {
      setIsLoadingPreview(false);
      return () => undefined;
    }

    setIsLoadingPreview(true);

    const loadPreview = async () => {
      try {
        if (shouldLoadOfficePreview) {
          const html = await apiFetchText(`${baseUrl}/api/documenti/${previewDoc.id}/preview`);
          if (disposed) return;
          setOfficeHtml(html);
          setIsLoadingPreview(false);
          return;
        }

        const blob = await apiFetchBlob(`${baseUrl}/api/documenti/${previewDoc.id}/download`);
        if (disposed) return;

        currentObjectUrl = URL.createObjectURL(blob);
        setPreviewObjectUrl(currentObjectUrl);
        setIsLoadingPreview(false);
      } catch (err: unknown) {
        if (disposed) return;
        setPreviewError(err instanceof Error ? err.message : 'Errore durante il caricamento del documento');
        setIsLoadingPreview(false);
      }
    };

    void loadPreview();

    return () => {
      disposed = true;
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
      }
    };
  }, [baseUrl, previewDoc?.id, isAudio, isImage, isOfficePreviewable, isPdf, isText, isVideo]);

  const handleDownload = async () => {
    if (!previewDoc) return;

    setIsDownloading(true);
    setPreviewError(null);
    try {
      const blob = await apiFetchBlob(`${baseUrl}/api/documenti/${previewDoc.id}/download`);
      triggerBlobDownload(blob, previewDoc.nomeFile);
    } catch (err: unknown) {
      setPreviewError(err instanceof Error ? err.message : 'Errore durante il download del documento');
    } finally {
      setIsDownloading(false);
    }
  };

  if (!previewDoc) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Barra superiore */}
      <div className="flex items-center justify-between px-6 py-3 bg-[#4B6E48] shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <FileText size={16} className={`${iconColor} shrink-0`} />
          <span className="text-sm font-bold text-white truncate">{previewDoc.nomeFile}</span>
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40 bg-gray-100/10 px-2 py-0.5 rounded-full shrink-0">.{ext}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { void handleDownload(); }}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100/10 hover:bg-gray-100/20 rounded-lg text-white text-[10px] font-black uppercase tracking-widest transition-colors"
          >
            <Download size={12} /> {isDownloading ? 'Scarico...' : 'Scarica'}
          </button>
          <button
            onClick={() => setPreviewDoc(null)}
            className="w-8 h-8 rounded-lg bg-gray-100/10 hover:bg-gray-100/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Contenuto preview */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        {isLoadingPreview && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 bg-gray-100/10 rounded-2xl flex items-center justify-center animate-pulse">
              <FileText size={30} className="text-white/60" />
            </div>
            <p className="text-white/80 text-sm">Caricamento anteprima in corso...</p>
          </div>
        )}

        {!isLoadingPreview && previewError && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-gray-100/10 rounded-2xl flex items-center justify-center">
              <FileText size={30} className={iconColor} />
            </div>
            <p className="text-white/70 text-sm">{previewError}</p>
            <button
              type="button"
              onClick={() => { void handleDownload(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#4B6E48] rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-600/50 transition-colors shadow-lg"
            >
              <Download size={15} /> Scarica documento
            </button>
          </div>
        )}

        {!isLoadingPreview && !previewError && isPdf && previewObjectUrl && (
          <iframe src={previewObjectUrl} className="w-full h-full rounded-xl bg-gray-100" title={previewDoc.nomeFile} />
        )}
        {!isLoadingPreview && !previewError && isImage && previewObjectUrl && (
          <img
            src={previewObjectUrl}
            alt={previewDoc.nomeFile}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {!isLoadingPreview && !previewError && isVideo && previewObjectUrl && (
          <video src={previewObjectUrl} controls className="max-w-full max-h-full rounded-xl shadow-2xl">
            <track kind="captions" label="Italiano" />
          </video>
        )}
        {!isLoadingPreview && !previewError && isAudio && previewObjectUrl && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-24 h-24 bg-gray-100/10 rounded-2xl flex items-center justify-center">
              <FileText size={40} className="text-white/60" />
            </div>
            <audio src={previewObjectUrl} controls className="rounded-lg">
              <track kind="captions" label="Italiano" />
            </audio>
          </div>
        )}
        {!isLoadingPreview && !previewError && isText && previewObjectUrl && (
          <iframe src={previewObjectUrl} className="w-full h-full rounded-xl bg-gray-100" title={previewDoc.nomeFile} />
        )}
        {!isLoadingPreview && !previewError && isOfficePreviewable && officeHtml && (
          <iframe srcDoc={officeHtml} className="w-full h-full rounded-xl bg-gray-100" title={previewDoc.nomeFile} />
        )}

        {!isLoadingPreview && !previewError && isOfficeFallback && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-gray-100/10 rounded-2xl flex items-center justify-center">
              <FileText size={30} className={iconColor} />
            </div>
            <p className="text-white/70 text-sm">
              I file <span className="font-black text-white uppercase">.{ext}</span> non sono supportati per l&apos;anteprima.
            </p>
            <button
              type="button"
              onClick={() => { void handleDownload(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#4B6E48] rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-600/50 transition-colors shadow-lg"
            >
              <Download size={15} /> Scarica e apri
            </button>
          </div>
        )}

        {!isLoadingPreview && !previewError && !isPdf && !isImage && !isVideo && !isAudio && !isText && !isOfficePreviewable && !isOfficeFallback && (
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 bg-gray-100/10 rounded-2xl flex items-center justify-center">
              <FileText size={30} className={iconColor} />
            </div>
            <p className="text-white/70 text-sm">
              Anteprima non disponibile per i file <span className="font-black text-white uppercase">.{ext}</span>
            </p>
            <button
              type="button"
              onClick={() => { void handleDownload(); }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#4B6E48] rounded-xl text-sm font-black uppercase tracking-widest hover:bg-slate-600/50 transition-colors shadow-lg"
            >
              <Download size={15} /> Scarica il file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

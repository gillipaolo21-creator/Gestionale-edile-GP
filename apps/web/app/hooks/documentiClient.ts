import { apiFetchBlob } from './apiFetch';

function triggerBrowserDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadDocumentoAutenticato(
  baseUrl: string,
  documentoId: string,
  nomeFile: string,
): Promise<void> {
  const blob = await apiFetchBlob(`${baseUrl}/api/documenti/${documentoId}/download`);
  triggerBrowserDownload(blob, nomeFile);
}

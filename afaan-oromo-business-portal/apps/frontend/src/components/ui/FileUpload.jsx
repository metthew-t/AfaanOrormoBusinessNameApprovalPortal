import { useRef, useState } from 'react';
import { formatFileSize } from '@/utils/formatters';
import styles from './FileUpload.module.css';

/**
 * File upload dropzone.
 *
 * Props:
 *   onFileSelect   : (file: File) => void
 *   accept         : string  (e.g. ".pdf,.jpg,.png")
 *   maxSize        : number  (bytes, default 10MB)
 *   label          : string
 *   error          : string | null
 *   currentFile    : { name, size } | File | null
 *   onRemove       : () => void
 *   uploadProgress : 0–100 | null
 */
export default function FileUpload({
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 10 * 1024 * 1024,
  label = 'Upload Document',
  error,
  currentFile,
  onRemove,
  uploadProgress = null,
}) {
  const inputRef    = useRef(null);
  const [drag, setDrag] = useState(false);
  const [localError, setLocalError] = useState(null);

  const displayError = error ?? localError;

  const validate = (file) => {
    if (file.size > maxSize) {
      return `File size must not exceed ${formatFileSize(maxSize)}.`;
    }
    return null;
  };

  const handleFile = (file) => {
    const err = validate(file);
    if (err) { setLocalError(err); return; }
    setLocalError(null);
    onFileSelect?.(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className={styles.wrapper}>
      {label && <p className={styles.label}>{label}</p>}

      {/* Existing file */}
      {currentFile ? (
        <div className={styles.filePreview}>
          <span className={styles.fileIcon}>📄</span>
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{currentFile.name}</span>
            <span className={styles.fileSize}>{formatFileSize(currentFile.size)}</span>
          </div>
          {uploadProgress !== null && uploadProgress < 100 && (
            <div className={styles.progressWrap}>
              <div
                className={styles.progressBar}
                style={{ width: `${uploadProgress}%` }}
                role="progressbar"
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              <span className={styles.progressText}>{uploadProgress}%</span>
            </div>
          )}
          {(uploadProgress === null || uploadProgress === 100) && (
            <button
              type="button"
              className={styles.removeBtn}
              onClick={onRemove}
              aria-label="Remove file"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${drag ? styles.dragging : ''} ${displayError ? styles.hasError : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          aria-label="Click or drag a file to upload"
        >
          <span className={styles.uploadIcon}>📁</span>
          <p className={styles.dropText}>
            <strong>Click to upload</strong> or drag & drop
          </p>
          <p className={styles.fileTypes}>
            {accept.replace(/\./g, '').toUpperCase().split(',').join(', ')} — Max {formatFileSize(maxSize)}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            className={styles.hiddenInput}
            aria-hidden="true"
          />
        </div>
      )}

      {displayError && (
        <p className={styles.error} role="alert">⚠ {displayError}</p>
      )}
    </div>
  );
}

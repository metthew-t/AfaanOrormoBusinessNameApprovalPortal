import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useSettings } from '@/context/SettingsContext';
import api from '@/services/api';
import {
  createApplication,
  updateApplication,
  submitApplication,
  uploadPermissionDocument,
  deletePermissionDocument,
  getApplicationById,
  validateBusinessName,
} from '@/services/applicationService';
import { useAsync } from '@/hooks/useAsync';
import { extractErrorMessage, extractData } from '@/utils/apiHelpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import FileUpload from '@/components/ui/FileUpload';
import Alert from '@/components/ui/Alert';
import styles from './NewApplicationPage.module.css';

const STEPS = [
  { id: 1, label: 'Odeeffannoo Daldala' },
  { id: 2, label: 'Hayyama Daldala' },
  { id: 3, label: 'Gamaaggamuu & Dhiyeessuu' },
];

// Fetch categories from public endpoint
const fetchCategories = async () => {
  const response = await api.get('/public/categories');
  return response;
};

export default function NewApplicationPage() {
  const navigate = useNavigate();
  const toast    = useToast();
  const { getSetting } = useSettings();
  const [step,    setStep]    = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [draft,   setDraft]   = useState(null); // saved application id

  // Step 1
  const [info, setInfo] = useState({
    businessName: '', categoryId: '', description: '', address: '',
  });
  const [infoErrors, setInfoErrors] = useState({});

  // Step 2
  const [permFiles,    setPermFiles]    = useState([]); // Array of uploaded document objects { id, originalFilename, fileSize }
  const [permError,    setPermError]    = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null); // File object currently uploading

  const { data: categoriesData } = useAsync(() => fetchCategories(), []);
  const rawCategories = categoriesData?.data || (Array.isArray(categoriesData) ? categoriesData : []);
  const categories = rawCategories
    .filter((c) => c.isActive !== false)
    .map((c) => ({ value: c.id, label: c.name }));
  
  // Add "Other" option at the end
  categories.push({ value: 'OTHER', label: 'Biroo (Other)' });

  // ── Step 1: Validate & save draft ─────────────────────────────
  const validateStep1 = () => {
    const errs = {};
    if (!info.businessName.trim()) errs.businessName = 'Maqaan daldala barbaachisaadha.';
    if (!info.categoryId)          errs.categoryId   = 'Gosa filuun dirqama.';
    if (!info.description.trim())  errs.description  = 'Ibsi barbaachisaadha.';
    if (!info.address.trim())      errs.address      = 'Teessoo barbaachisaadha.';
    setInfoErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Next = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setError(null);
    try {
      // Map frontend field names to backend-expected names
      const payload = {
        proposedBusinessName: info.businessName,
        businessCategoryId: info.categoryId === 'OTHER' ? null : parseInt(info.categoryId, 10),
        businessDescription: info.description,
        businessAddress: info.address,
      };
      let res;
      let targetDraftId = draft;
      if (draft) {
        res = await updateApplication(draft, payload);
      } else {
        res = await createApplication(payload);
        const d = extractData(res);
        targetDraftId = d?.id;
        setDraft(targetDraftId);
      }
      
      // Load current uploaded files if they exist
      const appDetailRes = await getApplicationById(targetDraftId);
      const appDetail = extractData(appDetailRes);
      setPermFiles(appDetail?.documents || []);
      
      setStep(2);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Upload permission document ────────────────────────
  const handleFileSelect = async (file) => {
    if (!draft) {
      setError('Iyyanni hin qusatamne. Gara sadarkaa 1tti deebi\'ii.');
      return;
    }
    setUploadingFile(file);
    setPermError(null);
    setUploadProgress(0);
    try {
      const res = await uploadPermissionDocument(draft, file, setUploadProgress);
      const doc = extractData(res);
      setPermFiles((prev) => [...prev, doc]);
      toast.success('Galmeen milkaahinaan fe\'ameera.');
    } catch (err) {
      setPermError(extractErrorMessage(err));
    } finally {
      setUploadingFile(null);
      setUploadProgress(null);
    }
  };

  const handleFileRemove = async (docId) => {
    if (!draft) return;
    setPermError(null);
    try {
      await deletePermissionDocument(draft, docId);
      setPermFiles((prev) => prev.filter((d) => d.id !== docId));
      toast.success('Galmeen haqameera.');
    } catch (err) {
      setPermError(extractErrorMessage(err));
    }
  };

  const handleStep2Next = async () => {
    if (permFiles.length === 0) { 
      setPermError('Galmee hayyamaa daldala yoo xiqqaate tokko erguu qaba.'); 
      return; 
    }
    setStep(3); // Go directly to review step
  };

  // ── Step 3: Submit ────────────────────────────────────────────
  const handleSaveDraft = async () => {
    toast.success('Iyyanni akka qabiyyeetti qusatame.');
    navigate('/owner/applications');
  };

  const handleSubmit = async () => {
    if (!draft) return;
    setLoading(true);
    setError(null);
    try {
      await submitApplication(draft);
      toast.success('Iyyanni milkaahinaan dhiyaate!');
      navigate('/owner/applications');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const categoryName = categories.find((c) => String(c.value) === String(info.categoryId))?.label ?? '—';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>{getSetting('owner_new_app_title', 'Iyyata Daldala Haaraa')}</h1>
        <p>{getSetting('owner_new_app_message', 'Maqaa daldala keessanii eeyyamamuuf tarkaanfiiwwan hunda xumuraa.')}</p>
      </div>

      {/* Stepper */}
      <div className={styles.stepper}>
        {STEPS.map((s) => (
          <div
            key={s.id}
            className={`${styles.stepItem} ${step === s.id ? styles.stepActive : ''} ${step > s.id ? styles.stepDone : ''}`}
          >
            <div className={styles.stepCircle}>
              {step > s.id ? '✓' : s.id}
            </div>
            <span className={styles.stepLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} style={{ marginBottom: 16 }}>
          {error}
        </Alert>
      )}

      <div className="card">
        <div className="card-body">
          {/* ── Step 1 ─────────────────────────────────────────── */}
          {step === 1 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Sadarkaa 1 — Odeeffannoo Daldala</h2>
              <div className={styles.formGrid}>
                <Input
                  label="Maqaa Daldala Barbaadame"
                  placeholder="fkn. Baqqalaa Nagaa Daldala PLC"
                  value={info.businessName}
                  onChange={(e) => setInfo({ ...info, businessName: e.target.value })}
                  error={infoErrors.businessName}
                  required
                  hint="Maqaa kana Afaan Oromoon ragaa irratti mul'atu galchaa."
                />
                <Select
                  label="Gosa Daldala"
                  options={categories}
                  value={info.categoryId}
                  onChange={(e) => setInfo({ ...info, categoryId: e.target.value })}
                  error={infoErrors.categoryId}
                  required
                  placeholder="Gosa filadhu…"
                />
              </div>
              <Textarea
                label="Ibsa Daldala"
                placeholder="Uumama fi sochii daldala kanaa ibsaa…"
                value={info.description}
                onChange={(e) => setInfo({ ...info, description: e.target.value })}
                error={infoErrors.description}
                required
                rows={3}
              />
              <Input
                label="Teessoo Daldala"
                placeholder="fkn. Finfinnee, Oromiyaa, Booraa 03"
                value={info.address}
                onChange={(e) => setInfo({ ...info, address: e.target.value })}
                error={infoErrors.address}
                required
              />
              <div className={styles.stepFooter}>
                <Button variant="secondary" onClick={() => navigate('/owner/applications')}>
                  Haqii
                </Button>
                <Button onClick={handleStep1Next} loading={loading}>
                  Itti Fufi →
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 2 ─────────────────────────────────────────── */}
          {step === 2 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Sadarkaa 2 — Galmee Hayyamaa Daldala</h2>
              <p className={styles.stepDesc}>
                Galmee hayyamaa daldala sirrii isin kennameef ergaa. Bifa fudhatamuu: PDF, JPG, PNG. Guddina galmee olaanaa: 10 MB. Gara tokkoo ol erguu ni dandeessu.
              </p>

              {/* Uploaded files list */}
              {permFiles.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Galmeewwan Fe'aman:</p>
                  {permFiles.map((doc) => (
                    <div 
                      key={doc.id} 
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'var(--color-bg-light, #f8f9fa)',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: '1px solid var(--color-border, #e9ecef)'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', color: 'var(--color-text)' }}>📄 {doc.originalFilename || doc.name}</span>
                      <button 
                        type="button" 
                        onClick={() => handleFileRemove(doc.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-danger, #dc3545)',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '1rem'
                        }}
                        aria-label="Remove document"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <FileUpload
                label="Galmee Hayyamaa Daldala Dabali"
                accept=".pdf,.jpg,.jpeg,.png"
                onFileSelect={handleFileSelect}
                currentFile={uploadingFile}
                onRemove={() => {}}
                error={permError}
                uploadProgress={uploadProgress}
              />
              <div className={styles.stepFooter}>
                <Button variant="secondary" onClick={() => setStep(1)}>← Deebi'ii</Button>
                <Button onClick={handleStep2Next} loading={loading}>Itti Fufi →</Button>
              </div>
            </div>
          )}

          {/* ── Step 3 ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className={styles.stepContent}>
              <h2 className={styles.stepTitle}>Sadarkaa 3 — Gamaaggamuu & Dhiyeessuu</h2>
              <p className={styles.stepDesc}>
                Iyyata keessan osoo hin dhiyeessin dura gamaaggamaa. Erga dhiyaatee booda sadarkaa gamaaggamaa ni seena.
              </p>

              <div className={styles.reviewGrid}>
                <ReviewField label="Maqaa Daldala"    value={info.businessName} />
                <ReviewField label="Gosa"         value={categoryName} />
                <ReviewField label="Teessoo"          value={info.address} />
                <ReviewField label="Galmeewwan Hayyamaa"   value={permFiles.map(d => d.originalFilename || d.name).join(', ') || '—'} />
                <ReviewField label="Ibsa"      value={info.description} span />
              </div>

              <div className={styles.stepFooter}>
                <Button variant="secondary" onClick={() => setStep(2)}>← Deebi'ii</Button>
                <Button variant="secondary" onClick={handleSaveDraft}>Akka Qabiyyeetti Qusadhu</Button>
                <Button onClick={handleSubmit} loading={loading}>
                  Iyyata Dhiyeessi
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function ReviewField({ label, value, span }) {
  return (
    <div className={styles.reviewField} style={{ gridColumn: span ? '1 / -1' : 'auto' }}>
      <p className={styles.reviewLabel}>{label}</p>
      <p className={styles.reviewValue}>{value}</p>
    </div>
  );
}

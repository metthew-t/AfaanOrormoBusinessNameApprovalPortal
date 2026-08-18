// Fully implemented in Stage 8
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/useToast';
import { useSettings } from '@/context/SettingsContext';
import {
  getCategories,
} from '@/services/adminService';
import {
  createApplication,
  updateApplication,
  submitApplication,
  uploadPermissionDocument,
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
  const [permFile,     setPermFile]     = useState(null);
  const [permError,    setPermError]    = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  const { data: categoriesData } = useAsync(() => getCategories(), []);
  const categories = (categoriesData ?? [])
    .filter((c) => c.status === 'ACTIVE')
    .map((c) => ({ value: c.id, label: c.name }));

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
      let res;
      if (draft) {
        res = await updateApplication(draft, info);
      } else {
        res = await createApplication(info);
        const d = extractData(res);
        setDraft(d?.id);
      }
      setStep(2);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Upload permission document ────────────────────────
  const handleStep2Next = async () => {
    if (!permFile) { setPermError('Galmee hayyamaa daldala erguu qaba.'); return; }
    if (!draft)    { setError('Iyyanni hin qusatamne. Gara sadarkaa 1tti deebi\'ii.'); return; }
    setLoading(true);
    setPermError(null);
    try {
      await uploadPermissionDocument(draft, permFile, setUploadProgress);
      setStep(3); // Go directly to review step
    } catch (err) {
      setPermError(extractErrorMessage(err));
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
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

  const categoryName = categories.find((c) => c.value === info.categoryId)?.label ?? '—';

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
                Galmee hayyamaa daldala sirrii isin kennameef ergaa. Bifa fudhatamuu: PDF, JPG, PNG. Guddina galmee olaanaa: 10 MB.
              </p>
              <FileUpload
                label="Galmee Hayyamaa Daldala"
                accept=".pdf,.jpg,.jpeg,.png"
                onFileSelect={(f) => { setPermFile(f); setPermError(null); }}
                currentFile={permFile}
                onRemove={() => setPermFile(null)}
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
                <ReviewField label="Galmee Hayyamaa"   value={permFile?.name ?? '—'} />
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

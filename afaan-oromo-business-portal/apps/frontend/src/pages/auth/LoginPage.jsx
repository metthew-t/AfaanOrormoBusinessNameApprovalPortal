import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { validateEmail } from '@/validators/authValidators';
import { extractErrorMessage } from '@/utils/apiHelpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const { login, homePath } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname ?? null;

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [apiError, setApiError] = useState(null);
  const [loading, setLoading]   = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((ev) => ({ ...ev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    const emailErr = validateEmail(form.email);
    if (emailErr) errs.email = emailErr;
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      const user = await login({ email: form.email.trim(), password: form.password });
      // Redirect: if user was trying to access a specific page, go there; else go to role home
      const roleHome = {
        BUSINESS_OWNER:    '/owner/dashboard',
        FINANCIAL_OFFICER: '/financial/dashboard',
        LANGUAGE_OFFICER:  '/language/dashboard',
        SENIOR_OFFICER:    '/senior/dashboard',
        ADMIN:             '/admin/dashboard',
      }[user?.role] ?? '/';

      navigate(from ?? roleHome, { replace: true });
    } catch (err) {
      setApiError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brandBox}>
          <div className={styles.brandIcon}>🌿</div>
          <h1 className={styles.brandName}>AOBNAP</h1>
          <p className={styles.brandFull}>Afaan Oromo Business Name Approval Portal</p>
          <p className={styles.brandSub}>Government of Oromia — Trade Bureau</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureCheckmark}>✓</span>
              <span>Secure business name registration</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureCheckmark}>✓</span>
              <span>Streamlined approval workflow</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureCheckmark}>✓</span>
              <span>Real-time notifications</span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureCheckmark}>✓</span>
              <span>Official digital certificates</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome Back</h2>
            <p className={styles.formSub}>Sign in to access your dashboard and manage applications.</p>
          </div>

          {apiError && (
            <Alert variant="danger" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <Input
              label="Email Address"
              type="email"
              placeholder="your.email@example.com"
              value={form.email}
              onChange={set('email')}
              error={errors.email}
              required
              autoComplete="email"
              autoFocus
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              error={errors.password}
              showToggle
              required
              autoComplete="current-password"
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className={styles.divider}>
            <span>New to AOBNAP?</span>
          </div>

          <Link to="/signup" className={styles.signupLink}>
            <span className={styles.signupIcon}>✨</span>
            Create a Business Owner account
          </Link>

          {/* Quick Access Demo */}
          <div className={styles.demoBox}>
            <p className={styles.demoTitle}>🚀 Quick Access (Demo)</p>
            <p className={styles.demoDescription}>For testing purposes, use these demo accounts:</p>
            <div className={styles.demoGrid}>
              <div className={styles.demoItem}>
                <span className={styles.demoRole}>Business Owner</span>
                <span className={styles.demoEmail}>owner@aobnap.gov.et</span>
                <span className={styles.demoPass}>Password: Owner@1234</span>
              </div>
              <div className={styles.demoItem}>
                <span className={styles.demoRole}>Communication Biro</span>
                <span className={styles.demoEmail}>financial@aobnap.gov.et</span>
                <span className={styles.demoPass}>Password: Financial@1234</span>
              </div>
              <div className={styles.demoItem}>
                <span className={styles.demoRole}>Commercial Office</span>
                <span className={styles.demoEmail}>commercial@aobnap.gov.et</span>
                <span className={styles.demoPass}>Password: Commercial@1234</span>
              </div>
              <div className={styles.demoItem}>
                <span className={styles.demoRole}>Addaf Turizm Biro</span>
                <span className={styles.demoEmail}>turizm@aobnap.gov.et</span>
                <span className={styles.demoPass}>Password: Turizm@1234</span>
              </div>
              <div className={styles.demoItem}>
                <span className={styles.demoRole}>Admin (IT Biro)</span>
                <span className={styles.demoEmail}>admin@aobnap.gov.et</span>
                <span className={styles.demoPass}>Password: Admin@1234</span>
              </div>
            </div>
            <p className={styles.demoPassword}>
              <span className={styles.demoPasswordLabel}>💡 Tip:</span>
              <span className={styles.demoPasswordExample}>Click on any account above to see its password</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

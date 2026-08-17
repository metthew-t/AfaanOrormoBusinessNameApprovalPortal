import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '@/services/authService';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFullName,
  validatePhone,
  validateNationalId,
} from '@/validators/authValidators';
import { extractErrorMessage } from '@/utils/apiHelpers';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Alert from '@/components/ui/Alert';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName:       '',
    email:          '',
    phone:          '',
    nationalIdRef:  '',
    password:       '',
    confirmPassword:'',
  });
  const [errors,   setErrors]   = useState({});
  const [apiError, setApiError] = useState(null);
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors((ev) => ({ ...ev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    const checks = {
      fullName:        validateFullName(form.fullName),
      email:           validateEmail(form.email),
      phone:           validatePhone(form.phone),
      nationalIdRef:   validateNationalId(form.nationalIdRef),
      password:        validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    Object.entries(checks).forEach(([k, v]) => { if (v) errs[k] = v; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      await signup({
        fullName:      form.fullName.trim(),
        email:         form.email.trim(),
        phone:         form.phone.trim(),
        nationalIdRef: form.nationalIdRef.trim(),
        password:      form.password,
      });
      setSuccess(true);
    } catch (err) {
      setApiError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.page} style={{ justifyContent: 'center' }}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h2>Account Created Successfully</h2>
          <p>Your Business Owner account has been created. You can now sign in.</p>
          <Button onClick={() => navigate('/login')} size="lg">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.brandBox}>
          <div className={styles.brandIcon}>🌿</div>
          <h1 className={styles.brandName}>AOBNAP</h1>
          <p className={styles.brandFull}>Afaan Oromo Business Name Approval Portal</p>
          <p className={styles.brandSub}>Government of Oromia — Trade Bureau</p>
          <div className={styles.featureList}>
            <div className={styles.featureItem}>✓ Free online registration</div>
            <div className={styles.featureItem}>✓ Track your application status</div>
            <div className={styles.featureItem}>✓ Download official certificates</div>
            <div className={styles.featureItem}>✓ Receive real-time notifications</div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Create an Account</h2>
            <p className={styles.formSub}>Register as a Business Owner to submit applications.</p>
          </div>

          {apiError && (
            <Alert variant="danger" onClose={() => setApiError(null)}>
              {apiError}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formRow}>
              <Input
                label="Full Name"
                placeholder="e.g. Alamuu Baqqalaa"
                value={form.fullName}
                onChange={set('fullName')}
                error={errors.fullName}
                required
                autoFocus
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                error={errors.email}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.formRow}>
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+251912345678"
                value={form.phone}
                onChange={set('phone')}
                error={errors.phone}
                required
                hint="Ethiopian format: +251XXXXXXXXX or 09XXXXXXXX"
              />
              <Input
                label="National ID Reference"
                placeholder="e.g. ETH-ID-123456"
                value={form.nationalIdRef}
                onChange={set('nationalIdRef')}
                error={errors.nationalIdRef}
                required
              />
            </div>

            <div className={styles.formRow}>
              <Input
                label="Password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                showToggle
                required
                hint="Min 8 chars, include uppercase, lowercase, and number."
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={set('confirmPassword')}
                error={errors.confirmPassword}
                showToggle
                required
              />
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg">
              Create Account
            </Button>
          </form>

          <div className={styles.divider}>
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className={styles.signupLink}>
            Sign in to your account
          </Link>
        </div>
      </div>
    </div>
  );
}

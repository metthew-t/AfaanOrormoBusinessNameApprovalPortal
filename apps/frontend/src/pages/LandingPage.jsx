import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles.landing}>
      {/* Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <div className={styles.navBrand}>
            <span className={styles.navIcon}>🌿</span>
            <span className={styles.navTitle}>AOBNAP</span>
          </div>
          <div className={styles.navLinks}>
            <Link to="/login" className={styles.navLink}>Sign In</Link>
            <Link to="/signup">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeIcon}>🏛️</span>
            Government of Oromia — Trade Bureau
          </div>
          <h1 className={styles.heroTitle}>
            Afaan Oromo Business Name
            <span className={styles.heroTitleHighlight}> Approval Portal</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The official platform for registering and approving business names in Afaan Oromo.
            Streamline your business registration process with our secure, multi-stage approval workflow.
          </p>
          <div className={styles.heroButtons}>
            <Link to="/signup">
              <Button variant="primary" size="lg">Register Your Business</Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">Sign In to Portal</Button>
            </Link>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>1,247+</div>
              <div className={styles.statLabel}>Approved Businesses</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>98%</div>
              <div className={styles.statLabel}>Satisfaction Rate</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>3-5 Days</div>
              <div className={styles.statLabel}>Average Approval Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How AOBNAP Works</h2>
            <p className={styles.sectionSubtitle}>
              Our streamlined workflow ensures your business name is validated, reviewed, and approved efficiently.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📝</div>
              <h3 className={styles.featureTitle}>Submit Application</h3>
              <p className={styles.featureDescription}>
                Business owners submit their proposed business name along with required documentation through our secure portal.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔄</div>
              <h3 className={styles.featureTitle}>Waajira Kominikeeshinii Review</h3>
              <p className={styles.featureDescription}>
                Applications are received and routed to specialized departments for comprehensive evaluation.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏢</div>
              <h3 className={styles.featureTitle}>Waajira Daldaala Review</h3>
              <p className={styles.featureDescription}>
                Business permits and commercial documentation are carefully reviewed for compliance.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3 className={styles.featureTitle}>Waajira Aadaaf Turizimii Review</h3>
              <p className={styles.featureDescription}>
                Business descriptions are evaluated for Afaan Oromo language compliance and cultural appropriateness.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✅</div>
              <h3 className={styles.featureTitle}>Approval & Certificate</h3>
              <p className={styles.featureDescription}>
                Once approved by all departments, receive your official business name certificate instantly.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔔</div>
              <h3 className={styles.featureTitle}>Real-time Notifications</h3>
              <p className={styles.featureDescription}>
                Stay updated with instant notifications at every stage of your application review process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className={styles.roles}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Portal Access by Role</h2>
            <p className={styles.sectionSubtitle}>
              Different user types have specialized dashboards and workflows tailored to their responsibilities.
            </p>
          </div>

          <div className={styles.rolesGrid}>
            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>👤</div>
                <h3 className={styles.roleTitle}>Business Owner</h3>
              </div>
              <ul className={styles.roleFeatures}>
                <li>Submit business name applications</li>
                <li>Track application status</li>
                <li>Receive approval messages</li>
                <li>Download certificates</li>
              </ul>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>📡</div>
                <h3 className={styles.roleTitle}>Waajira Kominikeeshinii</h3>
              </div>
              <ul className={styles.roleFeatures}>
                <li>Receive incoming applications</li>
                <li>Route to specialized departments</li>
                <li>Manage messaging system</li>
                <li>Track application workflow</li>
              </ul>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>🏛️</div>
                <h3 className={styles.roleTitle}>Waajira Daldaala</h3>
              </div>
              <ul className={styles.roleFeatures}>
                <li>Review business permits</li>
                <li>Approve or reject applications</li>
                <li>Provide detailed feedback</li>
                <li>Track review history</li>
              </ul>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>🌍</div>
                <h3 className={styles.roleTitle}>Waajira Aadaaf Turizimii</h3>
              </div>
              <ul className={styles.roleFeatures}>
                <li>Review business descriptions</li>
                <li>Validate language compliance</li>
                <li>Approve or reject with reasons</li>
                <li>Ensure cultural appropriateness</li>
              </ul>
            </div>

            <div className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <div className={styles.roleIcon}>⚙️</div>
                <h3 className={styles.roleTitle}>Admin (IT Office)</h3>
              </div>
              <ul className={styles.roleFeatures}>
                <li>Monitor all system transactions</li>
                <li>Manage user accounts</li>
                <li>View audit logs</li>
                <li>System configuration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefits}>
        <div className={styles.sectionContainer}>
          <div className={styles.benefitsContent}>
            <div className={styles.benefitsText}>
              <h2 className={styles.benefitsTitle}>Why Choose AOBNAP?</h2>
              <div className={styles.benefitsList}>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>✨</div>
                  <div>
                    <h4>Secure & Reliable</h4>
                    <p>Government-backed platform with enterprise-grade security for your sensitive business information.</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>⚡</div>
                  <div>
                    <h4>Fast Processing</h4>
                    <p>Streamlined workflow reduces approval time from weeks to just 3-5 days on average.</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>🔍</div>
                  <div>
                    <h4>Transparent Process</h4>
                    <p>Track your application in real-time with clear status updates and notifications.</p>
                  </div>
                </div>
                <div className={styles.benefitItem}>
                  <div className={styles.benefitIcon}>🌐</div>
                  <div>
                    <h4>Language Compliance</h4>
                    <p>Expert review ensures your business name meets Afaan Oromo language and cultural standards.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.benefitsImage}>
              <div className={styles.benefitsImagePlaceholder}>
                <span className={styles.benefitsImageIcon}>📊</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Register Your Business?</h2>
          <p className={styles.ctaSubtitle}>
            Join hundreds of businesses who have successfully registered their business names through AOBNAP.
          </p>
          <div className={styles.ctaButtons}>
            <Link to="/signup">
              <Button variant="primary" size="lg">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <div className={styles.footerBrand}>
              <span className={styles.footerIcon}>🌿</span>
              <span className={styles.footerTitle}>AOBNAP</span>
            </div>
            <p className={styles.footerDescription}>
              Official platform for Afaan Oromo business name registration and approval.
            </p>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Quick Links</h4>
            <ul className={styles.footerLinks}>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/signup">Register</Link></li>
              <li><Link to="/public/business-names">Search Names</Link></li>
              <li><Link to="/public/verify">Verify Certificate</Link></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Resources</h4>
            <ul className={styles.footerLinks}>
              <li><a href="#help">Help Center</a></li>
              <li><a href="#guidelines">Naming Guidelines</a></li>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4 className={styles.footerHeading}>Contact</h4>
            <ul className={styles.footerLinks}>
              <li>Government of Oromia</li>
              <li>Trade Bureau</li>
              <li>support@aobnap.gov.et</li>
              <li>+251 11 XXX XXXX</li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 AOBNAP. All rights reserved. Government of Oromia — Trade Bureau.</p>
        </div>
      </footer>
    </div>
  );
}

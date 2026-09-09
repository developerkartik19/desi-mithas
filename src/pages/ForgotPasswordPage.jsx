const ForgotPasswordPage = () => (
  <section className="auth-section">
    <div className="auth-card">
      <h2>Forgot password</h2>
      <p>We will send recovery instructions to your email.</p>
      <form className="auth-form">
        <input type="email" placeholder="Email" />
        <button className="login-btn" type="button">Send reset link</button>
      </form>
    </div>
  </section>
);

export default ForgotPasswordPage;

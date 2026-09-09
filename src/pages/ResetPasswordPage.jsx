const ResetPasswordPage = () => (
  <section className="auth-section">
    <div className="auth-card">
      <h2>Reset password</h2>
      <p>Create a new password for your account.</p>
      <form className="auth-form">
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm Password" />
        <button className="login-btn" type="button">Update password</button>
      </form>
    </div>
  </section>
);

export default ResetPasswordPage;

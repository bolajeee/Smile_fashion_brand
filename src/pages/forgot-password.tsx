import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useState } from "react";
import Layout from "../layouts/Main";
import { server } from "../utils/server";
import { postData } from "../utils/services";
import Link from "next/link";


type ForgotMail = {
  email: string;
};


const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotMail>();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ForgotMail) => {
    setError(null);
    setSuccess(false);
    try {
      const res = await postData(`${server}/api/auth/reset-password`, {
        email: data.email,
      });
      if (res && res.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/login?success=Check your email for reset instructions`);
        }, 2000);
      } else {
        setError(res?.message || 'Failed to send reset email.');
      }
    } catch (e) {
      setError('Failed to send reset email.');
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/product">
              <i className="icon-left" />
              Back to shop
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Forgot your password?</h2>
            <p className="form-block__description">
              Enter your email or phone number and recover your account
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="email"
                  type="text"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="message message--error">
                    This field is required
                  </p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="message message--error">
                    Please write a valid email
                  </p>
                )}
              </div>
              {success && (
                <p className="message message--success" style={{ marginBottom: '15px', textAlign: 'center' }}>
                  If your email exists, a reset link has been sent.
                </p>
              )}
              {error && (
                <p className="message message--error" style={{ marginBottom: '15px', textAlign: 'center' }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                disabled={success}
              >
                Reset password
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ForgotPassword;

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Layout from "../layouts/Main";

type LoginMail = {
  email: string;
  password: string;
  keepSigned?: boolean;
};

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginMail>();
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (router.query.success) {
      setSuccessMessage(router.query.success as string);
    }
  }, [router.query]);

  const onSubmit = async (data: LoginMail) => {
    // Clear previous server errors
    setError('root.serverError', {});

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      const errorMessage =
        result.error === 'CredentialsSignin'
          ? 'Invalid email or password. Please try again.'
          : result.error;

      setError("root.serverError", {
        type: "manual",
        message: errorMessage,
      });
    } else {
      const callbackUrl =
        (router.query.callbackUrl as string) || "/account/profile";
      router.push(callbackUrl);
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/products">
              <i className="icon-left" />
              Back to store
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">Log in</h2>
            <p className="form-block__description">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s
            </p>

            {successMessage && (
              <p
                className="message message--success"
                style={{ marginBottom: '15px', textAlign: 'center' }}
              >
                {successMessage}
              </p>
            )}

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              {errors.root?.serverError && (
                <p
                  className="message message--error"
                  style={{ marginBottom: '15px', textAlign: 'center' }}
                >
                  {errors.root.serverError.message}
                </p>
              )}
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

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="message message--error">
                    This field is required
                  </p>
                )}
              </div>

              <div className="form__info">
                <div className="checkbox-wrapper">
                  <label
                    htmlFor="check-signed-in"
                    className="checkbox checkbox--sm"
                  >
                    <input
                      type="checkbox"
                      id="check-signed-in"
                      {...register("keepSigned")}
                    />
                    <span className="checkbox__check" />
                    <p>Keep me signed in</p>
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="form__info__forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="form__btns">
                <button
                  type="button"
                  className="btn-social google-btn width-full"
                  onClick={() => signIn('google')}
                >
                  <img src="/images/icons/gmail.svg" alt="gmail" /> Gmail
                </button>
              </div>

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </button>

              <p className="form__signup-link">
                Not a member yet? <Link href="/register">Sign up</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;

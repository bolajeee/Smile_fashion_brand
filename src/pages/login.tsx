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
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.ok) {
      router.push("/");
    } else {
      setError("password", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <Layout>
      <section className="form-page">
        <div className="container">
          <div className="back-button-section">
            <Link href="/">
              <i className="icon-left" />
              Back to store
            </Link>
          </div>

          <div className="form-container">
            <div className="form-image">
              {/* You can replace this with an <Image> component from Next.js for optimization */}
              <img src="/images/form-image.jpg" alt="Fashion model" />
            </div>
            <div className="form-block">
              <h2 className="form-block__title">Log in to your account</h2>
              <p className="form-block__description">
                Welcome back! Please enter your details.
              </p>

              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__input-row">
                  <input
                    className="form__input"
                    placeholder="Email"
                    type="email"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && <p className="message message--error">{errors.email.message}</p>}
                </div>

                <div className="form__input-row">
                  <input
                    className="form__input"
                    type="password"
                    placeholder="Password"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && <p className="message message--error">{errors.password.message}</p>}
                </div>

                {successMessage && (
                  <p className="message message--success" style={{ marginBottom: '15px', textAlign: 'center' }}>
                    {successMessage}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--rounded btn--yellow btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <p className="form__signup-link">
                  <Link href="/register">
                    Don't have an account? Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
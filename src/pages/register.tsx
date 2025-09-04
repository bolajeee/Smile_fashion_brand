import { hash } from "bcryptjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import type { RegisterData } from "@/types/auth";
import Layout from "../layouts/Main";
import { server } from "../utils/server";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterData>();
  const router = useRouter();

  const onSubmit = async (data: RegisterData) => {
    if (!data.terms) {
      setError("terms", {
        type: "manual",
        message: "You must accept the terms and conditions",
      });
      return;
    }

    try {
      const passwordHash = await hash(data.password, 10);
      const res = await fetch(`${server}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          passwordHash,
          address: '', // Can be updated later in profile
        }),
      });

      const responseData = await res.json().catch(() => null);

      if (res.ok) {
        router.push('/login?success=Account created successfully');
      } else {
        const message = responseData?.message || "An error occurred. Please try again.";
        if (message.toLowerCase().includes('email')) {
          setError('email', { type: 'manual', message });
        } else {
          setError('root.serverError', { type: 'manual', message });
        }
      }
    } catch (error) {
      setError('root.serverError', { type: 'manual', message: 'A network error occurred. Please try again.' });
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
              <img src="/images/form-image-2.jpg" alt="Fashion model posing" />
            </div>
            <div className="form-block">
              <div className="form-block__title-wrapper">
              <h2 className="form-block__title ">
                Create an account and discover the benefits
              </h2>
              <p className="form-block__description">
                Create an account to track orders, create wishlists, and more.
              </p>
              </div>

              <form className="form mt-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="form__input-row form__input-row--duo">
                  <div className="form__input-container">
                    <input
                      className="form__input"
                      placeholder="First Name"
                      type="text"
                      {...register("firstName", { required: "First name is required" })}
                    />
                    {errors.firstName && <p className="message message--error">{errors.firstName.message}</p>}
                  </div>
                  <div className="form__input-container">
                    <input
                      className="form__input"
                      placeholder="Last Name"
                      type="text"
                      {...register("lastName", { required: "Last name is required" })}
                    />
                    {errors.lastName && <p className="message message--error">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="form__input-row">
                  <input
                    className="form__input"
                    placeholder="Email"
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <p className="message message--error">{errors.email.message}</p>}
                </div>

                <div className="form__input-row">
                  <input
                    className="form__input"
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters"
                      },
                    })}
                  />
                  {errors.password && <p className="message message--error">{errors.password.message}</p>}
                </div>

                <div className="form__info">
                  <div className="checkbox-wrapper">
                    <label
                      htmlFor="terms-checkbox"
                      className="checkbox checkbox--sm"
                    >
                      <input
                        type="checkbox"
                        id="terms-checkbox"
                        {...register("terms")}
                      />
                      <span className="checkbox__check" />
                      <p>
                        I agree to the Terms of Service and Privacy Policy
                      </p>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="message message--error" style={{ textAlign: 'center', marginTop: '10px' }}>{errors.terms.message}</p>
                  )}
                </div>

                {errors.root?.serverError && (
                  <p className="message message--error" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                    {errors.root.serverError.message}
                  </p>
                )}

                <button
                  type="submit"
                  className="btn btn--rounded btn--yellow btn-submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Sign up'}
                </button>

                <p className="form__signup-link">
                  <Link href="/login">Are you already a member?</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;

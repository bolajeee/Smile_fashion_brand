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
    formState: { errors },
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
            <Link href="/products">
              <i className="icon-left" />
              Back to store
            </Link>
          </div>

          <div className="form-block">
            <h2 className="form-block__title">
              Create an account and discover the benefits
            </h2>
            <p className="form-block__description">
              Create an account to track your orders, create wishlists, and enjoy a personalized shopping experience.
            </p>

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="First Name"
                  type="text"
                  {...register("firstName", { required: true })}
                />
                {errors.firstName && (
                  <p className="message message--error">First name is required</p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Last Name"
                  type="text"
                  {...register("lastName", { required: true })}
                />
                {errors.lastName && (
                  <p className="message message--error">Last name is required</p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  placeholder="Email"
                  type="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  })}
                />
                {errors.email && errors.email.type === "required" && (
                  <p className="message message--error">Email is required</p>
                )}
                {errors.email && errors.email.type === "pattern" && (
                  <p className="message message--error">Invalid email address</p>
                )}
                {errors.email && errors.email.type === "manual" && (
                  <p className="message message--error">{errors.email.message}</p>
                )}
              </div>

              <div className="form__input-row">
                <input
                  className="form__input"
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: true,
                    minLength: 6,
                  })}
                />
                {errors.password && errors.password.type === "required" && (
                  <p className="message message--error">Password is required</p>
                )}
                {errors.password && errors.password.type === "minLength" && (
                  <p className="message message--error">
                    Password must be at least 6 characters
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
                      {...register("terms")}
                    />
                    <span className="checkbox__check" />
                    <p>
                      I agree to the Terms of Service and Privacy Policy
                    </p>
                  </label>
                  {errors.terms && (
                    <p className="message message--error">{errors.terms.message}</p>
                  )}
                </div>
              </div>

              {errors.root?.serverError && (
                <p className="message message--error" style={{ marginBottom: '15px', textAlign: 'center' }}>
                  {errors.root.serverError.message}
                </p>
              )}

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
              >
                Sign up
              </button>

              <p className="form__signup-link">
                <Link href="/login">Are you already a member?</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;

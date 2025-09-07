import Link from "next/link";
import { useForm } from "react-hook-form";

import Layout from "../layouts/Main";
import { server } from "../utils/server";
import { postData } from "../utils/services";

type ForgotMail = {
  email: string;
};

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotMail>();

  const onSubmit = async (data: ForgotMail) => {
    await postData(`${server}/api/login`, {
      email: data.email,
    });
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

              <button
                type="submit"
                className="btn btn--rounded btn--yellow btn-submit"
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

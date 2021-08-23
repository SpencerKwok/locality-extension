import * as yup from "yup";
import { Formik } from "formik";

import LocalityLogo from "../common/images/LocalityLogo";
import {
  ErrorMessage,
  FormGroup,
  Input,
  InputGroup,
  SubmitButton,
} from "../common/form";
import Stack from "../common/Stack";
import "./App.css";

import type { FC } from "react";
import type { FormikConfig } from "formik";

const SignUpSchema = yup.object().shape({
  firstName: yup
    .string()
    .strict(true)
    .required("Required")
    .max(255, "Too long"),
  lastName: yup.string().strict(true).required("Required").max(255, "Too long"),
  email: yup
    .string()
    .strict(true)
    .email("Invalid email address")
    .required("Required")
    .max(255, "Too long"),
  password1: yup
    .string()
    .strict(true)
    .required("Required")
    .min(8, "Too short")
    .max(255, "Too long"),
  password2: yup
    .string()
    .strict(true)
    .required("Required")
    .min(8, "Too short")
    .max(255, "Too long")
    .oneOf([yup.ref("password1")], "Passwords do not match"),
  subscribe: yup.boolean().strict(true).required("Required"),
});

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password1: string;
  password2: string;
  subscribe: boolean;
}

export interface SignUpProps {
  error: string;
  onSignIn: () => void;
  onSignUp: FormikConfig<SignUpRequest>["onSubmit"];
}

const SignUp: FC<SignUpProps> = ({ error, onSignIn, onSignUp }) => {
  return (
    <div style={{ width: 300 }}>
      <Stack direction="row" columnAlign="center">
        <Stack
          direction="column"
          spacing={6}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <Stack direction="row" columnAlign="center">
            <LocalityLogo height={60} width={200} />
          </Stack>
          <Formik
            initialValues={
              {
                firstName: "",
                lastName: "",
                email: "",
                password1: "",
                password2: "",
                subscribe: true,
              } as SignUpRequest
            }
            validationSchema={SignUpSchema}
            onSubmit={onSignUp}
          >
            {({
              isSubmitting,
              values,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <form onSubmit={handleSubmit} style={{ width: 200 }}>
                <FormGroup>
                  <InputGroup required>
                    <Input
                      required
                      aria-required
                      aria-label="First Name"
                      aria-details="Enter first name here"
                      id="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First Name"
                      type="text"
                      value={values.firstName}
                    />
                  </InputGroup>
                  <ErrorMessage name="firstName" />
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <Input
                      required
                      aria-required
                      aria-label="Last Name"
                      aria-details="Enter last name"
                      id="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Last Name"
                      type="text"
                      value={values.lastName}
                    />
                  </InputGroup>
                  <ErrorMessage name="lastName" />
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <Input
                      required
                      aria-required
                      aria-label="Email"
                      aria-details="Enter email here"
                      id="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Email"
                      type="email"
                      value={values.email}
                    />
                  </InputGroup>
                  <ErrorMessage name="email" />
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <Input
                      required
                      aria-required
                      aria-label="Password"
                      aria-details="Enter password here"
                      id="password1"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Password"
                      type="password"
                      value={values.password1}
                    />
                  </InputGroup>
                  <ErrorMessage name="password1" />
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <Input
                      required
                      aria-required
                      aria-label="Re-enter Password"
                      aria-details="Re-enter password here"
                      id="password2"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      type="password"
                      value={values.password2}
                    />
                  </InputGroup>
                  <ErrorMessage name="password2" />
                </FormGroup>
                <FormGroup>
                  <InputGroup>
                    <Stack direction="row" rowAlign="center" spacing={24}>
                      <Input
                        defaultChecked
                        aria-label="Occassional marketing email checkbox"
                        aria-details="Checkbox to opt in to occassional marketing emails"
                        id="subscribe"
                        type="checkbox"
                        label=" I'd like to receive occasional marketing emails from Locality."
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.subscribe ? "true" : "false"}
                      />
                      <p style={{ fontSize: 11, margin: 0 }}>
                        I'd like to receive occasional marketing emails from
                        Locality.
                      </p>
                    </Stack>
                  </InputGroup>
                  <ErrorMessage name="subscribe" />
                </FormGroup>
                <div className="locality-error" style={{ width: 200 }}>
                  {error}
                </div>
                <Stack direction="row-reverse">
                  <SubmitButton
                    text="Sign up"
                    submittingText="Signing up..."
                    isSubmitting={isSubmitting}
                  />
                </Stack>
              </form>
            )}
          </Formik>
          <div style={{ textAlign: "center" }}>
            Already signed up?{" "}
            <div className="locality-internal-link" onClick={onSignIn}>
              Sign in
            </div>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default SignUp;

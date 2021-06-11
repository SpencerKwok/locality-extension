import * as yup from "yup";

import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { Formik } from "formik";

import LocalityLogo from "../common/images/LocalityLogo";
import { ErrorMessage, InputGroup, Label, SubmitButton } from "../common/form";
import Stack from "../common/Stack";
import "./App.css";

import type { FC } from "react";
import type { FormikConfig } from "formik";

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Required")
    .max(255, "Too long"),
  password: yup.string().required("Required").max(255, "Too long"),
});

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInProps {
  install?: boolean;
  error: string;
  onSignIn: FormikConfig<SignInRequest>["onSubmit"];
  onSignUp: () => void;
}

const SignIn: FC<SignInProps> = ({ install, error, onSignIn, onSignUp }) => {
  return (
    <div style={{ width: 300 }}>
      <Stack direction="row" columnAlign="center">
        <Stack
          direction="column"
          spacing={6}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <LocalityLogo height={60} width={200} />
          <div style={{ margin: 0, textAlign: "center", width: 200 }}>
            Sign in to {install ? "complete set up!" : "see your wishlist!"}
          </div>
          <Formik
            initialValues={
              {
                email: "",
                password: "",
              } as SignInRequest
            }
            validationSchema={SignInSchema}
            onSubmit={onSignIn}
          >
            {({
              isSubmitting,
              values,
              handleBlur,
              handleChange,
              handleSubmit,
            }) => (
              <Form onSubmit={handleSubmit} style={{ width: 200 }}>
                <Form.Group>
                  <Label required>Email</Label>
                  <InputGroup>
                    <FormControl
                      aria-required
                      aria-label="Email"
                      aria-details="Enter email here"
                      id="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="email"
                      value={values.email}
                    />
                  </InputGroup>
                  <ErrorMessage name="email" />
                </Form.Group>
                <Form.Group>
                  <Label required>Password</Label>
                  <InputGroup>
                    <FormControl
                      aria-required
                      aria-label="Password"
                      aria-details="Enter password here"
                      id="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      type="password"
                      value={values.password}
                    />
                  </InputGroup>
                  <ErrorMessage name="password" />
                </Form.Group>
                <div className="locality-error" style={{ width: 200 }}>
                  {error}
                </div>
                <Stack direction="row-reverse">
                  <SubmitButton
                    text="Sign in"
                    submittingText="Signing in..."
                    isSubmitting={isSubmitting}
                  />
                </Stack>
              </Form>
            )}
          </Formik>
          <div style={{ textAlign: "center" }}>
            New to Locality?{" "}
            <div className="locality-internal-link" onClick={onSignUp}>
              Sign up
            </div>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default SignIn;

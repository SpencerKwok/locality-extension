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

const SignUpSchema = yup.object().shape({
  firstName: yup.string().required("Required").max(255, "Too long"),
  lastName: yup.string().required("Required").max(255, "Too long"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Required")
    .max(255, "Too long"),
  password1: yup
    .string()
    .required("Required")
    .min(8, "Too short")
    .max(255, "Too long"),
  password2: yup
    .string()
    .required("Required")
    .min(8, "Too short")
    .max(255, "Too long")
    .oneOf([yup.ref("password1")], "Passwords do not match"),
});

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password1: string;
  password2: string;
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
          <LocalityLogo height={80} width={200} />
          <Formik
            initialValues={
              {
                firstName: "",
                lastName: "",
                email: "",
                password1: "",
                password2: "",
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
              <Form onSubmit={handleSubmit} style={{ width: 200 }}>
                <Form.Group>
                  <Label required>First Name</Label>
                  <InputGroup>
                    <FormControl
                      aria-required
                      aria-label="First Name"
                      aria-details="Enter first name here"
                      id="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      type="text"
                      value={values.firstName}
                    />
                  </InputGroup>
                  <ErrorMessage name="firstName" />
                </Form.Group>
                <Form.Group>
                  <Label required>Last Name</Label>
                  <InputGroup>
                    <FormControl
                      aria-required
                      aria-label="Last Name"
                      aria-details="Enter last name here"
                      id="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      type="text"
                      value={values.lastName}
                    />
                  </InputGroup>
                  <ErrorMessage name="lastName" />
                </Form.Group>
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
                      placeholder="Enter email"
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
                      id="password1"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Enter password"
                      type="password"
                      value={values.password1}
                    />
                  </InputGroup>
                  <ErrorMessage name="password1" />
                </Form.Group>
                <Form.Group>
                  <Label required>Re-enter password</Label>
                  <InputGroup>
                    <FormControl
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
                </Form.Group>
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
              </Form>
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

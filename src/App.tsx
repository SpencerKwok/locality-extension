import { useEffect, useState } from "react";
import * as yup from "yup";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { Formik } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";

import LocalityLogo from "./common/images/LocalityLogo";
import { ErrorMessage, InputGroup, Label, SubmitButton } from "./common/form";
import Stack from "./common/Stack";
import "./App.css";

import type { FC } from "react";
import type { FormikConfig } from "formik";

interface Product {
  name: string;
  business: string;
  link: string;
  variantIndex: number;
  variantImages: Array<string>;
}

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email")
    .required("Required")
    .max(255, "Too long"),
  password: yup.string().required("Required").max(255, "Too long"),
});

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

interface SignInRequest {
  email: string;
  password: string;
}

interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password1: string;
  password2: string;
}

const App: FC<{}> = () => {
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("");
  const [wishlist, setWishlist] = useState<Array<Product>>([]);

  useEffect(() => {
    // @ts-ignore
    chrome.runtime.sendMessage(
      { message: "get", keys: ["id", "token"] },
      async (values: any) => {
        const [id, token] = values;
        if (typeof id === "number" && typeof token === "string") {
          await fetch(`${process.env.REACT_APP_BASE_API_URL}/wishlist/get`, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              id: id.toString(),
              token: token,
            },
          })
            .then((res) => res.json())
            .then((data: { products: Array<Product> }) => {
              setWishlist(data.products);
            });

          setPage("wishlist");
        }

        setLoaded(true);
      }
    );
  }, []);

  const SignIn: FormikConfig<SignInRequest>["onSubmit"] = async (values) => {
    await fetch(`${process.env.REACT_APP_BASE_API_URL}/signin/credentials`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    })
      .then((res) => res.json())
      .then(async ({ error, id, token }) => {
        if (error) {
          setError(error);
          return;
        }

        // @ts-ignore
        chrome.runtime.sendMessage({ message: "set", key: "id", value: id });
        // @ts-ignore
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        await fetch(`${process.env.REACT_APP_BASE_API_URL}/wishlist/get`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            id: id.toString(),
            token: token,
          },
        })
          .then((res) => res.json())
          .then((data: { products: Array<Product> }) => {
            setWishlist(data.products);
            setPage("wishlist");
          });
      })
      .catch((error) => {
        setError(error);
      });
  };

  const SignUp: FormikConfig<SignUpRequest>["onSubmit"] = async (values) => {
    await fetch(`${process.env.REACT_APP_BASE_API_URL}/signup/user`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password1,
      }),
    })
      .then((res) => res.json())
      .then(({ error, id, token }) => {
        if (error) {
          setError(error);
          return;
        }

        // @ts-ignore
        chrome.runtime.sendMessage({ message: "set", key: "id", value: id });
        // @ts-ignore
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        setPage("wishlist");
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (!loaded) {
    return (
      <div style={{ width: 300 }}>
        <div style={{ textAlign: "center", marginTop: 20, marginBottom: 20 }}>
          Loading user data...
        </div>
      </div>
    );
  }

  if (page === "wishlist") {
    return (
      <div style={{ width: 300 }}>
        <Stack direction="row" columnAlign="center">
          <Stack
            direction="column"
            rowAlign="center"
            style={{ marginBottom: 20 }}
          >
            <Stack direction="row-reverse" style={{ width: 300 }}>
              <Button
                variant="secondary"
                style={{ margin: 8, padding: "4px 8px" }}
                onClick={() => {
                  // @ts-ignore
                  chrome.runtime.sendMessage(
                    { message: "get", keys: ["id", "token"] },
                    async (values: any) => {
                      const [id, token] = values;
                      if (typeof id === "number" && typeof token === "string") {
                        fetch(`${process.env.REACT_APP_BASE_API_URL}/signout`, {
                          method: "GET",
                          headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            id: id.toString(),
                            token: token,
                          },
                        });
                      }
                      // @ts-ignore
                      chrome.runtime.sendMessage({ message: "clear" });
                      setWishlist([]);
                      setPage("signin");
                    }
                  );
                }}
              >
                Sign out
              </Button>
            </Stack>
            <h1 style={{ textAlign: "center" }}>My Wishlist</h1>
            <Stack direction="column" rowAlign="center" style={{ width: 300 }}>
              {wishlist.length > 0 ? (
                Array.from(Array(Math.ceil(wishlist.length / 3)).keys()).map(
                  (index) => {
                    return (
                      <Stack
                        direction="row"
                        columnAlign="flex-start"
                        spacing={8}
                      >
                        {(() => {
                          const results = wishlist
                            .slice(index * 3, index * 3 + 3)
                            .map(
                              (
                                {
                                  name,
                                  business,
                                  link,
                                  variantIndex,
                                  variantImages,
                                },
                                index2
                              ) => {
                                if (name.length > 14) {
                                  name = `${name.substr(0, 12)}...`;
                                }

                                return (
                                  <a
                                    key={index}
                                    href={link}
                                    className={`locality-link${
                                      (index2 + 1) % 3 === 0 ? "-end" : ""
                                    }`}
                                  >
                                    <Stack
                                      direction="column"
                                      rowAlign="center"
                                      columnAlign="center"
                                      style={{
                                        height: 125,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <img
                                        alt={name}
                                        src={variantImages[variantIndex]}
                                        style={{ width: 90 }}
                                      />
                                    </Stack>
                                    <h6 className="locality-label-business">
                                      {business}
                                    </h6>
                                    <h4 className="locality-label-name">
                                      {name}
                                    </h4>
                                  </a>
                                );
                              }
                            );

                          const blankSlots = (3 - (results.length % 3)) % 3;
                          if (blankSlots > 0) {
                            results.push(
                              <div
                                key={wishlist.length}
                                style={{
                                  width: blankSlots * 90 + (blankSlots - 1) * 8,
                                }}
                              />
                            );
                          }

                          return results;
                        })()}
                      </Stack>
                    );
                  }
                )
              ) : (
                <div
                  style={{
                    marginTop: 20,
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  Empty
                </div>
              )}
            </Stack>
          </Stack>
        </Stack>
      </div>
    );
  }

  if (page === "signup") {
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
              onSubmit={SignUp}
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
              <div
                className="locality-internal-link"
                onClick={() => {
                  setPage("signin");
                }}
              >
                Sign in
              </div>
            </div>
          </Stack>
        </Stack>
      </div>
    );
  }

  return (
    <div style={{ width: 300 }}>
      <Stack direction="row" columnAlign="center">
        <Stack
          direction="column"
          spacing={6}
          style={{ marginTop: 20, marginBottom: 20 }}
        >
          <LocalityLogo height={80} width={200} />
          <div style={{ margin: 0, textAlign: "center", width: 200 }}>
            Sign in to see your wishlist!
          </div>
          <Formik
            initialValues={
              {
                email: "",
                password: "",
              } as SignInRequest
            }
            validationSchema={SignInSchema}
            onSubmit={SignIn}
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
            <div
              className="locality-internal-link"
              onClick={() => {
                setPage("signup");
              }}
            >
              Sign up
            </div>
          </div>
        </Stack>
      </Stack>
    </div>
  );
};

export default App;

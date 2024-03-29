import { useEffect, useState } from "react";

import { GetRpcClient, PostRpcClient } from "../common/RpcClient";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Wishlist from "./Wishlist";
import Stack from "../common/Stack";
import "./App.css";

import type { FC } from "react";
import type { FormikConfig } from "formik";
import type { Product } from "../common/Schema";
import type { SignInRequest } from "./SignIn";
import type { SignUpRequest } from "./SignUp";

const App: FC<{}> = () => {
  const [auth, setAuth] = useState({ email: "", token: "" });
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("");
  const [wishlist, setWishlist] = useState<Array<Product>>([]);
  const params = new URLSearchParams(window.location.search);
  const install = params.get("install");

  useEffect(() => {
    if (!install) {
      chrome.runtime.sendMessage(
        { message: "get", keys: ["email", "token"] },
        async (values: any) => {
          const [email, token] = values;
          if (typeof email === "string" && typeof token === "string") {
            await GetRpcClient.getInstance()
              .call("WishList", "/wishlist/get", { email, token })
              .then(({ products }) => {
                setWishlist(products);
              });
            setAuth({ email, token });
            setPage("wishlist");
          }
          setLoaded(true);
        }
      );
    } else {
      setLoaded(true);
    }
  }, [install]);

  const onSignIn: FormikConfig<SignInRequest>["onSubmit"] = async (values) => {
    await PostRpcClient.getInstance()
      .call("SignIn", values)
      .then(async ({ error, email, token }) => {
        if (error) {
          setError(error);
          return;
        }

        chrome.runtime.sendMessage({
          message: "set",
          key: "email",
          value: email,
        });
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        await GetRpcClient.getInstance()
          .call("WishList", "/wishlist/get", { email, token })
          .then(({ products }) => {
            setWishlist(products);
            setAuth({ email, token });
            setPage("wishlist");
          });
      })
      .catch((error) => {
        setError(error);
      });
  };

  const onSignUp: FormikConfig<SignUpRequest>["onSubmit"] = async (values) => {
    await PostRpcClient.getInstance()
      .call("SignUp", { ...values, password: values.password1 })
      .then(({ error, email, token }) => {
        if (error) {
          setError(error);
          return;
        }

        chrome.runtime.sendMessage({
          message: "set",
          key: "email",
          value: email,
        });
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        setAuth({ email, token });
        setPage("wishlist");
      })
      .catch((error) => {
        setError(error);
      });
  };

  const onSignOut = () => {
    chrome.runtime.sendMessage(
      { message: "get", keys: ["email", "token"] },
      (values: any) => {
        const [email, token] = values;
        if (typeof email === "string" && typeof token === "string") {
          GetRpcClient.getInstance()
            .call("SignOut", "/signout", { email, token })
            .catch((err) => console.log(err));
        }
        chrome.runtime.sendMessage({ message: "clear" });
        setAuth({ email: "", token: "" });
        setWishlist([]);
        setPage("signin");
      }
    );
  };

  const onToggleWishlist = (objectId: string, value: boolean) => {
    if (value) {
      return PostRpcClient.getInstance().call(
        "AddToWishList",
        { id: objectId },
        auth
      );
    }
    return PostRpcClient.getInstance().call(
      "DeleteFromWishList",
      { id: objectId },
      auth
    );
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

  switch (page) {
    case "wishlist":
      if (install) {
        window.resizeTo(330, 360);
        return (
          <Stack
            direction="column"
            columnAlign="center"
            rowAlign="center"
            style={{ height: window.innerHeight }}
          >
            <div
              style={{ width: window.innerWidth * 0.8, textAlign: "center" }}
            >
              Set up complete! You can now close this window
            </div>
          </Stack>
        );
      }
      return (
        <Wishlist
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onSignOut={onSignOut}
        />
      );
    case "signup":
      if (install) {
        window.resizeTo(330, 540);
      }
      return (
        <SignUp
          error={error}
          onSignIn={() => setPage("signin")}
          onSignUp={onSignUp}
        />
      );
    default:
      if (install) {
        window.resizeTo(330, 360);
      }
      return (
        <SignIn
          install={!!install}
          error={error}
          onSignIn={onSignIn}
          onSignUp={() => setPage("signup")}
        />
      );
  }
};

export default App;

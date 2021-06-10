import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { GetRpcClient, PostRpcClient } from "../common/RpcClient";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Wishlist from "./Wishlist";
import "./App.css";

import type { FC } from "react";
import type { FormikConfig } from "formik";
import type { Product } from "../common/Schema";
import type { SignInRequest } from "./SignIn";
import type { SignUpRequest } from "./SignUp";

const App: FC<{}> = () => {
  const [auth, setAuth] = useState({ id: -1, token: "" });
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState("");
  const [wishlist, setWishlist] = useState<Array<Product>>([]);

  useEffect(() => {
    chrome.runtime.sendMessage(
      { message: "get", keys: ["id", "token"] },
      async (values: any) => {
        const [id, token] = values;
        if (typeof id === "number" && typeof token === "string") {
          await GetRpcClient.getInstance()
            .call("WishList", "/wishlist/get", { id, token })
            .then(({ products }) => {
              setWishlist(products);
            });
          setAuth({ id, token });
          setPage("wishlist");
        }
        setLoaded(true);
      }
    );
  }, []);

  const onSignIn: FormikConfig<SignInRequest>["onSubmit"] = async (values) => {
    await PostRpcClient.getInstance()
      .call("SignIn", values)
      .then(async ({ error, id, token }) => {
        if (error) {
          setError(error);
          return;
        }

        chrome.runtime.sendMessage({ message: "set", key: "id", value: id });
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        await GetRpcClient.getInstance()
          .call("WishList", "/wishlist/get", { id, token })
          .then(({ products }) => {
            setWishlist(products);
            setAuth({ id, token });
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
      .then(({ error, id, token }) => {
        if (error) {
          setError(error);
          return;
        }

        chrome.runtime.sendMessage({ message: "set", key: "id", value: id });
        chrome.runtime.sendMessage({
          message: "set",
          key: "token",
          value: token,
        });

        setAuth({ id, token });
        setPage("wishlist");
      })
      .catch((error) => {
        setError(error);
      });
  };

  const onSignOut = () => {
    chrome.runtime.sendMessage(
      { message: "get", keys: ["id", "token"] },
      (values: any) => {
        const [id, token] = values;
        if (typeof id === "number" && typeof token === "string") {
          GetRpcClient.getInstance()
            .call("SignOut", "/signout", { id, token })
            .catch((err) => console.log(err));
        }
        chrome.runtime.sendMessage({ message: "clear" });
        setAuth({ id: -1, token: "" });
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
      {
        id: objectId,
      },
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
      return (
        <Wishlist
          wishlist={wishlist}
          onToggleWishlist={onToggleWishlist}
          onSignOut={onSignOut}
        />
      );
    case "signup":
      return (
        <SignUp
          error={error}
          onSignIn={() => setPage("signin")}
          onSignUp={onSignUp}
        />
      );
    default:
      return (
        <SignIn
          error={error}
          onSignIn={onSignIn}
          onSignUp={() => setPage("signup")}
        />
      );
  }
};

export default App;

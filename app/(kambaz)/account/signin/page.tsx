"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    redirect("/dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h3>Sign in</h3>
      <FormControl
        defaultValue={credentials.username}
        onChange={(e) =>
          setCredentials({ ...credentials, username: e.target.value })
        }
        id="wd-username"
        placeholder="username"
        className="mb-2"
      />
      <br />
      <FormControl
        defaultValue={credentials.password}
        onChange={(e) =>
          setCredentials({ ...credentials, password: e.target.value })
        }
        id="wd-password"
        placeholder="password"
        type="password"
        className="mb-2"
      />
      <br />
      <Button onClick={signin}
        id="wd-signin-btn"
        className="btn btn-primary w-100 mb-2"
      >
        Sign in
      </Button>
      <br />
      <Link id="wd-signup-link" href="signup">
        Sign up
      </Link>
      <div className="mt-3 text-muted small">
        <div><strong>Ahan Jain</strong> &amp; <strong>Xander Hoke - Asynchronous Section</strong></div>
        <div className="mt-1">
          <a href="https://github.com/ahan-jain/kambaz-node-server-app" target="_blank" rel="noopener noreferrer">Frontend GitHub</a>
          {" | "}
          <a href="https://github.com/ahan-jain/kambaz-next-js" target="_blank" rel="noopener noreferrer">Backend GitHub</a>
        </div>
      </div>
    </div>
  );
}
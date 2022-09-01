import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function LogIn() {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");
 
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form" action="/login" method="POST"> 
            <span className="login-form-title"> 로그인 </span>
            
            <div className="wrap-input">
              <input
                className={id !== "" ? "has-val input" : "input"}
                type="text"
                value={id}
                onChange={(e) => setID(e.target.value)}
              />
              <span className="focus-input" data-placeholder="아이디"></span>
            </div>

            <div className="wrap-input">
              <input
                className={password !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="비밀번호"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn" type="submit">Log In</button> 
            </div>

            <div className="text-center">
              <span className="txt1">회원이 아니신가요? </span>
              <a className="txt2">
                <Link to={"/SignIn"}>회원가입</Link>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LogIn;

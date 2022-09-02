import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function LogIn() {
  const [id, setID] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = (e) => {
    fetch('http://localhost:3000/login', {
      method: 'POST', 
      body: JSON.stringify({
        loginID: id,
        loginPw: password,
      }),
    }) //회원가입이 완료됐다는 메세지 띄우고 로그인 페이지로 이동
    .then((response) => response.json())
    .then(result => alert(result.message));
  };
  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
          <form className="login-form" onSubmit={submitHandler}> 
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
              <button className="login-form-btn" type="submit" >Log In</button> 
            </div>

            <div className="text-center">
              <span className="txt1">회원이 아니신가요? </span>
              <Link to={"/SignIn"} className="txt2">
                <p>회원가입</p>
              </Link>
            </div>

            <div className="text-center">
              <span className="txt1">마이페이지 테스트 </span>
              <Link to={"/Mypage"} className="txt2">
                <p>마이페이지</p>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LogIn;

import React, { useState } from "react";
import "./Signin.css";

function SignIn() {
  const [nickname, setNickname] = useState("");
  const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  const onClickSubmit = () => {
    // fetch
    // body에 loginId, loginPw, loginPwConfirm, email, nickname 넣어서 post
    fetch('http://localhost:3000/join', {
      method: 'POST', 
      body: JSON.stringify({
        nickname : nickname,
        loginID: id,
        email : email,
        loginPw: password,
        loginPwConfirm: confirmpassword
      }),
    }) //회원가입이 완료됐다는 메세지 띄우고 로그인 페이지로 이동
    .then((response) => response.json())
    .then(result => alert(result.message));
  }

  return (
    <div className="container">
      <div className="container-login">
        <div className="wrap-login">
        <form className="login-form">
            <span className="login-form-title"> 회원가입 </span>
            <div className="wrap-input">
              <input
                className={nickname !== "" ? "has-val input" : "input"}
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <span className="focus-input" data-placeholder="닉네임"></span>
            </div>
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
                className={id !== "" ? "has-val input" : "input"}
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <span className="focus-input" data-placeholder="이메일"></span>
            </div>
            <div className="wrap-input">
              <input
                className={email !== "" ? "has-val input" : "input"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="비밀번호"></span>
            </div>

            <div className="wrap-input">
              <input
                className={confirmpassword !== "" ? "has-val input" : "input"}
                type="password"
                value={confirmpassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span className="focus-input" data-placeholder="비밀번호 확인"></span>
            </div>

            <div className="container-login-form-btn">
              <button className="login-form-btn" type="submit" onClick={onClickSubmit}>Submit</button> 
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
import React, { useState } from "react";
import "./Signin.css";

function SignIn() {
  const [nickname, setNickname] = useState("");
  const [id, setID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");

  console.log(nickname);
  console.log(id);
  console.log(email);
  console.log(password);
  console.log(confirmpassword);
  
  const onClickSubmit = (e) => {
    const requestOptions = {
      // 데이터 통신의 방법과 보낼 데이터의 종류, 데이터를 설정합니다.
      method: "POST", // POST는 서버로 요청을 보내서 응답을 받고, GET은 서버로부터 응답만 받습니다.
      headers: {
        "Content-Type": "application/json",
      }, // json형태의 데이터를 서버로 보냅니다.
      body: JSON.stringify({
        // 이 body에 해당하는 데이터를 서버가 받아서 처리합니다.
        nickname : nickname,
        loginID: id,
        email : email,
        loginPw: password,
        loginPwConfirm: confirmpassword
      }),
    };
    console.log(requestOptions);
    fetch("http://localhost:3000/join", requestOptions)
      .then((res) => res.json()) // Result를 JSON으로 받습니다.
      .then((res) => {
        console.log(res); // 결과를 console창에 표시합니다.
      });
  };

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
              <button className="login-form-btn" type="submit" onClick={onClickSubmit} >Submit</button> 
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignIn;
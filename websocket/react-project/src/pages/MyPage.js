import React, { useState } from "react";
import "./Mypage.css";

function Mypage() {
  return (
    <div className="container">
      <div className="container-mypage">
        <div className="wrap-mypage">
          <div className="mypage">
            <span className="mypage-title"> 내정보 </span>
            <div className="wrap-info">
              <input
                className={id !== "" ? "has-val input" : "input"}
                type="id"
                value={id}
                onChange={(e) => setID(e.target.value)}
              />
              <span className="focus-input" data-placeholder="아이디"></span>
            </div>

            <div className="text-center">
              <span className="txt1">회원이 아니신가요? </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Mypage;
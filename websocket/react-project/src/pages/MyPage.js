import React from "react";
import { Link } from "react-router-dom";
import "./Mypage.css";

function Mypage() {
  //let requestRsponse = fetch(url, [params]);

  return (
    <div className="container">
      <div className="container-mypage">
        <div className="wrap-mypage">
          <div className="mypage">
            <span className="mypage-title"> 내정보 </span>
            <div className="wrap-info">
              <span className="info">닉네임</span>
              <span className="userInfo">nickname</span>
            </div>
            <div className="wrap-info">
              <span className="info">아이디</span>
              <span className="userInfo">id</span>
            </div>
            <div className="wrap-info">
              <span className="info">이메일</span>
              <span className="userInfo">email</span>
            </div>
            <div className="wrap-info">
              <span className="info">레벨</span>
              <span className="userInfo">level</span>
            </div>
            <div className="wrap-info">
              <span className="info">스코어</span>
              <span className="userInfo">score</span>
            </div>
            <div className="text-center">
              <span className="txt1">Welcome! 오늘도 반갑습니다. </span>
              <Link to={"/Home"} className="txt2">
                <p>홈화면으로</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Mypage;

/*
<!-- <%= userSession.user_id %> 님의 -->

            <div>
              <script>
                async function funcRequest(url){
                  await fetch(url)
                  .then((response) => {
                    return response.json(); // data into json
                  }).then((data) => {
                    // Here we can use the response Data
                  }).catch(function(error) {
                    console.log(error);
                  })
                }
                const url = 'URL of file';
                funcRequest(url);
              </script>
            </div>
*/
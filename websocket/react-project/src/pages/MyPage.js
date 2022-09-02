import React, { useState } from "react";
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
              <p className="input"> 너는</p>
              <span className="focus-input">뭘까 </span>
            </div>
            
            <div className="text-center">
              <span className="txt1">넌 뭔데 </span>
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
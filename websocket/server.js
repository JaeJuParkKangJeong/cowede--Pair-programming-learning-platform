//npm install debug cookie-parser express morgan socket.io body-parser ejs mongoose nodemon bcrypt
//npm install --legacy-peer-deps mongoose-auto-increment

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var idePageRouter = require("./routes/idePage.js");

var app = express();
app.io = require("socket.io")();

// DB
const mongoose = require("mongoose");
const dbUrl =
  "mongodb+srv://cowede:cowede12345@cavo.avwd3gl.mongodb.net/cavo?retryWrites=true&w=majority";
const Questions = require("./models/questionsModel");
const { resolve } = require("path");

//DB
mongoose.connect(
  dbUrl,
  {
    dbName: "pairPrograming_new_edit_2",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      return console.log(err);
    } else {
      console.log("DB/ODM is connected");
    }
  }
);

//app.use(logger("dev")); // 받는 Request 로그 찍어준다.
app.use(express.json()); // JSON 형태의 request body 받았을 경우 파싱
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//app.use("/test", idePageRouter);

/**
 * 회원가입
 */

//라이브러리 가져오기
const bcrypt = require("bcrypt"); //암호화 모듈 사용

//모델 가져오기
const Users = require("./models/userModel");

// '/signUp'경로로 get요청 -> 화원가입 페이지(registerForm.html) 뜨게하기
app.get("/signUp", function (req, res) {
  res.sendFile(__dirname + "/public/registerForm.html");
});

// '/join'으로 post요청하면 -> 계정생성 -> DB에(users Collection에)저장
app.post("/join", async function register(req, res) {
  //form으로 입력받은거 사용 위해 변수 선언해서 저장
  const input_id = req.body.loginId;
  const input_pw = req.body.loginPw;
  const input_pw_confirm = req.body.loginPwConfirm;
  const input_email = req.body.email;
  const input_nickname = req.body.nickname;

  //이메일, 닉네임 중복확인, 패스워드같은지 확인 -> 계정생성
  try {
    const check_email = await Users.findOne({ user_email: input_email });
    const check_nickname = await Users.findOne({
      user_nickName: input_nickname,
    });

    if (check_email) {
      return res
        .status(400)
        .json({ errors: [{ message: "이미 가입된 이메일입니다ㅠㅠ" }] });
    }

    if (check_nickname) {
      return res
        .status(400)
        .json({ errors: [{ message: "이미 사용중인 닉네임입니다ㅠㅠ" }] });
    }

    if (input_pw != input_pw_confirm) {
      return res
        .status(400)
        .json({ errors: [{ message: "비밀번호를 다시 확인하세욥!" }] });
    }

    //계정생성
    const new_user = await new Users({
      user_id: input_id,

      user_pw: input_pw,

      user_email: input_email,

      user_nickName: input_nickname,

      user_level: {
        //new_user.user_level.java 로 접근

        java: 1,
        c: 1,
        cpp: 1,
        python: 1,
      },

      user_score: {
        java: 0,
        c: 0,
        cpp: 0,
        python: 0,
      },
    });

    new_user.user_correct_ques = [0]; //new_user.user_correct_ques[1~] --> index 1부터 맞춘문제 저장됨

    //pw암호화
    const salt = await bcrypt.genSalt(10);
    new_user.user_pw = await bcrypt.hash(input_pw, salt);

    //users Collection에 새로운 계정 Document 저장 -> 홈페이지로 리다이렉트
    await new_user.save().then((res) => {
      console.log(res);
      //res.redirect('/');
    });

    //홈 페이지로 리다이렉트(로그인 한 상태로??)
    res.redirect("/");
  } catch (error) {
    //회원가입 안되면 user_counter Collectio Document의 seq_val_for_user_id --1
    console.error(error.message); //여기에 뭐가 뜨는거지?
    res.status(500).send("Server Error");
  }
});

let roomIndex = 1;
let rooms = []; //방정보들 저장
let clients = new Map(); // 접속해있는 소켓 저장할 Map 객체

let result;

let Lv;
let Lg;
let user;

// /editor/?level=num GET 요청 시,
const num_of_ques = 2;

//리액트 홈페이지띄우기
app.use(express.static(path.join(__dirname, "react-project/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "react-project/build/index.html"));
});

app.get("/editor", async (req, res) => {
  const uid = req.query.user_id;
  Lg = req.query.language;

  user = await Users.findOne({ user_id: uid });

  Lv = user.user_level[Lg];

  const user_correct_ques = user.user_correct_ques;
  console.log("correct que: ", user.user_correct_ques);
  run();
  async function run() {
    result = await Questions.aggregate([
      { $match: { problem_level: parseInt(Lv), problem_id: {$nin: user_correct_ques} } },
      { $sample: { size: num_of_ques } },
    ]);
    console.log("lv: ", Lv);
    console.log("prob_id: ", result[0].problem_id , result[1].problem_id);
  }

  res.sendFile(__dirname + "/public/editor.html"); // editor.html 띄워준다.
});

app.get("/leveltest", async (req, res) => {

  let level1;
  let level2;
  let level3;

  await run1();
  await run2();
  await run3();

  async function run1() {
    level1 = await Questions.aggregate([
      { $match: { problem_level: 1 } },
      { $sample: { size: 1 } },
    ]);
  }
  async function run2() {
    level2 = await Questions.aggregate([
      { $match: { problem_level: 2 } },
      { $sample: { size: 1 } },
    ]);
  }
  async function run3() {
    level3 = await Questions.aggregate([
      { $match: { problem_level: 3 } },
      { $sample: { size: 1 } },
    ]);
  }

  const questions = [level1, level2, level3]; // 1레벨,2레벨,3레벨에서 각각 1개씩 랜덤으로 뽑은 문제

  // res.sendFile(__dirname + "/public/leveltest.html"); //leveltest 화면 띄워준다.

});

// language ID - 50 : C, 52 : C++, 62 : Java, 71 : Python
function idToLanguage(language_id) {
  switch (language_id) {
    case "50":
      return "c";
    case "52":
      return "cpp";
    case "62":
      return "java";
    case "71":
      return "python";
  }
}

function scoreToLevel(score) {
  if (score < 5) return 1;
  else if (score >= 5 && score <= 9) return 2;
  else if (score >= 10 && score <= 18) return 3;
  else if (score >= 19 && score <= 30) return 4;
  else return 5;
}

/**
 * 채점 성공 시에 User 정보 Update
 * "/editor/solve?user_id=3&question_id=3&language_id=52 GET Request"
 */
app.get("/editor/solve", async (req, res) => {
  const user_id = req.query.user_id;
  const question_id = req.query.question_id;
  const language_id = req.query.language_id;

  //입력받은 language_id 통해서 c / cpp / java / python으로 변환
  const language = idToLanguage(language_id);

  // DB 조회 조건 - user는 userId로 , question은 questionId로 찾는다.
  const questionFilter = { problem_id: question_id };
  const userFilter = { user_id: user_id };

  // 문제를 해결한 user & user가 해결한 문제 DB에서 가져오기
  const question = await Questions.findOne(questionFilter);
  const user = await Users.findOne(userFilter);

  // (1)c, cpp, java, python 외의 languageId (2)존재하지 않는 userId (3)존재하지 않는 questionId 입력 받았을 때 error 발생
  if (!language || !user || !question) {
    return res.status(400).json({
      error:
        "존재하지 않는 userId or 존재하지 않는 questionId or 지원하지 않는 언어",
    });
  }

  // 문제 중복 풀이 방지
  if (question_id in user.user_correct_ques) {
    return res.status(400).json({
      error: "이미 풀었던 문제입니다.",
    });
  }

  // update 쿼리 - 해결한 문제 난이도에 따라 score 변경, user_correct_ques에 question_id 추가
  const userUpdate = {
    $inc: { ["user_score." + language]: question.problem_level },
    $push: { user_correct_ques: question_id }, // 문제 중복으로 들어갈 수 있음 -> 매칭 조건 통해서 중복 방지
  };

  const updateUser = await Users.findOneAndUpdate(userFilter, userUpdate, {
    new: true,
  });

  // score에 따른 level 산정
  const score = updateUser.user_score[language];
  const level = scoreToLevel(score);

  // level update 쿼리
  const levelUpdate = {
    $set: { ["user_level." + language]: level },
  };

  const updateLevel = await Users.findOneAndUpdate(userFilter, levelUpdate, {
    new: true,
  });

  // update한 객체 response
  return res.status(200).json(updateLevel);
});

/**
 * 레벨테스트 채점
 * "/leveltest/solve?user_id=3&question_id=3&language_id=52" GET Request
 */

function levelTest(level, score) {
  if (level === 1 && score < 5) return 5;
  else if (level === 2 && score < 10) return 10;
  else if (level === 3 && score < 19) return 19;
  else return score;
}

app.get("/leveltest/solve", async (req, res) => {
  const user_id = req.query.user_id;
  const question_id = req.query.question_id;
  const language_id = req.query.language_id;

  const language = idToLanguage(language_id);

  const questionFilter = { problem_id: question_id };
  const userFilter = { user_id: user_id };

  const question = await Questions.findOne(questionFilter);
  const user = await Users.findOne(userFilter);

  // (1)c, cpp, java, python 외의 languageId (2)존재하지 않는 userId (3)존재하지 않는 questionId 입력 받았을 때 error 발생
  if (!language || !user || !question) {
    return res.status(400).json({
      error:
        "존재하지 않는 userId or 존재하지 않는 questionId or 지원하지 않는 언어",
    });
  }

  const question_level = question.problem_level;
  const non_update_score = user.user_score[language];

  const test_score = levelTest(question_level, non_update_score); //

  const userUpdate = {
    ["user_score." + language]: test_score, //
    $push: { user_correct_ques: question_id },
  };

  const updateUser = await Users.findOneAndUpdate(userFilter, userUpdate, {
    new: true,
  });

  const update_score = updateUser.user_score[language];
  const update_level = scoreToLevel(update_score);

  const levelUpdate = {
    $set: { ["user_level." + language]: update_level },
  };

  const updateLevel = await Users.findOneAndUpdate(userFilter, levelUpdate, {
    new: true,
  });

  return res.status(200).json(updateLevel);
});

app.io.on("connection", (socket) => {
  // 소켓

  socket["nickname"] = "페어"; // 초기 닉네임 설정
  clients.set(socket.id, socket);
  console.log("Matching ....");
  socket.emit("editor_open");

  //기존 방 확인

  socket.on("join_room", (data) => {
  /*  유저두명의 푼문제 제외후 문제가져오기.
  socket.on("join_room", async(data) => {
  
    //밑에코드 주석풀경우 전역, get(/editor)에서 lg, lv, uid(?안지워도되나) 지우기
    let uid = data.user_id;
    let Lg = data.language;
  
    socket[uid] = uid;
    Lv = user.user_level[Lg];
    
  */

    /*
    let user = await Users.findOne({ user_id: uid });
    
    const user_correct_ques = user.user_correct_ques;
    console.log("correct que: ", user.user_correct_ques);
    run();
  
    async function run() {
      result = await Questions.aggregate([
        { $match: { problem_level: parseInt(Lv), problem_id: {$nin: user_correct_ques} } },
        { $sample: { size: num_of_ques } },
      ]);
      console.log("lv: ", Lv);
      console.log("prob_id: ", result[0].problem_id , result[1].problem_id);
    }
    */
  
    



    if (rooms.find((room) => room.level === Lv && room.status === "open" && room.language === Lg)) {
      // 만들어져 있는 방 중에 자기가 안 푼 문제로 만든 방이 있는지

      // 들어가고자 하는 레벨의 방 존재한다면
      const room = rooms.find(
        (room) => room.level === Lv && room.status === "open" && room.language === Lg
      );
      const roomId = room.roomId;

      socket.join(roomId); // 입장
      socket["room"] = roomId;
      // console.log("B 브라우저 소켓:", room);
      socket
        .to(room.roomId)
        .emit(
          "new_message",
          `${socket.nickname}가 입장했습니다. 매칭이 완료되었습니다.`
        ); // 상대 브라우저에 자신이 들어왔다는 것을 알림
      socket.emit("new_message", "매칭이 완료되었습니다."); // 자기 자신에게 알림
      socket.emit("roomIdPass", roomId, console.log("Room 입장 : ", roomId));
      socket.to(roomId).emit("welcome", roomId);

      const roomMembers = socket.adapter.rooms.get(roomId); // 방에 있는 유저 목록
      const pairId = Array.from(roomMembers)[0]; // 같은 Rooms에 있는 상대방 id
      const pair = clients.get(pairId); // pairId를 통해 상대 소켓 가져오기
      
      
      //코드추가필요 두 소켓 유저가 안푼문제를 제외한 문제 찾기
      /*
      let user = await Users.findOne({ user_id: uid });
      let pairuser = await Users.findOne({ user_id: pair[uid] });
      const user_correct_ques = user.user_correct_ques;
      const pairuser_correct_ques = pairuser.user_correct_ques;
      const mix_correct_ques = user_correct_ques.concat(pairuser_correct_ques);

      console.log("correct que: ", mix_correct_ques);
      run();
    
      async function run() {
        result = await Questions.aggregate([
          { $match: { problem_level: parseInt(Lv), problem_id: {$nin: mix_correct_ques} } },
          { $sample: { size: num_of_ques } },
        ]);
        console.log("lv: ", Lv);
        console.log("prob_id: ", result[0].problem_id , result[1].problem_id);
      }
      */
      pair["problems"] = result;
      socket["problems"] = result;
      //socket["problems"] = pair.problems; // 상대의 문제 정보 받아오기 -> 같은 문제를 띄우기 위해 가져옴
      
      //문제보내기
      pair.emit("test", pair.problems);
      socket.emit("test", socket.problems);

      room.usable -= 1;
      if (room.usable === 0) room.status = "close";
    } else {
      rooms.push({
        // Room 생성
        roomId: roomIndex,
        level: Lv, //사용자 숙련도 레벨
        language: Lg, //프로그래밍 언어
        usable: 2, //방 최대인원
        status: "open", // 방 입장 가능 여부
      });

      socket.join(roomIndex);
      socket["room"] = roomIndex; // 해당 브라우저가 들어간 방 ID 저장
      rooms[rooms.length - 1].usable -= 1;
      socket.emit(
        "roomIdPass",
        roomIndex,
        console.log("Room 생성 : ", roomIndex)
      );

      socket.emit("new_message", "페어가 매칭될 때까지 기다려주세요.");

      //socket["problems"] = result;
      //socket.emit("test", socket.problems);

      roomIndex++;
    }
  });
  socket.on("disconnecting", () => {
    const room = rooms.find((room) => room.roomId === socket.room);
    socket
      .to(room.roomId)
      .emit("new_message", `${socket.nickname}가 퇴장했습니다.`);
    if (room.usable === 1) {
      rooms.splice(rooms.indexOf(room), 1);
    } else if (room.usable === 0) {
      room.usable += 1;
      room.status = "open";
    }
  });
  socket.on("disconnect", () => {
    clients.delete(socket.id);
    console.log("접속 끊어짐.");
  });

  socket.on("update", (data) => {
    console.log(data.event, data.delta, data.roomId);

    socket.to(data.roomId).emit("update", data);
  });
  /*
  // 매칭후 문제맞추면 점수 증가 및 푼 문제 데이터베이스에저장
  socket.on("userScoreUpdate", (data) => {
    var user_id = data.user_id;
    var problem_id = data.problem_id;
    var language = data.language;

    console.log(
      "user_id: ",
      user_id,
      "problem_id: ",
      problem_id,
      "language: ",
      language
    );
    //추가코드필요 데이터베이스에서 유저의 점수증가와 푼문제 저장
  });

  // 레벨테스트에서 문제맞추면 레벨 증가 푼 문제 데이터베이스에저장
  socket.on("leveltest", (data) => {
    var user_id = data.user_id;
    var problem_id = data.problem_id;
    var language = data.language;

    console.log(
      "user_id: ",
      user_id,
      "problem_id: ",
      problem_id,
      "language: ",
      language
    );
    //추가코드필요 데이터베이스에서 유저의 레벨증가와 푼문제 저장
  });
  */

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });
  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });
  socket.on("ice", (ice, roomId) => {
    socket.to(roomId).emit("ice", ice);
  });
  socket.on("new_message", (msg, roomId, done) => {
    socket.to(roomId).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
});

module.exports = app;

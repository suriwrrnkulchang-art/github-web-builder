document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =========================================
           SECRET CODES
        ========================================= */

        const SECRET_CODES = {

            code1: "1234",

            code2: "1234",

            code3: "1234",

            code4: "1234"

        };


        const MAX_ATTEMPTS = 13;

        const BAN_TIME =
            40 * 60 * 1000;

        const NEXT_PAGE =
            "./lol/index.htm";


        /* =========================================
           First Authentication
        ========================================= */

        const code1 =
            document.getElementById("code1");

        const code2 =
            document.getElementById("code2");

        const code3 =
            document.getElementById("code3");

        const code4 =
            document.getElementById("code4");


        const verifyButton =
            document.getElementById(
                "verifyButton"
            );


        const messageBox =
            document.getElementById(
                "messageBox"
            );


        const attemptDisplay =
            document.getElementById(
                "attemptDisplay"
            );


        /* =========================================
           Second Authentication
        ========================================= */

        const secondAuth =
            document.getElementById(
                "secondAuth"
            );


        const verifyCode1 =
            document.getElementById(
                "verifyCode1"
            );

        const verifyCode2 =
            document.getElementById(
                "verifyCode2"
            );

        const verifyCode3 =
            document.getElementById(
                "verifyCode3"
            );

        const verifyCode4 =
            document.getElementById(
                "verifyCode4"
            );


        const secondConfirm =
            document.getElementById(
                "secondConfirm"
            );


        const secondCancel =
            document.getElementById(
                "secondCancel"
            );


        const secondMessage =
            document.getElementById(
                "secondMessage"
            );


        /* =========================================
           Ban
        ========================================= */

        const banBox =
            document.getElementById(
                "banBox"
            );


        const banTimer =
            document.getElementById(
                "banTimer"
            );


        let attempts =
            Number(
                localStorage.getItem(
                    "spy_attempts"
                )
            ) || 0;


        let banUntil =
            Number(
                localStorage.getItem(
                    "spy_ban_until"
                )
            ) || 0;


        let banInterval = null;


        /* =========================================
           Attempt Display
        ========================================= */

        function updateAttemptDisplay() {

            attemptDisplay.textContent =
                "ATTEMPTS: "
                + attempts
                + " / "
                + MAX_ATTEMPTS;

        }


        updateAttemptDisplay();


        /* =========================================
           Message
        ========================================= */

        function showMessage(
            text,
            type
        ) {

            messageBox.textContent =
                text;

            messageBox.className =
                "message-box "
                + type;

        }


        /* =========================================
           Clear Second Codes
        ========================================= */

        function clearSecondCodes() {

            verifyCode1.value = "";

            verifyCode2.value = "";

            verifyCode3.value = "";

            verifyCode4.value = "";

        }


        /* =========================================
           Show Second Authentication
        ========================================= */

        function openSecondAuthentication() {

            secondAuth.classList.add(
                "active"
            );


            clearSecondCodes();


            secondMessage.textContent =
                "";

            secondMessage.className =
                "second-message";


            setTimeout(
                function () {

                    verifyCode1.focus();

                },
                100
            );

        }


        /* =========================================
           Close Second Authentication
        ========================================= */

        function closeSecondAuthentication() {

            secondAuth.classList.remove(
                "active"
            );

            clearSecondCodes();

        }


        /* =========================================
           First Verification
        ========================================= */

        verifyButton.addEventListener(
            "click",
            function () {

                if (isBanned()) {

                    activateBan();

                    return;

                }


                const correct =

                    code1.value ===
                    SECRET_CODES.code1

                    &&

                    code2.value ===
                    SECRET_CODES.code2

                    &&

                    code3.value ===
                    SECRET_CODES.code3

                    &&

                    code4.value ===
                    SECRET_CODES.code4;


                if (!correct) {

                    registerWrongAttempt();

                    return;

                }


                /*
                 * ชั้นที่ 1 ผ่าน
                 */

                showMessage(
                    "ชั้นที่ 1 ผ่าน // กรุณายืนยันตัวตนชั้นที่ 2",
                    "success"
                );


                openSecondAuthentication();

            }
        );


        /* =========================================
           Second Verification
        ========================================= */

        secondConfirm.addEventListener(
            "click",
            function () {

                const correct =

                    verifyCode1.value ===
                    SECRET_CODES.code1

                    &&

                    verifyCode2.value ===
                    SECRET_CODES.code2

                    &&

                    verifyCode3.value ===
                    SECRET_CODES.code3

                    &&

                    verifyCode4.value ===
                    SECRET_CODES.code4;


                if (!correct) {

                    attempts++;


                    localStorage.setItem(
                        "spy_attempts",
                        String(attempts)
                    );


                    updateAttemptDisplay();


                    secondMessage.textContent =
                        "รหัสชั้นที่ 2 ไม่ถูกต้อง";

                    secondMessage.className =
                        "second-message error";


                    clearSecondCodes();


                    if (
                        attempts >=
                        MAX_ATTEMPTS
                    ) {

                        banUntil =
                            Date.now()
                            + BAN_TIME;


                        localStorage.setItem(
                            "spy_ban_until",
                            String(banUntil)
                        );


                        closeSecondAuthentication();

                        activateBan();

                    }

                    return;

                }


                /*
                 * =================================
                 * ผ่านทั้ง 2 ชั้น
                 * =================================
                 */

                secondMessage.textContent =
                    "ACCESS GRANTED";

                secondMessage.className =
                    "second-message success";


                secondConfirm.disabled =
                    true;


                setTimeout(
                    function () {

                        window.location.href =
                            NEXT_PAGE;

                    },
                    500
                );

            }
        );


        /* =========================================
           Cancel Second Authentication
        ========================================= */

        secondCancel.addEventListener(
            "click",
            function () {

                closeSecondAuthentication();


                showMessage(
                    "ยกเลิกการยืนยันชั้นที่ 2",
                    "error"
                );

            }
        );


        /* =========================================
           Wrong Attempt
        ========================================= */

        function registerWrongAttempt() {

            attempts++;


            localStorage.setItem(
                "spy_attempts",
                String(attempts)
            );


            updateAttemptDisplay();


            if (
                attempts >=
                MAX_ATTEMPTS
            ) {

                banUntil =
                    Date.now()
                    + BAN_TIME;


                localStorage.setItem(
                    "spy_ban_until",
                    String(banUntil)
                );


                showMessage(
                    "ACCESS DENIED // ระบบถูกล็อก 40 นาที",
                    "error"
                );


                activateBan();

                return;

            }


            const remaining =
                MAX_ATTEMPTS -
                attempts;


            showMessage(
                "รหัสไม่ถูกต้อง // เหลืออีก "
                + remaining
                + " ครั้ง",
                "error"
            );


            code1.value = "";

            code2.value = "";

            code3.value = "";

            code4.value = "";


            code1.focus();

        }


        /* =========================================
           Ban
        ========================================= */

        function isBanned() {

            return (
                banUntil >
                Date.now()
            );

        }


        function activateBan() {

            verifyButton.disabled =
                true;


            code1.disabled =
                true;

            code2.disabled =
                true;

            code3.disabled =
                true;

            code4.disabled =
                true;


            banBox.classList.add(
                "active"
            );


            if (
                banInterval !== null
            ) {

                clearInterval(
                    banInterval
                );

            }


            updateBanTimer();


            banInterval =
                setInterval(
                    updateBanTimer,
                    1000
                );

        }


        function updateBanTimer() {

            const remaining =
                banUntil -
                Date.now();


            if (
                remaining <= 0
            ) {

                clearInterval(
                    banInterval
                );


                banInterval =
                    null;


                localStorage.removeItem(
                    "spy_ban_until"
                );


                localStorage.removeItem(
                    "spy_attempts"
                );


                attempts = 0;

                banUntil = 0;


                verifyButton.disabled =
                    false;


                code1.disabled =
                    false;

                code2.disabled =
                    false;

                code3.disabled =
                    false;

                code4.disabled =
                    false;


                banBox.classList.remove(
                    "active"
                );


                updateAttemptDisplay();


                showMessage(
                    "ระบบปลดล็อกแล้ว",
                    "success"
                );


                return;

            }


            const seconds =
                Math.ceil(
                    remaining / 1000
                );


            const minutes =
                Math.floor(
                    seconds / 60
                );


            const secs =
                seconds % 60;


            banTimer.textContent =

                String(minutes)
                    .padStart(2, "0")

                +

                ":"

                +

                String(secs)
                    .padStart(2, "0");

        }


        /* =========================================
           Enter Key
        ========================================= */

        [
            code1,
            code2,
            code3,
            code4
        ].forEach(
            function (input) {

                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            verifyButton.click();

                        }

                    }
                );

            }
        );


        [
            verifyCode1,
            verifyCode2,
            verifyCode3,
            verifyCode4
        ].forEach(
            function (input) {

                input.addEventListener(
                    "keydown",
                    function (event) {

                        if (
                            event.key ===
                            "Enter"
                        ) {

                            secondConfirm.click();

                        }

                    }
                );

            }
        );


        /* =========================================
           Initial Ban Check
        ========================================= */

        if (isBanned()) {

            activateBan();

        }

    }
);



/* =========================================
   VIDEO SYSTEM
========================================= */

const video =
    document.getElementById("spyVideo");

const playPauseButton =
    document.getElementById(
        "playPauseButton"
    );

const restartButton =
    document.getElementById(
        "restartButton"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const videoTime =
    document.getElementById(
        "videoTime"
    );

const videoStartOverlay =
    document.getElementById(
        "videoStartOverlay"
    );


/*
=========================================
ตัวแปรสำหรับระบบดูจนจบ
=========================================
*/

let maxWatchedTime = 0;

let videoStarted = false;


/*
=========================================
Format เวลา
=========================================
*/

function formatVideoTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {

        return "00:00";

    }


    const minutes =
        Math.floor(seconds / 60);

    const secs =
        Math.floor(seconds % 60);


    return (
        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(secs).padStart(2, "0")
    );

}


/*
=========================================
Metadata โหลดเสร็จ
=========================================
*/

video.addEventListener(
    "loadedmetadata",
    function () {

        /*
         * ตอนนี้ browser รู้ความยาว
         * ของคลิปแล้ว
         */

        videoTime.textContent =
            "00:00 / "
            +
            formatVideoTime(
                video.duration
            );


        progressBar.style.width =
            "0%";

    }
);


/*
=========================================
เวลา Video เดิน
=========================================
*/

video.addEventListener(
    "timeupdate",
    function () {

        /*
         * เก็บตำแหน่งสูงสุดที่เคยดู
         */

        if (
            video.currentTime >
            maxWatchedTime
        ) {

            maxWatchedTime =
                video.currentTime;

        }


        /*
         * คำนวณ Progress
         */

        if (
            Number.isFinite(
                video.duration
            ) &&
            video.duration > 0
        ) {

            const percent =
                (
                    video.currentTime /
                    video.duration
                ) * 100;


            progressBar.style.width =
                percent + "%";

        }


        /*
         * แสดงเวลา
         */

        videoTime.textContent =
            formatVideoTime(
                video.currentTime
            )
            +
            " / "
            +
            formatVideoTime(
                video.duration
            );

    }
);


/*
=========================================
กด Play
=========================================
*/

playPauseButton.addEventListener(
    "click",
    async function () {

        /*
         * ถ้ายังไม่เล่น
         */

        if (
            video.paused
        ) {

            try {

                /*
                 * สำคัญ:
                 *
                 * การ play() เกิดจาก
                 * การคลิกของผู้ใช้
                 *
                 * ดังนั้น browser
                 * สามารถเปิดเสียงได้
                 */

                video.muted = false;

                await video.play();


                videoStarted = true;


                videoStartOverlay.classList.add(
                    "hidden"
                );


                playPauseButton.textContent =
                    "⏸ หยุด";


            }

            catch (error) {

                console.error(
                    "Video play error:",
                    error
                );


                playPauseButton.textContent =
                    "▶ เล่น";

            }

        }

        else {

            /*
             * หยุด
             */

            video.pause();


            playPauseButton.textContent =
                "▶ เล่น";

        }

    }
);


/*
=========================================
Video Play Event
=========================================
*/

video.addEventListener(
    "play",
    function () {

        videoStarted = true;


        videoStartOverlay.classList.add(
            "hidden"
        );


        playPauseButton.textContent =
            "⏸ หยุด";

    }
);


/*
=========================================
Video Pause Event
=========================================
*/

video.addEventListener(
    "pause",
    function () {

        playPauseButton.textContent =
            "▶ เล่น";

    }
);


/*
=========================================
Restart
=========================================
*/

restartButton.addEventListener(
    "click",
    async function () {

        /*
         * กลับไปต้นคลิป
         */

        video.currentTime = 0;


        /*
         * รีเซ็ตตำแหน่งที่เคยดู
         */

        maxWatchedTime = 0;


        /*
         * รีเซ็ต Progress
         */

        progressBar.style.width =
            "0%";


        /*
         * รีเซ็ตเวลา
         */

        videoTime.textContent =
            "00:00 / "
            +
            formatVideoTime(
                video.duration
            );


        /*
         * เล่นใหม่พร้อมเสียง
         */

        video.muted = false;


        try {

            await video.play();


            videoStarted = true;


            videoStartOverlay.classList.add(
                "hidden"
            );


            playPauseButton.textContent =
                "⏸ หยุด";

        }

        catch (error) {

            console.error(
                "Restart error:",
                error
            );

        }

    }
);


/*
=========================================
ป้องกันการ Skip ไปข้างหน้า
=========================================
*/

video.addEventListener(
    "seeking",
    function () {

        /*
         * ยอมให้ย้อนกลับได้
         *
         * แต่ไม่ให้ข้ามไปข้างหน้า
         */

        const allowedTime =
            maxWatchedTime + 0.5;


        if (
            video.currentTime >
            allowedTime
        ) {

            video.currentTime =
                maxWatchedTime;

        }

    }
);


/*
=========================================
Video จบ
=========================================
*/

video.addEventListener(
    "ended",
    function () {

        /*
         * ถือว่าดูจบแล้ว
         */

        maxWatchedTime =
            video.duration;


        progressBar.style.width =
            "100%";


        videoTime.textContent =
            formatVideoTime(
                video.duration
            )
            +
            " / "
            +
            formatVideoTime(
                video.duration
            );


        playPauseButton.textContent =
            "▶ เล่นอีกครั้ง";


        videoStarted = false;

    }
);


/*
=========================================
กด Play จากตัว Video โดยตรง
=========================================

ถ้าผู้ใช้คลิกที่ Video แล้ว browser
เล่นเอง ให้ระบบรู้ว่าเริ่มเล่นแล้ว
*/

video.addEventListener(
    "click",
    async function () {

        if (
            video.paused
        ) {

            try {

                video.muted = false;

                await video.play();

            }

            catch (error) {

                console.error(error);

            }

        }

        else {

            video.pause();

        }

    }
);




const scanButton =
  document.getElementById("scanButton");

const createButton =
  document.getElementById("createButton");

const result =
  document.getElementById("result");

const output =
  document.getElementById("output");

let lastScan = null;

function value(id) {
  return document
    .getElementById(id)
    .value
    .trim();
}

function show(data) {
  result.classList.remove("hidden");

  output.textContent =
    JSON.stringify(data, null, 2);
}

scanButton.addEventListener(
  "click",
  async () => {

    createButton.disabled = true;

    show({
      status: "กำลังตรวจสอบ..."
    });

    try {

      /*
       * installationId ต้องได้มาจาก
       * GitHub App authentication
       *
       * ห้ามให้ user พิมพ์ private token
       */
      const installationId =
        window.githubInstallationId;

      if (!installationId) {
        throw new Error(
          "ยังไม่ได้เชื่อมต่อ GitHub App"
        );
      }

      const response =
        await fetch("/api/scan", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            installationId,

            owner: value("owner"),

            repo: value("repo"),

            branch:
              value("branch") || "main"
          })
        });

      const data =
        await response.json();

      lastScan = data;

      show(data);

      if (data.valid) {
        createButton.disabled = false;
      }

    } catch (error) {

      show({
        error: error.message
      });

    }
  }
);

createButton.addEventListener(
  "click",
  async () => {

    if (!lastScan?.valid) {
      return;
    }

    createButton.disabled = true;

    try {

      const response =
        await fetch("/api/projects", {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            installationId:
              window.githubInstallationId,

            owner:
              value("owner"),

            repo:
              value("repo"),

            branch:
              value("branch") || "main",

            root:
              value("root"),

            name:
              value("name"),

            entrypoint:
              value("entrypoint") ||
              "index.html"
          })
        });

      const data =
        await response.json();

      show({
        success: true,

        message:
          "สร้างเว็บไซต์สำเร็จ",

        project: data
      });

    } catch (error) {

      show({
        error: error.message
      });

    } finally {

      createButton.disabled = false;

    }
  }
);

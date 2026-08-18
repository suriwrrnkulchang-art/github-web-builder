document.addEventListener("DOMContentLoaded", function () {

    console.log("mama.js เริ่มทำงานแล้ว");


    /* =========================================
       ELEMENT
    ========================================= */

    const soundBtn = document.getElementById("soundBtn");
    const joinPopup = document.getElementById("joinPopup");
    const popupContent = document.getElementById("popupContent");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");


    /* =========================================
       ตรวจสอบ HTML
    ========================================= */

    if (!soundBtn) {
        console.error("ไม่พบ #soundBtn");
        return;
    }

    if (!joinPopup) {
        console.error("ไม่พบ #joinPopup");
        return;
    }

    if (!popupContent) {
        console.error("ไม่พบ #popupContent");
        return;
    }

    if (!cancelBtn) {
        console.error("ไม่พบ #cancelBtn");
        return;
    }

    if (!confirmBtn) {
        console.error("ไม่พบ #confirmBtn");
        return;
    }


    /* =========================================
       เสียง
       
       HTML อยู่ใน /html/
       เสียงอยู่ใน /sounds/
       
       ดังนั้น ../sounds/ ถูกต้อง
    ========================================= */

    const clickSound = new Audio(
        "../sounds/u_62htdrvg4y-gun-shot-359196.mp3"
    );

    clickSound.preload = "auto";
    clickSound.volume = 1.0;


    /* =========================================
       ตัวแปร
    ========================================= */

    let timer = null;
    let timeLeft = 10;


    /* =========================================
       เปิด Popup
    ========================================= */

    soundBtn.addEventListener("click", function (event) {

        console.log("กดปุ่มหลักแล้ว");


        /* -----------------------------------------
           เล่นเสียง
        ----------------------------------------- */

        clickSound.pause();
        clickSound.currentTime = 0;

        clickSound.play()
            .then(function () {

                console.log("เสียงกำลังเล่น");

            })
            .catch(function (error) {

                console.error(
                    "เล่นเสียงไม่ได้:",
                    error
                );

            });


        /* -----------------------------------------
           Animation ปุ่ม
        ----------------------------------------- */

        soundBtn.classList.remove("pop-effect");

        void soundBtn.offsetWidth;

        soundBtn.classList.add("pop-effect");


        setTimeout(function () {

            soundBtn.classList.remove("pop-effect");

        }, 250);


        /* -----------------------------------------
           ซ่อนปุ่มหลัก
        ----------------------------------------- */

        soundBtn.style.display = "none";


        /* -----------------------------------------
           เปิด Popup
           
           ใช้ style โดยตรง
           ไม่พึ่ง .show อย่างเดียว
        ----------------------------------------- */

        joinPopup.style.display = "flex";
        joinPopup.classList.add("show");


        /* -----------------------------------------
           ตั้ง Popup กลางจอ
        ----------------------------------------- */

        popupContent.style.left = "50%";
        popupContent.style.top = "50%";
        popupContent.style.transform =
            "translate(-50%, -50%)";


        /* -----------------------------------------
           เริ่ม Countdown
        ----------------------------------------- */

        startCountdown();

    });



    /* =========================================
       COUNTDOWN
    ========================================= */

    function startCountdown() {

        if (timer !== null) {

            clearInterval(timer);
            timer = null;

        }


        timeLeft = 10;

        confirmBtn.disabled = true;

        confirmBtn.textContent = "ตกลง (10)";


        timer = setInterval(function () {

            timeLeft--;


            if (timeLeft > 0) {

                confirmBtn.textContent =
                    "ตกลง (" + timeLeft + ")";

            }


            else {

                clearInterval(timer);

                timer = null;


                confirmBtn.disabled = false;

                confirmBtn.textContent = "ตกลง";


                console.log(
                    "Countdown เสร็จแล้ว"
                );

            }

        }, 1000);

    }



    /* =========================================
       ปุ่มยกเลิก
    ========================================= */

    cancelBtn.addEventListener(
        "click",
        function () {

            console.log("กดยกเลิก");

            closePopup();

        }
    );



    /* =========================================
       ปุ่มตกลง
       
       เปลี่ยนหน้า
    ========================================= */

    confirmBtn.addEventListener(
        "click",
        function () {

            console.log("กดตกลง");


            /* ป้องกันกดก่อนเวลา */

            if (confirmBtn.disabled) {

                console.log(
                    "ยังไม่ครบ 10 วินาที"
                );

                return;

            }


            /* หยุด Timer */

            if (timer !== null) {

                clearInterval(timer);
                timer = null;

            }


            /* -----------------------------------------
               เปลี่ยนหน้า
               
               ไฟล์ปัจจุบัน:
               
               /html/index.html
               
               หน้าเป้าหมาย:
               
               /html2/home.html
               ----------------------------------------- */

            console.log(
                "กำลังไป ../html2/index.html"
            );


            window.location.assign(
                "../html2/index.html"
            );

        }
    );



    /* =========================================
       ปิด Popup
    ========================================= */

    function closePopup() {

        console.log("ปิด Popup");


        /* หยุด Timer */

        if (timer !== null) {

            clearInterval(timer);
            timer = null;

        }


        /* ซ่อน Popup */

        joinPopup.classList.remove("show");

        joinPopup.style.display = "none";


        /* แสดงปุ่มหลัก */

        soundBtn.style.display = "";


        /* Reset */

        timeLeft = 10;

        confirmBtn.disabled = true;

        confirmBtn.textContent = "ตกลง (10)";


        /* Reset Popup */

        popupContent.style.left = "50%";

        popupContent.style.top = "50%";

        popupContent.style.transform =
            "translate(-50%, -50%)";


        popupContent.classList.remove(
            "dragging"
        );

    }



    /* =========================================
       ระบบลาก Popup
    ========================================= */

    let isDragging = false;

    let mouseStartX = 0;
    let mouseStartY = 0;

    let popupStartX = 0;
    let popupStartY = 0;



    popupContent.addEventListener(
        "pointerdown",
        function (event) {


            /* ถ้ากดปุ่ม ไม่ลาก */

            if (
                event.target.closest("button")
            ) {

                return;

            }


            isDragging = true;


            popupContent.classList.add(
                "dragging"
            );


            const rect =
                popupContent.getBoundingClientRect();


            mouseStartX =
                event.clientX;

            mouseStartY =
                event.clientY;


            popupStartX =
                rect.left;

            popupStartY =
                rect.top;


            popupContent.style.left =
                popupStartX + "px";

            popupContent.style.top =
                popupStartY + "px";

            popupContent.style.transform =
                "none";


            try {

                popupContent.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                console.warn(error);

            }

        }
    );



    /* =========================================
       ขณะลาก
    ========================================= */

    popupContent.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }


            const rect =
                popupContent.getBoundingClientRect();


            let newX =
                popupStartX +
                (
                    event.clientX -
                    mouseStartX
                );


            let newY =
                popupStartY +
                (
                    event.clientY -
                    mouseStartY
                );


            const maxX =
                window.innerWidth -
                rect.width;


            const maxY =
                window.innerHeight -
                rect.height;


            newX =
                Math.max(
                    0,
                    Math.min(newX, maxX)
                );


            newY =
                Math.max(
                    0,
                    Math.min(newY, maxY)
                );


            popupContent.style.left =
                newX + "px";

            popupContent.style.top =
                newY + "px";

        }
    );



    /* =========================================
       ปล่อย Popup
    ========================================= */

    popupContent.addEventListener(
        "pointerup",
        function (event) {

            isDragging = false;

            popupContent.classList.remove(
                "dragging"
            );


            try {

                popupContent.releasePointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                /* ไม่ต้องทำอะไร */

            }

        }
    );



    /* =========================================
       กัน Pointer Cancel
    ========================================= */

    popupContent.addEventListener(
        "pointercancel",
        function () {

            isDragging = false;

            popupContent.classList.remove(
                "dragging"
            );

        }
    );


});





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

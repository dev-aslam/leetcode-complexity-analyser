// ==UserScript==
// @name         Complexity Analyser
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Using Gemini API to analyse your code
// @author       Aslam
// @match        https://leetcode.com/problems/*
// @icon         https://raw.githubusercontent.com/dev-aslam/leetcode-complexity-analyser/main/icon.svg
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      http://crypto.stanford.edu/sjcl/sjcl.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
  "use strict";

  //leetcode Analyse UI element
  const span = document.createElement("span");
  span.className = "text-sd-blue-500 bg-clip-text";
  span.style.backgroundImage =
    "linear-gradient(to right, rgb(175, 82, 222), rgb(0, 122, 255))";
  span.style.webkitTextFillColor = "transparent";
  span.style.marginTop = "5px";
  span.innerText = "Analyze Complexity with Gemini";

  let base64Image =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTYgMTYiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQgbWVldCIgc3R5bGU9IndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7IHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMHB4LCAwcHgsIDBweCk7IGNvbnRlbnQtdmlzaWJpbGl0eTogdmlzaWJsZTsiPjxkZWZzPjxjbGlwUGF0aCBpZD0iX19sb3R0aWVfZWxlbWVudF8yIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHg9IjAiIHk9IjAiPjwvcmVjdD48L2NsaXBQYXRoPjxsaW5lYXJHcmFkaWVudCBpZD0iX19sb3R0aWVfZWxlbWVudF82IiBzcHJlYWRNZXRob2Q9InBhZCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIwLjQzMDU2MzkyNjY5Njc3NzM0IiB5MT0iMi41OTI3MDI4NjU2MDA1ODYiIHgyPSIyNC4xNDc0NDk0OTM0MDgyMDMiIHkyPSIxMy4zNTk0NDA4MDM1Mjc4MzIiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9InJnYigxNzUsODIsMjIyKSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0icmdiKDAsMTIyLDI1NSkiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjX19sb3R0aWVfZWxlbWVudF8yKSI+PGcgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwxLjA5OTk5OTkwNDYzMjU2ODQsMS4wOTk5OTk5MDQ2MzI1Njg0KSIgb3BhY2l0eT0iMSI+PHBhdGggZmlsbD0idXJsKCNfX2xvdHRpZV9lbGVtZW50XzYpIiBmaWxsLW9wYWNpdHk9IjEiIGQ9IiBNMy4xNDAwMDAxMDQ5MDQxNzUsNy41MzAwMDAyMDk4MDgzNSBDMy4zMDk5OTk5NDI3Nzk1NDEsNy41MzAwMDAyMDk4MDgzNSAzLjQ2MDAwMDAzODE0Njk3MjcsNy42MTAwMDAxMzM1MTQ0MDQgMy41NDk5OTk5NTIzMTYyODQsNy43NSBDMy41NDk5OTk5NTIzMTYyODQsNy43NSA0LjU1OTk5OTk0Mjc3OTU0MSw5LjIzOTk5OTc3MTExODE2NCA0LjU1OTk5OTk0Mjc3OTU0MSw5LjIzOTk5OTc3MTExODE2NCBDNC41NTk5OTk5NDI3Nzk1NDEsOS4yMzk5OTk3NzExMTgxNjQgNi4wNTAwMDAxOTA3MzQ4NjMsMTAuMjUgNi4wNTAwMDAxOTA3MzQ4NjMsMTAuMjUgQzYuMTkwMDAwMDU3MjIwNDU5LDEwLjM0MDAwMDE1MjU4Nzg5IDYuMjY5OTk5OTgwOTI2NTE0LDEwLjQ4OTk5OTc3MTExODE2NCA2LjI2OTk5OTk4MDkyNjUxNCwxMC42NTk5OTk4NDc0MTIxMSBDNi4yNjk5OTk5ODA5MjY1MTQsMTAuODI5OTk5OTIzNzA2MDU1IDYuMTkwMDAwMDU3MjIwNDU5LDEwLjk4OTk5OTc3MTExODE2NCA2LjA1MDAwMDE5MDczNDg2MywxMS4wNzk5OTk5MjM3MDYwNTUgQzYuMDUwMDAwMTkwNzM0ODYzLDExLjA3OTk5OTkyMzcwNjA1NSA0LjU1OTk5OTk0Mjc3OTU0MSwxMi4wOTAwMDAxNTI1ODc4OSA0LjU1OTk5OTk0Mjc3OTU0MSwxMi4wOTAwMDAxNTI1ODc4OSBDNC41NTk5OTk5NDI3Nzk1NDEsMTIuMDkwMDAwMTUyNTg3ODkgMy41NDk5OTk5NTIzMTYyODQsMTMuNTc5OTk5OTIzNzA2MDU1IDMuNTQ5OTk5OTUyMzE2Mjg0LDEzLjU3OTk5OTkyMzcwNjA1NSBDMy40NjAwMDAwMzgxNDY5NzI3LDEzLjcyMDAwMDI2NzAyODgwOSAzLjMwOTk5OTk0Mjc3OTU0MSwxMy44MDAwMDAxOTA3MzQ4NjMgMy4xNDAwMDAxMDQ5MDQxNzUsMTMuODAwMDAwMTkwNzM0ODYzIEMyLjk3MDAwMDAyODYxMDIyOTUsMTMuODAwMDAwMTkwNzM0ODYzIDIuODA5OTk5OTQyNzc5NTQxLDEzLjcyMDAwMDI2NzAyODgwOSAyLjcyMDAwMDAyODYxMDIyOTUsMTMuNTc5OTk5OTIzNzA2MDU1IEMyLjcyMDAwMDAyODYxMDIyOTUsMTMuNTc5OTk5OTIzNzA2MDU1IDEuNzEwMDAwMDM4MTQ2OTcyNywxMi4wOTAwMDAxNTI1ODc4OSAxLjcxMDAwMDAzODE0Njk3MjcsMTIuMDkwMDAwMTUyNTg3ODkgQzEuNzEwMDAwMDM4MTQ2OTcyNywxMi4wOTAwMDAxNTI1ODc4OSAwLjIxOTk5OTk5ODgwNzkwNzEsMTEuMDc5OTk5OTIzNzA2MDU1IDAuMjE5OTk5OTk4ODA3OTA3MSwxMS4wNzk5OTk5MjM3MDYwNTUgQzAuMDc5OTk5OTk4MjExODYwNjYsMTAuOTg5OTk5NzcxMTE4MTY0IDAsMTAuODI5OTk5OTIzNzA2MDU1IDAsMTAuNjU5OTk5ODQ3NDEyMTEgQzAsMTAuNDg5OTk5NzcxMTE4MTY0IDAuMDc5OTk5OTk4MjExODYwNjYsMTAuMzQwMDAwMTUyNTg3ODkgMC4yMTk5OTk5OTg4MDc5MDcxLDEwLjI1IEMwLjIxOTk5OTk5ODgwNzkwNzEsMTAuMjUgMS43MTAwMDAwMzgxNDY5NzI3LDkuMjM5OTk5NzcxMTE4MTY0IDEuNzEwMDAwMDM4MTQ2OTcyNyw5LjIzOTk5OTc3MTExODE2NCBDMS43MTAwMDAwMzgxNDY5NzI3LDkuMjM5OTk5NzcxMTE4MTY0IDIuNzIwMDAwMDI4NjEwMjI5NSw3Ljc1IDIuNzIwMDAwMDI4NjEwMjI5NSw3Ljc1IEMyLjgwOTk5OTk0Mjc3OTU0MSw3LjYxMDAwMDEzMzUxNDQwNCAyLjk3MDAwMDAyODYxMDIyOTUsNy41MzAwMDAyMDk4MDgzNSAzLjE0MDAwMDEwNDkwNDE3NSw3LjUzMDAwMDIwOTgwODM1IEMzLjE0MDAwMDEwNDkwNDE3NSw3LjUzMDAwMDIwOTgwODM1IDMuMTQwMDAwMTA0OTA0MTc1LDcuNTMwMDAwMjA5ODA4MzUgMy4xNDAwMDAxMDQ5MDQxNzUsNy41MzAwMDAyMDk4MDgzNXogTTguNzc5OTk5NzMyOTcxMTkxLDAgQzguOTg5OTk5NzcxMTE4MTY0LDAgOS4xODAwMDAzMDUxNzU3ODEsMC4xMjk5OTk5OTUyMzE2Mjg0MiA5LjI1LDAuMzMwMDAwMDEzMTEzMDIxODUgQzkuMjUsMC4zMzAwMDAwMTMxMTMwMjE4NSAxMC4zOTAwMDAzNDMzMjI3NTQsMy40MTAwMDAwODU4MzA2ODg1IDEwLjM5MDAwMDM0MzMyMjc1NCwzLjQxMDAwMDA4NTgzMDY4ODUgQzEwLjM5MDAwMDM0MzMyMjc1NCwzLjQxMDAwMDA4NTgzMDY4ODUgMTMuNDcwMDAwMjY3MDI4ODA5LDQuNTUwMDAwMTkwNzM0ODYzIDEzLjQ3MDAwMDI2NzAyODgwOSw0LjU1MDAwMDE5MDczNDg2MyBDMTMuNjcwMDAwMDc2MjkzOTQ1LDQuNjE5OTk5ODg1NTU5MDgyIDEzLjgwMDAwMDE5MDczNDg2Myw0LjgwOTk5OTk0Mjc3OTU0MSAxMy44MDAwMDAxOTA3MzQ4NjMsNS4wMTk5OTk5ODA5MjY1MTQgQzEzLjgwMDAwMDE5MDczNDg2Myw1LjIzMDAwMDAxOTA3MzQ4NiAxMy42NzAwMDAwNzYyOTM5NDUsNS40MjAwMDAwNzYyOTM5NDUgMTMuNDcwMDAwMjY3MDI4ODA5LDUuNDg5OTk5NzcxMTE4MTY0IEMxMy40NzAwMDAyNjcwMjg4MDksNS40ODk5OTk3NzExMTgxNjQgMTAuMzkwMDAwMzQzMzIyNzU0LDYuNjMwMDAwMTE0NDQwOTE4IDEwLjM5MDAwMDM0MzMyMjc1NCw2LjYzMDAwMDExNDQ0MDkxOCBDMTAuMzkwMDAwMzQzMzIyNzU0LDYuNjMwMDAwMTE0NDQwOTE4IDkuMjUsOS43MTAwMDAwMzgxNDY5NzMgOS4yNSw5LjcxMDAwMDAzODE0Njk3MyBDOS4xODAwMDAzMDUxNzU3ODEsOS45MDk5OTk4NDc0MTIxMSA4Ljk4OTk5OTc3MTExODE2NCwxMC4wMzk5OTk5NjE4NTMwMjcgOC43Nzk5OTk3MzI5NzExOTEsMTAuMDM5OTk5OTYxODUzMDI3IEM4LjU2OTk5OTY5NDgyNDIxOSwxMC4wMzk5OTk5NjE4NTMwMjcgOC4zODAwMDAxMTQ0NDA5MTgsOS45MDk5OTk4NDc0MTIxMSA4LjMxMDAwMDQxOTYxNjcsOS43MTAwMDAwMzgxNDY5NzMgQzguMzEwMDAwNDE5NjE2Nyw5LjcxMDAwMDAzODE0Njk3MyA3LjE3MDAwMDA3NjI5Mzk0NSw2LjYzMDAwMDExNDQ0MDkxOCA3LjE3MDAwMDA3NjI5Mzk0NSw2LjYzMDAwMDExNDQ0MDkxOCBDNy4xNzAwMDAwNzYyOTM5NDUsNi42MzAwMDAxMTQ0NDA5MTggNC4wOTAwMDAxNTI1ODc4OTEsNS40ODk5OTk3NzExMTgxNjQgNC4wOTAwMDAxNTI1ODc4OTEsNS40ODk5OTk3NzExMTgxNjQgQzMuODkwMDAwMTA0OTA0MTc1LDUuNDIwMDAwMDc2MjkzOTQ1IDMuNzU5OTk5OTkwNDYzMjU3LDUuMjMwMDAwMDE5MDczNDg2IDMuNzU5OTk5OTkwNDYzMjU3LDUuMDE5OTk5OTgwOTI2NTE0IEMzLjc1OTk5OTk5MDQ2MzI1Nyw0LjgwOTk5OTk0Mjc3OTU0MSAzLjg5MDAwMDEwNDkwNDE3NSw0LjYxOTk5OTg4NTU1OTA4MiA0LjA5MDAwMDE1MjU4Nzg5MSw0LjU1MDAwMDE5MDczNDg2MyBDNC4wOTAwMDAxNTI1ODc4OTEsNC41NTAwMDAxOTA3MzQ4NjMgNy4xNzAwMDAwNzYyOTM5NDUsMy40MTAwMDAwODU4MzA2ODg1IDcuMTcwMDAwMDc2MjkzOTQ1LDMuNDEwMDAwMDg1ODMwNjg4NSBDNy4xNzAwMDAwNzYyOTM5NDUsMy40MTAwMDAwODU4MzA2ODg1IDguMzEwMDAwNDE5NjE2NywwLjMzMDAwMDAxMzExMzAyMTg1IDguMzEwMDAwNDE5NjE2NywwLjMzMDAwMDAxMzExMzAyMTg1IEM4LjM4MDAwMDExNDQ0MDkxOCwwLjEyOTk5OTk5NTIzMTYyODQyIDguNTY5OTk5Njk0ODI0MjE5LDAgOC43Nzk5OTk3MzI5NzExOTEsMCBDOC43Nzk5OTk3MzI5NzExOTEsMCA4Ljc3OTk5OTczMjk3MTE5MSwwIDguNzc5OTk5NzMyOTcxMTkxLDB6Ij48L3BhdGg+PC9nPjwvZz48L3N2Zz4=";
  let img = document.createElement("img");
  img.src = base64Image;

  let div = document.createElement("div");
  div.className = "mt-1 flex w-fit gap-1 bg-clip-text text-xs opacity-100";

  div.appendChild(img);
  div.appendChild(span);

  let code = "";

  function analyzeOnClick() {
    let codeElement = document.querySelectorAll("pre code");
    code = codeElement[0].innerText;
    console.log(code);
    fetchData();
  }

  let checkInterval;

  function checkForElement() {
    let elements = document.getElementsByClassName(
      "rounded-sd group flex min-w-[275px] flex-1 cursor-pointer flex-col px-4 py-3 text-xs transition hover:opacity-100 bg-sd-accent"
    );
    if (elements.length > 0) {
      elements[0].append(div);
      div.addEventListener("click", analyzeOnClick);
      clearInterval(checkInterval);
    }
  }
  const pattern = /^\/problems\/[a-z0-9-]+\/submissions\/\d+\/$/;

  function isMatchingURL(url) {
    return pattern.test(url);
  }

  window.navigation.addEventListener("navigate", (event) => {
    const location = window.location.pathname;
    console.log(location);
    if (isMatchingURL(location)) {
      console.log("Matched URL:", window.location.href);
      checkInterval = setInterval(checkForElement, 200);
    }
  });

  //Saving API and encryption Key
  let encKey = GM_getValue("encKey", "");
  let apiKey = GM_getValue("apiKey", "");
  if (!encKey) {
    encKey = prompt(
      "Encryption key not set for " +
        location.hostname +
        ". Please enter a random string:",
      ""
    );
    GM_setValue("encKey", encKey);
    apiKey = "";
  }
  apiKey = decodeOrPrompt(apiKey, "Gemini API Key", "apiKey");

  function decodeOrPrompt(targVar, userPrompt, setValVarName) {
    if (targVar) {
      targVar = unStoreAndDecrypt(targVar);
    } else {
      targVar = prompt(
        userPrompt +
          " not set for " +
          location.hostname +
          ". Please enter it now:",
        ""
      );
      GM_setValue(setValVarName, encryptAndStore(targVar));
    }
    return targVar;
  }

  function encryptAndStore(clearText) {
    return JSON.stringify(sjcl.encrypt(encKey, clearText));
  }

  function unStoreAndDecrypt(jsonObj) {
    return sjcl.decrypt(encKey, JSON.parse(jsonObj));
  }
  //Tampermonkey Menu Element
  GM_registerMenuCommand("Change ApiKey", changeAPI);

  function changeAPI() {
    promptAndChangeStoredValue(apiKey, "Gemini API Key", "apiKey");
  }

  function promptAndChangeStoredValue(targVar, userPrompt, setValVarName) {
    targVar = prompt(
      "Change " + userPrompt + " for " + location.hostname + ":",
      targVar
    );
    GM_setValue(setValVarName, encryptAndStore(targVar));
  }

  // Request to Gemini API
  const url =
    "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

  const fetchData = () => {
    showSpinner();
    const data = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Identify the time complexity and space complexity of the given code. The result should be in this format:
  
                Time Complexity: Time Complexity without description
                Space Complexity: Space Complexity without description
  
                Description: 
                description breifly explain about the calculated time complexity and the discription should be strictly under 100 words.   ${code}`,
            },
          ],
        },
      ],
    };

    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      data: JSON.stringify(data),
      onload: function (response) {
        hideSpinner();
        if (response.status == 200) {
          const data = JSON.parse(response.responseText);
          const textContent = data.candidates[0].content.parts[0].text;
          console.log(textContent);
          modalOpen(textContent);
        } else {
          hideSpinner();
          console.error("Error:", response.status, response.responseText);
          window.alert(response.responseText);
        }
      },
    });
  };

  // Spinner functions
  const showSpinner = () => {
    spinner.style.display = "block";
    overlay.style.display = "block";
  };

  const hideSpinner = () => {
    spinner.style.display = "none";
  };

  //Modal creation and functions
  const modalOpen = (result) => {
    modal.style.display = "grid";
    overlay.style.display = "block";
    modalBody.innerHTML = result
      .replace("Time Complexity:", "<strong>Time Complexity :</strong>")
      .replace("Space Complexity:", "<br/><strong>Space Complexity:</strong>")
      .replace("Description:", "<br/><br/><strong>Description:</strong>")
      .replaceAll("**", "");
  };

  const modalClose = () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  };

  //overlay stuff
  let overlay = document.createElement("div");
  overlay.setAttribute(
    "class",
    "bg-sd-background/80 z-modal fixed inset-0 backdrop-blur-sm"
  );
  overlay.setAttribute("style", "pointer-events: auto; display: none;");

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      modalClose();
    }
  });

  //modal stuff
  let modal = document.createElement("div");
  modal.setAttribute(
    "style",
    "pointer-events: auto; display: none; z-index:999;"
  );
  modal.setAttribute(
    "class",
    "bg-sd-card text-sd-card-foreground rounded-sd-lg sd-md:w-full border-sd-border z-modal fixed grid max-h-[90vh] w-full max-w-lg gap-4 overflow-y-auto border p-4 shadow-lg duration-200 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] animate-duration-200 "
  );

  //Modal Head
  let modalHeading = document.createElement("h2");
  modalHeading.setAttribute("class", "text-xl font-semibold tracking-tight");
  modalHeading.innerText = "Complexity Analyzer";

  let modalCloseBtn = document.createElement("div");
  modalCloseBtn.innerText = "x";
  modalCloseBtn.setAttribute(
    "style",
    "color:#aaa; font-size:22px; font-weight:600; cursor:pointer;"
  );
  modalCloseBtn.addEventListener("click", modalClose);

  let modalHeadContainer = document.createElement("h2");
  modalHeadContainer.setAttribute(
    "style",
    "display:flex; justify-content:space-between; align-items:center;"
  );
  modalHeadContainer.appendChild(modalHeading);
  modalHeadContainer.appendChild(modalCloseBtn);
  modal.appendChild(modalHeadContainer);

  //Modal Body
  let modalBody = document.createElement("div");
  modalBody.setAttribute(
    "style",
    "padding: 10px; font-family: Arial, sans-serif; line-height: 1.6; font-size:16px"
  );
  modal.appendChild(modalBody);

  // Spinner
  let spinner = document.createElement("div");
  spinner.setAttribute(
    "style",
    "display: none; position: fixed; z-index: 1000; top: 50%; left: 50%; transform: translate(-50%, -50%);"
  );
  spinner.innerHTML = `
        <div class="i"><div></div><div></div></div>
        <style>
            .i {
                display: inline-block;
                position: relative;
                width: 80px;
                height: 80px;
            }
            .i div {
                position: absolute;
                border: 4px solid #fff;
                opacity: 1;
                border-radius: 50%;
                animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
            }
            .i div:nth-child(2) {
                animation-delay: -0.5s;
            }
            @keyframes lds-ripple {
                0% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 0;
                }
                4.9% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 0;
                }
                5% {
                    top: 36px;
                    left: 36px;
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    top: 0px;
                    left: 0px;
                    width: 72px;
                    height: 72px;
                    opacity: 0;
                }
            }
        </style>
    `;

  overlay.appendChild(spinner);
  document.body.appendChild(modal);
  document.body.appendChild(overlay);
})();

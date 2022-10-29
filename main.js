let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownelement = document.querySelector(".countdown");

// set options
let currentIndex = 0;
let rightAnswer = 0;
let countdownInterval;

function getQuestion() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      //   console.log(this.responseText);
      let questuionsObject = JSON.parse(this.responseText);
      //   console.log(questuionsObject);
      let qCount = questuionsObject.length;
      //   console.log(questionsCount);
      // create bullets +set question count
      createBullets(qCount);
      // add question data
      addQuestionsData(questuionsObject[currentIndex], qCount);
      // click on submit
      // start countdown
      countdown(5, qCount);
      submitButton.onclick = () => {
        let theRightAnswer = questuionsObject[currentIndex].right_answer;
        // console.log(theRightAnswer);
        currentIndex++;
        // check the answer
        checkAnswer(theRightAnswer, qCount);
        // remove previos question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        // add question data
        addQuestionsData(questuionsObject[currentIndex], qCount);
        // handel bullets class
        handelBullets();
        // start countdown
        clearInterval(countdownInterval);
        countdown(5, qCount);
        // show result
        showResults(qCount);
      };
    }
  };
  myRequest.open("Get", "html_Questions.json", true);
  myRequest.send();
}
getQuestion();

function createBullets(num) {
  countSpan.innerHTML = num;
  // create span
  for (let i = 0; i < num; i++) {
    // create span
    let theBullets = document.createElement("span");
    // check if its first span
    if (i === 0) {
      theBullets.className = "on";
    }
    // append bullets to main bullets container
    bulletsSpanContainer.appendChild(theBullets);
  }
}
function addQuestionsData(obj, count) {
  if (currentIndex < count) {
    //   console.log(obj);
    //   console.log(count);

    // create h2 question title
    let questiontitle = document.createElement("h2");
    // create   question text
    let questionText = document.createTextNode(obj["title"]);
    questiontitle.appendChild(questionText);
    //append the h2 to the quiz area
    quizArea.appendChild(questiontitle);
    // create the answers
    for (let i = 1; i <= 4; i++) {
      // create main answer div
      let mainDiv = document.createElement("div");
      mainDiv.className = "answer";

      let radioInput = document.createElement("input");
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];
      // make first option selected
      if (i === 1) {
        radioInput.checked = true;
      }
      //create label
      let theLabel = document.createElement("label");
      // add for Attribute
      theLabel.htmlFor = `answer_${i}`;
      // create label text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      theLabel.appendChild(theLabelText);
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      answerArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  //   console.log(rAnswer);
  //   console.log(count);
  let answers = document.getElementsByName("question");
  // new // radioInput.name = "question";
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  //   console.log(rAnswer);
  //   console.log(theChoosenAnswer);
  if (theChoosenAnswer === rAnswer) {
    rightAnswer++;
    console.log("good");
  }
}

function handelBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpan = Array.from(bulletsSpan);
  arrayOfSpan.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}
function showResults(count) {
  let theResult;
  if (currentIndex === count) {
    // console.log("finished");
    quizArea.remove();
    answerArea.remove();
    submitButton.remove();
    bullets.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResult = `<span class=good>good </span>,${rightAnswer} from ${count}  is good`;
    } else if (rightAnswer === count) {
      theResult = `<span class=perfect> perfect </span>,All answers is perfect `;
    } else {
      theResult = `<span class=bad> bad </span>,${rightAnswer} from ${count}  is bad `;
    }
    resultsContainer.innerHTML = theResult;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundcolor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      // if
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countdownelement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButton.click();
        // console.log("finished");
      }
    }, 1000);
  }
}

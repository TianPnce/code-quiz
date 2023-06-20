var questions = [
  "What pokemon has water cannons?",
  "Who is gen 4 leaf starter pokemon?",
  "What type of Pokemon is Squirtle?",
  "Who was Ash's starter Pokemon?",
  "Who does Charmander evolve into?",
  "Which of the following is a Poison type?"];
var options = [
  [3, "Pikachu", "Eevee", "Blastois", "Squirtle"],
  [2, "Balbasaur", "Turtwig", "Treecko", "Snivy"],
  [2, "Fire", "Water", "Flying", "Leaf"],
  [1, "Pikachu", "Charmander", "Pichu", "Psyduck"],
  [4, "Charmander", "Ekans", "Jigglypuff", "Charmeloen"],
  [3, "Lapras", "Dragonite", "Ekans", "Snorlax"]];
var highScores = []

var startBtn = document.querySelector("#start");
var replayBtn = document.querySelector("#replay");
var timer = document.querySelector("#timer");
var infoField = document.querySelector("#info");
var optionsField = document.querySelector("#options");
var assessment = document.querySelector("#assessment");
var scoreLink = document.querySelector("#scores-link");
var playScreen = document.querySelector(".play");
var timeLeft
var gameTimer
var place = 0
var score = 0
var outcome
var pause = false;

function startTimer() {
  timeLeft = 100
  timer.textContent = timeLeft + " seconds left";
  gameTimer = setInterval(function(){
      timeLeft--
      timer.textContent = timeLeft + " seconds left";
      if(timeLeft<=0) {
        timesUp();
      }
  },1000)
}

function timesUp() {
  clearInterval(gameTimer)
  timer.textContent = "Time's Up!";
  outcome = "loss";
  endGame();
}

function retrieveScores() {
  var storedScores = JSON.parse(localStorage.getItem("scores"));
  if (storedScores !== null) {
      highScores = storedScores;
  }
}

function renderScores() {
  var scoreList = document.querySelector(".play table");
  highScores.sort((a,b) => b[1] - a[1])
  scoreList.innerHTML=""
  infoField.setAttribute("style","display:none")
  startBtn.removeAttribute("style");
  while(document.querySelector(".play .hide")) {
      var hide = document.querySelector(".hide")
      playScreen.removeChild(hide)
  }

  for (i=0;i<highScores.length;i++) {
      var tr = document.createElement("tr")
      var td1 = document.createElement("td")
      var td2 = document.createElement("td")
      tr.setAttribute("class","hide")
      td1.textContent=highScores[i][0]
      td1.setAttribute("class","hide")
      td2.textContent=highScores[i][1]
      td2.setAttribute("class","hide")
      tr.appendChild(td1)
      tr.appendChild(td2)
      scoreList.appendChild(tr)
  }
}

function storeScores() {
  highScores.sort((a,b) => b[1] - a[1])
  localStorage.setItem("scores",JSON.stringify(highScores))
}

function renderQs() {
  optionsField.innerHTML=""
  infoField.removeAttribute("style");
  startBtn.setAttribute("style","display:none");
  if (place >= questions.length) {
      outcome = "win";
      endGame();
  } else {
      infoField.textContent = questions[place]
      for (i=1;i<options[place].length;i++) {
          var li = document.createElement("li")
          li.textContent=options[place][i];
          li.dataset.index=i;
          optionsField.appendChild(li)
      }
      pause = false;
  }
}

function endGame() {
  clearInterval(gameTimer)
  place = 0;
  if (outcome === "loss") {
      startBtn.textContent="Try Again!";
      startBtn.removeAttribute("style");
      optionsField.innerHTML="";
      infoField.textContent = "You Lose!"
  } else {
      infoField.textContent="You Win!"
      timer.textContent = "Thanks for playing!"
      score = timeLeft
      var scoreInfo = document.createElement("h3")
      scoreInfo.setAttribute("class","hide")
      scoreInfo.textContent = "Your score is: " + score;
      playScreen.appendChild(scoreInfo);

      var instruct = document.createElement("p")
      instruct.setAttribute("class","hide")
      instruct.textContent = "Enter your initials to save your score!"
      playScreen.appendChild(instruct);

      var scoreForm = document.createElement("form");
      scoreForm.setAttribute("class","hide")

      var textbox = document.createElement("input");
      textbox.setAttribute("type","text")
      textbox.setAttribute("placeholder","Enter your intials!")
      textbox.setAttribute("minlength","1")
      textbox.setAttribute("maxlength","3")

      var submit = document.createElement("input");
      submit.setAttribute("type","submit")
      submit.setAttribute("value","Submit")
      submit.setAttribute("class","submitBtn")
      scoreForm.appendChild(textbox);
      scoreForm.appendChild(submit);
      playScreen.appendChild(scoreForm);        
  }
}

document.addEventListener("submit",function(event){
  event.preventDefault();
  event.target.matches("form")
  retrieveScores();
  var initialsInput = document.querySelector("form input");
  var initials = initialsInput.value.trim();
  initials = initials.toUpperCase();
  if (initials === "") {
      return;
  }
  var newScore = []
  newScore.push(initials);
  newScore.push(score);
  highScores.push(newScore)
  storeScores();
  renderScores();
  startBtn.textContent="Play Again"
})

optionsField.addEventListener("click",function(event){
  if (pause) {
      return;
  }
  var answer = event.target;
  var answerIndex = answer.getAttribute("data-index");
  var correct = options[place][0]
  if (answer.matches("li")) {
    if (answerIndex==correct) {
       answer.setAttribute("class","correct");
      } else {
        answer.setAttribute("class","wrong");
        assessment.textContent="Correct answer was: " + options[place][correct]
        timeLeft -= 10
        if(timeLeft<=0) {
          timesUp();
          return;
        } else {
          timer.textContent = timeLeft + " seconds left";
        }
      }
      pause = true;
      setTimeout(function(){
        assessment.textContent = ""
        place++;
        renderQs();
      },1000);
  }
})

scoreLink.addEventListener("click",function(){
  clearInterval(gameTimer);
  place=0
  timer.textContent = "Press the start button to begin!";
  assessment.textContent="";
  optionsField.innerHTML="";
  retrieveScores();
  renderScores();
})

startBtn.addEventListener("click", function() {
  for (i=0;i<highScores.length;i++) {
    var hide = document.querySelector(".hide")
    var table = document.querySelector(".play table")
    table.removeChild(hide)
  }
  assessment.textContent=""
  startTimer();
  renderQs();
})
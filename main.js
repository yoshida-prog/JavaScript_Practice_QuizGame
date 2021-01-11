const API_URL = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
const START_BUTTON = document.getElementById('startBtn');
const ANSWER_BUTTON_CONTAINER = document.getElementById('answerBtnContainer');
const TOP_MESSAGE = document.getElementById('topMessage');
const QUIZ = document.getElementById('quiz');
const Q_STATE_BOX = document.getElementById('questionStateBox');

let i = 0;
let quizNum = 1;
let correct_count = 0;

const answer_button_create = (len, quizAnswerData, i, quizData) => {
  if(i === 0){
    const newh2_for_genre = document.createElement('h2');
    const newh2_for_difficulty = document.createElement('h2');
    newh2_for_genre.id = 'genre';
    newh2_for_difficulty.id = 'difficulty';
    newh2_for_genre.textContent = '[ジャンル]' + quizData.category;
    newh2_for_difficulty.textContent = '[難易度]' + quizData.difficulty;
    Q_STATE_BOX.appendChild(newh2_for_genre);
    Q_STATE_BOX.appendChild(newh2_for_difficulty);
  }else{
    QUIZ.textContent = quizData.question;
    document.getElementById('genre').textContent = '[ジャンル]' + quizData.category;
    document.getElementById('difficulty').textContent = '[難易度]' + quizData.difficulty;
  }
  for(let x = 0; x < len; x++){
    if(i === 0){
      const newP = document.createElement('p');
      const newBtn = document.createElement('button');
      newBtn.classList.add('answerBtn');
      newBtn.value = x;
      newBtn.textContent = quizAnswerData[x];
      newP.appendChild(newBtn);
      ANSWER_BUTTON_CONTAINER.appendChild(newP);
    }else{
      document.getElementsByClassName('answerBtn')[x].textContent = quizAnswerData[x];
    }
  }
};

START_BUTTON.addEventListener('click', () => {
  const awaitForClick = (quizData) => {
    return new Promise((resolve, reject) => {
      if(i < 9){
        i++;
        resolve(quizData[i]);
      }else{
        reject('終わり');
      }
    });
  };

  START_BUTTON.style.display =  'none';
  TOP_MESSAGE.textContent = '処理中';
  QUIZ.textContent = '少々お待ちください';

  fetch(API_URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const quiz_data = data.results;
      let answersData = [];
      let data_length = quiz_data[0].incorrect_answers.length + 1;
      for(let num = 0; num < data_length-1; num++){
        answersData.push(quiz_data[0].incorrect_answers[num]);
      }
      answersData.push(quiz_data[0].correct_answer);
      let ANSWERS_LENGTH = answersData.length;
      for (j = answersData.length; 1 < j; j--) {
        k = Math.floor(Math.random() * j);
        [answersData[k], answersData[j - 1]] = [answersData[j - 1], answersData[k]];
      }
      TOP_MESSAGE.textContent = '問題' + quizNum;
      QUIZ.textContent = quiz_data[0].question;
      answer_button_create(ANSWERS_LENGTH, answersData, i, quiz_data[0]);
      const ANSWER_BUTTON = document.getElementsByClassName('answerBtn');

      for(let a = 0; a < ANSWER_BUTTON.length; a++){
        ANSWER_BUTTON[a].addEventListener('click', (event) => {
          event.target.textContent === quiz_data[i].correct_answer ? correct_count++ : false;
          awaitForClick(quiz_data).then((value) => {
            quizNum++;
            TOP_MESSAGE.textContent = '問題' + quizNum;
            data_length = quiz_data[i].incorrect_answers.length + 1;
            answersData = [];
            for(let num = 0; num < data_length-1; num++){
              answersData.push(quiz_data[i].incorrect_answers[num]);
            }
            answersData.push(quiz_data[i].correct_answer);
            let ANSWERS_LENGTH = answersData.length;
            for (j = answersData.length; 1 < j; j--) {
              k = Math.floor(Math.random() * j);
              [answersData[k], answersData[j - 1]] = [answersData[j - 1], answersData[k]];
            }
            answer_button_create(ANSWERS_LENGTH, answersData, i, quiz_data[i]);
          }).catch(end => {
            TOP_MESSAGE.textContent = 'あなたの正解数は' + correct_count + 'です！！';
            document.getElementById('genre').remove();
            document.getElementById('difficulty').remove();
            QUIZ.textContent = 'もう一度挑戦する場合は下のボタンをクリック！';
            const parent = document.getElementById('answerBtnContainer');
            while(parent.firstChild){
              parent.removeChild(parent.firstChild);
            }
            const newBtn_for_restart = document.createElement('button');
            newBtn_for_restart.textContent = '再チャレンジ';
            newBtn_for_restart.id = 'restartBtn';
            ANSWER_BUTTON_CONTAINER.appendChild(newBtn_for_restart);
            const RESTART = document.getElementById('restartBtn');
            RESTART.addEventListener('click', () => {
              window.location.reload(true);
            })
          });
        });
      }
    })
})

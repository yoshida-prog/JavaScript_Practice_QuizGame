const API_URL = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple';
const startButton = document.getElementById('startBtn');
const answerBtnContainer = document.getElementById('answerBtnContainer');
const topMessage = document.getElementById('topMessage');
const quiz = document.getElementById('quiz');
const quizStateBox = document.getElementById('questionStateBox');

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
    quizStateBox.appendChild(newh2_for_genre);
    quizStateBox.appendChild(newh2_for_difficulty);
  }else{
    quiz.textContent = quizData.question;
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
      answerBtnContainer.appendChild(newP);
    }else{
      document.getElementsByClassName('answerBtn')[x].textContent = quizAnswerData[x];
    }
  }
};

startButton.addEventListener('click', () => {
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

  startButton.style.display =  'none';
  topMessage.textContent = '処理中';
  quiz.textContent = '少々お待ちください';

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
      let answersLength = answersData.length;
      for (j = answersData.length; 1 < j; j--) {
        k = Math.floor(Math.random() * j);
        [answersData[k], answersData[j - 1]] = [answersData[j - 1], answersData[k]];
      }
      topMessage.textContent = '問題' + quizNum;
      quiz.textContent = quiz_data[0].question;
      answer_button_create(answersLength, answersData, i, quiz_data[0]);
      const answer_button = document.getElementsByClassName('answerBtn');

      for(let a = 0; a < answer_button.length; a++){
        answer_button[a].addEventListener('click', (event) => {
          event.target.textContent === quiz_data[i].correct_answer ? correct_count++ : false;
          awaitForClick(quiz_data).then((value) => {
            quizNum++;
            topMessage.textContent = '問題' + quizNum;
            data_length = quiz_data[i].incorrect_answers.length + 1;
            answersData = [];
            for(let num = 0; num < data_length-1; num++){
              answersData.push(quiz_data[i].incorrect_answers[num]);
            }
            answersData.push(quiz_data[i].correct_answer);
            let answersLength = answersData.length;
            for (j = answersData.length; 1 < j; j--) {
              k = Math.floor(Math.random() * j);
              [answersData[k], answersData[j - 1]] = [answersData[j - 1], answersData[k]];
            }
            answer_button_create(answersLength, answersData, i, quiz_data[i]);
          }).catch(end => {
            topMessage.textContent = 'あなたの正解数は' + correct_count + 'です！！';
            document.getElementById('genre').remove();
            document.getElementById('difficulty').remove();
            quiz.textContent = 'もう一度挑戦する場合は下のボタンをクリック！';
            const parent = document.getElementById('answerBtnContainer');
            while(parent.firstChild){
              parent.removeChild(parent.firstChild);
            }
            const newBtn_for_restart = document.createElement('button');
            newBtn_for_restart.textContent = '再チャレンジ';
            newBtn_for_restart.id = 'restartBtn';
            answerBtnContainer.appendChild(newBtn_for_restart);
            const restart = document.getElementById('restartBtn');
            restart.addEventListener('click', () => {
              window.location.reload(true);
            })
          });
        });
      }
    })
})

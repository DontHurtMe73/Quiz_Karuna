let answers = {
   2: null,
   3: null,
   4: null,
   5: null,
   6: null,
   7: null,
   8: null,
   9: null
}

let btnNext = document.querySelectorAll('.button');
let answersBlock = document.querySelectorAll('.answers__wrapper');

//слушатель кнопки
btnNext.forEach((button) => {
   button.addEventListener('click', function () {
      let thisCard = this.closest('[data-card]');
      let thisCardNumber = parseInt(thisCard.dataset.card);

      if (thisCard.dataset.validate == 'novalidate') {
         navigate(thisCard)
      } else {
         //Cохраняем данные в объект
         saveAnswer(thisCardNumber, gatherCardData(thisCardNumber));

         //проверка на заполненность
         if (isFilled(thisCardNumber)) {
            if(answers[9] === 0 || answers[9] === 1){
               renderResult()
            }
            navigate(thisCard)
         }
      }
   })
})

//Подсветка рамки у ответов
answersBlock.forEach(function (item) {
   item.addEventListener('click', function (event) {
      let label = event.target.closest('label');
      let thisCard = item.closest('[data-card]');
      let thisCardNumber = parseInt(thisCard.dataset.card);

      if (label) {
         //Отменяем активный класс у всех тегов label и активируем кнопку
         label
            .closest('.answers__wrapper')
            .querySelectorAll('label')
            .forEach(function (item) {
               item.classList.remove('answer__wrong');
               item.classList.remove('answer__right');
               disableBtn(thisCardNumber);
            })
         
         //Добавляем активный класс к label по которому был клик
         if (label.getAttribute('data-right')) {
            label.classList.add('answer__right');
         } else {
            label.classList.add('answer__wrong');
            showRightAnswer(thisCardNumber)
         }
      }
   })
})

//функция переключения карточки
function navigate(thisCard) {
   let thisCardNumber = parseInt(thisCard.dataset.card);
   let nextCard = thisCardNumber + 1;

   thisCard.classList.add("hidden");
   document.querySelector(`[data-card="${nextCard}"]`).classList.remove('hidden');
}

//Функция сбора заполненных данных с карточки
function gatherCardData(number) {
   let result = [];

   //Находим карточку по номеру и data-атрибуту
   let curentCard = document.querySelector(`[data-card="${number}"]`);

   //Находим все заполенные значения из радио кнопок
   let radioValues = curentCard.querySelectorAll('[type="radio"]');
   radioValues.forEach(function (item) {
      if (item.checked && item.classList.contains('right')) {
         result.push(1)
      }else{
         result.push(0)
      }
   })

   result = result.reduce((function(a, b) {
      return a + b;
    }))

   return result;
}

//Функция дизейбла кнопки
function disableBtn(number){
   let curentCard = document.querySelector(`[data-card="${number}"]`);
   let thisCardBtn = curentCard.querySelector('.button')

   thisCardBtn.removeAttribute('disabled');
}

//функция подсветки правильного ответа
function showRightAnswer(number){
   let curentCard = document.querySelector(`[data-card="${number}"]`);
   let thisRightAnswer = curentCard.querySelector('.right__label');

   thisRightAnswer.classList.add('answer__right');
}

//Функция записи с ответами в объект с ответами
function saveAnswer(number, data) {
   answers[number] = data;
}

//Функция проверки на заполненность
function isFilled(number) {
   if (answers[number] === 0 || answers[number] === 1) {
      return true;
   } else {
      return false;
   }
}

//Функция рендера последней карточки
function renderResult(){
   let resultTitle = document.querySelector('.result__title');
   let resultImg = document.querySelector('.result__img');
   let resultAnswers = sumAnswers(answers);

   if(resultAnswers < 6){
      resultTitle.innerText = `${resultAnswers}/8 Not bad`;
      resultImg.src = './images/result/not_bad.jpg'
   } else if(resultAnswers >= 6 && resultAnswers < 8){
      resultTitle.innerText = `${resultAnswers}/8 Well done`;
      resultImg.src = './images/result/well_done.jpg'
   } else{
      resultTitle.innerText = `${resultAnswers}/8 Excellent`;
      resultImg.src = './images/result/excellent.jpg'
   }


}

//функция для подсчета объекта
function sumAnswers(answers) {
   return Object.values(answers).reduce((a, b) => a + b, 0);
 }

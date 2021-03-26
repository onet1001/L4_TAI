let preQuestions = [];

fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;

        let next = document.querySelector('.next');
        let previous = document.querySelector('.previous');

        let question = document.querySelector('.question');
        let answers = document.querySelectorAll('.list-group-item');
        let list = document.querySelector('.list');
        let results = document.querySelector('.results');
        let userScorePoint = document.querySelector('.userScorePoint');
        let average = document.querySelector(".average");
        let pointsElem = document.querySelector('.score');
        let restart = document.querySelector('.restart');
        let index = 0;
        let points = 0;
        let currentElement = null;

        setQuestion(index);

        for (let i = 0; i < answers.length; i++) {
            answers[i].addEventListener('click', doAction);
        }

        function doAction(event) {
            //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
            if (event.target.innerHTML === preQuestions[index].correct_answer) {
                points++;
                pointsElem.innerText = points;
                markCorrect(event.target);
            } else {
                markInCorrect(event.target);
            }
            disableAnswers();
        }

        function markCorrect(elem) {
            elem.classList.add('correct');
            currentElement = elem;
        }

        function markInCorrect(elem) {
            elem.classList.add('incorrect');
            currentElement = elem;
        }

        function cleanMark() {
            if (currentElement !== null) {
                currentElement.classList.remove('correct');
                currentElement.classList.remove('incorrect');
            }
        }

        previous.addEventListener('click', function () {
            if (index !== 0) {
                index--;
                setQuestion(index);
            }
        })

        next.addEventListener('click', function () {
            if (index !== 19) {
                index++;
                setQuestion(index);
                activateAnswers();
            } else {
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
                saveScore(points);

            }

        });

        function activateAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].addEventListener('click', doAction);
            }
        }

        function disableAnswers() {
            for (let i = 0; i < answers.length; i++) {
                answers[i].removeEventListener('click', doAction);
            }
        }

        function setQuestion(index) {
            cleanMark();
            question.innerHTML = index + 1 + ". " + preQuestions[index].question;

            answers[0].innerHTML = preQuestions[index].answers[0];
            answers[1].innerHTML = preQuestions[index].answers[1];
            answers[2].innerHTML = preQuestions[index].answers[2];
            answers[3].innerHTML = preQuestions[index].answers[3];

            if (preQuestions[index].answers.length === 2) {
                answers[2].style.display = 'none';
                answers[3].style.display = 'none';
            } else {
                answers[2].style.display = 'block';
                answers[3].style.display = 'block';
            }
        }

        function saveScore(score) {
            let results;
            let sum = 0;

            if (localStorage.getItem("results") === null) {
                results = [];
            } else {
                results = JSON.parse(localStorage.getItem("results"));
            }

            results.push(parseInt(score));
            localStorage.setItem("results", JSON.stringify(results));
            results.forEach(item => {
                sum += item;
            });
            average.innerHTML = sum / results.length;
        }


        restart.addEventListener('click', function (event) {
            event.preventDefault();

            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            activateAnswers();
            list.style.display = 'block';
            results.style.display = 'none';
        });

    });
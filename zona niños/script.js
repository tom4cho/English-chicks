document.addEventListener('DOMContentLoaded', function() {
    const greeting = document.getElementById('greeting');
    const continueButton = document.getElementById('continueButton');
    const buttonsSection = document.getElementById('buttonsSection');
    const modals = document.querySelectorAll('.modal');
    const closeModalButtons = document.querySelectorAll('.close');
    const sadFace = document.getElementById('sadFace');
    const examButton = document.getElementById('examButton');
    const numberExamButton = document.getElementById('numberExamButton'); // Nuevo botón de examen
    const colorQuestion = document.getElementById('colorQuestion');
    const scoreCount = document.getElementById('scoreCount');
    const feedback = document.getElementById('feedback');
    const numberQuestion = document.getElementById('numberQuestion');
    const numberScoreCount = document.getElementById('numberScoreCount'); // Nuevo contador de respuestas correctas
    const numberFeedback = document.getElementById('numberFeedback');
    const colorButtons = document.querySelectorAll('.color-button');
    const numberButtons = document.querySelectorAll('.number-button'); // Nuevos botones de número
    const character = document.getElementById('character');
    const livesCounter = document.createElement('p');
    
    continueButton.addEventListener('click', () => {
        greeting.innerText = '¡Vamos a aprender y jugar juntos!';
        continueButton.style.display = 'none';
        buttonsSection.style.display = 'flex';
    });

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';

        if (modalId === 'modal1') {
            showColorQuestion();
        } else if (modalId === 'modal2') {
            showNumberQuestion(); // Mostrar preguntas del Módulo 2
        }
    }

    document.getElementById('button1').addEventListener('click', () => openModal('modal1'));
    document.getElementById('button2').addEventListener('click', () => openModal('modal2')); // Nuevo evento
    document.getElementById('button3').addEventListener('click', () => openModal('modal3'));

    closeModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalId = e.target.getAttribute('data-modal');
            document.getElementById(modalId).style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Preguntas del Módulo 1
    const colorQuestions = [
        { question: '¿Cuál es el color rojo?', answer: 'red' },
        { question: '¿Cuál es el color azul?', answer: 'blue' },
        { question: '¿Cuál es el color verde?', answer: 'green' },
        { question: '¿Cuál es el color amarillo?', answer: 'yellow' },
        { question: '¿Cuál es el color púrpura?', answer: 'purple' }
    ];

    let currentColorQuestionIndex = 0;
    let colorLives = 3;
    let colorCorrectAnswers = 0;

    // Preguntas del Módulo 2
    const numberQuestions = [
        { question: '¿Cuántos es uno más uno?', answer: 'two' },
        { question: '¿Cuántos es dos más dos?', answer: 'four' },
        { question: '¿Cuántos es tres más dos?', answer: 'five' },
        { question: '¿Cuántos es uno más tres?', answer: 'four' },
        { question: '¿Cuántos es cinco menos uno?', answer: 'four' }
    ];

    let currentNumberQuestionIndex = 0;
    let numberLives = 3;
    let numberCorrectAnswers = 0;

    livesCounter.classList.add('lives-counter');
    updateLivesDisplay();
    document.querySelector('.activity-section').insertBefore(livesCounter, feedback);

    function updateLivesDisplay() {
        livesCounter.innerHTML = `Vidas restantes: <span class="lives">${'❤️'.repeat(numberLives)}</span>`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function showColorQuestion() {
        if (colorCorrectAnswers >= 10) {
            document.querySelector('.color-buttons').style.display = 'none';
            colorQuestion.style.display = 'none';
            examButton.style.display = 'block';
            return;
        }

        const currentQuestion = colorQuestions[currentColorQuestionIndex];
        colorQuestion.textContent = currentQuestion.question;
        feedback.textContent = '';

        const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
        shuffleArray(colors);

        colorButtons.forEach((button, index) => {
            button.textContent = colors[index].charAt(0).toUpperCase() + colors[index].slice(1);
            button.setAttribute('data-color', colors[index]);
        });

        document.querySelector('.color-buttons').style.display = 'flex';
        colorQuestion.style.display = 'block';
    }

    function showNumberQuestion() {
        if (numberCorrectAnswers >= 10) {
            document.querySelector('.number-buttons').style.display = 'none';
            numberQuestion.style.display = 'none';
            numberExamButton.style.display = 'block';
            return;
        }

        const currentQuestion = numberQuestions[currentNumberQuestionIndex];
        numberQuestion.textContent = currentQuestion.question;
        numberFeedback.textContent = '';

        const numbers = ['one', 'two', 'three', 'four', 'five'];
        shuffleArray(numbers);

        numberButtons.forEach((button, index) => {
            button.textContent = numbers[index].charAt(0).toUpperCase() + numbers[index].slice(1);
            button.setAttribute('data-number', numbers[index]);
        });

        document.querySelector('.number-buttons').style.display = 'flex';
        numberQuestion.style.display = 'block';
    }

    function checkCompletion() {
        if (colorCorrectAnswers === 10) {
            document.querySelector('.color-buttons').style.display = 'none';
            colorQuestion.style.display = 'none';
            examButton.style.display = 'block';
        }

        if (numberCorrectAnswers === 10) {
            document.querySelector('.number-buttons').style.display = 'none';
            numberQuestion.style.display = 'none';
            numberExamButton.style.display = 'block';
        }
    }

    function celebrateCorrectAnswer() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function handleGameOver() {
        document.getElementById('character').style.display = 'none';
        document.querySelector('.message').style.display = 'none';
        buttonsSection.style.display = 'none';
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
        sadFace.style.display = 'block';

        setTimeout(() => {
            sadFace.style.display = 'none';
            document.getElementById('character').style.display = 'block';
            document.querySelector('.message').style.display = 'block';
            buttonsSection.style.display = 'flex';
            colorCorrectAnswers = 0;
            numberCorrectAnswers = 0;
            colorLives = 3;
            numberLives = 3;
            updateLivesDisplay();
            scoreCount.textContent = colorCorrectAnswers;
            numberScoreCount.textContent = numberCorrectAnswers;
            currentColorQuestionIndex = 0;
            currentNumberQuestionIndex = 0;
            showColorQuestion();
            showNumberQuestion();
            examButton.style.display = 'none';
            numberExamButton.style.display = 'none';
        }, 3000);
    }

    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedColor = button.getAttribute('data-color');
            const currentQuestion = colorQuestions[currentColorQuestionIndex];

            if (selectedColor === currentQuestion.answer) {
                feedback.textContent = '¡Correcto! ' + currentQuestion.question;
                feedback.style.color = 'green';
                celebrateCorrectAnswer();
                colorCorrectAnswers++;
                scoreCount.textContent = colorCorrectAnswers;
                currentColorQuestionIndex = (currentColorQuestionIndex + 1) % colorQuestions.length;
                showColorQuestion();
                checkCompletion();
            } else {
                colorLives--;
                updateLivesDisplay();
                feedback.textContent = 'Intenta de nuevo. Este no es el color correcto.';
                feedback.style.color = 'red';

                if (colorLives === 0) {
                    handleGameOver();
                }
            }
        });
    });

    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            const selectedNumber = button.getAttribute('data-number');
            const currentQuestion = numberQuestions[currentNumberQuestionIndex];

            if (selectedNumber === currentQuestion.answer) {
                numberFeedback.textContent = '¡Correcto! ' + currentQuestion.question;
                numberFeedback.style.color = 'green';
                celebrateCorrectAnswer();
                numberCorrectAnswers++;
                numberScoreCount.textContent = numberCorrectAnswers;
                currentNumberQuestionIndex = (currentNumberQuestionIndex + 1) % numberQuestions.length;
                showNumberQuestion();
                checkCompletion();
            } else {
                numberLives--;
                updateLivesDisplay();
                numberFeedback.textContent = 'Intenta de nuevo. Este no es el número correcto.';
                numberFeedback.style.color = 'red';

                if (numberLives === 0) {
                    handleGameOver();
                }
            }
        });
    });

    showColorQuestion();
    showNumberQuestion();
    
});

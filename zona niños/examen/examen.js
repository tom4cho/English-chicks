document.addEventListener('DOMContentLoaded', () => {
    // Function to show the quiz container and hide the welcome screen
    function startQuiz() {
        document.getElementById('welcome-screen').style.opacity = 0;
        setTimeout(() => {
            document.getElementById('welcome-screen').style.display = 'none';
            document.getElementById('header').style.display = 'block';
            document.getElementById('quiz-container').style.display = 'block';
            document.getElementById('minigame-container').style.display = 'block';
            document.getElementById('background-music').play();
            startTimer(); // Start the timer
        }, 1000);
    }

    document.getElementById('play-button').addEventListener('click', startQuiz);

    const memoryCards = document.querySelectorAll('.memory-card');
    let firstCard, secondCard;
    let lockBoard = false;

    memoryCards.forEach(card => card.addEventListener('click', flipCard));

    function flipCard() {
        if (lockBoard || this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.color === secondCard.dataset.color;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }

    // Drag and drop functionality
    function drag(event) {
        event.dataTransfer.setData("text/plain", event.target.id);
    }

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        const draggedElement = document.getElementById(data);
        const dropzone = event.target.closest('.dropzone');

        if (dropzone && dropzone.classList.contains('dropzone')) {
            const color = draggedElement.id;
            const correctDropzoneId = `target-${color}`;

            if (dropzone.id === correctDropzoneId) {
                dropzone.appendChild(draggedElement);
                draggedElement.classList.add('dropped');
                dropzone.innerHTML += `<div class="message correct">Correct Option!</div>`;
                setTimeout(() => {
                    dropzone.querySelector('.message.correct').remove();
                }, 1500);
            } else {
                dropzone.innerHTML += `<div class="message incorrect">Incorrect Option</div>`;
                setTimeout(() => {
                    dropzone.querySelector('.message.incorrect').remove();
                }, 1500);
            }
        }
    }

    document.querySelectorAll('.draggable').forEach(element => {
        element.addEventListener('dragstart', drag);
    });

    document.querySelectorAll('.dropzone').forEach(dropzone => {
        dropzone.addEventListener('dragover', allowDrop);
        dropzone.addEventListener('drop', drop);
    });

    function submitQuiz() {
        const formData = new FormData(document.getElementById('quiz-form'));
        let results = 'Quiz Results:\n\n';

        for (let [key, value] of formData.entries()) {
            results += `${key}: ${value}\n`;
        }

        // Add drag and drop results
        document.querySelectorAll('.dropzone').forEach(dropzone => {
            const droppedElement = dropzone.querySelector('.draggable');
            if (droppedElement) {
                results += `Dropped element in ${dropzone.id}: ${droppedElement.id}\n`;
            } else {
                results += `No element in ${dropzone.id}\n`;
            }
        });

        alert(results);
        showResultMessage();
        showAnswers();
    }

    function generatePDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.text("Quiz Results", 10, 10);
        
        const formData = new FormData(document.getElementById('quiz-form'));
        let y = 20;

        formData.forEach((value, key) => {
            doc.text(`${key}: ${value}`, 10, y);
            y += 10;
        });

        // Add drag and drop results
        document.querySelectorAll('.dropzone').forEach(dropzone => {
            const droppedElement = dropzone.querySelector('.draggable');
            const text = droppedElement ? 
                `Dropped element in ${dropzone.id}: ${droppedElement.id}` : 
                `No element in ${dropzone.id}`;
            doc.text(text, 10, y);
            y += 10;
        });

        doc.save("results.pdf");
    }

    document.getElementById('submit-button').addEventListener('click', () => {
        submitQuiz();
        clearInterval(timer); // Stop the timer
    });

    document.getElementById('download-button').addEventListener('click', generatePDF);

    // Timer functionality
    let timer;
    let timeLeft = 300; // 5 minutes in seconds

    function startTimer() {
        timer = setInterval(updateTimer, 1000);
    }

    function updateTimer() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer').textContent = `Time Left: ${formatTime(minutes)}:${formatTime(seconds)}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            document.getElementById('submit-button').click();
        }
    }

    function formatTime(num) {
        return num < 10 ? `0${num}` : num;
    }

    // Show result message popup
    function showResultMessage() {
        document.getElementById('result-message').style.display = 'block';
    }

    function closeResultMessage() {
        document.getElementById('result-message').style.display = 'none';
    }

    // Show answers after submitting
    function showAnswers() {
        const correctAnswers = {
            q1: 'red',
            q2: 'yellow',
            q3: 'green',
            q4: 'orange',
        };

        let answersHtml = '<h3>Correct Answers:</h3>';
        for (const [question, answer] of Object.entries(correctAnswers)) {
            answersHtml += `<p>Question ${question.charAt(1)}: ${answer}</p>`;
        }

        document.getElementById('result-message').innerHTML += answersHtml;
    }

    startTimer(); // Start the timer when the page loads
});

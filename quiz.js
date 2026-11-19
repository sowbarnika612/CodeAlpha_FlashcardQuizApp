
/* ===================================
   QUIZ MODE
=================================== */

/* Quiz HTML Elements */
const quizSection = document.getElementById("quiz-section");

const quizStartScreen =
    document.getElementById("quiz-start-screen");

const quizQuestionScreen =
    document.getElementById("quiz-question-screen");

const quizResultScreen =
    document.getElementById("quiz-result-screen");

const quizReviewScreen =
    document.getElementById("quiz-review-screen");

const startQuizBtn =
    document.getElementById("start-quiz-btn");

const quizQuestionCount =
    document.getElementById("quiz-question-count");

const quizScoreDisplay =
    document.getElementById("quiz-score");

const quizProgressFill =
    document.getElementById("quiz-progress-fill");

const quizQuestionElement =
    document.getElementById("quiz-question");

const quizOptionsContainer =
    document.getElementById("quiz-options");

const quizFeedback =
    document.getElementById("quiz-feedback");

const nextQuizBtn =
    document.getElementById("next-quiz-btn");

const quizFinalScore =
    document.getElementById("quiz-final-score");

const quizResultMessage =
    document.getElementById("quiz-result-message");

const restartQuizBtn =
    document.getElementById("restart-quiz-btn");

/* Review Mode Elements */
const reviewQuizBtn =
    document.getElementById("review-quiz-btn");

const retryIncorrectBtn =
    document.getElementById("retry-incorrect-btn");

const retryReviewIncorrectBtn =
    document.getElementById("retry-review-incorrect-btn");

const backToQuizResultsBtn =
    document.getElementById("back-to-quiz-results-btn");

const quizReviewSummary =
    document.getElementById("quiz-review-summary");

const quizReviewList =
    document.getElementById("quiz-review-list");


/* Quiz Variables */
let quizQuestions = [];

let quizCurrentIndex = 0;

let quizScore = 0;

let quizAnswered = false;


/* Quiz Option Buttons */
const quizOptionButtons = quizOptionsContainer
    ? quizOptionsContainer.querySelectorAll(".quiz-option")
    : [];


/* Shuffle Array */
function quizShuffleArray(array) {

    const shuffledArray = [...array];

    for (let i = shuffledArray.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffledArray[i], shuffledArray[j]] =
            [shuffledArray[j], shuffledArray[i]];

    }

    return shuffledArray;

}


/* Create Quiz Questions */
function createQuizQuestions() {

    /*
       Use filtered cards when at least two are available.
       Otherwise, use all flashcards.
    */

    let questionPool =
        typeof filteredFlashcards !== "undefined" &&
        filteredFlashcards.length >= 2
            ? [...filteredFlashcards]
            : [...flashcards];

    /* Remove Cards Without Questions or Answers */
    questionPool = questionPool.filter(function (card) {

        return card.question && card.answer;

    });

    /* Shuffle the Question Order */
    questionPool = quizShuffleArray(questionPool);

    /* Maximum of 10 Questions */
    questionPool = questionPool.slice(0, 10);

    /* Create Questions and Options */
    quizQuestions = questionPool.map(function (card) {

        /* Find Other Answers to Use as Distractors */
        const otherAnswers = flashcards
            .filter(function (otherCard) {

                return (
                    otherCard.answer !== card.answer &&
                    otherCard.answer.trim() !== ""
                );

            })
            .map(function (otherCard) {

                return otherCard.answer;

            });

        /* Remove Duplicate Answers */
        const uniqueOtherAnswers = [...new Set(otherAnswers)];

        /* Select Up to 3 Wrong Answers */
        const wrongAnswers = quizShuffleArray(
            uniqueOtherAnswers
        ).slice(0, 3);

        /* Combine Correct and Wrong Answers */
        let options = [
            card.answer,
            ...wrongAnswers
        ];

        /* Shuffle the Options */
        options = quizShuffleArray(options);

        return {
            question: card.question,
            correctAnswer: card.answer,
            options: options,
            selectedAnswer: "",
            isCorrect: null
        };

    });

}


/* Start Quiz */
function startQuiz() {

    if (!quizStartScreen || !quizQuestionScreen) return;

    if (flashcards.length < 2) {

        alert(
            "Add at least 2 flashcards to start the quiz!"
        );

        return;
    }

    createQuizQuestions();

    if (quizQuestions.length === 0) {

        alert("No valid flashcards are available for the quiz.");

        return;
    }

    quizCurrentIndex = 0;

    quizScore = 0;

    quizAnswered = false;

    /* Show Question Screen */
    quizStartScreen.style.display = "none";

    quizResultScreen.style.display = "none";

    quizReviewScreen.style.display = "none";

    quizQuestionScreen.style.display = "block";

    /* Display First Question */
    displayQuizQuestion();

}


/* Display Quiz Question */
function displayQuizQuestion() {

    if (quizCurrentIndex >= quizQuestions.length) {

        showQuizResults();

        return;
    }

    const currentQuestion =
        quizQuestions[quizCurrentIndex];

    quizAnswered = false;

    /* Update Question Number */
    quizQuestionCount.textContent =
        "Question " +
        (quizCurrentIndex + 1) +
        " of " +
        quizQuestions.length;

    /* Update Score */
    quizScoreDisplay.textContent =
        "Score: " + quizScore;

    /* Update Progress Bar */
    const progress = (
        quizCurrentIndex / quizQuestions.length
    ) * 100;

    quizProgressFill.style.width = progress + "%";

    /* Display Question */
    quizQuestionElement.textContent =
        currentQuestion.question;

    /* Clear Feedback */
    quizFeedback.textContent = "";

    quizFeedback.className = "";

    /* Hide Next Button */
    nextQuizBtn.style.display = "none";

    /* Reset and Display Options */
    quizOptionButtons.forEach(function (button, index) {

        button.classList.remove("correct", "incorrect");

        button.disabled = false;

        if (index < currentQuestion.options.length) {

            button.style.display = "block";

            button.textContent =
                currentQuestion.options[index];

            button.dataset.answer =
                currentQuestion.options[index];

        } else {

            button.style.display = "none";

        }

    });

}


/* Check Selected Answer */
function checkQuizAnswer(selectedButton) {

    if (quizAnswered) return;

    quizAnswered = true;

    const currentQuestion =
        quizQuestions[quizCurrentIndex];

    const selectedAnswer =
        selectedButton.dataset.answer;

    const isCorrect =
        selectedAnswer === currentQuestion.correctAnswer;

    /* Save Answer for Review Mode */
    currentQuestion.selectedAnswer = selectedAnswer;

    currentQuestion.isCorrect = isCorrect;

    /* Disable All Options */
    quizOptionButtons.forEach(function (button) {

        button.disabled = true;

        /* Highlight Correct Answer */
        if (
            button.dataset.answer ===
            currentQuestion.correctAnswer
        ) {

            button.classList.add("correct");

        }

    });

    /* Update Score and Feedback */
    if (isCorrect) {

        quizScore++;

        quizFeedback.textContent =
            "🎉 Correct! Great job!";

        quizFeedback.className = "correct-feedback";

        if (typeof playKnowSound === "function") {
            playKnowSound();
        }

    } else {

        selectedButton.classList.add("incorrect");

        quizFeedback.textContent =
            "❌ Incorrect! The correct answer is highlighted.";

        quizFeedback.className = "incorrect-feedback";

        if (typeof playPracticeSound === "function") {
            playPracticeSound();
        }

    }

    /* Update Score Display */
    quizScoreDisplay.textContent =
        "Score: " + quizScore;

    /* Show Next Button */
    nextQuizBtn.style.display = "inline-block";

    /* Change Button Text on Last Question */
    if (
        quizCurrentIndex === quizQuestions.length - 1
    ) {

        nextQuizBtn.textContent = "View Results";

    } else {

        nextQuizBtn.textContent = "Next Question";

    }

}


/* Move to Next Question */
function nextQuizQuestion() {

    if (!quizAnswered) return;

    quizCurrentIndex++;

    if (quizCurrentIndex < quizQuestions.length) {

        displayQuizQuestion();

    } else {

        showQuizResults();

    }

}


/* Display Final Results */
function showQuizResults() {

    quizQuestionScreen.style.display = "none";

    quizReviewScreen.style.display = "none";

    quizResultScreen.style.display = "block";

    /* Calculate Percentage */
    const percentage = Math.round(
        (quizScore / quizQuestions.length) * 100
    );

    /* Display Score */
    quizFinalScore.textContent =
        quizScore + " / " + quizQuestions.length +
        " (" + percentage + "%)";

    /* Display Performance Message */
    if (percentage === 100) {

        quizResultMessage.textContent =
            "🏆 Perfect Score! You're a Quiz Master!";

    } else if (percentage >= 80) {

        quizResultMessage.textContent =
            "🌟 Excellent work! You know your flashcards really well!";

    } else if (percentage >= 60) {

        quizResultMessage.textContent =
            "👏 Good job! Keep practicing to improve!";

    } else if (percentage >= 40) {

        quizResultMessage.textContent =
            "💪 You're getting there! Review your flashcards and try again!";

    } else {

        quizResultMessage.textContent =
            "📚 Keep learning! Practice your flashcards and try again!";

    }

    /* Fill Progress Bar Completely */
    quizProgressFill.style.width = "100%";

}


/* ===================================
   QUIZ REVIEW MODE
=================================== */

/* Display Review of All Questions */
function reviewQuizAnswers() {

    quizResultScreen.style.display = "none";

    quizQuestionScreen.style.display = "none";

    quizReviewScreen.style.display = "block";

    /* Count Correct and Incorrect Answers */
    const correctCount = quizQuestions.filter(function (question) {

        return question.isCorrect === true;

    }).length;

    const incorrectCount = quizQuestions.filter(function (question) {

        return question.isCorrect === false;

    }).length;

    /* Display Review Summary */
    quizReviewSummary.textContent =
        "✅ Correct: " + correctCount +
        " | ❌ Incorrect: " + incorrectCount;

    /* Clear Previous Review */
    quizReviewList.innerHTML = "";

    /* Display Every Question */
    quizQuestions.forEach(function (question, index) {

        /* Create Review Card */
        const reviewCard = document.createElement("div");

        reviewCard.className = "quiz-review-card";

        /* Question Number */
        const questionNumber = document.createElement("h4");

        questionNumber.textContent =
            "Question " + (index + 1);

        /* Question Text */
        const questionText = document.createElement("p");

        questionText.className = "quiz-review-question";

        questionText.textContent = question.question;

        /* Status */
        const status = document.createElement("p");

        status.className = question.isCorrect
            ? "quiz-review-correct"
            : "quiz-review-incorrect";

        status.textContent = question.isCorrect
            ? "✅ Correct"
            : "❌ Incorrect";

        /* Your Answer */
        const yourAnswer = document.createElement("p");

        yourAnswer.className = "quiz-review-your-answer";

        yourAnswer.textContent =
            "Your Answer: " +
            (question.selectedAnswer || "Not answered");

        /* Correct Answer */
        const correctAnswer = document.createElement("p");

        correctAnswer.className = "quiz-review-correct-answer";

        correctAnswer.textContent =
            "Correct Answer: " + question.correctAnswer;

        /* Add Elements to Review Card */
        reviewCard.appendChild(questionNumber);

        reviewCard.appendChild(questionText);

        reviewCard.appendChild(status);

        reviewCard.appendChild(yourAnswer);

        reviewCard.appendChild(correctAnswer);

        /* Add Review Card to List */
        quizReviewList.appendChild(reviewCard);

    });

    /* Hide Retry Button if No Incorrect Answers */
    if (retryReviewIncorrectBtn) {

        retryReviewIncorrectBtn.style.display =
            incorrectCount > 0 ? "inline-block" : "none";

    }

    if (retryIncorrectBtn) {

        retryIncorrectBtn.style.display =
            incorrectCount > 0 ? "inline-block" : "none";

    }

}


/* Retry Incorrect Questions Only */
function retryIncorrectQuestions() {

    /* Find Questions Answered Incorrectly */
    const incorrectQuestions = quizQuestions.filter(function (question) {

        return question.isCorrect === false;

    });

    /* Check Whether There Are Incorrect Questions */
    if (incorrectQuestions.length === 0) {

        alert("🎉 You have no incorrect answers to retry!");

        return;

    }

    /* Keep Only Incorrect Questions */
    quizQuestions = incorrectQuestions.map(function (question) {

        return {
            question: question.question,
            correctAnswer: question.correctAnswer,
            options: [...question.options],
            selectedAnswer: "",
            isCorrect: null
        };

    });

    /* Reset Quiz Variables */
    quizCurrentIndex = 0;

    quizScore = 0;

    quizAnswered = false;

    /* Hide Other Screens */
    quizStartScreen.style.display = "none";

    quizResultScreen.style.display = "none";

    quizReviewScreen.style.display = "none";

    /* Show Quiz Question Screen */
    quizQuestionScreen.style.display = "block";

    /* Start Retry Quiz */
    displayQuizQuestion();

}


/* Back to Quiz Results */
function backToQuizResults() {

    quizReviewScreen.style.display = "none";

    quizResultScreen.style.display = "block";

}


/* Restart Quiz */
function restartQuiz() {

    quizResultScreen.style.display = "none";

    quizQuestionScreen.style.display = "none";

    quizReviewScreen.style.display = "none";

    quizStartScreen.style.display = "block";

    quizScore = 0;

    quizCurrentIndex = 0;

    quizAnswered = false;

}


/* ===================================
   QUIZ EVENT LISTENERS
=================================== */

/* Start Quiz Button */
if (startQuizBtn) {

    startQuizBtn.addEventListener("click", startQuiz);

}


/* Answer Option Buttons */
quizOptionButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        checkQuizAnswer(button);

    });

});


/* Next Question Button */
if (nextQuizBtn) {

    nextQuizBtn.addEventListener(
        "click",
        nextQuizQuestion
    );

}


/* Restart Quiz Button */
if (restartQuizBtn) {

    restartQuizBtn.addEventListener(
        "click",
        restartQuiz
    );

}


/* Review Answers Button */
if (reviewQuizBtn) {

    reviewQuizBtn.addEventListener(
        "click",
        reviewQuizAnswers
    );

}


/* Retry Incorrect Questions Button */
if (retryIncorrectBtn) {

    retryIncorrectBtn.addEventListener(
        "click",
        retryIncorrectQuestions
    );

}


/* Retry Incorrect Questions from Review Screen */
if (retryReviewIncorrectBtn) {

    retryReviewIncorrectBtn.addEventListener(
        "click",
        retryIncorrectQuestions
    );

}


/* Back to Results Button */
if (backToQuizResultsBtn) {

    backToQuizResultsBtn.addEventListener(
        "click",
        backToQuizResults
    );

}

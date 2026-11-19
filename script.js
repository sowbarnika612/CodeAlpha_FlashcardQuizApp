/* ===================================
   FLASHCARD DATA
=================================== */

/* Get Saved Flashcards from Local Storage */
let savedFlashcards = localStorage.getItem("flashcards");

let flashcards = savedFlashcards
    ? JSON.parse(savedFlashcards)
    : [
        {
            question: "What is HTML?",
            answer: "HTML stands for HyperText Markup Language.",
            category: "Programming",
            status: ""
        },
        {
            question: "What is CSS?",
            answer: "CSS stands for Cascading Style Sheets. It is used to style web pages.",
            category: "Programming",
            status: ""
        },
        {
            question: "What is JavaScript?",
            answer: "JavaScript is a programming language used to make web pages interactive.",
            category: "Programming",
            status: ""
        }
    ];

/* Add Missing Properties to Existing Cards */
flashcards.forEach(function (card) {
    if (card.status === undefined) card.status = "";
    if (card.category === undefined) card.category = "Programming";
});

let currentIndex = 0;
let filteredFlashcards = [...flashcards];


/* ===================================
   SAVE FLASHCARDS
=================================== */

function saveFlashcards() {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
    updateDashboard();
}


/* ===================================
   HTML ELEMENTS
=================================== */

const cardCount = document.getElementById("card-count");
const cardCategory = document.getElementById("card-category");
const categoryFilter = document.getElementById("category-filter");

/* Search Elements */
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search-btn");
const searchMessage = document.getElementById("search-message");

const cardText = document.getElementById("card-text");
const answerText = document.getElementById("answer-text");

const flashcard = document.querySelector(".flashcard");

const showAnswerBtn = document.getElementById("show-answer-btn");
const flipBackBtn = document.getElementById("flip-back-btn");

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const shuffleBtn = document.getElementById("shuffle-btn");
const normalOrderBtn = document.getElementById("normal-order-btn");

const themeToggleBtn = document.getElementById("theme-toggle-btn");
const soundToggleBtn = document.getElementById("sound-toggle-btn");

const knowBtn = document.getElementById("know-btn");
const practiceBtn = document.getElementById("practice-btn");

const questionInput = document.getElementById("question-input");
const answerInput = document.getElementById("answer-input");
const categoryInput = document.getElementById("category-input");

const addBtn = document.getElementById("add-btn");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");

/* Dashboard Elements */
const totalCards = document.getElementById("total-cards");
const knownCards = document.getElementById("known-cards");
const practiceCards = document.getElementById("practice-cards");

const progressPercentage = document.getElementById("progress-percentage");
const progressFill = document.getElementById("progress-fill");

/* Timer Elements */
const timerDisplay = document.getElementById("timer-display");
const studyDuration = document.getElementById("study-duration");

const startTimerBtn = document.getElementById("start-timer-btn");
const pauseTimerBtn = document.getElementById("pause-timer-btn");
const resetTimerBtn = document.getElementById("reset-timer-btn");

const timerMessage = document.getElementById("timer-message");


/* ===================================
   ACHIEVEMENT ELEMENTS
=================================== */

const achievementBadges = [
    {
        id: "beginner",
        elementId: "badge-beginner",
        progressId: "beginner-progress",
        target: 5
    },
    {
        id: "learner",
        elementId: "badge-learner",
        progressId: "learner-progress",
        target: 10
    },
    {
        id: "master",
        elementId: "badge-master",
        progressId: "master-progress",
        target: 20
    },
    {
        id: "expert",
        elementId: "badge-expert",
        progressId: "expert-progress",
        target: 30
    }
];

/* Load Previously Unlocked Achievements */
let savedAchievements =
    localStorage.getItem("achievements");

let unlockedAchievements = savedAchievements
    ? JSON.parse(savedAchievements)
    : {};

/* Prevent Celebration Sounds on Initial Page Load */
let achievementSystemInitialized = false;


/* ===================================
   DAILY STUDY STREAK TRACKER
=================================== */

/* Streak Milestones */
const streakMilestones = [
    {
        days: 3,
        id: "milestone-3",
        statusId: "milestone-status-3"
    },
    {
        days: 7,
        id: "milestone-7",
        statusId: "milestone-status-7"
    },
    {
        days: 14,
        id: "milestone-14",
        statusId: "milestone-status-14"
    },
    {
        days: 30,
        id: "milestone-30",
        statusId: "milestone-status-30"
    }
];

/* Load Saved Streak Data */
let savedStreakData = localStorage.getItem("studyStreak");

let streakData = savedStreakData
    ? JSON.parse(savedStreakData)
    : {
        studyDates: [],
        longestStreak: 0,
        unlockedMilestones: {}
    };

/* Make Sure All Streak Properties Exist */
if (!streakData.studyDates) {
    streakData.studyDates = [];
}

if (!streakData.longestStreak) {
    streakData.longestStreak = 0;
}

if (!streakData.unlockedMilestones) {
    streakData.unlockedMilestones = {};
}

/* Streak Display Elements */
const currentStreakElement =
    document.getElementById("current-streak");

const longestStreakElement =
    document.getElementById("longest-streak");

const totalStudyDaysElement =
    document.getElementById("total-study-days");

const streakCalendarElement =
    document.getElementById("streak-calendar");


/* Get Today's Date in YYYY-MM-DD Format */
function getTodayDate() {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* Convert Date to YYYY-MM-DD Format */
function formatDate(date) {

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* Get Current Streak */
function calculateCurrentStreak() {

    const studyDates = [...new Set(streakData.studyDates)].sort();

    if (studyDates.length === 0) {
        return 0;
    }

    const today = getTodayDate();

    const yesterdayDate = new Date();

    yesterdayDate.setDate(yesterdayDate.getDate() - 1);

    const yesterday = formatDate(yesterdayDate);

    /* Streak Must Include Today or Yesterday */
    const lastStudyDate = studyDates[studyDates.length - 1];

    if (lastStudyDate !== today && lastStudyDate !== yesterday) {
        return 0;
    }

    let streak = 0;

    let checkDate = new Date(lastStudyDate + "T00:00:00");

    /* Count Consecutive Study Days Backwards */
    while (true) {

        const formattedDate = formatDate(checkDate);

        if (studyDates.includes(formattedDate)) {

            streak++;

            checkDate.setDate(checkDate.getDate() - 1);

        } else {

            break;

        }

    }

    return streak;

}


/* Save Streak Data */
function saveStreakData() {

    localStorage.setItem(
        "studyStreak",
        JSON.stringify(streakData)
    );

}


/* Record a Study Day */
function recordStudyDay() {

    const today = getTodayDate();

    /* Add Today Only If It Is Not Already Recorded */
    if (!streakData.studyDates.includes(today)) {

        streakData.studyDates.push(today);

    }

    /* Sort Study Dates */
    streakData.studyDates.sort();

    /* Calculate Current Streak */
    const currentStreak = calculateCurrentStreak();

    /* Update Longest Streak */
    if (currentStreak > streakData.longestStreak) {

        streakData.longestStreak = currentStreak;

    }

    /* Check Streak Milestones */
    let newlyUnlockedMilestones = [];

    streakMilestones.forEach(function (milestone) {

        if (currentStreak >= milestone.days) {

            if (!streakData.unlockedMilestones[milestone.days]) {

                streakData.unlockedMilestones[milestone.days] = true;

                newlyUnlockedMilestones.push(milestone.days);

            }

        }

    });

    /* Save Streak Information */
    saveStreakData();

    /* Refresh Streak Display */
    updateStreakTracker();

    /* Celebrate Newly Unlocked Milestones */
    newlyUnlockedMilestones.forEach(function (days) {

        alert(
            "🎉 Streak Milestone Unlocked!\n\n" +
            "🔥 " + days + "-Day Study Streak!\n\n" +
            "Amazing! Keep up your daily learning habit!"
        );

    });

}


/* Update Streak Tracker */
function updateStreakTracker() {

    const currentStreak = calculateCurrentStreak();

    /* Update Statistics */
    currentStreakElement.textContent = currentStreak;

    longestStreakElement.textContent =
        streakData.longestStreak;

    totalStudyDaysElement.textContent =
        streakData.studyDates.length;

    /* Update Calendar */
    displayStreakCalendar();

    /* Update Milestones */
    updateStreakMilestones();

}


/* Display Last 7 Days in Calendar */
function displayStreakCalendar() {

    streakCalendarElement.innerHTML = "";

    const today = new Date();

    /* Create Calendar for the Last 7 Days */
    for (let i = 6; i >= 0; i--) {

        const date = new Date();

        date.setDate(today.getDate() - i);

        const formattedDate = formatDate(date);

        const dayName = date.toLocaleDateString(
            "en-US",
            { weekday: "short" }
        );

        const dayNumber = date.getDate();

        const studied =
            streakData.studyDates.includes(formattedDate);

        const isToday = i === 0;

        /* Create Calendar Day */
        const dayElement = document.createElement("div");

        dayElement.className = "streak-day";

        if (studied) {
            dayElement.classList.add("studied");
        }

        if (isToday) {
            dayElement.classList.add("today");
        }

        /* Day Name */
        const dayNameElement = document.createElement("div");

        dayNameElement.className = "streak-day-name";

        dayNameElement.textContent = dayName;

        /* Date Number */
        const dayDateElement = document.createElement("div");

        dayDateElement.className = "streak-day-date";

        dayDateElement.textContent = dayNumber;

        /* Study Status */
        const dayStatusElement = document.createElement("div");

        dayStatusElement.className = "streak-day-status";

        dayStatusElement.textContent = studied ? "✓" : "–";

        /* Add Elements to Calendar Day */
        dayElement.appendChild(dayNameElement);

        dayElement.appendChild(dayDateElement);

        dayElement.appendChild(dayStatusElement);

        /* Add Day to Calendar */
        streakCalendarElement.appendChild(dayElement);

    }

}


/* Update Streak Milestones */
function updateStreakMilestones() {

    streakMilestones.forEach(function (milestone) {

        const milestoneElement =
            document.getElementById(milestone.id);

        const statusElement =
            document.getElementById(milestone.statusId);

        if (!milestoneElement || !statusElement) return;

        /* Check Whether Milestone Has Been Unlocked */
        if (streakData.unlockedMilestones[milestone.days]) {

            milestoneElement.classList.add("unlocked");

            milestoneElement.classList.remove("locked");

            statusElement.textContent = "Unlocked! 🎉";

        } else {

            milestoneElement.classList.remove("unlocked");

            milestoneElement.classList.add("locked");

            statusElement.textContent = "Locked";

        }

    });

}


/* ===================================
   SOUND EFFECTS
=================================== */

/* Sound Settings */
let soundEnabled = localStorage.getItem("soundEnabled") !== "false";

/* Audio Context */
let audioContext = null;


/* Create Audio Context */
function getAudioContext() {

    if (!audioContext) {

        const AudioContextClass =
            window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
            return null;
        }

        audioContext = new AudioContextClass();
    }

    return audioContext;
}


/* Play a Single Tone */
function playTone(frequency, duration, type = "sine", volume = 0.15) {

    if (!soundEnabled) return;

    try {

        const context = getAudioContext();

        if (!context) return;

        if (context.state === "suspended") {
            context.resume();
        }

        const oscillator = context.createOscillator();

        const gainNode = context.createGain();

        oscillator.type = type;

        oscillator.frequency.value = frequency;

        gainNode.gain.setValueAtTime(
            0,
            context.currentTime
        );

        gainNode.gain.linearRampToValueAtTime(
            volume,
            context.currentTime + 0.02
        );

        gainNode.gain.exponentialRampToValueAtTime(
            0.001,
            context.currentTime + duration
        );

        oscillator.connect(gainNode);

        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);

        oscillator.stop(context.currentTime + duration);

    } catch (error) {

        console.log("Sound could not be played.");

    }
}


/* Card Flip Sound */
function playFlipSound() {

    playTone(500, 0.12, "sine", 0.10);

}


/* Know It Sound */
function playKnowSound() {

    if (!soundEnabled) return;

    playTone(600, 0.12, "sine", 0.12);

    setTimeout(function () {
        playTone(800, 0.18, "sine", 0.12);
    }, 100);

}


/* Need Practice Sound */
function playPracticeSound() {

    playTone(350, 0.18, "sine", 0.10);

}


/* Timer Completion Sound */
function playCompletionSound() {

    if (!soundEnabled) return;

    playTone(523, 0.18, "sine", 0.12);

    setTimeout(function () {
        playTone(659, 0.18, "sine", 0.12);
    }, 180);

    setTimeout(function () {
        playTone(784, 0.25, "sine", 0.12);
    }, 360);

}


/* Achievement Unlock Sound */
function playAchievementSound() {

    if (!soundEnabled) return;

    playTone(660, 0.15, "sine", 0.12);

    setTimeout(function () {
        playTone(880, 0.18, "sine", 0.12);
    }, 150);

    setTimeout(function () {
        playTone(1046, 0.25, "sine", 0.12);
    }, 300);

}


/* Update Sound Toggle Button */
function updateSoundButton() {

    if (soundEnabled) {

        soundToggleBtn.textContent = "🔊 Sound On";

    } else {

        soundToggleBtn.textContent = "🔇 Sound Off";

    }
}


/* Sound Toggle Button */
soundToggleBtn.addEventListener("click", function () {

    soundEnabled = !soundEnabled;

    localStorage.setItem("soundEnabled", soundEnabled);

    updateSoundButton();

    if (soundEnabled) {

        playTone(600, 0.15, "sine", 0.12);

    }

});
/* ===================================
   DISPLAY FLASHCARDS
=================================== */

function displayFlashcard() {

    if (filteredFlashcards.length === 0) {

        cardText.textContent = "No flashcards match your search.";

        answerText.textContent = "Try another search or category.";

        cardCount.textContent = "Card 0 of 0";

        cardCategory.textContent = "No Category";

        flashcard.classList.remove("flipped");

        prevBtn.disabled = true;

        nextBtn.disabled = true;

        return;
    }

    const currentCard = filteredFlashcards[currentIndex];

    cardText.textContent = currentCard.question;

    answerText.textContent = currentCard.answer;

    cardCount.textContent =
        `Card ${currentIndex + 1} of ${filteredFlashcards.length}`;

    cardCategory.textContent =
        currentCard.category || "Programming";

    flashcard.classList.remove("flipped");

    updateNavigationButtons();
}


/* Update Navigation Buttons */
function updateNavigationButtons() {

    prevBtn.disabled = currentIndex === 0;

    nextBtn.disabled =
        currentIndex === filteredFlashcards.length - 1;
}


/* ===================================
   CATEGORY FILTER + SEARCH
=================================== */

/* Apply Category and Search Together */
function applyFilters() {

    const selectedCategory = categoryFilter.value;
    const searchTerm = searchInput.value.trim().toLowerCase();

    filteredFlashcards = flashcards.filter(function (card) {

        const matchesCategory =
            selectedCategory === "All" ||
            card.category === selectedCategory;

        const matchesSearch =
            searchTerm === "" ||
            card.question.toLowerCase().includes(searchTerm) ||
            card.answer.toLowerCase().includes(searchTerm) ||
            (card.category || "").toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    currentIndex = 0;

    /* Update Search Message */
    if (searchTerm === "") {

        searchMessage.textContent = "";

    } else if (filteredFlashcards.length === 0) {

        searchMessage.textContent = "No matching flashcards found.";

    } else {

        searchMessage.textContent =
            filteredFlashcards.length + " flashcard" +
            (filteredFlashcards.length === 1 ? "" : "s") +
            " found.";

    }

    /* Show Clear Button Only When Search Has Text */
    clearSearchBtn.style.display =
        searchTerm === "" ? "none" : "inline-flex";

    displayFlashcard();
}


/* Category Dropdown */
categoryFilter.addEventListener("change", function () {
    applyFilters();
});


/* Live Search While Typing */
searchInput.addEventListener("input", function () {
    applyFilters();
});


/* Clear Search */
clearSearchBtn.addEventListener("click", function () {

    searchInput.value = "";

    applyFilters();

    searchInput.focus();
});


/* Initial Filter Setup */
applyFilters();


/* ===================================
   DARK MODE
=================================== */

let savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggleBtn.textContent = "☀️ Light Mode";

} else {

    document.body.classList.remove("dark-mode");

    themeToggleBtn.textContent = "🌙 Dark Mode";

}


themeToggleBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeToggleBtn.textContent = "☀️ Light Mode";

        localStorage.setItem("theme", "dark");

    } else {

        themeToggleBtn.textContent = "🌙 Dark Mode";

        localStorage.setItem("theme", "light");

    }

});


/* ===================================
   SHUFFLE MODE
=================================== */

shuffleBtn.addEventListener("click", function () {

    if (filteredFlashcards.length <= 1) {

        alert("You need at least two flashcards to shuffle!");

        return;
    }

    for (let i = filteredFlashcards.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [filteredFlashcards[i], filteredFlashcards[j]] =
            [filteredFlashcards[j], filteredFlashcards[i]];

    }

    currentIndex = 0;

    displayFlashcard();

    alert("Flashcards shuffled successfully!");

});


/* Restore Normal Order */
normalOrderBtn.addEventListener("click", function () {

    applyFilters();

    alert("Original order restored!");

});


/* ===================================
   ACHIEVEMENT SYSTEM
=================================== */

function updateAchievements() {

    /* Count Cards Marked as Know It */
    const knownCount = flashcards.filter(function (card) {
        return card.status === "known";
    }).length;

    let newlyUnlocked = [];

    achievementBadges.forEach(function (badge) {

        const badgeElement =
            document.getElementById(badge.elementId);

        const progressElement =
            document.getElementById(badge.progressId);

        if (!badgeElement || !progressElement) return;

        /* Calculate Progress */
        const currentProgress = Math.min(
            knownCount,
            badge.target
        );

        progressElement.textContent =
            currentProgress + " / " + badge.target;

        /* Check Whether Badge Should Be Unlocked */
        if (knownCount >= badge.target) {

            /* Unlock Badge */
            if (!unlockedAchievements[badge.id]) {

                unlockedAchievements[badge.id] = true;

                newlyUnlocked.push(badge);

            }

            badgeElement.classList.add("unlocked");

            badgeElement.classList.remove("locked");

        } else {

            /* Keep Previously Unlocked Badges Unlocked */
            if (unlockedAchievements[badge.id]) {

                badgeElement.classList.add("unlocked");

                badgeElement.classList.remove("locked");

            } else {

                badgeElement.classList.remove("unlocked");

                badgeElement.classList.add("locked");

            }

        }

    });

    /* Save Achievement Progress */
    localStorage.setItem(
        "achievements",
        JSON.stringify(unlockedAchievements)
    );

    /* Celebrate Newly Unlocked Badges */
    if (
        achievementSystemInitialized &&
        newlyUnlocked.length > 0
    ) {

        playAchievementSound();

        newlyUnlocked.forEach(function (badge) {

            const badgeNames = {
                beginner: "Beginner 🥉",
                learner: "Learner 🥈",
                master: "Master 🥇",
                expert: "Expert 💎"
            };

            alert(
                "🎉 Achievement Unlocked!\n\n" +
                badgeNames[badge.id] +
                "\n\nCongratulations on your progress!"
            );

        });

    }

    achievementSystemInitialized = true;

}


/* ===================================
   LEARNING PROGRESS DASHBOARD
=================================== */

function updateDashboard() {

    const total = flashcards.length;

    const known = flashcards.filter(function (card) {
        return card.status === "known";
    }).length;

    const practice = flashcards.filter(function (card) {
        return card.status === "practice";
    }).length;

    const progress = total === 0
        ? 0
        : Math.round((known / total) * 100);

    totalCards.textContent = total;

    knownCards.textContent = known;

    practiceCards.textContent = practice;

    progressPercentage.textContent = progress + "%";

    progressFill.style.width = progress + "%";

    /* Update Achievement Badges */
    updateAchievements();

    /* Update Streak Tracker */
    updateStreakTracker();

}


/* ===================================
   FLASHCARD FLIPPING
=================================== */

/* Show Answer */
showAnswerBtn.addEventListener("click", function () {

    flashcard.classList.add("flipped");

    playFlipSound();

});


/* Show Question */
flipBackBtn.addEventListener("click", function () {

    flashcard.classList.remove("flipped");

    playFlipSound();

});


/* ===================================
   KNOW IT / NEED PRACTICE
=================================== */

/* Know It Button */
knowBtn.addEventListener("click", function () {

    if (filteredFlashcards.length === 0) return;

    const currentCard = filteredFlashcards[currentIndex];

    currentCard.status = "known";

    /* Record Today's Study */
    recordStudyDay();

    saveFlashcards();

    playKnowSound();

    alert("Great! You know this card!");

});


/* Need Practice Button */
practiceBtn.addEventListener("click", function () {

    if (filteredFlashcards.length === 0) return;

    const currentCard = filteredFlashcards[currentIndex];

    currentCard.status = "practice";

    /* Record Today's Study */
    recordStudyDay();

    saveFlashcards();

    playPracticeSound();

    alert("This card has been added to your practice list!");

});


/* ===================================
   NAVIGATION
=================================== */

/* Next Button */
nextBtn.addEventListener("click", function () {

    if (currentIndex < filteredFlashcards.length - 1) {

        currentIndex++;

        displayFlashcard();

    }

});


/* Previous Button */
prevBtn.addEventListener("click", function () {

    if (currentIndex > 0) {

        currentIndex--;

        displayFlashcard();

    }

});
/* ===================================
   ADD FLASHCARD
=================================== */

addBtn.addEventListener("click", function () {

    const question = questionInput.value.trim();

    const answer = answerInput.value.trim();

    const category = categoryInput.value;

    if (question === "" || answer === "") {

        alert("Please enter both question and answer.");

        return;
    }

    const newCard = {
        question: question,
        answer: answer,
        category: category,
        status: ""
    };

    flashcards.push(newCard);

    saveFlashcards();

    applyFilters();

    const newCardIndex = filteredFlashcards.findIndex(function (card) {
        return card === newCard;
    });

    if (newCardIndex !== -1) {
        currentIndex = newCardIndex;
        displayFlashcard();
    }

    questionInput.value = "";

    answerInput.value = "";

    alert("Flashcard added successfully!");

});


/* ===================================
   EDIT FLASHCARD
=================================== */

editBtn.addEventListener("click", function () {

    if (filteredFlashcards.length === 0) {

        alert("No flashcard available to edit.");

        return;
    }

    const question = questionInput.value.trim();

    const answer = answerInput.value.trim();

    const category = categoryInput.value;

    if (question === "" || answer === "") {

        alert("Please enter both question and answer.");

        return;
    }

    const currentCard = filteredFlashcards[currentIndex];

    currentCard.question = question;

    currentCard.answer = answer;

    currentCard.category = category;

    saveFlashcards();

    applyFilters();

    questionInput.value = "";

    answerInput.value = "";

    alert("Flashcard updated successfully!");

});


/* ===================================
   DELETE FLASHCARD
=================================== */

deleteBtn.addEventListener("click", function () {

    if (filteredFlashcards.length === 0) {

        alert("No flashcard available to delete.");

        return;
    }

    if (flashcards.length === 1) {

        alert("You must have at least one flashcard.");

        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete this flashcard?"
    );

    if (confirmDelete) {

        const currentCard = filteredFlashcards[currentIndex];

        const originalIndex = flashcards.indexOf(currentCard);

        flashcards.splice(originalIndex, 1);

        saveFlashcards();

        applyFilters();

        if (currentIndex >= filteredFlashcards.length) {

            currentIndex = Math.max(
                0,
                filteredFlashcards.length - 1
            );

        }

        displayFlashcard();

        alert("Flashcard deleted successfully!");

    }

});


/* ===================================
   TIMED STUDY MODE
=================================== */

/* Timer Variables */
let remainingTime = Number(studyDuration.value);

let timerInterval = null;

let timerRunning = false;


/* Display Timer in MM:SS Format */
function displayTimer() {

    const minutes = Math.floor(remainingTime / 60);

    const seconds = remainingTime % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");

    const formattedSeconds = String(seconds).padStart(2, "0");

    timerDisplay.textContent =
        `${formattedMinutes}:${formattedSeconds}`;
}


/* Start Timer */
startTimerBtn.addEventListener("click", function () {

    if (timerRunning) return;

    if (remainingTime <= 0) {

        timerMessage.textContent =
            "Choose a duration or press Reset to start again!";

        return;
    }

    timerRunning = true;

    timerMessage.textContent =
        "Stay focused! Your study session is running.";

    timerInterval = setInterval(function () {

        remainingTime--;

        displayTimer();

        if (remainingTime <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            timerRunning = false;

            remainingTime = 0;

            displayTimer();

            timerMessage.textContent =
                "🎉 Time's up! Great job completing your study session!";

            playCompletionSound();

            alert("Study session completed! Great job! 🎉");

        }

    }, 1000);

});


/* Pause Timer */
pauseTimerBtn.addEventListener("click", function () {

    if (!timerRunning) {

        timerMessage.textContent =
            "The timer is already paused.";

        return;
    }

    clearInterval(timerInterval);

    timerInterval = null;

    timerRunning = false;

    timerMessage.textContent =
        "Timer paused. Press Start to continue!";

});


/* Reset Timer */
resetTimerBtn.addEventListener("click", function () {

    clearInterval(timerInterval);

    timerInterval = null;

    timerRunning = false;

    remainingTime = Number(studyDuration.value);

    displayTimer();

    timerMessage.textContent =
        "Timer reset! Ready for another study session?";

});


/* Change Study Duration */
studyDuration.addEventListener("change", function () {

    if (timerRunning) {

        clearInterval(timerInterval);

        timerInterval = null;

        timerRunning = false;

    }

    remainingTime = Number(studyDuration.value);

    displayTimer();

    timerMessage.textContent =
        "Study duration changed. Press Start when you're ready!";

});


/* ===================================
   INITIAL DISPLAY
=================================== */

displayFlashcard();

updateDashboard();

displayTimer();

updateSoundButton();

updateStreakTracker();
// 1. DATA STORAGE (Memory)
let myLogs = JSON.parse(localStorage.getItem('moverest_logs')) || {}; // Load saved logs from browser storage.
let viewingDate = new Date(); // Track which month is currently showing on the calendar.
let selectedDateKey = ""; // Remember which day was clicked for history view.

// 2. FINDING ELEMENTS ON THE PAGE (Connecting JS to HTML)
const calendarGrid = document.getElementById('calendar-grid'); 
const monthLabel = document.getElementById('current-month-year'); 
const feedbackBox = document.getElementById('feedback-display'); 
const feedbackText = document.getElementById('feedback-text'); 
const redReasonSection = document.getElementById('quick-red-reasons'); 
const regModal = document.getElementById('registration-modal'); 
const viewModal = document.getElementById('view-data-modal'); 

// 3. CALENDAR LOGIC - here we build the calendar and fill in the data from memory
// Using this for inspiration: https://dev.to/wizdomtek/creating-a-dynamic-calendar-using-html-css-and-javascript-29m
function drawCalendar() { // Function to draw the calendar month.
    calendarGrid.innerHTML = ''; // Wipe the calendar clean before drawing.
    const year = viewingDate.getFullYear(); // Getting year from current view date.
    const month = viewingDate.getMonth(); // Getting month from current view date.
    monthLabel.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewingDate); 

    const firstDayIndex = new Date(year, month, 1).getDay(); // Find first weekday of the month.
    const totalDays = new Date(year, month + 1, 0).getDate(); // Find total days in the month.
    let emptySpaces = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Calculate leading empty boxes.

    for (let i = 0; i < emptySpaces; i++) { // Loop to create empty gaps.
        const space = document.createElement('div'); // Create a box.
        space.className = 'calendar-day empty'; // Mark it as empty.
        calendarGrid.appendChild(space); // Add to the grid.
    } // End of gap loop.

    for (let day = 1; day <= totalDays; day++) { // Loop for every real day.
        const dayBox = document.createElement('div'); // Create day box.
        dayBox.className = 'calendar-day'; // Give it standard styling.
        dayBox.textContent = day; // Write day number.

        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; // Unique date ID.
        const today = new Date(); // Get today's real date.
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) { // If it matches today:
            dayBox.classList.add('today'); // Add highlight style.
        } // End today check.

        if (myLogs[dateKey]) { // If data exists for this day:
            const dot = document.createElement('div'); // Create indicator dot.
            dot.className = `day-indicator indicator-${myLogs[dateKey].status}`; // Set color.
            dayBox.appendChild(dot); // Put dot in box.
        } // End data check.

        dayBox.onclick = () => { // When day is clicked:
            selectedDateKey = dateKey; // Remember the date ID.
            if (myLogs[dateKey]) showHistoryPopup(myLogs[dateKey], dateKey); // Show info if it exists.
        }; // End click handler.

        calendarGrid.appendChild(dayBox); // Add day box to grid.
    } // End days loop.
} // End drawCalendar function.

// 4. FEEDBACK & SAVING (The logic)
function getAdvice(status, reason) { // Function to pick advice text.
    if (status === 'green') return "Great job! Keep the momentum going. Your body thanks you! 🔥"; 
    if (reason === 'Pain') return "Recommendation: Please rest today to recover. Your health comes first! 🛡️"; 
    if (reason === 'Low Energy') return "Recommendation: A lighter activity or a walk might help boost your mood. 🚶‍♂️"; 
    if (reason === 'Discomfort') return "Recommendation:  Consider lighter activity today, like walking, cycling, or gentle stretching instead of intense exercise. 🧘"; 
  return "Taking it easy is a smart move. Rest up! ✨"; 
} 

function saveEntry(status, details = {}) { // Function to save data.
    const today = new Date(); // Get current date.
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`; // Today's ID.
    myLogs[dateKey] = { status, ...details, time: new Date().toISOString() }; // Add data to memory.
    localStorage.setItem('moverest_logs', JSON.stringify(myLogs)); // Save memory permanently.
    drawCalendar(); // Update calendar dots.
} // End saveEntry function.

function setFeedback(message, isWaiting = false) { // Function to update main screen text.
    feedbackBox.classList.remove('empty'); // Make feedback box active.
    if (isWaiting) feedbackBox.classList.add('empty'); // Keep it light if waiting.
    feedbackText.textContent = message; // Set message text.
} // End setFeedback function.

// 5. BUTTON CLICKS (User Actions)
document.getElementById('quick-green-btn').onclick = () => { // Green button click:
    redReasonSection.classList.add('hidden'); // Hide reasons.
    saveEntry('green'); // Save green status.
    setFeedback(getAdvice('green')); // Show advice.
}; // End green click.

document.getElementById('quick-red-btn').onclick = () => { // Red button click:
    redReasonSection.classList.remove('hidden'); // Show reasons.
    setFeedback("Please select a reason below...", true); // Ask for reason.
}; // End red click.

document.querySelectorAll('.reason-button').forEach(btn => { // For each reason button:
    btn.onclick = () => { // When clicked:
        const why = btn.dataset.reason; // Get reason name.
        saveEntry('red', { reason: why }); // Save red with reason.
        setFeedback(getAdvice('red', why)); // Show specific advice.
        redReasonSection.classList.add('hidden'); // Hide reasons after choice.
    }; // End click.
}); // End reason loop.

// 6. POPUP (MODAL) CONTROLS
document.getElementById('manual-add-btn').onclick = () => regModal.classList.remove('hidden'); // Show registration popup.
document.getElementById('close-reg-modal').onclick = () => regModal.classList.add('hidden'); // Hide registration popup.
document.getElementById('close-view-modal').onclick = () => viewModal.classList.add('hidden'); // Hide history popup.

let currentModalStatus = 'green'; // Track status in popup.
const miniGreen = document.getElementById('modal-status-green'); // Mini green button.
const miniRed = document.getElementById('modal-status-red'); // Mini red button.
const modalReasons = document.getElementById('modal-red-reasons'); // Popup reasons area.

miniGreen.onclick = () => { // Mini green click:
    currentModalStatus = 'green'; // Set status.
    miniGreen.classList.add('selected'); // Highlight button.
    miniRed.classList.remove('selected'); // Un-highlight other.
    modalReasons.classList.add('hidden'); // Hide reasons.
}; // End mini green click.

miniRed.onclick = () => { // Mini red click:
    currentModalStatus = 'red'; // Set status.
    miniRed.classList.add('selected'); // Highlight button.
    miniGreen.classList.remove('selected'); // Un-highlight other.
    modalReasons.classList.remove('hidden'); // Show reasons.
}; // End mini red click.

document.getElementById('entry-form').onsubmit = (event) => { // Form save clicked:
    event.preventDefault(); // Don't refresh page.
    const chosenReason = currentModalStatus === 'red' ? document.querySelector('input[name="modal-reason"]:checked')?.value : null; // Get reason if red.
    saveEntry(currentModalStatus, { // Save everything.
        workoutType: document.getElementById('workout-type').value,
        duration: document.getElementById('duration').value,
        intensity: document.getElementById('intensity').value,
        note: document.getElementById('note').value,
        reason: chosenReason
    });
    regModal.classList.add('hidden'); // Close popup.
    setFeedback(getAdvice(currentModalStatus, chosenReason)); // Show advice.
    event.target.reset(); // Clear form.
    miniGreen.click(); // Reset status to green.
}; // End form submit.

// 7. VIEWING HISTORY (Calendar popup)
function showHistoryPopup(data, date) { // Function to show history window.
    document.getElementById('view-date-title').textContent = `Details for ${date}`; // Set date title.
    const statusText = document.getElementById('view-status-val'); // Status label.
    statusText.textContent = data.status === 'green' ? 'Green Day' : 'Red Day'; // Write status.
    statusText.style.color = data.status === 'green' ? 'var(--color-green)' : 'var(--color-red)'; // Set color.

    const rRow = document.getElementById('view-reason-row'); // Reason row.
    if (data.reason) { rRow.classList.remove('hidden'); document.getElementById('view-reason-val').textContent = data.reason; } // Show if exists.
    else { rRow.classList.add('hidden'); } // Hide if not.

    const wRow = document.getElementById('view-workout-row'); // Workout row.
    if (data.workoutType) { wRow.classList.remove('hidden'); document.getElementById('view-workout-val').textContent = `${data.workoutType} (${data.duration}m)`; } // Show if exists.
    else { wRow.classList.add('hidden'); } // Hide if not.

    const nRow = document.getElementById('view-note-row'); // Note row.
    if (data.note) { nRow.classList.remove('hidden'); document.getElementById('view-note-val').textContent = data.note; } // Show if exists.
    else { nRow.classList.add('hidden'); } // Hide if not.
    viewModal.classList.remove('hidden'); // Show history popup.
} // End history function.

document.getElementById('delete-entry-btn').onclick = () => { // Delete clicked:
    if (selectedDateKey && myLogs[selectedDateKey]) { // If data exists:
        delete myLogs[selectedDateKey]; // Wipe from memory.
        localStorage.setItem('moverest_logs', JSON.stringify(myLogs)); // Update permanent storage.
        viewModal.classList.add('hidden'); // Close popup.
        drawCalendar(); // Refresh calendar.
        setFeedback("Entry deleted from history."); // Confirm delete.
    } // End safety check.
}; // End delete handler.

// 8. NAVIGATION (Arrows)
document.getElementById('prev-month').onclick = () => { viewingDate.setMonth(viewingDate.getMonth() - 1); drawCalendar(); }; // Back one month.
document.getElementById('next-month').onclick = () => { viewingDate.setMonth(viewingDate.getMonth() + 1); drawCalendar(); }; // Forward one month.

drawCalendar(); // Start by drawing the current month.

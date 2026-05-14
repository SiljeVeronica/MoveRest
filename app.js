document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    const state = {
        currentDate: new Date(),
        selectedDate: null,
        logs: JSON.parse(localStorage.getItem('moverest_logs')) || {}
    };

    // --- DOM Elements ---
    const calendarGrid = document.getElementById('calendar-grid');
    const monthYearDisplay = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const addEntryBtn = document.getElementById('add-entry-btn');
    const modal = document.getElementById('registration-modal');
    const closeBtn = document.querySelector('.close-btn');
    const entryForm = document.getElementById('entry-form');
    const steps = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        feedback: document.getElementById('step-feedback')
    };

    // --- Calendar Functions ---
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        const year = state.currentDate.getFullYear();
        const month = state.currentDate.getMonth();
        
        monthYearDisplay.textContent = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(state.currentDate);

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Adjust for Monday start (0=Sun, 1=Mon... -> 1=Mon, 0=Sun)
        let adjustedStart = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        // Empty cells for previous month
        for (let i = 0; i < adjustedStart; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day', 'empty');
            calendarGrid.appendChild(emptyCell);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');
            dayCell.textContent = day;

            const dateKey = \-\-\;
            
            // Check if today
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayCell.classList.add('today');
            }

            // Check for existing logs
            if (state.logs[dateKey]) {
                const indicator = document.createElement('div');
                indicator.classList.add('day-indicator', indicator-\);
                dayCell.appendChild(indicator);
            }

            dayCell.onclick = () => openModal(dateKey);
            calendarGrid.appendChild(dayCell);
        }
    }

    // --- Modal Logic ---
    let currentStatus = null;
    let activeDateKey = null;

    function openModal(dateKey) {
        activeDateKey = dateKey;
        modal.classList.remove('hidden');
        showStep(1);
        entryForm.reset();
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function showStep(stepNum) {
        Object.values(steps).forEach(s => s.classList.add('hidden'));
        steps[stepNum].classList.remove('hidden');
    }

    // Status Selection
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.onclick = () => {
            currentStatus = btn.dataset.status;
            setupStep2(currentStatus);
            showStep(2);
        };
    });

    function setupStep2(status) {
        const title = document.getElementById('step-2-title');
        const redReasons = document.getElementById('red-reasons');
        const workoutDetails = document.getElementById('workout-details');

        redReasons.classList.add('hidden');
        workoutDetails.classList.add('hidden');

        if (status === 'green') {
            title.textContent = "Great! Tell us about your workout";
            workoutDetails.classList.remove('hidden');
        } else if (status === 'red') {
            title.textContent = "It's okay to have a red day. What's wrong?";
            redReasons.classList.remove('hidden');
            workoutDetails.classList.remove('hidden'); // Red days can still have workouts
        } else if (status === 'brown') {
            title.textContent = "Rest up! Any notes?";
            // Just comment for brown
        }
    }

    // Form Submission
    entryForm.onsubmit = (e) => {
        e.preventDefault();
        
        const logEntry = {
            status: currentStatus,
            date: activeDateKey,
            workoutType: document.getElementById('workout-type').value,
            duration: document.getElementById('duration').value,
            intensity: document.getElementById('intensity').value,
            reason: document.querySelector('input[name="reason"]:checked')?.value || null,
            note: document.getElementById('note').value,
            timestamp: new Date().toISOString()
        };

        state.logs[activeDateKey] = logEntry;
        localStorage.setItem('moverest_logs', JSON.stringify(state.logs));
        
        showFeedback(logEntry);
        renderCalendar();
    };

    function showFeedback(entry) {
        const icon = document.getElementById('feedback-icon');
        const msg = document.getElementById('feedback-message');

        if (entry.status === 'green') {
            icon.textContent = '??';
            msg.textContent = "Great job! Keep the momentum going. Your body thanks you!";
        } else if (entry.status === 'red') {
            icon.textContent = '???';
            if (entry.reason === 'Pain') {
                msg.textContent = "Listen to your body. Recovery is just as important as the workout. Consider resting today.";
            } else if (entry.reason === 'Low Energy') {
                msg.textContent = "Maybe a lighter activity or a walk would help? Don't push too hard.";
            } else {
                msg.textContent = "Taking it easy today is a smart move. You'll come back stronger!";
            }
        } else {
            icon.textContent = '???';
            msg.textContent = "Rest is productive! Focus on recovery and feeling better.";
        }

        showStep('feedback');
    }

    // --- Event Listeners ---
    prevMonthBtn.onclick = () => {
        state.currentDate.setMonth(state.currentDate.getMonth() - 1);
        renderCalendar();
    };

    nextMonthBtn.onclick = () => {
        state.currentDate.setMonth(state.currentDate.getMonth() + 1);
        renderCalendar();
    };

    addEntryBtn.onclick = () => {
        const today = new Date();
        const dateKey = \-\-\;
        openModal(dateKey);
    };

    closeBtn.onclick = closeModal;
    document.getElementById('close-feedback-btn').onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };

    // Initial Render
    renderCalendar();
});

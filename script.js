let taskCounter = 0;

document.getElementById('addTaskButton').addEventListener('click', function() {
    taskCounter++;
    const tasksContainer = document.getElementById('tasksContainer');

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.innerHTML = `
        <label for="taskName${taskCounter}">Task Name:</label>
        <input type="text" id="taskName${taskCounter}" required>
        
        <label for="taskDetails${taskCounter}">Task Details:</label>
        <input type="text" id="taskDetails${taskCounter}" required>
    `;

    tasksContainer.appendChild(taskDiv);
});

document.getElementById('homeworkForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const dateGiven = new Date(document.getElementById('dateGiven').value);
    let dueDate = new Date(document.getElementById('dueDate').value);
    dueDate.setDate(dueDate.getDate());

    const tasks = [];
    for (let i = 1; i <= taskCounter; i++) {
        const taskName = document.getElementById(`taskName${i}`).value;
        const taskDetails = document.getElementById(`taskDetails${i}`).value;
        tasks.push({ name: taskName, details: taskDetails.split('+') });
    }

    const timeDiff = dueDate - dateGiven;
    const daysAvailable = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const tasksPerDay = Math.ceil(tasks.length / daysAvailable);

    // Update the assignments object for the calendar
    for (let i = 0; i < daysAvailable; i++) {
        const currentDay = new Date(dateGiven);
        currentDay.setDate(currentDay.getDate() + i);
        const dateString = `${currentDay.getFullYear()}-${currentDay.getMonth() + 1}-${currentDay.getDate()}`;

        if (!assignments[dateString]) {
            assignments[dateString] = [];
        }

        const startIndex = i * tasksPerDay;
        const endIndex = startIndex + tasksPerDay;
        const tasksForTheDay = tasks.slice(startIndex, endIndex);

        tasksForTheDay.forEach(task => {
            assignments[dateString].push(`${task.name}: ${task.details.join(', ')}`);
        });
    }

    // Update the calendar to reflect the new assignments
    updateCalendar();
});

document.addEventListener('DOMContentLoaded', function() {
    const subtitle = document.getElementById('subtitle');
    let subtitleText = [
        "You are Mark. You are Mark. You are Mark. You are Mark. You are Mark. You are Mark. You are Mark.",
        "Frick off calendars!",
        "Calendars aren't eating a penny from me!",
        "Hello, You are Mark. No worries this is normal amnesia.",
        "You need to do your homework, you know that right? RIGHT?!",
        "Shut the frick up and go studying!",
        "Bruh, when is the summer gonna start?",
        "Programming stuff starts in the next quarter there is not much time left; I hope.",
    ];

    subtitle.textContent = subtitleText[Math.floor(Math.random() * subtitleText.length)];

    const themeButton = document.getElementById('themeButton');
    const themeSelector = document.getElementById('themeSelector');

    themeButton.addEventListener('click', function() {
        themeSelector.classList.toggle('open');
    });
});

const backgrounds = [];

document.addEventListener('DOMContentLoaded', async function() {
    const sideMenu = document.getElementById('sideMenu');
    
    try {
        const response = await fetch('backgrounds/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = doc.querySelectorAll('a');
        
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href.match(/\.(jpg|jpeg|png|gif)$/i)) {
                backgrounds.push(`${href}`);
            }
        });
        
        backgrounds.forEach((bg, index) => {
            const backgroundOption = document.createElement('div');
            backgroundOption.className = 'background-option';
            backgroundOption.style.backgroundImage = `url('${bg}')`;
            backgroundOption.onclick = () => changeBackground(bg);
            sideMenu.appendChild(backgroundOption);
        });

        // Pick a random background by default
        if (backgrounds.length > 0) {
            const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
            changeBackground(randomBackground);
        }
    } catch (error) {
        console.error('Error fetching backgrounds:', error);
    }
});

function changeBackground(backgroundUrl) {
    document.body.style.backgroundImage = `url('${backgroundUrl}')`;
}

function addAssignment(dateString, assignment) {
    if (!assignments[dateString]) {
        assignments[dateString] = [];
    }
    assignments[dateString].push(assignment);
    updateCalendar();
}

function removeAssignment(dateString, index) {
    if (assignments[dateString] && assignments[dateString].length > index) {
        assignments[dateString].splice(index, 1);
        if (assignments[dateString].length === 0) {
            delete assignments[dateString];
        }
        updateCalendar();
    }
}

const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('monthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();
let assignments = {};

function generateCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    monthYear.textContent = `${firstDay.toLocaleString('default', { month: 'long' })} ${year}`;

    calendarDays.innerHTML = '';

    for (let i = 0; i < startingDay; i++) {
        calendarDays.innerHTML += '<div class="day-cube"></div>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCube = document.createElement('div');
        dayCube.classList.add('day-cube');
    
        const dayNumber = document.createElement('div');
        dayNumber.classList.add('day-number');
        dayNumber.textContent = day;
    
        const dayAssignments = document.createElement('div');
        dayAssignments.classList.add('day-assignments');
    
        dayCube.appendChild(dayNumber);
        dayCube.appendChild(dayAssignments);
    
        if (year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate()) {
            dayCube.classList.add('today');
        }
    
        const dateString = `${year}-${month + 1}-${day}`;
        if (assignments[dateString] && assignments[dateString].length > 0) {
            dayCube.classList.add('has-assignment');
        }
    
        dayCube.addEventListener('click', () => showAssignments(year, month, day));
    
        calendarDays.appendChild(dayCube);
    }
}

function showAssignments(year, month, day) {
    const dateString = `${year}-${month + 1}-${day}`;
    const popup = document.getElementById('assignmentPopup');
    const popupDate = document.getElementById('popupDate');
    const assignmentList = document.getElementById('assignmentList');

    popupDate.textContent = new Date(year, month, day).toDateString();
    assignmentList.innerHTML = '';

    if (assignments[dateString]) {
        assignments[dateString].forEach((assignment, index) => {
            const li = document.createElement('li');
            li.textContent = assignment;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('remove-assignment');
            removeButton.addEventListener('click', () => removeAssignment(dateString, index));
            li.appendChild(removeButton);
            assignmentList.appendChild(li);
        });
    } else {
        assignmentList.innerHTML = '<li>No assignments for this day</li>';
    }

    popup.style.display = 'block';
}

document.getElementById('closePopup').addEventListener('click', () => {
    document.getElementById('assignmentPopup').style.display = 'none';
});

// Add this to your existing code to close the popup when clicking outside
window.addEventListener('click', (event) => {
    const popup = document.getElementById('assignmentPopup');
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

function updateCalendar() {
    generateCalendar(currentDate.getFullYear(), currentDate.getMonth());
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});

updateCalendar();

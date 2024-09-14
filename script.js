const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

document.getElementById('statsSee').addEventListener('click', function() {
    const boxInfo = document.querySelector('.box-info');
    if (boxInfo.style.display === 'none' || boxInfo.style.display === '') {
        boxInfo.style.display = 'grid'; 
    } else {
        boxInfo.style.display = 'none'; 
    }
});


allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

window.addEventListener('resize', function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

//Student
function Student(name, bangla, english, math) {
    this.name = name;
    this.bangla = bangla;
    this.english = english;
    this.math = math;
    this.total = function () {
        return this.bangla + this.english + this.math;
    };
    this.isFail = function () {
        return this.bangla < 33 || this.english < 33 || this.math < 33;
    };
    this.gpa = function () {
        if (this.isFail()) return 0.0;
        const average = (this.bangla + this.english + this.math) / 3;
        if (average >= 80) return 4.0;
        else if (average >= 70) return 3.5;
        else if (average >= 60) return 3.0;
        else if (average >= 50) return 2.5;
        else if (average >= 40) return 2.0;
        else if (average >= 33) return 1.0;
        else return 0.0;
    };
    this.grade = function () {
        const gpa = this.gpa();
        if (gpa === 4.0) return 'A+';
        else if (gpa >= 3.5) return 'A';
        else if (gpa >= 3.0) return 'A-';
        else if (gpa >= 2.5) return 'B';
        else if (gpa >= 2.0) return 'C';
        else if (gpa >= 1.0) return 'D';
        else return 'F';
    };
    this.finalResult = function () {
        return this.isFail() ? 'Fail' : 'Pass';
    };
}


function loadStudents() {
    const studentsData = localStorage.getItem('students');
    if (studentsData) {
        const parsedData = JSON.parse(studentsData);
        students = parsedData.map(student => new Student(student.name, student.bangla, student.english, student.math));
    } else {
        students = [];
    }
}

function saveStudents() {
    const studentsData = JSON.stringify(students);
    localStorage.setItem('students', studentsData);
}


function displayStudents() {
    const tableBody = document.querySelector('#studentTable tbody');


    tableBody.innerHTML = '';

    students.sort((a, b) => a.name.localeCompare(b.name));

 
    students.forEach(student => {
        const row = document.createElement('tr');

       
        const nameCell = document.createElement('td');
        nameCell.textContent = student.name;

        const banglaCell = document.createElement('td');
        banglaCell.textContent = student.bangla;

        const englishCell = document.createElement('td');
        englishCell.textContent = student.english;

        const mathCell = document.createElement('td');
        mathCell.textContent = student.math;

        const totalCell = document.createElement('td');
        totalCell.textContent = student.total();

        const gradeCell = document.createElement('td');
        gradeCell.textContent = student.grade();

        const resultCell = document.createElement('td');

        if (student.finalResult() === 'Fail') {
            const failIcon = document.createElement('i');
            failIcon.className = 'fas fa-exclamation-triangle';
            failIcon.style.color = 'red';


            let tooltipText = `${student.name} failed in: `;
            if (student.bangla < 33) tooltipText += 'Bangla ';
            if (student.english < 33) tooltipText += 'English ';
            if (student.math < 33) tooltipText += 'Math ';

            failIcon.setAttribute('title', tooltipText.trim() + '. So overall he/she is failed.');

            resultCell.appendChild(failIcon);
        } else {
            resultCell.textContent = student.finalResult();
        }


        row.appendChild(nameCell);
        row.appendChild(banglaCell);
        row.appendChild(englishCell);
        row.appendChild(mathCell);
        row.appendChild(totalCell);
        row.appendChild(gradeCell);
        row.appendChild(resultCell);


        tableBody.appendChild(row);
    });

    calculateStatistics();
}

function calculateStatistics() {
    const gradeCounts = {
        'A+': 0,
        'A': 0,
        'A-': 0,
        'B': 0,
        'C': 0,
        'D': 0,
        'F': 0
    };

    students.forEach(student => {
        const grade = student.grade();
        gradeCounts[grade]++;
    });

    const totalStudents = students.length;
    document.getElementById('totalSt').innerHTML = totalStudents;
    document.getElementById('gradeAplus').textContent = `${gradeCounts['A+']}`;
    document.getElementById('gradeA').textContent = `${gradeCounts['A']}`;
    document.getElementById('gradeAminus').textContent = `${gradeCounts['A-']}`;
    document.getElementById('gradeB').textContent = `${gradeCounts['B']}`;
    document.getElementById('gradeC').textContent = `${gradeCounts['C']}`;
    document.getElementById('gradeD').textContent = `${gradeCounts['D']}`;
    document.getElementById('gradeF').textContent = `${gradeCounts['F']}`;
}

function addStudent(name, bangla, english, math) {
    students.push(new Student(name, bangla, english, math)); 
    saveStudents(); 
    displayStudents(); 
}

document.getElementById('studentForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    const name = document.getElementById('studentName').value;
    const bangla = parseInt(document.getElementById('banglaMarks').value);
    const english = parseInt(document.getElementById('englishMarks').value);
    const math = parseInt(document.getElementById('mathMarks').value);

    addStudent(name, bangla, english, math);

    
    document.getElementById('studentName').value = '';
    document.getElementById('banglaMarks').value = '';
    document.getElementById('englishMarks').value = '';
    document.getElementById('mathMarks').value = '';
});


loadStudents();
displayStudents();

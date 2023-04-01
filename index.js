const studentDetailsObject = {
  rollNo: document.getElementById("roll-no"),
  className: document.getElementById("class-name"),
  fatherName: document.getElementById("father-name"),
  motherName: document.getElementById("mother-name"),
  attendance: document.getElementById("attendance"),
  studentName: document.getElementById("student-name"),
  dateOfBirth: document.getElementById("birth-date"),
  schoolLogo: document.getElementById("school-logo"),
  result: document.getElementById("result"),
  percentage: document.getElementById("percentage"),
  grade: document.getElementById("grade"),
};


fetch("http://stageapi.iguru.guru:222/api/ExamManagement/GetStudentProgressReports?schoolID=282&sectionID=2682&eXamMasID=8442&students=181521", { method: "GET" })
  .then(response => response.json())
  .then(({ Response }) => {
    //console.log("Response",Response)
    
    const { lstStudentInfo, lstInternal } = Response.ProgressList;
    
    const [{ Name, DOB, ClassName, RollNumber, MotherName, FatherName, cusAttendance, SchoolLogo, Result, Totalper, TotalGrade, lstStudent }] = lstStudentInfo;
    
    studentDetailsObject.studentName.textContent = Name;
    studentDetailsObject.dateOfBirth.textContent = DOB;
    studentDetailsObject.className.textContent = ClassName;
    studentDetailsObject.rollNo.textContent = RollNumber;
    studentDetailsObject.motherName.textContent = MotherName;
    studentDetailsObject.fatherName.textContent = FatherName;
    studentDetailsObject.attendance.textContent = cusAttendance.reduce((total, { PresenceDays }) => total + PresenceDays, 0);
    studentDetailsObject.schoolLogo.classList.add("school-logo-height");    
    studentDetailsObject.schoolLogo.src = SchoolLogo;
    studentDetailsObject.result.textContent = Result;
    studentDetailsObject.percentage.textContent = Totalper;
    studentDetailsObject.grade.textContent = TotalGrade;



    const [englishT1, englishT2, hindiT1, hindiT2, mathsT1, mathsT2] = lstStudent.filter(({ SubjectName, ExamMasterID }) => {
      return (SubjectName === "ENGLISH" && ExamMasterID === 8441) ||
        (SubjectName === "ENGLISH" && ExamMasterID === 8442) ||
        (SubjectName === "HINDI" && ExamMasterID === 8441) ||
        (SubjectName === "HINDI" && ExamMasterID === 8442) ||
        (SubjectName === "MATHMATICS" && ExamMasterID === 8441) ||
        (SubjectName === "MATHMATICS" && ExamMasterID === 8442);
    });

    const [englishTerm1Marks, englishTerm2Marks, hindiTerm1Marks, hindiTerm2Marks, mathsTerm1Marks, mathsTerm2Marks] = [englishT1, englishT2, hindiT1, hindiT2, mathsT1, mathsT2].map(({ Marks }) => Marks);

    const [bestOf1and2forT1Hindi, bestOf1and2forT1English, bestOf3and4forT2Hindi, bestOf3and4forT2English] = [
      [0, 2],
      [1, 3],
      [4, 6],
      [5, 7]
    ].map(([a, b]) => lstInternal[a].ScoredMarks >= lstInternal[b].ScoredMarks ? lstInternal[a].ScoredMarks : lstInternal[b].ScoredMarks);

  });


  


const table = document.getElementById("report-table");
const rows = table.rows;
const numColumns = rows[0].cells.length;


const englishRowDetailsObject = {
  "Best Score PT-I,II" : bestOf1and2forT1English,
  "Term I" : englishTerm1Marks,
  "Best Score PT-III,IV" : bestOf3and4forT2English,
  "Term II" : englishTerm2Marks
}
const hindiRowDetailsObject = {
  "Best Score PT-I,II" : bestOf1and2forT1English,
  "Term I" : englishTerm1Marks,
  "Best Score PT-III,IV" : bestOf3and4forT2English,
  "Term II" : englishTerm2Marks
}
const mathsRowDetailsObject = {
  "Best Score PT-I,II" : 16,
  "Term I" : 74,
  "Best Score PT-III,IV" : 18,
  "Term II" : 68
}

const subjectDetailsArray = []
subjectDetailsArray.push(englishRowDetailsObject)
subjectDetailsArray.push(hindiRowDetailsObject)
subjectDetailsArray.push(mathsRowDetailsObject)
const columnOderArray = [ "Best Score PT-I,II","Term I","Best Score PT-III,IV","Term II"]
const fillColumns = [1,2,4,5]

for (let rowNum = 5; rowNum < 8; rowNum++) {
  let fc = 0
  for (let colNum = 1; colNum < 7; colNum++) {
    if (fillColumns.includes(colNum)){
      console.log(subjectDetailsArray[0][columnOderArray[colNum-1]])
      rows[rowNum].cells[colNum].textContent = parseInt(subjectDetailsArray[rowNum - 5][columnOderArray[fc]])
      fc += 1
    }
  }         
}


const setTotalSumColumns = (termIndices,selectedColumn) => {
  
  for (let rowNum = 5; rowNum < 8; rowNum++) {
    let sum = 0
    for (let colNum = 1; colNum < 7; colNum++) {
       if (termIndices.includes(colNum)){
        sum += parseInt(rows[rowNum].cells[colNum].textContent)
       }
       rows[rowNum].cells[selectedColumn].textContent = sum
    }
  } 
}

setTotalSumColumns([1,2],3)
setTotalSumColumns([4,5],6)
setTotalSumColumns([3,6],7)

      
        

  const sums = new Array(8).fill(0)

  for (let colNum = 1; colNum < 8; colNum++) {
    for (let rowNum = 5; rowNum < 8; rowNum++) {
      sums[colNum] += parseInt(rows[rowNum].cells[colNum].textContent)
    }
  }

  for (let colNum = 1; colNum < 8; colNum++) {
    rows[8].cells[colNum].textContent = sums[colNum]
  }

  const getGrade = percentage => percentage >= 90? "A1" : percentage >=80?"A2":percentage >= 70?"B1":percentage >=60?"B2":percentage >= 50?"C1":percentage >= 40? "C2" : percentage >= 33? "D": percentage <= 33?"E":null

  for (let rowNum = 5; rowNum < 9; rowNum++) {
    rows[rowNum].cells[8].textContent = getGrade((parseInt(rows[rowNum].cells[7].textContent) /200) *100 )
  }


  
  /*
  const getGrade = percentage => percentage >= 90? "A1" : percentage >=80?"A2":percentage >= 70?"B1":percentage >=60?"B2":percentage >= 50?"C1":percentage >= 40? "C2" : percentage >= 33? "D": percentage <= 33?"E":null

  const totalMarks = rows[8].cells[7].textContent
  const minMarks = 198     
  const finalResult = totalMarks >= 198 ? "PASS" : "FAIL"

  studentDetailsObject.result.textContent = finalResult;
  studentDetailsObject.percentage.textContent = (totalMarks/600) * 100
  studentDetailsObject.grade.textContent = getGrade(studentDetailsObject.percentage.textContent);

  */




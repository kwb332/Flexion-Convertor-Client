    //About - Queries concerning reports

    import { gql } from 'apollo-boost';


    //Get list of all exams

    const reportByExamID = gql`
                query reportByExamID($examID: Int! ) {
                  reportByExamID(examID: $examID) {
                    examId
                    examDescription
                    examDate
                    inputValue
                    teacherName
                    studentID
                    studentName
                    studentResponse
                    isCorrect
                    inputUnitOfMeasure
                    outPutUnitOfMeasure
                }
              }`;

    //add reports (from student to teacher)

    const addReports = gql`
              mutation addReports($forms : [ReportInput]!) {
                addReports(reportAdd: $forms)
                  }`;

    export { reportByExamID, addReports };



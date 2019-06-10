      //About - Queries concerning Exams

      import { gql } from 'apollo-boost';

      //Add exams by teacher
      const addExam = gql`
                mutation AddExam($examAdd: ExamInput!){
                addExam(examAdd: $examAdd) 
              }`;


      //Add questions by teacher
      const addQuestion = gql`
              mutation AddQuestion($questionAdd: AddExamQuestionInput!){
                addQuestion(questionAdd: $questionAdd) 
            }`;


      //Add answer by student
      const addAnswer = gql`
                  mutation addAnswer($answerAdd: AddExamAnswerInput!) {
                      addAnswer(answerAdd: $answerAdd)
                    }`;


      //Submit exam to student by teacher
      const submitExamToStudent = gql`
            mutation submitExamToStudent($submitStudent: ExamInput!) {
              submitToStudent(submitStudent: $submitStudent)
            }`;


      //Submit exam to student by teacher
      const submitExamToTeacher = gql`
            mutation submitToTeacher($submitTeacher: ExamInput!) {
              submitToTeacher(submitTeacher: $submitTeacher) {
                    examDate
                    examId
                    inputUnitOfMeasure
                    inputValue
                    isCorrect
                    outPutUnitOfMeasure
                    studentName
                    studentResponse

            }
          }`;


      //Get list of all exams
      const getExams = gql`{
                exams {
                  dateCompleted
                  dateCreated
                  description
                  examId
                  isComplete
                  isCreated
                  isGraded
                  studentId
                  teacherId
                }
            }`;


      //get exams list by student after exam is submitted by teacher
      const getexamByUserID = gql` query( $userID : Int!){
              examByUserID(userID:$userID){
                      examId
                      description
                      dateCreated 
                      studentId  
                      teacherId
                      dateCompleted            
                      isComplete
                      isGraded              
                  }
              }`;


      //get exams list using teacher Id
      const getexamByTeacherID = gql` query( $teacherID : Int!){
              examByTeacherID(teacherID:$teacherID){
                  description
                  examId
                  isComplete
                  studentId
              }
              }`;



      //get list of conversion
      const getConversions = gql`{
              conversions {
                    conversionId
                    conversionValue
                    conversionName
                    conversionTypeId
                    conversionTypeName
            }
          }`;


      // get all examsQuestions by examId

      const examQuestionsByExamID = gql`
                query examQuestions($examID: Int!) {
                    examQuestions(examID: $examID) {
                      answer
                      examQuestionId
                      description
                      inputValue
                      sourceConversionID
                      sourceConversionName
                      destinationConversionID
                      destinationConversionName
                      examId
                  }
                }`;


      export {
        addExam,
        addQuestion,
        addAnswer,
        submitExamToStudent,
        submitExamToTeacher,
        getExams,
        getexamByUserID,
        getConversions,
        getexamByTeacherID,
        examQuestionsByExamID

      };


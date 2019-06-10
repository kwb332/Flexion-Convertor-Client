    //About - queries concerning users

    import { gql } from 'apollo-boost';

    //get list of students
    const getStudents = gql`{
          
              students
              {
                userId
                firstName
                lastName
                roleName
                userRoleId
              }
            }`;


    //get list of teachers
    const getTeachers = gql`{
                teachers
                {
                    userId
                    firstName
                    lastName
                    roleName
                    userRoleId
                }
              }`;


    //get teacher by Id
    const teacherByID = gql` query( $userID : Int!){
              teacherByID(userID:$userID){
                userId
                firstName
                lastName
                roleName
                userRoleId
              }
            }`;


      //get student by Id

      const studentByID = gql` query( $userID : Int!){
        studentByID(userID:$userID){
                  userId
                  firstName
                  lastName
                  roleName
                  userRoleId            
                }
            }`;


    export { getTeachers, getStudents, teacherByID, studentByID };

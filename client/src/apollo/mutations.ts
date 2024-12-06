import { gql } from '@apollo/client';

// export const LOGIN_USER = gql`
//   mutation loginUser($email: String!, $password: String!) {
//     loginUser(email: $email, password: $password) {
//       token
//       user {
//         username
//         email
//       }
//     }
//   }
// `;
export const LOGIN_USER = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      username
    }
  }
}
  `;
// // export const ADD_USER = gql`
//   mutation addUser($username: String!, $email: String!, $password: String!) {
//     addUser(username: $username, email: $email, password: $password) {
//       token
//       user {
//         username
//         email
//       }
//     }
//   }
// `;
export const ADD_USER = gql`
mutation AddUser($input: UserInput!) {
  addUser(input: $input) {
    token
    user {
      username
      email
    }
  }
}
`
// export const SAVE_BOOK = gql`
// mutation SaveBook($input: BookInput!) {
//   saveBook(input: $input) {
//       bookId
//       title
//       author
//   }
// }
// `;
export const SAVE_BOOK = gql`
mutation SaveBook($input: BookInput!) {
  saveBook(input: $input) {
    email
    username
    bookCount
  }
}
`




//export const REMOVE_BOOK = gql`
//   mutation removeBook($bookId: String!) {
//     removeBook(bookId: $bookId) {
//       username
//     }
//   }
// `;
export const REMOVE_BOOK = gql`
mutation RemoveBook($bookId: ID!) {
  removeBook(bookId: $bookId) {
    bookCount
  }
}`
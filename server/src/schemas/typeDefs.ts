
const typeDefs = `
  # Tipo para un Usuario
  type User { 
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book] 
  }
  # Tipo para un Libro
  type Book {
    authors: [String]
    description: String
    bookId: String!
    image: String
    link: String
    title: String!  
  }
 # Entrada para agregar un Usuario
  input UserInput {
    username: String!
    email: String!
    password: String!
  }

  # Tipo para la autenticación
  type Auth {
    token: ID!
    user: User
  }
 # Consultas disponibles
  type Query {
    # Obtiene información del usuario autenticado
    me: User
        # Obtiene la lista de todos los usuarios
    users: [User]
       # Obtiene un usuario específico por ID
    user(userId: ID!): User
  }

  # Operaciones de mutación disponibles
  type Mutation {
    # Crea un nuevo usuario
    addUser(input: UserInput!): Auth

    # Autentica un usuario existente
    login(email: String!, password: String!): Auth

    # Guarda un libro para un usuario específico
    saveBook(input: BookInput!): User

    # Elimina un libro de los guardados de un usuario específico
    removeBook(bookId: ID!): User
  }
      # Entrada para guardar un libro  BookInput - maneja de manera estructurada los parámetros requeridos para guardar libros.
  input BookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
`;

export default typeDefs;

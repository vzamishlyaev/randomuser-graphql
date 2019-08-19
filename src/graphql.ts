import { ApolloServer, gql, UserInputError } from 'apollo-server-lambda'
const data = require('../src/data.json');

const typeDefs = gql`
    type Query {
        users: [User!]!
    }

    type Mutation {
        userStatus(userStatus: UserStatusInput!): User!
    }

    type User {
        status: String!
        name: Name!
        gender: String!
        email: String!
        location: Location!
        login: Login!
        picture: Picture!
        dob: Dob!
        registered: Registered!
        phone: String!
        cell: String!
        id: id!
        nat: String!
    }

    input UserStatusInput {
        status: String!
        id: String!
    }

    type Location {
        street: String!
        city: String!
        state: String!
        postcode: String!
        coordinates: Coordinates!
        timezone: Timezone!
    }

    type Timezone {
        offset: String!
        description: String!
    }

    type Coordinates {
        latitude: String!
        longitude: String!
    }

    type Picture {
        large: String!
        medium: String!
        thumbnail: String!
    }

    type Login {
        uuid: ID!
        username: String!
        password: String!
        salt: String!
        md5: String!
        sha1: String!
        sha256: String!
    }

    type Name {
        title: String!
        first: String!
        last: String!
    }

    type Dob {
        date: String!
        age: Int!
    }

    type Registered {
        date: String!
        age: Int!
    }

    type id {
        name: String
        value: String
    }
`

interface Response {
    results: any[] // generate from graphql schema ?
}

const resolvers = {
    Query: {
        users: () => data,
    },
    Mutation: {
        userStatus: (parent: any, { userStatus }: any) => {
            console.log(userStatus);
            const index = data.findIndex((u: any) => u.id.value === userStatus.id);
            if (index === -1) {
                throw new UserInputError('User not found');
            }
            data[index].status = userStatus.status;
            return data[index];
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
})

export const handler = server.createHandler({
    cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders:
            'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,Keep-Alive,X-Requested-With,If-Modified-Since',
    },
})

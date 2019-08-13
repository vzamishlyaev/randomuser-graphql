import {ApolloServer, gql} from 'apollo-server-lambda'
import fetch from 'node-fetch'

const typeDefs = gql`
    type Query {
        randomUser: [User!]!
    }

    type User {
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

const randomUserAPI = 'https://randomuser.me/api/?nat=gb&results=5'

interface Response {
    results: any[] // generate from graphql schema ?
}

const resolvers = {
    Query: {
        randomUser: async () => {
            const response = await fetch(randomUserAPI)
            const json = (await response.json()) as Response
            return json.results
        },
    },
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

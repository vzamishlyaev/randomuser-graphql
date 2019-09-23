import { ApolloServer, gql, UserInputError } from 'apollo-server-lambda'
const data = require('../src/data.json');

const typeDefs = gql`
    type Query {
        products(page: Int, limit: Int, manufacturer: [String], type: [String]): [Product!]!
    }

    type Product {
        productId: Int!
        image: String!
        title: String!
        price: Float!
        rating: Float!
        manufacturer: String!
        type: String!
        features: Feature!
    }

    type Feature {
        feature: String!
        value: String!
    }
`

interface Response {
    results: any[] // generate from graphql schema ?
}

const resolvers = {
    Query: {
        products: (root: any, { page, limit, manufacturer, type }: any) => {
            let d = [...data];
            if (manufacturer && manufacturer.length) {
                const man = manufacturer.map((m: string) => m.toLowerCase());
                d = d.filter(({ manufacturer: m }) => man.includes(m.toLowerCase()));
            }
            if (type && type.length) {
                const typ = type.map((t: string) => t.toLowerCase());
                d = d.filter(({ type: t }) => typ.includes(t.toLowerCase()));
            }
            if (page !== undefined && limit !== undefined) {
                d = [...d.slice(page * limit, page * limit + limit)];
            }
            return d;
        },
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

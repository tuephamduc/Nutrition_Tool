const graphql = require("graphql");

const {
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLList
} = graphql

const Edge = (itemType) => {
  return new GraphQLObjectType({
    name: 'EdgeType',
    fields: () => ({
      node: { type: itemType },
      cursor: { type: GraphQLString }
    })
  })
}

const PageInfo = new GraphQLObjectType({
  name: 'PageInfoType',
  fields: () => ({
    startCursor: { type: GraphQLString },
    endCursor: { type: GraphQLString },
    hasNextPage: { type: GraphQLBoolean }
  })
})

export const convertNodeToCursor = (node) => {
  return Buffer.from(node.id, 'binary').toString('base64')
}

export const convertCursorToNodeId = (cursor) => {
  return Buffer.from(cursor, 'base64').toString('binary')
}

export const Page = (itemType) => {
  return new GraphQLObjectType({
    name: 'PageType',
    fields: () => ({
      totalCount: { type: GraphQLInt },
      edges: { type: new GraphQLList(Edge(itemType)) },
      pageInfo: { type: PageInfo }
    })
  })
}

export const PER_PAGE = 35
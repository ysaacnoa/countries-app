import {gql} from 'graphql-tag'

export const COUNTRY_NAME = {
  query: gql`
    query {
        countries {
          code
          name
          continent {
            code
            name
          }
        }
    }
  `,
}

export const GET_COUNTRY_BY_NAME = {query: gql`
  query GetCountryByName($name: String!) {
  countries(filter: { name: { eq: $name } }) {
    code
    name
    capital
    currency
    languages{
      code
      name
    }
    states{
      code
      name
    }
    continent{
      code
      name
    }
  }
}`,
}
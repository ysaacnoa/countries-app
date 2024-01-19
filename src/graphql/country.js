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

export const PAGINATION_COUNTRY = {
  query:gql`
    query ListCountriesByAlphabet($startsWith: String!) {
      countries(filter: { code: { regex: $startsWith } }) {
        code
        name
        continent{
          code
          name
        }
      }
    }
  `,
}
export const COUNTRIES_BY_SEARCH = {
  query:gql`
    query SearchCountries($prefix: String!) {
      countries(filter: { name: { regex: $prefix } }) {
        code
        name
        continent {
          code
          name
        }
      }
    }`
}

export const LIST_COUNTRIES_BY_CONTINENT = {
  query:gql`
    query ListCountriesByContinents($continentCodes: [String!]!) {
      countries(filter: { continent: { in: $continentCodes } }) {
        code
        name
        continent {
          code
          name
        }
      }
    }`
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
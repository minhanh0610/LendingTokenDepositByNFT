import { gql } from "@apollo/client";

const getTokens = gql`
  query getTokens {
    tokens(orderBy: id) {
      id
      symbol
      decimal
      interestRateNumerator
      interestRateDenominator
      extendedRateNumerator
      extendedRateDenominator
      earlyRateNumerator
      earlyRateDenominator
    }
  }
`;

const getLoans = gql`
  query getLoans {
    loans {
      nft {
        id
        tokenId
        address
      }
      loanAmount
      loanDuration
      payoffAmount
      dueDate
      createdAt
      token {
        id
        interestRateNumerator
        interestRateDenominator
        symbol
        extendedRateDenominator
        extendedRateNumerator
        earlyRateDenominator
        earlyRateNumerator
      }
      id
      state
      borrower {
        id
      }
    }
  }
`;

export { getTokens, getLoans };

import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function ONETIME_CREATE() {
  return gql`
      query{
      shop{
        name
      }
    }
  `;
}

export const getOneTimeUrl = async (ctx) => {
  const client = ctx;
  const confirmationUrl = await client
    .query({
      query: ONETIME_CREATE(),
    })
    .then((response) => response).catch(error => console.log('error', error));

  console.log('ttttttttttttttt', confirmationUrl)
  //return ctx.redirect(confirmationUrl);
};

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
  console.log(client)
  const confirmationUrl = await client
    .query({
      query: ONETIME_CREATE(),
    })
    .then((response) => console.log(response)).catch(error => console.log(error));

  console.log('test')
  //return ctx.redirect(confirmationUrl);
};

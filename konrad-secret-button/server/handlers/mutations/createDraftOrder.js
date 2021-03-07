import "isomorphic-fetch";
import { gql } from "apollo-boost";

export function DRAFTORDER_CREATE() {

  console.log('test')
  return gql`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          invoiceUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
}

export const createDraftOrderUrl = async (ctx) => {
  const client = ctx;
  console.log(client)
  const confirmationUrl = await client
    .mutate({
      mutation: DRAFTORDER_CREATE(),
      variables: {
        "input": {
          "appliedDiscount": {
            "valueType": "PERCENTAGE",
            "value": 20
            , "title": "Super Secret Discount"
          },
          "lineItems": [
            {
              "title": "test",
              "quantity": 1,
              "originalUnitPrice": 10
            }
          ]
        }
      }
    })
    .then((response) => {
      console.log(response);
      response.data.draftOrderCreate.draftOrder.invoiceUrl
    });
  return ctx.redirect(confirmationUrl);
};

import "isomorphic-fetch";
import { gql } from "apollo-boost";

// create draft order and return invoice url
export function DRAFTORDER_CREATE() {
  return gql`
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          invoiceUrl
        }
      }
    }
  `;
}

export const createDraftOrderUrl = async (ctx, variantId) => {
  const client = ctx;
  let confirmationUrl = '';
  await client
    .mutate({
      mutation: DRAFTORDER_CREATE(),
      variables: {
        "input": {
          // global discount for each item
          "appliedDiscount": {
            "valueType": "PERCENTAGE",
            "value": 20,
            "title": "Super Secret Discount"
          },
          // get variantId of product from request
          "lineItems": [
            {
              "variantId": `gid://shopify/ProductVariant/${variantId}`,
              "quantity": 1,
            }
          ]
        }
      }
    })
    .then((response) => {
      confirmationUrl = response.data.draftOrderCreate.draftOrder.invoiceUrl;
    });
  return confirmationUrl;
};

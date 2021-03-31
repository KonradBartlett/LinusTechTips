import "@babel/polyfill";
import dotenv from "dotenv";
import { useParams } from 'react-router-dom';
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import cors from "@koa/cors";
import { global } from "../utils/global";
import { getRandomInt } from "../utils/randomInt";
import { createClient } from "./handlers/client";
import { createDraftOrderUrl } from "./handlers/mutations/createDraftOrder";

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

// shopify admin app context
Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  //////////////////////////////////////////////////
  server.use(cors());
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        // access token for debugging using postman
        console.log('debug access token:', accessToken)

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  // go to admin app
  router.get("/", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  //////////////////////////////////////
  // Backend logic
  //////////////////////////////////////
  router.post("/guess", async (ctx) => {
    // if they have already solved 1 secret,
    // do not allow them to solve more, we can't give away too many discounts
    let solved = ctx.cookies.get('solved');
    if (Number.parseInt(solved) > 0) {

      ctx.body = {
        result: "nope, no prize for you",
        draftOrder: ''
      }
      return;
    }

    // get guess, and secret from request
    var url = require('url');
    var url_parts = url.parse(ctx.url, true);
    var query = url_parts.query;
    let guess = Number.parseInt(query.guess);
    let variant = Number.parseInt(query.variant);
    let secret = ctx.cookies.get('secret');

    // check guess validity
    if (guess > secret) {
      // if guess is greater than secret return high
      ctx.body = {
        result: 'high'
      }
    } else if (guess < secret) {
      // if guess is less than secret return low
      ctx.body = {
        result: 'low'
      }
    } else if (guess == secret) {
      ctx.cookies.set('solved', '1')
      // if guess is correct generate draft order
      const client = createClient();
      const draftOrder = createDraftOrderUrl(client, variant)

      // - return draft order
      ctx.body = {
        result: 'correct',
        draftOrder: draftOrder
      }
    }

    let guesses = ctx.cookies.get('guesses');
    // if session guesses is less than 0 reset cookies
    if (guesses - 1 == 0) {
      // create and return a new session
      ctx.cookies.set('guesses', global().guesses);
      ctx.cookies.set('secret', getRandomInt());
      ctx.cookies.set('solved', '0')
      ctx.cookies.set('draftURL', '');
      ctx.cookies.set('result', '');
    } else {
      // decrement session guesses count
      ctx.cookies.set('guesses', guesses - 1);
    }
  });

  router.get("/session", async (ctx) => {
    // store default guess count in cookies
    ctx.cookies.set('guesses', global().guesses);
    // generate secret
    ctx.cookies.set('secret', getRandomInt());
    ctx.cookies.set('solved', 0);
    ctx.cookies.set('draftURL', '');
    ctx.cookies.set('result', '');
  });

  //////////////////////////////////////

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", verifyRequest(), handleRequest); // Everything else must have sessions

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});

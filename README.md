# LinusTechTips Application
Checklist
#### Backend requirements
- ✅ Powered by NodeJS, Next, and KOA
- ✅ Establish a user session using cookies, generate a password between the given range
- ✅ Capable of accepting 10 guesses, returning high, low, or correct
- ✅ If maximum guesses is exceeded reset session with new secret
- ✅ When user guesses correctly create a draftorder granting 20% for the target product

#### Backend
- ✅ Implement a "Use Secret Password" below "Add to Cart" button on product page
- ✅ When button is pressed, create session, and display a prompt asking for input to solve the secret password
- ✅ Display remaining guesses
- ✅ Display whether they were high or low
- ✅ After correct guess, redirect to draft order invoice

#### Bonus
- ✅ Use async/await, const/let
- ✅ Allow limited number of solved passwords per session
- ✅ Allow enabling/disabling use secret password button by shopify tags 'secret'
- ✅ Allow customizing min and max values for password
- ✅ Max number of guesses is always minimum tree depth so that an informed guesser can always solve the problem
- ❌ Block IP from creating new sessions after failing all guesses
- ❌ Track secret password per product instead of per customer session

# Installation
In the directory *'konrad-secret-button'* run:
``` npm install ```

Create a copy of the file *'.env.example'* called *'.env'* and replace the variables with your variables
```
SHOPIFY_API_KEY="YOUR_SHOPIFY_API_KEY"
SHOPIFY_API_SECRET="YOUR_SHOPIFY_SECRET"
HOST="YOUR_TUNNEL_URL"
SHOP="YOUR_SHOPIFY_URL"
SCOPES=write_products,write_customers,write_draft_orders,read_script_tags,write_script_tags
```

Provide 
```konrad-secret-button/script-tags/tag.js```
at an endpoint and use the shopify script tags request to load the tag into the shopify page, with a POST request to:
```
{YOUR SHOPIFY URL}.myshopify.com/admin/api/2020-07/script_tags.json
```
with body:
```
{
  "script_tag": {
    "event": "onload",
    "src": "{END POINT WHERE YOU'RE PROVIDING 'tag.js'}"
  }
}
```

Replace the product-template.liquid file of your theme with the file provided in the *'frontend'* directory
### OR 
Below the "Product" form in *product-template.liquid* add:
```
{% if product.tags contains 'secret' %}
              {% for variant in product.variants %}
                  <button class="secret"
                    data-product="{{ variant.id }}">
                    <span>Use Secret Code</span>
                    <span class="hide" data-loader>
                      {% include 'icon-spinner' %}
                    </span>
                  </button>
              {% endfor %}
{% endif %}
```


# Run
In the *'konrad-secret-button'* directory run: 
```
shopify serve
```
To use the admin app, authenticate the app by opening the url
```
{NGROK TUNNEL URL}/auth?shop={YOUR SHOP URL}
```

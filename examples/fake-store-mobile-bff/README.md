# Fresh project

Your new Fresh project is ready to go. You can follow the Fresh "Getting
Started" guide here: https://fresh.deno.dev/docs/getting-started

### Usage

Make sure to install Deno: https://deno.land/manual/getting_started/installation

Then start the project in development mode:

```
deno task dev
```

This will watch the project directory and restart as necessary.


## Routes

GET
http://localhost:9000/v1/home
    https://fakestoreapi.com/products?limit=5
    https://fakestoreapi.com/products/categories
    https://fakestoreapi.com/users/:loggedUserId
    https://fakestoreapi.com/carts/user/:loggedUserId

GET
http://localhost:9000/v1/products/:id
    https://fakestoreapi.com/products/1
    https://fakestoreapi.com/carts/user/:loggedUserId - is the product in cart?
    https://fakestoreapi.com/products/category/:projectCategory - releated

GET
http://localhost:9000/v1/cart - logged user cart
    https://fakestoreapi.com/carts/:loggedUserCartId
    https://fakestoreapi.com/products/:productId for each products
    https://viacep.com.br/ws/:cardZipCode/json/


POST
http://localhost:9000/v1/session
    https://fakestoreapi.com/auth/login

        

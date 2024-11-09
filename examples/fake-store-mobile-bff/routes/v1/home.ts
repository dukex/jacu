import type { Context } from "jacu";

function fetchCategoryProducts(category: string) {
  return fetch(`https://fakestoreapi.com/products/category/${category}`).then(
    (response) => response.json(),
  );
}

function fetchProducts() {
  return fetch("https://fakestoreapi.com/products?limit=5").then((response) =>
    response.json()
  );
}

function fetchCategories() {
  return fetch("https://fakestoreapi.com/products/categories")
    .then((response) => response.json())
    .then((categories: string[]) =>
      Promise.allSettled(
        categories.map((category) => fetchCategoryProducts(category)),
      ).then((categoryProducts) =>
        categoryProducts.map((products) => products.value)
      )
    );
}

export default async function handler(_ctx: Context) {
  //  https://fakestoreapi.com/products?limit=5 - Cached 30m
  //  https://fakestoreapi.com/products/categories - Cached 2d
  //  https://fakestoreapi.com/products/category/:category

  // TODO: handle with errors

  const body = await Promise.allSettled([
    fetchProducts(),
    fetchCategories(),
  ]).then(([featuredProducts, categories]) => {
    return {
      featuredProducts: featuredProducts.value,
      categories: categories.value,
    };
  });

  return Response.json(body);
}

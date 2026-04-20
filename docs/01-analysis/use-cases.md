# The Beast Locker — Use Cases (Updated)

---

# 1. Actors

## Visitor (Guest)

- Browses products without authentication
- Adds items to cart
- Completes checkout as guest

---

## Customer

- Purchases products
- Manages account details
- Manages addresses
- Views previous orders

---

## Admin

- Manages catalog
- Creates collections
- Processes orders

---

## System (Vendure Backend)

- Maintains cart and order state
- Calculates totals and shipping
- Provides Shop API and Admin API

---

# 2. Use Cases

---

## UC-01 — Browse Products

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to view the list of available products in the store catalog.

**Goal:** View available products.

**Preconditions**

- Products exist in the catalog.

**Main Flow**

1. Actor opens the product listing page.
2. System retrieves products from the catalog.
3. System returns a list of products via the Shop API.
4. Actor selects a product.

**Extensions**

- No products available → system displays an empty state.

---

## UC-02 — View Product Details

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to view detailed information about a selected product.

**Goal:** Inspect product information.

**Preconditions**

- Product exists in the catalog.

**Main Flow**

1. Actor opens a product page.
2. System returns product data including:
   - product description
   - variants
   - images
   - SEO fields (`seoTitle`, `seoDescription`)

**Extensions**

- Invalid product identifier → system returns "not found".

---

## UC-03 — Browse Collections

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to explore grouped products organized into collections.

**Goal:** Explore curated product collections.

**Preconditions**

- Collections exist in the system.

**Main Flow**

1. Actor opens the collections page.
2. System retrieves collection data.
3. System returns products associated with the collection.

---

## UC-04 — Search or Filter Products

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to quickly find products using search or filtering options.

**Goal:** Find specific products quickly.

**Preconditions**

- Products exist in the catalog.

**Main Flow**

1. Actor performs a search or selects filters.
2. System retrieves matching products.
3. System returns filtered results.

**Extensions**

- No matches found → system displays empty result list.

---

## UC-05 — Add Product Variant to Cart

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to add a specific product variant to their shopping cart.

**Goal:** Add an item to the shopping cart.

**Preconditions**

- Product variant exists.

**Main Flow**

1. Actor clicks "Add to Cart".
2. System checks for an active order.
3. If none exists, system creates a new active order.
4. Product variant is added to the order.
5. System returns the updated cart.

---

## UC-06 — Update Cart

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to modify cart contents such as quantity or removing items.

**Goal:** Modify items in the shopping cart.

**Preconditions**

- Active order exists.

**Main Flow**

1. Actor updates item quantity or removes an item.
2. System recalculates order totals.
3. System returns updated cart information.

---

## UC-07 — Checkout (Manual Payment)

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to finalize their order by providing required checkout details.

**Goal:** Place an order.

**Preconditions**

- Cart contains items.

**Main Flow**

1. Actor provides customer details.
2. Actor provides shipping address.
3. Actor selects shipping method.
4. System validates the order.
5. System transitions the order to the checkout state.

**Note**

- Payment processing is handled externally and is outside current scope.

---

## UC-08 — Admin Manages Products

**Primary actor:** Admin

**Description:**  
Allows administrators to maintain and update the product catalog.

**Goal:** Maintain the product catalog.

**Preconditions**

- Admin is authenticated.

**Main Flow**

1. Admin creates or edits products.
2. Admin uploads product images.
3. Admin updates product details and SEO metadata.

---

## UC-09 — Admin Manages Collections

**Primary actor:** Admin

**Description:**  
Allows administrators to organize products into collections.

**Goal:** Organize products into collections.

**Preconditions**

- Admin is authenticated.

**Main Flow**

1. Admin creates a collection.
2. Admin assigns products to the collection.

---

## UC-10 — Admin Processes Orders

**Primary actor:** Admin

**Description:**  
Allows administrators to review and update order fulfillment status.

**Goal:** Handle orders manually.

**Preconditions**

- Orders exist in the system.
- Admin is authenticated.

**Main Flow**

1. Admin views orders in the Admin interface.
2. Admin reviews customer and shipping information.
3. Admin updates order status for fulfillment.

---

# Customer Account Use Cases

---

## UC-11 — View Account Details

**Primary actor:** Customer

**Description:**  
Allows customers to view their personal account information.

**Goal:** Access account details.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer navigates to account page.
2. System retrieves customer data.
3. System displays account information.

---

## UC-12 — Update Account Details

**Primary actor:** Customer

**Description:**  
Allows customers to modify personal account information (e.g., name, email).

**Goal:** Keep account information up to date.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer opens account settings.
2. Customer edits personal details.
3. Customer submits changes.
4. System validates input.
5. System updates account information.
6. System confirms update.

**Extensions**

- Invalid data → system displays validation errors.

---

## UC-13 — View Addresses

**Primary actor:** Customer

**Description:**  
Allows customers to view saved shipping addresses.

**Goal:** Access saved addresses.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer navigates to address section.
2. System retrieves saved addresses.
3. System displays list of addresses.

---

## UC-14 — Add New Address

**Primary actor:** Customer

**Description:**  
Allows customers to add a new shipping or billing address.

**Goal:** Store additional address information.

**Preconditions**

- Customer is authenticated.

**Main Flow**

1. Customer selects "Add Address".
2. Customer enters address details.
3. Customer submits form.
4. System validates input.
5. System saves address.
6. System confirms addition.

**Extensions**

- Invalid input → system displays validation errors.

---

## UC-15 — Update Address

**Primary actor:** Customer

**Description:**  
Allows customers to modify an existing saved address.

**Goal:** Keep address information accurate.

**Preconditions**

- Customer is authenticated.
- Address exists.

**Main Flow**

1. Customer selects an address.
2. Customer edits details.
3. Customer submits changes.
4. System validates input.
5. System updates address.
6. System confirms update.

---

## UC-16 — Delete Address

**Primary actor:** Customer

**Description:**  
Allows customers to remove an address from their account.

**Goal:** Remove unused or incorrect addresses.

**Preconditions**

- Customer is authenticated.
- Address exists.

**Main Flow**

1. Customer selects an address.
2. Customer clicks "Delete".
3. System asks for confirmation.
4. Customer confirms deletion.
5. System removes address.
6. System updates address list.

**Extensions**

- Address linked to active order → system prevents deletion.

---

# End# The Beast Locker — Use Cases (Updated)

---

# 1. Actors

## Visitor (Guest)

- Browses products without authentication
- Adds items to cart
- Completes checkout as guest

---

## Customer

- Purchases products
- Manages account details
- Manages addresses
- Views previous orders

---

## Admin

- Manages catalog
- Creates collections
- Processes orders

---

## System (Vendure Backend)

- Maintains cart and order state
- Calculates totals and shipping
- Provides Shop API and Admin API

---

# 2. Use Cases

---

## UC-01 — Browse Products

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to view the list of available products in the store catalog.

**Goal:** View available products.

**Preconditions**

- Products exist in the catalog.

**Main Flow**

1. Actor opens the product listing page.
2. System retrieves products from the catalog.
3. System returns a list of products via the Shop API.
4. Actor selects a product.

**Extensions**

- No products available → system displays an empty state.

---

## UC-02 — View Product Details

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to view detailed information about a selected product.

**Goal:** Inspect product information.

**Preconditions**

- Product exists in the catalog.

**Main Flow**

1. Actor opens a product page.
2. System returns product data including:
   - product description
   - variants
   - images
   - SEO fields (`seoTitle`, `seoDescription`)

**Extensions**

- Invalid product identifier → system returns "not found".

---

## UC-03 — Browse Collections

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to explore grouped products organized into collections.

**Goal:** Explore curated product collections.

**Preconditions**

- Collections exist in the system.

**Main Flow**

1. Actor opens the collections page.
2. System retrieves collection data.
3. System returns products associated with the collection.

---

## UC-04 — Search or Filter Products

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to quickly find products using search or filtering options.

**Goal:** Find specific products quickly.

**Preconditions**

- Products exist in the catalog.

**Main Flow**

1. Actor performs a search or selects filters.
2. System retrieves matching products.
3. System returns filtered results.

**Extensions**

- No matches found → system displays empty result list.

---

## UC-05 — Add Product Variant to Cart

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to add a specific product variant to their shopping cart.

**Goal:** Add an item to the shopping cart.

**Preconditions**

- Product variant exists.

**Main Flow**

1. Actor clicks "Add to Cart".
2. System checks for an active order.
3. If none exists, system creates a new active order.
4. Product variant is added to the order.
5. System returns the updated cart.

---

## UC-06 — Update Cart

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to modify cart contents such as quantity or removing items.

**Goal:** Modify items in the shopping cart.

**Preconditions**

- Active order exists.

**Main Flow**

1. Actor updates item quantity or removes an item.
2. System recalculates order totals.
3. System returns updated cart information.

---

## UC-07 — Checkout (Manual Payment)

**Primary actor:** Visitor / Customer

**Description:**  
Allows users to finalize their order by providing required checkout details.

**Goal:** Place an order.

**Preconditions**

- Cart contains items.

**Main Flow**

1. Actor provides customer details.
2. Actor provides shipping address.
3. Actor selects shipping method.
4. System validates the order.
5. System transitions the order to the checkout state.

**Note**

- Payment processing is handled externally and is outside current scope.

---

## UC-08 — Admin Manages Products

**Primary actor:** Admin

**Description:**  
Allows administrators to maintain and update the product catalog.

**Goal:** Maintain the product catalog.

**Preconditions**

- Admin is authenticated.

**Main Flow**

1. Admin creates or edits products.
2. Admin uploads product images.
3. Admin updates product details and SEO metadata.

---

## UC-09 — Admin Manages Collections

**Primary actor:** Admin

**Description:**  
Allows administrators to organize products into collections.

**Goal:** Organize products into collections.

**Preconditions**

- Admin is authenticated.

**Main Flow**

1. Admin creates a collection.
2. Admin assigns products to the collection.

---

## UC-10 — Admin Processes Orders

**Primary actor:** Admin

**Description:**  
Allows administrators to review and update order fulfillment status.

**Goal:** Handle orders manually.

**Preconditions**

- Orders exist in the system.
- Admin is authenticated.

**Main Flow**

1. Admin views orders in the Admin interface.
2. Admin reviews customer and shipping information.
3. Admin updates order status for fulfillment.

---

# Customer Account Use Cases

---

## UC-11 — View Account Details

**Primary actor:** Customer

**Description:**  
Allows customers to view their personal account information.

**Goal:** Access account details.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer navigates to account page.
2. System retrieves customer data.
3. System displays account information.

---

## UC-12 — Update Account Details

**Primary actor:** Customer

**Description:**  
Allows customers to modify personal account information (e.g., name, email).

**Goal:** Keep account information up to date.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer opens account settings.
2. Customer edits personal details.
3. Customer submits changes.
4. System validates input.
5. System updates account information.
6. System confirms update.

**Extensions**

- Invalid data → system displays validation errors.

---

## UC-13 — View Addresses

**Primary actor:** Customer

**Description:**  
Allows customers to view saved shipping addresses.

**Goal:** Access saved addresses.

**Preconditions**

- Customer is authenticated.
- Customer account exists.

**Main Flow**

1. Customer navigates to address section.
2. System retrieves saved addresses.
3. System displays list of addresses.

---

## UC-14 — Add New Address

**Primary actor:** Customer

**Description:**  
Allows customers to add a new shipping or billing address.

**Goal:** Store additional address information.

**Preconditions**

- Customer is authenticated.

**Main Flow**

1. Customer selects "Add Address".
2. Customer enters address details.
3. Customer submits form.
4. System validates input.
5. System saves address.
6. System confirms addition.

**Extensions**

- Invalid input → system displays validation errors.

---

## UC-15 — Update Address

**Primary actor:** Customer

**Description:**  
Allows customers to modify an existing saved address.

**Goal:** Keep address information accurate.

**Preconditions**

- Customer is authenticated.
- Address exists.

**Main Flow**

1. Customer selects an address.
2. Customer edits details.
3. Customer submits changes.
4. System validates input.
5. System updates address.
6. System confirms update.

---

## UC-16 — Delete Address

**Primary actor:** Customer

**Description:**  
Allows customers to remove an address from their account.

**Goal:** Remove unused or incorrect addresses.

**Preconditions**

- Customer is authenticated.
- Address exists.

**Main Flow**

1. Customer selects an address.
2. Customer clicks "Delete".
3. System asks for confirmation.
4. Customer confirms deletion.
5. System removes address.
6. System updates address list.

**Extensions**

- Address linked to active order → system prevents deletion.

---

# End
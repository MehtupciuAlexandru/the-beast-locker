# The Beast Locker — Use Cases

---

# 1. Actors

## Visitor (Guest)

- Browses products without authentication
- Adds items to cart
- Completes checkout as guest

---

## Customer

- Purchases products
- Provides shipping and personal details
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

**Goal:** Inspect product information.

**Preconditions**

- Product exists in the catalog.

**Main Flow**

1. Actor opens a product page.
2. System returns product data including:
   - product description
   - variants
   - images
   - SEO fields (`seoTitle`, `seoDescription`).

**Extensions**

- Invalid product identifier → system returns "not found".

---

## UC-03 — Browse Collections

**Primary actor:** Visitor / Customer

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

**Goal:** Find specific products quickly.

**Main Flow**

1. Actor performs a search or selects filters.
2. System retrieves matching products.
3. System returns filtered results.

**Extensions**

- No matches found → system displays empty result list.

---

## UC-05 — Add Product Variant to Cart

**Primary actor:** Visitor / Customer

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

Payment processing will be handled externally and is outside the scope of the current implementation.

---

## UC-08 — Admin Manages Products

**Primary actor:** Admin

**Goal:** Maintain the product catalog.

**Main Flow**

1. Admin creates or edits products.
2. Admin uploads product images.
3. Admin updates product details and SEO metadata.

---

## UC-09 — Admin Manages Collections

**Primary actor:** Admin

**Goal:** Organize products into collections.

**Main Flow**

1. Admin creates a collection.
2. Admin assigns products to the collection.

---

## UC-10 — Admin Processes Orders

**Primary actor:** Admin

**Goal:** Handle orders manually.

**Main Flow**

1. Admin views orders in the Admin interface.
2. Admin reviews customer and shipping information.
3. Admin updates order status for fulfillment.

---

# End
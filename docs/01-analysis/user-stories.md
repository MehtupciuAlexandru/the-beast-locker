# The Beast Locker — User Stories

---

# Epic A — Catalog and Product Discovery

## US-A1 — Product Listing

**User Story**

As a visitor, I want to browse available products so that I can discover items offered by the store.

**Acceptance Criteria**

- Products are retrieved through the Shop GraphQL API.
- Each product entry displays:
    - product name
    - primary image
    - price
    - slug (URL identifier).
- Product list supports pagination.

---

## US-A2 — Product Details

**User Story**

As a visitor, I want to view detailed product information so that I can evaluate whether to purchase the item.

**Acceptance Criteria**

- Product page displays:
    - product description
    - product variants
    - product assets (images)
    - price information.
- SEO metadata fields are available:
    - `seoTitle`
    - `seoDescription`.

---

## US-A3 — Browse Collections

**User Story**

As a visitor, I want to browse collections so that I can discover themed product groups.

**Acceptance Criteria**

- Collections are accessible through the Shop API.
- Each collection contains a list of associated products.
- Collections can represent marketing campaigns (for example seasonal collections).

---

# Epic B — Cart and Checkout

## US-B1 — Add Product to Cart

**User Story**

As a visitor, I want to add products to a cart so that I can purchase them later.

**Acceptance Criteria**

- When a product variant is added:
    - an active order is created automatically if none exists.
- Cart contents are updated immediately.
- Cart totals are recalculated.

---

## US-B2 — Manage Cart

**User Story**

As a visitor, I want to modify the contents of my cart so that I can adjust my purchase.

**Acceptance Criteria**

- User can update product quantity.
- User can remove items from the cart.
- Order totals are recalculated automatically.

---

## US-B3 — Checkout Preparation

**User Story**

As a visitor, I want to provide my shipping and customer details so that I can place an order.

**Acceptance Criteria**

- Customer information is required.
- Shipping address is required.
- A shipping method must be selected.
- The order transitions to the checkout state.

**Note**

Payment processing is outside the scope of the project and will be handled by an external platform.

---

# Epic C — Customer Account

## US-C1 — Customer Account Creation

**User Story**

As a visitor, I want to create an account so that I can manage my orders and personal information.

**Acceptance Criteria**

- User can register with:
    - name
    - email
    - password.
- Account is stored in the backend through the Vendure Customer entity.

---

## US-C2 — Customer Login

**User Story**

As a customer, I want to log into my account so that I can access my order history.

**Acceptance Criteria**

- Authentication occurs through the Shop API.
- Customer session is created after login.

---

## US-C3 — View Order History

**User Story**

As a customer, I want to view my previous orders so that I can track my purchases.

**Acceptance Criteria**

- Customer can retrieve a list of their orders.
- Each order shows:
    - order number
    - items
    - totals
    - order status.

---

# Epic D — Administration

## US-D1 — Manage Product Catalog

**User Story**

As an administrator, I want to manage products so that the catalog remains accurate and up to date.

**Acceptance Criteria**

- Admin can:
    - create products
    - update products
    - delete products.
- Product information includes assets and variants.

---

## US-D2 — Manage Collections

**User Story**

As an administrator, I want to create collections so that marketing campaigns can be organized.

**Acceptance Criteria**

- Admin can create collections.
- Admin can assign products to collections.

---

## US-D3 — Manage Orders

**User Story**

As an administrator, I want to view and process orders so that product fulfillment can be handled.

**Acceptance Criteria**

- Orders are visible in the Admin UI.
- Order state can be transitioned.
- Order details include customer and shipping information.

---

# End
import type { Config } from "drizzle-kit";

export default {
  schema: [
    "./src/database/schemas/categories.ts",
    "./src/database/schemas/customers.ts",
    "./src/database/schemas/employees.ts",
    "./src/database/schemas/employeeTerritories.ts",
    "./src/database/schemas/orderDetails.ts",
    "./src/database/schemas/orders.ts",
    "./src/database/schemas/products.ts",
    "./src/database/schemas/regions.ts",
    "./src/database/schemas/shippers.ts",
    "./src/database/schemas/suppliers.ts",
    "./src/database/schemas/territories.ts"],
  out: "./drizzle",
} satisfies Config;

// export default {
//   schema: [
//     "./src/database/schemas/categories.ts",
//     "./src/database/schemas/customers.ts",
//     "./src/database/schemas/employees.ts",
//     "./src/database/schemas/employeeTerritories.ts",
//     "./src/database/schemas/orderDetails.ts",
//     "./src/database/schemas/orders.ts",
//     "./src/database/schemas/products.ts",
//     "./src/database/schemas/regions.ts",
//     "./src/database/schemas/shippers.ts",
//     "./src/database/schemas/suppliers.ts",
//     "./src/database/schemas/territories.ts"],
//     driver: "pg"
// } satisfies Config;

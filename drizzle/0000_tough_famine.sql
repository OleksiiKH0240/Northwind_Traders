CREATE SCHEMA "northwind_traders";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."categories" (
	"category_id" serial PRIMARY KEY NOT NULL,
	"category_name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."customers" (
	"customer_id" varchar(5) PRIMARY KEY NOT NULL,
	"company_name" text,
	"contact_name" text,
	"contact_title" text,
	"address" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"phone" text,
	"fax" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."employee_territories" (
	"employee_id" serial NOT NULL,
	"territory_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."employees" (
	"employee_id" serial PRIMARY KEY NOT NULL,
	"last_name" text,
	"first_name" text,
	"title" text,
	"title_of_courtesy" text,
	"birth_date" date,
	"hire_date" date,
	"address" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"home_phone" text,
	"extension" integer,
	"notes" text,
	"reports_to" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."order_details" (
	"order_id" integer,
	"product_id" integer,
	"unit_price" numeric,
	"quantity" integer,
	"discount" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."orders" (
	"order_id" serial PRIMARY KEY NOT NULL,
	"customer_id" varchar(5),
	"employee_id" integer,
	"order_date" date,
	"required_date" date,
	"shipped_date" date,
	"ship_via" integer,
	"freight" numeric,
	"ship_name" text,
	"ship_address" text,
	"ship_city" text,
	"ship_region" text,
	"ship_postal_code" text,
	"ship_country" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."products" (
	"product_id" serial PRIMARY KEY NOT NULL,
	"product_name" text,
	"supplier_id" integer,
	"cattegory_id" integer,
	"quantity_per_unit" text,
	"unit_price" numeric,
	"units_in_stock" integer,
	"units_on_order" integer,
	"reorder_level" integer,
	"discontinued" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."regions" (
	"region_id" serial PRIMARY KEY NOT NULL,
	"region_description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."shippers" (
	"shipper_id" serial PRIMARY KEY NOT NULL,
	"company_name" text,
	"phone" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."suppliers" (
	"supplier_id" serial PRIMARY KEY NOT NULL,
	"company_name" text,
	"contact_name" text,
	"contact_title" text,
	"address" text,
	"city" text,
	"region" text,
	"postal_code" text,
	"country" text,
	"phone" text,
	"fax" text,
	"home_page" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "northwind_traders"."territories" (
	"territory_id" serial PRIMARY KEY NOT NULL,
	"territory_description" text,
	"region_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."employee_territories" ADD CONSTRAINT "employee_territories_employee_id_employees_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "northwind_traders"."employees"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."employee_territories" ADD CONSTRAINT "employee_territories_territory_id_territories_territory_id_fk" FOREIGN KEY ("territory_id") REFERENCES "northwind_traders"."territories"("territory_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."order_details" ADD CONSTRAINT "order_details_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "northwind_traders"."orders"("order_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."order_details" ADD CONSTRAINT "order_details_product_id_products_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "northwind_traders"."products"("product_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."orders" ADD CONSTRAINT "orders_customer_id_customers_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "northwind_traders"."customers"("customer_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."orders" ADD CONSTRAINT "orders_employee_id_employees_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "northwind_traders"."employees"("employee_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."products" ADD CONSTRAINT "products_supplier_id_suppliers_supplier_id_fk" FOREIGN KEY ("supplier_id") REFERENCES "northwind_traders"."suppliers"("supplier_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."products" ADD CONSTRAINT "products_cattegory_id_categories_category_id_fk" FOREIGN KEY ("cattegory_id") REFERENCES "northwind_traders"."categories"("category_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "northwind_traders"."territories" ADD CONSTRAINT "territories_region_id_regions_region_id_fk" FOREIGN KEY ("region_id") REFERENCES "northwind_traders"."regions"("region_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

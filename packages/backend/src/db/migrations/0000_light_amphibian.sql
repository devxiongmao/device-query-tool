CREATE TABLE "BAND" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "BAND_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"band_number" varchar(20) NOT NULL,
	"technology" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "COMBO" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "COMBO_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(200) NOT NULL,
	"technology" varchar(20) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "COMBO_BAND" (
	"combo_id" bigint NOT NULL,
	"band_id" bigint NOT NULL,
	"dl_band_class" varchar(50),
	"ul_band_class" varchar(50),
	CONSTRAINT "COMBO_BAND_combo_id_band_id_pk" PRIMARY KEY("combo_id","band_id")
);
--> statement-breakpoint
CREATE TABLE "DEVICE" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "DEVICE_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"vendor" varchar(100) NOT NULL,
	"model_num" varchar(100) NOT NULL,
	"market_name" varchar(200),
	"release_date" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DEVICE_SOFTWARE_BAND" (
	"device_id" bigint NOT NULL,
	"software_id" bigint NOT NULL,
	"band_id" bigint NOT NULL,
	CONSTRAINT "DEVICE_SOFTWARE_BAND_device_id_software_id_band_id_pk" PRIMARY KEY("device_id","software_id","band_id")
);
--> statement-breakpoint
CREATE TABLE "DEVICE_SOFTWARE_COMBO" (
	"device_id" bigint NOT NULL,
	"software_id" bigint NOT NULL,
	"combo_id" bigint NOT NULL,
	CONSTRAINT "DEVICE_SOFTWARE_COMBO_device_id_software_id_combo_id_pk" PRIMARY KEY("device_id","software_id","combo_id")
);
--> statement-breakpoint
CREATE TABLE "DEVICE_SOFTWARE_PROVIDER_FEATURE" (
	"device_id" bigint NOT NULL,
	"software_id" bigint NOT NULL,
	"provider_id" bigint NOT NULL,
	"feature_id" bigint NOT NULL,
	CONSTRAINT "DEVICE_SOFTWARE_PROVIDER_FEATURE_device_id_software_id_provider_id_feature_id_pk" PRIMARY KEY("device_id","software_id","provider_id","feature_id")
);
--> statement-breakpoint
CREATE TABLE "FEATURE" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "FEATURE_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"description" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PROVIDER" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "PROVIDER_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"network_type" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "PROVIDER_DEVICE_SOFTWARE_BAND" (
	"provider_id" bigint NOT NULL,
	"device_id" bigint NOT NULL,
	"software_id" bigint NOT NULL,
	"band_id" bigint NOT NULL,
	CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_BAND_provider_id_device_id_software_id_band_id_pk" PRIMARY KEY("provider_id","device_id","software_id","band_id")
);
--> statement-breakpoint
CREATE TABLE "PROVIDER_DEVICE_SOFTWARE_COMBO" (
	"provider_id" bigint NOT NULL,
	"device_id" bigint NOT NULL,
	"software_id" bigint NOT NULL,
	"combo_id" bigint NOT NULL,
	CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_COMBO_provider_id_device_id_software_id_combo_id_pk" PRIMARY KEY("provider_id","device_id","software_id","combo_id")
);
--> statement-breakpoint
CREATE TABLE "SOFTWARE" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "SOFTWARE_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(100) NOT NULL,
	"platform" varchar(50) NOT NULL,
	"ptcrb" integer,
	"svn" integer,
	"build_number" varchar(100),
	"release_date" date NOT NULL,
	"device_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "COMBO_BAND" ADD CONSTRAINT "COMBO_BAND_combo_id_COMBO_id_fk" FOREIGN KEY ("combo_id") REFERENCES "public"."COMBO"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "COMBO_BAND" ADD CONSTRAINT "COMBO_BAND_band_id_BAND_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."BAND"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "DEVICE_SOFTWARE_BAND_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "DEVICE_SOFTWARE_BAND_software_id_SOFTWARE_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."SOFTWARE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "DEVICE_SOFTWARE_BAND_band_id_BAND_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."BAND"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "DEVICE_SOFTWARE_COMBO_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "DEVICE_SOFTWARE_COMBO_software_id_SOFTWARE_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."SOFTWARE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "DEVICE_SOFTWARE_COMBO_combo_id_COMBO_id_fk" FOREIGN KEY ("combo_id") REFERENCES "public"."COMBO"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_PROVIDER_FEATURE" ADD CONSTRAINT "DEVICE_SOFTWARE_PROVIDER_FEATURE_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_PROVIDER_FEATURE" ADD CONSTRAINT "DEVICE_SOFTWARE_PROVIDER_FEATURE_software_id_SOFTWARE_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."SOFTWARE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_PROVIDER_FEATURE" ADD CONSTRAINT "DEVICE_SOFTWARE_PROVIDER_FEATURE_provider_id_PROVIDER_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."PROVIDER"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "DEVICE_SOFTWARE_PROVIDER_FEATURE" ADD CONSTRAINT "DEVICE_SOFTWARE_PROVIDER_FEATURE_feature_id_FEATURE_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."FEATURE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_BAND_provider_id_PROVIDER_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."PROVIDER"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_BAND_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_BAND_software_id_SOFTWARE_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."SOFTWARE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_BAND" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_BAND_band_id_BAND_id_fk" FOREIGN KEY ("band_id") REFERENCES "public"."BAND"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_COMBO_provider_id_PROVIDER_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."PROVIDER"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_COMBO_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_COMBO_software_id_SOFTWARE_id_fk" FOREIGN KEY ("software_id") REFERENCES "public"."SOFTWARE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "PROVIDER_DEVICE_SOFTWARE_COMBO" ADD CONSTRAINT "PROVIDER_DEVICE_SOFTWARE_COMBO_combo_id_COMBO_id_fk" FOREIGN KEY ("combo_id") REFERENCES "public"."COMBO"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SOFTWARE" ADD CONSTRAINT "SOFTWARE_device_id_DEVICE_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."DEVICE"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_dsb_device_software" ON "DEVICE_SOFTWARE_BAND" USING btree ("device_id","software_id");--> statement-breakpoint
CREATE INDEX "idx_dsb_band_lookup" ON "DEVICE_SOFTWARE_BAND" USING btree ("band_id");--> statement-breakpoint
CREATE INDEX "idx_dsc_device_software" ON "DEVICE_SOFTWARE_COMBO" USING btree ("device_id","software_id");--> statement-breakpoint
CREATE INDEX "idx_dsc_combo_lookup" ON "DEVICE_SOFTWARE_COMBO" USING btree ("combo_id");--> statement-breakpoint
CREATE INDEX "idx_dspf_lookup" ON "DEVICE_SOFTWARE_PROVIDER_FEATURE" USING btree ("device_id","software_id","provider_id","feature_id");--> statement-breakpoint
CREATE INDEX "idx_dspf_feature_lookup" ON "DEVICE_SOFTWARE_PROVIDER_FEATURE" USING btree ("feature_id");--> statement-breakpoint
CREATE INDEX "idx_pdsb_provider_lookup" ON "PROVIDER_DEVICE_SOFTWARE_BAND" USING btree ("provider_id","band_id");--> statement-breakpoint
CREATE INDEX "idx_pdsb_device_software" ON "PROVIDER_DEVICE_SOFTWARE_BAND" USING btree ("device_id","software_id");--> statement-breakpoint
CREATE INDEX "idx_pdsc_provider_lookup" ON "PROVIDER_DEVICE_SOFTWARE_COMBO" USING btree ("provider_id","combo_id");--> statement-breakpoint
CREATE INDEX "idx_pdsc_device_software" ON "PROVIDER_DEVICE_SOFTWARE_COMBO" USING btree ("device_id","software_id");--> statement-breakpoint
CREATE INDEX "idx_software_device" ON "SOFTWARE" USING btree ("device_id");
ALTER TABLE "BAND" ADD COLUMN "dl_band_class" varchar(50);--> statement-breakpoint
ALTER TABLE "BAND" ADD COLUMN "ul_band_class" varchar(50);--> statement-breakpoint
ALTER TABLE "COMBO_BAND" DROP COLUMN "dl_band_class";--> statement-breakpoint
ALTER TABLE "COMBO_BAND" DROP COLUMN "ul_band_class";
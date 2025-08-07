import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1754234179211 implements MigrationInterface {
    name = 'InitialMigration1754234179211'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "certificates" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "number" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`CREATE TABLE "endorsements" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`CREATE TABLE "medical" ("id" varchar PRIMARY KEY NOT NULL, "class" varchar NOT NULL, "expirationDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`CREATE TABLE "pilots" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "address" varchar NOT NULL, "city" varchar NOT NULL, "state" varchar NOT NULL, "postalCode" varchar NOT NULL, "email" varchar NOT NULL, "phone" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" varchar PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "aircraftMakeModel" varchar NOT NULL, "aircraftIdentity" varchar NOT NULL, "routeFrom" varchar NOT NULL, "routeTo" varchar NOT NULL, "durationOfFlight" integer NOT NULL, "singleEngineLand" integer, "simulatorAtd" integer, "landingsDay" integer, "landingsNight" integer, "groundTrainingReceived" integer, "flightTrainingReceived" integer, "crossCountry" integer, "night" integer, "solo" integer, "pilotInCommand" integer, "instrumentActual" integer, "instrumentSimulated" integer, "instrumentApproaches" integer, "instrumentHolds" integer, "instrumentNavTrack" integer, "notes" varchar, "pilotId" varchar)`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" varchar PRIMARY KEY NOT NULL, "url" varchar NOT NULL, "order" integer NOT NULL, "logId" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_certificates" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "number" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar, CONSTRAINT "FK_05a68997dc2d27dfcc642a4cf51" FOREIGN KEY ("pilotId") REFERENCES "pilots" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_certificates"("id", "type", "number", "issueDate", "pilotId") SELECT "id", "type", "number", "issueDate", "pilotId" FROM "certificates"`);
        await queryRunner.query(`DROP TABLE "certificates"`);
        await queryRunner.query(`ALTER TABLE "temporary_certificates" RENAME TO "certificates"`);
        await queryRunner.query(`CREATE TABLE "temporary_endorsements" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar, CONSTRAINT "FK_96a69a0bfbdeccce6bffe34002d" FOREIGN KEY ("pilotId") REFERENCES "pilots" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_endorsements"("id", "type", "issueDate", "pilotId") SELECT "id", "type", "issueDate", "pilotId" FROM "endorsements"`);
        await queryRunner.query(`DROP TABLE "endorsements"`);
        await queryRunner.query(`ALTER TABLE "temporary_endorsements" RENAME TO "endorsements"`);
        await queryRunner.query(`CREATE TABLE "temporary_medical" ("id" varchar PRIMARY KEY NOT NULL, "class" varchar NOT NULL, "expirationDate" datetime NOT NULL, "pilotId" varchar, CONSTRAINT "FK_cb1f5d88fa2b105cc77513e9082" FOREIGN KEY ("pilotId") REFERENCES "pilots" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_medical"("id", "class", "expirationDate", "pilotId") SELECT "id", "class", "expirationDate", "pilotId" FROM "medical"`);
        await queryRunner.query(`DROP TABLE "medical"`);
        await queryRunner.query(`ALTER TABLE "temporary_medical" RENAME TO "medical"`);
        await queryRunner.query(`CREATE TABLE "temporary_logs" ("id" varchar PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "aircraftMakeModel" varchar NOT NULL, "aircraftIdentity" varchar NOT NULL, "routeFrom" varchar NOT NULL, "routeTo" varchar NOT NULL, "durationOfFlight" integer NOT NULL, "singleEngineLand" integer, "simulatorAtd" integer, "landingsDay" integer, "landingsNight" integer, "groundTrainingReceived" integer, "flightTrainingReceived" integer, "crossCountry" integer, "night" integer, "solo" integer, "pilotInCommand" integer, "instrumentActual" integer, "instrumentSimulated" integer, "instrumentApproaches" integer, "instrumentHolds" integer, "instrumentNavTrack" integer, "notes" varchar, "pilotId" varchar, CONSTRAINT "FK_19598551658f7625a82c7f029c8" FOREIGN KEY ("pilotId") REFERENCES "pilots" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_logs"("id", "date", "aircraftMakeModel", "aircraftIdentity", "routeFrom", "routeTo", "durationOfFlight", "singleEngineLand", "simulatorAtd", "landingsDay", "landingsNight", "groundTrainingReceived", "flightTrainingReceived", "crossCountry", "night", "solo", "pilotInCommand", "instrumentActual", "instrumentSimulated", "instrumentApproaches", "instrumentHolds", "instrumentNavTrack", "notes", "pilotId") SELECT "id", "date", "aircraftMakeModel", "aircraftIdentity", "routeFrom", "routeTo", "durationOfFlight", "singleEngineLand", "simulatorAtd", "landingsDay", "landingsNight", "groundTrainingReceived", "flightTrainingReceived", "crossCountry", "night", "solo", "pilotInCommand", "instrumentActual", "instrumentSimulated", "instrumentApproaches", "instrumentHolds", "instrumentNavTrack", "notes", "pilotId" FROM "logs"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`ALTER TABLE "temporary_logs" RENAME TO "logs"`);
        await queryRunner.query(`CREATE TABLE "temporary_tracks" ("id" varchar PRIMARY KEY NOT NULL, "url" varchar NOT NULL, "order" integer NOT NULL, "logId" varchar, CONSTRAINT "FK_71881df31cfff2362e39accc4b2" FOREIGN KEY ("logId") REFERENCES "logs" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_tracks"("id", "url", "order", "logId") SELECT "id", "url", "order", "logId" FROM "tracks"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`ALTER TABLE "temporary_tracks" RENAME TO "tracks"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" RENAME TO "temporary_tracks"`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" varchar PRIMARY KEY NOT NULL, "url" varchar NOT NULL, "order" integer NOT NULL, "logId" varchar)`);
        await queryRunner.query(`INSERT INTO "tracks"("id", "url", "order", "logId") SELECT "id", "url", "order", "logId" FROM "temporary_tracks"`);
        await queryRunner.query(`DROP TABLE "temporary_tracks"`);
        await queryRunner.query(`ALTER TABLE "logs" RENAME TO "temporary_logs"`);
        await queryRunner.query(`CREATE TABLE "logs" ("id" varchar PRIMARY KEY NOT NULL, "date" datetime NOT NULL, "aircraftMakeModel" varchar NOT NULL, "aircraftIdentity" varchar NOT NULL, "routeFrom" varchar NOT NULL, "routeTo" varchar NOT NULL, "durationOfFlight" integer NOT NULL, "singleEngineLand" integer, "simulatorAtd" integer, "landingsDay" integer, "landingsNight" integer, "groundTrainingReceived" integer, "flightTrainingReceived" integer, "crossCountry" integer, "night" integer, "solo" integer, "pilotInCommand" integer, "instrumentActual" integer, "instrumentSimulated" integer, "instrumentApproaches" integer, "instrumentHolds" integer, "instrumentNavTrack" integer, "notes" varchar, "pilotId" varchar)`);
        await queryRunner.query(`INSERT INTO "logs"("id", "date", "aircraftMakeModel", "aircraftIdentity", "routeFrom", "routeTo", "durationOfFlight", "singleEngineLand", "simulatorAtd", "landingsDay", "landingsNight", "groundTrainingReceived", "flightTrainingReceived", "crossCountry", "night", "solo", "pilotInCommand", "instrumentActual", "instrumentSimulated", "instrumentApproaches", "instrumentHolds", "instrumentNavTrack", "notes", "pilotId") SELECT "id", "date", "aircraftMakeModel", "aircraftIdentity", "routeFrom", "routeTo", "durationOfFlight", "singleEngineLand", "simulatorAtd", "landingsDay", "landingsNight", "groundTrainingReceived", "flightTrainingReceived", "crossCountry", "night", "solo", "pilotInCommand", "instrumentActual", "instrumentSimulated", "instrumentApproaches", "instrumentHolds", "instrumentNavTrack", "notes", "pilotId" FROM "temporary_logs"`);
        await queryRunner.query(`DROP TABLE "temporary_logs"`);
        await queryRunner.query(`ALTER TABLE "medical" RENAME TO "temporary_medical"`);
        await queryRunner.query(`CREATE TABLE "medical" ("id" varchar PRIMARY KEY NOT NULL, "class" varchar NOT NULL, "expirationDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`INSERT INTO "medical"("id", "class", "expirationDate", "pilotId") SELECT "id", "class", "expirationDate", "pilotId" FROM "temporary_medical"`);
        await queryRunner.query(`DROP TABLE "temporary_medical"`);
        await queryRunner.query(`ALTER TABLE "endorsements" RENAME TO "temporary_endorsements"`);
        await queryRunner.query(`CREATE TABLE "endorsements" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`INSERT INTO "endorsements"("id", "type", "issueDate", "pilotId") SELECT "id", "type", "issueDate", "pilotId" FROM "temporary_endorsements"`);
        await queryRunner.query(`DROP TABLE "temporary_endorsements"`);
        await queryRunner.query(`ALTER TABLE "certificates" RENAME TO "temporary_certificates"`);
        await queryRunner.query(`CREATE TABLE "certificates" ("id" varchar PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "number" varchar NOT NULL, "issueDate" datetime NOT NULL, "pilotId" varchar)`);
        await queryRunner.query(`INSERT INTO "certificates"("id", "type", "number", "issueDate", "pilotId") SELECT "id", "type", "number", "issueDate", "pilotId" FROM "temporary_certificates"`);
        await queryRunner.query(`DROP TABLE "temporary_certificates"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "logs"`);
        await queryRunner.query(`DROP TABLE "pilots"`);
        await queryRunner.query(`DROP TABLE "medical"`);
        await queryRunner.query(`DROP TABLE "endorsements"`);
        await queryRunner.query(`DROP TABLE "certificates"`);
    }

}

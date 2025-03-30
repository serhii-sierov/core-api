import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1735415427224 implements MigrationInterface {
  name = 'Init1735415427224';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "identities" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "provider" character varying NOT NULL, "provider_id" character varying NOT NULL, CONSTRAINT "PK_7b2f8cccf4ac6a2d7e6e9e8b1f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" SERIAL NOT NULL, "session_id" uuid NOT NULL, "user_id" integer NOT NULL, "jti_hash" character varying NOT NULL, "ip_address" character varying, "location" character varying, "device" character varying, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_9340188c93349808f10d1db74a8" UNIQUE ("session_id"), CONSTRAINT "UQ_c51912511e2f494e8a0ae1d4bfb" UNIQUE ("jti_hash"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "identities" ADD CONSTRAINT "FK_88e77c008cfcfa6a87027a99bde" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessions" ADD CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sessions" DROP CONSTRAINT "FK_085d540d9f418cfbdc7bd55bb19"`);
    await queryRunner.query(`ALTER TABLE "identities" DROP CONSTRAINT "FK_88e77c008cfcfa6a87027a99bde"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "identities"`);
  }
}

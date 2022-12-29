import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1672275510817 implements MigrationInterface {
    name = 'migration1672275510817'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."Roles_name_enum" AS ENUM('Employee', 'Manager', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "Roles" ("id" integer NOT NULL, "name" "public"."Roles_name_enum" NOT NULL DEFAULT 'Employee', CONSTRAINT "PK_efba48c6a0c7a9b6260f771b165" PRIMARY KEY ("id"))`);
        await queryRunner.query(`INSERT INTO "Roles"("id","name") VALUES (1,'Employee'),(2,'Manager'),(3,'Admin')`)
        await queryRunner.query(`CREATE TYPE "public"."Users_gender_enum" AS ENUM('Male', 'Female')`);
        await queryRunner.query(`CREATE TABLE "Users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying, "gender" "public"."Users_gender_enum" NOT NULL, "password" character varying NOT NULL, "roleId" integer, CONSTRAINT "UQ_3c3ab3f49a87e6ddb607f3c4945" UNIQUE ("email"), CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Tasks_priority_enum" AS ENUM('Low', 'Medium', 'High')`);
        await queryRunner.query(`CREATE TABLE "Tasks" ("id" SERIAL NOT NULL, "priority" "public"."Tasks_priority_enum" NOT NULL DEFAULT 'Medium', "title" character varying NOT NULL, "description" character varying, "completed" boolean NOT NULL DEFAULT false, "assigneeId" integer, "createdById" integer, "projectId" integer, CONSTRAINT "UQ_15ea327c64bafe82646eed2cb9c" UNIQUE ("title"), CONSTRAINT "PK_f38c2a61ff630a16afca4dac442" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "Projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "managerId" integer, CONSTRAINT "UQ_2146b543cc795e3fcc6245cfae6" UNIQUE ("name"), CONSTRAINT "REL_04f00ca29401f8c5c94082060a" UNIQUE ("managerId"), CONSTRAINT "PK_b25c37f2cdf0161b4f10ed3121c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects_users_users" ("projectsId" integer NOT NULL, "usersId" integer NOT NULL, CONSTRAINT "PK_b95933b7c73ac3da347cc5d3c44" PRIMARY KEY ("projectsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dba863a033479a80f18dc58c7f" ON "projects_users_users" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9181fa056d2ce94965926ac2e5" ON "projects_users_users" ("usersId") `);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_65c56db5a9988b90b0d7245e0f0" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_d023f6dc92d52956a59c589de87" FOREIGN KEY ("assigneeId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_8d19aa5b19c060614e5a312cddc" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Tasks" ADD CONSTRAINT "FK_ce2eeb5146a99fc267909ac0e12" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Projects" ADD CONSTRAINT "FK_04f00ca29401f8c5c94082060aa" FOREIGN KEY ("managerId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_users_users" ADD CONSTRAINT "FK_dba863a033479a80f18dc58c7fe" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_users_users" ADD CONSTRAINT "FK_9181fa056d2ce94965926ac2e55" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_users_users" DROP CONSTRAINT "FK_9181fa056d2ce94965926ac2e55"`);
        await queryRunner.query(`ALTER TABLE "projects_users_users" DROP CONSTRAINT "FK_dba863a033479a80f18dc58c7fe"`);
        await queryRunner.query(`ALTER TABLE "Projects" DROP CONSTRAINT "FK_04f00ca29401f8c5c94082060aa"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_ce2eeb5146a99fc267909ac0e12"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_8d19aa5b19c060614e5a312cddc"`);
        await queryRunner.query(`ALTER TABLE "Tasks" DROP CONSTRAINT "FK_d023f6dc92d52956a59c589de87"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_65c56db5a9988b90b0d7245e0f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9181fa056d2ce94965926ac2e5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dba863a033479a80f18dc58c7f"`);
        await queryRunner.query(`DROP TABLE "projects_users_users"`);
        await queryRunner.query(`DROP TABLE "Projects"`);
        await queryRunner.query(`DROP TABLE "Tasks"`);
        await queryRunner.query(`DROP TYPE "public"."Tasks_priority_enum"`);
        await queryRunner.query(`DROP TABLE "Users"`);
        await queryRunner.query(`DROP TYPE "public"."Users_gender_enum"`);
        await queryRunner.query(`DROP TABLE "Roles"`);
        await queryRunner.query(`DROP TYPE "public"."Roles_name_enum"`);
    }

}

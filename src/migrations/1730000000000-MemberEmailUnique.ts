import { MigrationInterface, QueryRunner } from 'typeorm'

export class MemberEmailUnique1730000000000 implements MigrationInterface {
  name = 'MemberEmailUnique1730000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const indexes = (await queryRunner.query(
      `SHOW INDEX FROM member WHERE Column_name = 'email' AND Non_unique = 0`,
    )) as unknown[]
    if (!indexes.length) {
      await queryRunner.query(
        `ALTER TABLE member ADD UNIQUE INDEX IDX_member_email (email)`,
      )
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE member DROP INDEX IDX_member_email`)
  }
}

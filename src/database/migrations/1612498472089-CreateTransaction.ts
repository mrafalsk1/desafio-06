import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTransaction1612498472089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(
            new Table({
                name: 'transactions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()'
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'type',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'value',
                        type: 'decimal',
                        isNullable: false,
                    },
                    {
                        name: 'category_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
                foreignKeys: [
                    {
                        name: 'TransactionCategory',
                        columnNames: ['category_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'categories',
                        onDelete: 'SET NULL',
                        onUpdate: 'CASCADE',
                    }
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
    }

}

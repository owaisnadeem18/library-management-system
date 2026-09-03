/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // 1. Users Table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('email', 100).unique().notNullable();
    table.string('password', 255).notNullable();
    table.enum('role', ['ADMIN', 'LIBRARIAN', 'STUDENT']).defaultTo('STUDENT');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 2. Books Table
  await knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.string('author', 255).notNullable();
    table.string('isbn', 50).unique().notNullable();
    table.string('category', 100).notNullable();
    table.integer('total_copies').defaultTo(1);
    table.integer('available_copies').defaultTo(1);
    table.string('cover_image', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // 3. Borrows Table
  await knex.schema.createTable('borrows', (table) => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().notNullable()
      .references('id').inTable('users').onDelete('CASCADE');
    table.integer('book_id').unsigned().notNullable()
      .references('id').inTable('books').onDelete('CASCADE');
    table.date('issue_date').notNullable();
    table.date('due_date').notNullable();
    table.date('return_date').nullable();
    table.decimal('fine_amount', 8, 2).defaultTo(0.00);
    table.enum('status', ['ISSUED', 'RETURNED']).defaultTo('ISSUED');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  // Order matters due to foreign keys!
  await knex.schema.dropTableIfExists('borrows');
  await knex.schema.dropTableIfExists('books');
  await knex.schema.dropTableIfExists('users');
}
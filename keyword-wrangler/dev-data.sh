#!/usr/bin/env bash
rm -rf /var/tmp/keyword-wrangler.dev.sqlite

`npm bin`/db-migrate up --env dev

echo "DELETE FROM category;" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite
echo "DELETE FROM keyword;" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite
echo "DELETE FROM sqlite_sequence;" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite

echo "INSERT INTO category (name) VALUES ('Vegetable');" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite
echo "INSERT INTO category (name) VALUES ('Utility');" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite

echo "INSERT INTO keyword (value, categoryID) VALUES ('Aubergine', 1);" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite
echo "INSERT INTO keyword (value, categoryID) VALUES ('Onion', 1);" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite
echo "INSERT INTO keyword (value, categoryID) VALUES ('Knife', 2);" | sqlite3 /var/tmp/keyword-wrangler.dev.sqlite

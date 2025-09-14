#!/bin/sh
set -e

npx prisma migrate deploy || npx prisma db push
exec node dist/main.js

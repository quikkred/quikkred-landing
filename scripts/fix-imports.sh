#!/bin/bash

# Fix all imports from @/backend/lib/prisma to @/lib/db in API routes

echo "Fixing import paths in API routes..."

# Find all TypeScript files in app/api directory
find /Users/tivra/Desktop/Development/SriKuberone/app/api -name "*.ts" -type f | while read file; do
    # Check if file contains the old import
    if grep -q "@/backend/lib/prisma" "$file"; then
        echo "Fixing: $file"
        # Replace the import path
        sed -i '' 's|@/backend/lib/prisma|@/lib/db|g' "$file"
    fi
done

echo "Import paths fixed!"
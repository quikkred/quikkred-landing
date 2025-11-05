#!/bin/bash

echo "Fixing import paths in backend modules..."

# Fix imports in backend/lib directory
find /Users/tivra/Desktop/Development/SriKuberone/backend/lib -name "*.ts" -type f | while read file; do
    # Check and fix @/lib/prisma to @/lib/db
    if grep -q "@/lib/prisma" "$file"; then
        echo "Fixing prisma import in: $file"
        sed -i '' 's|@/lib/prisma|@/lib/db|g' "$file"
    fi

    # Fix @/lib/ paths to @/backend/lib/
    if grep -q "@/lib/cache\|@/lib/monitoring\|@/lib/webhooks\|@/lib/auth\|@/lib/security\|@/lib/jobs\|@/lib/ai\|@/lib/storage\|@/lib/support\|@/lib/compliance\|@/lib/payments\|@/lib/communications" "$file"; then
        echo "Fixing backend lib imports in: $file"
        sed -i '' 's|@/lib/cache/|@/backend/lib/cache/|g' "$file"
        sed -i '' 's|@/lib/monitoring/|@/backend/lib/monitoring/|g' "$file"
        sed -i '' 's|@/lib/webhooks/|@/backend/lib/webhooks/|g' "$file"
        sed -i '' 's|@/lib/auth/|@/backend/lib/auth/|g' "$file"
        sed -i '' 's|@/lib/security/|@/backend/lib/security/|g' "$file"
        sed -i '' 's|@/lib/jobs/|@/backend/lib/jobs/|g' "$file"
        sed -i '' 's|@/lib/ai/|@/backend/lib/ai/|g' "$file"
        sed -i '' 's|@/lib/storage/|@/backend/lib/storage/|g' "$file"
        sed -i '' 's|@/lib/support/|@/backend/lib/support/|g' "$file"
        sed -i '' 's|@/lib/compliance/|@/backend/lib/compliance/|g' "$file"
        sed -i '' 's|@/lib/payments/|@/backend/lib/payments/|g' "$file"
        sed -i '' 's|@/lib/communications/|@/backend/lib/communications/|g' "$file"
        sed -i '' 's|@/lib/credit-bureau|@/backend/lib/credit-bureau|g' "$file"
        sed -i '' 's|@/lib/documents/|@/backend/lib/documents/|g' "$file"
    fi
done

echo "Backend import paths fixed!"
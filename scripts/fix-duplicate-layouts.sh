#!/bin/bash

# Script to fix duplicate layout issues in role-based dashboard pages

echo "🔧 Fixing duplicate layout issues..."

# Fix collection-agent page
echo "Fixing collection-agent/page.tsx..."
sed -i '' "s/import CollectionAgentLayout.*$/\/\/ CollectionAgentLayout is already applied by ConditionalLayout based on user role/g" app/collection-agent/page.tsx
sed -i '' "s/<CollectionAgentLayout>/<>/g" app/collection-agent/page.tsx
sed -i '' "s/<\/CollectionAgentLayout>/<\/>/g" app/collection-agent/page.tsx

# Fix finance-manager page
echo "Fixing finance-manager/page.tsx..."
sed -i '' "s/import FinanceManagerLayout.*$/\/\/ FinanceManagerLayout is already applied by ConditionalLayout based on user role/g" app/finance-manager/page.tsx
sed -i '' "s/<FinanceManagerLayout>/<>/g" app/finance-manager/page.tsx
sed -i '' "s/<\/FinanceManagerLayout>/<\/>/g" app/finance-manager/page.tsx

# Fix support-agent page
echo "Fixing support-agent/page.tsx..."
sed -i '' "s/import SupportAgentLayout.*$/\/\/ SupportAgentLayout is already applied by ConditionalLayout based on user role/g" app/support-agent/page.tsx
sed -i '' "s/<SupportAgentLayout>/<>/g" app/support-agent/page.tsx
sed -i '' "s/<\/SupportAgentLayout>/<\/>/g" app/support-agent/page.tsx

# Fix underwriter page
echo "Fixing underwriter/page.tsx..."
sed -i '' "s/import UnderwriterLayout.*$/\/\/ UnderwriterLayout is already applied by ConditionalLayout based on user role/g" app/underwriter/page.tsx
sed -i '' "s/<UnderwriterLayout>/<>/g" app/underwriter/page.tsx
sed -i '' "s/<\/UnderwriterLayout>/<\/>/g" app/underwriter/page.tsx

# Fix risk-analyst page
echo "Fixing risk-analyst/page.tsx..."
sed -i '' "s/import RiskAnalystLayout.*$/\/\/ RiskAnalystLayout is already applied by ConditionalLayout based on user role/g" app/risk-analyst/page.tsx
sed -i '' "s/<RiskAnalystLayout>/<>/g" app/risk-analyst/page.tsx
sed -i '' "s/<\/RiskAnalystLayout>/<\/>/g" app/risk-analyst/page.tsx

# Fix user pages
echo "Fixing user pages..."
for file in app/user/page*.tsx; do
  if [ -f "$file" ]; then
    echo "  Fixing $file..."
    sed -i '' "s/import UserLayout.*$/\/\/ UserLayout is already applied by ConditionalLayout based on user role/g" "$file"
    sed -i '' "s/<UserLayout>/<>/g" "$file"
    sed -i '' "s/<\/UserLayout>/<\/>/g" "$file"
  fi
done

echo "✅ All layout issues fixed!"
echo ""
echo "The ConditionalLayout component automatically applies the correct layout"
echo "based on the user's role, so individual pages don't need to import them."
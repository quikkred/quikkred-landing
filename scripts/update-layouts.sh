


#!/bin/bash

# Script to update all layout files with NotificationCenter

echo "📦 Updating layout files with NotificationCenter..."

layouts=(
  "CollectionAgentLayout"
  "FinanceManagerLayout"
  "RiskAnalystLayout"
  "SupportAgentLayout"
  "AdminLayout"
  "UserLayout"
)

for layout in "${layouts[@]}"; do
  file="components/layouts/${layout}.tsx"

  if [ -f "$file" ]; then
    echo "✅ Updating $layout..."

    # Add import if not exists
    if ! grep -q "NotificationCenter" "$file"; then
      sed -i '' "/import.*useAuth.*from/a\\
import { NotificationCenter } from '@/components/notifications/NotificationCenter';" "$file"
    fi

    # Replace notification button with NotificationCenter
    sed -i '' '/{\/\* Notifications \*\/}/,/<\/button>/c\
              {/* Notifications */}\
              <NotificationCenter />' "$file"

    echo "   Updated $file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo "✨ All layouts updated successfully!"
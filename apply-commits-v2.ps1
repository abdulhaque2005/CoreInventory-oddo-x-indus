git reset 205b80a
git rm --cached stockpilot

git add README.md stockpilot/package.json stockpilot/tsconfig.json stockpilot/next.config.ts stockpilot/tailwind.config.ts stockpilot/postcss.config.mjs stockpilot/components.json stockpilot/.env.local stockpilot/.gitignore
git commit -m "init: project structure, env, and configuration files"

git add stockpilot/public stockpilot/src/app/globals.css stockpilot/src/app/layout.tsx stockpilot/src/app/page.tsx
git commit -m "feat: add root layouts and global styles"

git add stockpilot/src/lib
git commit -m "feat: integrate Supabase client and global store"

git add stockpilot/src/components/ui
git commit -m "feat: add reusable UI primitive components (shadcn)"

git add stockpilot/src/components/providers stockpilot/src/middleware.ts
git commit -m "feat: implement real-time auth providers and route middleware"

git add stockpilot/src/components/layout
git commit -m "feat: add robust sidebar and header layout navigation"

git add "stockpilot/src/app/(auth)"
git commit -m "feat: build secure login and signup authentication flows"

git add "stockpilot/src/app/(dashboard)/page.tsx" stockpilot/src/components/dashboard
git commit -m "feat: implement main dashboard overview and KPI statistics"

git add "stockpilot/src/app/(dashboard)/inventory" "stockpilot/src/app/(dashboard)/products" "stockpilot/src/app/(dashboard)/operations" "stockpilot/src/app/(dashboard)/warehouses" "stockpilot/src/app/(dashboard)/move-history"
git commit -m "feat: add core inventory tracking and warehouse operations"

git add .
git commit -m "feat: add Groq AI forecasting assistant and API endpoints"

git push -f origin main

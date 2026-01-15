# Express to Next.js API Migration Guide

## ✅ What's Been Converted

Your Express server has been successfully converted to Next.js API routes. **Express is NO LONGER NEEDED** - Next.js handles everything natively.

## 📁 New File Structure

### API Routes (replacing Express routes)

```
app/api/
├── content/
│   └── route.ts                    # GET /api/content (already existed)
├── email-admin-new-request/
│   └── route.ts                    # POST /api/email-admin-new-request
├── users/
│   └── route.ts                    # GET /api/users
├── validate-requests/
│   └── route.ts                    # PUT /api/validate-requests
└── auth/
    └── login/
        └── route.ts                # POST /api/auth/login
```

### Database & Models

```
lib/
└── mongodb.ts                      # MongoDB connection utility

models/
└── user.schema.ts                  # User Mongoose model

types/
└── global.d.ts                     # TypeScript global types
```

## 🔄 Route Mapping

| Express Route | Next.js API Route |
|--------------|-------------------|
| `POST /emailAdminNewRequest` | `POST /api/email-admin-new-request` |
| `GET /users` | `GET /api/users` |
| `PUT /validateRequests` | `PUT /api/validate-requests` |
| `POST /auth/login` | `POST /api/auth/login` |

## 📦 Required Dependencies

Install these packages if you haven't already:

```bash
pnpm add mongoose unique-username-generator jsonwebtoken resend bcryptjs
pnpm add -D @types/bcryptjs @types/jsonwebtoken
```

## 🔧 Environment Variables

Create or update `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/your-database-name
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret
JWT_SECRET=your-secret-key-here

# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxx

# CORS (optional, defaults to http://localhost:5173)
ALLOWED_ORIGIN=http://localhost:5173
```

## 🚀 Key Differences from Express

### 1. **No Express Required**
- Next.js has built-in request/response handling
- Use `NextRequest` and `NextResponse` instead of Express `req`/`res`

### 2. **Route Handlers**
Instead of:
```javascript
app.post('/route', async (req, res) => {
  res.json({ data: 'response' })
})
```

Use:
```typescript
// app/api/route/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ data: 'response' })
}
```

### 3. **CORS Configuration**
- CORS is configured in `next.config.mjs` (already done)
- No need for `app.use(cors())` middleware

### 4. **Database Connection**
- Use the connection utility in `lib/mongodb.ts`
- Connection is cached globally to prevent multiple connections
- Call `await connectDB()` at the start of each API route

### 5. **Request Body Parsing**
- Use `await request.json()` instead of `req.body`
- No need for `express.json()` middleware

## 📝 Usage Examples

### Making API Calls from Frontend

```typescript
// Before (Express)
fetch('http://localhost:3001/emailAdminNewRequest', {
  method: 'POST',
  body: JSON.stringify(data)
})

// After (Next.js)
fetch('/api/email-admin-new-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

## 🗑️ What to Remove

You can now delete:
- ❌ `server.js` (if it exists)
- ❌ `app/api/controllers/mailService.js` (replaced by individual route files)
- ❌ Express dependencies from `package.json` (if not used elsewhere)

## ⚠️ Important Notes

1. **Port Configuration**: Next.js runs on port 3000 by default (not 3001). Update your frontend URLs if needed.

2. **Development Server**: 
   - Run `pnpm dev` (not a separate Express server)
   - Next.js handles both frontend and API routes

3. **Production**: 
   - Build with `pnpm build`
   - Start with `pnpm start`
   - No separate server process needed

4. **MongoDB Connection**: The connection utility uses global caching to prevent connection issues during development hot reloads.

## 🔍 Testing Your Routes

Test your API routes:

```bash
# Test email admin request
curl -X POST http://localhost:3000/api/email-admin-new-request \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"test@example.com","whyStatement":"I want to help"}'

# Test get users
curl http://localhost:3000/api/users

# Test validate requests
curl -X PUT http://localhost:3000/api/validate-requests \
  -H "Content-Type: application/json" \
  -d '{"_id":"...","email":"test@example.com"}'
```

## ✅ Next Steps

1. Install missing dependencies
2. Set up `.env.local` with your credentials
3. Test each API route
4. Update frontend code to use new API paths
5. Remove old Express files

---

**Questions?** The Next.js API routes work exactly like Express routes, but are integrated directly into your Next.js application. No separate server needed!


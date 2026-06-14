# AdEarn - Ad Revenue Sharing Platform

A full-stack web application where users earn money by watching ads, and you earn 80% of the ad revenue.

## Features

### For Users
- ✅ Sign up / Login
- ✅ Watch video ads (single or continuous mode)
- ✅ Earn 20% of ad revenue
- ✅ View earnings history
- ✅ Cash out to PayPal or Cash App ($1 minimum)
- ✅ Track earnings in real-time

### For Admin (You)
- ✅ Admin dashboard with KPIs
- ✅ AI Assistant for insights
- ✅ Manage payout requests (approve/deny/note)
- ✅ View all users and their activity
- ✅ Configure video ad payouts
- ✅ Track total earnings, payouts, and pending

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Vite

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Bcrypt (password hashing)

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/matthewlloydwalter-svg/AdEarn.git
cd AdEarn
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials
```env
DATABASE_URL=postgresql://user:password@localhost:5432/adearn
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
PORT=5000
```

5. Start the server
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory
```bash
cd client
```

2. Install dependencies
```bash
npm install
```

3. Start dev server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Admin Access

1. Sign up with your email
2. Go to your PostgreSQL database
3. Update your user record:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```
4. Log back in and access `/admin`

## Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `username` (Unique)
- `role` (user/admin)
- `balance` (Current balance)
- `total_earned` (Lifetime earnings)
- `total_withdrawn` (Lifetime withdrawn)
- `created_at`

### Earnings Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `amount`
- `ad_type` (video, banner, etc)
- `created_at`

### Payout Requests Table
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `amount`
- `payment_method` (paypal/cashapp)
- `payment_details`
- `status` (pending/approved/denied)
- `admin_note`
- `created_at`
- `processed_at`

### App Settings Table
- `id` (Primary Key)
- `setting_key` (video_ad_value)
- `setting_value`
- `updated_at`

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify token

### User
- `GET /api/user/dashboard` - Get dashboard data
- `GET /api/earnings/history` - Get earnings history
- `POST /api/earnings/log` - Log new earning
- `GET /api/payouts/requests` - Get payout requests
- `POST /api/payouts/request` - Create payout request

### Admin
- `GET /api/admin/overview` - Get overview stats
- `GET /api/admin/payouts` - Get payout requests
- `PATCH /api/admin/payouts/:id` - Update payout status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/settings` - Get app settings
- `PUT /api/admin/settings` - Update settings

## Deployment

### Build for Production
```bash
npm run build
cd client && npm run build
```

### Deploy to Heroku
```bash
heroku create adearn-app
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Deploy to Vercel (Frontend Only)
```bash
cd client
vercel
```

## Configuration

### Ad Network Integration

Replace the placeholder ad slots with real ad code:

**Google AdSense Banner:**
```jsx
<div id="google-ad-banner">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
  {/* Your AdSense code */}
</div>
```

**Google Ad Manager Video:**
```jsx
<div id="google-ad-video">
  {/* Your Google Ad Manager code */}
</div>
```

## Monetization Strategy

1. **Ad Revenue:** Earn from banner and video ads displayed to users
2. **Revenue Split:** Users earn 20%, you earn 80%
3. **Scaling:** As you grow, negotiate direct advertiser deals (10-100x higher rates)
4. **Premium Features:** Consider premium features (ad-free, faster payouts, etc)

## Future Enhancements

- [ ] Referral system (earn commission from referred users)
- [ ] Leaderboard (top earners)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Automatic payout processing
- [ ] Mobile app (native iOS/Android)
- [ ] Video ads library/marketplace
- [ ] A/B testing for ad placements

## License

MIT

## Support

For issues or questions, please open a GitHub issue.

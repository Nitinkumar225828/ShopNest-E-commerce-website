# ShopNest Frontend

ShopNest is a modern e-commerce frontend built with React and Vite.

## Features
- Product listing and product details
- Shopping cart and checkout flow
- User login and registration
- Admin dashboard for product and order management
- Toast notifications for user feedback

## Tech Stack
- React
- Vite
- Redux Toolkit
- React Router
- React Toastify

## Run Locally
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
```

## Deployment
This frontend can be deployed on Vercel or Netlify.

### Vercel
1. Connect your GitHub repository
2. Select the frontend folder as the project root
3. Set the build command to:
   ```bash
   npm run build
   ```
4. Set the output directory to:
   ```bash
   dist
   ```

## Environment Variables
If your frontend uses a deployed backend URL, set it in your hosting platform:
```bash
VITE_API_URL=https://your-backend-url.com
```

## Notes
- Keep your backend URL in environment variables for production.
- Do not commit sensitive secrets or local environment files.

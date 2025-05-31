#!/bin/bash

# Create .env file in the frontend directory with Clerk keys
echo "Creating .env file in frontend directory..."
cat > frontend/.env <<EOL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsucGxhbm5vdmEuY28udWsk
CLERK_SECRET_KEY=sk_live_1kDs8NO0JXhlLtjWa4Wil447PDT3cIIN8WLvc1bDRI
REACT_APP_API_URL=http://localhost:5000
EOL

echo "Environment setup complete!"
echo "IMPORTANT: Never commit the .env file to version control."

#!/bin/bash

# Exit on error
set -e

echo "Building Angular application for production..."
ng build --configuration=production

echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment completed successfully!" 
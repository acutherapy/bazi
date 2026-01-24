#!/bin/bash

# Build the app
npm run build

# Navigate into the build output directory
cd build

# Initialize git
git init

# Configure git to use HTTPS
git config --local core.autocrlf false

# Add all files
git add -A

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Add the remote origin
git remote add origin https://github.com/acutherapy/bazi.git

# Create and switch to gh-pages branch
git checkout -b gh-pages

# Force push to the gh-pages branch
git push -f origin gh-pages

# Navigate back
cd .. 
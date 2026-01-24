#!/bin/bash

# Build the app
npm run build

# Navigate into the build output directory
cd build

# Initialize git
git init

# Add all files
git add .

# Commit changes
git commit -m "Deploy to GitHub Pages"

# Force push to the gh-pages branch
git push -f git@github.com:acutherapy/bazi.git main:gh-pages

# Navigate back
cd .. 
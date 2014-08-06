#!/bin/bash
brew install imagemagick
npm install
./node_modules/node-thumbnail/bin/thumb -w 640 images resized_640

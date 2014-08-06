#!/bin/bash
brew install imagemagick
npm install
./node_modules/node-thumbnail/bin/thumb -w 320 images resized_320

#!/bin/bash
set -e

cd scripts

node schema.js
node mockData.js

#!/bin/bash
now=$(date +%s)
sed -i "s/_TIMESTAMP_[^_]*_/_TIMESTAMP_${now}_/" index.html
rm bundle/*_TIMESTAMP_*
cp bundle/index.js bundle/index_TIMESTAMP_${now}_.js

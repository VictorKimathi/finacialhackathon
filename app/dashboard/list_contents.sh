#!/bin/bash
for dir in */; do
    echo "--------------------------------------"
    echo "Entering $dir"
    cd "$dir"
    echo "Contents of $dir:"
    ls -l
    echo "--------------------------------------"
    echo "Exiting $dir"
    cd ..
done

#!/bin/bash
function traverse() {
    for dir in */; do
        echo "--------------------------------------"
        echo "Entering $PWD/$dir"
        cd "$dir"
        echo "Contents of $PWD:"
        ls -l
        traverse  # Call the function recursively for subdirectories
        echo "--------------------------------------"
        echo "Exiting $PWD"
        cd ..
    done
}

traverse

#!/bin/bash

# Function to traverse and list contents
function traverse() {
    for item in *; do
        if [ -d "$item" ]; then
            echo "--------------------------------------"
            echo "Entering $PWD/$item"
            cd "$item" || continue
            echo "Contents of $PWD:"
            ls -l
            traverse  # Call the function recursively for subdirectories
            echo "Exiting $PWD"
            cd .. || continue
            echo "--------------------------------------"
        fi
    done
}

# Start traversal from the current directory
traverse

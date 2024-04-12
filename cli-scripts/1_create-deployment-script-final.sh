#!/bin/bash
# for debug keep this set -x
source env_vars.sh

# Running the provider-services command and capturing its output
output=$(provider-services tx deployment create morpheus-deploy.yml -y --from "$AKASH_KEY_NAME" --home "/Users/aleza/.Akash")

# Parsing values from the command output
DSEQ=$(echo "$output" | jq -r '.logs[0].events[] | select(.type == "akash.v1").attributes[] | select(.key == "dseq") | .value' | head -n 1)
GSEQ=$(echo "$output" | jq -r '.logs[0].events[] | select(.type == "akash.v1").attributes[] | select(.key == "gseq") | .value' | head -n 1)
OSEQ=$(echo "$output" | jq -r '.logs[0].events[] | select(.type == "akash.v1").attributes[] | select(.key == "oseq") | .value' | head -n 1)
OWNER=$(echo "$output" | jq -r '.logs[0].events[] | select(.type == "akash.v1").attributes[] | select(.key == "owner") | .value' | head -n 1)
RECEIVER=$(echo "$output" | jq -r '.logs[0].events[] | select(.type == "coin_received").attributes[] | select(.key == "receiver") | .value' | head -n 1)

# Echoing values once
echo "DSEQ: $DSEQ"
echo "GSEQ: $GSEQ"
echo "OSEQ: $OSEQ"
echo "OWNER: $OWNER"
echo "RECEIVER: $RECEIVER"

# Saving to CSV
echo "DSEQ,GSEQ,OSEQ,OWNER,RECEIVER" > akash_vars.csv
echo "$DSEQ,$GSEQ,$OSEQ,$OWNER,$RECEIVER" >> akash_vars.csv

# Exporting variables for current shell use (optional, depends on use case)
export AKASH_DSEQ="$DSEQ"
export AKASH_GSEQ="$GSEQ"
export AKASH_OSEQ="$OSEQ"
export AKASH_OWNER="$OWNER"
export AKASH_RECEIVER="$RECEIVER"

# Use the extracted values within this script or pass them to another command or script

# If you want to make these variables available in your shell after the script executes, one approach is to write them to a temporary file that you can then source:
echo "export AKASH_DSEQ='$AKASH_DSEQ'" > akash_vars.sh
echo "export AKASH_GSEQ='$AKASH_GSEQ'" >> akash_vars.sh
echo "export AKASH_OSEQ='$AKASH_OSEQ'" >> akash_vars.sh
echo "export AKASH_OWNER='$AKASH_OWNER'" >> akash_vars.sh
echo "export AKASH_RECEIVER='$AKASH_RECEIVER'" >> akash_vars.sh

echo "a CSV file has been created. These variables are available in your shell after the script executed. you can also run 'source akash_vars.sh' to export the variables to your shell."


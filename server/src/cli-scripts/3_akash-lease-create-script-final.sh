#!/bin/bash

# Step 1: Creating a lease
echo "Creating a lease with provider $AKASH_PROVIDER for deployment sequence $AKASH_DSEQ..."
provider-services tx market lease create -y --dseq $AKASH_DSEQ --provider $AKASH_PROVIDER --from $AKASH_KEY_NAME

# Step 2 is informational and does not need parsing for automation.

# Step 3: Sending the manifest and checking for PASS status
echo "Sending manifest..."
send_status=""

while [ "$send_status" != "PASS" ]; do
    send_output=$(provider-services send-manifest morpheus-deploy.yml --dseq $AKASH_DSEQ --provider $AKASH_PROVIDER --from $AKASH_KEY_NAME)
    echo "$send_output"
    send_status=$(echo "$send_output" | grep "status:" | awk '{print $2}')
    if [ "$send_status" != "PASS" ]; then
        echo "Waiting for manifest to be accepted..."
        sleep 5
    fi
done

# Step 4: Parsing lease status for URLs
echo "Fetching lease status for URLs..."
lease_status=$(provider-services lease-status --dseq $AKASH_DSEQ --from $AKASH_KEY_NAME --provider $AKASH_PROVIDER)
echo "Lease Status: $lease_status"
# Extracting and printing URLs
echo "$lease_status" | jq -r '.forwarded_ports.morpheus[] | "\(.name) URL: \(.host):\(.externalPort)"'



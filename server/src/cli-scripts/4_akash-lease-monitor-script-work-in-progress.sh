echo "Monitoring lease events for normal operations..."
# Initial sleep to allow for events to update
# sleep 5

# Loop to monitor lease events until only "Normal" types are seen
while true; do
  events=$(provider-services lease-events --dseq "$AKASH_DSEQ" --provider "$AKASH_PROVIDER" --from "$AKASH_KEY_NAME")
  warning_count=$(echo "$events" | jq -s '[.[] | select(.type == "Warning") | .type] | length')
  
  if [ "$warning_count" -eq 0 ]; then
    echo "All events are normal."
    break
  else
    echo "Found $warning_count warning(s). Waiting for resolution..."
    sleep 10
  fi
done

echo "Proceeding to display lease logs every 30 seconds for 5 minutes..."
# End time calculation for 5 minutes from now
end_time=$(date +%s --date='+5 minutes')

while [[ $(date +%s) -lt $end_time ]]; do
    provider-services lease-logs --dseq "$AKASH_DSEQ" --provider "$AKASH_PROVIDER" --from "$AKASH_KEY_NAME"
    sleep 30
done

echo "Monitoring completed."


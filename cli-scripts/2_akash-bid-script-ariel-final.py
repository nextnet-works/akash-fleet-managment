import json
import sys
import csv

# Read JSON from stdin
json_str = sys.stdin.read()

try:
    # Parse JSON string into a Python dictionary
    data = json.loads(json_str)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
    sys.exit(1)

# Initialize an empty list to store bids
bids_list = []

# Iterate over each bid in the JSON data
for bid in data.get('bids', []):
    # Extract relevant information from each bid
    provider = bid['bid']['bid_id']['provider']
    price_amount = float(bid['bid']['price']['amount'])
    # Append a dictionary of bid data to the bids_list
    bids_list.append({
        'provider': provider,
        'price_amount': price_amount
    })

# Print all providers and their prices
print("All Providers and their Prices:")
for bid in bids_list:
    print(f"Provider: {bid['provider']}, Price: {bid['price_amount']}")

# Find the provider with the lowest price
lowest_price_bid = min(bids_list, key=lambda x: x['price_amount'])

print("\nProvider with the Lowest Price:")
print(f"Provider: {lowest_price_bid['provider']}, Price: {lowest_price_bid['price_amount']}")

# Write bid data to a CSV file
csv_file_name = 'bids_data.csv'
with open(csv_file_name, mode='w', newline='') as file:
    fieldnames = ['provider', 'price_amount']
    writer = csv.DictWriter(file, fieldnames=fieldnames)
    writer.writeheader()
    for bid in bids_list:
        writer.writerow(bid)

print(f"\nData has been written to {csv_file_name}")

# Assuming you want to set the lowest price provider outside the script
# The script can't directly export environment variables to the parent shell
# But you can output the necessary command for the shell to evaluate
print(f"\nRun this command to set the lowest price provider as an environment variable in your shell:")
print(f"export AKASH_PROVIDER='{lowest_price_bid['provider']}'")


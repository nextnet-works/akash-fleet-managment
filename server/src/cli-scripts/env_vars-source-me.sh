# env_vars.sh

export AKASH_KEY_NAME="myWallet-akt"
# Add other necessary environment variables here

export AKASH_ACCOUNT_ADDRESS="$(provider-services keys show $AKASH_KEY_NAME -a)"
export AKASH_NET="https://raw.githubusercontent.com/akash-network/net/main/mainnet"
export AKASH_VERSION="$(curl -s https://api.github.com/repos/akash-network/provider/releases/latest | jq -r '.tag_name')"
export AKASH_CHAIN_ID="$(curl -s "$AKASH_NET/chain-id.txt")"
export AKASH_NODE="$(curl -s "$AKASH_NET/rpc-nodes.txt" | shuf -n 1)"
export AKASH_KEYRING_BACKEND="test"
export AKASH_DSEQ="your_dseq"

export AKASH_GAS=auto
export AKASH_GAS_ADJUSTMENT=1.25
export AKASH_GAS_PRICES=0.025uakt
export AKASH_SIGN_MODE=amino-json

alias akt_lease_create="bash akash-lease-create-script-final.sh"
alias akt_query_bids="provider-services query market bid list --owner=$AKASH_ACCOUNT_ADDRESS --node=$AKASH_NODE --dseq=$AKASH_DSEQ --state=open -o json | python3 akash-bid-script-ariel-final.py"
alias akt_deploy_and_source="bash create-deployment-script-final.sh && source akash_vars.sh"

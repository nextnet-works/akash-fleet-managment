import { useMutation } from "@tanstack/react-query"
import axios from "axios";

type Props = {
    bidId: string;
}

export const DeployButton = ({ bidId }: Props) => {
    const {  isPending, error, mutateAsync: handleBid } = useMutation({
        mutationKey: ["Accept_Deployment"],
        mutationFn: async (e: any) => {
            const response =  await axios.post("http://localhost:3001/deploy/accept", {
                body: { bidId }
            });
            return response.data
        }
    })

    const buttonText = isPending ? "Loading..." : "Accept Bid " + bidId

    if(error) return <div>Error</div>


    return (
        <button disabled={isPending} onClick={handleBid}> {buttonText} </button>
    )
}
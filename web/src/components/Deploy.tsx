import { Bid } from "@/types/bid";
import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios";

export const Deploy = () => {
    const { data : bids, isPending, error, mutateAsync: deploy } = useMutation({
        mutationKey: ["deploy"],
        mutationFn: async (e: any) => {
            const response =  await axios.post<Bid[]>("http://localhost:3001/deploy");
            return response.data
        }
    })

    if(isPending) return <div>Loading...</div>

    if(error) return <div>Error</div>
     

    return (
        <div>
            <button onClick={deploy}>Deploy</button>
          {bids && bids.map((bid) => (
            <div key={bid.bid.bid_id.dseq}>
              <h2>{bid.bid.price.amount}</h2>
            </div>
          ))}
        </div>
    )
}
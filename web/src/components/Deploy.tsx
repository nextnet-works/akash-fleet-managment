import { Bid } from "@/types/bid";
import { useMutation } from "@tanstack/react-query"
import axios from "axios";
import { DeployButton } from "./DeployButton";
import { Deployments } from "./Deployemnts";

export const Deploy = () => {
    const { data : bids, isPending, error, mutateAsync: deploy } = useMutation({
        mutationKey: ["Create_Deployment"],
        mutationFn: async (e: any) => {
            const response =  await axios.post<Bid[]>("http://localhost:3001/deploy/create");
            return response.data
        }
    })



    if(isPending) return <div>Loading...</div>

    if(error) return <div>Error</div>

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "15px", padding: "10px", alignItems: "center"}}>
          <Deployments />
            <button onClick={deploy}>Create Deployment</button>
          {!bids || bids.length === 0 ? <h1>No Bids</h1> : 
          <>
            <h1>Bids</h1>
          {bids.map((bid) => (
            <div key={bid.bid.bid_id.dseq} style={{border: "1px solid black", display: "flex", gap: "15px", padding: "10px", alignItems: "center", width: "fit-content", borderRadius: "10px"}}>
              <h2>{bid.bid.price.amount}</h2>
              <h2>{bid.bid.state}</h2>
              <DeployButton bidId={bid.bid.bid_id.dseq} />
            </div>
          ))}
        </>
        }
        </div>
    )
}
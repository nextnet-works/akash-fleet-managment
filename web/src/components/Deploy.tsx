import axios from "axios";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMutation } from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import { Bid } from "@/types/bid";

import { DeployButton } from "./DeployButton";
import { Deployments } from "./Deployemnts";

export const Deploy = () => {
  const {
    data: bids,
    isPending,
    error,
    mutateAsync: deploy,
  } = useMutation({
    mutationKey: ["Create_Deployment"],
    mutationFn: async (e: any) => {
      const response = await axios.post<Bid[]>("http://localhost:3001/deploy/create");
      return response.data;
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "15px", padding: "10px", alignItems: "center" }}>
      
      <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" defaultValue="@peduarte" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
      <Deployments />
      <button onClick={deploy}>Create Deployment</button>

      {!bids || bids.length === 0 ? (
        <h1>No Bids</h1>
      ) : (
        <>
          <h1>Bids</h1>
          {bids.map((bid) => (
            <div
              key={bid.bid.bid_id.dseq}
              style={{
                border: "1px solid black",
                display: "flex",
                gap: "15px",
                padding: "10px",
                alignItems: "center",
                width: "fit-content",
                borderRadius: "10px",
              }}
            >
              <h2>{bid.bid.price.amount}</h2>
              <h2>{bid.bid.state}</h2>
              <DeployButton bidId={bid.bid.bid_id.dseq} />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import BoxIcon from "@/assets/box.svg?react";
import MountainIcon from "@/assets/mountain.svg?react";
import SantaIcon from "@/assets/santa.svg?react";
import CosmosIcon from "@/assets/cosmos.svg?react";
import BlocksIcon from "@/assets/blocks.svg?react";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex flex-col gap-32 max-w-7xl mx-auto py-12">
      <p className="flex">
        <div>
          <h1>
            Developing infrastructure technologies for the <br />{" "}
            <span className="text-orange-500">
              next generation abstracted clouds
            </span>
          </h1>
        </div>
      </p>
      <p className="flex gap-4 flex-wrap">
        <Card className="bg-blue-700 flex gap-4 p-4 items-center max-w-xl mx-auto">
          <BoxIcon className="h-72 w-72" />
          <div className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Mission & Vision
              </CardTitle>
              <CardDescription className="text-white">
                NextNet. Works is a team of open-source developers focused on
                building orchestration tools for truly decentralized clouds.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-200 h-full">
              We believe the networks of the future will need to overcome
              current cloud barriers with an open-source and decentralized
              structure.
            </CardContent>
          </div>
        </Card>
        <Card className="bg-red-50 flex gap-4 p-4 items-center max-w-xl mx-auto">
          <div className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-red-500">Join us.</CardTitle>
              <CardDescription>
                Are you ready to shape the future of cloud technology?
              </CardDescription>
            </CardHeader>
            <CardContent>
              Whether you're an innovator looking to join a dynamic team or an
              investor eager to support groundbreaking projects, we invite you
              to be part of our journey. Explore career opportunities, discover
              our cutting-edge solutions, and learn how you can contribute to
              our mission.
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="w-36 ml-auto">
                Lets Go
              </Button>
            </CardFooter>
          </div>
          <MountainIcon className="h-72 w-72" />
        </Card>
      </p>
      <div className="text-center flex flex-col gap-24">
        <div>
          <h2 className="text-orange-500">Our Projects</h2>
          <h4>This is our lead projects</h4>
        </div>
        <div className="flex justify-around gap-4">
          <div className="flex flex-col gap-4 items-center w-72">
            <SantaIcon className="h-24 w-24 ml-5" />
            <h4>Santa Cloud</h4>
          </div>
          <div className="flex flex-col gap-4 items-center w-72">
            <CosmosIcon className="h-24 w-24" />
            <h4>Cosmos Validator </h4>
          </div>
          <div className="flex flex-col gap-4 items-center w-72">
            <BlocksIcon className="h-24 w-24" />
            <h4>Cloud & Blockchain services</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

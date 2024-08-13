import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";
import BoxIcon from "@/assets/icons/box.svg?react";
import MountainIcon from "@/assets/icons/mountain.svg?react";
import SantaIcon from "@/assets/companies/santa.svg?react";
import CosmosIcon from "@/assets/companies/cosmos.svg?react";
import BlocksIcon from "@/assets/icons/blocks.svg?react";
import { Button } from "@/components/ui/button";
import SantaCloudsLogo from "@/assets/logos/clouds.svg?react";

import { useRef } from "react";
import { EmailForm } from "@/components/home/EmailForm";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const fullNameInputRef = useRef<HTMLInputElement>(null);

  const scrollToContact = () => {
    fullNameInputRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => fullNameInputRef.current?.focus(), 1000); // Delay focus to ensure scroll is complete
  };

  return (
    <div className="flex flex-col gap-64 max-w-7xl mx-auto py-12">
      <p className="flex  justify-center">
        <div className="flex gap-4 flex-wrap justify-center items-center">
          <h1 className="max-w-3xl">
            Developing infrastructure technologies for the <br />{" "}
            <span className="text-orange-500">
              next generation abstracted clouds
            </span>
          </h1>
          <SantaCloudsLogo className="h-96 w-96 max-w-[90dvw]" />
        </div>
      </p>
      <p className="flex gap-4 flex-wrap">
        <Card className="bg-blue-700 flex gap-4 p-4 items-center max-w-xl mx-auto ">
          <BoxIcon className="h-72 w-72 hidden lg:block" />
          <div className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-orange-500">
                Mission & Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-200 h-full">
              <p>
                NextNet. Works is a team of open-source developers focused on
                building orchestration tools for truly decentralized clouds.
              </p>
              <p>
                We believe the networks of the future will need to overcome
                current cloud barriers with an open-source and decentralized
                structure.
              </p>
            </CardContent>
          </div>
        </Card>
        <Card className="bg-red-50 flex gap-4 p-4 items-center max-w-xl mx-auto ">
          <div className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-red-500">Join Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800">
                Are you ready to shape the future of cloud technology? Whether
                you're an innovator looking to join a dynamic team or an
                investor eager to support groundbreaking projects, we invite you
                to be part of our journey.
              </p>
              <p className="text-gray-800">
                Explore career opportunities, discover our cutting-edge
                solutions, and learn how you can contribute to our mission.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                size="lg"
                className="w-36 ml-auto"
                onClick={scrollToContact}
              >
                Let's Go
              </Button>
            </CardFooter>
          </div>
          <MountainIcon className="w-[480px] h-auto hidden lg:block" />
        </Card>
      </p>
      <p className="text-center flex flex-col gap-24">
        <div>
          <h2 className="text-orange-500">Our Projects</h2>
          <h4>This is our lead projects</h4>
        </div>
        <div className="flex justify-around gap-4">
          <div className="flex flex-col gap-4 items-center max-w-72 flex-1">
            <SantaIcon className="max-h-24 max-w-24 ml-5" />
            <h4>Santa Cloud pink</h4>
          </div>
          <div className="flex flex-col gap-4 items-center max-w-72 flex-1">
            <CosmosIcon className="max-h-24 max-w-24" />
            <h4>Cosmos Validator </h4>
          </div>
          <div className="flex flex-col gap-4 items-center max-w-72 flex-1">
            <BlocksIcon className="max-h-24 max-w-24" />
            <h4>Cloud & Blockchain services</h4>
          </div>
        </div>
      </p>
      <EmailForm ref={fullNameInputRef} />
    </div>
  );
}

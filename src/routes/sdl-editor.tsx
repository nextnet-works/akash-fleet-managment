import { createFileRoute, useNavigate } from "@tanstack/react-router";
import YamlEditor from "@focus-reactive/react-yaml";
import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { sdls } from "@/lib/consts";
import { ToastAction } from "@/components/ui/toast";
import { GenericYaml } from "@/akash-js/lib/yaml";

export const Route = createFileRoute("/sdl-editor")({
  component: SdlEditor,
});

function SdlEditor() {
  const [yaml, setYaml] = useState(sdls[0].file);
  const navigate = useNavigate();
  const { toast } = useToast();
  const actions = useRef<{
    replaceValue: ({ json }: { json: GenericYaml }) => void;
  }>(null);

  const handleChange = ({ json }: { json: unknown; text: string }) =>
    setYaml(json as GenericYaml);

  const handleSave = () => {
    localStorage.setItem("sdl", JSON.stringify(yaml));
    toast({
      title: "Saved",
      description: "SDL saved successfully",
      action: (
        <ToastAction
          altText="navigate to deploy page"
          onClick={() => navigate({ to: "/" })}
        >
          Deploy
        </ToastAction>
      ),
    });
  };

  const handleError = (error: unknown) => {
    if (error) {
      toast({
        title: "Error",
        description: "Invalid YAML",
      });
    }
  };

  const handleReset = () => {
    setYaml(sdls[0].file);
    if (!actions.current) return;
    actions.current.replaceValue({ json: sdls[0].file });
  };
  return (
    <Card className="w-full max-w-2xl mx-auto h-full min-h-2xl">
      <CardHeader>
        <CardTitle>SDL Editor</CardTitle>
        <CardDescription>Edit the SDL</CardDescription>
      </CardHeader>
      <CardContent>
        <YamlEditor
          json={yaml}
          onChange={handleChange}
          // @ts-expect-error actions is not a prop
          ref={actions}
          onError={handleError}
        />
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="outline" className="w-full" onClick={handleReset}>
          Reset
        </Button>
        <Button className="w-full" onClick={handleSave}>
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}

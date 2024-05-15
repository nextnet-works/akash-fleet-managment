import { createFileRoute } from "@tanstack/react-router";
import YamlEditor from "@focus-reactive/react-yaml";
import { Loader } from "@/components/Loader";
import { ErrorUI } from "@/components/Error";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import { queryKeys } from "@/lib/consts";
// import * as YAML from "yaml";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export const Route = createFileRoute("/yaml")({
  component: Yaml,
  loader: Loader,
  errorComponent: ErrorUI,
});

type JsonProps = {
  json: Record<string, any>;
  text: string;
};

function Yaml() {
  const [json, setJson] = useState<JsonProps["json"]>();
  const handleChange = ({ json }: JsonProps) => {
    debugger;
    setJson(json);
  };

  const { data, isPending, error } = useQuery({
    queryKey: [queryKeys.sdl],
    queryFn: async () => {
      const { data, error } = await db.from("sdl").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleSelect = (value: string) => {
    if (!data) return;
    const item = data.find((item) => item.id === parseInt(value));
    if (!item) return;
    debugger;

    setJson({ json: item.yml_json } as Record<string, any>);
  };

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return <ErrorUI message={error.message} />;
  }

  return (
    <div className="p-4 w-full flex flex-col items-center gap-4 max-w-96">
      <h1 className="text-2xl font-bold">YAML Editor</h1>
      <Select onValueChange={handleSelect}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select TShirt" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Select TShirt</SelectLabel>
            <SelectItem value="0">Select TShirt</SelectItem>
            {data.map((item) => (
              <SelectItem key={item.id} value={item.id.toString()}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <YamlEditor json={json} onChange={handleChange} />
      <Input />
      <Button className="w-full">Save</Button>
    </div>
  );
}

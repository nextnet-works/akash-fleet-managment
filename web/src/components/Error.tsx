import { ServerCrashIcon } from "lucide-react";

type ErrorUIProps = {
  message?: string;
};

export const ErrorUI = ({ message }: ErrorUIProps) => (
  <div className="m-auto flex flex-col items-center justify-center gap-8">
    <h1 className="text-4xl">
      {message ?? "Something went wrong. Please try again later."}
    </h1>{" "}
    <ServerCrashIcon size={64} />{" "}
  </div>
);

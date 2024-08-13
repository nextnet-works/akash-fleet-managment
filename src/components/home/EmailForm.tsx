import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { forwardRef } from "react";

const formSchema = z.object({
  "full-name": z.string().min(3),
  "phone-number": z.string().min(1),
  email: z.string().email(),
});

export const EmailForm = forwardRef((_, ref) => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Membership Request",
      description: (
        <div>
          Welcome aboard "{values["full-name"]}"! <br />
          You will be contacted soon at - {values.email}
        </div>
      ),
      variant: "success",
    });
  }

  return (
    <p className="text-center flex flex-col gap-24">
      <div>
        <h2 className="text-blue-500">Contact Us</h2>
        <h4>
          Contact us to Join our journey of changing the way look at clouds
        </h4>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-between gap-4"
        >
          <FormField
            control={form.control}
            name="full-name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="Full name"
                    type="text"
                    {...field}
                    ref={ref as React.LegacyRef<HTMLInputElement>}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone-number"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Phone number" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="flex-1" type="submit">
            Send
          </Button>
        </form>
      </Form>
    </p>
  );
});

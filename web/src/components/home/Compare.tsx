import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { DollarSignIcon } from "lucide-react";

export function Compare() {
  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg max-w-2xl mx-auto flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>TShirt Name</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">GCP</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">AWS</div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">Digital Ocean</div>
              </TableHead>
              <TableHead className="bg-gray-100 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="h-6 w-6" />
                  Our Platform
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">
                Big{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  (4)
                </span>
              </TableCell>
              <TableCell>$0.15/hour</TableCell>
              <TableCell>$0.18/hour</TableCell>
              <TableCell>$0.12/hour</TableCell>
              <TableCell className="bg-gray-100 dark:bg-gray-800 rounded-md">
                $0.10/hour
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                Small{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  (10)
                </span>
              </TableCell>
              <TableCell>$0.05/hour</TableCell>
              <TableCell>$0.06/hour</TableCell>
              <TableCell>$0.04/hour</TableCell>
              <TableCell className="bg-gray-100 dark:bg-gray-800 rounded-md">
                $0.03/hour
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                GPU Intensive{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  (2)
                </span>
              </TableCell>
              <TableCell>$0.45/hour</TableCell>
              <TableCell>$0.50/hour</TableCell>
              <TableCell>$0.40/hour</TableCell>
              <TableCell className="bg-gray-100 dark:bg-gray-800 rounded-md">
                $0.35/hour
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">
                High Memory{" "}
                <span className="text-gray-500 dark:text-gray-400 font-normal">
                  (6)
                </span>
              </TableCell>
              <TableCell>$0.25/hour</TableCell>
              <TableCell>$0.30/hour</TableCell>
              <TableCell>$0.20/hour</TableCell>
              <TableCell className="bg-gray-100 dark:bg-gray-800 rounded-md">
                $0.18/hour
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Total: 22
          </p>
          <p className="font-bold">$100.00</p>
          <p className="font-bold">$120.00</p>
          <p className="font-bold">$80.00</p>
          <p className="font-bold">$90.00</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";

import { Search, AlertCircle } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  EmptyState,
  Input,
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui";

export function ComponentShowcase() {
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("");
  const [checked, setChecked] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          UI Components Showcase
        </h1>
        <p className="text-gray-600">Preview of all available UI components</p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Different button variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Button disabled>Disabled</Button>
            <Button variant="primary">
              <Search className="w-4 h-4 mr-2" />
              With Icon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs & Selects</CardTitle>
          <CardDescription>Form input components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            helperText="We'll never share your email"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error="Password is too short"
          />
          <Select
            label="Choose an option"
            placeholder="Select..."
            value={selectValue}
            onChange={setSelectValue}
            options={[
              { value: "1", label: "Option 1" },
              { value: "2", label: "Option 2" },
              { value: "3", label: "Option 3" },
            ]}
            helperText="Select one option from the list"
          />
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Status and category indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Data table component</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Bands</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">iPhone 15 Pro</TableCell>
                <TableCell>Apple</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell className="text-right">24</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Galaxy S24</TableCell>
                <TableCell>Samsung</TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell className="text-right">28</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Pixel 8</TableCell>
                <TableCell>Google</TableCell>
                <TableCell>
                  <Badge variant="warning">Pending</Badge>
                </TableCell>
                <TableCell className="text-right">22</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Checkbox */}
      <Card>
        <CardHeader>
          <CardTitle>Checkboxes</CardTitle>
          <CardDescription>Checkbox components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Checkbox
            label="Accept terms and conditions"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <Checkbox label="Subscribe to newsletter" />
          <Checkbox label="Disabled option" disabled />
        </CardContent>
      </Card>
      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Spinner components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <Spinner size="sm" />
              <p className="text-sm text-gray-500 mt-2">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="md" />
              <p className="text-sm text-gray-500 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <Spinner size="lg" />
              <p className="text-sm text-gray-500 mt-2">Large</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
          <CardDescription>When there's no data to display</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={AlertCircle}
            title="No devices found"
            description="Try adjusting your search filters or add a new device"
            action={
              <Button variant="primary">
                <Search className="w-4 h-4 mr-2" />
                Search Again
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

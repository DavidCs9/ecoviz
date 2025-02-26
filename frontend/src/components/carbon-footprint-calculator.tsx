"use client";

import { useState } from "react";
import { LeafIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

export function CarbonFootprintCalculatorComponent() {
  const [energyUsage, setEnergyUsage] = useState<number[]>([500]);
  const [waste, setWaste] = useState<number[]>([50]);

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-green-50 to-green-100">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-green-800">
          Carbon Footprint Calculator
        </CardTitle>
        <CardDescription className="text-green-600">
          Estimate your environmental impact
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="transportation"
            className="text-sm font-medium text-green-700"
          >
            Transportation
          </Label>
          <Select>
            <SelectTrigger
              id="transportation"
              className="border-green-300 focus:ring-green-500"
            >
              <SelectValue placeholder="Select your primary mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="public-transit">Public Transit</SelectItem>
              <SelectItem value="bike-walk">Bike/Walk</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="energy-usage"
            className="text-sm font-medium text-green-700"
          >
            Energy Usage (kWh per month)
          </Label>
          <Slider
            id="energy-usage"
            min={0}
            max={1000}
            step={10}
            value={energyUsage}
            onValueChange={setEnergyUsage}
            className="[&_[role=slider]]:bg-green-600"
          />
          <p className="text-sm text-green-600 text-right">{energyUsage} kWh</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="diet" className="text-sm font-medium text-green-700">
            Diet
          </Label>
          <Select>
            <SelectTrigger
              id="diet"
              className="border-green-300 focus:ring-green-500"
            >
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meat-heavy">Meat-heavy</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="waste" className="text-sm font-medium text-green-700">
            Waste (lbs per week)
          </Label>
          <Slider
            id="waste"
            min={0}
            max={100}
            step={1}
            value={waste}
            onValueChange={setWaste}
            className="[&_[role=slider]]:bg-green-600"
          />
          <p className="text-sm text-green-600 text-right">{waste} lbs</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
          <LeafIcon className="w-4 h-4 mr-2" />
          Calculate
        </Button>
      </CardFooter>
    </Card>
  );
}

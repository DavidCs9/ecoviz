import React, { useState } from "react";
import axios from "axios";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

export interface CarbonFootprintResults {
  carbonFootprint: number;
  housing: number;
  transportation: number;
  food: number;
  consumption: number;
}

const API_URL = import.meta.env.VITE_API_URL;

const EmailResultsButton: React.FC<{ results: CarbonFootprintResults }> = ({
  results,
}) => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSendEmail = async () => {
    setIsSending(true);
    setError("");

    try {
      await axios.post(`${API_URL}/send-mail`, {
        email,
        results,
      });
      toast({
        title: "Email sent!",
        description: "Check your inbox for your carbon footprint results.",
        variant: "success",
      });
    } catch (error) {
      setError("Failed to send email. Please try again.");
    } finally {
      setIsSending(false);
      setEmail("");
    }
  };

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-col gap-3">
      <Label>Want to receive an email with your results?</Label>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <Button
        onClick={handleSendEmail}
        disabled={isSending || !isEmailValid(email)}
      >
        {isSending ? "Sending..." : "Email Results"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default EmailResultsButton;

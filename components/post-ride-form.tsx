"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { createRideAction, initialPostRideState } from "@/app/actions";
import { rideSchema, type RideFormValues } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PostRideForm() {
  const [state, formAction, isPending] = useActionState(createRideAction, initialPostRideState);
  const [clientError, setClientError] = React.useState("");
  const form = useForm<RideFormValues>({
    resolver: zodResolver(rideSchema),
    defaultValues: {
      source: "",
      destination: "",
      date: "",
      time: "",
      seatsAvailable: 1,
      notes: "",
    },
  });

  function onSubmit(values: RideFormValues) {
    setClientError("");
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.set(key, String(value ?? "")));
    React.startTransition(() => formAction(formData));
  }

  function onInvalid() {
    setClientError("Please check the form fields before posting.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a Ride</CardTitle>
        <CardDescription>Share your route with classmates who are going the same way.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                aria-invalid={Boolean(form.formState.errors.source || state.errors?.source)}
                aria-describedby="source-error"
                placeholder="North Campus Gate"
                {...form.register("source")}
              />
              <FieldError id="source-error" message={form.formState.errors.source?.message ?? state.errors?.source} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                aria-invalid={Boolean(form.formState.errors.destination || state.errors?.destination)}
                aria-describedby="destination-error"
                placeholder="Metro Station"
                {...form.register("destination")}
              />
              <FieldError
                id="destination-error"
                message={form.formState.errors.destination?.message ?? state.errors?.destination}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                aria-invalid={Boolean(form.formState.errors.date || state.errors?.date)}
                aria-describedby="date-error"
                {...form.register("date")}
              />
              <FieldError id="date-error" message={form.formState.errors.date?.message ?? state.errors?.date} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                aria-invalid={Boolean(form.formState.errors.time || state.errors?.time)}
                aria-describedby="time-error"
                {...form.register("time")}
              />
              <FieldError id="time-error" message={form.formState.errors.time?.message ?? state.errors?.time} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seatsAvailable">Available seats</Label>
              <Input
                id="seatsAvailable"
                type="number"
                min={1}
                max={6}
                aria-invalid={Boolean(form.formState.errors.seatsAvailable || state.errors?.seatsAvailable)}
                aria-describedby="seats-error"
                {...form.register("seatsAvailable", { valueAsNumber: true })}
              />
              <FieldError
                id="seats-error"
                message={form.formState.errors.seatsAvailable?.message ?? state.errors?.seatsAvailable}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                aria-invalid={Boolean(form.formState.errors.notes || state.errors?.notes)}
                aria-describedby="notes-error"
                placeholder="Pickup details, luggage space, or timing notes"
                {...form.register("notes")}
              />
              <FieldError id="notes-error" message={form.formState.errors.notes?.message ?? state.errors?.notes} />
            </div>
          </div>

          {clientError ? <p className="text-sm text-destructive">{clientError}</p> : null}
          {state.message ? (
            <p
              className={state.status === "success" ? "text-sm text-primary" : "text-sm text-destructive"}
              role={state.status === "error" ? "alert" : "status"}
            >
              {state.message}
            </p>
          ) : null}

          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            {isPending ? "Posting..." : "Post Ride"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="text-sm text-destructive" role="alert">
      {message}
    </p>
  ) : null;
}

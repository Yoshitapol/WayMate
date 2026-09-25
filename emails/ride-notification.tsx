import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export function RideNotificationEmail({ name, message }: { name: string; message: string }) {
  return (
    <Html>
      <Head />
      <Preview>WayMate ride update</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f7f7f7", padding: "24px" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "24px", maxWidth: "520px" }}>
          <Heading style={{ fontSize: "22px" }}>WayMate</Heading>
          <Section>
            <Text>Hello {name},</Text>
            <Text>{message}</Text>
            <Text style={{ color: "#666666" }}>Student carpool made simpler.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

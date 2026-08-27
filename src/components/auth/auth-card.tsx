"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
};

/** Khung dùng chung cho cả login và register — tránh lặp markup. */
export function AuthCard({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerHref,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        {footerText}{" "}
        <Link href={footerHref} className="ml-1 font-medium text-foreground underline">
          {footerLinkText}
        </Link>
      </CardFooter>
    </Card>
  );
}

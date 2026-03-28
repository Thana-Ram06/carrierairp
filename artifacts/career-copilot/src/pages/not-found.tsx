import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <Layout className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-serif text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">This page got lost in the system.</p>
        <Link href="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    </Layout>
  );
}

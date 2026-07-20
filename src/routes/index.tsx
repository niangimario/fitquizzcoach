import { createFileRoute } from "@tanstack/react-router";
import { Quiz } from "@/components/quiz/Quiz";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return <Quiz />;
}

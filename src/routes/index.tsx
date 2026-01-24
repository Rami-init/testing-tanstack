import { createFileRoute } from "@tanstack/react-router";
import Page from "@/features/home/Page";

export const Route = createFileRoute("/")({ component: Page });
